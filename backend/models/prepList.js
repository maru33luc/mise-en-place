/** In-memory Prep List store — keyed by userId */
const prepTasks = {};
let nextId = 1;

class PrepList {
  static _store(userId) {
    if (!prepTasks[userId]) prepTasks[userId] = [];
    return prepTasks[userId];
  }

  static getAll(userId) {
    return PrepList._store(userId);
  }

  static getById(userId, id) {
    return PrepList._store(userId).find(t => t.id === id) || null;
  }

  static create(userId, data) {
    const task = {
      id: nextId++,
      userId,
      name: data.name,
      ingredient: data.ingredient || '',
      quantity: data.quantity || '',
      unit: data.unit || '',
      technique: data.technique || '',
      estimatedMinutes: data.estimatedMinutes || 0,
      priority: data.priority || 'medium',   // low | medium | high
      status: 'pending',                      // pending | in-progress | done
      elapsedSeconds: 0,
      notes: data.notes || '',
      createdAt: new Date().toISOString(),
    };
    PrepList._store(userId).push(task);
    return task;
  }

  static update(userId, id, data) {
    const task = PrepList._store(userId).find(t => t.id === id);
    if (!task) return null;
    Object.assign(task, data);
    task.updatedAt = new Date().toISOString();
    return task;
  }

  static delete(userId, id) {
    const store = PrepList._store(userId);
    const idx = store.findIndex(t => t.id === id);
    if (idx === -1) return null;
    return store.splice(idx, 1)[0];
  }

  static clearDone(userId) {
    prepTasks[userId] = PrepList._store(userId).filter(t => t.status !== 'done');
    return prepTasks[userId];
  }
}

module.exports = PrepList;
