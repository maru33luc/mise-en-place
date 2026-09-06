/** In-memory Daily Menu store — keyed by userId */
const menus = {};
let nextId = 1;

class Menu {
  static _store(userId) {
    if (!menus[userId]) menus[userId] = [];
    return menus[userId];
  }

  static getAll(userId) {
    return Menu._store(userId);
  }

  static getByDate(userId, date) {
    return Menu._store(userId).find(m => m.date === date) || null;
  }

  static upsert(userId, date, data) {
    const store = Menu._store(userId);
    const existing = store.find(m => m.date === date);
    if (existing) {
      Object.assign(existing, data);
      existing.updatedAt = new Date().toISOString();
      return existing;
    }
    const menu = {
      id: nextId++,
      userId,
      date,
      guestCount: data.guestCount || 2,
      sections: data.sections || {
        starters: [],
        mains:    [],
        desserts: [],
      },
      createdAt: new Date().toISOString(),
    };
    store.push(menu);
    return menu;
  }

  static delete(userId, date) {
    const store = Menu._store(userId);
    const idx = store.findIndex(m => m.date === date);
    if (idx === -1) return null;
    return store.splice(idx, 1)[0];
  }
}

module.exports = Menu;
