/**
 * Comportement clavier des fenêtres de l'écran Tickets.
 *
 * Le dashboard ferme ses fenêtres à Échap au niveau de la page ; l'aperçu vit
 * dans une page du site et ne doit rien écouter hors de son cadre. L'action se
 * pose donc sur la fenêtre elle-même : focus sur le premier champ à
 * l'ouverture, Échap pour fermer, Tab qui reste dedans, focus rendu à la
 * fermeture.
 */
const FOCUSABLE = 'input:not([disabled]), textarea:not([disabled]), select:not([disabled]), button:not([disabled]), [href], [tabindex]:not([tabindex="-1"])';

export function dialog(node: HTMLElement, onclose: () => void) {
  let close = onclose;
  const previous = document.activeElement as HTMLElement | null;

  const focusables = () => [...node.querySelectorAll<HTMLElement>(FOCUSABLE)].filter((el) => el.offsetParent !== null || el === document.activeElement);

  requestAnimationFrame(() => {
    const preferred = node.querySelector<HTMLElement>('[data-autofocus]')
      ?? node.querySelector<HTMLElement>('input:not([type="checkbox"]):not([disabled]), textarea:not([disabled])')
      ?? focusables()[0];
    preferred?.focus();
  });

  function onkeydown(event: KeyboardEvent) {
    if (event.key === 'Escape') {
      event.stopPropagation();
      event.preventDefault();
      close();
      return;
    }
    if (event.key !== 'Tab') return;
    const items = focusables();
    if (items.length === 0) return;
    const first = items[0];
    const last = items[items.length - 1];
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault();
      last.focus();
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault();
      first.focus();
    }
  }

  node.addEventListener('keydown', onkeydown);
  return {
    update(next: () => void) {
      close = next;
    },
    destroy() {
      node.removeEventListener('keydown', onkeydown);
      if (previous && document.contains(previous)) previous.focus();
    },
  };
}
