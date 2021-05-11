import Head from 'next/head'
import styles from '../styles/Home.module.css'
import axios from 'axios'
import { useEffect, useState } from 'react'
import CryptoListItem from '../components/CryptoListItem'

export default function Home() {
  let zabobaseurl = 'https://api.zabo.com/sandbox-v1'

  const [loading, setLoading] = useState(false)
  const [loadingMore, setLoadingMore] = useState(false)
  const [currencies, setcurrencies] = useState([])
  const [nextCursorUrl, setNextCursor] = useState(null)
  const headers = ['ticker', 'name', 'type ', 'logo', 'exchange rate']

  async function loadData(url) {
    const response = await axios.post('/api/getsignature', {
      url,
    })

    return response
  }
  function loadmore() {
    setLoadingMore(true)

    let current = currencies
    loadData(zabobaseurl + nextCursorUrl)
      .then((res) => {
        const newdata = current.concat(res.data.data)
        setcurrencies(newdata)

        if (res.data.list_cursor.has_more) {
          setNextCursor(res.data.list_cursor.next_uri)
        } else {
          setNextCursor(null)
        }
        setLoadingMore(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }

  useEffect(() => {
    setLoading(true)
    const getcurrencyurl = zabobaseurl + '/currencies?limit=25'

    loadData(getcurrencyurl)
      .then((res) => {
        setcurrencies(res.data.data)

        if (res.data.list_cursor.has_more) {
          setNextCursor(res.data.list_cursor.next_uri)
        } else {
          setNextCursor(null)
        }
        setLoading(false)
      })
      .catch((err) => {
        console.log(err)
      })
  }, [])

  return (
    <div className={styles.container}>
      <Head>
        <title>CryptoCurrency Listing App</title>
        <meta
          name="description"
          content="This is a cryptocurrency listing app which shows exchange rates of different cryptocurrencies"
        />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      {loading ? (
        <div className={styles.loader_wrapper}>
          <div className={styles.loader}></div>
        </div>
      ) : (
        <div className={styles.table}>
          <div className={styles.table_header}>
            {headers.map((header) => (
              <div className={styles.table_header_title} key={header}>
                {header}
              </div>
            ))}
          </div>
          <div className={styles.table_list_wrapper}>
            {currencies.map((currency, index) => (
              <CryptoListItem
                data={currency}
                loadData={loadData}
                key={index + currency.ticker}
              />
            ))}

            {nextCursorUrl ? (
              <div className={styles.load_more_wrapper}>
                {loadingMore ? (
                  <div className={styles.loading_more}> </div>
                ) : (
                  <button className={styles.load_more} onClick={loadmore}>
                    {' '}
                    Load More
                  </button>
                )}
              </div>
            ) : null}
          </div>
        </div>
      )}
    </div>
  )
}
