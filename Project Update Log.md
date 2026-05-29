# Project Update Log

This document tracks the progress and key updates for the Singapore AI & Tech News Platform project.

## 2026-05-29 (Vercel Deployment Complete)

*   **Site Deployed to Vercel**: The site is now live and accessible via Vercel's hosting platform
*   **Environment Variables Configured**: Added 4 environment variables in Vercel:
    - `RSS_FEEDS` (8 sources including Vulcan Post, HardwareZone, OpenGov Asia, CNA, Microsoft Singapore, Mothership.sg, and Straits Times via Google News)
    - `NEWS_KEYWORDS` (40+ Singapore tech and AI relevance keywords)
    - `NEWS_API_URL` (NewsAPI endpoint for fallback)
    - `NEWS_API_QUERY` (Singapore-focused search query)
*   **Auto-Deploy Pipeline Active**: Complete automation chain now in place:
    - GitHub Actions runs every 2 hours
    - New articles committed to GitHub repository
    - Vercel detects the push and automatically rebuilds
    - Live site updates with fresh content
*   **No Manual Intervention Required**: Once running, the site grows automatically with fresh Singapore tech and AI news
*   **Note**: A `npx plugins add vercel/vercel-plugin` command was run but did not affect the project (Vercel handles Next.js natively without plugins)

## 2026-05-29 (GitHub Repository & Git Setup Complete)

*   **Git Repository Initialized**: Project converted to a git repository with all 187 files committed
*   **Initial Commit Created**: All project files, workflows, and documentation committed with message "Initial commit: Singapore AI & Tech News Platform"
*   **Git Configured**: User email (haomingx3@gmail.com) and name (hmhm0) configured for commits
*   **Branch Renamed**: Master branch renamed to `main` for GitHub compatibility
*   **Code Pushed to GitHub**: All commits successfully pushed to https://github.com/hmhm0/aisg
*   **GitHub Actions Workflow Ready**: `.github/workflows/ingest-news.yml` is now available in the repository
*   **Setup Documentation Created**: Added `GITHUB_SETUP_COMPLETE.md` with step-by-step instructions for:
    - Adding 5 GitHub Secrets (RSS_FEEDS, NEWS_KEYWORDS, NEWS_API_URL, NEWS_API_KEY, NEWS_API_QUERY)
    - Enabling GitHub Actions workflow
    - Testing the workflow manually
    - Verifying articles are being ingested
*   **Next Steps**: User needs to add GitHub Secrets and enable the workflow to start automated ingestion

## 2026-05-29 (Card Tag Positioning Fix - Revised)

*   **Issue Identified**: Some latest news cards had awkward spacing above tags while others had tags properly at the bottom
*   **Root Cause**: The `<Link>` element inside the card wasn't stretching to full height (`h-full`), so the card's fixed height (`h-[294px]`) wasn't being properly utilized by the content
*   **Solution Applied**: 
    - Added `h-full` to the Link element so it fills the entire card height
    - Added `h-full flex-col` to featured card wrapper to ensure proper height distribution
    - Content now properly fills the card's fixed height, allowing `justify-between` to work correctly
    - Tags now always stay at the bottom regardless of content length
*   **Result**: All cards now have consistent tag positioning at the bottom, eliminating awkward spacing
*   **Build Verified**: Changes compile successfully

## 2026-05-29 (GitHub Actions Automated News Ingestion)

*   **Workflow Created**: Added `.github/workflows/ingest-news.yml` that automatically runs the news ingestion script on a schedule
*   **Schedule**: Workflow runs every 6 hours (0:00, 6:00, 12:00, 18:00 UTC) to fetch new articles from RSS feeds
*   **Automatic Commits**: When new articles are found, they're automatically committed to the repository with message "chore: ingest new articles from RSS feeds [skip ci]"
*   **Automatic Deployment**: Commits trigger automatic deployments on Vercel, Netlify, or other hosting providers
*   **Manual Trigger**: Workflow can also be manually triggered from GitHub Actions UI or CLI anytime
*   **Environment Variables**: Workflow uses GitHub Secrets to securely store RSS_FEEDS, NEWS_KEYWORDS, and optional NEWS_API credentials
*   **Setup Guide**: Created `.github/GITHUB_ACTIONS_SETUP.md` with comprehensive instructions for:
    - Adding GitHub Secrets
    - Configuring hosting provider
    - Monitoring workflow runs
    - Troubleshooting common issues
*   **Logging & Monitoring**: Workflow includes detailed logging to track which feeds were processed and how many articles were created
*   **Error Handling**: Workflow gracefully handles feed failures (e.g., 503 errors) and continues processing other feeds

## 2026-05-29 (Expanded Singapore Tech & AI News Sources)

*   **New RSS Feeds Added**: Expanded the source mix to include 7 major Singapore-focused tech and AI news sources:
    - **HardwareZone** (`https://www.hardwarezone.com.sg/feed`) - Leading Asia Pacific tech portal with gadgets, reviews, and tech news
    - **OpenGov Asia** (`https://opengovasia.com/feed/`) - Government technology, digital transformation, and public sector innovation
    - **Straits Times Tech** (`https://www.straitstimes.com/tech/rss`) - Singapore's largest newspaper tech section
    - **Channel NewsAsia** (`https://www.channelnewsasia.com/api/v1/rss-outbound-feed`) - Major Singapore news outlet with tech coverage
    - **Microsoft Singapore** (`https://news.microsoft.com/source/asia/region/singapore/feed/`) - Microsoft announcements and initiatives in Singapore
*   **Existing Sources Retained**: Vulcan Post and DealStreetAsia remain as primary sources for startup and tech ecosystem coverage
*   **Enhanced Keyword Filtering**: Expanded NEWS_KEYWORDS to include additional domain-specific terms: machine learning, blockchain, web3, healthtech, edtech, automation, digital transformation, imda, govinsider
*   **Ingest Script Executed**: Ran `npm run ingest` to fetch articles from RSS feeds, successfully creating 13 new markdown files from available sources
*   **Coverage Improvement**: The expanded source mix now covers:
    - Government tech initiatives and policy (IMDA, GovTech, CSA)
    - Startup ecosystem and funding (DealStreetAsia, Vulcan Post)
    - Consumer tech and gadgets (HardwareZone)
    - Mainstream tech news (Straits Times, CNA)
    - Enterprise and corporate tech (Microsoft, OpenGov Asia)
*   **Homepage Description Updated**: Changed from "Daily curated coverage..." to "Breaking news and in-depth analysis on Singapore's technology sector..." for better SEO and professional news site tone
*   **Meta Description Updated**: Updated layout.tsx meta description to match the new professional, news-focused tone
*   **Footer Updated**: Changed "Categories" to "Tags" in the footer for consistency with the tag-based browsing system
*   **Note on Article Growth**: Articles will continue to grow as the ingest script is run regularly. Currently on hold pending GitHub Actions automation setup. Manual ingestion can be triggered with `npm run ingest`

## 2026-05-29 (Tag Extraction & Keyword Enhancement)

*   **Smart Tag Derivation Added**: The system now automatically extracts domain-specific keywords from article titles and content, not just relying on frontmatter tags.
*   **Expanded Keyword Dictionary**: Added 35+ tech-related keywords including GovTech, cybersecurity, fintech, healthtech, edtech, blockchain, web3, cloud, IoT, robotics, automation, machine learning, smart nation, digital transformation, and more.
*   **Intelligent Extraction Logic**: Keywords are extracted from both article titles and body content (first 500 chars for efficiency) using case-insensitive matching.
*   **Preserved Existing Tags**: Original frontmatter tags are kept and supplemented with newly derived tags, ensuring no loss of manual curation.
*   **Better Discoverability**: Articles now surface with richer tag sets, improving browsing and search capabilities across the platform.
*   **Build Verified**: All changes compile successfully.

## 2026-05-29 (SEO & Metadata Optimization)

*   **Homepage Title & Description Updated**: Changed to "Singapore AI & Tech News | Latest Coverage of AI, Startups & GovTech" with a description emphasizing curated daily coverage of policy, innovation, and digital transformation.
*   **All Page Metadata Enhanced**: Updated titles and descriptions across Newsletter, Search, Archive, About, and Contact pages to be more SEO-friendly and keyword-rich.
*   **Newsletter Page Improved**: Enhanced descriptions to highlight "daily newsletter," "curated," and specific topics (AI, startup, GovTech).
*   **About & Contact Pages Added Metadata**: Both pages now have proper meta tags for search engine indexing.
*   **Keyword Optimization**: All descriptions now include relevant keywords: Singapore, AI, tech, startup, GovTech, policy, digital transformation, innovation.
*   **Build Verified**: All changes compile successfully.

## 2026-05-29 (Latest Stories Layout Refinement)

*   **Page Size Reduced**: Latest Stories now displays 5 rows per page instead of 6, pushing additional stories to the next page for a cleaner, more focused view.
*   **Card Size Reduced by 20%**: Non-featured story cards are now 20% smaller with reduced image height (h-26 sm:h-28), padding (p-3.2 sm:p-4), and title size (text-lg), creating a more compact grid.
*   **Newsletter Rail Enhanced**: The right-rail newsletter section now has a smaller "Newsletter" heading and a descriptive line: "Get the latest news and updates delivered to your inbox." for better context.
*   **Build Verified**: All changes compile successfully.

## 2026-05-29 (Engagement Persistence Hardening)

*   **Durable Store Abstraction Added**: Engagement events are no longer tied to the local filesystem. A new `engagement-store.ts` module abstracts the storage backend so the site can run on serverless platforms without losing ranking data.
*   **Upstash Redis Backend**: When `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, engagement events are stored in an Upstash Redis sorted set. This is durable, serverless-safe, and has a generous free tier.
*   **Local NDJSON Fallback Preserved**: When no Redis credentials are configured (local development), the system falls back to the existing `data/engagement-events.ndjson` file so the dev experience is unchanged.
*   **Efficient Range Queries**: The Redis backend uses sorted set scores (unix timestamps) for efficient time-windowed reads — only events within the relevant window are fetched instead of scanning the full history.
*   **Opportunistic Pruning**: The engagement API route now prunes events older than 14 days roughly every 100 requests, keeping the store lean without a separate cron job.
*   **No Public UI Changes**: The homepage ranking logic, article tracking, and all reader-facing surfaces remain identical. This is a backend-only persistence upgrade.
*   **Build Verified**: The production build passes after the store refactor.

## Handoff Context for the Next Agent

This project is a Singapore-focused AI and technology news site built in `Next.js`. The current direction is a light, calm editorial experience inspired by Chronicle: off-white background, serif-led headlines, restrained borders, and a cleaner newspaper-style reading flow.

What is already done:

*   The homepage, article pages, archive, related stories, newsletter, and search/archive surfaces have all been restyled into the lighter editorial theme.
*   The site uses clickable cards instead of separate "Read Story" buttons, and developer-facing labels were removed from the public UI.
*   The ingest pipeline pulls from RSS and page-based sources, with News API fallback available when configured.
*   The source mix currently includes Singapore-relevant sources such as CNA Singapore, GovTech TechNews, GovInsider, STOMP, and earlier feed-based sources.
*   The ingest logic filters aggressively for Singapore + tech relevance, and obvious off-topic lifestyle/beauty stories have been removed from the current content set.
*   Story images are now sourced more aggressively from article metadata, srcset/lazy-load attributes, and the article body before falling back. Images are persisted locally when possible; if a source image cannot be saved, the pipeline now prefers the remote image URL and only falls back to the clean, paper-toned placeholder as a last resort.
*   Article summaries are generated from source text with a reader-first tone:
    *   `In brief -` prefers source-derived sentences and short contextual bullets.
    *   `Why it matters:` is concise, warmer, and editorial.
    *   The old `Story focus:` label has been removed.
*   The homepage now separates `Today's top read` (view-weighted), `Latest stories` (chronological pagination), and `Popular Articles` (trend-weighted), and article pages record one engagement event per session through a lightweight engagement store that supports both local disk (dev) and Upstash Redis (production/serverless).
*   Engagement persistence is now serverless-safe: when `UPSTASH_REDIS_REST_URL` and `UPSTASH_REDIS_REST_TOKEN` are set, events go to Redis; otherwise the local NDJSON file is used as a development fallback.
*   Homepage tag pills now filter the front page directly, while archive, search, footer, and article navigation all continue to lead to real pages.
*   The current production build passes after the ranking refactor.
*   Timestamp handling is fixed so date-only source items do not show fake local times.
*   `Project Update Log.md` is the official continuity log and should be kept updated whenever meaningful product decisions change.

What is intentionally on hold:

*   A real AI summarizer step. This has been documented as a future upgrade, but it is intentionally on hold until the current ingest/filtering pipeline remains stable.
*   Scheduled automation / GitHub Actions ingestion orchestration. That remains on hold by request.

What the next agent should understand:

*   Keep the site reader-first. Do not reintroduce developer/dashboard labels into the frontend.
*   Preserve the light editorial direction unless the user explicitly asks for a different visual language.
*   If summaries or source filtering regress, fix the ingest pipeline first rather than compensating only in the UI.
*   If new sources are added, verify they are actually Singapore-relevant and tech-relevant. Off-topic stories should be filtered out aggressively.
*   The current codebase already has a working baseline build. Treat new work as refinement unless the user asks for a larger restructure.

## 2026-05-29 (Image Sourcing Hardening)

*   **Image Candidate Search Expanded**: The ingest script now checks more aggressively for article artwork by scanning og/twitter/meta fields, JSON-LD image fields, `srcset` and lazy-load attributes, body images, and inline background-image styles.
*   **Logo and Placeholder Assets Skipped**: Generic site logos, icons, and other obvious non-story images are filtered out so article body artwork can win when the page advertises the wrong default image.
*   **Download Fallback Improved**: When the image fetch succeeds, the asset is persisted locally; when it does not, the pipeline now prefers the remote image URL before giving up to the placeholder.
*   **Placeholder Posts Regenerated**: The previously placeholder-heavy GovTech TechNews stories were re-ingested and now resolve to real image assets instead of blank-looking tiles.
*   **Build Re-Verified**: The refreshed content and image changes were verified with a successful production build.

## 2026-05-29 (Homepage Chrome Cleanup)

*   **Helper Copy Removed**: The homepage no longer shows the grey helper labels under the lead story, latest stories, or newsletter cards.
*   **Sticky Nav Refined**: The top navigation bar was restyled into a more premium editorial card with softer gradients, stronger depth, and lighter button treatment.
*   **Newsletter Card Simplified**: The newsletter block is now cleaner and more minimal, with the extra coming-soon footnote removed.

## 2026-05-29 (Route Completion Pass)

*   **Search Route Added**: The header search icon now opens a real `/search` page with a furnished archive search layout instead of jumping to a page anchor.
*   **Archive Route Added**: Added a dedicated `/archive` page with tag filters, pagination, and story cards so browse controls now lead to a proper archive view.
*   **Newsletter Route Added**: Added a dedicated `/newsletter` page and a `/newsletter/thanks` confirmation page so newsletter signups now resolve to real pages.
*   **Button-to-Route Cleanup**: Tag chips, footer category pills, footer quick links, and the newsletter submit flow were converted to route-based navigation instead of dead-end local controls.
*   **Build Re-Verified**: The expanded route set compiled successfully after the navigation refactor.

## 2026-05-28 (Final Polish)

*   **Timestamp Display Polished**: Exact source times are still shown when available, but date-only stories no longer display a fake placeholder time.
*   **Summary Text Smoothed**: The story generation flow now removes awkward trailing punctuation so the reader-facing `Why it matters` copy reads more cleanly.
*   **Summary Wording Improved**: The article summary generator now rewrites filler-heavy source phrasing into shorter reader-first copy for both `In brief` and `Why it matters`.
*   **Tone Polished Further**: The summary generator is now tuned for a concise newsroom-style lead and a warmer, more editorial `Why it matters` line.
*   **Off-Topic Cleanup**: Strengthened the relevance blacklist so obvious lifestyle and beauty stories are filtered out, and removed the stale Pink Parlour markdown post.
*   **AI Summarizer Upgrade On Hold**: A future enhancement will add a real AI summarizer step to produce richer, more nuanced article summaries from source text and metadata, but it is intentionally on hold until the current ingest and filtering pipeline is stable.
*   **Newsroom Bullet Refinement**: `In brief` now prefers full source sentences and a short contextual line instead of falling back to a clipped title fragment.

## 2026-05-29 (Editorial Redesign)

*   **Chronicle Direction Chosen**: The visual direction is now a light, calm editorial layout inspired by Chronicle, with less visual weight and more paper-like spacing.
*   **Palette Shifted**: The interface is moving from a dark shell to an off-white newsroom palette with restrained stone, slate, and soft accent tones.
*   **Homepage Grid Reworked**: The homepage now uses a Chronicle-style editorial arrangement with a lead story, supporting story cards, and a right rail for widgets and recent reads.

## 2026-05-29 (Magazine-Style Front Page Pass)

*   **Homepage Reframed**: The front page was reworked again to feel closer to a live magazine template, with less intro copy and a stronger card-led composition.
*   **Card Visuals Improved**: Story cards now keep a more consistent visual block, including image fallbacks, so posts without source artwork still hold their space cleanly.
*   **Rail Widgets Tightened**: The right rail now behaves more like a magazine sidebar, with compact recent reads, topic chips, and newsletter placement arranged around the main stories.
*   **Build Verified**: The updated homepage and card refactor were verified with a successful production build.

## 2026-05-29 (Navigation and Image Sourcing Pass)

*   **Top Navigation Added**: Introduced a sticky editorial navigation strip across the site so readers can jump between top stories, archive, topics, and newsletter sections.
*   **Homepage Asymmetry Improved**: The home page now uses a more magazine-like asymmetrical layout with a dominant lead story, a spotlight block, a stacked story column, and a tighter sidebar rail.
*   **Image Discovery Expanded**: The ingest pipeline now searches more flexibly for article images by checking common metadata first and then falling back to the first meaningful image found in the article HTML.
*   **Placeholder Fallback Preserved**: When no usable image can be sourced, the UI still shows the clean paper-toned placeholder instead of a broken or empty media area.
*   **Ingest Rerun Completed**: The content files were regenerated after the image sourcing update so the new extraction logic could repopulate story artwork where available.

## 2026-05-29 (Homepage Pagination and Section Clarity)

*   **Latest Stories Section Added**: The lower three cards on the homepage are now explicitly grouped under a `Latest Stories` heading with a visible separator so the page reads in clearer editorial blocks.
*   **Popular Articles Renamed**: The right rail label now uses `Popular Articles` instead of the earlier desk-style wording.
*   **Archive Removed From Front Page**: The homepage no longer relies on the archive browser block; instead it uses page-number navigation at the bottom of the latest stories section, closer to the live demo pattern.
*   **Card Spacing Tightened**: Non-featured story cards were shortened so empty image fallbacks do not create oversized blank blocks in the grid.
*   **Pagination Verified**: The homepage now responds to page numbers with server-side story slicing and was verified with a successful production build.

## 2026-05-29 (Live-Demo Layout Pass)

*   **Hero First**: The homepage now follows the live demo structure more closely by placing the hero card first, followed by a sticky nav bar beneath it.
*   **Lead Story Expanded**: The lead story now occupies a single large editorial block, matching the emphasis seen in the reference layout.
*   **Latest News Rebuilt**: The next section is now a two-column news grid with a right-hand rail for tags, popular articles, and newsletter placement.
*   **Page Navigation Added**: Page-number controls now sit at the bottom of the latest news grid instead of an archive block.
*   **Footer Added**: Added a multi-column footer with categories, quick links, and subscribe content separated by a divider to mirror the live demo feel.
*   **About and Contact Pages Added**: Created real `/about` and `/contact` pages so the navigation and footer links have destination pages.
*   **Sticky App Bar Kept**: The top app bar remains visible during scrolling, and the secondary nav bar now sits below the hero while staying usable as the user scrolls.
*   **Responsive Rail Fixed**: The latest-news sidebar now stays beside the two-column news grid at laptop-width screens instead of dropping below the cards too early.
*   **Footer Columns Fixed**: The footer now switches into columns earlier so it does not collapse into a long vertical stack on normal desktop and laptop widths.

## 2026-05-29 (Breakpoint Correction Pass)

*   **Latest News Grid Shifted Earlier**: The latest-news story grid now switches to two columns at `md` widths instead of waiting for a larger desktop breakpoint, so the front page reads like a two-column magazine grid sooner.
*   **Sidebar Rail Brought Forward**: The right-hand `Tags`, `Popular Articles`, and `Newsletter` rail now sits beside the latest-news grid at `md` widths, reducing the chance that it drops below pagination on medium desktop windows.
*   **Footer Column Layout Tightened**: The footer grid now uses an earlier responsive column pattern and wider spacing so it reads as a real multi-column footer instead of a stacked vertical block.

## 2026-05-29 (Canvas Width and Rail Fit Pass)

*   **Homepage Canvas Widened**: The main homepage container was expanded to a wider editorial canvas so the latest-news grid and right rail have more breathing room, closer to the live Chronicle-style reference.
*   **Right Rail Narrowed**: The sidebar rail width was reduced so `Tags`, `Popular Articles`, and `Newsletter` are more likely to remain beside the two-column latest-news grid instead of dropping below it.
*   **Footer Spread Increased**: The footer container now uses the same wider canvas and a four-column desktop template at `md` widths so it reads more like the live demo and less like a compressed two-column block.

## 2026-05-29 (Sidebar Simplification Pass)

*   **Tags Card Simplified**: The sidebar tag card now uses a single reader-facing heading, `Browse by tags`, and the extra grey helper copy was removed.
*   **Popular Articles Tightened**: The popular-articles rail cards were made noticeably more compact so the sidebar feels lighter and less tall.
*   **Newsletter CTA Stacked**: The newsletter forms on the homepage and in the footer now place the subscribe button below the email field for a cleaner vertical flow.

## 2026-05-29 (Interactive Tag Filter Pass)

*   **Tag Pills Made Interactive**: The homepage tag pills are now real buttons that update the URL and refresh the page state instead of acting as static labels.
*   **Tag-Driven Sorting Added**: Clicking a tag now filters the homepage stories to that tag and preserves the selection through page-number navigation.
*   **Popular Articles Reworked**: The right-rail popular list is now much more compact, using a Chronicle-style row treatment instead of larger boxed mini-cards.

## 2026-05-29 (Popular Articles Image Pass)

*   **Sidebar Image Bias Added**: The popular-articles rail now prefers stories with usable images first so the list feels more visual and closer to the Chronicle reference.
*   **Popular Row Tightened Again**: The popular story rows now remove date text entirely and use a smaller headline style to better match the compact reference treatment.

## 2026-05-29 (Popular Articles Typography Pass)

*   **Sidebar Typeface Adjusted**: The popular-articles titles now use body-style text instead of inheriting the large serif heading treatment, which should make the rail read more like the Chronicle demo.
*   **Image Rows Enlarged Slightly**: The thumbnail tiles in Popular Articles were nudged larger so the rail has more visible image presence on smaller screens.

## 2026-05-29 (Popular Articles Placeholder Pass)

*   **Visible Placeholder Added**: Added a dedicated placeholder image asset so stories without a real thumbnail no longer render as blank-looking tiles.
*   **Image Fallback Hardened**: The ingest pipeline now writes a placeholder image path when no usable thumbnail can be found, and the UI fallback also renders that same placeholder asset.
*   **Real Images Still Preferred**: Sidebar ordering still prefers stories with real images first, then falls back to placeholder-backed stories last.

## 2026-05-28 (Implementation Kickoff)

*   **Repo Scaffolded**: Began the actual application build by creating a Next.js App Router project structure in the repo root while preserving the existing documentation files.
*   **Architecture Direction Locked**: Confirmed the stack as `Next.js`, with an ingestion strategy of `RSS + News API fallback`, and kept `Project Update Log.md` as the official record of truth.
*   **Newsletter Positioning Updated**: Chose `beehiiv` as the best placeholder recommendation for a small free-tier launch. The site now exposes a placeholder newsletter form and notes the provider recommendation in the UI.
*   **Content Foundation Added**: Added Markdown-based sample content plus a file-backed content loader so the homepage can render news cards, tags, and counts immediately.
*   **UI Foundation Added**: Added a dark, minimalist homepage, client-side search, and the layout/styling scaffolding needed for the rest of the platform.
*   **Next Steps**: Install dependencies, run the app, verify the build, then add RSS ingestion and News API fallback scripts plus scheduled automation.

## 2026-05-28 (Scope Adjustment)

*   **Homepage Refinement In Progress**: Advancing the archive browsing experience with tag filters and pagination, plus additional premium editorial polish.
*   **Story Page Refinement In Progress**: Expanding article detail pages with stronger reading layout, metadata, and related-story navigation.
*   **Automation Hold**: Scheduled GitHub Actions automation for ingestion remains intentionally not completed for now and is on hold by request.
*   **Current Focus**: Completing the front-end polish pass before returning to scheduling and deployment automation.

## 2026-05-28 (Editorial Cleanup)

*   **Hero Simplified**: Removed the remaining count/stat cards from the homepage hero so the top of the page reads like a real front page instead of a dashboard.
*   **Archive Simplified**: Kept the archive text-only with title, original timestamp, and tags only.
*   **Image Policy Clarified**: Story images only appear when the source provides usable artwork or image metadata. Some stories have images because the source exposes them; others do not.

## 2026-05-28 (Relevance Cleanup)

*   **Non-Tech Posts Removed**: Deleted placeholder and off-topic markdown files that were still surfacing broad Singapore news instead of Singapore tech news.
*   **Ingestion Filter Tightened**: Hardened the RSS and News API relevance gate so Singapore stories now need a real tech signal instead of only a location signal.
*   **Tagging Expanded**: Broadened derived tags to surface more useful topic labels such as enterprise, infrastructure, GovTech, cybersecurity, and developers.
*   **False Positives Eliminated**: Switched the relevance checks to whole-word matching so short keywords like `ai` no longer match inside unrelated words such as `SIA`.
*   **Feed Rebuild Verified**: After the cleanup pass, the archive rebuilt down to a single tech-relevant story: the Meta layoff story tied to Singapore staff.

## 2026-05-28 (Source Expansion)

*   **New Source Added**: Added the Straits Times Singapore RSS feed to the ingestion defaults alongside Vulcan Post.
*   **Image Scraping Improved**: Expanded article image extraction to look for more metadata fields from the source article page, then persist the image locally when available.

## 2026-05-28 (Multi-Source Expansion)

*   **Additional Singapore Sources Added**: Wired in CNA Singapore listings, GovTech TechNews pages, STOMP sitemap pages, and DealStreetAsia RSS as extra ingestion sources.
*   **Tech in Asia Checked**: Attempted to use Tech in Asia as a source, but the site returned 403 responses in this environment, so it is not wired yet.
*   **Tagging Improved**: Expanded tag derivation to better surface topic labels like Smart Nation, GovTech, Infrastructure, Mobility, E-commerce, Sustainability, EdTech, HealthTech, and Connectivity.
*   **Summary Format Improved**: Story bodies now generate a more readable “In brief” section with bullet points and a short “Why it matters” section for readers.

## 2026-05-28 (Tagging Refinement)

*   **Title-Derived Tags Added**: The ingestion pipeline now extracts additional tags from headline phrases so long-form explainer titles can surface more precise reader-facing labels.
*   **Usable Singapore Source Notes**: `govinsider.asia` responds in this environment, while `e27.co` and `techinasia.com` are currently blocked by anti-bot responses.

## 2026-05-28 (UI Interaction Cleanup)

*   **Sidebar Cards Made Clickable**: The right-side story list on the homepage now links through to article pages instead of acting like static text.
*   **Summary Formatting Tweaked**: Story pages now render summary bullets in a lighter, more readable style and keep `Why it matters:` as a visible label inside the summary content.

## 2026-05-28 (Timestamp Cleanup)

*   **Source Date Fallback Added**: When a source page does not expose a precise publish timestamp, the ingestion pipeline now uses the source’s own visible last-updated date instead of the local desktop clock.
*   **Date-Only Display**: `formatPublishedAt` now shows date-only entries cleanly when the source cannot provide an exact time, avoiding fake local-time stamps.

## 2026-05-28 (Source and Tag Upgrade)

*   **GovInsider Added**: Included GovInsider as an additional Singapore-focused source for public-sector digital transformation coverage.
*   **Title Tags Smarter**: Refined title-derived tagging so the pipeline favors cleaner phrase tags rather than short chopped fragments.

## 2026-05-28

*   **PRD.md Drafted**: The initial draft of the Product Requirements Document (PRD.md) has been completed, outlining the project vision, goals, target audience, key features, and proposed technical stack. This document will serve as the foundational guide for the project.
*   **Initial Research Completed**: Preliminary research into free-tier hosting options (e.g., Vercel, Netlify, GitHub Pages) and potential news sources/APIs (e.g., Vulcan Post RSS, NewsData.io, NewsAPI.ai) has been conducted to inform the PRD.md.
*   **Next Steps**: Proceeding with the creation of `AGENT_INSTRUCTIONS.md` to guide the AI agent in building the website based on the drafted PRD.

## 2026-05-28 (Revision 1)

*   **PRD.md Updated**: The PRD.md has been revised to incorporate new user requirements, including:
    *   **Real-time Updates**: The automation pipeline will now aim for near real-time content updates.
    *   **Newsletter Subscription**: Integration of a free-tier email marketing service (e.g., MailerLite, Beehiiv) for user subscriptions.
    *   **Search Functionality**: Implementation of client-side search (e.g., Fuse.js) for article discovery.
    *   **Design Style**: Specification for a minimalist, dark mode, and aesthetically pleasing user interface.
*   **AGENT_INSTRUCTIONS.md Updated**: The AGENT_INSTRUCTIONS.md has been updated to provide specific technical guidance for implementing real-time updates, newsletter integration, search functionality, and the desired UI design.
*   **Research on Integrations**: Research was conducted on free-tier options for real-time automation triggers (e.g., webhooks with GitHub Actions), newsletter services (MailerLite, Beehiiv), and client-side search libraries (Fuse.js).
*   **Next Steps**: Deliver all three updated documents to the user for review.

## 2026-05-29 (Audience Ranking Pass)

*   **Top Read Now Audience-Driven**: The homepage hero is no longer just the first chronological story. It now uses a lightweight on-disk engagement log so `Today's top read` can surface the story readers are actually opening.
*   **Latest Stories Kept Chronological**: The `Latest stories` block now paginates the newest posts separately from the hero, so the front page can keep a real newsroom rhythm instead of mixing ranking and recency into one list.
*   **Popular Rail Made Trend-Based**: The right-rail `Popular Articles` list now uses a separate trend score instead of only picking whatever happens to be left over after the latest grid.
*   **Article View Tracking Added**: Article pages now ping a dedicated `/api/engagement` route once per session per story, which is enough for a small launch without adding external analytics yet.
*   **Homepage Tags Fixed**: The homepage tag pills now filter the front page directly instead of sending readers to archive first, which matches the intended browsing flow.
*   **Build Verified**: The production build passes after the ranking and engagement wiring.
