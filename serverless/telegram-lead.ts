/**
 * Заготовка serverless-функции: принимает заявку с сайта и отправляет её в Telegram клуба.
 * TODO: подключить бота клуба.
 *
 * Как включить:
 *  1. Создать бота у @BotFather → получить TELEGRAM_BOT_TOKEN.
 *  2. Написать боту /start с аккаунта администратора (или добавить бота в группу админов)
 *     и узнать TELEGRAM_CHAT_ID (например, через @userinfobot или getUpdates).
 *  3. Vercel: скопировать файл в api/lead.ts. Netlify: в netlify/functions/lead.ts
 *     (и поменять экспорт по документации Netlify). Задать переменные окружения
 *     TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID в панели хостинга.
 *  4. В src/scripts/lead-transport.ts указать LEAD_ENDPOINT = '/api/lead'.
 */

interface LeadBody {
  form?: string;
  text?: string;
  page?: string;
  fields?: Record<string, string>;
}

const json = (status: number, data: unknown) =>
  new Response(JSON.stringify(data), { status, headers: { 'Content-Type': 'application/json; charset=utf-8' } });

export default async function handler(req: Request): Promise<Response> {
  if (req.method !== 'POST') return json(405, { ok: false, error: 'Method Not Allowed' });

  const token = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_CHAT_ID;
  if (!token || !chatId) return json(500, { ok: false, error: 'Бот не настроен' });

  let body: LeadBody;
  try {
    body = (await req.json()) as LeadBody;
  } catch {
    return json(400, { ok: false, error: 'Неверный формат' });
  }

  const text = String(body.text ?? '').trim();
  // Простейшая защита от мусора: пустые и слишком длинные заявки не отправляем
  if (text.length < 10 || text.length > 3500) return json(400, { ok: false, error: 'Пустая или слишком длинная заявка' });

  const message = `${text}\n\nСтраница: ${String(body.page ?? '/').slice(0, 200)}`;
  const res = await fetch(`https://api.telegram.org/bot${token}/sendMessage`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ chat_id: chatId, text: message, disable_web_page_preview: true }),
  });

  return res.ok ? json(200, { ok: true }) : json(502, { ok: false, error: 'Telegram не принял сообщение' });
}
