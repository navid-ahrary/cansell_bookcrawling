const GetBookInfo = () => {
  try {
    var bookInfo = {}

    bookInfo['url'] = document.URL

    image_src = document.querySelector('div.col-lg-4').firstElementChild.src

    const infoDOM = document.querySelector('div.col-lg-8')

    bookInfo['name'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblBookTitle').innerText.trim()

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_rptSubject')) {
      const subjList = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_rptSubject').children
      bookInfo['main_category'] = subjList[0].children[0].innerText.trim()

      if (subjList[0].children[1]) {
        bookInfo['first_category'] = subjList[0].children[1].innerText.trim()
      } else bookInfo['first_category'] = ''

      if (subjList[0].children[2]) {
        bookInfo['second_category'] = subjList[0].children[2].innerText.trim()
      } else bookInfo['second_category'] = ''
    } else bookInfo['main_category'] = ''

    var allWriterList = []
    var allTranslatorList = []

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_rptAuthor')) {

    }
    for (var authorEl of infoDOM.querySelector('#ctl00_ContentPlaceHolder1_rptAuthor').children[0].children) {
      var author = authorEl.innerText.trim()

      if (author.includes('مترجم:')) {
        var translator = author.replace('مترجم:', '')
        allTranslatorList.push(translator)
        continue
      }
      var writer = author.replace('نويسنده:', '')
        .replace('گردآورنده:', '')
        .replace('ويراستار:', '')
        .replace('تدوين:', '')
      allWriterList.push(writer)
    }

    bookInfo['writer'] = allWriterList.join(', ')
    bookInfo['translator'] = allTranslatorList.join(', ')

    bookInfo['publisher'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_rptPublisher_ctl00_HyperLink2').innerText.trim()

    const info1 = infoDOM.children[6].childNodes[2].textContent
      .trim()
      .replace(/[(]/g, '')
      .replace(/[)]/g, '')
      .replace(/ {2,}/g, '')
      .split('-')

    bookInfo['book_page'] = ''
    bookInfo['edition'] = ''
    for (var info of info1) {
      if (info.includes('صفحه')) bookInfo['book_page'] = info.trim()
      if (info.includes('چاپ')) bookInfo['edition'] = info.trim()
      else continue
    }
    bookInfo['book_type'] = ''
    bookInfo['book_appearance'] = ''
    if (info1[1].trim().split(' ')[0]) bookInfo['book_type'] = info1[1].trim().split(' ')[0]
    if (info1[1].trim().split(' ')[1]) bookInfo['book_appearance'] = info1[1].trim().split(' ')[1]

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblISBN')) {
      bookInfo['isbn'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblISBN')
        .innerText.replace('ISBN:', '').replace(/-/g, '').trim()
    } else bookInfo['isbn'] = ''

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblIssueDate')) {
      bookInfo['publication_date'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblIssueDate')
        .innerText.replace('تاریخ نشر:', '').trim()
    } else bookInfo['isbn'] = ''

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_Labellang')) {
      bookInfo['book_lang'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_Labellang')
        .innerText.replace('زبان كتاب:', '').trim()
    } else bookInfo['isbn'] = ''

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblDoe')) {
      bookInfo['ddc'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblDoe')
        .innerText.replace('كد دیویی:', '').trim()
    } else bookInfo['isbn'] = ''

    if (infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblprice')) {
      bookInfo['price'] = infoDOM.querySelector('#ctl00_ContentPlaceHolder1_lblprice')
        .innerText.replace('قیمت :', '').trim()
    } else bookInfo['isbn'] = ''

    return bookInfo
  } catch (e) {
    console.log(e)
  }
}

module.exports = GetBookInfo
