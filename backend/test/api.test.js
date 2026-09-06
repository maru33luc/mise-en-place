const assert = require('node:assert/strict');
const { after, before, test } = require('node:test');
const { startServer } = require('../server');

let server;
let baseUrl;

before(async () => {
  server = startServer(0);
  await new Promise((resolve, reject) => {
    server.once('listening', resolve);
    server.once('error', reject);
  });
  const address = server.address();
  assert.ok(address && typeof address === 'object');
  baseUrl = `http://127.0.0.1:${address.port}`;
});

after(async () => {
  await new Promise((resolve, reject) => server.close((error) => error ? reject(error) : resolve()));
});

async function request(path, options = {}) {
  const response = await fetch(`${baseUrl}${path}`, {
    ...options,
    headers: {
      ...(options.body ? { 'Content-Type': 'application/json' } : {}),
      ...(options.headers ?? {}),
    },
  });
  return { response, body: await response.json() };
}

test('health endpoint is public', async () => {
  const { response, body } = await request('/api/health');
  assert.equal(response.status, 200);
  assert.equal(body.success, true);
  assert.equal(body.status, 'ok');
});

test('protected routes reject requests without a token', async () => {
  const { response, body } = await request('/api/recipes');
  assert.equal(response.status, 401);
  assert.equal(body.success, false);
});

test('authentication and protected kitchen workflows work end to end', async () => {
  const email = `test-${Date.now()}@example.com`;
  const password = 'secret123';
  const json = (value) => JSON.stringify(value);

  const registered = await request('/api/auth/register', {
    method: 'POST',
    body: json({ name: 'Test Chef', email, password }),
  });
  assert.equal(registered.response.status, 201);
  assert.equal(registered.body.success, true);
  const token = registered.body.data.token;
  assert.ok(token);

  const duplicate = await request('/api/auth/register', {
    method: 'POST',
    body: json({ name: 'Test Chef', email, password }),
  });
  assert.equal(duplicate.response.status, 409);

  const invalidLogin = await request('/api/auth/login', {
    method: 'POST',
    body: json({ email, password: 'wrong-password' }),
  });
  assert.equal(invalidLogin.response.status, 401);
  assert.equal(invalidLogin.body.message, 'Invalid credentials');

  const login = await request('/api/auth/login', {
    method: 'POST',
    body: json({ email, password }),
  });
  assert.equal(login.response.status, 200);

  const authHeaders = { Authorization: `Bearer ${token}` };
  const me = await request('/api/auth/me', { headers: authHeaders });
  assert.equal(me.response.status, 200);
  assert.equal(me.body.data.user.email, email);

  const recipes = await request('/api/recipes', { headers: authHeaders });
  assert.equal(recipes.response.status, 200);
  assert.equal(recipes.body.data.length, 3);

  const createdRecipe = await request('/api/recipes', {
    method: 'POST',
    headers: authHeaders,
    body: json({
      title: 'Test Recipe',
      description: 'A recipe created by the API test.',
      difficulty: 'easy',
      ingredients: [{ name: 'Salt', amount: 5, unit: 'g' }],
    }),
  });
  assert.equal(createdRecipe.response.status, 201);
  const recipeId = createdRecipe.body.data.id;

  const updatedRecipe = await request(`/api/recipes/${recipeId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: json({ title: 'Updated Test Recipe' }),
  });
  assert.equal(updatedRecipe.response.status, 200);
  assert.equal(updatedRecipe.body.data.title, 'Updated Test Recipe');

  const menu = await request('/api/menu/2026-09-06', {
    method: 'PUT',
    headers: authHeaders,
    body: json({ guestCount: 4, sections: { starters: [], mains: [], desserts: [] } }),
  });
  assert.equal(menu.response.status, 200);
  assert.equal(menu.body.data.guestCount, 4);

  const task = await request('/api/prep-list', {
    method: 'POST',
    headers: authHeaders,
    body: json({ name: 'Test prep task', priority: 'high', estimatedMinutes: 10 }),
  });
  assert.equal(task.response.status, 201);
  const taskId = task.body.data.id;

  const completedTask = await request(`/api/prep-list/${taskId}`, {
    method: 'PUT',
    headers: authHeaders,
    body: json({ status: 'done' }),
  });
  assert.equal(completedTask.response.status, 200);
  assert.equal(completedTask.body.data.status, 'done');
});
