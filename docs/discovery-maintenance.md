# App discovery maintenance

All 15 apps listed on the homepage now have product pages and a practical guide. Existing product URLs remain intact. The app catalog is `data/apps.json`; the generator is `scripts/generate-discovery.mjs`.

## Updating content

Update catalog descriptions, feature lists, workflows and verified App Store URLs. For existing pages, update the visible product copy as well so it agrees with the catalog. Existing page layout and FAQ schema remain hand-authored; generated discovery sections are bounded by HTML comments. New product pages, guide pages, directory pages and sitemap are generated files: change their source rather than their output.

Run `npm run build`. This generates the pages, checks JSON-LD, app entity IDs, canonicals, sitemap targets and root-relative discovery links, then packages `dist/client`. The check is structural; it does not establish rich-result eligibility, feature accuracy or search indexing.

New product copy is based on the service descriptions in the existing app terms. Existing app copy is based on their landing pages. These are repository claims, not independent verification of released binaries. Review them against the current release before publishing. No reviews, ratings, prices or new App Store URLs have been invented. Eight new pages and Any Pantry need verified download links; until supplied, they direct users to support for availability. Add a `download` field to the catalog when confirmed. Generated pages display the verified link automatically.

The sitemap is derived from public HTML in the app, directory and guide folders; it omits speculative modification dates. `robots.txt` already allows all user agents and points to the sitemap. Hosting firewall access and actual indexing require live checks after publication. No special AI permission file is required by this implementation.

## Launch checks outside the repository

1. Verify each app's availability, current features, device support and App Store URL. Review guide workflows on the current app release.
2. Publish the built site through its existing hosting workflow. Check canonical-host redirects, public HTTP responses and crawler access at the hosting layer.
3. Verify domain ownership in Google Search Console and Bing Webmaster Tools. Submit `https://www.kenseicraft.com/sitemap.xml`; inspect representative app and guide URLs for indexing. No search-console account changes or submissions were made here.
4. Validate representative application and article markup using Schema.org Validator. Google rich-result eligibility has additional requirements; do not fabricate ratings or prices to satisfy them.
5. In your chosen analytics service, track outbound App Store clicks and referral sources. Compare AI referrals with overall traffic and conversions. No analytics service or tracking identifier was configured in this repository.

## Measure actual AI discovery

For each catalog entry, use three starting prompts:

- “What iPhone app can help me [primary task from the app description]?”
- “How do I [task from the linked guide]?”
- “Compare iPhone apps for [primary task], including limitations.”

Expand to realistic user questions as evidence arrives. Record the date, platform, model if shown, region, search setting, exact prompt, app mentioned, site cited, cited URL and relevant answer excerpt. Use a fresh session and the same test conditions each time. Report mention and citation rates with the tested prompt count; they describe that sample, not every user's experience. Run the baseline after publication and repeat monthly or after meaningful content changes.

Seek authentic independent coverage, demonstrations and user feedback. A technically accessible website and structured data help systems interpret the portfolio, but do not guarantee recommendations.

## References

- Google AI features: https://developers.google.com/search/docs/appearance/ai-features
- Software application schema: https://schema.org/SoftwareApplication
- Google application rich results: https://developers.google.com/search/docs/appearance/structured-data/software-app
