/**
 * Notifications de l'écran Tickets : le `toast` du dashboard
 * (`lib/stores/toast.svelte.ts`), réduit à ce que l'aperçu affiche.
 */
export type ToastType = 'success' | 'error' | 'warning' | 'info';
export type ToastItem = { id: number; type: ToastType; message: string };

export function createToasts() {
  let items = $state<ToastItem[]>([]);
  let next = 0;

  function remove(id: number) {
    items = items.filter((item) => item.id !== id);
  }

  function push(type: ToastType, message: string) {
    const id = ++next;
    // Trois au plus : l'aperçu n'a pas la hauteur d'un écran.
    items = [...items.slice(-2), { id, type, message }];
    setTimeout(() => remove(id), 3500);
  }

  return {
    get items() {
      return items;
    },
    remove,
    success: (message: string) => push('success', message),
    error: (message: string) => push('error', message),
  };
}

export type Toasts = ReturnType<typeof createToasts>;
