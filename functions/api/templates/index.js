export async function onRequest({ request, env }) {
  const url = new URL(request.url);
  const kv = env.KV;
  const index_key = "templates"

  if (request.method === 'GET') {
    const index = await kv.get(index_key);
    const list = index ? JSON.parse(index) : [];
    const templates = [];
    for (const name of list) {
      templates.push(JSON.parse(await kv.get(`template:${name}`)));
    }
    return new Response(JSON.stringify(templates), {
      headers: { "Content-Type": "application/json" }
    });
  }

  if (request.method === 'POST') {
    const obj = await request.json();
    const name = obj.name;
    await kv.put(`template:${name}`, JSON.stringify(obj));
    const index = await kv.get(index_key);
    const list = index ? JSON.parse(index) : [];
    if (!list.includes(name)) {
      list.push(name);
    }
    await kv.put(index_key, JSON.stringify(list));
    return new Response('Template saved', { status: 201 });
  }
  return new Response('Method Not Allowed', { status: 405 });
}
