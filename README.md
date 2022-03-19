## LANNISTER PAY

This is a transaction fee processing service which calculates the fee applicable to a transaction based on specific fee configurations provided. 


## SETUP
- Clone this repo and install all dependencies with ```yarn install```. 
- Ensure you have redis installed on your local machine and spin it up by running ```redis-server``` on your terminal. Default port is 6379
  [Get started with Redis](https://redis.io/topics/quickstart)
- run ```yarn dev``` to startup the server on your localhost. Default port is 4100

### Base URL 
- http://localhost:4100/api/lannister-pay/ (local)
- https://lannister-pay-server.herokuapp.com/api/lannister-pay/ (live)
- 
### Endpoints
- /fees
- /compute-transaction-fee

   - #### /fees

      This endpoint accepts a payload of fee configuration specs which will be used to process subsequent transactions. 
        e.g 
        ```json 
        { "FeeConfigurationSpec": "LNPY1221 NGN * *(*) : APPLY PERC 1.4\nLNPY1222 NGN INTL CREDIT-CARD(VISA) : APPLY PERC 5.0\nLNPY1223 NGN LOCL CREDIT-CARD(*) : APPLY FLAT_PERC 50:1.4\nLNPY1224 NGN * BANK-ACCOUNT(*) : APPLY FLAT 100\nLNPY1225 NGN * USSD(MTN) : APPLY PERC 0.55"} ```
        
    - ### /compute-transaction-fee
       
       This endpoint accepts a transaction payload and calculate applicable fee based on previously sent fee configurations.
        sample payload
        ```json 
        { 
          "ID": 91203,
          "Amount": 5000,
          "Currency": "NGN",
          "CurrencyCountry": "NG",
          "Customer": {
            "ID": 2211232,
            "EmailAddress": "anonimized29900@anon.io",
            "FullName": "Abel Eden",
            "BearsFee": true 
          },
          "PaymentEntity": {
            "ID": 2203454,
            "Issuer": "GTBANK",
            "Brand": "MASTERCARD",
            "Number": "530191******2903",
            "SixID": 530191,
            "Type": "CREDIT-CARD",
            "Country": "NG"
          }
        }
        ```
  [View full documentation with examples](https://documenter.getpostman.com/view/15425199/UVsPQQhs)
