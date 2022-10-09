import type { NextApiRequest, NextApiResponse } from 'next'
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
  kospi: stock[],
  kosdaq: stock[],
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<Data>
) {
  let { kospi, kosdaq } = await korea.getUpper()
  res.status(200).json({
    kospi,
    kosdaq
  })
}