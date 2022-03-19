export type ValueOf<T> = T[keyof T];

enum FEE_ENTITY {
  CREDIT_CARD = "CREDIT-CARD",
  DEBIT_CARD = "DEBIT-CARD",
  BANK_ACCOUNT = "BANK-ACCOUNT",
  USSD = "USSD",
  WALLET_ID = "WALLET-ID",
}

export enum FEE_TYPE {
  FLAT = "FLAT",
  PERC = "PERC",
  FLAT_PERC = "FLAT_PERC",
}

export enum SPECIFICITY {
  LEAST_SPECIFIC,
  MODERATELY_SPECIFIC,
  VERY_SPECIFIC,
  MOST_SPECIFIC,
}

export type FEE_CONFIGURATION = {
  feeId: string;
  feeSpecs: {
    feeCurrency: string;
    feeLocale: "INTL" | "LOCL" | "*";
    feeEntity: FEE_ENTITY | "*";
    entityProperty: string;
  };
  chargesSpec: {
    feeType: FEE_TYPE;
    feeValue: number | string;
  };
};

export type FEE_CONFIGURATION_WITH_SPECIFICITY = FEE_CONFIGURATION & {
  specificity: SPECIFICITY;
};

export type Transaction = {
  ID: number;
  Amount: number;
  Currency: string;
  CurrencyCountry: string;
  Customer: {
    ID: number;
    EmailAddress: string;
    FullName: string;
    BearsFee: boolean;
  };
  PaymentEntity: {
    ID: number;
    Issuer: string;
    Brand: string;
    Number: string;
    SixID: number;
    Type: FEE_ENTITY;
    Country: string;
  };
};

export const LOCAL_DB_FILENAME = "localdb.json";
