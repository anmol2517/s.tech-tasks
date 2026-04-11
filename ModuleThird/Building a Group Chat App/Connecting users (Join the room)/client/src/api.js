const API_BASE = '/api';

export async function checkUserExists(email) {
  const response = await fetch(`${API_BASE}/users/exists?email=${encodeURIComponent(email.trim())}`);
  if (!response.ok) {
    throw new Error('Unable to validate user email');
  }
  return response.json();
}

export function generateRoomId(emailA, emailB) {
  const normalizedA = (emailA || '').trim().toLowerCase();
  const normalizedB = (emailB || '').trim().toLowerCase();
  return [normalizedA, normalizedB].sort().join('_');
}
