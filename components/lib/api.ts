export interface ApiResponse<T> {
  success: boolean;
  message?: string;
  data: T;
}


export const api = async <T>(
  url: string,
  options: RequestInit = {}
): Promise<T> => {

  const getCookieToken = () => {
    if (typeof window === 'undefined') return null;

    const match = document.cookie.match(
      new RegExp('(^| )access_token=([^;]+)')
    );

    return match ? match[2] : null;
  };

  const token = getCookieToken();

  const res = await fetch(`${process.env.NEXT_PUBLIC_API_URL}${url}`, {
    ...options,
    credentials: 'include',
    headers: {
      'Content-Type': 'application/json',
      ...(token
        ? { Authorization: `${token}` }
        : {}
      ),
      ...(options.headers || {})
    }
  });

  const data = await res.json();

  if (!res.ok) {
    throw new Error(data.message || 'Request failed');
  }

  return data;
};