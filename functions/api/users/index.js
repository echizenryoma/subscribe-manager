export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const kv = env.KV;
  const index_key = "users"

  if (request.method === 'GET') {
    const index = await kv.get(index_key);
    const list = index ? JSON.parse(index) : [];
    const users = [];
    for (const uuid of list) {
      users.push({
        uuid: uuid,
        name: await kv.get(`user:${uuid}`)
      });
    }
    return new Response(JSON.stringify(users), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (request.method === 'POST') {
    const { name, content } = await request.json();
    await kv.put(`user:${user}`, content);
    const index = await kv.get(index_key);
    const list = index ? JSON.parse(index) : [];
    if (!list.includes(name)) {
      list.push(name);
    }
    await kv.put(index_key, JSON.stringify(list));
    return new Response('User saved', { status: 201 });
  }
  return new Response('Method Not Allowed', { status: 405 });
}
