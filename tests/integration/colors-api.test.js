const { randomUUID } = require('node:crypto');

const apiUrl = 'http://127.0.0.1:8000/LAMPAPI';

async function postJson(endpoint, body) {
  const response = await fetch(`${apiUrl}/${endpoint}.php`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });

  expect(response.status).toBe(200);
  expect(response.headers.get('content-type')).toMatch(/^application\/json\b/);
  return response.json();
}

test('logs in, saves a color to MySQL, and finds it by partial name', async () => {
  const login = await postJson('Login', {
    login: 'ci_student',
    password: 'fixture-only',
  });
  expect(login).toEqual({
    id: expect.any(Number),
    firstName: 'CI',
    lastName: 'Student',
    error: '',
  });
  expect(login.id).toBeGreaterThan(0);

  const search = randomUUID();
  const color = `CI Blue ${search}`;
  expect(await postJson('AddColor', { color, userId: login.id })).toEqual({ error: '' });
  expect(await postJson('SearchColors', { search, userId: login.id })).toEqual({
    results: [color],
    error: '',
  });
});
