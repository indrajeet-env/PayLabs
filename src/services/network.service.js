import paymentRepository from "../repositories/payment.repository.js";

const NETWORK_STATUS_MAP = {
  NETWORK_TIMEOUT: {
    status: "TIMEOUT",
    recommendation: "Retry the payment after network recovery.",
  },

  ACK_TIMEOUT: {
    status: "ACK_TIMEOUT",
    recommendation:
      "Verify acknowledgement from the payment network before retrying.",
  },

  SWITCH_FAILURE: {
    status: "SWITCH_FAILURE",
    recommendation:
      "Retry through the payment switch once the switch is available.",
  },
};

class NetworkService {
  async getNetworkStatus(paymentReference) {
    const payment = await paymentRepository.getByReference(paymentReference);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    const networkIssue = NETWORK_STATUS_MAP[payment.failureReason];

    return {
      rail: payment.rail,

      networkStatus: networkIssue
        ? networkIssue.status // if none of the networkIssue, then return healthy, i.e no network issue, issue could be something else
        : "HEALTHY",

      failureReason: payment.failureReason,

      recommendation: networkIssue
        ? networkIssue.recommendation
        : "Network does not appear to be the cause of this payment failure.",
    };
  }
}

export default new NetworkService();