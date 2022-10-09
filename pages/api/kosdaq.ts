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

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let stocks = await korea.getKosdaq()
  res.status(200).json({
    stocks
  })
}