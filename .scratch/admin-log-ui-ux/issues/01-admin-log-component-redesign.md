Status: resolved
Type: task
Blocked by: none

# 01 - Redesign Admin Log Component UI and UX

## Description

Implement the comprehensive UI/UX overhaul of `app/pages/admin/log.vue` according to `.scratch/admin-log-ui-ux/spec.md`.

## Tasks

- [x] Parse and normalize incoming log records (rich error JSON vs plain text, derive Server/Client source, flags for isBot, isChunkError, isSuppressed).
- [x] Build the adaptive toolbar with search, Type select, Source select, unified 3-state USelect dropdowns (Bot, Chunk Error, Suppressed), filter reset button, and counters.
- [x] Refactor `UTable` into a 3-column compact layout optimized for 1024px screens (Время, 2-line Info with statuses & URL, Данные), dropping ID and Actions columns.
- [x] Enable row click navigation to open the slide-over panel.
- [x] Implement `USlideover` details drawer displaying metadata cards, copyable stack trace block, and formatted raw JSON/text with `showNotice` notifications.
- [x] Add client-side `UPagination` with page size selection (20, 50, 100 items).

## Acceptance Criteria

- [x] Plain text logs and rich error logs render without errors.
- [x] "isBot", "isChunkError", and "isSuppressed" have distinct colored badges and independent toggle filters.
- [x] "onServer" is replaced by "Server" / "Client" color-coded badge and has a filter.
- [x] Target URLs render as clickable external links in the bottom line of the Info column.
- [x] Slide-over panel opens on row click, showing complete details and copy buttons.
- [x] Pagination correctly reflects filtered counts and page size changes.
- [x] Table fits comfortably on 1024px screens without horizontal clutter.

## Answer

Component [app/pages/admin/log.vue](file:///home/v-srv/projects/site/app/pages/admin/log.vue) has been fully redesigned according to the updated specification:
- Normalized both JSON error payloads (`app/error.vue`) and unstructured text strings (`TheHeader.vue`).
- Adaptive toolbar with unified `USelect` dropdowns for all filters (Type, Source, Subject `bot`/`human`, Uploads `chunk errors`, State `suppressed`/`unsuppressed`).
- Mutual disable/lock logic: error filters auto-lock Type to `errors`; selecting `infos` disables error filters.
- 3-column table layout optimized for 1024px:
  1. `Время`: formatted Russian timestamp.
  2. `Info`: 2-line row (top line: HTTP code / Info, Server / Client, bot / human, chunkError, Suppressed; bottom line: clickable URL).
  3. `Данные`: clamped 2-line message / JSON text preview.
- Full row click opens `USlideover` details drawer with structured metadata cards, copyable stack trace, and formatted raw JSON/text.
- Client-side pagination (`UPagination`) with page size choices (20, 50, 100).
