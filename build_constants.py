import os
import json

images_dir = "src/img"
js_output = "src/js/constants.js"
base_url = "/web/avatars/avatars/"


def generate_image_and_section_lists(images_dir):
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


src_images, options = generate_image_and_section_lists(images_dir)
update_js_file(src_images, options, js_output)
