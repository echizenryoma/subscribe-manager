export async function onRequest({ request, env, params }) {
  const kv = env.KV;
  const name = params.template;

  if (request.method === 'PUT') {
    const { name, content } = await request.json();
    const existing = await kv.get(`template:${name}`);
    if (!existing) {
      return new Response('Not Found', { status: 404 });
    }
    await kv.put(`template:${name}`, content);
    return new Response('Template saved', { status: 201 });
  }

  if (request.method === 'DELETE') {
    await kv.delete(`template:${name}`);
    return new Response("Template deleted", { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
