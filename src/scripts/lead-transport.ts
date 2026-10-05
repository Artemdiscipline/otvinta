/**
 * Отправка заявки в Telegram-бота клуба через serverless-функцию.
 * Сейчас (демо) заявка уходит только в мессенджер пользователя — WhatsApp или Telegram.
 *
 * TODO: подключить бота клуба:
 *  1. Создать бота у @BotFather, получить токен; узнать chat_id администратора/группы.
 *  2. Задеплоить функцию serverless/telegram-lead.ts (Vercel/Netlify/Yandex Cloud Functions)
 *     с переменными окружения TELEGRAM_BOT_TOKEN и TELEGRAM_CHAT_ID.
 *  3. Указать адрес функции в LEAD_ENDPOINT ниже.
 */
export const LEAD_ENDPOINT: string | null = null;

export interface LeadPayload {
  form: string;
  text: string;
  fields: Record<string, string>;
  page: string;
}

export const sendLeadToBot = async (lead: LeadPayload): Promise<boolean> => {
  if (!LEAD_ENDPOINT) return false;
  try {
    const res = await fetch(LEAD_ENDPOINT, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(lead),
      keepalive: true,
    });
    return res.ok;
  } catch {
    return false;
  }
};
