export const fetchPreview = async (url: string) => {
  console.log('Fetching preview for URL:', url);
  
  try {
    const response = await fetch('/api/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      console.error('Preview fetch failed:', response.status, response.statusText);
      throw new Error('Failed to fetch preview');
    }

    const data = await response.json();
    console.log('Preview data:', data);
    return data;
  } catch (error) {
    console.error('Error fetching preview:', error);
    throw error;
  }
}; 