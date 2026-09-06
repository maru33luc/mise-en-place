const Menu = require('../models/menu');

const MenuController = {
  getAll(req, res) {
    const menus = Menu.getAll(req.user.id);
    res.json({ success: true, data: menus });
  },

  getByDate(req, res) {
    const { date } = req.params;
    const menu = Menu.getByDate(req.user.id, date);
    if (!menu) return res.status(404).json({ success: false, message: 'No menu for this date' });
    res.json({ success: true, data: menu });
  },

  upsert(req, res) {
    const { date } = req.params;
    const menu = Menu.upsert(req.user.id, date, req.body);
    res.json({ success: true, data: menu });
  },

  delete(req, res) {
    const { date } = req.params;
    const menu = Menu.delete(req.user.id, date);
    if (!menu) return res.status(404).json({ success: false, message: 'No menu for this date' });
    res.json({ success: true, data: menu });
  },
};

module.exports = MenuController;
