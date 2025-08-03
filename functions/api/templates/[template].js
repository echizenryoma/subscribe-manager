export async function onRequest({ request, env, params }) {
  const kv = env.KV;
  const name = params.template;
  const index_key = "templates"

  if (request.method === 'PUT') {
    const obj = await request.json();
    const existing = await kv.get(`template:${name}`);
    if (!existing) {
      return new Response('Not Found', { status: 404 });
    }
    await kv.put(`template:${name}`, JSON.stringify(obj));
    return new Response('Template saved', { status: 201 });
  }

  if (request.method === 'DELETE') {
    await kv.delete(`template:${name}`);
    const index = await kv.get(index_key);
    const list = index ? JSON.parse(index) : [];
    if (list.includes(name)) {
      list.delete(name);
      await kv.put(index_key, JSON.stringify(list));
    }
    return new Response("Template deleted", { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
