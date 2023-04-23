class CustomErrorHandler extends Error {
    public status: number;
    public message: string

    constructor(status: number, message: string) {
        super();
        this.status = status;
        this.message = message;
    }

    static serverError(message = 'Internal Serve Error') {
        return new CustomErrorHandler(500, message);
    }

    static alreadyExists(message: string) {
        return new CustomErrorHandler(422, message);
    }

    static fileNotFound(message: string) {
        return new CustomErrorHandler(404, message);
    }

    static notFound(message: string) {
        return new CustomErrorHandler(404, message);
    }

    static wrongCredentials(message: string = "wrongCredentials") {
        return new CustomErrorHandler(401, message);
    }

    static unAuthorized(message: string = "unAuthorized") {
        return new CustomErrorHandler(401, message);
    }

}
// unAuthorized 401 -> wrongCred 401 -> alreadyExists 422 -> notFound 404 -> serverError 500
export default CustomErrorHandler;