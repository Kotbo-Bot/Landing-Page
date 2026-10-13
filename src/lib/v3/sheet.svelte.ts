/**
 * Ouverture de la liste des salons sur téléphone et tablette, partagée entre
 * les barres de salon (qui l'ouvrent) et le panneau (`ChannelSheet`).
 */
let open = $state(false);

export const channelSheet = {
  get open() {
    return open;
  },
  show() {
    open = true;
  },
  hide() {
    open = false;
  },
};
