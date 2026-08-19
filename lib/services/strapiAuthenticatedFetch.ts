export async function strapiAuthenticatedFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("daddus_auth_token");
  if (!token) throw new Error("Sessão não autenticada.");

  const headers = new Headers(options.headers);
  headers.set("Authorization", `Bearer ${token}`);
  if (!(options.body instanceof FormData)) {
    headers.set("Content-Type", "application/json");
  }

  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${path}`, {
    ...options,
    headers,
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dados.");
  }

  return response.json();
}