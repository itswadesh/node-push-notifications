const express = require("express");
const webpush = require("web-push");
const bodyParser = require("body-parser");
const path = require("path");

const app = express();

// Set static path
app.use(express.static(path.join(__dirname, "client")));

app.use(bodyParser.json());

const publicVapidKey =
  "BJthRQ5myDgc7OSXzPCMftGw-n16F7zQBEN7EUD6XxcfTTvrLGWSIG7y_JxiWtVlCFua0S8MTB5rPziBqNx1qIo";
const privateVapidKey = "3KzvKasA2SoCxsp0iIG_o9B0Ozvl1XDwI63JRKNIWBM";

webpush.setVapidDetails(
  "mailto:test@test.com",
  publicVapidKey,
  privateVapidKey
);

const messages = [
  {
    title: "Chef at work!!",
    body: "Chef is preparing your order",
  },
  {
    title: "Food is Ready!!",
    body: "Your order is ready for self pickup",
  },
  {
    title: "Order Delivered",
    body: "The order has been delivered to you",
  },
  {
    title: "Delivery Guy Assigned",
    body: "On the way to pickup your order",
  },
  {
    title: "Vroom Vroom!!",
    body: "Order has been picked up and on the way",
  },
];
var Datastore = require("nedb"),
  db = new Datastore();
// Subscribe Route
app.get("/push", async (req, res) => {
  const subscriptons = await getSubscriptionsFromDatabase();
  for (subscription of subscriptons) {
    // console.log("xxxxxxxxxxxxxxxxx", subscription);
    const payload = JSON.stringify(messages[0]);
    await triggerPushMsg(subscription, payload);
  }
  return res.send(true);
});

// Subscribe Route
app.post("/subscribe", async (req, res) => {
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
const triggerPushMsg = function (subscription, dataToSend) {
  return webpush.sendNotification(subscription, dataToSend).catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log("Subscription has expired or is no longer valid: ", err);
      return deleteSubscriptionFromDatabase(subscription._id);
    } else {
      throw err;
    }
  });
};

function saveSubscriptionToDatabase(subscription) {
  // console.log("xxxxxxxxxxxxxxxxx", subscription);
  return new Promise(function (resolve, reject) {
    db.insert(subscription, function (err, newDoc) {
      if (err) {
        reject(err);
        return;
      }

      resolve(newDoc._id);
    });
  });
}
function getSubscriptionsFromDatabase() {
  return new Promise(function (resolve, reject) {
    db.find({}, function (err, subscriptions) {
      // console.log("get all subscriptions...........", err, subscriptions);
      if (err) {
        reject(err);
        return;
      }
      resolve(subscriptions);
    });
  });
}

const isValidSaveRequest = (req, res) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400);
    res.setHeader("Content-Type", "application/json");
    res.send(
      JSON.stringify({
        error: {
          id: "no-endpoint",
          message: "Subscription must have an endpoint.",
        },
      })
    );
    return false;
  }
  return true;
};
const port = 5000;

app.listen(port, () => console.log(`Server started on port ${port}`));
