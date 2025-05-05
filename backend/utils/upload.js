const multer = require('multer');
const fs = require('fs');
const path = require('path');

// Créez les répertoires de stockage
const createStorageFolders = () => {
  const folders = ['./uploads', './uploads/photos', './uploads/documents', './uploads/others'];
  
  folders.forEach(folder => {
    if (!fs.existsSync(folder)) {
      fs.mkdirSync(folder, { recursive: true });
    }
  });
};

// Exécutez la création des dossiers
createStorageFolders();

// Configuration du stockage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    let dest = './uploads/';
    
    // Déterminer le dossier de destination en fonction du champ de fichier
    // if (file.fieldname === 'photo') {
    //   dest = './uploads/photos/';
    // } else if (file.fieldname === 'doc') {
    //   dest = './uploads/documents/';
    // }
    
    cb(null, dest);
  },
  filename: function (req, file, cb) {
    // Générer un nom de fichier unique
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const ext = path.extname(file.originalname);
    cb(null, file.fieldname + '-' + uniqueSuffix + ext);
  }
});

// Filtre de types de fichiers
const fileFilter = (req, file, cb) => {
  // Accepter tous les fichiers par défaut, vous pourriez ajouter des restrictions ici
  cb(null, true);
};

// Créer l'instance de téléchargement
const upload = multer({ 
  storage: storage,
  fileFilter: fileFilter,
  limits: {
    fileSize: 10 * 1024 * 1024 // Limite à 10MB par défaut
  }
});

module.exports = upload;