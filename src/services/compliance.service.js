import paymentRepository from "../repositories/payment.repository.js";

class ComplianceService {
  async getComplianceStatus(paymentReference) {
    const payment = await paymentRepository.getByReference(paymentReference);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    return {
      amlRiskScore: payment.amlRiskScore,
      amlRiskReasons: payment.amlRiskReasons || [],
      kycStatus: payment.kycStatus,
      sanctionsMatches: payment.sanctionsMatches,
      matchedEntity: payment.matchedEntity || null,
      matchedList: payment.matchedList || null,
      riskEngineResponse: payment.riskEngineResponse || null,
    };
  }
}

export default new ComplianceService();