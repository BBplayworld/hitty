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
  date: string | undefined,
  stocks: stock[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let stocks = await korea.getKospi()
  res.status(200).json({
    date: korea.getDate(),
    stocks
  })
}