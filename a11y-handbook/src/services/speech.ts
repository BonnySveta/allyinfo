interface SpeechOptions {
  priority?: 'high' | 'low';
}

export class SpeechService {
  private speechSynthesis: SpeechSynthesis | null = null;
  private voice: SpeechSynthesisVoice | null = null;
  private isSupported: boolean = false;

  constructor() {
    if (typeof window !== 'undefined' && window.speechSynthesis) {
      this.speechSynthesis = window.speechSynthesis;
      this.isSupported = true;

      // Пытаемся найти русский голос
      const voices = this.speechSynthesis.getVoices();
      this.voice = voices.find(voice => voice.lang.startsWith('ru')) || voices[0];

      // Обработчик для динамической загрузки голосов
      if (this.speechSynthesis) {
        this.speechSynthesis.onvoiceschanged = () => {
          if (this.speechSynthesis) {
            const voices = this.speechSynthesis.getVoices();
            this.voice = voices.find(voice => voice.lang.startsWith('ru')) || voices[0];
          }
        };
      }
    } else {
      console.warn('Speech synthesis is not supported in this browser');
    }
  }

  speak(text: string, options: SpeechOptions = { priority: 'high' }) {
    if (!this.isSupported || !this.speechSynthesis) {
      console.warn('Speech synthesis is not supported');
      return;
    }

    // Останавливаем предыдущее произношение только если приоритет высокий
    if (options.priority === 'high') {
      this.speechSynthesis.cancel();
    }

    const utterance = new SpeechSynthesisUtterance(text);
    utterance.voice = this.voice;
    utterance.rate = 1;
    utterance.pitch = 1;
    utterance.volume = 1;
    utterance.lang = 'ru-RU';

    // Добавляем обработку ошибок
    utterance.onerror = (event) => {
      console.error('Speech synthesis error:', event);
    };

    this.speechSynthesis.speak(utterance);
  }

  stop() {
    if (this.isSupported && this.speechSynthesis) {
      this.speechSynthesis.cancel();
    }
  }

  // Метод для проверки поддержки
  checkSupport(): boolean {
    return this.isSupported;
  }

  // Получить список доступных голосов
  getVoices(): SpeechSynthesisVoice[] {
    if (!this.isSupported || !this.speechSynthesis) {
      return [];
    }
    return this.speechSynthesis.getVoices();
  }
}

// Создаем синглтон
export const speechService = new SpeechService(); 