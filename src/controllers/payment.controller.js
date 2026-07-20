import paymentGraph from "../graph/payment.graph.js";

export async function investigatePayment(req, res) {
  try {
    const result = await paymentGraph.invoke({
      paymentReference: req.params.reference,
      evidences: [],
    });

    res.status(200).json(result);
  } catch (err) {
    console.error(err);

    res.status(500).json({
      error: err.message,
    });
  }
}