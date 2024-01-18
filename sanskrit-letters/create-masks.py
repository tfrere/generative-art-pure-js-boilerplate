import os
import argparse
import svgwrite
import shutil
from xml.etree import ElementTree
import xml.etree.ElementTree as ET
import cairosvg

# Fonction pour supprimer les préfixes de l'espace de noms


def svg_to_png(svg_path, png_path, width=400, height=400):
    """ Convertit un fichier SVG en fichier PNG avec une taille spécifiée """
    cairosvg.svg2png(url=svg_path, write_to=png_path,
                     output_width=width, output_height=height)


def remove_namespaces(xml):
    """ Supprime les namespaces du document XML """
    for elem in xml.iter():
        elem.tag = elem.tag.split('}', 1)[-1]
        elem.attrib = {name.split(
            '}', 1)[-1]: value for name, value in elem.attrib.items()}


def modify_svg(input_path, output_path, fill_white=False, outline_black=False):
    # Charger le fichier SVG d'origine
    tree = ET.parse(input_path)
    root = tree.getroot()

    # Supprimer les namespaces
    for elem in root.iter():
        elem.tag = elem.tag.split('}', 1)[-1]

    # Supprimer la balise <def>
    for def_elem in root.findall('defs'):
        root.remove(def_elem)

    # Parcourir et modifier les éléments <path>, en supprimant les classes
    for element in root.iter('path'):
        # Supprimer l'attribut de classe
        if 'class' in element.attrib:
            del element.attrib['class']

        # Appliquer les styles directement aux attributs
        if fill_white:
            element.set('fill', 'white')
        else:
            element.set('fill', 'none')  # ou conserver la couleur originale

        if outline_black:
            element.set('stroke', 'white')
            element.set('stroke-width', '20')

    # Ajouter un fond blanc
    # Création d'un élément rect pour le fond
    background = ET.Element('rect', width='1024px',
                            height='1024px', fill='black')
    root.insert(0, background)  # Insérer le fond en premier dans le SVG

    # Enregistrer le fichier modifié
    tree.write(output_path)


def process_folder(input_folder, output_folder, png_folder):
    # Supprimer le dossier de sortie s'il existe et le recréer
    if os.path.exists(output_folder):
        shutil.rmtree(output_folder)
    os.makedirs(output_folder, exist_ok=True)

    # Créer le dossier pour les PNG s'il n'existe pas
    if os.path.exists(png_folder):
        shutil.rmtree(png_folder)
    os.makedirs(png_folder, exist_ok=True)

    # Initialiser le compteur
    counter = 0

    # Traitement des fichiers SVG
    for file_name in os.listdir(input_folder):
        if file_name.endswith('.svg'):
            input_path = os.path.join(input_folder, file_name)

            # Version 'inner'
            output_path_inner = os.path.join(
                output_folder, f'inner-{counter}.svg')
            modify_svg(input_path, output_path_inner, fill_white=True)
            svg_to_png(output_path_inner, os.path.join(
                png_folder, f'inner-{counter}.png'))

            # Version 'outline'
            output_path_outline = os.path.join(
                output_folder, f'outline-{counter}.svg')
            modify_svg(input_path, output_path_outline, outline_black=True)
            svg_to_png(output_path_outline, os.path.join(
                png_folder, f'outline-{counter}.png'))

            # Incrémenter le compteur
            counter += 1


if __name__ == "__main__":
    parser = argparse.ArgumentParser(description="SVG Modification Script")
    parser.add_argument("--input-folder", type=str, required=True,
                        help="Input folder containing SVG files")
    parser.add_argument("--output-folder", type=str, required=True,
                        help="Output folder for modified SVG files")
    parser.add_argument("--png-folder", type=str,
                        required=True, help="Output folder for PNG files")
    args = parser.parse_args()

    process_folder(args.input_folder, args.output_folder, args.png_folder)
