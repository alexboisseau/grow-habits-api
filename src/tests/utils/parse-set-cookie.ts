export function parseSetCookie(
  setCookieHeader: string,
): Record<string, string> {
  const cookies = setCookieHeader.split('; ');

  return cookies.reduce((acc, cookie) => {
    const [key, value] = cookie.split('=');
    return { ...acc, [key]: value };
  }, {});
}
