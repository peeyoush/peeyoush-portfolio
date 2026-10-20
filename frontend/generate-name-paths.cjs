
const fs = require("node:fs");
const opentype = require("opentype.js");

const FONT_PATH =
  "./node_modules/@fontsource/lato/files/lato-latin-300-normal.woff";

const OUTPUT_PATH = "./src/data/peeyoush-glyphs.json";
const TEXT = "Peeyoush";
const FONT_SIZE = 100;
const TRACKING = -4;

// Each route is designed for the shape of its own letter.
// Coordinates use a normalized 100 x 100 coordinate system.
// These are continuous routes, not generic bounding-box spirals.

const SNAKE_ROUTES = {
  // Start at the foot of the stem, climb it, loop around the bowl,
  // and return to the stem.
  P: `
    M 7 100
    L 7 5
    C 23 5 42 5 56 5
    C 79 5 93 17 93 33
    C 93 49 79 61 56 61
    L 7 61
  `,

  // Cross the bar, curl around the lower bowl, then around the
  // upper bowl to finish the loop.
  e: `
    M 8 50
    L 92 50
    C 91 73 73 91 50 91
    C 27 91 9 74 9 50
    C 9 26 27 9 50 9
    C 73 9 91 26 92 50
  `,

  // Trace the left arm into the join, travel up the right arm,
  // then return through the descending tail.
  y: `
    M 10 5
    C 20 31 35 64 50 64
    C 65 64 80 31 90 5
    C 82 31 69 66 56 83
    C 45 98 30 100 15 95
  `,

  // Follow the oval ring, returning to the starting point.
  o: `
    M 50 8
    C 73 8 92 26 92 50
    C 92 74 73 92 50 92
    C 27 92 8 74 8 50
    C 8 26 27 8 50 8
    Z
  `,

  // Travel down one stem, around the base, then up the other.
  u: `
    M 10 5
    L 10 59
    C 10 82 25 95 50 95
    C 75 95 90 82 90 59
    L 90 5
  `,

  // Follow the upper curve, cross the middle, then flow through
  // the lower curve toward its endpoint.
  s: `
    M 82 15
    C 68 5 44 5 28 15
    C 11 25 19 39 40 47
    L 62 55
    C 83 63 89 78 71 90
    C 54 100 30 96 15 85
  `,

  // Climb the stem, arch over the shoulder, then descend the right.
  h: `
    M 10 100
    L 10 50
    C 10 28 24 17 45 17
    C 67 17 84 31 84 54
    L 84 100
  `,
};


const buffer = fs.readFileSync(FONT_PATH);

const font = opentype.parse(
  buffer.buffer.slice(
    buffer.byteOffset,
    buffer.byteOffset + buffer.byteLength
  )
);

const scale = FONT_SIZE / font.unitsPerEm;
const baseline = font.ascender;
const viewBoxHeight =
  (font.ascender - font.descender) * scale;

function format(value) {
  return Number(value.toFixed(3)).toString();
}

function toSvgPath(commands, offsetX) {
  return commands
    .map((command) => {
      const x = (value) => format((offsetX + value) * scale);
      const y = (value) => format((baseline - value) * scale);

      switch (command.type) {
        case "M":
        case "L":
          return `${command.type} ${x(command.x)} ${y(command.y)}`;

        case "Q":
          return `Q ${x(command.x1)} ${y(command.y1)} ${x(command.x)} ${y(command.y)}`;

        case "C":
          return `C ${x(command.x1)} ${y(command.y1)} ${x(command.x2)} ${y(command.y2)} ${x(command.x)} ${y(command.y)}`;

        case "Z":
          return "Z";

        default:
          throw new Error(
            `Unsupported font path command: ${command.type}`
          );
      }
    })
    .join(" ");
}

function transformSnakeRoute(route, x, y, width, height) {
  const tokens = route.match(/[MLCZ]|-?(?:\d+\.?\d*|\.\d+)/g);

  if (!tokens) {
    throw new Error("Invalid snake route.");
  }

  const result = [];
  let index = 0;

  while (index < tokens.length) {
    const command = tokens[index++];

    if (command === "Z") {
      result.push("Z");
      continue;
    }

    const parameterCount = command === "C" ? 6 : 2;
    const values = [];

    for (let i = 0; i < parameterCount; i++) {
      values.push(Number(tokens[index++]));
    }

    const mapped = values.map((value, i) =>
      format(
        i % 2 === 0
          ? x + (value / 100) * width
          : y + (value / 100) * height
      )
    );

    result.push(`${command} ${mapped.join(" ")}`);
  }

  return result.join(" ");
}

const glyphs = [];
let cursorX = 0;
let previousGlyph = null;

for (const character of TEXT) {
  const glyph = font.charToGlyph(character);

  if (previousGlyph && typeof font.getKerningValue === "function") {
    cursorX += font.getKerningValue(previousGlyph, glyph);
  }

  const bounds = glyph.path.getBoundingBox();

  const x = (cursorX + bounds.x1) * scale;
  const y = (baseline - bounds.y2) * scale;
  const width = (bounds.x2 - bounds.x1) * scale;
  const height = (bounds.y2 - bounds.y1) * scale;

  const route = SNAKE_ROUTES[character];

  if (!route) {
    throw new Error(`No custom snake route exists for "${character}".`);
  }

  glyphs.push({
    character,
    x,
    y,
    width,
    height,
    path: toSvgPath(glyph.path.commands, cursorX),
    snakePath: transformSnakeRoute(
      route,
      x,
      y,
      width,
      height
    ),
    snakeStrokeWidth: 4.4,
  });

  cursorX += glyph.advanceWidth;

  if (character !== TEXT[TEXT.length - 1]) {
    cursorX += TRACKING / scale;
  }

  previousGlyph = glyph;
}

const result = {
  text: TEXT,
  width: cursorX * scale,
  height: viewBoxHeight,
  glyphs,
};

fs.writeFileSync(OUTPUT_PATH, JSON.stringify(result, null, 2));

console.log(`Generated ${glyphs.length} custom letter routes.`);
console.log(`Output: ${OUTPUT_PATH}`);
