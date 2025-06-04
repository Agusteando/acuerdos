# Development Notes for Acuerdos SaaS Port

The current Next.js implementation now covers several core features from the original AngularJS SPA. Some functionality is still missing.

## Implemented Features
- Multi-selection of entries with bulk assignment of responsables.
- Creating and deleting "minutas" and adding new agreements.
- Rich text editing for agreements.
- Color coded status badges.

## Remaining Features
- Integrate real PDF generation and email workflow with the backend service.
- Connect the WhatsApp API used by the AngularJS version.
- Fine‑tune visual polish to completely match the old UI.

## Key Files
- `src/app/acuerdos/page.tsx` – main page listing agreements.
- `src/components/EditEntryModal.tsx` – modal for editing a single agreement.
- `src/components/UserSearch.tsx` – search component used in modals.

## Suggested Next Steps
1. Replace the placeholder API routes with calls to the real backend.
2. Ensure WhatsApp messages are sent through the production service.
3. Continue refining styling as needed.

This file should remain in the repository root so future developers know what features still need to be ported.
