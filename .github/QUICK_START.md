# GitHub Actions Setup - Quick Start

## 5-Minute Setup

### 1. Push to GitHub
```bash
git remote add origin https://github.com/YOUR_USERNAME/aisg.git
git branch -M main
git push -u origin main
```

### 2. Add GitHub Secrets
Go to **Settings** → **Secrets and variables** → **Actions** → **New repository secret**

Add these 4 secrets:

**RSS_FEEDS**
```
https://vulcanpost.com/feed/,https://www.dealstreetasia.com/feed/,https://www.hardwarezone.com.sg/feed,https://opengovasia.com/feed/,https://www.straitstimes.com/tech/rss,https://www.channelnewsasia.com/api/v1/rss-outbound-feed?_format=rss,https://news.microsoft.com/source/asia/region/singapore/feed/
```

**NEWS_KEYWORDS**
```
singapore,sg,s'pore,ai,artificial intelligence,tech,technology,startup,fintech,policy,governance,chip,semiconductor,cloud,robotics,cybersecurity,govtech,smart nation,machine learning,blockchain,web3,healthtech,edtech,automation,digital transformation,innovation,venture,enterprise,developer,sme,public sector,imda,govinsider
```

**NEWS_API_URL** (optional)
```
https://newsapi.org/v2/everything
```

**NEWS_API_QUERY** (optional)
```
Singapore AI technology startup fintech govtech cybersecurity
```

**Note**: Skip `NEWS_API_KEY` - it's optional and only needed if you have a NewsAPI key. The 7 RSS feeds are sufficient.

### 3. Enable Workflow
- Go to **Actions** tab
- Click **Ingest News Articles**
- Verify it's enabled

### 4. Test It
- Click **Run workflow** → **Run workflow**
- Wait 2-5 minutes
- Check **Actions** tab for ✅ success

### 5. Verify Articles
- Go to **Code** tab
- Navigate to `content/posts/`
- See newly added articles

## Done! 🎉

Your site will now automatically:
- ✅ Fetch new articles every 6 hours
- ✅ Commit them to GitHub
- ✅ Deploy automatically to your hosting provider

## What Happens Next

**Every 6 hours:**
1. GitHub Actions runs the ingest script
2. Fetches articles from 7 RSS feeds
3. Filters for Singapore tech relevance
4. Creates markdown files
5. Commits to repository
6. Hosting provider deploys automatically

**Your site grows automatically** with fresh content!

## Monitoring

Check **Actions** tab to see:
- ✅ Successful runs (green checkmark)
- ❌ Failed runs (red X)
- 📊 How many articles were added
- 🕐 When the next run is scheduled

## Manual Trigger Anytime

Go to **Actions** → **Ingest News Articles** → **Run workflow**

## Need Help?

See `.github/GITHUB_ACTIONS_SETUP.md` for detailed troubleshooting and configuration options.
