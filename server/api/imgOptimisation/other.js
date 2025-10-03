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
  const finishedDir = path.join(workDir, 'finished')
  const widths = [] // Array of widths
  const createWMax = true

  try {
    // Ensure all directories exist before starting
    for (const dir of [sourceDir, proceedDir, finishedDir]) {
      await fs.mkdir(dir, { recursive: true })
    }

    const filesToProcess = (await fs.readdir(proceedDir)).filter(file => /\.(jpg|jpeg|png|gif)$/i.test(file))

    if (filesToProcess.length === 0) {
      return { success: true, message: 'В папке "proceed" нет файлов для обработки.' }
    }

    // Обработка каждого файла
    for (const filename of filesToProcess) {
      const originalFilePath = path.join(proceedDir, filename)
      const sharpInstance = sharp(originalFilePath)
      const nameWithoutExtension = path.parse(filename).name

      for (const width of widths) {
        const image = sharpInstance.clone().resize({ width })
        const newName = `w${width}_${nameWithoutExtension}`

        // Save in different formats
        await image.toFormat('avif').toFile(path.join(finishedDir, `${newName}.avif`))
        await image.toFormat('webp').toFile(path.join(finishedDir, `${newName}.webp`))
        await image.toFormat('png').toFile(path.join(finishedDir, `${newName}.png`))
        await image.toFormat('jpeg').toFile(path.join(finishedDir, `${newName}.jpg`))
      }

      if (createWMax) {
        const newName = `wmax_${nameWithoutExtension}`
        const image = sharpInstance.clone()
        await image.toFormat('avif').toFile(path.join(finishedDir, `${newName}.avif`))
        await image.toFormat('webp').toFile(path.join(finishedDir, `${newName}.webp`))
        await image.toFormat('png').toFile(path.join(finishedDir, `${newName}.png`))
        await image.toFormat('jpeg').toFile(path.join(finishedDir, `${newName}.jpg`))
      }

      // Перемещение оригинала
      await fs.rename(originalFilePath, path.join(sourceDir, filename))
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
