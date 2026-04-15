import multer from "multer";
import fs from "fs";
import path from "path";

const uploadDir = "uploads/";

if (!fs.existsSync(uploadDir)) {
    fs.mkdirSync(uploadDir, { recursive: true });
}

const upload = multer({
    storage : multer.diskStorage({
        destination : (req, file, cb) => {
            cb(null, uploadDir);
        },
        filename : (req, file, cb) => {
            const uniqueSuffix = Date.now() + "-" + Math.round(Math.random() * 1E9);
            cb(null, uniqueSuffix + path.extname(file.originalname));
        }
    })
});

export default upload;
