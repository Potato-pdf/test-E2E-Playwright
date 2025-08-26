export const API_URL = process.env.NEXT_PUBLIC_API_URL || 'http://localhost:3001';

export async function fetchTasks() {
  const res = await fetch(`${API_URL}/tasks`);
  return res.json();
}

export async function createTask(task: { title: string, description?: string, assignedTo?: string, details?: string }) {
  const res = await fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(task),
  });
  return res.json();
}

export async function updateTaskStatus(id: number | string, status: string) {
  const res = await fetch(`${API_URL}/tasks/${id}/status`, {
    method: 'PATCH',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ status }),
  });
  return res.json();
}

export async function deleteTask(id: string) {
  const res = await fetch(`${API_URL}/tasks/${id}`, {
    method: 'DELETE',
  });
  return res.json();
}
