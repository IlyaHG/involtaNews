
import { defineEventHandler } from 'h3'
import { parseStringPromise } from 'xml2js'
import fetch from 'node-fetch'

export default defineEventHandler(async () => {
  const rssUrl = 'https://lenta.ru/rss'

  const res = await fetch(rssUrl)
  const xml = await res.text()

  const json = await parseStringPromise(xml, {
    explicitArray: false,
    mergeAttrs: true,
  })

  const items = json.rss.channel.item


  return items
})
