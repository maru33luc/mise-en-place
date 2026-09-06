const express = require('express');
const router = express.Router();
const PrepListController = require('../controllers/prepListController');
const { authMiddleware } = require('../middleware/auth');

router.use(authMiddleware);

router.get('/',           PrepListController.getAll);
router.post('/',          PrepListController.create);
router.put('/:id',        PrepListController.update);
router.delete('/done',    PrepListController.clearDone);
router.delete('/:id',     PrepListController.delete);

module.exports = router;
