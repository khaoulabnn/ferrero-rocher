// Executive Summary / campaign overview — Khaoula's overview (OPENING.overview): the campaign
// name and tagline, then its four facts as cards, each with a still from the campaign film.
import { OPENING } from './content.js';

const P = n => `assets/posters/${n}.jpg`;
const VISUAL = {
  'Market': [P('Women_sharing_chocolate_in_home')],
  'Primary objective': [P('Ferrero_Rocher_chocolate_commerc')],
  'Core message': [P('Woman_hesitating_to_send_message')],
  'Target audience': [P('Mother_giving_chocolate_to_son'), P('Men_sharing_chocolate_in_caf'), P('Woman_knocking_on_door')],
};

let inst;
export function create(el) { return inst ??= build(el); }

function build(el) {
  const obj = el.querySelector('.x-obj');
  const O = OPENING.overview;
  obj.innerHTML = O.name.split(' ').map((w, i) => `<span style="transition-delay:${.25 + i * .06}s">${w}</span>`).join(' ')
    + `<small class="x-tag">${O.tagline}</small>`;
  el.insertAdjacentHTML('beforeend', `<div class="x-cards">${O.facts.map(([k, v], i) => `
    <div class="x-card" style="--i:${i}">
      <div class="pics n${VISUAL[k].length}">${VISUAL[k].map(src => `<img src="${src}" alt="">`).join('')}</div>
      <p>${k}</p><b>${v}</b>
    </div>`).join('')}</div>`);

  return {
    enter() { el.classList.remove('is-in'); void el.offsetWidth; requestAnimationFrame(() => el.classList.add('is-in')); },
    leave() { el.classList.remove('is-in'); },
    // points along the top of the cards in stage coordinates, for the flakes to land on
    threadPoints() { return Array.from({ length: 60 }, (_, i) => ({ x: 150 + 1620 * i / 59, y: 452 + Math.sin(i / 59 * Math.PI * 2) * -6 })); },
  };
}
