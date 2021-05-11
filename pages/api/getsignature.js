const CryptoJS = require('crypto-js')
const axios = require('axios')
export default async (req, res) => {
  const date = Date.now().toString()
  const url = req.body.url
  const signature = CryptoJS.HmacSHA256(
    date + url,
    'cd3ab256f7a30da8a60edaf61d6fc20ec14186f0f164a4f636db407d7910ad89'
  ).toString()
  const response = await axios.get(url, {
    headers: {
      'X-Zabo-Key': 'a6b90a959ae8c1e1d03f56d948349c2271854dc4',
      'X-Zabo-Sig': signature,
      'X-Zabo-Timestamp': date,
    },
  })
  res.send({ ...response.data })
}
