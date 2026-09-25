import { test, expect } from '@playwright/test'

test.describe('FGIS RST (GRSI) Public Search & Catalog Integration', () => {
  const urlBase = (process.env.TEST_URL_BASE ?? 'http://localhost:3001').replace(/\/+$/, '')

  test('1. Initial page load, breadcrumbs, hero block and FAQ', async ({ page }) => {
    await page.goto(`${urlBase}/materials/fgis`)

    // Page title and main header
    await expect(page).toHaveTitle(/Поиск по ФГИС РСТ \(Госреестр СИ\) онлайн/)
    await expect(page.getByRole('heading', { level: 1 })).toHaveText('Поиск по ФГИС РСТ (Госреестр СИ)')

    // Breadcrumbs
    const breadcrumb = page.getByRole('navigation', { name: 'breadcrumb' })
    await expect(breadcrumb).toContainText('Главная')
    await expect(breadcrumb).toContainText('Материалы')
    await expect(breadcrumb).toContainText('ФГИС РСТ (Госреестр СИ)')

    // Initial search hero
    await expect(page.getByRole('heading', { name: 'Быстрый поиск по базе Росстандарта' })).toBeVisible()
    await expect(page.getByText('Описания типов (ОТ)')).toBeVisible()
    await expect(page.getByText('Методики поверки (МП)')).toBeVisible()

    // FAQ section accordion
    const faqHeading = page.getByRole('heading', { name: 'Часто задаваемые вопросы (FAQ)' })
    await expect(faqHeading).toBeVisible()

    const firstQuestion = page.getByRole('button', { name: /Что такое ФГИС РСТ/ })
    await expect(firstQuestion).toBeVisible()
  })

  test('2. Search by registry number with catalog products (72189-18)', async ({ page }) => {
    await page.goto(`${urlBase}/materials/fgis`)

    // Fill in registry number
    const numberInput = page.getByRole('searchbox', { name: 'Номер ГРСИ' })
    await numberInput.fill('72189-18')

    // Submit search
    await page.getByRole('button', { name: 'Найти во ФГИС' }).click()

    // URL is synced
    await expect(page).toHaveURL(/number=72189-18/)

    // Results list appears
    const resultsHeader = page.getByText(/Реестр СИ\s*\(\d+\)/)
    await expect(resultsHeader).toBeVisible({ timeout: 15000 })

    // Registry row is displayed
    const registryRow = page.locator('#search-results').getByText('№ 72189-18').first()
    await expect(registryRow).toBeVisible()

    // Desktop details card
    const detailsCard = page.locator('#search-results').locator('text=ГРСИ № 72189-18').first()
    await expect(detailsCard).toBeVisible()

    // Official document link (Описание типа)
    const docLink = page.getByRole('link', { name: /Описание типа/ }).first()
    await expect(docLink).toBeVisible()
    await expect(docLink).toHaveAttribute('href', /\/api\/fgis\/file\//)

    // Catalog products showcase
    await expect(page.getByText(/Товары в каталоге/)).toBeVisible()
    await expect(page.getByText(/из 149/)).toBeVisible()

    // Product cards exist
    const productCards = page.getByTestId('product-card')
    await expect(productCards.first()).toBeVisible()
  })

  test('3. Reset filters returns page to initial hero state', async ({ page }) => {
    await page.goto(`${urlBase}/materials/fgis?number=72189-18`)

    // Wait for results
    await expect(page.getByText(/Реестр СИ/)).toBeVisible({ timeout: 15000 })

    // Click "Очистить" button
    const clearButton = page.getByRole('button', { name: 'Очистить' })
    await clearButton.click()

    // URL has no query params
    await expect(page).toHaveURL(/\/materials\/fgis$/)

    // Number input is empty
    const numberInput = page.getByRole('searchbox', { name: 'Номер ГРСИ' })
    await expect(numberInput).toHaveValue('')

    // Hero block reappears
    await expect(page.getByRole('heading', { name: 'Быстрый поиск по базе Росстандарта' })).toBeVisible()
  })

  test('4. Empty results state when non-existent registry queried', async ({ page }) => {
    await page.goto(`${urlBase}/materials/fgis`)

    const numberInput = page.getByRole('searchbox', { name: 'Номер ГРСИ' })
    await numberInput.fill('00000-00')
    await page.getByRole('button', { name: 'Найти во ФГИС' }).click()

    // Empty state heading
    const emptyNotice = page.getByRole('heading', { name: 'По вашему запросу ничего не найдено' })
    await expect(emptyNotice).toBeVisible({ timeout: 15000 })

    // Reset button in empty state returns to hero
    const resetBtn = page.getByRole('button', { name: 'Сбросить фильтры' })
    await expect(resetBtn).toBeVisible()
    await resetBtn.click()

    await expect(page.getByRole('heading', { name: 'Быстрый поиск по базе Росстандарта' })).toBeVisible()
  })

  test('5. Record with 0 catalog products triggers feedback modal', async ({ page }) => {
    // Search for number with 0 products
    await page.goto(`${urlBase}/materials/fgis?number=909-54`)

    // Wait for search result
    await expect(page.getByText(/Реестр СИ/)).toBeVisible({ timeout: 15000 })

    // Fallback banner
    await expect(page.getByText('Точного соответствия в каталоге нет').first()).toBeVisible()

    // Click "Оставить заявку"
    const feedbackBtn = page.getByRole('button', { name: 'Оставить заявку' }).first()
    await feedbackBtn.click()

    // Feedback modal opens
    const modalHeading = page.getByRole('heading', { name: /Заявка по ГРСИ № 909-54/ })
    await expect(modalHeading).toBeVisible()

    // Close feedback modal
    const cancelBtn = page.getByRole('button', { name: 'Отмена' })
    await cancelBtn.click()
    await expect(modalHeading).not.toBeVisible()
  })
})
