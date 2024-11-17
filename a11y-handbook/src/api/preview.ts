export async function fetchPreview(url: string) {
  console.log('API: Starting fetchPreview for URL:', url);
  
  try {
    console.log('API: Sending request to preview endpoint...');
    
    const response = await fetch('http://localhost:5000/api/preview', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ url }),
    });

    console.log('API: Response status:', response.status);

    if (!response.ok) {
      console.error('API: Response not OK:', response.status);
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data = await response.json();
    console.log('API: Preview data received:', data);
    return data;
  } catch (error) {
    console.error('API: Error in fetchPreview:', error);
    throw error;
  }
} 