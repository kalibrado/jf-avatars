from os import walk, path, sep
from json import dumps
from sys import argv, exit

images_dir = "src/img"  # Directory containing images
js_output = "src/js/constants.js"  # Path to the output JS file


def get_base_url(version):
    """
    Generates the base URL based on the version.

    The base URL is constructed differently depending on whether the version
    starts with 'v'. If it does, the reference will be 'tags', otherwise it will
    be 'heads'.

    @param {string} version - The version string used to determine the URL.
    @returns {string} The generated base URL for the images.
    """
    ref = "heads"
    if str(version).startswith("v"):
        ref = "tags"
    return f"https://raw.githubusercontent.com/kalibrado/jf-avatars/refs/{ref}/{version}/src/img/"


def generate_image_and_section_lists(images_dir, base_url):
    """
    Generates lists of images and sections from the files in the images directory.

    This function traverses the specified directory for image files and constructs
    lists of image URLs and unique sections based on the filenames.

    @param {string} images_dir - The directory to search for image files.
    @param {string} base_url - The base URL to prepend to image file paths.
    @returns {Array<string>} A sorted list of image URLs.
    @returns {Array<string>} A sorted list of unique sections extracted from image filenames.
    """
    srcImages = set()
    options = set()

    for root, _, files in walk(images_dir):
        for file in files:
            if file.endswith((".png", ".jpg", ".jpeg", ".gif", ".bmp", ".svg")):
                relative_path = (path.join(root, file).replace(images_dir, "").lstrip(sep))
                section = relative_path.split("/")[0]
                srcImages.add(base_url + relative_path)
                options.add(section)

    image_files_list = list(srcImages)
    sections_list = list(options)

    return image_files_list, sections_list


def update_js_file(src_images, options, output):
    """
    Updates the JavaScript file with the lists of images and sections.

    This function writes the provided image URLs and options to a specified JavaScript
    file in the format of a constants object.

    @param {Array<string>} src_images - The list of image URLs to be written to the JS file.
    @param {Array<string>} options - The list of sections to be written to the JS file.
    @param {string} output - The path to the output JavaScript file.
    @returns {void} This function does not return a value.
    """
    src_images_str = dumps(src_images, ensure_ascii=False, indent=4)
    sections_str = dumps(options, ensure_ascii=False, indent=4)

    js_content = """
/**
 * Object containing constants used in the application.
 *
 * This object centralizes constants related to images and options available 
 * in the application. The properties of this object can be modified at any time 
 * depending on the application's needs.
 *
 * @typedef {Object} Constants
 * @property {Array<string>} srcImages - An array of image URLs used in the application. 
 * This array is initialized as empty and can be dynamically populated depending on 
 * the available images.
 * @property {Array<Object>} options - An array of additional options, used to store 
 * configurations or parameters related to the display or usage of images. This array 
 * is also initialized as empty and can be populated based on the application's needs.
 *
 * @const {Constants}
 */
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

    print(f"File {output} updated successfully.")


# Main execution
if __name__ == "__main__":
    # Check if a version argument has been passed
    if len(argv) != 2:
        print("Usage: python script.py <version>")
        exit(1)

    version = argv[1]  # Get the version from the argument
    base_url = get_base_url(version)

    src_images, options = generate_image_and_section_lists(images_dir, base_url)
    update_js_file(src_images, options, js_output)
