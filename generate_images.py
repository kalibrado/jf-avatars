import os
import json
import sys

images_dir = "src/img"  # Dossier contenant les images
js_output = "src/js/constants.js"  # Chemin vers le fichier de sortie JS
package_json_path = "package.json"  # Chemin vers le fichier package.json

def get_base_url(version):
    """Génère l'URL de base en fonction de la version.""" 
    return f"https://monsite/npm_dist/{version}/"

def generate_image_and_section_lists(images_dir, base_url):
    """Génère les listes d'images et de sections à partir des fichiers dans le dossier d'images."""
    srcImages = set()
    options = set()

    for root, _, files in os.walk(images_dir):
        for file in files:
            if file.endswith((".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg")):
                relative_path = (
                    os.path.join(root, file).replace(images_dir, "").lstrip(os.sep)
                )
                srcImages.add(base_url + relative_path)

                section = file.split("-")[0]
                options.add(section)

    image_files_list = sorted(list(srcImages))
    sections_list = sorted(list(options))

    return image_files_list, sections_list

def update_js_file(src_images, options, output):
    """Met à jour le fichier JavaScript avec les listes d'images et de sections."""
    src_images_str = json.dumps(src_images, ensure_ascii=False, indent=4)
    sections_str = json.dumps(options, ensure_ascii=False, indent=4)

    js_content = """
export const constants = {
"""
    js_content += f"""
    srcImages: {src_images_str},
    options: {sections_str}
"""
    js_content += """
}
"""
    with open(output, "w") as js_file:
        js_file.write(js_content)

    print(f"Fichier {output} mis à jour avec succès.")

# Exécution principale
if __name__ == "__main__":
    # Vérifiez si un argument de version a été passé
    if len(sys.argv) != 2:
        print("Usage: python script.py <version>")
        sys.exit(1)

    version = sys.argv[1]  # Récupère la version depuis l'argument
    base_url = get_base_url(version)

    src_images, options = generate_image_and_section_lists(images_dir, base_url)
    update_js_file(src_images, options, js_output)
