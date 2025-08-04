export async function onRequest({ request, env, params }) {
  const kv = env.KV;
  const uuid = params.uuid;
  const index_key = "users"

  if (!uuid || uuid.length === 0) {
    return new Response('Invalid UUID', { status: 400 });
  }

  if (request.method === 'PUT') {
    const obj = await request.json();
    const existing = await kv.get(`user:${uuid}`);
    if (!existing) {
      return new Response('Not Found', { status: 404 });
    }
    await kv.put(`user:${uuid}`, JSON.stringify(obj));
    return new Response('User saved', { status: 201 });
  }

  if (request.method === 'DELETE') {
    await kv.delete(`user:${uuid}`);
    const index = await kv.get(index_key);
    const list = index ? JSON.parse(index) : [];
    if (list.includes(uuid)) {
      const newList = list.filter(id => id !== uuid);
      await kv.put(index_key, JSON.stringify(newList));
    }
    return new Response("User deleted", { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
