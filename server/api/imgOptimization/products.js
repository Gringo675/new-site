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
  const widths = [64, 128, 300]

  try {
    // Ensure all directories exist before starting
    const allDirs = [
      ...widths.map(w => path.join(workDir, `w_${w}`)),
      path.join(workDir, 'w_max'),
      sourceDir,
      proceedDir,
    ]
    for (const dir of allDirs) {
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

      const metadata = await sharpInstance.metadata()
      const originalWidth = metadata.width

      let baseName = filename.startsWith('full_') ? filename.substring(5) : filename
      const nameWithoutExtension = path.parse(baseName).name

      // Цикл по размерам
      for (const width of widths) {
        const targetDir = path.join(workDir, `w_${width}`)
        // Upscaling is now allowed to ensure all sizes are generated
        const image = sharpInstance.resize({ width: width })

        await image.toFormat('avif').toFile(path.join(targetDir, `${nameWithoutExtension}.avif`))
        await image.toFormat('webp').toFile(path.join(targetDir, `${nameWithoutExtension}.webp`))
        await image.toFormat('jpeg').toFile(path.join(targetDir, `${nameWithoutExtension}.jpg`))
      }

      // Handle w_max directory
      const wMaxDir = path.join(workDir, 'w_max')
      const wMaxSharpInstance = sharp(originalFilePath) // Create a fresh instance to be safe
      let wMaxImage
      if (originalWidth < 400) {
        wMaxImage = wMaxSharpInstance.resize({ width: 400 })
      } else {
        // If original is >= 400, use the fresh instance without resizing
        wMaxImage = wMaxSharpInstance
      }
      await wMaxImage.toFormat('avif').toFile(path.join(wMaxDir, `${nameWithoutExtension}.avif`))
      await wMaxImage.toFormat('webp').toFile(path.join(wMaxDir, `${nameWithoutExtension}.webp`))
      await wMaxImage.toFormat('jpeg').toFile(path.join(wMaxDir, `${nameWithoutExtension}.jpg`))

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
