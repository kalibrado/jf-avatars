# js-avatars

## Description

**js-avatars** is a JavaScript library that allows users to select avatars from an image gallery in a **Jellyfin** compatible environment. The application provides a user-friendly interface via a custom modal, facilitating the selection of profile images from an organized collection.

## Acknowledgments

Special thanks to [BobHasNoSoul](https://github.com/BobHasNoSoul/jellyfin-avatars.git) for the inspiration and for sharing the images used in this project.

## Features

- **Avatar Selection**: Intuitive interface for browsing and choosing avatars from an image gallery.
- **Responsive Image Grid**: Displays images in a grid format, adapted to all screen sizes.
- **Search and Filter**: Image search functionality by name and filtering by category through a dropdown menu.
- **Visual State Management**: Selected images are displayed in color while unselected ones appear in grayscale.
- **Internationalization**: Automatic language detection without needing CSS. The application dynamically loads the correct language based on the user's preferences.
- **Integration with Jellyfin**: Seamlessly integrates with Jellyfin themes, providing a cohesive experience.

## Screenshots

Here are some screenshots demonstrating the functionality and UI of the **js-avatars** project across different devices.

### Desktop View
  ![Desktop Show Modal Button](./screenshot/desktop-show-btn-modal.png)
  ![Desktop Full Modal View](./screenshot/desktop-show-modal.png)
  ![Desktop Modal Open (Selected)](./screenshot/desktop-show-modal-open-seleted.png)
  ![Desktop Modal Open (Closed)](./screenshot/desktop-show-modal-open-closed.png)

### Mobile View
  ![Mobile Show Modal Button](./screenshot/mobil-show-btn-modal.png)
  ![Mobile Modal Open (Closed)](./screenshot/mobil-show-modal.png)
  ![Mobile Modal Open (Selected)](./screenshot/mobil-show-modal-open-seleted.png)
  ![Mobile Full Modal View](./screenshot/mobil-show-modal-open-closed.png)

## Project Structure

The project is structured as follows:

- **index.js**: Entry point for initializing the application and injecting the modal.
- **events.js**: Event handlers for user interactions (searching, filtering).
- **props.js**: Dynamic properties and application state (selected image).
- **style.js**: Functions to adjust the modal's style based on screen size.
- **ui-elements.js**: Generation of user interface elements (buttons, dropdown, image grid).

## Usage

### Injecting the Script

You can integrate the script into your project in two ways:

1. **Direct Injection in `index.html`**:

   ```html
   <script
     type="module"
     src="https://github.com/kalibrado/js-avatars/releases/download/{version}/main.js"
     defer
   ></script>
   ```

2. **Injection via Nginx**:

   ```nginx
   location / {
       proxy_pass http://backend_server;  # Reverse proxy to your backend
       sub_filter '</body>' '<script type="module" src="https://github.com/kalibrado/js-avatars/releases/download/{version}/main.js" defer></script></body>';
       sub_filter_once on;  # Apply the modification only once
   }
   ```

### General Functioning

- **Loading the Avatar Selection Modal**: Detects the `#btnDeleteImage` button and adds a new button to open the modal.
- **Image Selection**: Click on an image to select it. Selected images appear in color, while unselected ones are in grayscale.
- **Image Search**: Use the search bar to locate specific images by name.
- **Category Filtering**: Select a category from the dropdown to filter images.

### Image Management

The default images come from the repository [js-avatars-images](https://github.com/kalibrado/js-avatars-images). This repository maintains an organized collection of avatars.

If users wish to use their own images, they can specify a custom image URL using the CSS property:

```css
--js-avatars-url-images: "https://your-custom-url.com/path/to/images_metadata.json";
```

To ensure proper functionality, images should follow the naming convention defined in the [images_metadata.json](https://github.com/kalibrado/js-avatars-images/blob/main/images_metadata.json) file.

### Language Management

The language management is fully automatic and does not require any manual configuration. The correct language is dynamically loaded based on the user's browser preferences.

The application attempts to load the appropriate language file (e.g., `fr.json`, `en.json`) from the local server, and if not found, falls back to a GitHub repository.

### Integration with the Jellyfin Theme

All elements created by the script are designed to integrate seamlessly with Jellyfin's theme, ensuring a smooth user experience, even with custom themes.

## Documentation with JSDoc

The project is fully documented using JSDoc. To generate the documentation from the source code, run the following command:

```bash
npm run docs
```

This will create comprehensive documentation in a `docs` directory.

## License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.

