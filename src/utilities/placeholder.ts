export const placeholder = (name: string, size = 400, bg = "000000", fg = "FFFFFF") =>
  `https://placehold.co/${size}x${size}/${bg}/${fg}?text=${encodeURIComponent(name)}`;
