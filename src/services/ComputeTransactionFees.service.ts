import {
  Transaction,
  FEE_CONFIGURATION,
  FEE_CONFIGURATION_WITH_SPECIFICITY,
  FEE_TYPE,
} from "../types";
// import Redis from "../models/redis.model";
import LocalDB from "../models/LocalDB.model";
import match from "../utils/matchFieldValues";

export default class ComputeTransactionFeesService {
  /**
   * @param payload the Transaction object posted to the server
   * @returns json object representing the specs of the transaction contained in the posted request
   */
  public readonly getConfigurationFromTransactionPayload = (
    payload: Transaction
  ):
    | FEE_CONFIGURATION["feeSpecs"]
    | { entityProperties: (string | number)[] } => {
    const feeCurrency = payload.Currency;
    const feeLocale =
      payload.CurrencyCountry === payload.PaymentEntity.Country
        ? "LOCL"
        : "INTL";

    const feeEntity = payload.PaymentEntity.Type;
    const { ID, Issuer, Brand, Number: number, SixID } = payload.PaymentEntity;

    //since either of these properties can be used as {ENTITY-PROPERTY} in the config, we store them all in ann array
    const entityProperties = [ID, Issuer, Brand, number, SixID];

    return {
      feeCurrency,
      feeLocale,
      feeEntity,
      entityProperties,
    };
  };

  /**
   *
   * @returns a json object of the fee configuration specs from redis cache
   */
  public readonly getFeeConfigurationSpecs = async () => {
    // const feesConfiguration = await new Redis().getData("config");
    const feesConfiguration = await new LocalDB().getDataFromDB();
    return feesConfiguration;
  };

  /**
   *
   * @param transactionConfig details of the posted transaction
   * @param configSpecs array of all available fee configuration specs
   * @returns a matching configSpec or undefined
   */
  public readonly getMatchingConfigSpec = (
    transactionConfig:
      | FEE_CONFIGURATION["feeSpecs"]
      | { entityProperties: (string | number)[] },
    configSpecs: FEE_CONFIGURATION_WITH_SPECIFICITY[]
  ) => {
    return configSpecs.find((spec: FEE_CONFIGURATION_WITH_SPECIFICITY) => {
      // returns the first element which returns true if every property in it is satisfied by the equivalent property in the transactionConfig object
      return (
        Object.keys(transactionConfig) as (
          | keyof FEE_CONFIGURATION["feeSpecs"]
          | keyof { entityProperties: (string | number)[] }
        )[]
      ).every(
        (
          config:
            | keyof FEE_CONFIGURATION["feeSpecs"]
            | keyof { entityProperties: (string | number)[] }
        ) => {
          if (config === "entityProperties") {
            //for the entityProperties array which is an array of all possible {ENTITY-PROPERTY},
            // we return true if any value in it is matched by the feeConfiguration spec's entityProperty value
            return (
              transactionConfig as { entityProperties: (string | number)[] }
            )[config].some((c: string | number) =>
              match(c, spec.feeSpecs.entityProperty)
            );
          } else {
            // match the properties in the transactionConfig object with that of the feeConfiguration specs.
            return match(
              (transactionConfig as FEE_CONFIGURATION["feeSpecs"])[config],
              spec.feeSpecs[config]
            );
          }
        }
      );
    });
  };

  /**
   *
   * @param feeConfig the fee configuration spec to be applied to transaction
   * @param transactionAmount the original transaction amount
   * @returns the computed charge based on the fee type and value
   */
  public readonly computeTransactionFee = (
    feeConfig: FEE_CONFIGURATION_WITH_SPECIFICITY,
    transactionAmount: number
  ) => {
    switch (feeConfig.chargesSpec.feeType) {
      case FEE_TYPE.FLAT:
        return Number(feeConfig.chargesSpec.feeValue);

      case FEE_TYPE.PERC:
        return Math.round(
          ((feeConfig.chargesSpec.feeValue as number) / 100) * transactionAmount
        );

      case FEE_TYPE.FLAT_PERC:
        const [flatFee, percFee] = (
          feeConfig.chargesSpec.feeValue as string
        ).split(":");
        return (
          Number(flatFee) +
          Math.round((Number(percFee) * transactionAmount) / 100)
        );
    }
  };
}
