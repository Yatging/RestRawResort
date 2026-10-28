# Rest&Raw Resort

A responsive website for **Rest&Raw Resort**, a fictional high-end island resort world developed as an Unreal Engine 5.7.4 creative project by HUANG Yifei and ZHAO Xuehan.

> This is not a real or bookable hotel. The site states this clearly in the announcement bar, hero context, credits, metadata and footer.

## Local preview

Serve the repository over HTTP (the Journal loads from JSON and will not load correctly from a `file://` URL):

```bash
npx serve .
```

Then open the local URL printed by the command.

## Add a Journal entry

Journal content lives in [`content/news.json`](content/news.json). Add a new object at the start of the array:

```json
{
  "id": "short-unique-id",
  "date": "2026-10-28",
  "dateLabel": "28 October 2026",
  "status": "completed",
  "eyebrow": "Short category",
  "title": "Entry title",
  "summary": "A concise, factual update.",
  "tags": ["Tag one", "Tag two"]
}
```

- Use `completed` or `planned` for `status`.
- If the real date is unknown, set `date` to `null` and use an honest label such as `Date not recorded`.
- Commit and push to `main`; the GitHub Pages workflow deploys the update automatically.

## Visual sources

- `assets/hero-resort.png`: original AI-generated concept visualization created for this site.
- `assets/concept-island.png` and `assets/concept-dining.png`: exports from the team's `Omakase_Store` FigJam board, presented as project concept references rather than real photography or construction documents.
- `assets/rr-mark.svg`: original editable vector monogram created for Rest&Raw Resort.

## Deployment

The workflow in `.github/workflows/pages.yml` deploys the repository root to GitHub Pages and requests first-run Pages enablement. If repository policy blocks automatic enablement, set **Settings → Pages → Build and deployment → Source** to **GitHub Actions**, then re-run the workflow.
