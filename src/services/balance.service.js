import paymentRepository from "../repositories/payment.repository.js";

class BalanceService {
  async getBalance(referenceNumber) {
    const payment = await paymentRepository.getByReference(referenceNumber);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    const availableBalance = Number(payment.senderAccount.balance);

    return {
      accountNumber: payment.senderAccount.accountNumber,

      availableBalance,

      requiredAmount: Number(payment.amount),

      sufficientFunds: availableBalance >= Number(payment.amount), // returns true or false based on the comparison of available balance and required amount
    };
  }
}

export default new BalanceService();