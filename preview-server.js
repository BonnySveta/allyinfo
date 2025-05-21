require('dotenv').config();
const express = require('express');
const axios = require('axios');
const cheerio = require('cheerio');
const cors = require('cors');
const { createClient } = require('@supabase/supabase-js');

const app = express();
app.use(express.json());
app.use(cors());

// Инициализация Supabase клиента
const supabaseUrl = process.env.SUPABASE_URL;
const supabaseKey = process.env.SUPABASE_SERVICE_KEY;
const supabase = createClient(supabaseUrl, supabaseKey);

function absolutizeUrl(base, url) {
  if (!url) return '';
  try {
    return new URL(url, base).href;
  } catch {
    return url;
  }
}

async function downloadAndUploadFavicon(faviconUrl, domain) {
  try {
    console.log('Пробую скачать:', faviconUrl);
    const response = await axios.get(faviconUrl, {
      responseType: 'arraybuffer',
      timeout: 5000,
      headers: {
        'User-Agent': 'Mozilla/5.0'
      }
    });
    console.log('Статус:', response.status, 'Content-Type:', response.headers['content-type']);

    // Определяем тип файла
    const contentType = response.headers['content-type'];
    const extension = contentType.includes('png') ? 'png' : 
                     contentType.includes('jpg') || contentType.includes('jpeg') ? 'jpg' : 
                     'ico';

    // Генерируем уникальное имя файла
    const fileName = `${domain}-${Date.now()}.${extension}`;
    console.log('Загружаю в bucket:', fileName);

    // Загружаем в Supabase Storage (в бакет favicons!)
    const { data, error } = await supabase.storage
      .from('favicons')
      .upload(fileName, response.data, {
        contentType: contentType,
        upsert: true
      });

    if (error) {
      console.error('Ошибка загрузки в bucket:', error);
      return null;
    }

    // Получаем публичный URL
    const { data: { publicUrl } } = supabase.storage
      .from('favicons')
      .getPublicUrl(fileName);
    console.log('Публичный URL:', publicUrl);

    return publicUrl;
  } catch (error) {
    console.error('Ошибка при скачивании/загрузке фавикона:', error);
    return null;
  }
}

app.post('/api/preview', async (req, res) => {
  const { url } = req.body;
  if (!url) return res.status(400).json({ error: 'No url provided' });

  try {
    const { data } = await axios.get(url, { timeout: 8000, headers: { 'User-Agent': 'Mozilla/5.0' } });
    const $ = cheerio.load(data);

    // Title
    const title =
      $('meta[property="og:title"]').attr('content') ||
      $('meta[name="twitter:title"]').attr('content') ||
      $('title').text() ||
      '';

    // Description
    const description =
      $('meta[property="og:description"]').attr('content') ||
      $('meta[name="description"]').attr('content') ||
      $('meta[name="twitter:description"]').attr('content') ||
      '';

    // Image
    const image =
      $('meta[property="og:image"]').attr('content') ||
      $('meta[name="twitter:image"]').attr('content') ||
      '';

    // Favicon (ищем разные варианты)
    let favicon =
      $('link[rel="icon"]').attr('href') ||
      $('link[rel="shortcut icon"]').attr('href') ||
      $('link[rel="apple-touch-icon"]').attr('href') ||
      '/favicon.ico';

    favicon = absolutizeUrl(url, favicon);

    // Domain
    const domain = new URL(url).hostname;

    // --- ДОРАБОТКА: если Telegram/YouTube и есть image, сохраняем image ---
    let faviconUrl = null;
    const isTelegram = domain.includes('t.me') || domain.includes('telegram.me');
    const isYouTube = domain.includes('youtube.com') || domain.includes('youtu.be');
    if ((isTelegram || isYouTube) && image) {
      console.log('Downloading and uploading favicon for Telegram/YouTube');  
      faviconUrl = await downloadAndUploadFavicon(absolutizeUrl(url, image), domain + '-preview');
    } else {
      console.log('Downloading and uploading favicon for other domains');
      faviconUrl = await downloadAndUploadFavicon(favicon, domain);
    }
    console.log('faviconUrl для ответа:', faviconUrl);

    res.json({
      title: title.trim(),
      description: description.trim(),
      image: absolutizeUrl(url, image),
      favicon: faviconUrl || favicon, // Используем сохраненный URL или оригинальный как fallback
      domain,
    });
  } catch (e) {
    res.status(400).json({ error: 'Не удалось получить предпросмотр', details: e.message });
  }
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => {
  console.log(`Preview server running on port ${PORT}`);
}); 