interface SpeechOptions {
  priority?: 'high' | 'low';
}

export const speechService = {
  speak: (text: string, options: SpeechOptions = { priority: 'high' }) => {
    // ... реализация
  },
  stop: () => {
    // ... реализация
  }
}; 