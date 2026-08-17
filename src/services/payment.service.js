import paymentRepository from "../repositories/payment.repository.js";

class PaymentService {
  async getPaymentContext(referenceNumber) {
    const payment = await paymentRepository.getByReference(referenceNumber);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    return {
      paymentReference: payment.referenceNumber,
      amount: Number(payment.amount),
      rail: payment.rail,
      status: payment.status,
      requiresInvestigation: payment.requiresInvestigation,

      sender: {
        name: payment.senderAccount.customer.fullName,
        accountNumber: payment.senderAccount.accountNumber,
        balance: Number(payment.senderAccount.balance),
        dailyTransferLimit: Number(
          payment.senderAccount.dailyTransferLimit
        ),
        minimumReserve: Number(payment.senderAccount.minimumReserve),
        accountStatus: payment.senderAccount.status,
      },

      receiver: {
        name: payment.receiverName,
        accountNumber: payment.receiverAccountNumber,
        ifsc: payment.receiverIFSC,
        bank: payment.receiverBankName,
      },

      networkSignals: {
        gatewayResponseCode: payment.gatewayResponseCode,
        bankResponseCode: payment.bankResponseCode,
        ackReceived: payment.ackReceived,
        networkLatency: payment.networkLatency,
        retryCount: payment.retryCount,
        gatewayLogs: payment.gatewayLogs,
        switchLogs: payment.switchLogs,
      },

      complianceSignals: {
        amlRiskScore: payment.amlRiskScore,
        amlRiskReasons: payment.amlRiskReasons,
        kycStatus: payment.kycStatus,
        sanctionsMatches: payment.sanctionsMatches,
        matchedEntity: payment.matchedEntity,
        matchedList: payment.matchedList,
        riskEngineResponse: payment.riskEngineResponse,
      },
    };
  }
}

export default new PaymentService();