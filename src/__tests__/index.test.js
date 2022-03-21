import app from "../app";
import Request from "supertest";

import Redis from "../models/redis.model";
afterAll(() => {
  new Redis().client.quit();
});

describe("POST /fees", () => {
  const FeeConfigurationSpec =
    "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55";

  const wrongFeeConfigurationSpec =
    "LNPY1221 NGN * *(*) : DONTAPPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0";

  it("SHOULD PARSE FEE CONFIGURATION SPEC", async () => {
    const res = await Request(app).post("/api/lannister-pay/fees").send({
      FeeConfigurationSpec,
    });

    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty("status");
    expect(res.body.status).toBe("ok");
  });

  it("SHOULD ERROR IF ANY SPEC IS BADLY FORMATTED", async () => {
    const res = await Request(app).post("/api/lannister-pay/fees").send({
      FeeConfigurationSpec: wrongFeeConfigurationSpec,
    });

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failed");
  });

  it("SHOULD ERROR IF FEE CONFIGURATION ISN'T PROVIDED", async () => {
    const res = await Request(app).post("/api/lannister-pay/fees").send({});

    expect(res.statusCode).toBe(400);
    expect(res.body.status).toBe("failed");
  });
});

describe("POST /compute-transaction-fee", () => {
  const transactions = [
    {
      ID: 91203,
      Amount: 5000,
      Currency: "NGN",
      CurrencyCountry: "NG",
      Customer: {
        ID: 2211232,
        EmailAddress: "anonimized29900@anon.io",
        FullName: "Abel Eden",
        BearsFee: true,
      },
      PaymentEntity: {
        ID: 2203454,
        Issuer: "GTBANK",
        Brand: "MASTERCARD",
        Number: "530191******2903",
        SixID: 530191,
        Type: "CREDIT-CARD",
        Country: "NG",
      },
    },
    {
      ID: 91204,
      Amount: 3500,
      Currency: "NGN",
      CurrencyCountry: "NG",
      Customer: {
        ID: 4211232,
        EmailAddress: "anonimized292200@anon.io",
        FullName: "Wenthorth Scoffield",
        BearsFee: false,
      },
      PaymentEntity: {
        ID: 2203454,
        Issuer: "AIRTEL",
        Brand: "",
        Number: "080234******2903",
        SixID: "080234",
        Type: "USSD",
        Country: "NG",
      },
    },
    {
      ID: 91204,
      Amount: 3500,
      Currency: "USD",
      CurrencyCountry: "US",
      Customer: {
        ID: 4211232,
        EmailAddress: "anonimized292200@anon.io",
        FullName: "Wenthorth Scoffield",
        BearsFee: false,
      },
      PaymentEntity: {
        ID: 2203454,
        Issuer: "WINTERFELLWALLETS",
        Brand: "",
        Number: "AX0923******0293",
        SixID: "AX0923",
        Type: "WALLET-ID",
        Country: "NG",
      },
    },
  ];

  const expectedResponses = [
    {
      AppliedFeeID: "LNPY1223",
      AppliedFeeValue: 120,
      ChargeAmount: 5120,
      SettlementAmount: 5000,
    },
    {
      AppliedFeeID: "LNPY1221",
      AppliedFeeValue: 49,
      ChargeAmount: 3500,
      SettlementAmount: 3451,
    },
    {
      status: "failed",
      message: "No fee configuration for WALLET-ID transactions",
    },
  ];

  for (let i = 0; i < 3; i++) {
    it(
      i === 2
        ? "SHOULD ERROR IF NO MATCHING CONFIGURATION IS FOUND"
        : "SHOULD APPLY MOST APPROPRIATE SPEC TO TRANSACTION",
      async () => {
        const res = await Request(app)
          .post("/api/lannister-pay/compute-transaction-fee")
          .send(transactions[i]);
        expect(res.statusCode).toBe(i < 2 ? 200 : 400);
        expect(res.body).toMatchObject(expectedResponses[i]);
      }
    );
  }
});
