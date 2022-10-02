import type { NextApiRequest, NextApiResponse } from 'next'
import axios from 'axios'
import Korea from '../../service/korea'

const korea = new Korea()

type stock = {
  name: string,
  price: string,
  diff: string,
  diffPercent: string,
  volume: string,
}

type Data = {
  stocks: stock[]
}

export default function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  const get = async () => {
    return await axios({
      url: 'https://finance.naver.com/sise/sise_rise.naver?sosok=1',
      responseType: 'arraybuffer'
    });
  }

  get()
  .then((html) => {
    res.status(200).json({
      stocks: korea.getStockList(html)
    })
  });
}