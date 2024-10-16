import { constants } from "./constants.js";
import { applyFilter } from "./functions.js";
import { props } from "./props.js";
import { adjustResponsive } from "./style.js";
import { addImagesToGrid } from "./ui-elements.js";

/**
 * Configure les écouteurs d'événements pour la recherche et le filtrage des images.
 * @function
 */
export const eventListener = () => {
  let searchBar = document.querySelector(`#${props.prefix}-search-input>input`);
  let dropdown = document.getElementById(`${props.prefix}-dropdown`);

  /**
   * Gère le changement de sélection dans le dropdown.
   * Filtre les images en fonction de l'option sélectionnée et réinitialise la barre de recherche.
   * @param {Event} event - L'événement de changement sur le dropdown.
   */
  dropdown.addEventListener("change", ({ target }) => {
    let selectedOption = target.value;
    dropdown.value = selectedOption;
    if (
      selectedOption === props.defaultOption ||
      !constants.options.includes(selectedOption)
    ) {
      addImagesToGrid(constants.srcImages);
    } else {
      addImagesToGrid(applyFilter(selectedOption.toLowerCase()));
      searchBar.value = "";
    }
  });

  /**
   * Gère l'entrée dans la barre de recherche.
   * Filtre les images en fonction du terme de recherche et de la sélection dans le dropdown.
   * @param {Event} event - L'événement d'entrée sur la barre de recherche.
   */
  searchBar.addEventListener("input", ({ target }) => {
    let searchTerm = target.value.toLowerCase();
    let sectionFilter = dropdown.value;
    if (sectionFilter) {
      constants.srcImages = applyFilter(sectionFilter.toLowerCase());
    }
    addImagesToGrid(applyFilter(searchTerm, constants.srcImages));
  });

  // Écouteur d'événements pour ajuster la mise en page lors du redimensionnement de la fenêtre
  window.addEventListener("resize", adjustResponsive);
};
