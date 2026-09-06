const bcrypt = require('bcryptjs');

/** In-memory user store */
let users = [];
let nextId = 1;

class User {
  static async create({ name, email, password }) {
    const existing = users.find(u => u.email === email.toLowerCase());
    if (existing) return null; // email already taken

    const hashed = await bcrypt.hash(password, 10);
    const user = {
      id: nextId++,
      name,
      email: email.toLowerCase(),
      password: hashed,
      createdAt: new Date().toISOString(),
    };
    users.push(user);
    return User.sanitize(user);
  }

  static async findByEmailAndPassword(email, password) {
    const user = users.find(u => u.email === email.toLowerCase());
    if (!user) return null;
    const valid = await bcrypt.compare(password, user.password);
    if (!valid) return null;
    return User.sanitize(user);
  }

  static findById(id) {
    const user = users.find(u => u.id === id);
    return user ? User.sanitize(user) : null;
  }

  /** Strip password before sending to client */
  static sanitize({ id, name, email, createdAt }) {
    return { id, name, email, createdAt };
  }
}

module.exports = User;
