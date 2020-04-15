import { NowRequest, NowResponse } from "@now/node";
import { isValidSaveRequest,saveSubscriptionToDatabase } from "../lib";

export default (req: NowRequest, res: NowResponse) => {
  isValidSaveRequest(req, res);
  try {
    const subscriptionId = await saveSubscriptionToDatabase(req.body);
    res.setHeader("Content-Type", "application/json");
    res.send(JSON.stringify({ data: { success: true } }));
  } catch (err) {
    res.status(500);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "unable-to-save-subscription",
          message:
            "The subscription was received but we were unable to save it to our database.",
        },
      })
    );
  }
});
