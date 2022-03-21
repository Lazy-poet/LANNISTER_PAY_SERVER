import ComputeTransactionFeesService from "../services/ComputeTransactionFees.service";
import CatchAsyncError from "../utils/catchAsyncError";
import response from "../utils/response";
import validateTransactionPayload from "../validations/validateTransactionPayload";

class ComputeTransactionFeesController {
  #computeTransactionFeesService;

  constructor(computeTransactionFeesService) {
    this.#computeTransactionFeesService = computeTransactionFeesService;
  }

  ComputeTransactionFees = CatchAsyncError(
    async (req, res) => {
      // validate request body to ensure conformity
      const error = validateTransactionPayload(req.body);
      if (error) {
        return response.setError(res, 400, error);
      }

      const transactionConfig =
        this.#computeTransactionFeesService.getConfigurationFromTransactionPayload(
          req.body
        );
      const feeConfigurationSpecs =
        await this.#computeTransactionFeesService.getFeeConfigurationSpecs();

      const matchingConfigSpec =
        this.#computeTransactionFeesService.getMatchingConfigSpec(
          transactionConfig,
          feeConfigurationSpecs
        );

      if (!matchingConfigSpec) {
        return response.setError(
          res,
          400,
          `No fee configuration for ${req.body.PaymentEntity.Type} transactions`
        );
      } else {
        const transactionFee =
          this.#computeTransactionFeesService.computeTransactionFee(
            matchingConfigSpec,
            req.body.Amount
          );
        const chargeAmount = req.body.Customer.BearsFee
          ? transactionFee + req.body.Amount
          : req.body.Amount;
        res.status(200).json({
          AppliedFeeID: matchingConfigSpec.feeId,
          AppliedFeeValue: transactionFee,
          ChargeAmount: chargeAmount,
          SettlementAmount: chargeAmount - transactionFee,
        });
      }
    },
    "error computing transaction fee"
  );
}

export default new ComputeTransactionFeesController(
  new ComputeTransactionFeesService()
);
