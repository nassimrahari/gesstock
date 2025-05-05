
const express = require('express');
const router = express.Router();
const controller = require('../controllers/productController');

const upload = require('../utils/upload');
// Routes
router.get('/', controller.getAll.bind(controller));

router.post('/',
    upload.fields([
{ name: 'image', maxCount: 1 },

    ]), controller.create.bind(controller)
);

router.get('/:id', controller.getById.bind(controller));

router.put('/:id',
    upload.fields([
{ name: 'image', maxCount: 1 },

    ]), controller.update.bind(controller)
);

router.put('/:id', controller.update.bind(controller));
router.delete('/:id', controller.delete.bind(controller));

module.exports = router;
        