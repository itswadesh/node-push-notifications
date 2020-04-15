const webpush = require('web-push')
import { NowRequest, NowResponse } from '@now/node'
import { publicVapidKey, privateVapidKey, yourEmail } from './config'

webpush.setVapidDetails(yourEmail, publicVapidKey, privateVapidKey)

export const triggerPushMsg = (subscription, dataToSend) => {
  return webpush.sendNotification(subscription, dataToSend).catch((err) => {
    if (err.statusCode === 404 || err.statusCode === 410) {
      console.log('Subscription has expired or is no longer valid: ', err)
      // return deleteSubscriptionFromDatabase(subscription._id);
    } else {
      throw err
    }
  })
}

export const isValidSaveRequest = (req: NowRequest, res: NowResponse) => {
  // Check the request body has at least an endpoint.
  if (!req.body || !req.body.endpoint) {
    // Not a valid subscription.
    res.status(400)
    res.setHeader('Content-Type', 'application/json')
    res.send(
      JSON.stringify({
        error: {
          id: 'no-endpoint',
          message: 'Subscription must have an endpoint.',
        },
      })
    )
    return false
  }
  return true
}
