# AI Agent Instructions: Building the Singapore Tech News Platform

## 1. Project Mission

As the lead autonomous developer for this project, your mission is to build a fully automated, Singapore-focused AI and technology news website. You are expected to follow the specifications outlined in the accompanying `PRD.md` while adhering to a strict "free-tier" resource constraint. Your work must be modular, well-documented, and ready for deployment with minimal manual configuration.

## 2. Development Roadmap

The development process is divided into four distinct phases, each focusing on a critical component of the platform's infrastructure. You should update the `UPDATE.md` log at the completion of each phase to ensure transparent progress tracking.

| Phase | Focus Area | Key Objectives |
| :--- | :--- | :--- |
| **I** | **Environment & Scaffold** | Initialize the web project using a static site generator (Next.js/Astro) and set up the repository structure. |
| **II** | **Data Pipeline** | Develop Python scripts for RSS aggregation, keyword filtering, and AI-driven summarization, with a focus on real-time processing. |
| **III** | **Frontend Development** | Create a responsive, minimalist dark mode UI that renders news posts from Markdown files, integrates search, and supports newsletter subscriptions. |
| **IV** | **CI/CD & Deployment** | Configure GitHub Actions for automated content updates and deploy the site to a free hosting provider. |

## 3. Implementation Guidelines

### 3.1. Content Automation Strategy

The success of this platform depends on the reliability of its automated pipeline. You must implement robust error handling in your fetching scripts to manage potential feed outages or rate limits. For near real-time updates, explore using webhooks or more frequent GitHub Actions schedules (e.g., every 5-15 minutes) combined with efficient data processing to avoid exceeding free-tier limits. When integrating AI for summarization, prioritize models or APIs that offer generous free tiers. The processed data must be saved as Markdown files with appropriate frontmatter (title, date, tags) to ensure seamless integration with the frontend.

### 3.2. User Interface and Experience

The frontend development requires careful attention to the specified design aesthetic. Implement a minimalist design with a dark mode theme that is visually pleasing and easy on the eyes. For search functionality, integrate a client-side solution like Fuse.js to enable fast and efficient article discovery without requiring a backend search service. For newsletter subscriptions, integrate a free-tier email marketing service such as MailerLite or Beehiiv, ensuring that the subscription form is seamlessly embedded into the website and user data is handled securely.

### 3.3. Hosting and Performance

All architectural decisions must support the goal of hosting the platform for free. This necessitates a static site generation (SSG) approach, where the site is rebuilt only when new content is added. You are responsible for selecting the most appropriate hosting provider (e.g., Vercel or Netlify) and ensuring that the build process is optimized to stay within the provider's free-tier build-minute limits.

## 4. Technical Constraints and Best Practices

| Category | Requirement |
| :--- | :--- |
| **Code Quality** | Use clean, modular code with descriptive variable names and comprehensive comments. |
| **Security** | Never hardcode API keys; use environment variables and GitHub Secrets for all sensitive data. |
| **Responsiveness** | The UI must be fully functional and aesthetically pleasing on all screen sizes (Mobile, Tablet, Desktop). |
| **Automation** | The entire update cycle—from fetching news to live deployment—must be triggered automatically by a schedule or webhook for near real-time updates. |
| **Design** | Implement a minimalist, dark mode, and aesthetically pleasing design. |

## 5. Communication and Reporting

Maintain a proactive communication style. If you encounter technical blockers or require clarification on specific requirements, use the appropriate messaging tools immediately. Your primary record of truth for project status is the `UPDATE.md` file, which must be updated with date-stamped entries for every significant milestone or change in direction.
