const CryptoJS = require('crypto-js')
const axios = require('axios')
const { apiKey, secretKey } = require('../../config')
export default async (req, res) => {
  const date = Date.now().toString()
  const url = req.body.url
  const signature = CryptoJS.HmacSHA256(date + url, secretKey).toString()
  const response = await axios.get(url, {
    headers: {
      'X-Zabo-Key': apiKey,
      'X-Zabo-Sig': signature,
      'X-Zabo-Timestamp': date,
    },
  })
  res.send({ ...response.data })
}
