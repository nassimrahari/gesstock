const multer = require('multer');
const path = require('path');

// Configure multer storage
const storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'uploads/'); // Spécifiez le répertoire pour enregistrer les images
    },
    filename: (req, file, cb) => {
        cb(null, Date.now() + '_' + file.originalname); // Utiliser un timestamp pour éviter les collisions de nom
    }
});

// Créer l'instance multer
const upload = multer({ storage });

module.exports = upload;