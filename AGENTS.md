# Development Notes for Acuerdos SaaS Port

The current Next.js implementation now covers several core features from the original AngularJS SPA. Some functionality is still missing.

## Implemented Features
- Multi-selection of entries with bulk assignment of responsables.
- Creating and deleting "minutas" and adding new agreements.
- Rich text editing for agreements.
- Color coded status badges.

## Remaining Features
- Bulk actions for generating PDFs and sending emails.
- WhatsApp integration for sending messages.
- Generating PDFs per responsable and emailing them.
- Toolbar for bulk operations with progress bars per entry.
- Enhanced status dropdown with colored options.
- Ability to rename existing minutas.
- Additional visual polish to match the AngularJS UI.

## Key Files
- `src/app/acuerdos/page.tsx` – main page listing agreements.
- `src/components/EditEntryModal.tsx` – modal for editing a single agreement.
- `src/components/UserSearch.tsx` – search component used in modals.

## Suggested Next Steps
1. Implement PDF generation endpoints and email workflow for selected entries.
2. Integrate WhatsApp message sending using the API from the AngularJS version.
3. Add progress indicators and enhance the bulk action toolbar.
4. Allow renaming existing minutas and other group management features.
5. Polish UI elements (progress bars, responsible chips, etc.) to match the original design.

This file should remain in the repository root so future developers know what features still need to be ported.
