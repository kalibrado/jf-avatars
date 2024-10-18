import { props } from "./props.js";
import { setCssProperties } from "./style.js";
import {
  createImage,
  createGridContainer,
  showRippleLoader,
} from "./ui-elements.js";

/**
 * Retrieves the image saved in local storage.
 * @function
 * @returns {?string} - The selected image, or null if no image is saved.
 */
export const getImageSaved = () =>
  window.localStorage.getItem(`${props.prefix}-selected-img`) || null;

/**
 * Displays or hides the validate button when an image is selected.
 * @param {HTMLElement} img - The selected image.
 * @description Modifies the style of the selected image to indicate that it is active.
 */
export const toggleValidateButton = (img) => {
  const validateButton = document.querySelector(
    `button[id='${props.prefix}-btn-validate']`
  );

  img.onmouseover = () => ({});
  img.onmouseout = () => ({});

  setCssProperties(validateButton, { display: "block" });
  validateButton.onclick = () => onSelectImage(img.src);

  if (props.selectedImage) {
    setCssProperties(props.selectedImage, { filter: "brightness(0.5)" });
  }

  props.selectedImage = img;

  setCssProperties(props.selectedImage, { filter: "brightness(1)" });
};

/**
 * Waits for an element to be present in the DOM before executing a callback.
 * @param {string} selector - CSS selector of the element to check.
 * @param {Function} callback - Function to execute when the element is found.
 * @param {number} [interval=100] - Interval in milliseconds between each check.
 * @param {number} [timeout=5000] - Maximum time before giving up the search.
 * @description Used to ensure that an element is ready to be manipulated before executing an action.
 */
export const waitForElement = (
  selector,
  callback,
  interval = 100,
  timeout = 5000
) => {
  const start = Date.now();
  const checkExist = setInterval(() => {
    const element = document.querySelector(selector);
    const elapsed = Date.now() - start;
    if (element) {
      clearInterval(checkExist);
      callback();
    }
    if (elapsed >= timeout) {
      clearInterval(checkExist);
      console.error(`Element ${selector} not found within timeout period.`);
    }
  }, interval);
};

/**
 * Applies a filter to an array of image URLs.
 * @param {string} by - The filtering criterion.
 * @param {Array<string>} [base=[]] - The array of URLs to filter.
 * @returns {Array<string>} - A filtered array containing matching URLs.
 * @description Allows searching for images in an array based on a specified criterion.
 */
export const applyFilter = (by, base = []) => {
  return base.filter((url) => url.toLowerCase().includes(by));
};

/**
 * Converts an image from a URL to base64.
 * @param {string} src - The URL of the image to convert.
 * @returns {Promise<string>} - A promise that resolves to the base64 string of the image.
 * @description Used to obtain a base64 representation of an image for easier use.
 */
export const convertImageToBase64 = async (src) => {
  const response = await fetch(src);
  const blob = await response.blob();
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onloadend = () => resolve(reader.result);
    reader.onerror = reject;
    reader.readAsDataURL(blob);
  });
};

/**
 * Updates the user's profile image with the selected image.
 * @param {string} src - The URL of the selected image.
 * @returns {Promise<void>} - A promise that resolves when the image has been updated.
 * @description Sends the selected image to the server to update the user's profile image.
 */
export const onSelectImage = async (src) => {
  showRippleLoader();
  const credentials = JSON.parse(localStorage.getItem("jellyfin_credentials"));
  const server = credentials.Servers[0];
  const { AccessToken, UserId } = server;
  let DevicId = null;

  // Loop through all keys in localStorage
  for (let i = 0; i < localStorage.length; i++) {
    const key = localStorage.key(i);
    if (key && key.startsWith("_device")) {
      const value = localStorage.getItem(key);
      DevicId = value;
    }
  }

  const base64Image = await convertImageToBase64(src);
  fetch(`/Users/${UserId}/Images/Primary`, {
    headers: {
      accept: "*/*",
      "accept-language": "fr-FR,fr;q=0.9,en-US;q=0.8,en;q=0.7",
      authorization: `MediaBrowser Client="Jellyfin Web", Device="Chrome", DeviceId="${DevicId}", Version="10.9.11", Token="${AccessToken}"`,
      "content-type": "image/png",
    },
    referrerPolicy: "no-referrer",
    body: base64Image.split(",")[1],
    method: "POST",
  })
    .then((result) => console.log("User image successfully updated:", result))
    .catch((error) => console.error("Error updating the image:", error))
    .finally(() => {
      const backgroundImage = `url('${src}')`;
      setCssProperties(document.getElementById("image"), { backgroundImage });
      document.querySelector(
        ".headerUserButtonRound"
      ).innerHTML = `<div class="headerButton headerButtonRight paper-icon-button-light headerUserButtonRound" style="background-image:${backgroundImage};"></div>`;
      window.localStorage.setItem(`${props.prefix}-selected-img`, src);
      document.getElementById(`${props.prefix}-modal`).remove();
    });
};

/**
 * Adds images to the image grid, including a selected image and a saved image.
 *
 * This function manages the display of images in the grid, adjusts styles to
 * ensure the grid is properly configured, and checks for the presence
 * of selected and saved images.
 *
 * @param {string[]} filteredImages - The filtered images to add to the grid.
 * Each image URL should be a valid string.
 * @param {HTMLElement} [imgGrid=createGridContainer()] - The image grid where images will be added.
 * If not specified, a default grid will be used, created by the function `createGridContainer()`.
 * @throws {Error} If no images are provided in `filteredImages` or if `imgGrid` is not a valid element.
 * @returns {void} - This function does not return anything. It directly modifies the DOM
 * to display images in the grid.
 */
export const addImagesToGrid = (
  filteredImages,
  imgGrid = createGridContainer()
) => {
  showRippleLoader();

  if (!(imgGrid instanceof HTMLElement)) {
    throw new Error("imgGrid must be a valid HTML element.");
  }

  let allImage = [];
  filteredImages.forEach((url, idx) =>
    allImage.push(createImage(url, idx, url.endsWith(props.imageName)))
  );

  // Add the selected image if it exists
  if (props.selectedImage) {
    allImage.unshift(
      createImage(props.selectedImage.src, `selected-tmp`, true)
    );
  }

  // Add the saved image
  allImage.unshift(createImage(props.imageSaved, `selected`, true));

  if (allImage.length > 0) {
    setCssProperties(imgGrid, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: "10px",
    });
    imgGrid.innerHTML = "";
    allImage.forEach((image) => imgGrid.appendChild(image));
  } else {
    console.log("No more images available.");
  }
};
