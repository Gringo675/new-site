import fs from 'fs/promises'
import path from 'path'
import sharp from 'sharp'

export default defineEventHandler(async event => {
  // Only allow on dev server
  if (process.env.NODE_ENV !== 'development') {
    setResponseStatus(event, 403)
    return { success: false, message: 'Доступно только на dev сервере.' }
  }

  const workDir = path.resolve(process.cwd(), 'img_optimisation')
  const proceedDir = path.join(workDir, 'proceed')
  const sourceDir = path.join(workDir, 'source')
  const widths = [64, 128, 400, 800, 1600]

  try {
    const filesToProcess = (await fs.readdir(proceedDir)).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))

    if (filesToProcess.length === 0) {
      return { success: true, message: 'В папке "proceed" нет файлов для обработки.' }
    }

    // Обработка каждого файла
    for (const filename of filesToProcess) {
      const originalFilePath = path.join(proceedDir, filename)
      const sharpInstance = sharp(originalFilePath)

      const metadata = await sharpInstance.metadata()
      const originalWidth = metadata.width

      let baseName = filename.startsWith('full_') ? filename.substring(5) : filename
      const nameWithoutExtension = path.parse(baseName).name

      // Цикл по размерам
      for (const width of widths) {
        const targetDir = path.join(workDir, `w_${width}`)
        // Не допускаем апскейлинг. Например, если оригинал 400px, в папке w_800 все равно будет лежать 400px
        const targetWidth = Math.min(width, originalWidth)
        const image = sharpInstance.resize({ width: targetWidth })

        await image.toFormat('avif').toFile(path.join(targetDir, `${nameWithoutExtension}.avif`))
        await image.toFormat('webp').toFile(path.join(targetDir, `${nameWithoutExtension}.webp`))
        await image.toFormat('jpeg').toFile(path.join(targetDir, `${nameWithoutExtension}.jpg`))
      }

      // Перемещение оригинала
      await fs.rename(originalFilePath, path.join(sourceDir, baseName))
    }

    // Возвращаем успешный JSON-ответ
    return { success: true, message: `Обработано ${filesToProcess.length} файлов.` }
  } catch (error) {
    console.error('Ошибка при оптимизации изображений:', error)

    // Возвращаем JSON-ответ с ошибкой
    setResponseStatus(event, 500)
    return { success: false, message: 'Произошла ошибка на сервере.', error: error.message }
  }
})
