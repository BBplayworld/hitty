import { AxiosResponse } from "axios"
import cheerio, { AnyNode, Cheerio, CheerioAPI } from 'cheerio'
import iconv from 'iconv-lite'
import moment from 'moment'
import axios from 'axios'

class Korea {
  standard = {
      eachCount: 500,
      diffPercent: 5,
      volume: 5000000
  }

  getDate () {
      let date = moment().format('YYYY-MM-DD (dddd)')
      if (moment().isoWeekday() === 6) {
        return moment().add(-1, 'days').format('YYYY-MM-DD (dddd)')
      }
  
      if (moment().isoWeekday() === 7) {
        return moment().add(-2, 'days').format('YYYY-MM-DD (dddd)')
      }

      return date
  }

  async getStock (url: string) {
    return await axios({
      url,
      responseType: 'arraybuffer'
    });
  }

  getKospi () {
    let stock = this.getStock('https://finance.naver.com/sise/sise_rise.naver')
    return stock.then((html) => {
      return this.getStockList(html)
    })
  }

  getKosdaq () {
    let stock = this.getStock('https://finance.naver.com/sise/sise_rise.naver?sosok=1')
    return stock.then((html) => {
      return this.getStockList(html)
    })
  }

  getUpper () {
    let stock = this.getStock('https://finance.naver.com/sise/sise_upper.naver')
    return stock.then((html) => {
      return this.getUpperList(html)
    })
  }

  getStockList (html: AxiosResponse<any, any>) {
      html.data = iconv.decode(html.data, 'euc-kr').toString()

      let $ = cheerio.load(html.data)
      let table = $('#contentarea .box_type_l table tbody tr')    

      return this.getStockParseList($, table)
  }

  getUpperList (html: AxiosResponse<any, any>) {
    html.data = iconv.decode(html.data, 'euc-kr').toString()

    let $ = cheerio.load(html.data)
    let kospiTable = $('#contentarea .box_type_l:eq(0) table tbody tr')   
    let kosdaqTable = $('#contentarea .box_type_l:eq(1) table tbody tr')

    return {
      kospi: this.getUpperParseList($, kospiTable),
      kosdaq: this.getUpperParseList($, kosdaqTable)
    }
  }

  getStockParseList ($: CheerioAPI, table: Cheerio<AnyNode>) {
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

  getUpperParseList ($: CheerioAPI, table: Cheerio<AnyNode>) {
    let list = []

    for (let i = 2; i < this.standard.eachCount; i++) {
      let name = $(table[i]).find('td:eq(3)')
      let price = $(table[i]).find('td:eq(4)').text()
      let diff = $(table[i]).find('td:eq(5)').text().trim()
      let diffPercent = parseFloat($(table[i]).find('td:eq(6)').text().replaceAll(/[+%]/g, ''))
      let diffPercentText = $(table[i]).find('td:eq(6)').text().trim()
      let volume = Number($(table[i]).find('td:eq(7)').text().replaceAll(',', '')) | 0
      let volumeText = $(table[i]).find('td:eq(7)').text()

      if (name.length > 0 && diffPercent > this.standard.diffPercent && volume > this.standard.volume) {
        let stock = {
          name: name.text(),
          price,
          diff,
          diffPercentNum: diffPercent,
          diffPercent: diffPercentText,
          volume: volumeText
        }
        list.push(stock)
      }
    }

    list.sort((a, b) => {
      return a.diffPercentNum > b.diffPercentNum ? 1 : 0
    })

    return list
  }  
}

export default Korea