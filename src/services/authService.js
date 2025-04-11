export function getAuthHeaders() {
  const token = localStorage.getItem("access_token");
  if (!token) {
    throw new Error("Non authentifié");
  }
  return {
    Authorization: `Bearer ${token}`,
  };
}
