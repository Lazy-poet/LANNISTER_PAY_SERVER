import Joi from "joi";

export default (data) => {
  const configSchema = Joi.object({
    feeId: Joi.string().required(),
    feeSpecs: Joi.object()
      .keys({
        feeCurrency: Joi.string().required(),
        feeLocale: Joi.string().valid("INTL", "LOCL", "*").required(),
        feeEntity: Joi.string()
          .valid(
            "CREDIT-CARD",
            "DEBIT-CARD",
            "BANK-ACCOUNT",
            "USSD",
            "WALLET-ID",
            "*"
          )
          .required(),
        entityProperty: Joi.string().required(),
      })
      .required(),
    chargesSpec: Joi.object()
      .keys({
        feeType: Joi.string().valid("FLAT", "PERC", "FLAT_PERC").required(),
        feeValue: Joi.alternatives()
          .try(...[Joi.string(), Joi.number()])
          .required(),
      })
      .required(),
    specificity: Joi.number().valid(0, 1, 2, 3).required(),
  });

  const arraySchema = Joi.array().items(configSchema);
  const result = arraySchema.validate(data);
  if (result.error) {
    return result.error.message;
  } else {
    return null;
  }
};
