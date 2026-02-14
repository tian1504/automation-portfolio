

# Add Description Panel to Dome Gallery Enlarged View

## What This Does
When you click a workflow image in the dome, instead of just seeing the enlarged picture with a title, a details panel will appear alongside the image showing:
- The workflow title
- A category badge (Data / Communication / Automation)
- A description of what the workflow does
- Key tools/technologies used

## How It Works

### 1. Add Descriptions to Workflow Data (Portfolio.tsx)
Each workflow image in `WORKFLOW_IMAGES` will get a new `description` and `tools` field:

```text
Example:
{
  src: workflowApollo,
  alt: 'Apollo Lead Scraper & Icebreakers',
  category: 'data',
  description: 'Automatically scrapes leads from Apollo.io, enriches contact data, and generates personalized icebreaker messages using AI.',
  tools: ['n8n', 'Apollo.io', 'OpenAI']
}
```

### 2. Update DomeGallery to Support Descriptions

**Data flow changes:**
- Extend the `GalleryImage` type to include `description?: string` and `tools?: string[]`
- Store the full image data (not just the title) when a tile is clicked
- Pass the description data into the `.viewer-meta` element when opening

**Enlarged view layout change:**
- When an image is opened, the `.viewer-meta` panel will render to the right of the image (desktop) or below (mobile)
- The panel will have a glassmorphic dark background with the category color accent
- Content: title, category badge, description text, and tool tags

### 3. Styling (DomeGallery.css)

The `.viewer-meta` will be styled as a side panel:
- Positioned to the right of the enlarged image
- Semi-transparent dark background with subtle border
- Category-colored accent line on the left edge
- Responsive: stacks below the image on smaller screens
- Animates in with a slight delay after the image opens

### Technical Details

**Files to modify:**
1. **`src/components/Portfolio.tsx`** -- Add `description` and `tools` fields to each item in `WORKFLOW_IMAGES`
2. **`src/components/DomeGallery.tsx`** -- Update `GalleryImage` type, pass description data through `buildItems`, and populate `.viewer-meta` with rich HTML (title, description, tools) instead of just the title
3. **`src/components/DomeGallery.css`** -- Style the `.viewer-meta` as a side panel with glassmorphic appearance, category accent colors, and responsive layout

**Key implementation notes:**
- The `.viewer-meta` element already exists in the DOM (line 749). We will populate it with richer content on open and clear it on close (already handled).
- The enlarged image + description panel will be laid out using flexbox on the `.viewer` or by absolutely positioning the meta panel relative to the enlarged overlay.
- The `data-src` attribute on each tile's parent already stores the image source; we will also store the description and tools as data attributes so the open function can read them.

