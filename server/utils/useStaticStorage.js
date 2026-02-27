import fs from 'node:fs/promises'
import { join } from 'node:path'

// Get base path from nitro.storage config
const staticBase =
  process.env.NODE_ENV === 'production'
    ? join(process.cwd(), '../../public_html/static')
    : join(process.cwd(), '.static')

/**
 * Remove leading slash from path for join
 * @param {string} filePath - Path relative to static base
 * @returns {string} Path without leading slash
 */
const cleanPath = filePath => (filePath.startsWith('/') ? filePath.slice(1) : filePath)

/**
 * Composable for file operations using fs (bypasses unstorage binary data bug)
 * @returns {Object} Methods: getFile(), saveFile(), saveJSON(), getJSON(), deleteFile(), fileExists()
 */
export const useStaticStorage = () => {
  /**
   * Save a file to the specified directory
   * @param {string} filePath - Path relative to static base
   * @param {Buffer} content - Binary file content
   * @returns {Promise<string>} Full path to the saved file
   */
  const saveFile = async (filePath, content) => {
    const fullPath = join(staticBase, cleanPath(filePath))

    // Create directory if it doesn't exist
    const dir = join(fullPath, '..')
    await fs.mkdir(dir, { recursive: true })

    // Write the file
    await fs.writeFile(fullPath, content)

    return fullPath
  }

  /**
   * Read a file as Buffer
   * @param {string} filePath - Path relative to static base
   * @returns {Promise<Buffer>} File content
   */
  const getFile = async filePath => {
    const fullPath = join(staticBase, cleanPath(filePath))

    return await fs.readFile(fullPath)
  }

  /**
   * Delete a file
   * @param {string} filePath - Path relative to static base
   * @returns {Promise<void>}
   */
  const deleteFile = async filePath => {
    const fullPath = join(staticBase, cleanPath(filePath))

    await fs.unlink(fullPath)
  }

  /**
   * Check if a file exists
   * @param {string} filePath - Path relative to static base
   * @returns {Promise<boolean>}
   */
  const fileExists = async filePath => {
    const fullPath = join(staticBase, cleanPath(filePath))
    try {
      await fs.access(fullPath)
      return true
    } catch {
      return false
    }
  }

  /**
   * Save data as JSON file
   * @param {string} filePath - Path relative to static base (e.g., '/metadata/doc.json')
   * @param {any} data - Data to serialize as JSON
   * @returns {Promise<string>} Full path to the saved file
   */
  const saveJSON = async (filePath, data) => {
    const fullPath = join(staticBase, cleanPath(filePath))

    // Create directory if it doesn't exist
    const dir = join(fullPath, '..')
    await fs.mkdir(dir, { recursive: true })

    // Write JSON with pretty formatting
    await fs.writeFile(fullPath, JSON.stringify(data), 'utf8')

    return fullPath
  }

  /**
   * Read and parse a JSON file
   * @param {string} filePath - Path relative to static base (e.g., '/metadata/doc.json')
   * @returns {Promise<any>} Parsed JSON data
   */
  const getJSON = async filePath => {
    try {
      const fullPath = join(staticBase, cleanPath(filePath))

      const content = await fs.readFile(fullPath, 'utf8')
      return JSON.parse(content)
    } catch (e) {
      console.error(`Error reading JSON file: ${filePath}`, e)
      return null
    }
  }

  return {
    saveFile,
    getFile,
    saveJSON,
    getJSON,
    deleteFile,
    fileExists,
  }
}
