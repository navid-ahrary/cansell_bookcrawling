const puppeteer = require('puppeteer-core')
const fs = require('fs')
const GetBookInfo = require('./components/get_book_info')

const config = {
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  dumpio: false,
  executablePath: '/usr/bin/brave-browser',
  headless: true
}

const GetInfo = async (urlList, pubName, index) => {
  const browser = await puppeteer.launch(config)
  const page = await browser.newPage()
  page.on('request', (req) => {
    const blockList = ['image', 'font', 'script', 'stylesheet']
    if (blockList.includes(req.resourceType())) {
      req.abort()
    } else {
      req.continue()
    }
  })

  await page.setRequestInterception(true)

  var urlListLength = urlList.length
  var allInfo = []
  for (var url of urlList) {
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 9999999 })

    const result = await page.evaluate(GetBookInfo)
    allInfo.push(result)
    console.log(`${--urlListLength} of ${urlList.length} remained `)
    fs.writeFile(`./info/${pubName}/${pubName}${index + 1}-${index + urlList.length}.json`, JSON.stringify(allInfo), function (err) {
      if (err) return err
    })
  }
  await browser.close()
}

module.exports = GetInfo
