import { applySearchAndFilters, eventListener } from "./events.js";
import {
  addImagesToGrid,
  loadSrcImages,
  log,
  tryLoadJson,
} from "./functions.js";
import { props } from "./props.js";
import { adjustResponsive, setCssProperties } from "./style.js";

/**
 * Creates a button with Jellyfin styling.
 *
 * @param {Object} options - Button configuration options.
 * @param {string} [options.id='createButton'] - The ID of the button.
 * @param {string} [options.textContent=`${props.prefix}-btn`] - The text displayed on the button.
 * @param {string} [options.display='block'] - The CSS display property of the button.
 * @param {function(): void} [options.onClick=() => ({} )] - The callback function to execute when the button is clicked.
 *
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
 * Creates a search bar and adds it to a specified DOM element.
 *
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
 *
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
 *
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
 *
 * @param {HTMLElement} domElement - The DOM element where the footer will be added.
 */
const createFooter = async (domElement) => {
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
  createRandomBtn(footerLeft);
  createDropdown(footerLeft);
  createSearchBar(footerLeft);

  footer.appendChild(footerLeft);

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
      onClick: () => {
        props.selectedImage = null;
        document.getElementById(`${props.prefix}-modal`).remove();
        document.getElementById(`${props.prefix}-backdrop-modal`).remove();
      },
    })
  );
  footerRight.appendChild(
    createButton({
      id: "validate",
      textContent: props.getBtnValidateLabel(),
      display: "none",
    })
  );
  footer.appendChild(footerRight);

  domElement.appendChild(footer);
};

/**
 * Creates an image and applies styles and events to it.
 *
 * @param {string} url - The URL of the image.
 * @param {number} idx - The index of the image in the list.
 * @param {boolean} isSelected - Indicates whether the image is selected.
 *
 * @returns {HTMLImageElement} The created image.
 */
export const createImage = (url, idx, isSelected = false) => {
  let img = document.createElement("img");
  img.alt = `${props.prefix} img ${idx}`;
  img.className = `blink lazy-image ${props.prefix}-img`;
  img.id = `${props.prefix}-img-${idx}`;
  img.loading = "lazy";
  img.setAttribute("data-src", url);

  setCssProperties(img, {
    borderRadius: "100%",
    width: "100px",
    height: "100px",
    margin: "auto",
    backgroundSize: "cover",
    transition: "transform 0.2s, box-shadow 0.2s, background-color 0.2s",
    filter: isSelected ? "brightness(1)" : "brightness(0.5)",
    backgroundColor: "currentColor",
    color: "currentColor",
  });
  return img;
};

/**
 * Creates or retrieves the image grid.
 *
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
 *
 * @returns {void} - This function does not return anything. It directly modifies the DOM
 *  by adding a modal to the page, integrating an image grid and a title.
 */
export const createModal = async () => {
  if (!props.getTitle()) {
    throw new Error(
      "The title of the modal must be defined in props.getTitle()."
    );
  }

  let srcImages = await loadSrcImages();
  let modal = document.createElement("div");
  //
  modal.classList.add(
    "dialogContainer",
    "focuscontainer",
    "dialog",
    "smoothScrollY",
    "ui-body-a",
    "background-theme-a",
    "formDialog",
    "centeredDialog",
    "opened",
    "actionsheet-not-fullscreen",
    "actionSheet"
  );
  modal.setAttribute("data-lockscroll", "true");
  modal.setAttribute("data-history", "true");
  modal.setAttribute("data-autofocus", "true");
  modal.setAttribute("data-removeonclose", "true");
  setCssProperties(modal, {
    animation: "160ms ease-out 0s 1 normal both running scaleup",
    margin: "95px 50px 0 50px",
  });
  modal.id = `${props.prefix}-modal`;

  let content = document.createElement("div");
  setCssProperties(content, {
    margin: "0",
    padding: "1.25em 0.5em 1.25em 0.5em",
    width: "95%",
    height: "95%",
  });

  let title = document.createElement("h2");
  setCssProperties(title, { margin: "0 0 .5em" });
  title.textContent = props.getTitle();
  content.appendChild(title);

  let imgGrid = createGridContainer();
  content.appendChild(imgGrid);

  addImagesToGrid(srcImages, imgGrid);
  createFooter(content);

  modal.appendChild(content);
  let modalbackdrop = document.createElement("div");
  modalbackdrop.id = `${props.prefix}-backdrop-modal`;
  modalbackdrop.className = "dialogBackdrop dialogBackdropOpened";
  document.body.appendChild(modalbackdrop);
  document.body.appendChild(modal);

  adjustResponsive();
  eventListener();
};

/**
 * Creates a dropdown menu with Jellyfin styling.
 *
 * @param {Object} options - Dropdown configuration options.
 * @param {string} [options.id='createDropdown'] - The ID of the dropdown.
 * @param {string} [options.labelText='Select an option'] - The label text for the dropdown.
 * @param {Array<{value: string, text: string}>} [options.items=[]] - Array of dropdown items with value and text properties.
 * @param {string} [options.defaultValue=''] - The default selected value.
 * @param {function(string): void} [options.onChange=() => ({})] - The callback function to execute when selection changes.
 *
 * @returns {HTMLElement} The dropdown container with all elements.
 */
export const createDropdown = (domElement) => {
  // Add the dropdown to a DOM element

  let idx = `${props.prefix}-dropdown-filter`;
  let dropdownExist = document.getElementById(idx);
  if (dropdownExist) {
    return dropdownExist;
  }

  // Create container for dropdown
  let dropdownContainer = document.createElement("div");
  dropdownContainer.id = idx;
  dropdownContainer.className = `${props.prefix}-dropdown-container`;
  setCssProperties(dropdownContainer, { width: "45%" });

  // Create label
  let dropdownLabel = document.createElement("label");
  dropdownLabel.classList.add(
    "inputLabel",
    "inputLabel-float",
    "inputLabelUnfocused"
  );
  dropdownLabel.setAttribute("for", `${props.prefix}-dropdown-select-filter`);
  dropdownLabel.textContent = props.getFilterLabel();

  // Create select element
  let select = document.createElement("select");
  select.id = `${props.prefix}-dropdown-select-filter`;
  select.classList.add("emby-select");

  tryLoadJson(props.getSrcCatImages()).then((folders_names) => {
    const optionAll = props.getDefaultOptionLabel();
    const defaultValue =
      folders_names[Math.floor(Math.random() * folders_names.length)];

    // Add options to select
    [optionAll, ...folders_names].forEach((item) => {
      let option = document.createElement("option");
      option.value = item;
      option.textContent = item;
      if (item === defaultValue) {
        option.selected = true;
        applySearchAndFilters({ target: { value: item } });
      }
      select.appendChild(option);
    });
    // If a default value is set, make sure label is styled correctly
    if (defaultValue) {
      dropdownLabel.classList.remove("inputLabelUnfocused");
      dropdownLabel.classList.add("inputLabelFocused");
    }
  });

  // Style the select element
  setCssProperties(select, {
    width: "100%",
  });

  // Append elements to container
  dropdownContainer.appendChild(dropdownLabel);
  dropdownContainer.appendChild(select);

  // Add CSS for focus effects to match Jellyfin styling
  select.addEventListener("focus", () => {
    dropdownLabel.classList.remove("inputLabelUnfocused");
    dropdownLabel.classList.add("inputLabelFocused");
  });

  select.addEventListener("blur", () => {
    if (!select.value) {
      dropdownLabel.classList.remove("inputLabelFocused");
      dropdownLabel.classList.add("inputLabelUnfocused");
    }
  });

  domElement.appendChild(dropdownContainer);
};

export const createRandomBtn = (domElement) => {
  let randomBtnExist = document.getElementById(`${props.prefix}-btn-random`);
  if (randomBtnExist) {
    return randomBtnExist;
  }

  const randomBtn = document.createElement("button");
  randomBtn.id = `${props.prefix}-btn-random`;
  randomBtn.setAttribute("is", "emby-button");
  randomBtn.setAttribute("type", "button");
  randomBtn.setAttribute("class", "button-flat detailButton emby-button");

  const div = document.createElement("div");

  div.setAttribute("class", "detailButton-content");

  const span = document.createElement("span");
  span.setAttribute("class", "material-icons detailButton-icon shuffle ");
  span.setAttribute("aria-hidden", "true");

  randomBtn.onclick = () => {
    let images = document.querySelectorAll(
      `#${props.prefix}-grid-container>img`
    );

    let randomImage = images[Math.floor(Math.random() * images.length)];

    randomImage.scrollIntoView({
      behavior: "smooth",
      block: "end",
      inline: "center",
    });

    document.getElementById(randomImage.id).click();
  };

  div.appendChild(span);
  randomBtn.appendChild(div);
  domElement.appendChild(randomBtn);
};
