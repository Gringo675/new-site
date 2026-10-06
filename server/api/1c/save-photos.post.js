import path from 'node:path'
import sharp from 'sharp'

export default defineEventHandler(async event => {
  // Загрузка и оптимизация фотографий отгрузок по номеру счета
  const config = useRuntimeConfig(event)
  const validKey = config.ONEC_API_KEY || process.env.ONEC_API_KEY

  let formData
  try {
    formData = await readSafeMultipartFormData(event)
  } catch (err) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Invalid multipart form data',
      message: err.message,
    })
  }

  if (!formData || !formData.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Multipart form data is empty',
      message: 'Multipart form data is empty',
    })
  }

  let apiKey = ''
  let billNumber = ''
  const files = []

  for (const item of formData) {
    if (item.name === 'api_key') {
      apiKey = item.data.toString().trim()
    } else if (item.name === 'bill_number' || item.name === 'bill') {
      billNumber = item.data.toString().trim()
    } else if (item.data && item.data.length > 0 && (item.filename || item.type?.startsWith('image/'))) {
      if (!item.filename) {
        item.filename = `${item.name}.jpg`
      }
      files.push(item)
    }
  }

  const query = getQuery(event) || {}
  if (!apiKey) apiKey = query.api_key || getHeader(event, 'x-api-key') || ''
  if (!billNumber) billNumber = query.bill_number || query.bill || ''

  if (!validKey || apiKey !== validKey) {
    throw createError({
      statusCode: 503,
      statusMessage: 'UNCORRECT PASSWORD!',
      message: 'UNCORRECT PASSWORD!',
    })
  }

  if (!files.length) {
    throw createError({
      statusCode: 400,
      statusMessage: 'Array $_FILES is empty! Image(s) was not received!',
      message: 'Array $_FILES is empty! Image(s) was not received!',
    })
  }

  if (!billNumber) {
    throw createError({
      statusCode: 400,
      statusMessage: 'No bill number!',
      message: 'No bill number!',
    })
  }

  const { saveFile, fileExists } = useStaticStorage()
  const savedFiles = []

  for (const file of files) {
    const rawName = path.basename(file.filename || `${file.name}.jpg`)
    const transliterated = transliterate(rawName)
    const cleanName = transliterated.replace(/[^\w.-]/gi, '_')
    const fileName = `${file.data.length}_${cleanName}`

    const mainPath = `/img/shippings/${fileName}`
    const thumbPath = `/img/shippings/thumb_${fileName}`

    if (!(await fileExists(mainPath))) {
      try {
        const ext = path.extname(cleanName).toLowerCase()

        // 1. Оптимизируем и сохраняем основной файл (ограничиваем разрешение до 1920px без апскейла)
        let sharpMain = sharp(file.data)
          .rotate()
          .resize({ width: 1920, height: 1920, fit: 'inside', withoutEnlargement: true })

        if (ext === '.jpg' || ext === '.jpeg') {
          sharpMain = sharpMain.jpeg({ quality: 80, mozjpeg: true })
        } else if (ext === '.png') {
          sharpMain = sharpMain.png({ compressionLevel: 8 })
        } else if (ext === '.webp') {
          sharpMain = sharpMain.webp({ quality: 80 })
        }
        const mainBuffer = await sharpMain.toBuffer()
        await saveFile(mainPath, mainBuffer)

        // 2. Создаем миниатюру (высота 250px)
        let sharpThumb = sharp(file.data)
          .rotate()
          .resize({ height: 250, withoutEnlargement: true })

        if (ext === '.jpg' || ext === '.jpeg') {
          sharpThumb = sharpThumb.jpeg({ quality: 75, mozjpeg: true })
        } else if (ext === '.png') {
          sharpThumb = sharpThumb.png({ compressionLevel: 8 })
        } else if (ext === '.webp') {
          sharpThumb = sharpThumb.webp({ quality: 75 })
        }
        const thumbBuffer = await sharpThumb.toBuffer()
        await saveFile(thumbPath, thumbBuffer)

        savedFiles.push(fileName)
      } catch (err) {
        console.error(`Error saving photo ${fileName}:`, err)
        throw createError({
          statusCode: 500,
          statusMessage: `Image processing error: ${err.message}`,
          message: err.message,
        })
      }
    }
  }

  // Заносим в базу данных i_shipping_photos
  if (savedFiles.length > 0) {
    try {
      const placeholders = savedFiles.map(() => '(?, ?)').join(', ')
      const values = savedFiles.flatMap(name => [billNumber, name])
      await dbReq(
        `INSERT INTO i_shipping_photos (bill_number, photo) VALUES ${placeholders}`,
        values
      )
    } catch (dbErr) {
      console.error('Error inserting photos to DB:', dbErr)
      throw createError({
        statusCode: 500,
        statusMessage: `Database insert error: ${dbErr.message}`,
        message: dbErr.message,
      })
    }
  }

  const acceptHeader = getHeader(event, 'accept') || ''
  if (acceptHeader.includes('application/json')) {
    return {
      success: true,
      savedFiles: savedFiles.length,
      files: savedFiles,
    }
  }

  return `Saved files: ${savedFiles.length}`
})
