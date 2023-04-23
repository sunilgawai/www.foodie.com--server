import jwt, { JwtPayload } from "jsonwebtoken";
import { JWT_TOKEN_SECRET, REFRESH_TOKEN_SECRET } from "../../config";
import { RefreshToken } from "../models";

class JwtService {
    static sign(payload: JwtPayload, expiresIn = '1d', jwt_secret: string = JWT_TOKEN_SECRET!) {
        return jwt.sign(payload, jwt_secret, { expiresIn: expiresIn });
    }

    static verify(token: string, secret: string = JWT_TOKEN_SECRET!) {
        return jwt.verify(token, secret)
        // return jwt.verify(jwt_token,JWT_TOKEN_SECRET,{})
    }

    static async database_whitelisting(payload: JwtPayload, expiresIn: string = '1y', refresh_token_secret = REFRESH_TOKEN_SECRET) {
        let refresh_token = this.sign({
            _id: payload._id,
            email: payload.email,
            role: payload.role
        }, expiresIn, refresh_token_secret);

        await RefreshToken.create({ refresh_token })
            .then(() => console.log('whitelisted'))
            .catch((err) => console.log('failed to whitelist', err))
        return { refresh_token }
    }
}

export default JwtService;