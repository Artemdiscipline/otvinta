/**
 * Заявка на заезд: открытие модалки с любой кнопки [data-book],
 * подстановка услуги/программы и зависимый список «Трасса / программа».
 */
import { bookingService, serviceByProgram } from '@/data/booking';
import { resetLeadForm } from './lead';
import { openDialog } from './modal';

export interface BookingPreset {
  service?: string;
  program?: string;
  comment?: string;
  people?: string;
}

const fillPrograms = (form: HTMLFormElement, serviceId: string | undefined, programId?: string) => {
  const sel = form.querySelector<HTMLSelectElement>('[data-program-select]');
  const label = form.querySelector<HTMLElement>('[data-program-label]');
  if (!sel) return;
  const s = bookingService(serviceId);
  sel.replaceChildren();
  if (label) label.textContent = s?.programLabel ?? 'Трасса / программа';
  sel.dataset.label = s?.programLabel ?? 'Программа';
  if (!s) {
    sel.append(new Option('Сначала выберите услугу', ''));
    sel.disabled = true;
    return;
  }
  sel.disabled = false;
  sel.append(new Option('Пока не знаю — подскажите', ''));
  let group: HTMLOptGroupElement | null = null;
  for (const o of s.options) {
    if (o.group && group?.label !== o.group) {
      group = document.createElement('optgroup');
      group.label = o.group;
      sel.append(group);
    }
    (o.group && group ? group : sel).append(new Option(o.label, o.id));
  }
  if (programId) sel.value = programId;
};

const initForm = (form: HTMLFormElement) => {
  const service = form.querySelector<HTMLSelectElement>('[data-service-select]');
  if (!service) return;
  fillPrograms(form, service.value || form.dataset.defaultService);
  service.addEventListener('change', () => fillPrograms(form, service.value));
  form.addEventListener('lead:reset', () => {
    if (form.dataset.defaultService) service.value = form.dataset.defaultService;
    fillPrograms(form, service.value);
  });
};

export const openBooking = (preset: BookingPreset = {}, opener?: Element | null): void => {
  const dialog = document.getElementById('booking') as HTMLDialogElement | null;
  const form = dialog?.querySelector<HTMLFormElement>('form[data-booking-form]');
  if (!dialog || !form) return;
  resetLeadForm(form);
  const serviceId = preset.service || (preset.program ? serviceByProgram(preset.program)?.id : undefined);
  const select = form.querySelector<HTMLSelectElement>('[data-service-select]');
  if (select) select.value = serviceId ?? '';
  fillPrograms(form, serviceId, preset.program);
  const comment = form.querySelector<HTMLTextAreaElement>('[data-comment]');
  if (comment && preset.comment) comment.value = preset.comment;
  const people = form.querySelector<HTMLInputElement>('input[name="people"]');
  if (people && preset.people) people.value = preset.people;
  openDialog(dialog, opener);
  requestAnimationFrame(() => form.querySelector<HTMLInputElement>('input[name="name"]')?.focus());
};

export const initBooking = (): void => {
  document.querySelectorAll<HTMLFormElement>('form[data-booking-form]').forEach(initForm);
  document.addEventListener('click', (e) => {
    const trigger = (e.target as Element | null)?.closest?.<HTMLElement>('[data-book]');
    if (!trigger) return;
    e.preventDefault();
    const d = trigger.dataset;
    openBooking({ service: d.service, program: d.program, comment: d.comment, people: d.people }, trigger);
  });
};
