export async function fetchPreview(url: string) {
  try {
    const response = await fetch(`/api/preview?url=${encodeURIComponent(url)}`);
    if (!response.ok) {
      throw new Error('Failed to fetch preview');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching preview:', error);
    throw error;
  }
} 