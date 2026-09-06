const PrepList = require('../models/prepList');

const PrepListController = {
  getAll(req, res) {
    const tasks = PrepList.getAll(req.user.id);
    res.json({ success: true, data: tasks });
  },

  create(req, res) {
    const { name, ingredient, quantity, unit, technique, estimatedMinutes, priority, notes } = req.body;
    if (!name) return res.status(400).json({ success: false, message: 'Task name is required' });
    const task = PrepList.create(req.user.id, { name, ingredient, quantity, unit, technique, estimatedMinutes, priority, notes });
    res.status(201).json({ success: true, data: task });
  },

  update(req, res) {
    const id = parseInt(req.params.id, 10);
    const task = PrepList.update(req.user.id, id, req.body);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  },

  delete(req, res) {
    const id = parseInt(req.params.id, 10);
    const task = PrepList.delete(req.user.id, id);
    if (!task) return res.status(404).json({ success: false, message: 'Task not found' });
    res.json({ success: true, data: task });
  },

  clearDone(req, res) {
    const tasks = PrepList.clearDone(req.user.id);
    res.json({ success: true, data: tasks });
  },
};

module.exports = PrepListController;
