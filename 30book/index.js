const puppeteer = require('puppeteer-core')
const fs = require('fs')

const getBookInfo = require('./components/get_book_info')

const config = {
  ignoreHTTPSErrors: true,
  args: [
    '--no-sandbox',
    '--disable-setuid-sandbox'
  ],
  dumpio: false,
  executablePath: '/usr/bin/vivaldi',
  headless: false
}

const app = async (startIndex) => {
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
  // await page.setViewport({ width: 1600, height: 900 })

  const allBooksDetails = []
  let remainedIndex = 1999

  for (let i = startIndex; i <= startIndex + 1999; i++) {
    const url = `https://30book.com/Book/${i}`
    try {
      var response = await page.goto(url, { waitUntil: 'domcontentloaded' })

      if (response.headers().status === '200') {
        const bookInfo = await page.evaluate(getBookInfo)
        bookInfo['url'] = url

        allBooksDetails.push(bookInfo)

        console.log(`${i} done, ${remainedIndex} remained`)

        fs.writeFile(`/home/navid/desktop/booksInfo${startIndex}-${startIndex + 1999}.json`, JSON.stringify(allBooksDetails), function (err) {
          if (err) return err
        })
      }
      remainedIndex--
    } catch (err) {
      --i
    }
  }

  await browser.close()
}

// 89533
Promise.all([
  app(1)
  // app(2001),+
  // app(4001),+
  // app(6001),+
  // app(8001),+
  // app(10001),+
  // app(12001),+
  // app(14001),+
  // app(16001),+
  // app(18001),+
  // app(19001),+
  // app(20001),+
  // app(21001),+
  // app(22001),+
  // app(23001),+
  // app(24001),+++++++
  // app(30001),+
  // app(33001),
  // app(36001),
  // app(39001),+
  // app(42001),
  // app(45001),
  // app(48001),
  // app(51001),
  // app(54001)
  // app(57001),+++++++
  // app(60001),
  // app(63001),
  // app(66001),
  // app(69001),
  // app(72001),
  // app(75001),
  // app(78001),
  // app(81001),
  // app(84001),
  // app(87001),
])
