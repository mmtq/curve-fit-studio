'use server'

import csv from 'csv-parser'
import { Readable } from 'stream'

export async function uploadCsv(formData: FormData): Promise<[number, number][]> {
  const file = formData.get('file') as File

  if (!file) return []

  const buffer = Buffer.from(await file.arrayBuffer())
  const stream = Readable.from(buffer)

  const result: [number, number][] = []

  return new Promise((resolve) => {
    stream
      .pipe(csv())
      .on('data', (row) => {
        const x = Number(row.x)
        const y = Number(row.y)
        if (!isNaN(x) && !isNaN(y)) {
          result.push([x, y])
        }
      })
      .on('end', () => {
        resolve(result)
      })
  })
}
