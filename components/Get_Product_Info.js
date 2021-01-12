function getProductInfo () {
  try {
    const skuWrap = document.querySelectorAll('div.sku-wrap')

    const skuWrapPropertiesLength = skuWrap[0].childNodes.length

    const firstPropertyTextContent = skuWrap[0].firstChild.firstChild.firstChild.textContent
    // console.log(firstPropertyTextContent)

    const firstPropertyItems = skuWrap[0].childNodes[0].lastChild.childNodes
    // console.log(firstPropertyItesms)

    if (skuWrapPropertiesLength > 1) {
      var secondPropertyItems = skuWrap[0].childNodes[1].lastChild.childNodes
      // console.log(secondPropertyItems)
    }

    const productPrice = document.querySelectorAll('div.product-price')[0]
    // console.log(productPrice)
    const itemQuantity = document.querySelectorAll('div.product-quantity')[0]
    // console.log(itemQuantity)

    const allProducts = {}

    switch (firstPropertyTextContent) {
      case 'Color': {
        if (window.find('ships from')) {
          const shipsFromCountry = skuWrap[0].lastChild.lastChild.childNodes
          for (const country of shipsFromCountry) {
            console.log(country.className === '')
            if (country.textContent === 'China' &&
                country.className !== 'sku-property-item selected') {
              country.click()
              break
            }
          }
        }

        for (const color of firstPropertyItems) {
          if (!color.className.includes('sku-property-item')) continue

          const colorTitle = color.childNodes[0].childNodes[0].title
          // console.log(colorTitle)

          if (color.className !== 'sku-property-item disabled') {
            if (color.className !== 'sku-property-item selected') {
              color.click()
            }

            const sizesQuantitiesPricesOfObj = {}

            for (const size of secondPropertyItems) {
              if (size.className === 'sku-size-info') continue

              const sizeContent = size.textContent

              if (size.className !== 'sku-property-item disabled') {
                if (size.className !== 'sku-property-item selected') {
                  size.click()
                }

                const currentPrice = productPrice.childNodes[0].innerText
                // console.log(currentPrice)
                const originalPrice = productPrice.childNodes[1].innerText
                // console.log(originalPrice)
                const sizeQuantity = itemQuantity.childNodes[2].lastChild.innerText
                // console.log(sizeQuantity)

                sizesQuantitiesPricesOfObj[sizeContent] = {
                  Sale: currentPrice,
                  Regular: originalPrice,
                  Quantity: sizeQuantity }
              } else {
                sizesQuantitiesPricesOfObj[sizeContent] = 'Not available'
              }

              size.click()
            }

            allProducts[colorTitle] = sizesQuantitiesPricesOfObj

            color.click()
          } else {
            allProducts[colorTitle] = 'Not available'
          }
        }
        return allProducts
      }

      case 'Size': {
        const sizesQuantitiesPricesOfObj = {}

        if (window.find('ships from')) {
          const shipsFromCountry = skuWrap[0].lastChild.lastChild.childNodes

          for (const country of shipsFromCountry) {
            if (country.textContent === 'China') {
              country.click()
              break
            }
          }
        }

        for (const size of firstPropertyItems) {
          if (size.parentNode.parentNode.firstChild.firstChild.textContent !== 'Size') break

          if (size.className === 'sku-size-info') continue
          // console.log(size)

          const sizeText = size.firstChild.textContent
          // console.log(sizeText)

          if (!size.className.includes('disabled')) {
            if (!size.className.includes('selected')) {
              size.click()
            }

            const currentPrice = productPrice.childNodes[0].innerText
            // console.log(currentPrice)
            const originalPrice = productPrice.childNodes[1].innerText
            // console.log(originalPrice)
            const sizeQuantity = itemQuantity.childNodes[2].lastChild.innerText
            // console.log(sizeQuantity)

            sizesQuantitiesPricesOfObj[sizeText] = {
              Sale: currentPrice,
              Regular: originalPrice,
              Quantity: sizeQuantity }

            size.click()
          } else {
            sizesQuantitiesPricesOfObj[sizeText] = 'Not available'
          }
        }
        allProducts['Single Color'] = sizesQuantitiesPricesOfObj
        return allProducts
      }
    }
  } catch (err) {
    const productInfo = document.querySelectorAll('div.product-info')
    // console.log(productInfo)

    if (productInfo.length) {
      return 'Sorry, this item is no longer available!'
    } else if (document.getElementsByClassName('not-found-page')) {
      return 'Sorry, page not found'
    } else {
      return `Get_Product_Info: ${err}`
    }
  }
}

module.exports = getProductInfo
