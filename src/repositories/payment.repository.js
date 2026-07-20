import prisma from "../config/prisma.js";

class PaymentRepository {
  // inside a class while creating function, we dont use function keyword
  async getByReference(referenceNumber) {
    return prisma.payment.findUnique({
      where: {
        referenceNumber,
      },
      include: {
        senderAccount: {
          include: {
            customer: true,
          },
        },
        investigationCase: true,
      },
    });
  }

  async updateStatus(paymentId, status) {
    return prisma.payment.update({
      where: {
        id: paymentId,
      },
      data: {
        status,
      },
    });
  }
}

export default new PaymentRepository();