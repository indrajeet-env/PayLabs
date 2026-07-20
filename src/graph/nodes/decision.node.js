export async function decisionNode(state) {
  const balanceEvidence = (state.evidences && state.evidences.find((e) => e.type === "BALANCE_CHECK")) || (state.evidences && state.evidences[0]); // either finds the evidence with type "BALANCE_CHECK" or takes the first evidence

  const sufficientFunds = Boolean(balanceEvidence?.data?.sufficientFunds); // answers whether the sufficient funds are available or not

  return {
    decision: sufficientFunds // if sufficient funds are available, then retry the payment, else escalate to the bank
      ? "RETRY_PAYMENT"
      : "ESCALATE_TO_BANK",
  };
}