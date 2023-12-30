import { AxiosResponse } from "axios"
import cheerio, { AnyNode, Cheerio, CheerioAPI } from 'cheerio'
import iconv from 'iconv-lite'
import moment from 'moment'
import axios from 'axios'

class Korea {
  standard = {
    eachCount: 500,
    diffPercent: 5,
    volume: 10000000
  }

  excludeDate = {
    '2023-09-28': '2023-09-27 (Wednesday)',
    '2023-09-29': '2023-09-27 (Wednesday)',
  }

  getDate() {
    const today = moment().format('YYYY-MM-DD')
    const excludeDate = Object.entries(this.excludeDate).find(([key, value]) => {
      return key === today
    })

    if (excludeDate) {
      return excludeDate[1]
    }

    let date = moment().format('YYYY-MM-DD (dddd)')
    if (moment().isoWeekday() === 6) {
      return moment().add(-1, 'days').format('YYYY-MM-DD (dddd)')
    }

    if (moment().isoWeekday() === 7) {
      return moment().add(-2, 'days').format('YYYY-MM-DD (dddd)')
    }

    return date
  }

  isFreeTime() {
    const hour = moment().hours()
    if (hour >= 16 || hour < 9) {
      return true
    }

    if (moment().isoWeekday() === 6 || moment().isoWeekday() === 7) {
      return true
    }

    const today = moment().format('YYYY-MM-DD')
    const excludeDate = Object.entries(this.excludeDate).find(([key, value]) => {
      return key === today
    })

    if (excludeDate) {
      return true
    }

    return false
  }

  async getStock(url: string) {
    return await axios({
      url,
      responseType: 'arraybuffer'
    });
  }

  getKospi() {
    let stock = this.getStock('https://finance.naver.com/sise/sise_rise.naver')
    return stock.then((html) => {
      return this.getStockList(html)
    })
  }

  getKosdaq() {
    let stock = this.getStock('https://finance.naver.com/sise/sise_rise.naver?sosok=1')
    return stock.then((html) => {
      return this.getStockList(html)
    })
  }

  getStockList(html: AxiosResponse<any, any>) {
    html.data = iconv.decode(html.data, 'euc-kr').toString()

    let $ = cheerio.load(html.data)
    let table = $('#contentarea .box_type_l table tbody tr')

    return this.getStockParseList($, table)
  }

  getStockParseList($: CheerioAPI, table: Cheerio<AnyNode>) {
    let list = []

    for (let i = 2; i < this.standard.eachCount; i++) {
      let name = $(table[i]).find('td:eq(1)')
      let price = $(table[i]).find('td:eq(2)').text()
      let diff = $(table[i]).find('td:eq(3)').text().trim()
      let diffPercent = parseFloat($(table[i]).find('td:eq(4)').text().replaceAll(/[+%]/g, ''))
      let diffPercentText = $(table[i]).find('td:eq(4)').text().trim()
      let volume = Number($(table[i]).find('td:eq(5)').text().replaceAll(',', '')) | 0
      let volumeText = $(table[i]).find('td:eq(5)').text()

      if (name.length > 0 && diffPercent > this.standard.diffPercent && volume > this.standard.volume) {
        let stock = {
          name: name.text(),
          price,
          diff,
          diffPercent: diffPercentText,
          volume: volumeText
        }
        list.push(stock)
      }
    }

    return list
  }
}

export default Korea