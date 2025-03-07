import { log } from "./functions.js";
import { props } from "./props.js";

/**
 * Sets the CSS properties of a given element.
 *
 * @param {HTMLElement} element - The element to apply the styles to.
 * @param {Object<string, string>} styles - An object containing key-value pairs of CSS properties.
 * @returns {void}
 * @description This function dynamically applies CSS styles to an element.
 */
export const setCssProperties = (element, styles) => {
  for (let property in styles) {
    if (styles.hasOwnProperty(property)) {
      element.style[property] = styles[property];
    }
  }
};

/**
 * @constant {string} rippleStyle - CSS styles for the "ripple" effect.
 * @description Defines the CSS styles used for the "ripple" effect applied to elements.
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
  @keyframes blink {
    from { transform: scale(0.1); opacity: 1;}
    to { transform: scale(1); opacity: 0;}
  }

  .blink {
    animation: blink 1s infinite;
  }
`;

/**
 * Adjusts the layout of UI elements based on the window size.
 *
 * @function
 * @description Applies specific styles for mobile, tablet, and desktop layouts. 
 * It targets elements such as the footer, search input, and grid container.
 * @returns {void}
 */
export const adjustResponsive = () => {
  const footer = document.getElementById(`${props.prefix}-footer-container`);
  const searchInput = document.getElementById(
    `${props.prefix}-search-container`
  );

  const gridContainer = document.getElementById(
    `${props.prefix}-grid-container`
  );

  const footerLeft = document.getElementById(`${props.prefix}-footer-left`);
  const footerRight = document.getElementById(`${props.prefix}-footer-right`);

  const windowWidth = window.innerWidth;

  if (windowWidth <= 500) {
    // Mobile styles
    setCssProperties(footer, {
      flexDirection: "column",
      alignItems: "center",
    });
    setCssProperties(gridContainer, {
      maxHeight: "45vh",
    });
    setCssProperties(searchInput, {
      width: "100%",
    });

    setCssProperties(footerLeft, {
      flexDirection: "column",
    });
    setCssProperties(footerRight, {
      justifyContent: "center",
    });
  } else if (windowWidth <= 1024) {
    // Tablet styles
    setCssProperties(footer, {
      flexDirection: "row",
      alignItems: "center",
      justifyContent: "space-between",
    });
    setCssProperties(gridContainer, {
      maxHeight: "60vh",
    });
    setCssProperties(searchInput, {
      width: "100%",
    });
    setCssProperties(footerLeft, {
      width: "100%",
      display: "flex",
      justifyContent: "center",
      flexDirection: "column",
      alignItems: "flex-start",
    });
    setCssProperties(footerRight, {
      display: "flex",
      justifyContent: "right",
      alignItems: "center",
      flexDirection: "column",
    });
  } else {
    // Desktop styles
    setCssProperties(footer, {
      marginTop: "1em",
      display: "inline-flex",
      flexDirection: "row",
      gap: "10px",
      justifyContent: "space-between",
      width: "100%",
    });

    setCssProperties(footerLeft, {
      width: "100%",
      display: "flex",
      justifyContent: "space-between",
      flexDirection: "row",
      alignItems: "center",
    });

    setCssProperties(footerRight, {
      display: "flex",
      width: "fit-content",
      justifyContent: "space-between",
      alignItems: "center",
      flexDirection: "row",
    });

    setCssProperties(gridContainer, {
      maxHeight: "60vh",
    });
    setCssProperties(searchInput, {
      width: "45%",
    });
  }
};

/**
 * Injects the defined CSS styles into the document.
 *
 * @function
 * @description Creates a <style> element and appends it to the document's head
 * to apply the ripple effect.
 * @returns {void}
 */
export const injectStyles = () => {
  const styleSheet = document.createElement("style");
  styleSheet.type = "text/css";
  styleSheet.innerText = rippleStyle;
  document.head.appendChild(styleSheet);
};
