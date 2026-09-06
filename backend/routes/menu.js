const express = require('express');
const router = express.Router();
const MenuController = require('../controllers/menuController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',           MenuController.getAll);
router.get('/:date',      MenuController.getByDate);
router.put('/:date',      MenuController.upsert);
router.delete('/:date',   MenuController.delete);

module.exports = router;
