import express from 'express';
import path from 'path';
import { fileURLToPath } from 'url';
import dotenv from 'dotenv';
import { GoogleGenAI } from '@google/genai';

dotenv.config();

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

const app = express();
const PORT = process.env.PORT || 3000;

app.use(express.json());

function withTimeout<T>(promise: Promise<T>, ms = 6000, fallbackMsg = 'Zaman aşımı'): Promise<T> {
  return Promise.race([
    promise,
    new Promise<T>((_, reject) => setTimeout(() => reject(new Error(fallbackMsg)), ms)),
  ]);
}

// API: AI Speech Summarization (using Gemini 3.8 Flash)
app.post('/api/summarize', async (req, res) => {
  try {
    const { transcript } = req.body;
    if (!transcript || typeof transcript !== 'string' || transcript.trim().length === 0) {
      return res.status(400).json({ error: 'Özetlenecek konuşma metni bulunamadı.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({
        fallback: true,
        message: 'GEMINI_API_KEY tanımlı değil. Akıllı yerel özetleyici kullanılıyor.'
      });
    }

    const ai = new GoogleGenAI();
    const prompt = `Aşağıdaki konuşma metni, işitme kaybı yaşayan bireyler için geliştirilen ANINDA erişilebilirlik uygulaması tarafından canlı mikrofon ile yazıya dökülmüştür.

Bu konuşmayı kullanıcı için çok anlaşılır, kısa, gereksiz tekrarları çıkarılmış ve önemli aksiyonları öne çıkaran net bir Türkçe özet haline getir.

Özet Formatı:
• ANA KONU: (1 net cümle)
• ÖNEMLİ BİLGİLER: (2-3 kısa madde)
• EYLEM VEYA KARAR: (Varsa zaman, yer, görev veya plan)

Konuşma Metni:
"""${transcript}"""`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
      }),
      6000,
      'Yapay zekâ yanıt zaman aşımına uğradı'
    );

    const summaryText = response.text || '';
    return res.json({ summary: summaryText, source: 'gemini' });
  } catch (error: any) {
    console.warn('AI Summarize failed, defaulting to client fallback:', error?.message);
    return res.status(200).json({
      fallback: true,
      error: error?.message || 'Yapay zekâ yanıt veremedi.'
    });
  }
});

// API: Natural Language Intent Router
app.post('/api/intent', async (req, res) => {
  try {
    const { query } = req.body;
    if (!query || typeof query !== 'string') {
      return res.status(400).json({ error: 'Arama sorgusu gerekli.' });
    }

    const apiKey = process.env.GEMINI_API_KEY;
    if (!apiKey) {
      return res.status(503).json({ fallback: true });
    }

    const ai = new GoogleGenAI();
    const prompt = `Kullanıcı "Şu anda neye ihtiyacın var?" kutusuna şunu yazdı:
"${query}"

Uygulamanın 4 ana sekmesi vardır:
1. "speech" (Canlı Konuşma - arkadaşlar, doktor, öğretmen, sohbet, altyazı)
2. "timeline" (ANINDA Ses Akışı - çevredeki sesleri sırayla takip etme)
3. "alerts" (Yüksek Öncelikli Sesler - siren, yangın, duman alarmı, cam kırılması, korna)
4. "demo" (Ses Simülasyonu & Çevresel Ses Testi - kapı zili, bebek, köpek, elektrikli aletler)

Sadece geçerli bir JSON dön:
{
  "targetSection": "speech" | "timeline" | "alerts" | "demo",
  "explanation": "Kullanıcıya nazik ve kısa Türkçe yönlendirme cümlesi"
}`;

    const response = await withTimeout(
      ai.models.generateContent({
        model: 'gemini-3.8-flash',
        contents: prompt,
        config: {
          responseMimeType: 'application/json'
        }
      }),
      4000,
      'İstek zaman aşımına uğradı'
    );

    const parsed = JSON.parse(response.text || '{}');
    return res.json(parsed);
  } catch (error: any) {
    return res.status(200).json({ fallback: true, error: error?.message });
  }
});

// Vite dev server or static distribution
async function startServer() {
  if (process.env.NODE_ENV === 'production') {
    app.use(express.static(path.resolve(__dirname, 'dist')));
    app.get('*', (_req, res) => {
      res.sendFile(path.resolve(__dirname, 'dist', 'index.html'));
    });
    app.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`ANINDA server running on port ${PORT}`);
    });
  } else {
    const http = await import('http');
    const server = http.createServer(app);
    const { createServer: createViteServer } = await import('vite');
    const vite = await createViteServer({
      server: {
        middlewareMode: true,
        hmr: false,
      },
      appType: 'spa',
    });
    app.use(vite.middlewares);
    server.listen(Number(PORT), '0.0.0.0', () => {
      console.log(`ANINDA dev server running on port ${PORT}`);
    });
  }
}

startServer();
