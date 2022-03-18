import { ValueOf, FEE_CONFIGURATION } from "../types";

// function which compares two values and returns true if they match or if one is a wildcard
export default (
  transactionPayloadValue: ValueOf<ValueOf<FEE_CONFIGURATION["feeSpecs"]>>,
  configSpecsValue: ValueOf<ValueOf<FEE_CONFIGURATION["feeSpecs"]>>
) => {
  return (
    transactionPayloadValue.toString() === configSpecsValue.toString() ||
    configSpecsValue === "*"
  );
};
