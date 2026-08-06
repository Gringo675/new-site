# AI Category Description Dashboard Implementation Plan

## Goals
Create a UI dashboard in `app/pages/admin/cms/aiCatDescription.vue` that integrates with the Mastra AI workflow via WebSockets to generate and edit category descriptions.

## Todo List

- [ ] **Setup Page & Basic Layout**
    - [ ] Create `app/pages/admin/cms/aiCatDescription.vue`.
    - [ ] Set up the vertical stack layout using Nuxt UI.
    - [ ] Add basic page headers and container styling.

- [ ] **Category Selection Logic**
    - [ ] Integrate `useCats()` composable to fetch categories.
    - [ ] Implement the `mapCats` recursive helper for the `USelectMenu` items.
    - [ ] Implement `USelectMenu` for selecting the active category.

- [ ] **WebSocket Integration**
    - [ ] Implement the WebSocket connection logic to `/api/admin/mastraWsAdapter`.
    - [ ] Create the `startWorkflow` function that sends the `alias` of the selected category.
    - [ ] Handle `onmessage` to parse the AI response and update the page state.
    - [ ] Implement loading and error states (spinner and error alerts).

- [ ] **UI Components Implementation**
    - [ ] **Original Description**: Create a viewer for `originalData.description`.
    - [ ] **Generated Description**: Implement `UTabs` for HTML Preview and Raw Text editing.
    - [ ] **Judge Verdict**: Implement a visual indicator for the `judgeVerdict`.
    - [ ] **Failed Attempts**: Implement `UAccordion` to list previous attempts and critiques.

- [ ] **Actions & Mocking**
    - [ ] Implement the 'Save' button logic (mocked with `showMessage`).
    - [ ] Implement the 'Revision' section with a textarea and a mock 'Return for Revision' button.

- [ ] **Final Polish**
    - [ ] Ensure responsive design.
    - [ ] Verify WebSocket cleanup on component unmount.
    - [ ] Test the full flow from selection to result display.
