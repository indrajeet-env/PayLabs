import paymentGraph from "../graph/payment.graph.js";

export async function investigatePayment(req, res) {
  try {
    const paymentReference = req.body.paymentReference || req.params.reference;
    if (!paymentReference) {
      return res.status(400).json({
        error: "paymentReference is required.",
      });
    }

    const result = await paymentGraph.invoke({
      paymentReference,
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