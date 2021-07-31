const GetBooksURL = () => {
  try {
    const dataList = document.querySelectorAll('#ctl00_ContentPlaceHolder1_DataList1')

    const booksList = dataList[0].children[0].children

    const nextPageElement = document.querySelector('#ctl00_ContentPlaceHolder1_NextPage')
    var urlList = [nextPageElement.disabled]

    for (let i = 1; i < booksList.length; i += 2) {
      const bookId = booksList[i].children[0].children[0].children[0].children[0].children[2].children[0].children[0].search
      var bookURL = `https://db.ketab.ir/bookview.aspx${bookId}`
      urlList.push(bookURL)
    }
    return (urlList)
  } catch (err) {
    return (err)
  }
}

module.exports = GetBooksURL
