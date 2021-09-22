const puppeteer = require('puppeteer-core')
const readline = require('readline-sync')
const _ = require('lodash')
const fs = require('fs')
const util = require('util')
const { exit } = require('process');

const GetBooksUrl = require('./lib/get_book_url')
const GetBookInfo = require('./lib/get_book_info');

const app = async (year) => {
  const config = {
    ignoreHTTPSErrors: true,
    executablePath: 'google-chrome-stable',
    headless: false
  }

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

    var urls = [];
    const searchPage = 'https://db.ketab.ir/Search.aspx'

    console.log('Opening page')
    await page.goto(searchPage, { waitUntil: 'domcontentloaded', timeout: 99999999 })
    

    await page.select('#ctl00_ContentPlaceHolder1_drpFromIssueYear', year.toString());
    await page.select('#ctl00_ContentPlaceHolder1_drpFromIssueDay', '01');
    await page.select('#ctl00_ContentPlaceHolder1_drpFromIssueMonth', '01');

    await page.select('#ctl00_ContentPlaceHolder1_drpToIssueYear', year.toString());
    await page.select('#ctl00_ContentPlaceHolder1_drpToIssueMonth', '12');
    await page.select('#ctl00_ContentPlaceHolder1_drpToIssueDay', '31')

    const option2 = (await page.$x(
      '/html/body/form/div[4]/div/div/div/div/div[5]/div[11]/select/option[text() = "100"]'
    ))[0];
    const value2 = await (await option2.getProperty('value')).jsonValue();
    await page.select('#ctl00_ContentPlaceHolder1_DrPageSize', value2);

    await page.click('#ctl00_ContentPlaceHolder1_BtnSearch')

    await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 99999999 })


    const w = await page.evaluate(() => {
      const t = document.getElementById('ctl00_ContentPlaceHolder1_Label1')
      return t.textContent
    })
    
    var countAllResult = +w.match(/\d+/g)[0]
    console.log('Number of found book: ', countAllResult)
  

    var isDisabledNextButton = false
    console.log('Getting books urls ...')
    do {
      var urlList = await page.evaluate(GetBooksUrl)
      isDisabledNextButton = urlList.shift()
      
      urls.push(...urlList)
      console.log(`Got ${urlList.length} urls, remained: `, countAllResult - urlList.length)
      countAllResult -= urlList.length
      
      if (!isDisabledNextButton) {
        var nextButton = await page.$('#ctl00_ContentPlaceHolder1_NextPage')
        await nextButton.click()
        await page.waitForNavigation({ waitUntil: 'domcontentloaded', timeout: 99999999 })
      } else console.log('Getting all books url has been finished')
    } while (!isDisabledNextButton)
      
 

    const result = []

    for (const u of urls) {  
      await page.goto(u, {waitUntil: 'domcontentloaded'})
      const n = await page.evaluate(GetBookInfo)
      result.push(n)


      if ((urls.indexOf(u) + 1) % 10 === 0) {
        console.log('Remained', urls.length - urls.indexOf(u) + 1)
      }
      
      fs.writeFileSync(`./info/${year}_books_details.json`, JSON.stringify(result), function (err) {
        if (err) return err
      })
    }

  } catch (e) {
    console.log(e)
  }

  await browser.close()
}

var year = readline.question('Enter year : [for example 1400] ')

try {
  fs.mkdirSync('./info')
}catch(err) {
  if(err.code !== 'EEXIST') {
    console.error(err)
    exit()
  }
}

app(year)
