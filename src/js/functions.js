import { props } from "./props.js";
import { setCssProperties } from "./style.js";
import {
  createImage,
  createGridContainer,
  showRippleLoader,
} from "./ui-elements.js";

/**
 * Logs data to the console when debug mode is enabled.
 *
 * This function checks the `debug` property in the `props` object to determine
 * whether to log the provided data. If debug mode is enabled, it organizes the log output
 * into a console group for better readability and includes additional metadata like timestamps.
 *
 * @param {...*} data - The data to log to the console. This can include any number of arguments,
 * including strings, numbers, objects, or arrays.
 *
 * @example
 * // Example usage:
 * log('This is a debug message', { key: 'value' });
 */
export const log = (...data) => {
  try {
    if (!props?.debug()) return;

    const timestamp = new Date().toLocaleString();

    console.group(
      `%c######### ${props.prefix} #########`,
      "color: #3498db; font-weight: bold;"
    );
    console.log(`%c${timestamp}`, "color: #2ecc71;");

    data.forEach((item) => {
      const type = typeof item;
      if (type === "object") {
        if (item === null) {
          console.log(null);
        } else if (Array.isArray(item)) {
          console.table(item);
        } else if (item instanceof Error) {
          console.error(item);
        } else {
          console.dir(item, { depth: null, colors: true });
        }
      } else {
        console.log(item);
      }
    });

    console.groupEnd();
  } catch (error) {
    console.error("An error occurred in the log function:", error);
  }
};

/**
 * Retrieves the image saved in local storage.
 * @function
 * @returns {?string} - The selected image, or null if no image is saved.
 */
export const getsrcImagesaved = () =>
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
  timeout = 1000
) => {
  const start = Date.now();
  const checkExist = setInterval(() => {
    const element = document.querySelector(selector);
    const elapsed = Date.now() - start;
    log(`Wait Element ${selector}`);
    if (element) {
      log(`Element ${element?.id || element?.textContent} founded`);
      clearInterval(checkExist);
      callback();
    }
    if (elapsed >= timeout) {
      clearInterval(checkExist);
      log(`Element ${selector} not found within timeout period.`);
    }
  }, interval);
};

export const getProfileImageUrl = () =>
  document
    .querySelector(
      'div[class="headerButton headerButtonRight paper-icon-button-light headerUserButtonRound"]'
    )
    .style.backgroundImage.split('"')[1];

/**
 * Applies a filter to an array of image URLs.
 * @param {string} by - The filtering criterion.
 * @param {Array<string>} [base=[]] - The array of str to filter.
 * @returns {Array<string>} - A filtered array containing matching str.
 * @description Allows searching for srcImages in an array based on a specified criterion.
 */
export const applyFilter = (by, base = []) => {
  return base.filter((str) => str.toLowerCase().includes(by));
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
    .then((result) => log("User image successfully updated:", result))
    .catch((error) => log("Error updating the image:", error))
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
 * Adds srcImages to the image grid, including a selected image and a saved image.
 *
 * This function manages the display of srcImages in the grid, adjusts styles to
 * ensure the grid is properly configured, and checks for the presence
 * of selected and saved srcImages.
 *
 * @param {string[]} srcImages - The filtered srcImages to add to the grid.
 * Each image URL should be a valid string.
 * @param {HTMLElement} [imgGrid=createGridContainer()] - The image grid where srcImages will be added.
 * If not specified, a default grid will be used, created by the function `createGridContainer()`.
 * @throws {Error} If no srcImages are provided in `srcImages` or if `imgGrid` is not a valid element.
 * @returns {void} - This function does not return anything. It directly modifies the DOM
 * to display srcImages in the grid.
 */
export const addImagesToGrid = async (
  srcImages = [],
  imgGrid = createGridContainer()
) => {
  if (!(imgGrid instanceof HTMLElement)) {
    throw new Error("imgGrid must be a valid HTML element.");
  }
  showRippleLoader();

  let allImage = [];

  srcImages.forEach((img, idx) => {
    let url = img?.url || img?.imageUrl || img?.link || img?.src;
    allImage.push(createImage(url, idx));
  });
  // Add the selected image if it exists
  if (props.selectedImage) {
    allImage.unshift(
      createImage(props.selectedImage.src, `selected-tmp`, true)
    );
  }

  allImage.unshift(createImage(getProfileImageUrl(), `selected`, true));

  if (allImage.length > 0) {
    setCssProperties(imgGrid, {
      display: "grid",
      gridTemplateColumns: "repeat(auto-fill, minmax(100px, 1fr))",
      gap: "10px",
    });
    imgGrid.innerHTML = "";
    allImage.forEach((image) => imgGrid.appendChild(image));
  } else {
    log("No more srcImages available.");
  }
};

export const loadSrcImages = async () => {
  let pathCustom = props.getSrcImages();
  let data = [];

  // Vérifier si les données sont dans le localStorage
  const storageKey = `${props.prefix}-srcImages`;
  const storedData = localStorage.getItem(storageKey);

  if (storedData) {
    try {
      const parsedData = JSON.parse(storedData);
      const storedDate = new Date(parsedData.timestamp);
      const currentDate = new Date();

      // Vérifier si les données ont moins d'un jour
      const oneDayInMs = 24 * 60 * 60 * 1000;
      if (
        currentDate - storedDate < oneDayInMs &&
        parsedData.src === pathCustom
      ) {
        log(
          `Using cached srcImages (${parsedData.data.length}) from localStorage`
        );
        return parsedData.data;
      }
      // Sinon, les données sont périmées et seront rechargées
    } catch (e) {
      log("Error parsing stored data:", e);
      // En cas d'erreur de parsing, continuer et recharger les données
    }
  }

  // Charger les données depuis l'URL
  try {
    const response = await fetch(pathCustom);
    if (!response.ok) {
      throw new Error("Fail to load srcImages");
    }

    data = await response.json();
    log(`srcImages loaded ${data.length}`);

    // Sauvegarder les données dans le localStorage avec un timestamp
    const storageData = {
      src: pathCustom,
      timestamp: new Date().toISOString(),
      data: data,
    };

    localStorage.setItem(storageKey, JSON.stringify(storageData));

    return data;
  } catch (error) {
    log("Erreur :", error);
    return [];
  }
};

/**
 * Load the user's preferred language or fallback to a default language if not available.
 * The function tries to load the language file from a local source first, then falls back to a GitHub repository.
 */
export const loadLanguage = async () => {
  const userLang = navigator.language.split("-")[0]; // Main language (e.g., "fr")
  const defaultLang = "en"; // Default language

  let selectedLang = userLang; // Selected language
  let translations = {};

  /**
   * Attempts to load a language file from a given URL.
   * @param {string} url - The URL of the JSON file to load.
   * @returns {Promise<Object|null>} The loaded data if successful, null otherwise.
   */
  const tryLoadJson = async (url) => {
    try {
      log(`Attempting to load: ${url}`);
      const response = await fetch(url, {
        cache: "no-store", // Forces no cache
      });
      if (!response.ok) throw new Error(`File ${url} not found`);

      const data = await response.json();
      log("JSON loaded:", data);
      return data;
    } catch (error) {
      log(`Error loading from: ${url}, ${error.message}`);
      return null;
    }
  };

  /**
   * Load a language file from local or GitHub URL.
   * @param {string} lang - The language code (e.g., "fr", "en").
   * @returns {Promise<Object|null>} The loaded translations if successful, null otherwise.
   */
  const loadJson = async (lang) => {
    const localUrl = `${window.location.origin}/web/jf-avatars/src/lang/${lang}.json`;
    const fallbackUrl = `https://raw.githubusercontent.com/kalibrado/jf-avatars/refs/heads/main/src/lang/${lang}.json`;

    // Try loading from local URL first, then from GitHub if failed
    let data = await tryLoadJson(localUrl);
    if (!data) {
      log(`Attempting to load from GitHub...`);
      data = await tryLoadJson(fallbackUrl);
    }

    return data;
  };

  // Load the user's preferred language
  translations = await loadJson(selectedLang);

  // If the selected language is unavailable, load the default language
  if (!translations) {
    translations = await loadJson(defaultLang);
  }
  // Final check if translations are not available
  if (!translations) {
    log("Unable to load language files.");
    translations = {};
  }
  // Store translations globally
  window.i18n = translations;
};
