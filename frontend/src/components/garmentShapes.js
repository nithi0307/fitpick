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

  skirt: {
    body: "M66 46 L134 46 L160 162 C122 175, 78 175, 40 162 Z",
    rib: ["M66 46 L134 46 L135 64 L65 64 Z"],
    line: ["M100 66 V168", "M80 66 L68 166", "M120 66 L132 166"],
  },

  hoodie: {
    body:
      "M72 58 C84 70, 116 70, 128 58 L152 68 L172 140 L150 147 L138 104 L138 158 " +
      "C112 167, 88 167, 62 158 L62 104 L50 147 L28 140 L48 68 Z",
    detail: ["M74 64 C77 46, 123 46, 126 64 L117 69 C111 59, 89 59, 83 69 Z"],
    rib: [
      "M62 150 C88 158, 112 158, 138 150 L138 158 C112 167, 88 167, 62 158 Z",
      "M29 139 L51 146 L47 158 L25 151 Z",
      "M171 139 L149 146 L153 158 L175 151 Z",
    ],
    line: ["M88 70 L90 106", "M112 70 L110 106"],
    dot: [[90, 108], [110, 108]],
  },

  jacket: {
    body:
      "M74 44 L48 56 L32 122 L52 130 L62 94 L62 156 C86 165, 114 165, 138 156 " +
      "L138 94 L148 130 L168 122 L152 56 L126 44 L100 72 Z",
    detail: ["M74 44 L100 72 L86 47 Z", "M126 44 L100 72 L114 47 Z"],
    line: ["M100 74 V154"],
    dot: [[100, 100], [100, 126]],
  },

  heels: {
    body:
      "M34 150 C34 132, 44 121, 60 115 C78 109, 92 111, 104 103 " +
      "C116 95, 134 96, 143 110 C149 121, 152 136, 154 150 Z " +
      "M137 150 L150 150 L150 181 L143 181 Z",
    rib: ["M32 146 L155 146 L155 155 C155 157, 153 158, 151 158 L36 158 C33 158, 32 156, 32 153 Z"],
    line: ["M62 120 C80 116, 94 117, 106 110"],
  },

  hat: {
    body:
      "M54 122 C54 76, 146 76, 146 122 Z M30 120 L170 120 C172 120, 172 134, 166 134 " +
      "L34 134 C28 134, 28 120, 30 120 Z",
    rib: ["M56 108 L144 108 L145 122 L55 122 Z"],
    line: ["M100 80 V108"],
  },

  scarf: {
    body:
      "M70 46 C70 66, 130 66, 130 46 L130 60 C130 80, 70 80, 70 60 Z " +
      "M76 74 L96 74 L100 164 L72 164 Z M108 74 L128 74 L132 164 L104 164 Z",
    rib: ["M72 156 L100 156 L100 164 L72 164 Z", "M104 156 L132 156 L132 164 L104 164 Z"],
    line: ["M86 82 V154", "M118 82 V154"],
  },

  sunglasses: {
    body:
      "M28 82 C28 78, 33 76, 39 76 L84 76 C90 76, 93 80, 92 87 L89 110 " +
      "C87 120, 77 126, 65 126 L51 126 C39 126, 30 118, 29 106 Z " +
      "M172 82 C172 78, 167 76, 161 76 L116 76 C110 76, 107 80, 108 87 L111 110 " +
      "C113 120, 123 126, 135 126 L149 126 C161 126, 170 118, 171 106 Z",
    line: ["M92 85 C98 80, 102 80, 108 85", "M28 84 L10 95", "M172 84 L190 95"],
  },

  watch: {
    body:
      "M100 50 C128 50, 150 72, 150 100 C150 128, 128 150, 100 150 C72 150, 50 128, 50 100 " +
      "C50 72, 72 50, 100 50 Z M78 28 L122 28 L118 60 L82 60 Z M82 140 L118 140 L122 174 L78 174 Z",
    rib: ["M150 90 L162 90 L162 110 L150 110 Z"],
    line: ["M100 70 V100 L120 112"],
    dot: [[100, 100]],
  },
};

export const BY_SUBCATEGORY = {
  // Tops
  "t-shirt": "tshirt",
  "tank top": "tshirt",
  vest: "tshirt",
  shirt: "shirt",
  blouse: "shirt",
  polo: "shirt",
  knitwear: "sweater",
  jumper: "sweater",
  cardigan: "sweater",
  sweatshirt: "sweater",
  hoodie: "hoodie",

  // Bottoms
  trousers: "trousers",
  chinos: "trousers",
  joggers: "trousers",
  leggings: "trousers",
  jeans: "jeans",
  shorts: "shorts",
  skirt: "skirt",

  // Dresses
  "midi dress": "dress",
  "maxi dress": "dress",
  "mini dress": "dress",
  "shirt dress": "dress",
  jumpsuit: "dress",
  dress: "dress",

  // Outerwear
  blazer: "blazer",
  gilet: "blazer",
  jacket: "jacket",
  "denim jacket": "jacket",
  coat: "coat",
  "trench coat": "coat",
  parka: "coat",

  // Shoes
  sneakers: "sneaker",
  trainers: "sneaker",
  sandals: "sneaker",
  boots: "boot",
  "chelsea boots": "boot",
  loafers: "boot",
  brogues: "boot",
  heels: "heels",

  // Accessories
  bag: "bag",
  backpack: "bag",
  belt: "bag",
  hat: "hat",
  cap: "hat",
  scarf: "scarf",
  sunglasses: "sunglasses",
  watch: "watch",
  jewellery: "watch",
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
