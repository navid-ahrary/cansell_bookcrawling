const puppeteer = require('puppeteer-core')
const getProductInfo = require('./components/Get_Product_Info')

const config = {
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox',
    '--use-gl'
  ],
  dumpio: false,
  executablePath: '/usr/bin/vivaldi',
  headless: false
}

const cookies = [
  {
    name: 'aep_usuc_f',
    value: 'site=glo&c_tp=USD&region=FI&b_locale=en_US',
    domain: '.aliexpress.com',
    path: '/',
    expires: 3711469686.154839,
    size: 52,
    httpOnly: false,
    secure: true,
    session: false
  },
  {
    name: 'intl_locale',
    value: 'en_US',
    domain: '.aliexpress.com',
    path: '/',
    expires: -1,
    size: 16,
    httpOnly: false,
    secure: false,
    session: true
  }
]

const urls = [
  'https://www.aliexpress.com/item/32890332803.html',
  'https://www.aliexpress.com/item/32955090417.html',
  'https://www.aliexpress.com/item/32848575666.html',
  'https://www.aliexpress.com/item/32830075512.html',
  'https://www.aliexpress.com/item/32890332845.html',
  'https://www.aliexpress.com/item/32953983845.html',
  'https://www.aliexpress.com/item/33046447926.html',
  'https://www.aliexpress.com/item/32972848611.html'
]

const app = async (url = urls[6], callback = (str) => { console.log(str) }) => {
  const browser = await puppeteer.launch(config)
  try {
    const page = await browser.newPage()

    page.on('request', (req) => {
      if (req.resourceType() === 'image' || req.resourceType() === 'font') {
        req.abort()
      } else {
        req.continue()
      }
    })

    // await page.setViewport({ width: 1600, height: 900 })
    await page.setRequestInterception(true)
    await page.setCookie(...cookies)
    await page.goto(url, { waitUntil: 'domcontentloaded' })

    const productInfo = await page.evaluate(getProductInfo)
    callback(productInfo)
    await browser.close()
  } catch (err) {
    callback(err)
  } finally {
    await browser.close()
  }
}

app()

module.exports = app
