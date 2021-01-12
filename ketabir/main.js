const puppeteer = require('puppeteer-core')
const mkdirp = require('mkdirp')
const readline = require('readline-sync')

const GetBooksUrl = require('./lib/components/get_book_url')
const GetInfo = require('./lib/getInfo')

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

const app = async (pubName, pubId) => {
  const browser = await puppeteer.launch(config)

  try {
    const page = await browser.newPage()
    await page.setRequestInterception(true)

    page.on('request', (req) => {
      const blockList = ['image', 'font', 'script', 'stylesheet']
      if (blockList.includes(req.resourceType())) {
        req.abort()
      } else {
        req.continue()
      }
    })

    mkdirp(`./info/${pubName}`)

    const booksListUrl = `http://ketab.ir/BookListPublisher.aspx?Type=Publisherid&Code=${pubId}`

    console.log('Opening publication page')
    await page.goto(booksListUrl, { waitUntil: 'domcontentloaded', timeout: 99999999 })

    console.log('Selected 2000 books filter')
    await page.select('#ctl00_ContentPlaceHolder1_PageSizeList', '2000')
      .then(() => {
        console.log('Waiting for navigation ...')
      })

    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 99999999 })

    var _isDisabledNextButton = false
    var index = 0
    do {
      var urlList = await page.evaluate(GetBooksUrl)
      console.log('Getting books details ...')

      _isDisabledNextButton = urlList[0]

      urlList.shift()

      GetInfo(urlList, pubName, index)

      index += urlList.length

      if (!_isDisabledNextButton) {
        console.log('Waiting from navigation to next page ...')

        var nextButton = await page.$('#ctl00_ContentPlaceHolder1_NextPage')

        await nextButton.click()

        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 99999999 })
      } else console.log('Getting all books url has been finished')
    } while (!_isDisabledNextButton)
  } catch (e) {
    console.log(e)
  } finally {
    await browser.close()
  }
}

var pubId = readline.questionInt('Enter publication ID: ')
var pubName = readline.question('Enter pubilcation name: ')

app(pubName, pubId)
