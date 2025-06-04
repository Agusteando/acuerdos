# Development Notes for Acuerdos SaaS Port

The current Next.js implementation only provides partial functionality from the original AngularJS SPA. Important features are still missing.

## Missing Features
- Multi-selection of entries and bulk actions (assign responsables, generate PDFs, send emails).
- Creating, deleting and managing "minutas" (groups) including adding new agreements.
- Rich text editing tools for adding/editing agreements.
- Status dropdown with color badges instead of simple `<select>`.
- WhatsApp integration for sending messages.
- Generating PDFs per responsable and emailing them.
- Toolbar for bulk operations with progress bars per entry.
- Visual elements matching the AngularJS UI (progress bars, color badges, etc.).

## Key Files
- `src/app/acuerdos/page.tsx` – main page listing agreements.
- `src/components/EditEntryModal.tsx` – modal for editing a single agreement.
- `src/components/UserSearch.tsx` – search component used in modals.

## Suggested Next Steps
1. Implement creation and deletion of minutas with a modal form similar to the AngularJS version.
2. Add the multi-select UI for entries using a library like `react-selectable` or custom logic.
3. Port the bulk assign responsables workflow (`BulkAssignModal` in the AngularJS code).
4. Implement PDF generation endpoint calls and email option.
5. Add WhatsApp message sending UI based on the API used in the AngularJS version.
6. Enhance the edit modal with rich-text controls and status dropdown badges.
7. Create toolbar for bulk actions that appears when items are selected.
8. Add ability to add new entries to existing minutas and delete entries/groups.
9. Ensure progress bars, status colors and responsible chips match the original UI.

This file should remain in the repository root so future developers know what features still need to be ported.
