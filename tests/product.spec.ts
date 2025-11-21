import { test, expect } from '@playwright/test'
import formatPrice from '../app/composables/formatPrice'
import parseIsoDate from '../app/utils/parseIsoDate'
import { stripHtml } from '../shared/utils/stripHtml'

test('test product page', async ({ page }) => {
  const urlBase = process.env.TEST_URL_BASE ?? ''
  // const urlBase = 'http://localhost:3000/'
  const urlProduct = urlBase + 'product/shtangentsirkul-shts-i-150-0-05-stiz'

  await page.goto(urlProduct)

  const productDataFromApi = await getProductDataFromAPI(page.url())

  // check id
  await expect(page.getByText(productDataFromApi.id, { exact: true })).toBeVisible()
  // check name
  await expect(page.getByRole('heading', { name: productDataFromApi.name })).toBeVisible()
  // check price
  await expect(page.getByText(formatPrice(productDataFromApi.price), { exact: true })).toBeVisible()
  // check first image
  await expect(
    page.locator(`img[src="/static/img/products/w_300/${productDataFromApi.images[0]}.jpg"]`),
  ).toBeInViewport()
  // check thumbnails
  for (const ind in productDataFromApi.images) {
    await expect(
      page.locator(`button:has(img[src="/static/img/products/w_64/${productDataFromApi.images[ind]}.jpg"])`),
    ).toBeVisible()
  }
  // check brand
  await expect(page.locator(`img[src="/static/img/brands/${productDataFromApi.brand.image}"]`)).toBeVisible()
  await expect(
    page.getByText(`${productDataFromApi.brand.shortName} (${productDataFromApi.brand.fullName})`, { exact: true }),
  ).toBeVisible()
  //check props
  for (const prop of productDataFromApi.props) {
    await expect(page.getByText(prop.name, { exact: true })).toBeVisible()
    await expect(page.getByText(prop.val, { exact: true })).toBeVisible()
  }

  // check cart
  const cartButton = page.locator('header').locator('a[href="/user/cart"]')
  // hydration milestone
  await page.getByRole('button', { name: 'Добавить в корзину' }).click()
  await expect(cartButton).toHaveText('1')
  await page.getByRole('button', { name: 'Добавить' }).click()
  await expect(cartButton).toHaveText('2')
  await page.getByRole('button', { name: 'Убавить' }).click()
  await expect(cartButton).toHaveText('1')
  await page.getByRole('button', { name: 'Убавить' }).click()
  await expect(cartButton).toHaveText('0')

  // check Fast order
  await page.getByRole('main').getByRole('button', { name: 'Быстрый заказ' }).click()
  await expect(page.getByRole('heading', { name: 'Быстрый заказ' })).toBeVisible()
  await page.getByRole('button', { name: 'Отмена' }).click()

  // check images viewer (after hydration)
  await page.getByRole('button', { name: 'Следующее' }).click()
  await expect(
    page.locator(`img[src="/static/img/products/w_300/${productDataFromApi.images[1]}.jpg"]`),
  ).toBeInViewport()
  await page.getByRole('button', { name: 'Предыдущее' }).click()
  await expect(
    page.locator(`img[src="/static/img/products/w_300/${productDataFromApi.images[0]}.jpg"]`),
  ).toBeInViewport()
  await page.locator('#img_0').click()
  await expect(
    page.locator(`img[src="/static/img/products/w_max/${productDataFromApi.images[0]}.jpg"]`),
  ).toBeInViewport()
  await page.getByRole('button', { name: 'Закрыть' }).click()

  // better accept cookies before proceeding
  await page.getByRole('button', { name: 'Принять' }).click()

  // check tabs
  await page.getByRole('button', { name: 'Развернуть' }).click()
  await expect(page.getByRole('button', { name: 'Свернуть' })).toBeVisible()

  // Description tab
  await expect(page.getByText(stripHtml(productDataFromApi.description).slice(0, 20))).toBeVisible()

  // Characteristics tab
  await page.getByRole('tab', { name: 'Характеристики' }).click()
  if (productDataFromApi.characteristics?.length)
    await expect(page.getByText(stripHtml(productDataFromApi.characteristics).slice(0, 20))).toBeVisible()

  // Documentation tab
  await page.getByRole('tab', { name: 'Документация' }).click()
  for (const stn of productDataFromApi.docs.stnd) {
    await expect(page.getByText(`${stn.number} ${stn.name}`, { exact: true })).toBeVisible()

    // Check modal document viewer
    // For the network request, the browser URL-encodes spaces but not brackets.
    const encodedFilename = stn.file.replace(/ /g, '%20')
    const expectedPathForResponse = `/static/doc/stnd/${encodedFilename}`

    // For the DOM `src` attribute, the browser keeps it un-encoded.
    const expectedIframeSrc = `/static/doc/stnd/${stn.file}#toolbar=0`

    // 1. Start waiting for the response BEFORE the action that triggers it.
    const pdfResponsePromise = page.waitForResponse(resp => resp.url().includes(expectedPathForResponse))

    // 2. Perform the action that opens the modal and triggers the iframe load.
    await page.getByText(`Открыть ${stn.number}`, { exact: true }).click()

    // 3. Now, assert that the UI has updated correctly.
    await expect(page.getByRole('heading', { name: `${stn.number} ${stn.name}` })).toBeVisible()
    const iframeLocator = page.locator('iframe')
    await expect(iframeLocator).toBeVisible()
    await expect(iframeLocator).toHaveAttribute('src', expectedIframeSrc)

    // 4. Wait for the network response promise to resolve and verify it.
    const pdfResponse = await pdfResponsePromise
    const contentType = await pdfResponse.headerValue('content-type')
    expect(pdfResponse.ok()).toBe(true)
    expect(contentType).toContain('application/pdf')

    // Close the document viewer
    await page.getByRole('button', { name: 'Close' }).and(page.locator('.z-10')).click()
  }
  for (const rst of productDataFromApi.docs.rstr) {
    await expect(
      page.getByText(
        `Госреестр №${rst.number} ${rst.name}${rst.type_si?.length > 1 ? ` тип - ${rst.type_si}` : ''}${
          rst.brand?.length > 1 ? ` Изготовитель: ${rst.brand}.` : ''
        }${rst.date?.length > 1 ? ` Срок свидетельства: ${parseIsoDate(rst.date)}` : ''}`,
        { exact: true },
      ),
    ).toBeVisible()
    await expect(page.getByRole('button', { name: 'Открыть свидетельство об утверждении типа' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Открыть описание типа' })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Открыть методику поверки' })).toBeVisible()
  }
  for (const pas of productDataFromApi.docs.pasp) {
    await expect(page.getByText(pas.name, { exact: true })).toBeVisible()
    await expect(page.getByRole('button', { name: 'Открыть паспорт' })).toBeVisible()
  }

  // Delivery info tab
  await page.getByRole('tab', { name: 'Способы получения' }).click()
  await expect(page.getByRole('heading', { name: 'Доставка заказа' })).toBeVisible()
  await expect(page.getByText('Самовывоз с ПВЗ', { exact: true })).toBeVisible()
  await expect(page.getByText('Доставка до дверей', { exact: true })).toBeVisible()
  // Wait for the initial load request for the default city to complete
  await page.waitForResponse(resp => resp.url().includes('/api/dellin/getCalc'))
  await page.getByRole('textbox', { name: 'Укажите пункт назначения' }).fill('рязань')
  // Now, start waiting for the specific request triggered by the city change
  const responsePromise = page.waitForResponse(resp => resp.url().includes('/api/dellin/getCalc'))
  await page.getByRole('link', { name: 'Рязань г (Рязанская обл.)' }).click()
  // Wait for the response and parse it
  const response = await responsePromise
  const deliveryData = await response.json()
  await expect(
    page.getByRole('heading', { name: 'Расчет стоимости доставки до Рязань г (Рязанская обл.)*' }),
  ).toBeVisible()
  // Assert that the "Самовывоз с ПВЗ" option is visible with the correct data
  const expectedPickupText = `От ${formatPrice(deliveryData.term_price)}, срок от ${deliveryData.term_days} дн.`
  await expect(page.getByText(expectedPickupText, { exact: true })).toBeVisible()
  // Assert that the "Доставка до дверей" option is visible with the correct data
  const expectedDoorText = `От ${formatPrice(deliveryData.door_price)}, срок от ${deliveryData.door_days} дн.`
  await expect(page.getByText(expectedDoorText, { exact: true })).toBeVisible()

  // Test Похожие товары block
  expect(productDataFromApi.relatedProds.length).toBe(6)
  for (const relatedProd of productDataFromApi.relatedProds) {
    await expect(page.getByRole('link', { name: relatedProd.name })).toBeVisible()
  }
})

const getProductDataFromAPI = async (url: string) => {
  const productAlias = url.split('/').pop()
  const apiUrl = `https://test.chelinstrument.ru/api/getData/product/${productAlias}`
  const response = await fetch(apiUrl)
  if (!response.ok) {
    throw new Error(`API request failed with status ${response.status}`)
  }
  const data = await response.json()
  return data
}
