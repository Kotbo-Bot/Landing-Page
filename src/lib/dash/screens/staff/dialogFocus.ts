/**
 * Clavier des fenêtres de l'écran Équipe : la `Modal` partagée ne prend pas
 * le focus à l'ouverture et n'entend Échap que sur son fond. Ces deux aides
 * donnent le focus au premier champ de la dernière fenêtre ouverte, puis le
 * rendent à l'élément d'origine à la fermeture.
 */
import { tick } from 'svelte';

const FIELDS = 'input:not([disabled]), textarea:not([disabled]), select:not([disabled])';
const FOCUSABLE = `${FIELDS}, button:not([disabled])`;

/** Donne le focus au premier contrôle de la fenêtre ouverte en dernier. */
export async function focusLastDialog(fieldsFirst = true, selector = '.staff-screen .app-modal__panel'): Promise<void> {
  await tick();
  const panels = document.querySelectorAll<HTMLElement>(selector);
  const panel = panels[panels.length - 1];
  if (!panel) return;
  const body = panel.querySelector<HTMLElement>('.app-modal__body');
  // Un champ d'abord : taper au clavier ne doit pas déclencher un bouton (« Changer »).
  const target =
    (fieldsFirst ? body?.querySelector<HTMLElement>(FIELDS) : null) ?? body?.querySelector<HTMLElement>(FOCUSABLE) ?? panel.querySelector<HTMLElement>(FOCUSABLE);
  target?.focus();
}

/**
 * Suit l'ouverture d'une fenêtre : `open(key)` à chaque changement d'état,
 * clé vide quand tout est fermé. Retient où était le focus et l'y remet.
 */
export function dialogFocus(fieldsFirst = true) {
  let previous = '';
  let origin: HTMLElement | null = null;
  return (key: string) => {
    if (key && key !== previous) {
      if (!previous) origin = document.activeElement as HTMLElement | null;
      void focusLastDialog(fieldsFirst);
    } else if (!key && previous) {
      const back = origin;
      origin = null;
      void tick().then(() => {
        if (back?.isConnected) back.focus();
      });
    }
    previous = key;
  };
}
