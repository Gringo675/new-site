# Spec: UI/UX Redesign for Admin Log Viewer

## Overview

The current log viewer in `app/pages/admin/log.vue` dumps raw text and parsed JSON into a single unpaginated table without rich visual cues, metadata breakdown, or dedicated detail inspection.

This specification outlines a comprehensive UI/UX overhaul of `app/pages/admin/log.vue` designed for high readability, responsive filtering, fast navigation, and structured log inspection via a dedicated slide-over panel.

## Key Requirements

### 1. Data Processing & Normalization
Logs originate from two primary patterns:
1. **Rich error logs** (`app/error.vue` via `/api/log/setError`):
   - Structured JSON payload containing `statusCode`, `statusMessage`, `url`, `onServer`, `userAgent`, `stack`, `isBot`, `isChunkError`, `isSuppressed`, and `build`.
2. **Plain text logs** (e.g., `app/components/TheHeader.vue` via `/api/log/setText`):
   - Unstructured text strings (or arbitrary JSON).

The component parses each log item:
- `isError`: `Number(log.error) === 1`
- `parsed`: JSON parsed object if valid, otherwise `null`
- `statusCode`: HTTP status code from `parsed.statusCode`
- `statusMessage`: Error message from `parsed.statusMessage` or plain text
- `url`: Request/page URL from `parsed.url`
- `source`: `Server` (when `parsed.onServer === true`) or `Client` (when `parsed.onServer === false`)
- `isBot`: boolean from `parsed.isBot`
- `isChunkError`: boolean from `parsed.isChunkError`
- `isSuppressed`: boolean from `parsed.isSuppressed`
- `stack`: stack trace string from `parsed.stack`
- `userAgent`: user agent string from `parsed.userAgent`
- `build`: build identifier from `parsed.build`

### 2. Filter & Toolbar Controls
An adaptive toolbar above the table provides a unified set of `USelect` dropdowns:
- **Search input (`UInput`)**: Text search querying across message text, URL, status code, error stack, user agent, and log ID, with a clear button.
- **Type filter (`USelect`)**: `Все типы` / `errors` / `infos`.
- **Source filter (`USelect`)**: `Все источники` / `server` / `client`.
- **Bot filter (`USelect`, 3-state)**: `Все субъекты` / `humans` / `bots`.
- **Chunk Error filter (`USelect`, 3-state)**: `Все загрузки` / `успешные` / `chunk errors`.
- **Suppressed filter (`USelect`, 3-state)**: `Все состояния` / `unsuppressed` / `suppressed`.
- **Interdependent Filter Rules**:
  - Selecting any non-`'all'` option in `Source`, `Bot`, `Chunk Error`, or `Suppressed` automatically sets `filterType` to `'error'` and disables `filterType` (`:disabled="hasActiveErrorFilters"`).
  - Selecting `infos` in `filterType` automatically disables the 4 error filters (`:disabled="isErrorFiltersDisabled"`) and resets them to `'all'`.
- **Reset Filters button**: Displayed whenever any filter or search query is active, restoring all filters to default.
- **Action Buttons**:
  - `Refresh`: Reloads logs with loading state.
  - `Clear all`: Prompts for confirmation via `showMessage` dialog, then clears all logs.
- **Counters & Indicators**:
  - Total records count, filtered records count, and current page range indicator.

### 3. Table Presentation (`UTable`)
- Rows are interactive with hover styling and cursor pointer.
- Clicking any row opens the slide-over details panel.
- Optimized for 1024px screens by eliminating non-informative ID and Actions columns and merging statuses and URL into a 2-line Info column.
- Columns (3 total):
  1. **Время (`created`)**: Fixed width (`w-32`), centered, formatted in Russian locale with seconds (`ru-RU`, e.g., `17 сен, 14:32:05`).
  2. **Info (`info`)**: 2-line structure (`w-80`):
     - **Top line**: Statuses and flags:
       - HTTP Status Code badge (`500`, `404`, etc.) with color coding (replaces redundant `'Error'` badge) or `'Info'` badge for non-error records.
       - Environment badge: `Server` (`info` outline) vs `Client` (`neutral` outline) for errors.
       - Subject badge: `bot` (`warning` subtle) vs `human` (`neutral` outline) for errors.
       - `chunkError` badge (`warning` solid with `i-lucide-zap` icon).
       - `Suppressed` badge (`neutral` subtle with `i-lucide-volume-x` icon).
     - **Bottom line**: Clickable URL opening in a new tab (`target="_blank"`), truncated with `@click.stop` to prevent triggering row selection.
  3. **Данные (`summaryText`)**: Full remaining table width, 2-line clamped preview (`line-clamp-2`) of message or formatted text.

### 4. Slide-Over Details Panel (`USlideover`)
Opens from the right side of the screen upon row click or action button click:
- **Header**:
  - Log ID, creation timestamp, and primary badges (`Error`/`Info`, `Server`/`Client`, `Bot`, `Chunk`, `Suppressed`).
  - Close button.
- **Summary Cards / Grid**:
  - HTTP Status Code and Status Message.
  - Full URL with an external link button to open the target route in a new tab.
  - Build identifier (if present).
  - User-Agent string (if present).
- **Stack Trace Block** (for errors):
  - Formatted monospace code block with horizontal scrolling.
  - "Copy Stack" button with clipboard write and `showNotice` confirmation toast.
- **Raw JSON / Text Block**:
  - Formatted JSON representation or raw text payload.
  - "Copy JSON" button with clipboard write and `showNotice` confirmation toast.

### 5. Pagination (`UPagination`)
- Client-side pagination over filtered log items.
- Configurable page size selector (20, 50, 100 rows per page).
- Automatic reset to page 1 upon changing filter criteria or search queries.

## Out of Scope / Exclusions
- Automatic polling / background refresh timer (explicitly excluded by user).
- Log export to CSV/JSON (explicitly excluded by user).
- Single log item deletion API (explicitly excluded by user).
