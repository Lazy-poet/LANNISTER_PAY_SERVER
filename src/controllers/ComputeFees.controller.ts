import { Request, Response } from "express";
import ComputeTransactionFeesService from "../services/ComputeTransactionFees.service";
import CatchAsyncError from "../utils/catchAsyncError";
import response from "../utils/response";
import validateTransactionPayload from "../validations/validateTransactionPayload";

export default class ComputeTransactionFeesController extends ComputeTransactionFeesService {
  protected ComputeTransactionFees = CatchAsyncError(
    async (req: Request, res: Response) => {
      // validate request body to ensure conformity
      const error = validateTransactionPayload(req.body);
      if (error) {
        return response.setError(res, 400, error);
      }

      const transactionConfig = this.getConfigurationFromTransactionPayload(
        req.body
      );
      const feeConfigurationSpecs = await this.getFeeConfigurationSpecs();

      const matchingConfigSpec = this.getMatchingConfigSpec(
        transactionConfig,
        feeConfigurationSpecs
      );

      if (!matchingConfigSpec) {
        response.setError(
          res,
          400,
          `No fee configuration for ${req.body.PaymentEntity.Type} transactions`
        );
      } else {
        const transactionFee = this.computeTransactionFee(
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
