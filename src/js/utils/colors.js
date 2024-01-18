import chroma from "chroma-js";
import { random } from "@tfrere/generative-tools";

export const colors = [
  ["#a70267", "#f10c49", "#fb6b41", "#f6d86b", "#339194"],
  ["#6a4a3c", "#00a0b0", "#cc333f", "#eb6841", "#edc951"],
  ["#490a3d", "#bd1550", "#e97f02", "#f8ca00", "#8a9b0f"],
  ["#64411E", "#676059", "#4D8379", "#328386", "#35A1A4"],
  ["#1b676b", "#519548", "#88c425", "#bef202", "#eafde6"],
  ["#2a044a", "#0b2e59", "#0d6759", "#7ab317", "#a0c55f"],
  ["#4d3b3b", "#de6262", "#ffb88c", "#ffd0b3", "#f5e0d3"],
  ["#307682", "#40c0cb", "#67CDB5", "#aee239", "#8fbe00"],
  ["#230f2b", "#f21d41", "#ebebbc", "#bce3c5", "#82b3ae"],
  ["#613860", "#5c4f79", "#536c8d", "#4f8b89", "#62a07b"],
  ["#331327", "#991766", "#d90f5a", "#f34739", "#ff6e27"],
];

export const viridisPalette = [
  "#fde725",
  "#b5de2b",
  "#6ece58",
  "#35b779",
  "#1f9e89",
  "#26828e",
  "#31688e",
  "#3e4989",
  "#482878",
  "#440154",
];

export const plasmaPalette = [
  "#f0f921",
  "#fdca26",
  "#fb9f3a",
  "#ed7953",
  "#d8576b",
  "#bd3786",
  "#9c179e",
  "#7201a8",
  "#46039f",
  "#0d0887",
];

export const sortColorsBySaturation = (colors, isAscend = True) => {
  return colors.sort((color1, color2) => {
    const saturation1 = chroma(color1).get("hsl.s");
    const saturation2 = chroma(color2).get("hsl.s");
    if (isAscend) return saturation1 - saturation2;
    else return saturation1 + saturation2;
  });
};

export const sortColorsByLuminance = (colors, isAscend = True) => {
  return colors.sort((color1, color2) => {
    const luminance1 = chroma(color1).get("hsl.l");
    const luminance2 = chroma(color2).get("hsl.l");
    if (isAscend) return luminance1 - luminance2;
    else return luminance1 + luminance2;
  });
};

export const createMonochromaticPalette = (baseColor) => {
  // Convertit la couleur de base en un objet chroma
  let color = chroma(baseColor);

  // Génère une palette en ajustant la luminosité et la saturation
  return [
    color.darken(2).desaturate(0.5), // Plus foncé et moins saturé
    color.darken(1), // Légèrement plus foncé
    color, // Couleur de base
    color.brighten(1), // Légèrement plus clair
    color.brighten(2).saturate(0.5), // Plus clair et plus saturé
  ];
};

export const createAnalogousPalette = (baseColor) => {
  // Convertit la couleur de base en un objet chroma
  let color = chroma(baseColor);

  // Génère une palette en utilisant des teintes proches
  return [
    color.set("hsl.h", "-30"), // 30 degrés plus à gauche sur la roue chromatique
    color.set("hsl.h", "-15"), // 15 degrés plus à gauche
    color, // Couleur de base
    color.set("hsl.h", "+15"), // 15 degrés plus à droite
    color.set("hsl.h", "+30"), // 30 degrés plus à droite
  ];
};

export const createComplementaryPalette = (baseColor) => {
  // Convertit la couleur de base en un objet chroma
  let color = chroma(baseColor);

  // Calcule la couleur complémentaire
  let complementaryColor = color.set("hsl.h", "+180");

  // Crée une palette combinant les couleurs de base et complémentaire
  return [
    color, // Couleur de base
    color.brighten(1), // Base éclaircie
    complementaryColor.brighten(1), // Complémentaire éclaircie
    complementaryColor, // Complémentaire
    complementaryColor.darken(1), // Complémentaire assombrie
  ];
};

const exportPaletteInHex = (colors) => {
  return colors.map((color) => {
    return color.hex();
  });
};

export const createRandomPalette = () => {
  // take a random color from colors
  // then choose a random color scheme function from above
  // then return the result of that function
  const randomIndex = Math.floor(random(0, 1) * colors.length);
  const randomColor = colors[randomIndex];
  const randomFunctionIndex = Math.floor(random(0, 1) * 3);
  const randomFunction = [
    createMonochromaticPalette,
    createAnalogousPalette,
    createComplementaryPalette,
  ][randomFunctionIndex];
  return exportPaletteInHex(randomFunction(randomColor));
};
