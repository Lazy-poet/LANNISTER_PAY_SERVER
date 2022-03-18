import {
  FEE_CONFIGURATION,
  SPECIFICITY,
  FEE_CONFIGURATION_WITH_SPECIFICITY,
} from "../types";

export default class ParseConfigService {
  /**
   *
   * @param feeSpecs the fee configuration spec
   * @returns a value indicating the specificity of a particular specification
   */
  protected getConfigSpecificity = (
    feeSpecs: FEE_CONFIGURATION["feeSpecs"]
  ): SPECIFICITY => {
    //mimimum specificity should be value of SPECIFICITY.LEAST_SPECIFIC ( 0 in this case), hence the Math.max wrapper
    return Math.max(
      (Object.keys(feeSpecs) as (keyof FEE_CONFIGURATION["feeSpecs"])[]).reduce(
        (total: number, item: keyof FEE_CONFIGURATION["feeSpecs"]) => {
          // specificity is determined based on the number of values that aren't wildcards (*);
          total += Number(feeSpecs[item] !== "*");
          return total;
        },
        SPECIFICITY.LEAST_SPECIFIC
      ) - 1, // -1 because specificity is designed to be 0-indexed
      SPECIFICITY.LEAST_SPECIFIC
    );
  };

  /**
   *
   * @param configSpecs input config spec string from request body
   * @returns formatted JSON object of config specs
   */
  protected parseConfigSpecIntoJSON = (
    configSpecs: any
  ): FEE_CONFIGURATION_WITH_SPECIFICITY[] => {
    return (
      configSpecs
        .split("\n")
        .map((configSpec: string) =>
          configSpec
            .split(" : APPLY ")
            .join("")
            .replace(/[\(\)]/g, " ")
            .split(" ")
        )
        .map((config: string[]) => ({
          feeId: config[0],
          feeSpecs: {
            feeCurrency: config[1],
            feeLocale: config[2],
            feeEntity: config[3],
            entityProperty: config[4],
          },
          chargesSpec: {
            feeType: config[5],
            feeValue: config[6],
          },
        }))
        .map((config: FEE_CONFIGURATION) => ({
          ...config,
          specificity: this.getConfigSpecificity(config.feeSpecs),
        }))
        //sort by specificity inn descending order so that the spec with highest specificity is encountered first when finding through the array
        .sort(
          (
            a: FEE_CONFIGURATION_WITH_SPECIFICITY,
            b: FEE_CONFIGURATION_WITH_SPECIFICITY
          ) => b.specificity - a.specificity
        )
    );
  };
}
