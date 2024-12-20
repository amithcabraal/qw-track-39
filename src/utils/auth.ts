export const getAccessTokenFromHash = (): string | null => {
  if (typeof window === 'undefined') return null;
  
  const hash = window.location.hash.substring(1);
  const params = new URLSearchParams(hash);
  return params.get('access_token');
};

export const saveAccessToken = (token: string): void => {
  if (!token) return;
  sessionStorage.setItem('spotify_access_token', token);
  // Dispatch storage event for other tabs
  window.dispatchEvent(new Event('storage'));
};

export const getStoredAccessToken = (): string | null => {
  return sessionStorage.getItem('spotify_access_token');
};

export const removeAccessToken = (): void => {
  sessionStorage.removeItem('spotify_access_token');
  // Dispatch storage event for other tabs
  window.dispatchEvent(new Event('storage'));
};

export const signOut = (): void => {
  removeAccessToken();
  window.location.href = '/login';
};