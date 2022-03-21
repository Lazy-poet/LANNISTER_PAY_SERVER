// function which compares two values and returns true if they match or if one is a wildcard
export default (
  transactionPayloadValue,
  configSpecsValue
) => {
  return (
    transactionPayloadValue.toString() === configSpecsValue.toString() ||
    configSpecsValue === "*"
  );
};
