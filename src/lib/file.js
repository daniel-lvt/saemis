const multer = require('multer');
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, './files');
    },
    filename: async(req, file, cb) => {
        const date = new Date();
        const carrera = req.user.Carrera_idCarrera;
        cb(null, carrera + '-' + file.originalname);
    }
});
const upload = multer({ storage });

module.exports = {
    upload
}