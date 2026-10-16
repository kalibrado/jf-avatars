# Issue #43 diagnostic build

Temporary branch: debug/issue-43. The main branch is unchanged.

In the existing JavaScript Injector entry, replace BOTH CONFIG.primary and
CONFIG.fallback with:

https://raw.githubusercontent.com/kalibrado/jf-avatars/debug/issue-43/main.js

Do not add a second injector entry. Save, fully restart Jellyfin Desktop and open
the user profile / avatar picker. A yellow-bordered diagnostic panel must appear.
Open a category, wait 15 seconds and capture the panel. If needed select/copy its
text; hide/show collapses it so you can test avatar selection.

The report includes browser capabilities, JSON HTTP results and counts, cache
usage, grid errors, and image request outcomes. Counts cover this page session
and only requests started by the grid; a timeout means no image event after
15 seconds, not a confirmed network rejection. The existing metadata cache is
preserved and explicitly reported. No telemetry or account credentials are read
by the diagnostic module. URL queries and fragments are omitted.

This build deliberately retains replaceChildren to diagnose the original failure.
An image error alone does not establish CORS as the cause.

After testing restore the original primary and fallback URLs from README.md,
then fully restart the client.

Build: npm ci && npm run build
The root main.js is a copy of dist/main.js, committed for direct injection.
Automated simulation: install jsdom without saving it, then node tests/issue-43.cjs.
This does not replace a real Jellyfin Desktop v1.12.0 Windows test.
