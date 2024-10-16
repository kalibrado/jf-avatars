import { constants } from "./constants.js";
import { toggleValidateButton } from "./functions.js";
import { props } from "./props.js";

/**
 * Crée un bouton avec un style Jellyfin.
 * @param {Object} options - Options de configuration du bouton.
 * @param {string} [options.id='createButton'] - L'ID du bouton.
 * @param {string} [options.textContent=`${props.prefix}-btn`] - Le texte affiché sur le bouton.
 * @param {string} [options.display='block'] - La propriété CSS de display du bouton.
 * @param {Function} [cb=() => ({} )] - La fonction de rappel à exécuter lors du clic sur le bouton.
 * @returns {HTMLButtonElement} Le bouton créé.
 */
export const createButton = ({
  id = "createButton",
  textContent = `${props.prefix}-btn`,
  display = "block",
  onClick = () => ({}),
}) => {
  let customBtn = document.createElement("button");
  customBtn.textContent = textContent;
  customBtn.id = `${props.prefix}-btn-${id}`;
  customBtn.className = "raised button-submit emby-button";
  customBtn.style.width = "max-content";
  customBtn.style.display = display;
  customBtn.onclick = onClick;

  return customBtn;
};

/**
 * Crée un menu déroulant de filtrage et l'ajoute à un élément DOM spécifié.
 * @param {HTMLElement} domElement - L'élément DOM où le dropdown sera ajouté.
 */
export const createFilterDropdown = (domElement) => {
  let selectContainer = document.createElement("div");
  selectContainer.style.width = "50%";

  let filterLabel = document.createElement("label");
  filterLabel.classList.add("selectLabel");
  filterLabel.setAttribute("for", `${props.prefix}-dropdown`);
  filterLabel.textContent = props.filterLabel;

  let filterSelect = document.createElement("select");
  filterSelect.setAttribute("is", "emby-select");
  filterSelect.className =
    "selectDateTimeLocale emby-select-withcolor emby-select";
  selectContainer.id = `${props.prefix}-dropdown`;

  let defaultOption = document.createElement("option");
  defaultOption.textContent = props.defaultOption;
  filterSelect.appendChild(defaultOption);

  for (const option of constants.options) {
    let filterOption = document.createElement("option");
    filterOption.textContent = option;
    filterSelect.appendChild(filterOption);
  }

  selectContainer.appendChild(filterLabel);
  selectContainer.appendChild(filterSelect);

  domElement.appendChild(selectContainer);
};

/**
 * Crée une barre de recherche et l'ajoute à un élément DOM spécifié.
 * @param {HTMLElement} domElement - L'élément DOM où la barre de recherche sera ajoutée.
 */
export const createSearchBar = (domElement) => {
  let searchDiv = document.createElement("div");
  searchDiv.style.width = "45%";
  searchDiv.id = `${props.prefix}-search-input`;

  let searchLabel = document.createElement("label");
  searchLabel.classList.add(
    "inputLabel",
    "inputLabel-float",
    "inputLabelUnfocused"
  );
  searchLabel.setAttribute("for", `${props.prefix}-search-input`);
  searchLabel.textContent = props.searchLabel;

  let searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.placeholder = props.searchLabel;
  searchInput.autocomplete = "off";
  searchInput.classList.add("emby-input");

  searchDiv.appendChild(searchLabel);
  searchDiv.appendChild(searchInput);

  domElement.appendChild(searchDiv);
};

/**
 * Crée un élément de chargement de style ripple.
 * @returns {HTMLElement} L'élément de chargement.
 */
export const rippleLoader = () => {
  let id = `${props.prefix}-ripple-loader`;
  let loaderExist = document.getElementById(id);
  if (loaderExist) {
    return loaderExist;
  } else {
    let loader = document.createElement("div");
    loader.id = id;
    loader.className = "lds-ripple";
    loader.innerHTML = "<div></div><div></div>";
    return loader;
  }
};

/**
 * Affiche le loader de style ripple dans la grille d'images.
 * @returns {HTMLElement} L'élément de chargement affiché.
 */
export const showRippleLoader = () => {
  let grid = imageGrid();
  let loader = rippleLoader();
  grid.style.display = "flex";
  grid.style.alignItems = "center";
  grid.style.justifyContent = "center";
  grid.replaceChildren(loader);
  return loader;
};

/**
 * Crée le pied de page pour le modal et l'ajoute à un élément DOM spécifié.
 * @param {HTMLElement} domElement - L'élément DOM où le pied de page sera ajouté.
 */
const createFooter = (domElement) => {
  let footer = document.createElement("div");
  footer.id = `${props.prefix}-footer`;
  footer.style.marginTop = "1em";
  footer.style.display = "flex";
  footer.style.flexDirection = "row";
  footer.style.gap = "10px";
  footer.style.justifyContent = "center";
  footer.style.alignItems = "stretch";

  let footerLeft = document.createElement("div");
  footerLeft.id = `${props.prefix}-footer-left`;
  footerLeft.style.width = "100%";
  footerLeft.style.display = "flex";
  footerLeft.style.justifyContent = "space-between";

  createSearchBar(footerLeft);
  createFilterDropdown(footerLeft);

  let footerRight = document.createElement("div");
  footerRight.id = `${props.prefix}-footer-right`;
  footerRight.style.width = "20%";
  footerRight.style.display = "flex";
  footerRight.style.justifyContent = "end";
  footerRight.appendChild(
    createButton({
      id: "cancel",
      textContent: props.btnCancel,
      onClick: () => document.getElementById(`${props.prefix}-modal`).remove(),
    })
  );
  footerRight.appendChild(
    createButton({
      id: "validate",
      textContent: props.btnValidate,
      display: "none",
    })
  );

  footer.appendChild(footerLeft);
  footer.appendChild(footerRight);

  domElement.appendChild(footer);
};

/**
 * Crée une image et lui applique des styles et des événements.
 * @param {string} url - L'URL de l'image.
 * @param {number} idx - L'indice de l'image dans la liste.
 * @param {boolean} isSelected - Indique si l'image est sélectionnée.
 * @returns {HTMLImageElement} L'image créée.
 */
const createImage = (url, idx, isSelected) => {
  let img = document.createElement("img");
  img.src = url;
  img.alt = `${props.prefix} img ${idx}`;
  img.className = `${props.prefix}-img`;
  img.id = `${props.prefix}-img-${idx}`;
  img.loading = "lazy";
  img.style.borderRadius = "100%";
  img.style.width = "100px";
  img.style.height = "100px";
  img.style.margin = "auto";
  img.style.cursor = "pointer";
  img.style.backgroundSize = "cover";
  img.style.transition = "transform 0.2s, box-shadow 0.2s";
  img.style.filter = isSelected ? "grayscale(0%)" : "grayscale(100%)";

  img.onmouseover = ({ target }) => {
    if (props.selectedImage && props.selectedImage.src === target.src) return;
    img.style.transform = "scale(1.1)";
    img.style.boxShadow = "0 4px 15px rgba(0, 0, 0, 0.3)";
    img.style.filter = "grayscale(0%)";
  };

  img.onmouseout = ({ target }) => {
    if (props.selectedImage && props.selectedImage.src === target.src) return;
    img.style.transform = "scale(1)";
    img.style.boxShadow = "none";
    img.style.filter = "grayscale(100%)";
  };

  img.onclick = ({ target }) => {
    if (!target.src.endsWith(props.imageName)) {
      toggleValidateButton(img);
    }
  };
  return img;
};

/**
 * Crée ou récupère la grille d'images.
 * @returns {HTMLElement} La grille d'images.
 */
export const imageGrid = () => {
  let id = `${props.prefix}-img-grid`;
  let imgGridExist = document.getElementById(id);
  if (imgGridExist) {
    return imgGridExist;
  } else {
    let imgGrid = document.createElement("div");
    imgGrid.id = id;
    imgGrid.classList.add("image-grid");
    imgGrid.style.overflow = "auto";
    imgGrid.style.maxHeight = "60vh";
    return imgGrid;
  }
};

/**
 * Ajoute des images à la grille d'images, incluant une image sélectionnée et une image sauvegardée.
 * @param {string[]} filteredImages - Les images filtrées à ajouter à la grille.
 * @param {HTMLElement} [imgGrid=imageGrid()] - La grille d'images où les images seront ajoutées.
 */
export const addImagesToGrid = (filteredImages, imgGrid = imageGrid()) => {
  showRippleLoader();

  let allImage = [];
  filteredImages.forEach((url, idx) =>
    allImage.push(createImage(url, idx, url.endsWith(props.imageName)))
  );

  // Ajouter l'image sélectionnée, si elle existe
  if (props.selectedImage) {
    allImage.unshift(
      createImage(props.selectedImage.src, `selected-tmp`, true)
    );
  }

  // Ajouter l'image sauvegardée
  allImage.unshift(createImage(props.imageSaved, `selected`, true));

  if (allImage.length > 0) {
    imgGrid.style.display = "grid";
    imgGrid.style.gridTemplateColumns = "repeat(auto-fill, minmax(100px, 1fr))";
    imgGrid.style.gap = "10px";
    imgGrid.innerHTML = "";
    allImage.forEach((image) => imgGrid.appendChild(image));
  } else {
    console.log("Il n'y a plus rien");
  }
};

/**
 * Crée et affiche un modal avec un titre, une grille d'images, et un pied de page.
 * Réinitialise l'image sélectionnée et configure la grille d'images avec les images filtrées.
 */
export const createModal = () => {
  props.selectedImage = null;
  let modal = document.createElement("div");
  modal.classList.add(
    "focuscontainer",
    "dialog",
    "smoothScrollY",
    "ui-body-a",
    "background-theme-a",
    "formDialog",
    "centeredDialog",
    "opened"
  );
  modal.setAttribute("data-lockscroll", "true");
  modal.setAttribute("data-history", "true");
  modal.setAttribute("data-autofocus", "true");
  modal.setAttribute("data-removeonclose", "true");
  modal.style.animation = "160ms ease-out 0s 1 normal both running scaleup";
  modal.style.margin = "70px 7px auto";
  modal.id = `${props.prefix}-modal`;

  let content = document.createElement("div");
  content.style.margin = "0";
  content.style.padding = "1.25em 1.5em 1.5em";

  let title = document.createElement("h2");
  title.style.margin = "0 0 .5em";
  title.textContent = props.title;
  content.appendChild(title);

  let imgGrid = imageGrid();
  content.appendChild(imgGrid);

  if (props.imageSaved) {
    constants.srcImages = constants.srcImages.filter(
      (url) => !url.endsWith(props.imageName)
    );
  }

  addImagesToGrid(constants.srcImages, imgGrid);
  createFooter(content);

  modal.appendChild(content);
  document.body.appendChild(modal);
};
