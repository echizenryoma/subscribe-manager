export async function onRequest({ request, env, params }) {
  const kv = env.KV;
  const uuid = params.uuid;

  if (request.method === 'PUT') {
    const { uuid, name } = await request.json();
    const existing = await kv.get(`user:${uuid}`);
    if (!existing) {
      return new Response('Not Found', { status: 404 });
    }
    await kv.put(`user:${user}`, content);
    return new Response('User saved', { status: 201 });
  }

  if (request.method === 'DELETE') {
    await kv.delete(`user:${uuid}`);
    return new Response("User deleted", { status: 204 });
  }

  return new Response('Method Not Allowed', { status: 405 });
}
