import { constants } from "./constants.js";
import { addImagesToGrid, toggleValidateButton } from "./functions.js";
import { props } from "./props.js";
import { setCssProperties } from "./style.js";

/**
 * Creates a button with Jellyfin styling.
 * @param {Object} options - Button configuration options.
 * @param {string} [options.id='createButton'] - The ID of the button.
 * @param {string} [options.textContent=`${props.prefix}-btn`] - The text displayed on the button.
 * @param {string} [options.display='block'] - The CSS display property of the button.
 * @param {function(): void} [options.onClick=() => ({} )] - The callback function to execute when the button is clicked.
 * @returns {HTMLButtonElement} The created button.
 */
export const createButton = ({
  id = "createButton",
  textContent = `${props.prefix}-btn`,
  display = "block",
  onClick = () => ({}),
}) => {
  let idx = `${props.prefix}-btn-${id}`;
  let btnExist = document.getElementById(idx);
  if (btnExist) {
    return btnExist;
  }

  let customBtn = document.createElement("button");
  customBtn.textContent = textContent;
  customBtn.id = idx;
  customBtn.className = "raised button-submit emby-button";
  customBtn.onclick = onClick;
  setCssProperties(customBtn, {
    width: "max-content",
    display: display,
  });

  return customBtn;
};

/**
 * Creates a filter dropdown and adds it to a specified DOM element.
 * @param {HTMLElement} domElement - The DOM element where the dropdown will be added.
 */
export const createFilterDropdown = (domElement) => {
  let selectContainer = document.createElement("div");
 
  setCssProperties(selectContainer, { width: "auto" });
  selectContainer.id = `${props.prefix}-dropdown-container`;

  let filterLabel = document.createElement("label");
  filterLabel.classList.add("selectLabel");
  filterLabel.setAttribute("for", `${props.prefix}-dropdown`);
  filterLabel.textContent = props.getFilterLabel();

  let filterSelect = document.createElement("select");
  filterSelect.setAttribute("is", "emby-select");
  filterSelect.className =
    "selectDateTimeLocale emby-select-withcolor emby-select";
  filterSelect.id = `${props.prefix}-dropdown`;

  let defaultOption = document.createElement("option");
  defaultOption.textContent = props.getDefaultOptionLabel();
  defaultOption.value = props.getDefaultOptionLabel();
  filterSelect.appendChild(defaultOption);

  for (const option of constants.options) {
    let filterOption = document.createElement("option");
    filterOption.textContent = option;
    filterOption.value = option;
    filterSelect.appendChild(filterOption);
  }

  selectContainer.appendChild(filterLabel);
  selectContainer.appendChild(filterSelect);

  domElement.appendChild(selectContainer);
};

/**
 * Creates a search bar and adds it to a specified DOM element.
 * @param {HTMLElement} domElement - The DOM element where the search bar will be added.
 */
export const createSearchBar = (domElement) => {
  let searchDiv = document.createElement("div");
  setCssProperties(searchDiv, { width: "auto" });
  searchDiv.id = `${props.prefix}-search-container`;

  let searchLabel = document.createElement("label");
  searchLabel.classList.add(
    "inputLabel",
    "inputLabel-float",
    "inputLabelUnfocused"
  );
  searchLabel.setAttribute("for", `${props.prefix}-search-input`);
  searchLabel.textContent = props.getSearchLabel();

  let searchInput = document.createElement("input");
  searchInput.type = "text";
  searchInput.id = `${props.prefix}-search-input`;
  searchInput.placeholder = props.getSearchLabel();
  searchInput.autocomplete = "off";
  searchInput.classList.add("emby-input");

  searchDiv.appendChild(searchLabel);
  searchDiv.appendChild(searchInput);

  domElement.appendChild(searchDiv);
};

/**
 * Creates a ripple-style loading element.
 * @returns {HTMLElement} The loading element.
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
 * Displays the ripple loading element in the image grid.
 * @returns {HTMLElement} The displayed loading element.
 */
export const showRippleLoader = () => {
  let grid = createGridContainer();
  let loader = rippleLoader();
  setCssProperties(grid, {
    display: "flex",
    alignItems: "center",
    justifyContent: "center",
  });
  grid.replaceChildren(loader);
  return loader;
};

/**
 * Creates the footer for the modal and adds it to a specified DOM element.
 * @param {HTMLElement} domElement - The DOM element where the footer will be added.
 */
const createFooter = (domElement) => {
  let footer = document.createElement("div");
  footer.id = `${props.prefix}-footer-container`;
  setCssProperties(footer, {
    marginTop: "1em",
    display: "flex",
    flexDirection: "row",
    gap: "10px",
    justifyContent: "center",
    alignItems: "stretch",
  });

  let footerLeft = document.createElement("div");
  footerLeft.id = `${props.prefix}-footer-left`;
  setCssProperties(footerLeft, {
    width: "100%",
    display: "flex",
    justifyContent: "space-between",
  });

  createSearchBar(footerLeft);
  createFilterDropdown(footerLeft);

  let footerRight = document.createElement("div");
  footerRight.id = `${props.prefix}-footer-right`;
  setCssProperties(footerRight, {
    width: "20%",
    display: "flex",
    justifyContent: "end",
  });
  footerRight.appendChild(
    createButton({
      id: "cancel",
      textContent: props.getBtnCancelLabel(),
      onClick: () => document.getElementById(`${props.prefix}-modal`).remove(),
    })
  );
  footerRight.appendChild(
    createButton({
      id: "validate",
      textContent: props.getBtnValidateLabel(),
      display: "none",
    })
  );

  footer.appendChild(footerLeft);
  footer.appendChild(footerRight);

  domElement.appendChild(footer);
};

/**
 * Creates an image and applies styles and events to it.
 * @param {string} url - The URL of the image.
 * @param {number} idx - The index of the image in the list.
 * @param {boolean} isSelected - Indicates whether the image is selected.
 * @returns {HTMLImageElement} The created image.
 */
export const createImage = (url, idx, isSelected) => {
  let img = document.createElement("img");
  img.setAttribute("data-src", url)
  img.alt = `${props.prefix} img ${idx}`;
  img.className = `lazy-image ${props.prefix}-img`;
  img.id = `${props.prefix}-img-${idx}`;
  img.loading = "lazy";
  setCssProperties(img, {
    borderRadius: "100%",
    width: "100px",
    height: "100px",
    margin: "auto",
    cursor: "pointer",
    backgroundSize: "cover",
    transition: "transform 0.2s, box-shadow 0.2s",
    filter: isSelected ? "brightness(1)" : "brightness(0.5)",
  });

  img.onmouseover = ({ target }) => {
    if (props.selectedImage && props.selectedImage.src === target.src) return;
    setCssProperties(img, {
      transform: "scale(1.1)",
      boxShadow: "0 4px 15px rgba(0, 0, 0, 0.3)",
      filter: "brightness(1)",
    });
  };

  img.onmouseout = ({ target }) => {
    if (props.selectedImage && props.selectedImage.src === target.src) return;
    setCssProperties(img, {
      transform: "scale(1)",
      boxShadow: "none",
      filter: "brightness(0.5)",
    });
  };

  img.onclick = ({ target }) => {
    if (!target.src.endsWith(props.imageName)) {
      toggleValidateButton(img);
    }
  };
  return img;
};

/**
 * Creates or retrieves the image grid.
 * @returns {HTMLElement} The image grid.
 */
export const createGridContainer = () => {
  let id = `${props.prefix}-grid-container`;
  let imgGridExist = document.getElementById(id);
  if (imgGridExist) {
    return imgGridExist;
  } else {
    let imgGrid = document.createElement("div");
    imgGrid.id = id;
    imgGrid.classList.add("image-grid");
    setCssProperties(imgGrid, {
      overflow: "auto",
      maxHeight: "60vh",
      overflowX: "hidden",
    });
    return imgGrid;
  }
};

/**
 * Creates and displays a modal with a title, an image grid, and a footer.
 *
 * This function resets the selected image, creates a new modal element,
 * configures the necessary styles and attributes, and calls the function
 * `addImagesToGrid` to populate the image grid with the filtered images.
 *
 * @throws {Error} If `props.getTitle()` is not defined or if `createGridContainer()` fails to create a grid.
 * @returns {void} - This function does not return anything. It directly modifies the DOM
 *  by adding a modal to the page, integrating an image grid and a title.
 */
export const createModal = () => {
  if (!props.getTitle()) {
    throw new Error(
      "The title of the modal must be defined in props.getTitle()."
    );
  }

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
  setCssProperties(modal, {
    animation: "160ms ease-out 0s 1 normal both running scaleup",
    margin: "90px 50px 0 50px",
  });
  modal.id = `${props.prefix}-modal`;

  let content = document.createElement("div");
  setCssProperties(content, {
    margin: "0",
    padding: "1.25em 0.5em 1.25em 0.5em",
  });

  let title = document.createElement("h2");
  setCssProperties(title, { margin: "0 0 .5em" });
  title.textContent = props.getTitle();
  content.appendChild(title);

  let imgGrid = createGridContainer();
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
