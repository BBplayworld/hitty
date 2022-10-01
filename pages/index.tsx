import type { NextPage } from 'next'
import Head from 'next/head'
import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import moment from 'moment'

type stock = {
  name: string,
  price: string,
  diff: string,
  diffPercent: string,
  volume: string,
}

let options = {
  refreshInterval: 10000,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false  
}

const fetcher = (url: any) => fetch(url).then(r => r.json())

const Home: NextPage = () => {
  const {data: kospi, error} = useSWR<{
    date: string,
    stocks: stock[]
  }>('/api/kospi', fetcher, options)

  const {data: kosdaq} = useSWR<{
    date: string,
    stocks: stock[]
  }>('/api/kosdaq', fetcher, options)

  if (moment().day() === 6 || moment().day() === 7) {
    options.refreshInterval = 0
  }

  if (error) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
        <div className={styles.grid}>
          <h2>Please refresh.</h2>
        </div>
        </main>
      </div>
    )
  }

  if (!kospi) {
    return (
      <div className={styles.container}>
        <main className={styles.main}>
        <div className={styles.grid}> 
          <h2>Loading...</h2>
        </div>
        </main>
      </div>
    )
  }

  return (
    <div className={styles.container}>
      <Head>
        <title>Hitty</title>
        <meta name="keywords" content="주식, 국내주식, 해외주식, kospi, kosdaq, 코스피, 코스닥, 상한가, stock" />
        <meta name="description" content="주식, 국내주식, 해외주식, kospi, kosdaq, 코스피, 코스닥, 상한가, stock" />
        <meta name="og:description" content="주식, 국내주식, 해외주식, kospi, kosdaq, 코스피, 코스닥, 상한가, stock" />
        <meta name="og:site_name" content="Hitty" />
        <link rel="icon" href="/favicon.ico" />
      </Head>

      <main className={styles.main}>
        <div className={styles.grid}> 
          <h2>KOSPI <span className={styles.date}>{kospi?.date}</span></h2>
          <h5>the hot item</h5>
        </div>        
        <div className={styles.grid}>
          {kospi?.stocks.map((stock: stock, index: number) => (
            <div key={index} className={styles.card}>
              <p>
                <b className={styles.textTitle}>{stock?.name}</b> 
                &nbsp;&nbsp;￦<b>{stock?.price}</b>
                &nbsp;&nbsp;<b className={styles.textRed}>▲{stock?.diff}</b>
                &nbsp;&nbsp;<b className={styles.textRed}>{stock?.diffPercent}</b>
                &nbsp;&nbsp;{stock?.volume} volumes
              </p>
            </div>
          ))} 
        </div>

        <br /><br />
        <div className={styles.grid}> 
          <h2>KOSDAQ <span className={styles.date}>{kosdaq?.date}</span></h2>
          <h5>the hot item</h5>
        </div>
        <div className={styles.grid}>
          {kosdaq?.stocks.map((stock: stock, index: number) => (
            <div key={index} className={styles.card}>
              <p>
                <b className={styles.textTitle}>{stock?.name}</b> 
                &nbsp;&nbsp;￦<b>{stock?.price}</b>
                &nbsp;&nbsp;<b className={styles.textRed}>▲{stock?.diff}</b>
                &nbsp;&nbsp;<b className={styles.textRed}>{stock?.diffPercent}</b>
                &nbsp;&nbsp;{stock?.volume} volumes
              </p>
            </div>
          ))} 
        </div>        
      </main>

      <footer className={styles.footer}>
          <span className={styles.logo}>ⓒ Hitty</span>
      </footer>
    </div>
  )
}

export default Home
