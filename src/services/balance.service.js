import paymentRepository from "../repositories/payment.repository.js";

class BalanceService {
  async getBalance(referenceNumber) {
    const payment = await paymentRepository.getByReference(referenceNumber);

    if (!payment) {
      throw new Error("Payment not found.");
    }

    return {
      accountNumber: payment.senderAccount.accountNumber,
      accountBalance: Number(payment.senderAccount.balance),
      paymentAmount: Number(payment.amount),
      dailyTransferLimit: Number(payment.senderAccount.dailyTransferLimit),
      minimumReserve: Number(payment.senderAccount.minimumReserve),
      accountStatus: payment.senderAccount.status,
    };
  }
}

export default new BalanceService();