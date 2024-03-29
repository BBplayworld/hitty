import styles from '../styles/Home.module.css'
import useSWR from 'swr'
import Korea from '../service/korea'

type props = {
  date: string,
  kospi: stock[],
  kosdaq: stock[]
}

type stock = {
  name: string,
  price: string,
  diff: string,
  diffPercent: string,
  volume: string,
}

let options = {
  refreshInterval: 15000,
  revalidateIfStale: false,
  revalidateOnFocus: false,
  revalidateOnReconnect: false
}

const korea = new Korea()
const fetcher = (url: any) => fetch(url).then(r => r.json())

const Home = (props: props) => {
  if (korea.isFreeTime()) {
    options.refreshInterval = 0
  }

  let { data: kospi, error } = useSWR<{
    date: string,
    stocks: stock[]
  }>('/api/kospi', fetcher, {
    ...options
  })

  const { data: kosdaq } = useSWR<{
    stocks: stock[]
  }>('/api/kosdaq', fetcher, {
    ...options
  })

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
      <main className={styles.main}>
        <div className={styles.grid}>
          <h2>KOSPI <span className={styles.date}>{kospi?.date}</span></h2>
          <h5>More than <span className={styles.textRed}>{korea.standard.diffPercent}</span>%, more than <span className={styles.textRed}>{korea.standard.volume.toLocaleString()}</span> volumes</h5>
        </div>
        <br />
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
          <h2>KOSDAQ <span className={styles.date}>{kospi?.date}</span></h2>
          <h5>More than <span className={styles.textRed}>{korea.standard.diffPercent}</span>%, more than <span className={styles.textRed}>{korea.standard.volume.toLocaleString()}</span> volumes</h5>
        </div>
        <br />
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
        <span className={styles.copy}><b>ⓒ Hitty</b></span>
      </footer>
    </div>
  )
}

export default Home
