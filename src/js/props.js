/**
 * Préfixe utilisé pour les clés de stockage local et les propriétés CSS.
 * @constant {string}
 */
const prefix = "jf-avatars";

/**
 * Récupère l'image enregistrée dans le stockage local.
 * @constant {string|null}
 */
const imageSaved = () => window.localStorage.getItem(`${prefix}-selected-img`);

/**
 * Nettoie une propriété en supprimant les guillemets et les espaces inutiles.
 * @param {string} property - La propriété à nettoyer.
 * @returns {string} - La propriété nettoyée.
 */
const cleanProperty = (property) => property.replace(/['"]/g, "").trim();

/**
 * Objet de propriétés utilisé dans l'interface utilisateur.
 * @constant {Object}
 * @property {string} title - Titre de la modal, ou valeur par défaut si non défini.
 * @property {string} filterLabel - Libellé du filtre, ou valeur par défaut si non défini.
 * @property {string} defaultOption - Option par défaut du filtre, ou valeur par défaut si non défini.
 * @property {string} searchLabel - Libellé de recherche, ou valeur par défaut si non défini.
 * @property {string} btnCancel - Libellé du bouton Annuler, ou valeur par défaut si non défini.
 * @property {string} btnValidate - Libellé du bouton Valider, ou valeur par défaut si non défini.
 * @property {string} btnShow - Libellé du bouton pour afficher plus d'images, ou valeur par défaut si non défini.
 * @property {string|null} imageName - Nom de l'image sélectionnée, ou null si aucune image n'est enregistrée.
 * @property {string|null} selectedImage - Image actuellement sélectionnée, initialement à null.
 * @property {string} prefix - Préfixe utilisé pour les clés de stockage et les propriétés CSS.
 * @property {string|null} imageSaved - Image enregistrée dans le stockage local.
 * @property {string} jfElementInjectBtnOpenModal - Sélecteur CSS pour l'élément d'injection du bouton modal.
 */
export const props = {
  title:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(`--${prefix}-title`)
    ) || "Sélectionner votre avatar",
  filterLabel:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-filter-label`
      )
    ) || "Filtrer par",
  defaultOption:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-filter-default-option`
      )
    ) || "Choisissez une option",
  searchLabel:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-search-label`
      )
    ) || "Rechercher un avatar...",
  btnCancel:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(`--${prefix}-btn-cancel`)
    ) || "Annuler",
  btnValidate:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(
        `--${prefix}-btn-validate`
      )
    ) || "Valider",
  btnShow:
    cleanProperty(
      getComputedStyle(document.body).getPropertyValue(`--${prefix}-btn-show`)
    ) || "Plus d'avatars",
  selectedImage: null,
  prefix,
  jfElementInjectBtnOpenModal: "#btnDeleteImage",
};
