/** Общий скрипт всех страниц. Интерактив отдельных блоков подключается в их компонентах. */
import { initBooking } from './booking';
import { initHeader } from './header';
import { initLeadForms } from './lead';
import { initGoals } from './metrika';
import { initDialogs } from './modal';
import { initReveal } from './reveal';

initGoals();
initHeader();
initDialogs();
initLeadForms();
initBooking();
initReveal();
