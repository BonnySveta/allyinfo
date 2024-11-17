const API_URL = 'http://localhost:3001/api/preview';

export async function fetchPreview(url: string) {
  try {
    console.log('Trying to fetch preview for:', url);
    
    const response = await fetch(API_URL, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json'
      },
      body: JSON.stringify({ url })
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('Server response error:', response.status, errorText);
      throw new Error(`Server error: ${response.status}`);
    }

    return await response.json();
  } catch (error) {
    console.error('Preview fetch error:', error);
    if (error instanceof TypeError && error.message.includes('Failed to fetch')) {
      throw new Error('Сервер недоступен. Убедитесь, что сервер запущен на порту 3001');
    }
    throw error;
  }
} 