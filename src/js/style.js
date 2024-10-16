import { props } from "./props.js";

/**
 * @constant {string} rippleStyle - Styles CSS pour l'effet de "ripple".
 */
export const rippleStyle = `
  .lds-ripple, .lds-ripple div {
    box-sizing: border-box;
  }
  .lds-ripple {
    display: inline-block;
    position: relative;
    width: 80px;
    height: 80px;
  }
  .lds-ripple div {
    position: absolute;
    border: 4px solid currentColor;
    opacity: 1;
    border-radius: 50%;
    animation: lds-ripple 1s cubic-bezier(0, 0.2, 0.8, 1) infinite;
  }
  .lds-ripple div:nth-child(2) {
    animation-delay: -0.5s;
  }
  @keyframes lds-ripple {
    0% { top: 36px; left: 36px; width: 8px; height: 8px; opacity: 0; }
    5% { top: 36px; left: 36px; width: 8px; height: 8px; opacity: 1; }
    100% { top: 0; left: 0; width: 80px; height: 80px; opacity: 0; }
  }
`;

/**
 * Ajuste la mise en page des éléments de l'interface utilisateur en fonction de la taille de la fenêtre.
 * Applique des styles spécifiques pour mobile, tablette et desktop.
 */
export const adjustResponsive = () => {
  const footer = document.getElementById(`${props.prefix}-footer`);
  const imageGrid = document.getElementById(`${props.prefix}-img-grid`);
  const footerLeft = document.getElementById(`${props.prefix}-footer-left`);
  const footerRight = document.getElementById(`${props.prefix}-footer-right`);
  const searchInput = document.getElementById(`${props.prefix}-search-input`);
  const dropdown = document.getElementById(`${props.prefix}-dropdown`);
  const windowWidth = window.innerWidth;

  if (windowWidth <= 500) {
    // Styles pour mobile
    footer.style.flexDirection = "column";
    footer.style.alignItems = "center";
    imageGrid.style.maxHeight = "30vh";
    searchInput.style.width = "100%";
    dropdown.style.width = "100%";
    footerLeft.style.flexDirection = "column";
    footerRight.style.justifyContent = "center";
  } else if (windowWidth <= 1024) {
    // Styles pour tablette
    footer.style.flexDirection = "row";
    footer.style.alignItems = "center";
    footer.style.justifyContent = "space-between";
    imageGrid.style.maxHeight = "60vh";
    searchInput.style.width = "45%";
    dropdown.style.width = "45%";
    footerLeft.style.flexDirection = "row";
    footerRight.style.justifyContent = "right";
  } else {
    // Styles pour desktop
    footer.style.flexDirection = "row";
    footer.style.alignItems = "center";
    footer.style.justifyContent = "space-between";
    imageGrid.style.maxHeight = "60vh";
    searchInput.style.width = "45%";
    dropdown.style.width = "45%";
    footerLeft.style.flexDirection = "row";
    footerRight.style.justifyContent = "right";
  }
};

/**
 * Injecte les styles CSS définis dans le document.
 * Crée un élément <style> et ajoute-le à l'en-tête du document.
 */
export const injectStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = rippleStyle;
  document.head.appendChild(styleSheet);
};
