// Repository
//       │
//       ▼
// Payment Service
//       │
//       ▼
// Return a clean "Payment Context" for the agent


// Instead of returning raw Prisma objects to the AI, we’ll return a clean object like:

/**
{
  "paymentReference": "PAY0002",
  "amount": 5000,
  "rail": "UPI",
  "failureReason": "NETWORK_TIMEOUT",
  "sender": {
    "name": "Jeet Singh",
    "accountNumber": "110000001",
    "balance": "50000.00"
  },
  "receiver": {
    "name": "Rahul Sharma",
    "bank": "HDFC Bank",
    "ifsc": "HDFC0001234"
  }
}
*/

import paymentRepository from "../repositories/payment.repository.js";

class PaymentService {
  async getPaymentContext(referenceNumber) {
    const payment = await paymentRepository.getByReference(referenceNumber);

    if(!payment){
      throw new Error("Payment not found");
    }
    return{
      paymentReference: payment.referenceNumber,

      amount: Number(payment.amount),

      rail: payment.rail,

      status: payment.status,

      initiatedAt: payment.initiatedAt,

      submittedAt: payment.submittedAt,

      completedAt: payment.completedAt,      

      sender: {

        name: payment.senderAccount.customer.fullName,

        accountNumber: payment.senderAccount.accountNumber,

        balance: Number(payment.senderAccount.balance),

      },

      receiver: {

        name: payment.receiverName,

        accountNumber: payment.receiverAccountNumber,

        ifsc: payment.receiverIFSC,

        bank: payment.receiverBankName,
      }
    }
  }
}

export default new PaymentService();