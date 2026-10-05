/**
 * Все формы заявок (form[data-lead-form]): маска телефона, валидация с понятными
 * ошибками, сборка текста заявки и отправка в WhatsApp или Telegram (демо-режим).
 */
import { social, whatsappNumber } from '@/data/site';
import { sendLeadToBot } from './lead-transport';
import { goal } from './metrika';

type Field = HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement;

const digits = (s: string) => s.replace(/\D/g, '');

export const todayISO = (): string => {
  const d = new Date();
  d.setMinutes(d.getMinutes() - d.getTimezoneOffset());
  return d.toISOString().slice(0, 10);
};

/** «89001234567» → «+7 (900) 123-45-67» */
export const formatPhone = (raw: string): string => {
  let d = digits(raw);
  if (!d) return '';
  // После подставленного «+7» человек по привычке набрал 8 или 7 — лишнюю цифру убираем
  if (d.length > 11 && (d[1] === '8' || d[1] === '7')) d = d[0] + d.slice(2);
  if (d[0] === '8') d = `7${d.slice(1)}`;
  else if (d[0] !== '7') d = `7${d}`;
  const p = d.slice(1, 11);
  let out = '+7';
  if (p.length) out += ` (${p.slice(0, 3)}`;
  if (p.length >= 3) out += ')';
  if (p.length > 3) out += ` ${p.slice(3, 6)}`;
  if (p.length > 6) out += `-${p.slice(6, 8)}`;
  if (p.length > 8) out += `-${p.slice(8, 10)}`;
  return out;
};

const errorEl = (el: Field): HTMLElement | null => {
  const id = el.getAttribute('aria-describedby')?.split(' ').find((x) => x.endsWith('-error'));
  return id ? document.getElementById(id) : null;
};

const validate = (el: Field): string => {
  const msg = el.dataset.error ?? 'Заполните поле';
  if (el instanceof HTMLInputElement && el.type === 'checkbox') return el.required && !el.checked ? msg : '';
  const v = el.value.trim();
  if (el.required && !v) return msg;
  if (!v) return '';
  if (el.hasAttribute('data-phone') && digits(v).length !== 11) return msg;
  if (el.hasAttribute('data-future') && v < todayISO()) return msg;
  if (el instanceof HTMLInputElement && el.type === 'number') {
    const n = Number(v);
    if (!Number.isFinite(n) || (el.min && n < Number(el.min)) || (el.max && n > Number(el.max))) return msg;
  }
  return '';
};

const showError = (el: Field, msg: string) => {
  const err = errorEl(el);
  if (err) err.textContent = msg;
  if (msg) el.setAttribute('aria-invalid', 'true');
  else el.removeAttribute('aria-invalid');
};

const fmtDate = (iso: string) => (/^\d{4}-\d{2}-\d{2}$/.test(iso) ? iso.split('-').reverse().join('.') : iso);

/** Текст заявки: «Поле: значение» по порядку полей с data-label */
export const buildMessage = (form: HTMLFormElement): { text: string; fields: Record<string, string> } => {
  const map = new Map<string, string[]>();
  form.querySelectorAll<Field>('[data-label]').forEach((el) => {
    const label = el.dataset.label!;
    let value = '';
    if (el instanceof HTMLInputElement && (el.type === 'checkbox' || el.type === 'radio')) {
      if (!el.checked) return;
      value = el.value;
    } else if (el instanceof HTMLSelectElement) {
      if (!el.value || el.disabled) return;
      value = el.selectedOptions[0]?.text ?? el.value;
    } else {
      value = el.value.trim();
      if (el instanceof HTMLInputElement && el.type === 'date') value = fmtDate(value);
    }
    if (!value) return;
    map.set(label, [...(map.get(label) ?? []), value]);
  });
  const fields = Object.fromEntries([...map].map(([k, v]) => [k, v.join(', ')]));
  const title = form.dataset.leadTitle ?? 'Заявка с сайта «От винта»';
  const text = [title, '', ...Object.entries(fields).map(([k, v]) => `${k}: ${v}`)].join('\n');
  return { text, fields };
};

const showSuccess = (form: HTMLFormElement, url: string, channel: string, text: string) => {
  const fieldsBox = form.querySelector<HTMLElement>('.lead-fields');
  const ok = form.querySelector<HTMLElement>('.lead-success');
  if (!ok) return;
  fieldsBox?.classList.add('hidden');
  ok.classList.remove('hidden');
  const reopen = ok.querySelector<HTMLAnchorElement>('[data-lead-reopen]');
  if (reopen) reopen.href = url;
  const tg = ok.querySelector<HTMLElement>('.lead-success-tg');
  const area = ok.querySelector<HTMLTextAreaElement>('[data-lead-text]');
  if (tg && area) {
    tg.classList.toggle('hidden', channel !== 'telegram');
    area.value = text;
  }
  ok.focus({ preventScroll: true });
  ok.scrollIntoView({ block: 'nearest', behavior: 'smooth' });
};

export const resetLeadForm = (form: HTMLFormElement): void => {
  form.querySelector('.lead-fields')?.classList.remove('hidden');
  form.querySelector('.lead-success')?.classList.add('hidden');
};

const submit = (form: HTMLFormElement) => {
  const controls = [...form.querySelectorAll<Field>('input, select, textarea')].filter(
    (el) => el.required || el.hasAttribute('data-error'),
  );
  let firstBad: Field | null = null;
  for (const el of controls) {
    const msg = validate(el);
    showError(el, msg);
    el.dataset.touched = '1';
    if (msg && !firstBad) firstBad = el;
  }
  if (firstBad) {
    firstBad.focus();
    return;
  }

  const { text, fields } = buildMessage(form);
  const channel = form.querySelector<HTMLInputElement>('input[name="channel"]:checked')?.value ?? 'whatsapp';
  let url: string;
  if (channel === 'telegram') {
    url = social('telegram').url;
    navigator.clipboard?.writeText(text).catch(() => undefined);
  } else {
    url = `https://wa.me/${whatsappNumber}?text=${encodeURIComponent(text)}`;
  }
  window.open(url, '_blank', 'noopener');

  // TODO: подключить бота клуба — заявка продублируется администратору (см. lead-transport.ts).
  void sendLeadToBot({ form: form.dataset.leadTitle ?? '', text, fields, page: location.pathname });

  goal('lead_submit', { channel, form: form.dataset.leadTitle });
  showSuccess(form, url, channel, text);
};

export const initLeadForms = (): void => {
  const today = todayISO();
  document.querySelectorAll<HTMLInputElement>('input[data-future]').forEach((d) => (d.min = today));

  document.querySelectorAll<HTMLInputElement>('input[data-phone]').forEach((input) => {
    input.addEventListener('input', (e) => {
      if ((e as InputEvent).inputType?.startsWith('delete')) return;
      input.value = formatPhone(input.value);
    });
    input.addEventListener('focus', () => {
      if (!input.value) input.value = '+7 (';
    });
    input.addEventListener('blur', () => {
      if (digits(input.value).length <= 1) input.value = '';
      else input.value = formatPhone(input.value);
    });
  });

  document.querySelectorAll<HTMLFormElement>('form[data-lead-form]').forEach((form) => {
    form.addEventListener('submit', (e) => {
      e.preventDefault();
      submit(form);
    });
    // Повторная проверка поля после первой попытки
    form.addEventListener('input', (e) => {
      const el = e.target as Field;
      if (el.dataset?.touched) showError(el, validate(el));
    });
    form.addEventListener('change', (e) => {
      const el = e.target as Field;
      if (el.dataset?.touched) showError(el, validate(el));
    });
    form.querySelector('[data-lead-again]')?.addEventListener('click', () => {
      resetLeadForm(form);
      form.reset();
      form.dispatchEvent(new CustomEvent('lead:reset'));
      form.querySelector<HTMLElement>('input, select')?.focus();
    });
  });
};
