

Pasted text.txt
Document
using this skills from https://github.com/WorldFlowAI/everything-claude-code.git 


try to understand this idea and how best to go about it for free:

How I would build your Reels app for free
After looking at your pasted idea and the Everything Claude Code repository, I think the smartest approach is to build a Reels-style app that attracts attention through a vertical video feed, without needing to own, film, or host a library of videos at the beginning.

The important part is to combine three things:

An open-source app that gives you the Reels/TikTok-style interface.

Free or permission-based video sources so you can launch without producing content yourself.

A free development and backend setup so you can build and test the idea before spending money.

You can get quite far with this approach. The key is to avoid building an expensive video infrastructure before you know whether people actually want to use the app.

1. First, understand what Everything Claude Code does
Claude Code使いが全員知るべき「everything-claude-code」28個の専門サブエージェント搭載 | AIFCC
Everything Claude Code

Open-source developer toolkit

It provides coding agents, reusable skills, development rules, hooks, testing workflows and commands. These help an AI coding assistant plan, implement, test and review your application. It is not itself a Reels app or a video backend. 

GitHub

Open the GitHub repository

Think of it as the development team you configure to help build your product.

Component

Its job in your project

Planner and architect agents

Design the app and break it into manageable features

Frontend and backend skills

Guide the implementation of the feed, database and APIs

TDD workflow

Write and run tests as features are developed

Code and security reviewers

Find bugs, insecure database rules and other problems

Verification workflows

Check that the app actually builds and works

The toolkit can be used without buying a video service, but it doesn't make AI coding or cloud hosting automatically free. Your costs depend on the coding assistant, API usage and deployment choices.

My recommendation: use the toolkit to build a small, working first version instead of asking an AI to generate an entire TikTok clone in one go.

2. The free technology stack I recommend
I would start with a mobile-first web app (PWA). It can look and behave like a mobile app, run in a phone browser, and be added to a home screen without requiring you to publish to an app store immediately.

React Logo, Interactive, JavaScript, Web Development, Library PNG
Frontend — React + Vite

Build the vertical swipe feed, video player, profiles, likes and navigation.

Vite · React

Free
Supabase SVG Icon - Free Supabase PNG & SVG Download
Backend — Supabase

User accounts, profiles, follows, likes, comments, saved videos and feed metadata.

Free plan and limits

Free tier
Download Free GitHub Logo PNG and SVG Icons
Source control — GitHub

Store the code, manage changes and keep a backup of your project.

GitHub

Free tier
Why Cloudflare’s Outage Should Terrify AI-First Startups | by Abhinav | Medium
Video storage later — Cloudflare R2

An option for storing your own or creator-authorized videos when you need it. Its free allowance includes 10 GB-month of standard storage and no internet egress charges, subject to request limits and terms.

R2 pricing

Optional
Supabase's current free tier includes a 500 MB database, 1 GB file storage, 50,000 monthly active users and limited bandwidth. Free projects can pause after a week of inactivity, so it is suitable for an MVP but not an unlimited production service. 

Supabase
+2

The money-saving decision: do not store video files in Supabase. Store only video metadata and permitted playback references there. For your initial prototype, use a few sample clips and authorized external playback sources.

3. How to get the videos without owning a video library
There is an important difference between making an app with videos and building a service that republishes other people's videos. I would use one of these approaches:

Comment devenir créateur de contenu au Togo (et en Afrique) | Blog  THESYMO - Support You More Online
Option A — Creator-submitted videos (best for a real social network)

Let users or invited creators upload videos they own or have permission to distribute. Start with a small group of contributors, or even a single administrator adding approved clips.

Best long-term choice
YouTube Shorts anuncia fundo de R$ 530 milhões aos criadores - POPLine
Option B — Official embeds (best for testing a curated feed)

Store links to videos and display them through the source platform's permitted player or embedding interface. Check each platform's terms, branding and playback restrictions before implementing a full-screen feed.

No video hosting of your own, but not every platform permits an unrestricted Reels-style viewing experience.

410 Best BEAUTIFUL Nature scenes ideas | beautiful nature, nature, scenery
Option C — Licensed stock footage (use selectively)

Stock footage can help populate demos, explainers or original edited content. However, don't assume a free stock API permits building an entire competing video-discovery service from its library. Pexels' current terms explicitly restrict using its content to replicate a competing service. 

Pexels
+1

Use stock content only within the relevant license and API terms.

My preference would be to combine creator submissions with a manually curated launch feed. That gives you control over quality, keeps your initial infrastructure simple, and builds a path towards owning your own creator community.

4. How I would use the open-source code and skills together
Rather than starting from a huge, outdated TikTok clone, I would build on a clean React starter and borrow only the components you actually need. You can still inspect the clone repositories mentioned in your notes, but check their current dependencies, license, maintenance and whether they really include a working backend.

Useful starting points:

JavaScript Tutorial – How to Set Up a Front End Development Project
1. Vite

A lightweight foundation for your own web app. Build the swipe feed yourself so you control the design, playback and content sources.

Complete Guide to Next.js and Express Video Streaming using HSTS (with code example) 🚀 | by Paudelronish | Medium
2. Video.js

An open-source video player that can help with playback controls and supported video formats. It is a player, not a complete social network.

Supabase + NextJS - Authentication & CRUD API
3. Supabase

Use its hosted free tier initially, or explore self-hosting later if you have the technical skills and server resources. Self-hosting is not automatically cost-free.

X
4. Everything Claude Code

Use its planning, testing, code review, security and verification workflows while building the actual app.

The development workflow
If you're using Claude Code, the repository documents installation as a plugin. In a Claude Code session, the documented commands are:

/plugin marketplace add WorldFlowAI/everything-claude-code
/plugin install everything-claude-code@everything-claude-code
Check the repository's current README if the installation command or marketplace name has changed. These are commands for the Claude Code interface, not ordinary terminal commands. 

GitHub
+1

Then work through this sequence:

Plan: Ask the planner to define the smallest useful version of the app and its database schema.

Build the interface: Implement the vertical feed, video autoplay, pause-on-scroll, categories and navigation with sample data.

Connect the backend: Add authentication, profiles, likes, follows and bookmarks using Supabase.

Add real content: Start with approved video URLs and creator-submitted clips. Implement uploads only after playback and feed behavior work.

Test and review: Use the testing, code-review, security-review and verification workflows before deploying.

Do not enable every agent, hook and MCP server just because the repository includes them. Start with the skills that support your immediate task; unnecessary integrations add complexity.

5. What the first version should actually contain
I would call this version an MVP — a minimum viable product. It should be usable, not just a mockup.

Reel detail — Appetite UI by Bohuslav Poláček on Dribbble
The main feed

Full-screen vertical clips, swipe or scroll to the next video, autoplay for the active clip, and like, comment, share and bookmark actions.

TikTok Clone App Template in React Native - Short Video Creating App Template in React Native by RenderCodeTechnology
Discover

Categories, search and a curated selection of videos. Start with simple chronological or category-based ranking instead of an expensive recommendation algorithm.

Skylight Profile
Profiles and engagement

User profiles, follows, likes, saved videos and comments, with authentication and database permissions.

I would leave live streaming, direct messaging, AI video generation, advanced recommendations and monetization for later. Each adds development work, infrastructure or moderation requirements before you've validated the core idea.

6. A practical zero-budget build plan
Launch checklist
0 of 5


1. Set up the project

Install Git and Node.js, create a GitHub repository, and start a React + Vite project.


2. Build the feed

Create the vertical feed using a few permitted sample videos and local mock data. Test it on your phone.


3. Add Supabase

Create the database tables, authentication, row-level security policies and user interactions.


4. Add real content

Create an admin-curated seed feed, then let approved creators submit their own clips.


5. Deploy and test

Use a free web-hosting tier, test on mobile networks, and monitor usage limits.

For a free deployment, you can investigate Cloudflare Pages or Vercel. Check their current usage limits and terms before choosing one. Your initial costs can be zero if you use free tiers, an existing computer and free development tools, but a custom domain, sustained traffic, video delivery and AI API calls may eventually cost money.

7. The first prompt I would give the coding agent
Start with the following prompt in your coding environment after setting up the project and the relevant skills.

PROJECT BRIEF — COPY AND USE

Act as a senior full-stack engineer. Use the planning, frontend, backend, testing, code-review, security-review and verification practices available in the installed Everything Claude Code toolkit.

PROJECT:
Build a mobile-first, Reels-style web application with a vertical video feed. The initial goal is to launch a working MVP with zero infrastructure spending.

TECH STACK:
- React + Vite + TypeScript
- Responsive mobile-first UI, installable as a PWA
- Supabase for authentication, PostgreSQL data and user interactions
- HTML5 video playback for supported, authorized video URLs
- Free-tier hosting for the initial deployment

CORE FEATURES:
1. Full-screen vertical feed with autoplay and pause when a video leaves the viewport.
2. Like, comment, bookmark, follow and share actions.
3. User profiles and category-based discovery.
4. A database-driven feed with video title, creator, caption, thumbnail, category and playback reference.
5. An admin-curated initial feed.
6. A future-compatible upload architecture for creator-owned or creator-authorized videos.

CONSTRAINTS:
- Do not scrape or re-upload copyrighted social media videos.
- Do not assume external video platforms permit arbitrary embedding.
- Do not use stock-media APIs as a bulk source for a competing video library without explicit permission.
- Do not store video binaries in the main database.
- Do not expose server secrets in frontend code.
- Implement and test database access policies.
- Avoid paid services, paid APIs and unnecessary dependencies.
- Never claim a feature works without running appropriate checks.

WORKFLOW:
1. Inspect the repository and relevant installed skills.
2. Produce an implementation plan, architecture and database schema before coding.
3. Identify risks and free-tier limits.
4. Implement the feed using local mock data first.
5. Add tests and verify playback, scrolling and mobile responsiveness.
6. Integrate Supabase only after the basic feed works.
7. Run code review, security review and build verification.
8. Document setup instructions, environment variables and deployment steps.

Start by producing the plan and identifying any decisions that need my approval. Do not build the entire application in one unreviewed step.

My final recommendation
Build a web-first, creator-curated Reels app with React, Supabase and Everything Claude Code. Get the feed working before worrying about uploads, large-scale video hosting or recommendation algorithms.

One decision will materially change the architecture, though:

What kind of Reels app do you actually want to build?

1. What is the main idea?


A general TikTok-style social network

A niche video app (e.g. Afrobeats, comedy, education, local content)

A feed that collects videos from existing platforms
2. Where should it run first?


Web app / installable PWA — simplest to launch free

Android app

Web and Android
3. How will videos enter the app?


I or an admin will curate videos initially

Users and creators will upload videos

Videos will come from permitted external embeds or feeds

A combination of these

Create richer images from your files
Upgrade to transform your uploaded files and images with more precision, consistency, and detail using increased reasoning.



