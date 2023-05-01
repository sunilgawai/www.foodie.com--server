import multer from "multer";
import path from "path";

const storage = multer.diskStorage({
    destination(req, file, callback) {
        callback(null, 'public')
    },
    filename(req, file, callback) {
        let fileName = `${new Date().getTime().toString()}${path.extname(file.originalname)}`;
        callback(null, fileName)
    }
})

const handleMultipartData = multer({
    storage: storage,
    limits: {
        fileSize: 1000000 * 5
    }
});

export default handleMultipartData;