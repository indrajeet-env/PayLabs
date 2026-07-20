export async function decisionNode(state) {
  const balanceEvidence = state.evidences.find((e) => e.type === "BALANCE_CHECK");

  const networkEvidence = state.evidences.find((e) => e.type === "NETWORK_CHECK");

  const sufficientFunds = balanceEvidence?.data?.sufficientFunds ?? false;

  const networkHealthy = networkEvidence?.data?.networkStatus === "HEALTHY";

  if (!sufficientFunds) {
    return {
      decision: "ESCALATE_TO_BANK",
    };
  }

  if (!networkHealthy) {
    return {
      decision: "RETRY_PAYMENT",
    };
  }

  return {
    decision: "FURTHER_INVESTIGATION_REQUIRED",
  };
}