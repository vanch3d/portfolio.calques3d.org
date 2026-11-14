# Writing a case study: format guide for designers and writers

A case study is one long-form story about a piece of work, shown at `/case-studies/<project>/<slug>`. The system builds the page from one Markdown file and its images. You never touch the layout: you write the file in the format below, and the title block, numbered sections, margin figures, draft mark and listing entry all follow from it.

## 1. Where files go

```
src/content/case-studies/
  <project>--<name>/            the folder name is only a label; the URL comes from the frontmatter
    index.mdx                   the case (required, exactly this name, .mdx)
public/images/case-studies/
  <project>--<name>/            local images, same folder name
```

Use the folder name `<project-slug>--<short-name>` (for example `hivemq-edge--mapping-editor`). A folder without an `index.mdx` is ignored by the site.

## 2. The frontmatter

The block at the top of `index.mdx`, between two `---` lines. Every field is checked by `pnpm validate:content`.

| Field      | Required | What to put                                                                                                                                             |
| ---------- | -------- | ------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `slug`     | yes      | Short, lowercase, hyphenated. Second part of the URL (`mapping-editor`). Do not repeat the project.                                                     |
| `project`  | yes      | The **slug** of an existing project (`hivemq-edge`, `calques3d`), not its display name. Look in `src/content/engineering/` and `src/content/research/`. |
| `title`    | yes      | The headline. Sentence case, a full claim ("A mapping editor that shows its working").                                                                  |
| `summary`  | no       | One sentence for the listing pages. Reuse the lead sentence. Without it the listing shows none.                                                         |
| `status`   | yes      | `draft` shows a Draft tag on the page and the listing. `published` removes it.                                                                          |
| `featured` | yes      | `true` puts the case on the home page. Use sparingly.                                                                                                   |
| `order`    | no       | A whole number: its position within its era group on `/case-studies` (ascending, lower first). Without it the case sorts last.                          |
| `tags`     | yes      | A list of short labels, capitalised like a sentence (`'Design engineering'`, `'React'`). Shown as tags under the lead.                                  |

Quote any value that contains a colon or an apostrophe.

```yaml
---
slug: mapping-editor
project: hivemq-edge
title: 'A mapping editor that shows its working'
summary: 'I replaced a generated form with a two-panel editor...'
status: draft
featured: false
order: 6
tags:
  - 'Design engineering'
  - 'React'
---
```

## 3. The body

```markdown
# Same text as the title

One lead paragraph: the whole case in two sentences.

## The problem and the people

Paragraph. Paragraph.

![Alt text](images/file.png 'Caption shown under the figure')

## What I built, and how

...
```

- **`# Title`**: write it (it keeps the file readable), but it is not shown: the page draws its own title block.
- **The lead**: the first paragraph before any heading. It is shown larger, under the title. Write it without a `Lead:` prefix.
- **`##` headings** become numbered sections (1, 2, 3...). Use at most one level below them (`###`, numbered 1.1, 1.2). Do not skip levels.
- **Length**: a flat case is a page of roughly 350 to 550 words in four blocks (the problem and the people, what I built, what changed once people used it, how I work). Longer stories become chaptered cases (section 6).
- **Emphasis**: do not use italics for emphasis; the design reserves them for display text. Use plain sentences, or bold, sparingly.
- **Blockquotes** render upright. Use them for a quote from a person, not for emphasis.

## 4. Images

An image sits **alone on its own line, directly after the paragraph it illustrates**. The page puts it in the margin beside that paragraph on wide screens and inline on small ones, and numbers it ("Fig. 1") by position.

```markdown
![Alt text](images/file.png 'Caption')
```

- **Alt text** (the square brackets) describes the image for someone who cannot see it. Required.
- **Caption** (the quoted text) is what a sighted reader sees under the figure, and it should say what to look at. Do not use double quotes inside it.
- **Do not** put an image in the middle of a sentence: it will not render.
- **Do not** write "(image 1)" in the text or add an "Images" list at the end: the position of the image is the reference.

Where the file lives decides how the path is written, but you always write `images/<filename>`:

1. **Piwigo gallery** (the main image store): name the file with its Piwigo id first, `28-20140421113730-fb3528ad.png`. The id (the digits before the first hyphen) is looked up at build time and gives the real URL, size and, if you wrote no caption, Piwigo's own comment. The file does not need to exist in the repository.
2. **Local file**: put it in `public/images/case-studies/<folder>/` and reference it by file name. The file name **must not start with digits followed by a hyphen**, or it is taken for a Piwigo id. Use a name like `pr549-img-1.png`.

Screenshots should be at least 800px wide and show one idea each: the figure is small beside the text, so crop to what matters.

## 5. Placeholders for what you do not have yet

Two markers let a case be published in stages. Both are blockquotes whose first words are the marker.

```markdown
> [!NOTE] Screenshot of the dispersion plot, key words only.
```

Draws an empty "Plate pending" frame in the margin. The text after the marker is a note to yourself and is **never shown**.

```markdown
> [!TODO] Add what the first users said.
```

Draws a visible "work in progress" block with that text. Use it only on drafts.

## 6. Chaptered cases

When one case needs several chapters (each with its own page), `index.mdx` lists them in the frontmatter and each chapter is its own file in the same folder.

```yaml
intro: Portfolio_00_Thesis # optional, shown above the chapter list
outro: Portfolio_07_Closing # optional, shown below it
chapters:
  - file: Portfolio_01_ProblemClass # file name without .md / .mdx
    slug: problem-class # last part of the chapter's URL
    title: The Problem Class
    teaser: One sentence for the chapter list. # optional
```

- The body of `index.mdx` is then the reading guide (the short note beside the intro). Leave it empty if there is nothing to say; do not repeat the intro.
- Every chapter file starts with `# Chapter title`, then `###` subsections (they are numbered 3.1, 3.2, per chapter and shown as sections).
- Every file named in the frontmatter must exist and chapter slugs must be unique; the validator checks both.

## 7. Check it before you hand it over

1. `pnpm validate:content` must say "All content files valid". It checks the frontmatter, the chapter files, and that every local image exists.
2. Run the site (`pnpm dev`) and open `/case-studies/<project>/<slug>`. Look for: the title and tags, one numbered section per `##`, every figure with its caption, and no grey "Image unavailable" frame (that means a file name or Piwigo id is wrong).
3. Open `/case-studies`: your case appears in its era group, in the right place, with its summary and the Draft tag.

## 8. Common mistakes

| Symptom                                    | Cause                                                                                                                                            |
| ------------------------------------------ | ------------------------------------------------------------------------------------------------------------------------------------------------ |
| The page is 404                            | The folder has no `index.mdx`, or `project` is not a real project slug.                                                                          |
| The validator fails on `project` or `slug` | Spaces, capitals or underscores: use lowercase with hyphens.                                                                                     |
| "Image unavailable" frame                  | Wrong Piwigo id, or a local file missing from `public/images/case-studies/<folder>/`, or a local file name that starts with digits and a hyphen. |
| An image is missing from the page          | It was written inside a paragraph instead of on its own line.                                                                                    |
| A grey "Draft" tag you do not want         | Set `status: published`.                                                                                                                         |
| The case shows last in its group           | Add `order`.                                                                                                                                     |
| A note you wrote is visible                | Only `[!NOTE]` text is hidden. `[!TODO]` text is shown by design.                                                                                |

## 9. What the system decides for you

You do not choose: the headline scale, the numbering, where figures sit, the figure frame, the colours, the tag style, the breadcrumb, or the previous and next links in a chaptered case. If something looks wrong, change the content, not the design: and if the content cannot say what you need, raise it as an issue under `.docs/issues/`.
