import paymentRepository from "../repositories/payment.repository.js";

class NetworkService {
  async getNetworkStatus(paymentReference) {
    const payment = await paymentRepository.getByReference(paymentReference);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    return {
      rail: payment.rail,
      gatewayResponseCode: payment.gatewayResponseCode || null,
      bankResponseCode: payment.bankResponseCode || null,
      ackReceived: payment.ackReceived,
      networkLatency: payment.networkLatency,
      retryCount: payment.retryCount,
      gatewayLogs: payment.gatewayLogs || null,
      switchLogs: payment.switchLogs || null,
    };
  }
}

export default new NetworkService();