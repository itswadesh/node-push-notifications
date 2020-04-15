var Datastore = require('nedb'),
  db = new Datastore()

export const getSubscriptionsFromDatabase = () => {
  return new Promise(function (resolve, reject) {
    db.find({}, function (err, subscriptions) {
      console.log('get all subscriptions...........', err, subscriptions)
      if (err) {
        reject(err)
        return
      }
      resolve(subscriptions)
    })
  })
}

export const saveSubscriptionToDatabase = (subscription) => {
  // console.log("xxxxxxxxxxxxxxxxx", subscription);
  return new Promise(function (resolve, reject) {
    db.insert(subscription, function (err, newDoc) {
      if (err) {
        reject(err)
        return
      }

      resolve(newDoc._id)
    })
  })
}
