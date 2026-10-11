/**
 * Garment outlines, drawn in a 200x200 box.
 *
 * `body` is filled with the item's colour; `line` strokes add detail such as
 * collars and seams; `rib` marks cuffs and hems; `dot` draws buttons.
 */

export const SHAPES = {
  tshirt: {
    body:
      "M72 40 C84 52, 116 52, 128 40 L152 50 L170 80 L146 96 L134 84 L134 158 " +
      "C112 167, 88 167, 66 158 L66 84 L54 96 L30 80 L48 50 Z",
    line: ["M72 40 C84 54, 116 54, 128 40"],
  },

  shirt: {
    body:
      "M74 40 C85 50, 115 50, 126 40 L152 50 L170 80 L146 96 L134 84 L134 158 " +
      "C112 167, 88 167, 66 158 L66 84 L54 96 L30 80 L48 50 Z",
    detail: ["M84 41 L100 66 L91 38 Z", "M116 41 L100 66 L109 38 Z"],
    line: ["M100 66 V154"],
    dot: [[100, 90], [100, 112], [100, 134]],
  },

  sweater: {
    body:
      "M72 42 C84 54, 116 54, 128 42 L152 52 L172 126 L150 133 L138 88 L138 152 " +
      "C112 161, 88 161, 62 152 L62 88 L50 133 L28 126 L48 52 Z",
    rib: [
      "M62 143 C88 151, 112 151, 138 143 L138 152 C112 161, 88 161, 62 152 Z",
      "M29 125 L51 132 L47 144 L25 137 Z",
      "M171 125 L149 132 L153 144 L175 137 Z",
    ],
    line: ["M72 42 C84 56, 116 56, 128 42"],
  },

  trousers: {
    body: "M68 38 L132 38 L138 78 L130 188 L109 188 L100 96 L91 188 L70 188 L62 78 Z",
    rib: ["M68 38 L132 38 L133 53 L67 53 Z"],
    line: ["M100 55 V94"],
  },

  jeans: {
    body: "M68 38 L132 38 L138 78 L130 190 L108 190 L100 96 L92 190 L70 190 L62 78 Z",
    rib: ["M68 38 L132 38 L133 55 L67 55 Z"],
    line: ["M100 57 V94", "M72 60 C80 65, 85 70, 87 78", "M128 60 C120 65, 115 70, 113 78"],
  },

  shorts: {
    body: "M68 48 L132 48 L136 84 L130 132 L108 132 L100 100 L92 132 L70 132 L64 84 Z",
    rib: ["M68 48 L132 48 L133 62 L67 62 Z"],
    line: ["M100 64 V98"],
  },

  blazer: {
    body:
      "M74 42 L48 54 L30 130 L52 138 L62 92 L62 160 C86 169, 114 169, 138 160 " +
      "L138 92 L148 138 L170 130 L152 54 L126 42 L100 92 Z",
    detail: ["M74 42 L100 92 L84 45 Z", "M126 42 L100 92 L116 45 Z"],
    line: ["M100 94 V158"],
    dot: [[100, 124]],
  },

  coat: {
    body:
      "M72 38 L44 50 L24 134 L48 142 L58 94 L58 180 C86 189, 114 189, 142 180 " +
      "L142 94 L152 142 L176 134 L156 50 L128 38 L100 88 Z",
    detail: ["M72 38 L100 88 L82 42 Z", "M128 38 L100 88 L118 42 Z"],
    rib: ["M58 128 C86 136, 114 136, 142 128 L142 141 C114 149, 86 149, 58 141 Z"],
    line: ["M100 90 V178"],
  },

  dress: {
    body:
      "M74 40 C86 52, 114 52, 126 40 L148 50 L164 80 L142 92 L132 80 L132 96 " +
      "L162 170 C122 182, 78 182, 38 170 L68 96 L68 80 L58 92 L36 80 L52 50 Z",
    line: ["M74 40 C86 54, 114 54, 126 40", "M68 98 C88 106, 112 106, 132 98"],
  },

  sneaker: {
    body:
      "M34 140 C34 112, 50 98, 74 98 L88 98 C98 107, 110 115, 126 119 L148 125 " +
      "C162 129, 170 135, 170 146 L170 150 L34 150 Z",
    rib: ["M32 147 L172 147 C174 147, 173 163, 166 163 L40 163 C32 163, 30 147, 32 147 Z"],
    line: [
      "M62 108 L82 118",
      "M70 102 L90 113",
      "M96 120 C112 127, 130 131, 146 134",
      "M34 140 C60 143, 120 144, 170 146",
    ],
  },

  boot: {
    body:
      "M70 42 L118 42 L120 110 C120 117, 128 123, 140 129 L154 136 " +
      "C162 140, 166 145, 166 152 L166 155 L68 155 Z",
    rib: ["M66 151 L168 151 C170 151, 169 165, 162 165 L76 165 C68 165, 64 151, 66 151 Z"],
    line: ["M70 60 H118", "M120 112 C104 118, 86 119, 68 118"],
  },

  bag: {
    body:
      "M54 84 L146 84 L156 164 C157 171, 152 174, 146 174 L54 174 " +
      "C48 174, 43 171, 44 164 Z",
    handle: ["M76 86 C76 50, 124 50, 124 86"],
    rib: ["M46 160 L154 160 L156 164 C157 171, 152 174, 146 174 L54 174 C48 174, 43 171, 44 164 Z"],
  },
};

export const BY_SUBCATEGORY = {
  "t-shirt": "tshirt",
  shirt: "shirt",
  knitwear: "sweater",
  sweatshirt: "sweater",
  trousers: "trousers",
  jeans: "jeans",
  shorts: "shorts",
  blazer: "blazer",
  coat: "coat",
  sneakers: "sneaker",
  boots: "boot",
  "midi dress": "dress",
  "maxi dress": "dress",
  dress: "dress",
  bag: "bag",
  belt: "bag",
};

export const BY_CATEGORY = {
  Tops: "tshirt",
  Bottoms: "trousers",
  Outerwear: "blazer",
  Shoes: "sneaker",
  Dresses: "dress",
  Accessories: "bag",
};

export const COLOURS = {
  white: ["#FBFBF9", "#DFE2E7", "#FFFFFF"],
  cream: ["#F3EADC", "#DCCFBA", "#FBF6EE"],
  black: ["#2B2C31", "#17181C", "#3E4047"],
  grey: ["#A9AEB7", "#8A8F99", "#C4C8CF"],
  navy: ["#2F3D60", "#1F2942", "#44557C"],
  blue: ["#6E9BF0", "#4E7AD4", "#93B6F7"],
  beige: ["#DAC8AD", "#BCA78A", "#ECE0CC"],
  brown: ["#8C6A4E", "#6B4F39", "#A98769"],
  green: ["#5C8A6B", "#436651", "#7FAB8D"],
  red: ["#C8505F", "#A33B49", "#DD7C87"],
};

export function paletteFor(colour = "") {
  return COLOURS[colour.trim().toLowerCase()] ?? ["#BFC4CC", "#9EA4AE", "#D8DCE2"];
}

export function shapeFor(item) {
  const sub = (item.subcategory || "").toLowerCase();
  return BY_SUBCATEGORY[sub] ?? BY_CATEGORY[item.category] ?? "tshirt";
}
