# jf-avatars

![Translation Status](https://img.shields.io/badge/translate-ready-brightgreen)
![Version](https://img.shields.io/badge/version-2.2.1-blue)

## Description

**jf-avatars** is a JavaScript library that allows users to select avatars from an image gallery in a **Jellyfin** compatible environment. The application provides a user-friendly interface via a custom modal, facilitating the selection of profile images from an organized collection.

## 🚀 Getting Started

To quickly get started with jf-avatars, follow these steps:

1. **Install in your Jellyfin project**:

   ```bash
   git clone https://github.com/kalibrado/jf-avatars.git
   ```

2. **Basic integration** (add to your index.html):

   ```html
   <script type="module" src="jf-avatars/src/js/index.js"></script>
   ```

3. **Test the functionality** by accessing the user profile editing page in Jellyfin.

For more detailed installation instructions, see the [Installation section](#-integration-with-jellyfin-docker-and-non-docker-setups).

## 📦 Repositories

🔹 **Main Script Repository**  
📁 [`jf-avatars`](https://github.com/kalibrado/jf-avatars)  
[![GitHub Stars](https://img.shields.io/github/stars/kalibrado/jf-avatars?style=social)](https://github.com/kalibrado/jf-avatars/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/kalibrado/jf-avatars?style=social)](https://github.com/kalibrado/jf-avatars/network)
[![GitHub License](https://img.shields.io/github/license/kalibrado/jf-avatars)](https://github.com/kalibrado/jf-avatars/blob/main/LICENSE)

🔹 **Image Collection Repository**  
🖼️ [`jf-avatars-images`](https://github.com/kalibrado/jf-avatars-images)  
[![GitHub Stars](https://img.shields.io/github/stars/kalibrado/jf-avatars-images?style=social)](https://github.com/kalibrado/jf-avatars-images/stargazers)
[![GitHub Forks](https://img.shields.io/github/forks/kalibrado/jf-avatars-images?style=social)](https://github.com/kalibrado/jf-avatars-images/network)
[![GitHub License](https://img.shields.io/github/license/kalibrado/jf-avatars-images)](https://github.com/kalibrado/jf-avatars-images/blob/main/LICENSE)

## ✨ Features

- **Avatar Selection**: Intuitive interface for browsing and choosing avatars from an image gallery.
- **Responsive Image Grid**: Displays images in a grid format, adapted to all screen sizes.
- **Search and Filter**: Image search functionality by name and filtering by category through a dropdown menu.
- **Visual State Management**: Selected images are displayed in color while unselected ones appear in grayscale.
- **Internationalization**: Automatic language detection without needing CSS. The application dynamically loads the correct language based on the user's preferences.
- **Integration with Jellyfin**: Seamlessly integrates with Jellyfin themes, providing a cohesive experience.

### 🌐 Available Languages

The application currently supports the following languages:

| Flag | Language   | Code |
| ---- | ---------- | ---- |
| 🇬🇧    | English    | `en` |
| 🇪🇸    | Spanish    | `es` |
| 🇫🇷    | French     | `fr` |
| 🇮🇹    | Italian    | `it` |
| 🇵🇹    | Portuguese | `pt` |
| 🇹🇷    | Turkish    | `tr` |

## 🖼️ Screenshots

Here are some screenshots demonstrating the functionality and UI of the **jf-avatars** project across different devices.

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

## 🧩 Project Structure

The project is structured as follows:

- **index.js**: Entry point for initializing the application and injecting the modal.
- **events.js**: Event handlers for user interactions (searching, filtering).
- **props.js**: Dynamic properties and application state (selected image).
- **style.js**: Functions to adjust the modal's style based on screen size.
- **ui-elements.js**: Generation of user interface elements (buttons, dropdown, image grid).

## 🔧 Installation

### 🧩 Integration with Jellyfin (Docker and non-Docker setups)

This project can be integrated into **Jellyfin** in both **Docker-based** and **native installations**.

### 🐳 Docker Setup

#### 1. Clone the repository

```bash
git clone https://github.com/kalibrado/jf-avatars.git
```

#### 2. Mount the volume in your Jellyfin container

In your `docker-compose.yml` file, add the following volume to the Jellyfin service:

```yaml
services:
  jellyfin:
    image: jellyfin/jellyfin:latest
    container_name: jellyfin
    volumes:
      - '/path/to/jf-avatars:/jellyfin/jellyfin-web/jf-avatars'
      - '/path/to/index.html:/jellyfin/jellyfin-web/index.html:ro'
```

#### 3. Edit `index.html`

In your custom `index.html` (mounted as read-only), add the following line before `</body>`:

```html
<script type="module" src="jf-avatars/src/js/index.js"></script>
```

> ⚠️ Make sure you edit this file before launching the container, as it's mounted read-only.

---

### 💻 Native Installation (Non-Docker)

#### 1. Clone the repository

```bash
git clone https://github.com/kalibrado/jf-avatars.git
```

#### 2. Copy the folder into Jellyfin's web directory

The default web directory varies depending on your system:

- **Linux**: `/usr/share/jellyfin/web` or `/usr/lib/jellyfin/web`
- **Windows**: `C:\Program Files\Jellyfin\Server\jellyfin-web`

Copy the folder:

```bash
sudo cp -r jf-avatars /usr/share/jellyfin/web/
```

#### 3. Edit `index.html`

Open `index.html` in the root of the `web/` folder and add:

```html
<script type="module" src="jf-avatars/src/js/index.js"></script>
```

> 📌 It is recommended to place the line just before `</body>` for clean integration.

---

Once Jellyfin is restarted, the custom avatar selector will load as part of the Jellyfin web interface.

## 🌐 Remote Integration

You can integrate the script into your project without direct file copying using these methods:

1. **Direct Injection in `index.html`**:

   ```html
   <script
     type="module"
     src="https://github.com/kalibrado/jf-avatars/releases/download/{version}/main.js"
     defer
   ></script>
   ```

2. **Injection via Nginx**:

   ```nginx
   location / {
       proxy_pass http://backend_server;  # Reverse proxy to your backend
       sub_filter '</body>' '<script type="module" src="https://github.com/kalibrado/jf-avatars/releases/download/{version}/main.js" defer></script></body>';
       sub_filter_once on;  # Apply the modification only once
   }
   ```

### General Functioning

- **Loading the Avatar Selection Modal**: Detects the `#btnDeleteImage` button and adds a new button to open the modal.
- **Image Selection**: Click on an image to select it. Selected images appear in color, while unselected ones are in grayscale.
- **Image Search**: Use the search bar to locate specific images by name.
- **Category Filtering**: Select a category from the dropdown to filter images.

### Advanced Usage Examples

#### Customizing the image source

```javascript
// Set a custom URL for avatar images
document.documentElement.style.setProperty('--jf-avatars-url-images', 'https://my-server.com/my-avatars/images_metadata.json');
```

#### Integration with custom events

```javascript
// Listen for avatar selection event
document.addEventListener('jf-avatars-selected', function(event) {
  console.log('Avatar selected:', event.detail.imageUrl);
  // Perform additional actions...
});
```

### Image Management

The default images come from the repository [jf-avatars-images](https://github.com/kalibrado/jf-avatars-images). This repository maintains an organized collection of avatars.

If users wish to use their own images, they can specify a custom image URL using the CSS property:

```css
--jf-avatars-url-images: "https://your-custom-url.com/path/to/images_metadata.json";
```

To ensure proper functionality, images should follow the naming convention defined in the [images_metadata.json](https://github.com/kalibrado/jf-avatars-images/blob/main/images_metadata.json) file.

### Language Management

The language management is fully automatic and does not require any manual configuration. The correct language is dynamically loaded based on the user's browser preferences.

The application attempts to load the appropriate language file (e.g., `fr.json`, `en.json`) from the local server, and if not found, falls back to a GitHub repository.

### Integration with the Jellyfin Theme

All elements created by the script are designed to integrate seamlessly with Jellyfin's theme, ensuring a smooth user experience, even with custom themes.

## 📚 Documentation with JSDoc

The project is fully documented using JSDoc. To generate the documentation from the source code, run the following command:

```bash
npm run docs
```

This will create comprehensive documentation in a `docs` directory.

## ❓ FAQ

### How can I add a new language?

To add a new language, create a JSON file in the appropriate format and place it in the translations directory. Consult existing files as templates.

### Are custom avatars supported?

Yes! You can use your own avatars by setting the CSS property `--jf-avatars-url-images` to point to your image metadata JSON file.

### Can I use jf-avatars without Jellyfin?

While designed for Jellyfin, the script can be adapted to other web applications by modifying the selectors and events in the source code.

### How do I troubleshoot installation issues?

Check that all paths are correct and file permissions are appropriate. Also ensure that Jellyfin has been restarted after installation.

## 🤝 Contributing

Contributions to this project are welcome! Here's how you can contribute:

1. **Fork** the repository
2. **Create** a branch for your feature (`git checkout -b feature/amazing-feature`)
3. **Commit** your changes (`git commit -m 'Add amazing feature'`)
4. **Push** to the branch (`git push origin feature/amazing-feature`)
5. **Open** a Pull Request

Please read the [CONTRIBUTING.md](CONTRIBUTING.md) file for more details on our code of conduct and the process for submitting Pull Requests.

## 🙏 Acknowledgments

Special thanks to [BobHasNoSoul](https://github.com/BobHasNoSoul/jellyfin-avatars.git) for the inspiration and for sharing the images used in this project.

## 📄 License

This project is licensed under the MIT License. See the [LICENSE](LICENSE) file for more details.
