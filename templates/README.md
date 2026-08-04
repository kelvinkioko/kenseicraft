# Reusable app pages

Use `app-page.html` as the starting point for every standalone Kensei Craft app page.

1. Create a folder using the app slug, for example `clean-kit/`.
2. Copy `app-page.html` into that folder as `index.html`.
3. Replace every `{{PLACEHOLDER}}` with the app's real content and asset paths.
4. Set the three app colour variables on `<body>`; the shared Editorial Navy neutrals stay consistent automatically.
5. Keep the six page blocks in the same order: hero, benefits, product tour, optional guides, FAQ, final CTA.
6. Add `SoftwareApplication` structured data and ensure any `FAQPage` answers match visible FAQ content.

Shared presentation lives in `/assets/app-page.css`; shared scrolling and 3D motion lives in `/assets/motion.js`. Changes to those files flow to every app page.
