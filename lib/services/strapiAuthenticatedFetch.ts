export async function strapiAuthenticatedFetch<T>(
  path: string,
  options: RequestInit = {}
): Promise<T> {
  const token = localStorage.getItem("daddus_auth_token");
  if (!token) throw new Error("Sessão não autenticada.");

  const response = await fetch(`${process.env.NEXT_PUBLIC_STRAPI_URL}${path}`, {
    ...options,
    headers: {
      "Content-Type": "application/json",
      ...options.headers,
      Authorization: `Bearer ${token}`,
    },
  });

  if (!response.ok) {
    throw new Error("Não foi possível carregar os dados.");
  }

  return response.json();
}