# GitHub Setup - Next Steps

✅ **Code Successfully Pushed to GitHub!**

Your repository is now at: https://github.com/hmhm0/aisg

## Step 1: Add GitHub Secrets

Go to your repository and add these 4 secrets:

**URL**: https://github.com/hmhm0/aisg/settings/secrets/actions

### Secret 1: RSS_FEEDS
```
https://vulcanpost.com/feed/,https://www.dealstreetasia.com/feed/,https://www.hardwarezone.com.sg/feed,https://opengovasia.com/feed/,https://www.straitstimes.com/tech/rss,https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=rss,https://news.microsoft.com/source/asia/region/singapore/feed/
```

### Secret 2: NEWS_KEYWORDS
```
singapore,sg,s'pore,ai,artificial intelligence,tech,technology,startup,fintech,policy,governance,chip,semiconductor,cloud,robotics,cybersecurity,govtech,smart nation,machine learning,blockchain,web3,healthtech,edtech,automation,digital transformation,innovation,venture,enterprise,developer,sme,public sector,imda,govinsider
```

### Secret 3: NEWS_API_URL
```
https://newsapi.org/v2/everything
```

### Secret 4: NEWS_API_QUERY
```
Singapore AI technology startup fintech govtech cybersecurity
```

**Note**: `NEWS_API_KEY` is optional. Skip it unless you have a NewsAPI key. The 7 RSS feeds are sufficient for content.

## How to Add Secrets

1. Go to: https://github.com/hmhm0/aisg/settings/secrets/actions
2. Click **New repository secret**
3. Enter the name (e.g., `RSS_FEEDS`)
4. Paste the value
5. Click **Add secret**
6. Repeat for all 5 secrets

## Step 2: Enable GitHub Actions

1. Go to: https://github.com/hmhm0/aisg/actions
2. Click **Ingest News Articles** workflow
3. Verify it's enabled (should show green checkmark)

## Step 3: Test the Workflow

1. Go to: https://github.com/hmhm0/aisg/actions
2. Click **Ingest News Articles**
3. Click **Run workflow** button
4. Select **Run workflow**
5. Wait 2-5 minutes for it to complete

## Step 4: Verify

After the workflow completes:
1. Go to: https://github.com/hmhm0/aisg/code
2. Navigate to `content/posts/`
3. You should see new article files with recent timestamps

## Automatic Schedule

Once set up, the workflow will automatically run every 6 hours:
- 00:00 UTC (8:00 AM Singapore time)
- 06:00 UTC (2:00 PM Singapore time)
- 12:00 UTC (8:00 PM Singapore time)
- 18:00 UTC (2:00 AM Singapore time next day)

Your site will automatically grow with fresh articles!

## Need Help?

See `.github/QUICK_START.md` or `.github/GITHUB_ACTIONS_SETUP.md` for detailed instructions.
