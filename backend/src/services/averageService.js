export const normalizeWeightedAverage = (value) => {
  if (value === null || value === undefined) {
    return null;
  }

  const numberValue = Number(value);
  if (Number.isNaN(numberValue)) {
    return null;
  }

  return Number(numberValue.toFixed(2));
};
