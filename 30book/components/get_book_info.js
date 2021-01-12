function getProductInfo () {
  const bookInfo = {}

  try {
    const bookHeader = document.querySelectorAll('div.col-15.col-md-10.col-lg-11')

    const bookName = bookHeader[0].children[0].textContent
    const bookOriginalPrice = bookHeader[0].children[3].children[0].textContent

    bookInfo['اسم'] = bookName
    bookInfo['قیمت'] = bookOriginalPrice

    const tablesDetails = document.querySelectorAll('table.table')

    for (const table of tablesDetails) {
      for (const tr of table.children[0].children) {
        bookInfo[tr.children[0].innerText] = tr.children[1].innerText
      }
    }

    return (bookInfo)
  } catch (err) {
    return (err)
  }
}

module.exports = getProductInfo
