import { getServerSession } from 'next-auth';
import { getToken } from 'next-auth/jwt';

//will need to create an idem for each transaction
//how to best secure the resource path?
//might need to make an api call and compare

async function handler(req, res) {
  const token = await getToken({ req });
  const session = await getServerSession(req, res);

  const { amount, currency, to, resourcePath } = req.body;
  const resourcePathStartingIndex = resourcePath.lastIndexOf(',');
  const resourcePathPrecise = resourcePath.slice(resourcePathStartingIndex + 1);
  console.log(amount, currency, to, resourcePathPrecise);

  if (session) {
    const url = `https://api.coinbase.com/v2/accounts/${resourcePathPrecise}/transactions`;
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token.accessToken}`,
        'CB-VERSION': '2023-02-11',
      },
      body: JSON.stringify({
        type: 'send',
        to: to,
        amount: amount,
        currency: currency,
      }),
    };
    const sendStatus = await fetch(url, options);
    const data = await sendStatus.json();
    console.log(data);
  }
}

export default handler;
