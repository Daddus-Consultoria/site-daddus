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

  const responseText = await response.text();
  let responseData: T = {} as T;

  try {
    responseData = responseText ? JSON.parse(responseText) : {};
  } catch {
    responseData = {} as T;
  }

  if (!response.ok) {
    const errorData = responseData as T & { error?: { message?: string } };
    const apiMessage = errorData.error?.message;
    throw new Error(
      apiMessage || `Strapi respondeu com erro ${response.status} em ${path}.`
    );
  }

  return responseData;
}