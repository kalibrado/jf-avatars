import { props } from "./props.js";
import { showRippleLoader } from "./ui-elements.js";

/**
 * Affiche ou masque le bouton de validation lors de la sélection d'une image.
 * @param {HTMLElement} img - L'image sélectionnée.
 */
export const toggleValidateButton = (img) => {
  const images = document.getElementsByClassName(`${props.prefix}-img`);
  const validateButton = document.querySelector(
    `button[id='${props.prefix}-btn-validate']`
  );

  img.onmouseover = () => ({});
  img.onmouseout = () => ({});

  validateButton.style.display = "block";
  validateButton.onclick = () => onSelectImage(img.src);

  if (props.selectedImage) {
    props.selectedImage.style.filter = "grayscale(100%)";
  }

  props.selectedImage = img;

  props.selectedImage.style.filter = "grayscale(0%)";
};

/**
 * Attend qu'un élément soit présent dans le DOM avant d'exécuter un callback.
 * @param {string} selector - Sélecteur CSS de l'élément à vérifier.
 * @param {Function} callback - Fonction à exécuter lorsque l'élément est trouvé.
 * @param {number} [interval=100] - Intervalle en millisecondes entre chaque vérification.
 * @param {number} [timeout=5000] - Délai maximum avant d'abandonner la recherche.
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
 * Applique un filtre sur un tableau d'URL d'images.
 * @param {string} by - Le critère de filtrage.
 * @param {Array<string>} [base=[]] - Le tableau d'URL à filtrer.
 * @returns {Array<string>} - Un tableau filtré contenant les URL correspondantes.
 */
export const applyFilter = (by, base = []) => {
  return base.filter((url) => url.toLowerCase().includes(by));
};

/**
 * Convertit une image à partir d'une URL en base64.
 * @param {string} src - L'URL de l'image à convertir.
 * @returns {Promise<string>} - Une promesse qui résout la chaîne base64 de l'image.
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
 * Met à jour l'image de profil de l'utilisateur avec l'image sélectionnée.
 * @param {string} src - L'URL de l'image sélectionnée.
 * @returns {Promise<void>} - Une promesse qui se résout lorsque l'image a été mise à jour.
 */
export const onSelectImage = async (src) => {
  showRippleLoader();
  const credentials = JSON.parse(localStorage.getItem("jellyfin_credentials"));
  const server = credentials.Servers[0];
  const { AccessToken, UserId } = server;
  let DevicId = null;

  // Parcours toutes les clés dans le localStorage
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
      authorization: `MediaBrowser Client="Jellyfin Web", Device="Chrome",DeviceId="${DevicId}", Version="10.9.11", Token="${AccessToken}"`,
      "content-type": "image/png",
    },
    referrerPolicy: "no-referrer",
    body: base64Image.split(",")[1],
    method: "POST",
  })
    .then((result) =>
      console.log("Image utilisateur mise à jour avec succès:", result)
    )
    .catch((error) =>
      console.error("Erreur lors de la mise à jour de l'image:", error)
    )
    .finally(() => {
      const backgroundImage = `url('${src}')`;
      document.getElementById("image").style.backgroundImage = backgroundImage;
      document.querySelector(
        ".headerUserButtonRound"
      ).innerHTML = `<div class="headerButton headerButtonRight paper-icon-button-light headerUserButtonRound" style="background-image:${backgroundImage};"></div>`;
      window.localStorage.setItem(`${props.prefix}-selected-img`, src);
      document.getElementById(`${props.prefix}-modal`).remove();
    });
};
