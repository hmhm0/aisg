# GitHub Configuration

This directory contains GitHub-specific configuration files for the Singapore AI & Tech News Platform.

## Contents

### `workflows/ingest-news.yml`
Automated GitHub Actions workflow that:
- Runs every 6 hours to fetch new articles from RSS feeds
- Automatically commits new articles to the repository
- Triggers deployment on your hosting provider

**Status**: ✅ Ready to use (requires GitHub Secrets setup)

## Setup Files

### `QUICK_START.md` ⭐ START HERE
5-minute quick start guide to get automated ingestion running.

### `GITHUB_ACTIONS_SETUP.md`
Comprehensive setup guide with:
- Step-by-step instructions
- Environment variable reference
- Troubleshooting guide
- Schedule customization

## How It Works

```
Every 6 hours
    ↓
GitHub Actions triggers
    ↓
Runs: npm run ingest
    ↓
Fetches from 7 RSS feeds
    ↓
Creates markdown files
    ↓
Commits to repository
    ↓
Hosting provider deploys
    ↓
Site updates with new articles
```

## Quick Links

- **Setup**: See `QUICK_START.md`
- **Detailed Help**: See `GITHUB_ACTIONS_SETUP.md`
- **Workflow File**: `workflows/ingest-news.yml`

## Next Steps

1. Read `QUICK_START.md`
2. Push repository to GitHub
3. Add GitHub Secrets
4. Enable workflow
5. Monitor first run

That's it! Your site will automatically grow with fresh content every 6 hours.
