import React, { useEffect, useState } from 'react'
import styles from './cryptoListItem.module.css'
import { useInView } from 'react-intersection-observer'
import { motion, useAnimation } from 'framer-motion'
const CryptoListItem = ({ data, loadData }) => {
  const { ticker, name, type, logo } = data
  const rateurl = `https://api.zabo.com/sandbox-v1/exchange-rates?tickers=${ticker}`
  const control = useAnimation()
  const [ref, inView] = useInView({ threshold: 0 })
  const [loading, setloading] = useState(false)
  const [showRate, setShowRate] = useState(false)
  const [rate, setrate] = useState('')
  async function getrate() {
    setloading(true)
    const res = await loadData(rateurl)
    setrate(res.data.rate)
    setShowRate(true)
    setloading(false)
  }
  const wrappervariant = {
    show: {
      y: 0,
      opacity: 1,
      transition: { duration: 0.2, ease: 'linear' },
    },
    hide: {
      opacity: 0,
      y: 30,
    },
  }

  useEffect(() => {
    if (inView) {
      control.start('show')
    } else {
      control.start('hide')
    }
  }, [control, inView])

  return (
    <motion.div
      ref={ref}
      variants={wrappervariant}
      animate={control}
      initial="hide"
      className={styles.list_item}
    >
      <div className={styles.list_item_data}>{ticker}</div>
      <div className={styles.list_item_data}>{name}</div>
      <div className={styles.list_item_data}>{type}</div>
      <div className={styles.list_item_data}>
        <img src={logo} alt={ticker + ' logo'} height="50" />
      </div>
      <div className={styles.list_item_data}>
        {loading ? (
          <div className={styles.loader}></div>
        ) : showRate ? (
          rate
        ) : (
          <button onClick={getrate} className={styles.getrate}>
            Check
          </button>
        )}
      </div>
    </motion.div>
  )
}

export default CryptoListItem
