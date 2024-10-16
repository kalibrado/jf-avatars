/**
 * Fichier principal pour l'intégration de la fonctionnalité de suggestion d'avatars dans Jellyfin.
 * Il attend qu'un élément soit disponible, puis injecte les styles, crée un bouton et une modal.
 */

import { eventListener } from "./events.js"; // Gère les événements de la modal.
import { waitForElement } from "./functions.js"; // Attends qu'un élément soit disponible dans le DOM.
import { props } from "./props.js"; // Contient les propriétés et les sélecteurs.
import { adjustResponsive, injectStyles } from "./style.js"; // Gère les styles et la réactivité.
import { createButton, createModal } from "./ui-elements.js"; // Crée des éléments d'interface utilisateur.

/**
 * Attends que l'élément pour ouvrir la modal soit disponible,
 * puis injecte les styles et crée un bouton pour afficher la modal.
 */
waitForElement(props.jfElementInjectBtnOpenModal, () => {
  injectStyles(); // Injecte les styles nécessaires.

  // Crée un bouton pour afficher la modal avant l'élément spécifié.
  document.querySelector(props.jfElementInjectBtnOpenModal).before(
    createButton({
      id: "show-modal",
      textContent: props.btnShow,
      onClick: () => {
        // Fonction à exécuter lors du clic sur le bouton.
        let imageSaved = window.localStorage.getItem(
          `${props.prefix}-selected-img`
        );
        props.imageName = imageSaved
          ? imageSaved.substring(imageSaved.lastIndexOf("/") + 1)
          : null;
        props.imageSaved = imageSaved;
        createModal(); // Crée la modal.
        adjustResponsive(); // Ajuste la modal pour la réactivité.
        eventListener(); // Initialise les écouteurs d'événements.
      },
    })
  );
});
