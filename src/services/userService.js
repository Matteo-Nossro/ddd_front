import { getAuthHeaders } from "./authService";

const API_URL = "http://127.0.0.1:8000/api/accounts/users/";

export async function getUsers() {
  const headers = getAuthHeaders();
  const response = await fetch("http://127.0.0.1:8000/api/accounts/users/", {
    headers,
  });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des utilisateurs");
  }
  const data = await response.json();

  return data.results || data;
}

export async function getUserStats() {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_URL}stats/`, { headers });
  if (!response.ok) {
    throw new Error("Erreur lors de la récupération des statistiques");
  }
  return await response.json();
}

export async function updateUser(userId, userData) {
  const headers = {
    ...getAuthHeaders(),
    "Content-Type": "application/json",
  };

  const response = await fetch(`${API_URL}${userId}/`, {
    method: "PATCH",
    headers,
    body: JSON.stringify(userData),
  });

  if (!response.ok) {
    const error = await response.json();
    throw new Error(
      error.detail || "Erreur lors de la mise à jour de l'utilisateur"
    );
  }

  return await response.json();
}

export async function deleteUser(userId) {
  const headers = getAuthHeaders();
  const response = await fetch(`${API_URL}${userId}/`, {
    method: "DELETE",
    headers,
  });

  if (!response.ok) {
    throw new Error("Erreur lors de la suppression de l'utilisateur");
  }

  return true;
}
