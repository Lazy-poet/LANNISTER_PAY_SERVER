import Joi from "joi";

export default (data) => {
  const schema = Joi.object({
    ID: Joi.number().required(),
    Amount: Joi.number().required(),
    Currency: Joi.string().required(),
    CurrencyCountry: Joi.string().required(),
    Customer: Joi.object()
      .keys({
        ID: Joi.number().required(),
        EmailAddress: Joi.string().email().required(),
        FullName: Joi.string().required(),
        BearsFee: Joi.boolean().required(),
      })
      .required(),
    PaymentEntity: Joi.object()
      .keys({
        ID: Joi.number().required(),
        Issuer: Joi.string().required(),
        Brand: Joi.string().allow("").required(),
        Number: Joi.string().required(),
        SixID: Joi.alternatives(Joi.number(), Joi.string()).required(),
        Type: Joi.string()
          .valid(
            "CREDIT-CARD",
            "DEBIT-CARD",
            "BANK-ACCOUNT",
            "USSD",
            "WALLET-ID"
          )
          .required(),
        Country: Joi.string().required(),
      })
      .required(),
  });

  const result = schema.validate(data);
  if (result.error) {
    return result.error.message;
  } else {
    return null;
  }
};
