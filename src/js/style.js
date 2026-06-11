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

  .jf-avatars-img {
    box-sizing: border-box;
  }

  .jf-avatars-img-selected {
    border: 4px solid var(--highlightOutlineColor, var(--uiAccentColor, #828282));
    box-shadow:
      0 0 0 4px color-mix(in srgb, var(--highlightOutlineColor, #828282), transparent 65%),
      0 0 22px color-mix(in srgb, var(--highlightOutlineColor, #828282), transparent 25%);
    filter: brightness(1.25);
    transform: scale(1.08);
    z-index: 2;
  }

  .jf-avatars-img-random-flash {
    animation: jf-avatars-random-flash 5s ease-out 500ms infinite;
  }

  @keyframes jf-avatars-random-flash {
    0% {
      box-shadow:
        0 0 0 0 var(--textColor, #fff),
        0 0 0 rgba(255, 255, 255, 0);
    }
    45% {
      box-shadow:
        0 0 0 7px color-mix(in srgb, var(--textColor, #fff), transparent 25%),
        0 0 28px var(--highlightOutlineColor, #828282);
    }
    100% {
      box-shadow:
        0 0 0 4px color-mix(in srgb, var(--highlightOutlineColor, #828282), transparent 65%),
        0 0 22px color-mix(in srgb, var(--highlightOutlineColor, #828282), transparent 25%);
    }
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
    `${props.prefix}-search-container`,
  );
  const gridContainer = document.getElementById(
    `${props.prefix}-grid-container`,
  );
  const footerLeft = document.getElementById(`${props.prefix}-footer-left`);
  const footerRight = document.getElementById(`${props.prefix}-footer-right`);

  if (
    !footer ||
    !searchInput ||
    !gridContainer ||
    !footerLeft ||
    !footerRight
  ) {
    return;
  }

  const windowWidth = window.innerWidth;

  setCssProperties(searchInput, {
    width: "100%",
  });

  if (windowWidth <= 600) {
    setCssProperties(footer, {
      gridTemplateColumns: "1fr",
    });

    setCssProperties(footerLeft, {
      gridTemplateColumns: "1fr",
    });

    setCssProperties(footerRight, {
      width: "100%",
      justifyContent: "center",
    });

    setCssProperties(gridContainer, {
      height: "35vh",
    });
  } else if (windowWidth <= 900) {
    setCssProperties(footer, {
      gridTemplateColumns: "1fr",
    });

    setCssProperties(footerLeft, {
      gridTemplateColumns: "1fr 1fr",
    });

    setCssProperties(footerRight, {
      width: "100%",
      justifyContent: "end",
    });

    setCssProperties(gridContainer, {
      height: "45vh",
    });
  } else {
    setCssProperties(footer, {
      gridTemplateColumns: "1fr auto",
    });

    setCssProperties(footerLeft, {
      gridTemplateColumns: "repeat(auto-fit, minmax(220px, 1fr))",
    });

    setCssProperties(footerRight, {
      width: "auto",
      justifyContent: "end",
    });

    setCssProperties(gridContainer, {
      height: "50vh",
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
