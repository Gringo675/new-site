# Chunk Load Error Specification

## Problem Description
Users and bots encounter `TypeError: Failed to fetch dynamically imported module` errors during page navigation after a new deployment.

### Root Cause
The current deployment process in [`deploy.js`](deploy.js) performs a destructive update:
1. It uploads a new build archive.
2. It executes `rm -rf ~/${deployDir}/build` (line 47), which deletes the entire build directory, including all JavaScript chunks from the previous version.
3. It activates the new build.

If a user has the application open and navigates to a route that requires a chunk from the previous build, the browser requests a file that no longer exists on the server, resulting in a 404 and a fatal JavaScript error.

## Proposed Solution: Versioned Build Assets (Asset Carry-over)

The goal is to ensure that assets from previous builds remain available on the server for a grace period, while new builds use a unique path.

### 1. Nuxt Configuration Changes
Modify [`nuxt.config.ts`](nuxt.config.ts) to use a dynamic `buildAssetsDir`.
- **Implementation**: Set `app.buildAssetsDir` to a timestamped path (e.g., `_nuxt/2025-03-07_12-00`).
- **Effect**: All generated asset URLs in the HTML and JS will include this timestamp, ensuring that the current build looks for its own specific chunks.

### 2. Deployment Process Changes
Modify [`deploy.js`](deploy.js) to preserve assets from previous builds during the update process.

**Current Flow:**
`rm -rf build` $\rightarrow$ `mv build_tmp build`

**Proposed Flow (Asset Carry-over):**
1. **Unpack**: Unpack the new build archive into `~/build_tmp`.
2. **Asset Preservation**: Identify folders in the current `~/build/public/_nuxt` directory whose names (timestamps) are newer than 30 days.
3. **Carry-over**: Copy these identified folders from `~/build/public/_nuxt` into `~/build_tmp/public/_nuxt`.
4. **Activation**: Execute the standard `rm -rf build` followed by `mv build_tmp build`.

**Result**:
- The new build is activated.
- The `public/_nuxt` directory contains both the new build's assets and the assets from previous builds (up to 30 days old).
- Old build requests (e.g., `/_nuxt/2025-03-06_10-00/chunk.js`) are still served successfully from the carried-over folders.

