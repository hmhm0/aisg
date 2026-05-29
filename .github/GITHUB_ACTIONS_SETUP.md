# GitHub Actions Setup Guide

## Automated News Ingestion Workflow

This guide explains how to set up the automated news ingestion workflow that runs every 6 hours to fetch new articles from RSS feeds.

## What This Workflow Does

The `ingest-news.yml` workflow:
1. **Runs on schedule** - Every 6 hours (0:00, 6:00, 12:00, 18:00 UTC)
2. **Fetches articles** - Pulls from all configured RSS feeds
3. **Creates markdown files** - Converts articles to markdown in `content/posts/`
4. **Commits changes** - Automatically commits new articles to the repository
5. **Triggers deployment** - Your hosting provider (Vercel, Netlify, etc.) automatically deploys when new commits are pushed

## Setup Instructions

### Step 1: Push to GitHub

First, make sure your repository is pushed to GitHub:

```bash
git remote add origin https://github.com/YOUR_USERNAME/aisg.git
git branch -M main
git push -u origin main
```

### Step 2: Add GitHub Secrets

The workflow uses GitHub Secrets to store sensitive environment variables. Add these secrets to your repository:

1. Go to **Settings** → **Secrets and variables** → **Actions**
2. Click **New repository secret** and add each of these:

| Secret Name | Value | Example |
|---|---|---|
| `RSS_FEEDS` | Comma-separated RSS feed URLs | `https://vulcanpost.com/feed/,https://www.hardwarezone.com.sg/feed,https://opengovasia.com/feed/` |
| `NEWS_KEYWORDS` | Comma-separated keywords for filtering | `singapore,ai,startup,fintech,govtech,cybersecurity` |
| `NEWS_API_URL` | NewsAPI endpoint (optional) | `https://newsapi.org/v2/everything` |
| `NEWS_API_KEY` | NewsAPI key (optional) | Your API key from newsapi.org |
| `NEWS_API_QUERY` | NewsAPI search query (optional) | `Singapore AI technology startup` |

**Recommended RSS_FEEDS value:**
```
https://vulcanpost.com/feed/,https://www.dealstreetasia.com/feed/,https://www.hardwarezone.com.sg/feed,https://opengovasia.com/feed/,https://www.straitstimes.com/tech/rss,https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=rss,https://news.microsoft.com/source/asia/region/singapore/feed/
```

**Recommended NEWS_KEYWORDS value:**
```
singapore,sg,s'pore,ai,artificial intelligence,tech,technology,startup,fintech,policy,governance,chip,semiconductor,cloud,robotics,cybersecurity,govtech,smart nation,machine learning,blockchain,web3,healthtech,edtech,automation,digital transformation,innovation,venture,enterprise,developer,sme,public sector,imda,govinsider
```

### Step 3: Enable Workflow

1. Go to **Actions** tab in your GitHub repository
2. You should see "Ingest News Articles" workflow
3. Click on it and verify it's enabled
4. You can manually trigger it by clicking **Run workflow** → **Run workflow**

### Step 4: Configure Hosting Provider

Your hosting provider (Vercel, Netlify, etc.) should automatically deploy when new commits are pushed. Verify:

- **Vercel**: Go to Project Settings → Git → Automatic deployments should be enabled
- **Netlify**: Go to Site settings → Build & deploy → Deploy contexts should include main branch
- **Other providers**: Check their documentation for automatic deployment on git push

## Schedule

The workflow runs automatically at:
- **00:00 UTC** (8:00 AM Singapore time)
- **06:00 UTC** (2:00 PM Singapore time)
- **12:00 UTC** (8:00 PM Singapore time)
- **18:00 UTC** (2:00 AM Singapore time next day)

To change the schedule, edit `.github/workflows/ingest-news.yml` and modify the `cron` expression:

```yaml
- cron: '0 0,6,12,18 * * *'  # Current: every 6 hours
- cron: '0 */4 * * *'         # Alternative: every 4 hours
- cron: '0 0 * * *'           # Alternative: once daily at midnight UTC
```

[Cron syntax reference](https://crontab.guru/)

## Manual Trigger

You can manually trigger the workflow anytime:

1. Go to **Actions** tab
2. Click **Ingest News Articles**
3. Click **Run workflow** → **Run workflow**

Or use GitHub CLI:
```bash
gh workflow run ingest-news.yml
```

## Monitoring

### View Workflow Runs

1. Go to **Actions** tab
2. Click **Ingest News Articles**
3. See all past runs with status (✅ success, ❌ failed)

### Check Logs

Click on any workflow run to see detailed logs:
- Which feeds were processed
- How many articles were created
- Any errors or warnings

### Verify Articles Were Added

After a workflow run completes:
1. Go to **Code** tab
2. Navigate to `content/posts/`
3. Check the commit history to see newly added articles

## Troubleshooting

### Workflow Not Running

**Problem**: Scheduled workflow hasn't run yet
- **Solution**: GitHub Actions may take up to 10 minutes to start scheduled workflows. Wait and check back.

### Workflow Failed

**Problem**: Workflow shows ❌ failed status
- **Solution**: Click the failed run to see logs. Common issues:
  - RSS feed is down or returning 503 error
  - Network timeout (feeds taking too long to respond)
  - Invalid environment variables

### No New Articles

**Problem**: Workflow ran but no new articles were created
- **Solution**: 
  - Check if RSS feeds have new content
  - Verify NEWS_KEYWORDS are filtering correctly
  - Run manually with `gh workflow run ingest-news.yml` to test

### Articles Not Deploying

**Problem**: Articles are committed but site isn't updating
- **Solution**:
  - Check your hosting provider's deployment logs
  - Verify automatic deployments are enabled
  - Try manually triggering a deployment in your hosting provider's dashboard

## Environment Variables Reference

### RSS_FEEDS
Comma-separated list of RSS feed URLs to ingest from.

**Current sources:**
- Vulcan Post (Singapore startup news)
- DealStreetAsia (Singapore startup funding)
- HardwareZone (Asia Pacific tech)
- OpenGov Asia (Government tech)
- Straits Times Tech (Singapore news)
- Channel NewsAsia (Singapore news)
- Microsoft Singapore (Corporate tech)

### NEWS_KEYWORDS
Comma-separated keywords used to filter articles for Singapore tech relevance.

**Categories included:**
- Location: singapore, sg, s'pore
- AI/ML: ai, artificial intelligence, machine learning, ml
- Business: startup, fintech, venture, enterprise
- Tech: cloud, cybersecurity, blockchain, web3
- Government: govtech, policy, governance, smart nation
- Sectors: healthtech, edtech, mobility, e-commerce

### NEWS_API_URL & NEWS_API_KEY
Optional NewsAPI integration for additional article sources.

Get a free API key at [newsapi.org](https://newsapi.org)

## Next Steps

1. ✅ Push repository to GitHub
2. ✅ Add GitHub Secrets
3. ✅ Enable workflow
4. ✅ Configure hosting provider
5. ✅ Monitor first few runs
6. ✅ Adjust schedule/keywords as needed

## Support

For issues or questions:
- Check GitHub Actions logs for error messages
- Review RSS feed status (some feeds may be temporarily down)
- Verify environment variables are set correctly
- Test locally with `npm run ingest`
