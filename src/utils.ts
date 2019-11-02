export function isPercentage(value: string) {
  return /^.+%$/.test(value)
}

export function parsePersentage(percentage: string): number {
  const result = parseFloat(percentage) / 100;

  if (!/^[0-9]+\.?[0-9]+%$/.test(percentage) || Number.isNaN(result)) {
    throw new Error(`The input value ${percentage} may not be a valid percentage string.`);
  }
  return result;
}