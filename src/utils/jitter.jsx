const PATTERN = [-2, 1.5, -1, 2, -1.5, 1];

export function jitterFor(index) {
  return PATTERN[index % PATTERN.length];
}