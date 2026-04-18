export function parseIngredients(input: string) {
  return [...new Set(
    input
      .split(/[\n,]/g)
      .map((value) => value.trim().toLowerCase())
      .filter(Boolean)
  )];
}