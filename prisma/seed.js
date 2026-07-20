import { PrismaClient, Prisma } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database...");

  // -------------------------
  // Clear Existing Data
  // -------------------------

  await prisma.agentRun.deleteMany();
  await prisma.auditLog.deleteMany();
  await prisma.decision.deleteMany();
  await prisma.evidence.deleteMany();
  await prisma.investigationCase.deleteMany();
  await prisma.payment.deleteMany();
  await prisma.account.deleteMany();
  await prisma.customer.deleteMany();

  // -------------------------
  // Customers
  // -------------------------

  const customers = [
    {
      fullName: "Jeet Singh",
      email: "jeet@paylabs.ai",
      phone: "9876543210",
    },
    {
      fullName: "Rahul Sharma",
      email: "rahul@paylabs.ai",
      phone: "9876543211",
    },
    {
      fullName: "Ankit Verma",
      email: "ankit@paylabs.ai",
      phone: "9876543212",
    },
    {
      fullName: "Mahender Singh",
      email: "mahender@paylabs.ai",
      phone: "9876543213",
    },
    {
      fullName: "Deep Patel",
      email: "deep@paylabs.ai",
      phone: "9876543214",
    },
  ];

  const customerMap = {};

  for (const customer of customers) {
    const createdCustomer = await prisma.customer.create({
      data: customer,
    });

    customerMap[customer.fullName] = createdCustomer;
  }

  console.log("✅ Customers Seeded");

  // -------------------------
  // Accounts
  // -------------------------

  const accounts = [
    {
      customer: "Jeet Singh",
      accountNumber: "110000001",
      balance: 50000,
    },
    {
      customer: "Rahul Sharma",
      accountNumber: "110000002",
      balance: 3500,
    },
    {
      customer: "Ankit Verma",
      accountNumber: "110000003",
      balance: 150000,
    },
    {
      customer: "Mahender Singh",
      accountNumber: "110000004",
      balance: 1250000,
    },
    {
      customer: "Deep Patel",
      accountNumber: "110000005",
      balance: 75000,
    },
  ];

  const accountMap = {};

  for (const account of accounts) {
    const createdAccount = await prisma.account.create({
      data: {
        customerId: customerMap[account.customer].id,
        accountNumber: account.accountNumber,
        balance: new Prisma.Decimal(account.balance),
        currency: "INR",
        status: "ACTIVE",
      },
    });

    accountMap[account.customer] = createdAccount;
  }

  console.log("✅ Accounts Seeded");

  // -------------------------
  // Payments
  // -------------------------

  const payments = [
    {
      sender: "Jeet Singh",
      receiverName: "Rahul Sharma",
      receiverAccountNumber: "210000001",
      receiverIFSC: "HDFC0001234",
      receiverBankName: "HDFC Bank",
      amount: 5000,
      rail: "UPI",
      status: "SUCCESS",
      failureReason: "NONE",
      referenceNumber: "PAY0001",
      requiresInvestigation: false,
    },
    {
      sender: "Jeet Singh",
      receiverName: "Rahul Sharma",
      receiverAccountNumber: "210000001",
      receiverIFSC: "HDFC0001234",
      receiverBankName: "HDFC Bank",
      amount: 5000,
      rail: "UPI",
      status: "FAILED",
      failureReason: "NETWORK_TIMEOUT",
      referenceNumber: "PAY0002",
      requiresInvestigation: true,
    },
    {
      sender: "Rahul Sharma",
      receiverName: "Ankit Verma",
      receiverAccountNumber: "210000002",
      receiverIFSC: "SBIN0004521",
      receiverBankName: "State Bank of India",
      amount: 10000,
      rail: "IMPS",
      status: "FAILED",
      failureReason: "INSUFFICIENT_FUNDS",
      referenceNumber: "PAY0003",
      requiresInvestigation: true,
    },
    {
      sender: "Mahender Singh",
      receiverName: "ABC Imports Pvt Ltd",
      receiverAccountNumber: "210000003",
      receiverIFSC: "ICIC0008976",
      receiverBankName: "ICICI Bank",
      amount: 350000,
      rail: "RTGS",
      status: "FAILED",
      failureReason: "ACK_TIMEOUT",
      referenceNumber: "PAY0004",
      requiresInvestigation: true,
    },
    {
      sender: "Mahender Singh",
      receiverName: "Global Tech Ltd",
      receiverAccountNumber: "210000004",
      receiverIFSC: "HSBC0009876",
      receiverBankName: "HSBC",
      amount: 1500000,
      rail: "SWIFT",
      status: "FAILED",
      failureReason: "AML_HOLD",
      referenceNumber: "PAY0005",
      requiresInvestigation: true,
    },
    {
      sender: "Deep Patel",
      receiverName: "Sneha Nair",
      receiverAccountNumber: "210000005",
      receiverIFSC: "HDFC0007654",
      receiverBankName: "HDFC Bank",
      amount: 2000,
      rail: "UPI",
      status: "FAILED",
      failureReason: "BENEFICIARY_INVALID",
      referenceNumber: "PAY0006",
      requiresInvestigation: true,
    },
    {
      sender: "Deep Patel",
      receiverName: "Arjun Patel",
      receiverAccountNumber: "210000006",
      receiverIFSC: "KKBK0002222",
      receiverBankName: "Kotak Mahindra Bank",
      amount: 8000,
      rail: "NEFT",
      status: "FAILED",
      failureReason: "ACCOUNT_CLOSED",
      referenceNumber: "PAY0007",
      requiresInvestigation: true,
    },
    {
      sender: "Jeet Singh",
      receiverName: "Rahul Sharma",
      receiverAccountNumber: "210000001",
      receiverIFSC: "HDFC0001234",
      receiverBankName: "HDFC Bank",
      amount: 5000,
      rail: "UPI",
      status: "FAILED",
      failureReason: "DUPLICATE_PAYMENT",
      referenceNumber: "PAY0008",
      requiresInvestigation: true,
    },
    {
      sender: "Mahender Singh",
      receiverName: "XYZ Imports Pvt Ltd",
      receiverAccountNumber: "210000007",
      receiverIFSC: "UTIB0004444",
      receiverBankName: "Axis Bank",
      amount: 250000,
      rail: "RTGS",
      status: "FAILED",
      failureReason: "SWITCH_FAILURE",
      referenceNumber: "PAY0009",
      requiresInvestigation: true,
    },
    {
      sender: "Jeet Singh",
      receiverName: "Deep Patel",
      receiverAccountNumber: "210000008",
      receiverIFSC: "YESB0001000",
      receiverBankName: "Yes Bank",
      amount: 2500,
      rail: "IMPS",
      status: "SUCCESS",
      failureReason: "NONE",
      referenceNumber: "PAY0010",
      requiresInvestigation: false,
    },
    {
      sender: "Ankit Verma",
      receiverName: "Global Trade LLC",
      receiverAccountNumber: "210000009",
      receiverIFSC: "CITI0000001",
      receiverBankName: "Citibank",
      amount: 500000,
      rail: "SWIFT",
      status: "FAILED",
      failureReason: "SANCTIONS_HOLD",
      referenceNumber: "PAY0011",
      requiresInvestigation: true,
    },
    {
      sender: "Ankit Verma",
      receiverName: "Vijay Kumar",
      receiverAccountNumber: "210000010",
      receiverIFSC: "BARB0WELLES",
      receiverBankName: "Bank of Baroda",
      amount: 15000,
      rail: "NEFT",
      status: "FAILED",
      failureReason: "UNKNOWN",
      referenceNumber: "PAY0012",
      requiresInvestigation: true,
    },
    {
      sender: "Deep Patel",
      receiverName: "Priya Sharma",
      receiverAccountNumber: "210000011",
      receiverIFSC: "ICIC0001234",
      receiverBankName: "ICICI Bank",
      amount: 12000,
      rail: "UPI",
      status: "SUCCESS",
      failureReason: "NONE",
      referenceNumber: "PAY0013",
      requiresInvestigation: false,
    },
    {
      sender: "Rahul Sharma",
      receiverName: "Karan Johar",
      receiverAccountNumber: "210000012",
      receiverIFSC: "HDFC0009999",
      receiverBankName: "HDFC Bank",
      amount: 1000,
      rail: "UPI",
      status: "SUCCESS",
      failureReason: "NONE",
      referenceNumber: "PAY0014",
      requiresInvestigation: false,
    },
    {
      sender: "Mahender Singh",
      receiverName: "Rajesh Koothrapali",
      receiverAccountNumber: "210000013",
      receiverIFSC: "SBIN0000111",
      receiverBankName: "State Bank of India",
      amount: 75000,
      rail: "IMPS",
      status: "SUCCESS",
      failureReason: "NONE",
      referenceNumber: "PAY0015",
      requiresInvestigation: false,
    },
  ];

  const priorityMap = {
    NETWORK_TIMEOUT: "MEDIUM",
    INSUFFICIENT_FUNDS: "LOW",
    ACK_TIMEOUT: "HIGH",
    AML_HOLD: "CRITICAL",
    BENEFICIARY_INVALID: "LOW",
    ACCOUNT_CLOSED: "LOW",
    DUPLICATE_PAYMENT: "MEDIUM",
    SWITCH_FAILURE: "HIGH",
    UNKNOWN: "HIGH",
    SANCTIONS_HOLD: "CRITICAL",
  };

  for (const payment of payments) {
    const createdPayment = await prisma.payment.create({
      data: {
        senderAccountId: accountMap[payment.sender].id,
        receiverName: payment.receiverName,
        receiverAccountNumber: payment.receiverAccountNumber,
        receiverIFSC: payment.receiverIFSC,
        receiverBankName: payment.receiverBankName,
        amount: new Prisma.Decimal(payment.amount),
        rail: payment.rail,
        status: payment.status,
        failureReason: payment.failureReason,
        requiresInvestigation: payment.requiresInvestigation,
        referenceNumber: payment.referenceNumber,
        idempotencyKey: crypto.randomUUID(),
      },
    });

    if (payment.requiresInvestigation) {
      await prisma.investigationCase.create({
        data: {
          paymentId: createdPayment.id,
          priority: priorityMap[payment.failureReason] || "MEDIUM",
          status: "OPEN",
        },
      });
    }
  }

  console.log("✅ Payments Seeded");
  console.log("✅ Investigation Cases Seeded");
}

main()
  .then(async () => {
    console.log("✅ Database seeded successfully!");
    await prisma.$disconnect();
  })
  .catch(async (error) => {
    console.error(error);
    await prisma.$disconnect();
    process.exit(1);
  });