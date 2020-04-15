import { NowRequest, NowResponse } from '@now/node'
import { getSubscriptionsFromDatabase, triggerPushMsg } from '../lib'
// Subscribe Route
export default async (req: NowRequest, res: NowResponse) => {
  const subscriptons = await getSubscriptionsFromDatabase()
  for (let subscription of subscriptons) {
    // console.log("xxxxxxxxxxxxxxxxx", subscription);
    const payload = JSON.stringify(messages[0])
    await triggerPushMsg(subscription, payload)
  }
  return res.send(true)
}
