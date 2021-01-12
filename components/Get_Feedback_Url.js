function getFeedbackUrl () {
  const frameUrl = new Promise((resolve, reject) => {
    try {
      const productReviews = document.getElementsByName('feedback')
      console.log(productReviews)

      productReviews[0].scrollIntoView()

      const detailsTabButton = document.querySelectorAll('ul.tab-lists')[0].childNodes[1]
      detailsTabButton.click()

      resolve(productReviews[0].firstChild.firstChild.src)
    } catch (e) {
      reject(e)
    }
  })

  return frameUrl
}

module.exports = getFeedbackUrl
