import { PrismaClient, Prisma } from "@prisma/client";
import crypto from "crypto";

const prisma = new PrismaClient();

async function main() {
  console.log("🌱 Seeding database with raw operational facts...");

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
    {
      fullName: "Vikram Rao",
      email: "vikram@paylabs.ai",
      phone: "9876543215",
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
      dailyTransferLimit: 500000,
      minimumReserve: 1000,
      status: "ACTIVE",
    },
    {
      customer: "Rahul Sharma",
      accountNumber: "110000002",
      balance: 800,
      dailyTransferLimit: 100000,
      minimumReserve: 500,
      status: "ACTIVE",
    },
    {
      customer: "Ankit Verma",
      accountNumber: "110000003",
      balance: 150000,
      dailyTransferLimit: 500000,
      minimumReserve: 1000,
      status: "ACTIVE",
    },
    {
      customer: "Mahender Singh",
      accountNumber: "110000004",
      balance: 1250000,
      dailyTransferLimit: 2000000,
      minimumReserve: 5000,
      status: "ACTIVE",
    },
    {
      customer: "Deep Patel",
      accountNumber: "110000005",
      balance: 75000,
      dailyTransferLimit: 200000,
      minimumReserve: 1000,
      status: "ACTIVE",
    },
    {
      customer: "Vikram Rao",
      accountNumber: "110000006",
      balance: 100000,
      dailyTransferLimit: 500000,
      minimumReserve: 1000,
      status: "CLOSED",
    },
  ];

  const accountMap = {};

  for (const account of accounts) {
    const createdAccount = await prisma.account.create({
      data: {
        customerId: customerMap[account.customer].id,
        accountNumber: account.accountNumber,
        balance: new Prisma.Decimal(account.balance),
        dailyTransferLimit: new Prisma.Decimal(account.dailyTransferLimit),
        minimumReserve: new Prisma.Decimal(account.minimumReserve),
        currency: "INR",
        status: account.status,
      },
    });

    accountMap[account.customer] = createdAccount;
  }

  console.log("✅ Accounts Seeded");

  // -------------------------
  // Payments (15 Scenarios with Raw Operational Metrics)
  // -------------------------

  const payments = [
    // Scenario 1: Healthy Payment
    {
      referenceNumber: "PAY0001",
      sender: "Jeet Singh",
      receiverName: "Rahul Sharma",
      receiverAccountNumber: "210000001",
      receiverIFSC: "HDFC0001234",
      receiverBankName: "HDFC Bank",
      amount: 5000,
      rail: "UPI",
      status: "SUCCESS",
      requiresInvestigation: false,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 120,
      retryCount: 0,
      gatewayLogs: "200 OK: Payment processed and acknowledged successfully.",
      switchLogs: "Switch routed transaction cleanly.",
      amlRiskScore: 5,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 2: Network Gateway Timeout
    {
      referenceNumber: "PAY0002",
      sender: "Jeet Singh",
      receiverName: "Rahul Sharma",
      receiverAccountNumber: "210000001",
      receiverIFSC: "HDFC0001234",
      receiverBankName: "HDFC Bank",
      amount: 5000,
      rail: "UPI",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "504",
      bankResponseCode: null,
      ackReceived: false,
      networkLatency: 18500,
      retryCount: 3,
      gatewayLogs: "504 Gateway Timeout: Upstream NPCI switch connection timed out after 15000ms.",
      switchLogs: "Switch timeout: ACK not received from clearing house pool.",
      amlRiskScore: 8,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 3: Insufficient Funds / Liquidity Shortage
    {
      referenceNumber: "PAY0003",
      sender: "Rahul Sharma",
      receiverName: "Ankit Verma",
      receiverAccountNumber: "210000002",
      receiverIFSC: "SBIN0004521",
      receiverBankName: "State Bank of India",
      amount: 5000,
      rail: "IMPS",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 140,
      retryCount: 0,
      gatewayLogs: "200 OK: Core ledger balance verification performed.",
      switchLogs: "Ledger check: Insufficient balance for requested transfer.",
      amlRiskScore: 10,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 4: Payment Switch Failure
    {
      referenceNumber: "PAY0004",
      sender: "Mahender Singh",
      receiverName: "ABC Imports Pvt Ltd",
      receiverAccountNumber: "210000003",
      receiverIFSC: "ICIC0008976",
      receiverBankName: "ICICI Bank",
      amount: 350000,
      rail: "RTGS",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "502",
      bankResponseCode: "500",
      ackReceived: false,
      networkLatency: 2600,
      retryCount: 2,
      gatewayLogs: "502 Bad Gateway: Interbank RTGS switch rejected connection pool.",
      switchLogs: "CRITICAL: RTGS Switch connection pool exhausted.",
      amlRiskScore: 15,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 5: High AML Risk Score & Suspicious Velocity
    {
      referenceNumber: "PAY0005",
      sender: "Mahender Singh",
      receiverName: "Global Tech Ltd",
      receiverAccountNumber: "210000004",
      receiverIFSC: "HSBC0009876",
      receiverBankName: "HSBC",
      amount: 1500000,
      rail: "SWIFT",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 210,
      retryCount: 0,
      gatewayLogs: "200 OK: Sent to compliance engine.",
      switchLogs: "Compliance hold applied.",
      amlRiskScore: 92,
      amlRiskReasons: ["UNUSUALLY_LARGE_OFFSHORE_TRANSFER", "RAPID_FUNDS_MOVEMENT"],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
      riskEngineResponse: { flag: "HIGH_AML_RISK", ruleId: "AML-902", recommendation: "HOLD_FOR_MANUAL_AML_AUDIT" },
    },
    // Scenario 6: Sanctions SDN Match
    {
      referenceNumber: "PAY0006",
      sender: "Ankit Verma",
      receiverName: "Global Trade LLC",
      receiverAccountNumber: "210000009",
      receiverIFSC: "CITI0000001",
      receiverBankName: "Citibank",
      amount: 50000,
      rail: "SWIFT",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 175,
      retryCount: 0,
      gatewayLogs: "200 OK: Compliance sanctions screening triggered.",
      switchLogs: "Sanctions engine match.",
      amlRiskScore: 45,
      amlRiskReasons: ["OFFSHORE_BENEFICIARY"],
      kycStatus: "VERIFIED",
      sanctionsMatches: 1,
      matchedEntity: "Global Trade LLC",
      matchedList: "OFAC_SDN_LIST",
      riskEngineResponse: { matchConfidence: 0.98, listName: "OFAC_SDN" },
    },
    // Scenario 7: KYC Expired
    {
      referenceNumber: "PAY0007",
      sender: "Deep Patel",
      receiverName: "Sneha Nair",
      receiverAccountNumber: "210000005",
      receiverIFSC: "HDFC0007654",
      receiverBankName: "HDFC Bank",
      amount: 10000,
      rail: "UPI",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 130,
      retryCount: 0,
      gatewayLogs: "200 OK: Account validation completed.",
      switchLogs: "Customer compliance check returned EXPIRED.",
      amlRiskScore: 20,
      amlRiskReasons: [],
      kycStatus: "EXPIRED",
      sanctionsMatches: 0,
      riskEngineResponse: { flag: "KYC_EXPIRED", kycLastUpdated: "2024-01-10" },
    },
    // Scenario 8: Multi-Factor Failure (Low Balance + Network Timeout)
    {
      referenceNumber: "PAY0008",
      sender: "Rahul Sharma",
      receiverName: "Rahul Sharma",
      receiverAccountNumber: "210000001",
      receiverIFSC: "HDFC0001234",
      receiverBankName: "HDFC Bank",
      amount: 10000,
      rail: "UPI",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "504",
      bankResponseCode: null,
      ackReceived: false,
      networkLatency: 16500,
      retryCount: 3,
      gatewayLogs: "504 Timeout: Upstream switch unresponsive.",
      switchLogs: "No response from clearing house pool.",
      amlRiskScore: 12,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 9: Multi-Factor Failure (Low Balance + High AML Risk)
    {
      referenceNumber: "PAY0009",
      sender: "Rahul Sharma",
      receiverName: "XYZ Imports Pvt Ltd",
      receiverAccountNumber: "210000007",
      receiverIFSC: "UTIB0004444",
      receiverBankName: "Axis Bank",
      amount: 25000,
      rail: "RTGS",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 150,
      retryCount: 0,
      gatewayLogs: "200 OK: Compliance check processed.",
      switchLogs: "High risk score flagged.",
      amlRiskScore: 84,
      amlRiskReasons: ["EXCEEDS_PROFILE_LIMIT", "SUSPICIOUS_HIGH_AMOUNT"],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 10: ACK Timeout
    {
      referenceNumber: "PAY0010",
      sender: "Jeet Singh",
      receiverName: "Deep Patel",
      receiverAccountNumber: "210000008",
      receiverIFSC: "YESB0001000",
      receiverBankName: "Yes Bank",
      amount: 12000,
      rail: "IMPS",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: false,
      networkLatency: 9200,
      retryCount: 2,
      gatewayLogs: "200 Sent: Waiting for async ACK from IMPS clearing house.",
      switchLogs: "WARN: ACK timer expired (9000ms).",
      amlRiskScore: 5,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 11: Multi-Factor Failure (Low Balance + Sanctions Match)
    {
      referenceNumber: "PAY0011",
      sender: "Rahul Sharma",
      receiverName: "Global Trade LLC",
      receiverAccountNumber: "210000009",
      receiverIFSC: "CITI0000001",
      receiverBankName: "Citibank",
      amount: 50000,
      rail: "SWIFT",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 110,
      retryCount: 0,
      gatewayLogs: "200 OK: Sanctions match detected.",
      switchLogs: "Transaction blocked by compliance.",
      amlRiskScore: 50,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 1,
      matchedEntity: "Global Trade LLC",
      matchedList: "EU_SANCTIONS_LIST",
    },
    // Scenario 12: Closed Account Restriction
    {
      referenceNumber: "PAY0012",
      sender: "Vikram Rao",
      receiverName: "Vijay Kumar",
      receiverAccountNumber: "210000010",
      receiverIFSC: "BARB0WELLES",
      receiverBankName: "Bank of Baroda",
      amount: 5000,
      rail: "NEFT",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 135,
      retryCount: 0,
      gatewayLogs: "200 OK: Account status lookup.",
      switchLogs: "Account status: CLOSED.",
      amlRiskScore: 10,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 13: Healthy IMPS Transfer
    {
      referenceNumber: "PAY0013",
      sender: "Deep Patel",
      receiverName: "Priya Sharma",
      receiverAccountNumber: "210000011",
      receiverIFSC: "ICIC0001234",
      receiverBankName: "ICICI Bank",
      amount: 2500,
      rail: "IMPS",
      status: "SUCCESS",
      requiresInvestigation: false,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 90,
      retryCount: 0,
      gatewayLogs: "200 OK: Transaction completed.",
      switchLogs: "IMPS switch success.",
      amlRiskScore: 4,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 14: Complex Multi-Factor (Switch Failure + High AML Risk + High Amount)
    {
      referenceNumber: "PAY0014",
      sender: "Mahender Singh",
      receiverName: "Karan Johar",
      receiverAccountNumber: "210000012",
      receiverIFSC: "HDFC0009999",
      receiverBankName: "HDFC Bank",
      amount: 500000,
      rail: "RTGS",
      status: "FAILED",
      requiresInvestigation: true,
      gatewayResponseCode: "502",
      bankResponseCode: "500",
      ackReceived: false,
      networkLatency: 3400,
      retryCount: 2,
      gatewayLogs: "502 Bad Gateway: Core switch unavailable.",
      switchLogs: "Switch exception: Pool buffer overflow.",
      amlRiskScore: 78,
      amlRiskReasons: ["HIGH_VALUE_INSTANT_TRANSFER"],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
    },
    // Scenario 15: Healthy UPI Transfer
    {
      referenceNumber: "PAY0015",
      sender: "Ankit Verma",
      receiverName: "Rajesh Koothrapali",
      receiverAccountNumber: "210000013",
      receiverIFSC: "SBIN0000111",
      receiverBankName: "State Bank of India",
      amount: 1000,
      rail: "UPI",
      status: "SUCCESS",
      requiresInvestigation: false,
      gatewayResponseCode: "200",
      bankResponseCode: "200",
      ackReceived: true,
      networkLatency: 75,
      retryCount: 0,
      gatewayLogs: "200 OK: UPI transfer successful.",
      switchLogs: "NPCI switch success.",
      amlRiskScore: 2,
      amlRiskReasons: [],
      kycStatus: "VERIFIED",
      sanctionsMatches: 0,
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
        requiresInvestigation: payment.requiresInvestigation,
        referenceNumber: payment.referenceNumber,
        idempotencyKey: crypto.randomUUID(),
        gatewayResponseCode: payment.gatewayResponseCode,
        bankResponseCode: payment.bankResponseCode,
        ackReceived: payment.ackReceived,
        networkLatency: payment.networkLatency,
        retryCount: payment.retryCount,
        gatewayLogs: payment.gatewayLogs,
        switchLogs: payment.switchLogs,
        amlRiskScore: payment.amlRiskScore,
        amlRiskReasons: payment.amlRiskReasons,
        kycStatus: payment.kycStatus,
        sanctionsMatches: payment.sanctionsMatches,
        matchedEntity: payment.matchedEntity,
        matchedList: payment.matchedList,
        riskEngineResponse: payment.riskEngineResponse,
      },
    });

    if (payment.requiresInvestigation) {
      await prisma.investigationCase.create({
        data: {
          paymentId: createdPayment.id,
          priority: "HIGH",
          status: "OPEN",
        },
      });
    }
  }

  console.log("✅ Payments Seeded with Operational Evidence Facts");
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