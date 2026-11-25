
what apps hold the most attention

Short-form video, social media, and streaming apps hold the most daily attention, led by TikTok, YouTube, and Instagram.

High-Attention Apps

• Short-form & video: TikTok and YouTube consistently capture the longest daily viewing sessions.
• Social & messaging: Instagram, Facebook, Snapchat, and WhatsApp keep users checking back frequently throughout the day.
• Streaming & audio: Netflix and Spotify hold sustained attention during longer leisure blocks.
• AI & casual games: ChatGPT and games like Block Blast have surged in downloads and regular engagement.
For broader industry breakdowns, see Business of Apps and Techpoint Africa. If you want to curb screen time, Zapier covers apps built to block distractions.
Are you looking for global screen-time data, regional trends (such as in Nigeria), or ways to reduce screen time on specific apps?
+1
• 
Business of Apps
Most Popular Apps (2026) - Business of Apps
March 24, 2026 — Most Popular Apps: ChatGPT (770m downloads in 2025 globally, top app on iOS, Google Play, US, UK, Germany, France, Italy, Spain, C...
• 
Instagram·Data Of Statistics
Top 15 Most Addictive Apps Ranked 📱 1. TikTok
23 Jun 2026
0:05
Show all
        
       
so how can i make a reels app without having the videos?


Which response is better?

Your feedback helps make AI Mode better for everyone, including you.

Response A

You can build a reels-style app without filming or storing your own video library by aggregating external video feeds, pulling stock/AI clips via APIs, or letting users supply the content (either through user uploads or non-video "reels" like swipeable cards, audio clips, or text/image stories).

1. Embed or Pull From Existing Video Platforms

Instead of hosting videos yourself, you build a vertical swipe feed around existing platforms or public APIs:
• YouTube Data API & Embeds: Fetch Shorts or vertical videos via API or embed them in a vertical container. Watch out for platform branding/player rules, API quota limits, and terms of service around modifying playback interfaces.
• Stock Video APIs: Services like Pixabay (and stock libraries such as Pexels, though check current API key availability and attribution/licensing rules before building) let you fetch clips programmatically. Stock clips work best as background visuals paired with your own text, quizzes, news snippets, or commentary rather than raw entertainment.

2. Generate Clips on Demand With AI

If you don't have footage, generative video and voice APIs can create short vertical clips from prompts, articles, or scripts. This works well for niche feeds (facts, history, finance tips, storytelling), though generation costs add up as usage grows and you need moderation and quality checks.

3. Let Users Be the Content Source

• User-Generated Uploads + Video Infrastructure APIs: You don't need a library on day one if users upload their own clips. Video APIs like Mux, api.video, or FastPix handle uploads, transcoding, adaptive streaming, and vertical playback so you don't have to manage raw video infrastructure yourself.
• Reels Mechanics Without Video: The "reels" experience—full-screen, vertical, fast-paced, swipe-to-next—can run on image/text carousels, micro-podcasts/audio snippets, interactive flashcards, or product/event cards. This avoids heavy video bandwidth while keeping the addictive swipe loop.

Key Trade-Offs to Plan Early

• Rights & Terms: Never scrape or hotlink copyrighted videos without permission; follow API attribution, embedding, and licensing terms.
• Bandwidth & Data Costs: Video consumes significant mobile data and streaming bandwidth, which matters especially for users on metered connections.
• Retention Loop: A swipe UI alone isn't enough—you need a clear niche, fresh items coming in regularly, and a reason for users to scroll past the third item.
Are you building a coded app (mobile or web) or a no-code prototype, and what niche or content format (e.g., news, comedy, education, local discovery) are you aiming for?

Response B

You can build a Reels-style app without creating your own videos by using public video APIs, embedding social feeds, or curating user-generated content (UGC) into a vertical, swipeable interface.
Here is the clearest way to launch one without filming a single clip:

1. Pull Content via APIs (Fastest MVP)

Instead of hosting video files on your own servers, stream them directly from platforms that offer developer APIs or stock libraries.
• Stock Video APIs: Use free APIs like the Pexels API or Pixabay API to pull thousands of vertical, royalty-free HD videos filtered by topic (e.g., nature, tech, fitness).
• YouTube Data API: Use the YouTube Data API to search and embed YouTube Shorts into a custom vertical feed. (Note: You must use YouTube’s official embedded player to follow their Terms of Service).

2. Aggregate & Embed Social Posts

Build a niche curation app—like "Best Afrobeats Dance Clips" or "Daily Tech Tips"—by letting users or admins paste links from TikTok, Instagram, or X.
• Your backend saves the URL and renders the official oEmbed player inside a full-screen vertical swipe container (like Swiper.js or React Native's FlatList with paging enabled).
• Advantage: Zero video hosting costs and no copyright infringement, since the original platform streams the video and credits the creator.

3. Seed with Paid or Community Creators

If you want an original social network rather than an aggregator:
• Micro-incentives: Pay 10–20 micro-creators or campus ambassadors a small fee to post 3–5 videos a day during your launch month so the feed feels active.
• AI-Generated Feeds: Use video generation APIs or automated text-to-video workflows (e.g., turning trending news, quotes, or trivia into short narrated clips) to keep the feed stocked automatically.

Key Legal & Cost Hurdles to Watch

• Never scrape without permission: Downloading and re-uploading TikTok or Instagram videos without creator consent violates platform terms and copyright laws. Always use official embeds or licensed APIs.
• Bandwidth costs: Video streaming eats data fast. Using embeds or stock CDNs avoids massive cloud storage and egress bills early on.
If you tell me:
• Your target niche (entertainment, education, e-commerce, etc.)
• Your preferred tech stack (no-code, React Native, Flutter, web)
I can recommend the exact tools and architecture to build your prototype.

both are nice but how do i get the source code for the app, get me opensource app source codes for it

You can get open-source source code for a reels-style app by cloning full-stack TikTok/Reels starter repositories on GitHub, pairing a lightweight vertical-feed frontend with an open-source backend, or using an open-source automated video generator to populate the feed without filming.

1. Full-Stack Mobile App Repositories (iOS & Android)

If you want a ready-made mobile app with vertical swipe playback, authentication, likes, comments, and profiles:
• React Native + Expo + Firebase: kirkwat/tiktok is an MIT-licensed iOS/Android clone built with React Native, Expo, TypeScript, and Firebase. It includes video feeds, camera/gallery uploads, likes/comments, profiles, and messaging out of the box.
• Flutter UI & Feed Starters: Repositories like jibinkj-07/Tiktok-Clone and birukbr7/TiktokCloneByBirukBr7 give you clean Flutter vertical-scrolling video feeds using chewie or video_player widgets that you can easily hook up to your own API or stock video URLs.

2. Web & Progressive Web App (PWA) Repositories

If you want to launch fast in a browser—or wrap the web app for mobile—without app store delays:
• React + Firebase Web Clone: princekumar21/reels-clone provides a web-based vertical reels feed with Firebase authentication, likes, comments, audio tracks, and user profiles.
• Minimalist HTML/CSS/JS Feed: You can build a zero-framework vertical snap feed using CSS scroll-snap-type: y mandatory and the browser's IntersectionObserver API to auto-play the visible item and pause off-screen ones—ideal if you are feeding it external embeds or stock clips.

3. Open-Source Tools to Auto-Generate Videos for Your App

Since you don't have videos yet, you can combine one of the app repos above with an open-source content pipeline:
• Text-to-Short-Video Pipeline: gyoridavid/short-video-maker is an open-source REST/MCP service that takes text scripts, pulls background clips from the Pexels API, adds text-to-speech narration and auto-captions, and outputs ready-to-stream vertical videos.
• Long-to-Short Clipper: mutonby/openshorts (MIT-licensed) turns long-form videos into 9:16 vertical clips with automatic speaker tracking and burned-in subtitles.

Important Caveat Before You Clone

Many open-source "TikTok clone" repos on GitHub use older SDK versions (such as older Expo or Flutter releases). Expect to spend time upgrading dependencies, swapping out deprecated video packages, and connecting your own Firebase/Supabase keys before deploying.
Which tech stack do you prefer (Flutter, React Native / Expo, or Web / React), and do you want users to upload videos or auto-populate the feed via API?
+4
• 
YouTube·Angela J Holden
Build an Instagram Reels-Style UI with HTML, CSS + JavaScript
18 Sept 2025 — The project is a simple clone to simulate functionality, allowing users to scroll and snap through five prepared videos.
03:52:28
• 
GitHub
GitHub - mutonby/openshorts: Open source AI clip generator: turns long videos into viral 9:16 shorts with AI moment detection, face tracking, subtitles and dubbing. Self-host free with Docker (MIT), or use the cloud with GPU speed from $12/mo. MCP server and API for AI agents. · GitHub
AI clip generator: turns long videos into viral 9:16 shorts with AI moment detection, face tracking, subtitles and dubbing. Self-h...
• 
GitHub
GitHub - gyoridavid/short-video-maker: Creates short videos for TikTok, Instagram Reels, and YouTube Shorts using the Model Context Protocol (MCP) and a REST API. · GitHub
Short Video Maker combines text-to-speech, automatic captions, background videos, and music to create engaging short videos from s...
Show all

what free backend can i use for this app

For a reels-style app, pair Supabase (for your database, user authentication, and likes/comments) with Cloudflare R2 or Cloudinary (for video storage and streaming) to get the most generous free tier without surprise bandwidth bills.
Because video files consume massive bandwidth, a single "all-in-one" backend often hits its free data limit quickly. Splitting your database from your video storage keeps everything free while you build and launch.

1. Best All-in-One Backends (Database + Auth + Storage)

If you want one dashboard to handle users, comments, likes, and small video files right away:
• Supabase: My top pick for open-source projects. Its free tier includes a PostgreSQL database (500 MB), authentication (50,000 monthly active users), real-time subscriptions (great for live comment counts), and 1 GB of file storage with 5 GB of bandwidth. You can also self-host it for free since it is open-source.
• Appwrite: Another strong open-source option with a generous free cloud tier (2 GB database, 2 GB storage, 10 GB bandwidth, and 75,000 monthly active users). It has built-in SDKs for Flutter, React Native, and Web.
• Firebase (Spark Plan): Most open-source TikTok/Reels clones on GitHub are already wired up to Firebase. The free Spark plan gives you Authentication, Firestore database, and basic storage, though its free bandwidth limits are tighter than Supabase or Appwrite once videos start streaming.

2. Best Free Storage & Streaming Add-Ons (To Avoid Video Bandwidth Limits)

Video playback eats through 5–10 GB of free backend bandwidth very fast. Once you move past basic testing, store your video URLs in Supabase/Firebase and host the actual .mp4 files on one of these:
• Cloudflare R2: Offers 10 GB of free storage every month with zero egress (bandwidth) fees. Because you don't pay when users watch videos, it is one of the cheapest and safest ways to host short-form video files. (Note: Requires adding a payment card for verification, even though the first 10 GB is free).
• Cloudinary: Gives you 25 free monthly credits (roughly 25 GB of storage or bandwidth) and automatically compresses, resizes, and converts uploaded videos into fast-loading mobile streams (HLS) so they don't buffer on slower mobile networks.

3. Zero-Storage Setup (If You Pull Videos via API)

If you don't store video files at all—and instead pull clips dynamically from YouTube Shorts or Pexels/Pixabay APIs—you only need Supabase or Firebase to save user accounts, bookmarks, likes, and comments, meaning your free tier will last for thousands of users.
Are you planning to host uploaded video files yourself, or save external video links (like YouTube/Pexels) in the database?

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
what about a mobile app
8. If you want a real Android and iPhone app
Then I would change the stack slightly:

Maximizing efficiency and productivity with Expo dev tools
React Native + Expo

One codebase for Android and iOS, with native mobile interfaces and access to device features.

Documentation · Source code

Expo Go - Developer Tools App | MWM
Test on your phone for free

Use Expo Go during early development, or create a development build when you need custom native modules.

Supabase - Review, Pricing & Alternatives | Delv
Supabase backend

Use the same database and authentication strategy, with access policies protecting each user's data.

Supabase

Expo's framework is free and open source. Its current free cloud-build plan includes 15 Android and 15 iOS builds per month, within the plan's limits. 

Expo documentation
+1

To publish, budget separately for developer accounts: Google Play currently requires a one-time US$25 registration fee, while Apple's Developer Program costs US$99 per year. You can test an Android APK on your own device without publishing to Google Play. 

Expo documentation

Start the mobile project
Install Node.js and Git, then run:

npx create-expo-app@latest reels-mobile
cd reels-mobile
npx expo start

Follow the terminal instructions to open the project on your phone using Expo Go. Then use your coding agent and the Everything Claude Code skills to build the feed in small, tested steps.

My recommendation: if your priority is a genuine mobile app, start with Expo + React Native + Supabase rather than building a website and converting it later. You can still add a web version when needed.

One last question: do you want to launch on Android first, or do you need both Android and iPhone from day one? That determines the cheapest practical build and release workflow.

android
Great — Android first is the most practical route for your free Reels app. You can develop it, test it on your phone, and generate an installable APK before paying to publish it.

Your Android app development plan
TikTok’s “For You Page” can be further personalized | by Kanijah Brickhouse | Medium
1. Mobile app

React Native + Expo + TypeScript

Build the vertical swipe feed, autoplay, likes, comments, creator profiles and discovery.

Adding Supabase to a Next.js application
2. Backend

Supabase free tier

Accounts, video metadata, likes, follows, comments and bookmarks.

Bkper Mobile Web App | Bkper
3. Build and test

Expo Go during development, followed by an installable Android APK. Expo's free cloud-build allowance currently includes 15 Android builds monthly. 

Expo
+1

1. Get the project running
On your computer, install Node.js and Git. Then run:

npx create-expo-app@latest reels-mobile
cd reels-mobile
npx expo start

Install Expo Go on your Android phone and scan the QR code displayed by the development server.

Once the starter app runs, use the Everything Claude Code skills to build and test each feature. You can start without paying for a coding assistant, although free AI usage limits depend on the tool you choose.

2. Build an APK without paying
When you're ready to install your app independently of Expo Go, configure an Android preview build:

npm install --global eas-cli
eas login
eas build:configure

In eas.json, configure a preview profile with "distribution": "internal" and "android": {"buildType": "apk"}. Then run:

eas build --platform android --profile preview

The resulting APK can be downloaded and installed on a compatible Android phone. See the official Expo build guide for the exact configuration.

You do not need a Google Play developer account to build and install your own APK. Publishing to Google Play is a separate step; its standard developer registration fee is currently US$25 once, and additional verification or testing requirements may apply. 

Android Developer Console Help
+1

3. One important decision before we build
How will your app get its videos? This determines the database, player and storage architecture.

Choose your initial video source


External videos — show permitted videos from other platforms without hosting them


Admin-curated videos — I choose and add the videos


User uploads — creators upload their own videos


A combination — external videos and creator uploads

What computer will you use to build it?


Windows, Linux or Mac computer

Android phone only

Cloud-based coding environment
My recommendation is to begin with a working swipe feed and a small set of authorized sample videos, then add the backend and creator features. That will let you validate the app on your own Android phone before investing in video hosting.

For Android app ideas, here’s one way to build a production-ready app.



Ad
Ads do not influence the answers you get from ChatGPT. Your chats stay private. 
Learn about ads
Create my detailed Android-first Reels app build plan using React Native, Expo, TypeScript, Supabase, and the Everything Claude Code skills. Initial video strategy: a combination of external sources and creator uploads. Development environment: computer. Keep initial development and testing within free tiers. Give me the exact repository choices, commands, project structure, implementation sequence, and APK build instructions.
Android-first Reels app: complete free-tier build plan
We're going to build a real Android application with a vertical video feed, creator profiles, likes, comments, and two content sources: permitted external videos and creator uploads.

The development setup will use React Native + Expo + TypeScript + Supabase + Everything Claude Code. We'll start with a working local app, then connect the backend and finally produce an installable APK.

The objective is to keep development and testing at $0 initially, while designing the app so you can add more users and videos later.

1. Choose the repositories
These are the repositories and official documentation I would use rather than combining several unmaintained TikTok clones.

Maximizing efficiency and productivity with Expo dev tools
Mobile application — Expo

Your main codebase; React Native components, TypeScript and Android builds.

Source repository · Example projects

Core
Supabase SVG Icon - Free Supabase PNG & SVG Download
Backend — Supabase

Authentication, PostgreSQL, Row Level Security, and later creator-upload metadata.

Source repository · React Native setup

Core
WorldFlowAI · GitHub
AI development toolkit — Everything Claude Code

Planning, coding standards, test-driven development, code review, security review and verification.

Source repository

Core
How to Play Video in an Expo App (Using react-native-video)
Video playback — Expo Video

Native playback through the expo-video package. Use this for supported direct video URLs, not as a universal player for social media links.

Official documentation

Why not start with a complete open-source TikTok clone? Clone projects can be useful references, but they may contain outdated dependencies, incomplete backends or assumptions about video hosting. Starting from Expo lets us control the architecture and use current, compatible dependencies. Expo's official project generator supports TypeScript and Expo Router. 

Expo documentation
+1

2. Install the development tools
You need a computer running Windows, macOS or Linux. You do not need to buy a Mac because the first target is Android.

Install these tools:

Node.js LTS

Runs the Expo development tools.

Download Node.js

Git

Version control and downloading repositories.

Download Git

Visual Studio Code

Editor for the app and project instructions.

Download VS Code

Claude Code or another compatible coding agent

Uses the development toolkit. Free availability depends on the chosen agent and account.

Claude Code documentation

Optional: install Android Studio if you want an Android emulator. You can save disk space by initially testing on your physical Android phone.

Install Everything Claude Code
The repository is a collection of coding-agent configurations, including agents, skills, commands, rules and hooks. Its current README documents plugin installation as well as manual installation. 

GitHub
+1

For a controlled setup, clone the exact repository you selected:

git clone https://github.com/WorldFlowAI/everything-claude-code.git
cd everything-claude-code

If you use Claude Code, you can install it through the plugin marketplace interface, following the repository's current installation instructions. The README currently documents a marketplace installation using the affaan-m/everything-claude-code repository name, so verify that the WorldFlowAI repository's marketplace manifest and plugin identity match before using that route.

Alternatively, install selected components manually by following the README. I recommend beginning with:

planner and architect agents.

tdd-workflow and coding standards skills.

code-reviewer and security-reviewer agents.

/plan, /tdd, /code-review and /verify commands, where supported by your installation.

Don't copy the entire toolkit into your mobile app source directory. Keep the toolkit installation separate from your app repository.

3. Create the Android project
Open a new terminal in the directory where you keep your projects.

Run:

npx create-expo-app@latest reels-mobile
cd reels-mobile

Expo's official generator creates a React Native application with TypeScript and Expo Router when you choose its default template. 

Expo documentation
+1

Install the main dependencies:

npx expo install expo-video expo-image expo-file-system expo-image-picker expo-constants @react-native-async-storage/async-storage react-native-url-polyfill @supabase/supabase-js

These cover video playback, thumbnails, file handling, selecting videos from the phone, environment configuration, local storage and Supabase connectivity.

Start the app:

npx expo start

Open it in Expo Go on your Android device. At this stage, we only want to prove that the development environment works.

Initialize Git for your own project:

git init
git add .
git commit -m "chore: initialize Android reels app"

Create a separate repository on GitHub for reels-mobile, then connect it using the URL GitHub gives you:

git remote add origin YOUR_GITHUB_REPOSITORY_URL
git push -u origin main

Replace the placeholder with your actual repository URL. Do not upload secrets, signing credentials or local environment files.

4. Project structure
Keep the code organized from the beginning. Expo Router uses files under app/ to define screens; the other directories separate business logic, database access and reusable components.

reels-mobile/
├── app/
│   ├── _layout.tsx
│   ├── index.tsx              # Main video feed
│   ├── discover.tsx
│   ├── upload.tsx
│   ├── notifications.tsx
│   ├── (auth)/
│   │   ├── sign-in.tsx
│   │   └── sign-up.tsx
│   ├── video/[id].tsx
│   └── profile/[id].tsx
├── src/
│   ├── components/
│   │   ├── VideoCard.tsx
│   │   ├── VideoPlayer.tsx
│   │   ├── FeedControls.tsx
│   │   └── CommentSheet.tsx
│   ├── features/
│   │   ├── feed/
│   │   ├── auth/
│   │   ├── profiles/
│   │   ├── likes/
│   │   ├── comments/
│   │   └── uploads/
│   ├── lib/
│   │   ├── supabase.ts
│   │   └── config.ts
│   ├── services/
│   │   ├── videos.ts
│   │   ├── profiles.ts
│   │   └── interactions.ts
│   ├── hooks/
│   │   ├── useFeed.ts
│   │   └── useActiveVideo.ts
│   ├── types/
│   │   └── database.ts
│   └── utils/
├── supabase/
│   ├── migrations/
│   └── seed.sql
├── assets/
├── tests/
├── .env.example
├── .gitignore
├── app.json
├── eas.json
├── package.json
└── tsconfig.json
Treat this as the target structure, not a list of files you need to create manually before starting. Let the coding agent implement it incrementally.

5. Design the database around both video sources
Create a free project at Supabase. Use the hosted database rather than self-hosting during the first phase.

The core schema should include the following tables.

Table

Purpose

profiles

User name, avatar, bio and profile information

videos

Caption, creator, thumbnail, source type, playback reference and moderation status

follows

Which users follow which creators

likes

One like per user per video

comments

Comments attached to videos

bookmarks

Videos a user has saved

reports

Reports for inappropriate or infringing content

For the videos table, distinguish these source types:

external_direct: a direct video URL that the app is authorized to play.

external_embed: a platform video that must use its permitted embedded player or viewing experience.

uploaded: a video uploaded by an authorized creator and stored in your configured storage.

Use a moderation status such as pending, approved and rejected. Only approved videos should appear in the public feed.

Important: an ordinary YouTube, TikTok or Instagram page URL is not necessarily a playable video URL. Don't pass every external URL directly to expo-video. For platform embeds, build a provider-specific viewing component and comply with that provider's terms.

Set up the Supabase client
Create a .env file locally:

EXPO_PUBLIC_SUPABASE_URL=https://YOUR_PROJECT.supabase.co
EXPO_PUBLIC_SUPABASE_ANON_KEY=YOUR_PUBLIC_KEY

Use the publishable key if your Supabase project provides one; the older anon key is also a client-side key. Never put the service_role or secret key in the mobile app.

Create src/lib/supabase.ts:

import 'react-native-url-polyfill/auto';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { createClient } from '@supabase/supabase-js';

const url = process.env.EXPO_PUBLIC_SUPABASE_URL!;
const key = process.env.EXPO_PUBLIC_SUPABASE_ANON_KEY!;

if (!url || !key) {
  throw new Error('Missing Supabase environment variables');
}

export const supabase = createClient(url, key, {
  auth: {
    storage: AsyncStorage,
    autoRefreshToken: true,
    persistSession: true,
    detectSessionInUrl: false,
  },
});

This is the initial client configuration. The database schema, authentication flows and access policies still need to be implemented and tested.

Database security requirements
Before connecting real users:

Enable Row Level Security (RLS) on every table exposed through the Supabase API.

Let users edit only their own profiles.

Let users delete only their own likes, comments and bookmarks.

Allow video uploads only for authenticated creators, with storage policies restricting each user to their own upload area.

Prevent users from approving their own videos or changing moderation status.

Keep admin permissions on the server, never in a client-side role flag alone.

Use Supabase SQL migrations to make the schema repeatable and keep it under version control. You can initialize the local migration directory with:

npx supabase init

The Supabase CLI may require a linked project and authentication for remote database operations. Follow the official Supabase documentation for project linking and migrations.

6. Build the feed before uploads
This is the most important engineering decision: get playback and scrolling right before building the social network around them.

Use expo-video for direct video playback. It is included in Expo Go, and its official documentation covers the useVideoPlayer and VideoView APIs. 

Expo documentation

The feed should behave like this:

One active video plays at a time.

Swiping to the next item pauses the previous player.

Videos use a full-screen, 9:16 presentation.

Scrolling pauses playback when the app is backgrounded or the screen is no longer active.

Preload only the next video when appropriate.

Use thumbnails or placeholders until a video is ready.

Show captions, creator details and engagement controls over the video.

Install any additional navigation or gesture packages through Expo's compatible installer, not by guessing package versions.

npx expo install react-native-gesture-handler react-native-reanimated

For a first version, use a vertical FlatList with paging enabled and viewability tracking. Avoid mounting a separate actively playing video player for every item in a large feed.

Ask the coding agent to implement this first
Feature 1: Vertical video feed
Use the installed Everything Claude Code planning, TDD, code-review and verification workflows.

Implement a React Native vertical video feed using Expo Router, TypeScript, expo-video and FlatList.

Requirements:

Full-screen, vertically paged video cards.

One active player at a time.

Autoplay when an approved video becomes active.

Pause inactive videos and pause playback when the app is backgrounded.

Show a poster/thumbnail while loading.

Support captions, creator information, like, comment, bookmark and share controls.

Support direct video URLs only when they are playable and authorized.

Separate external embed providers from direct video playback.

Start with local mock data; do not require Supabase yet.

Add loading, empty and error states.

Test active-item selection, playback state transitions and feed behavior.

Run TypeScript checks and the available tests.

Report which checks were actually executed and any remaining limitations.

Do not implement uploads, authentication or the entire application in this task. First deliver a reliable feed.

After this works on your phone, commit it to Git. Each major feature should have its own small, reviewable change.

7. Add external videos and creator uploads
Use two separate paths for content.

Path A — External content
No file upload or storage required on your server.

Admin adds a permitted video or embed reference.
The app validates the provider and URL type.
The feed uses the correct player for that provider.
Store the source, attribution and moderation status in the database.
Path B — Creator uploads
Adds original content and makes the app a genuine social platform.

Authenticated creator selects a video using expo-image-picker.

Validate file type and size; show upload progress and errors.
Upload to a private or appropriately controlled Supabase Storage bucket.
Create a database record with pending moderation status.

An authorized admin approves the video before it appears in the feed.
The free-storage trade-off
Supabase's current free tier includes 1 GB of file storage and 5 GB of uncached egress, plus 5 GB of cached egress. Projects can pause after a week of inactivity. 

Supabase
+1

That is enough to experiment with small videos, but it is not a generous production video-hosting plan. As an illustration, a 15 MB clip would consume roughly 15 MB of storage; 100 such clips would be about 1.5 GB before accounting for other files.

Therefore, I would:

Keep the first upload limit small.

Compress videos before upload where practical.

Avoid duplicating external videos in your own storage.

Track storage and bandwidth consumption.

Add a configurable maximum file size.

Keep video records separate from file storage so you can migrate later.

If creators start uploading lots of videos, a dedicated video service or object storage and delivery architecture may become necessary. Free tiers are useful for validation, not a promise of unlimited hosting.

8. Implement the app in seven milestones
Use these milestones in order. Don't ask your coding agent to complete all seven in one prompt.

Build tracker
0/7 milestones


1. Project setup

Day 1

Expo app launches, TypeScript works, Git repository is connected and project instructions are documented.


2. Video feed

Days 2–3

Vertical paging, active-player management, autoplay, pause, thumbnails and error handling.


3. Authentication

Days 4–5

Supabase signup, login, logout, persisted sessions and profiles.


4. Social features

Days 6–8

Likes, comments, follows, bookmarks and paginated database-backed feeds.


5. Content ingestion

Days 9–11

External provider handling, creator uploads, moderation and storage limits.


6. Quality and security

Days 12–13

RLS tests, permission checks, upload validation, mobile network tests and code review.


7. APK build

Day 14

Build an installable APK, test on your Android device and document known limitations.

These timings are estimates for planning, not a guarantee. Your pace will depend on your coding experience, the AI tool you use, and the time available to test and fix problems.

The verification loop
At the end of each milestone, ask your agent to:

Run the relevant tests and TypeScript checks.

Run the production JavaScript bundle or Expo export check.

Review security-sensitive changes.

Fix failures rather than hiding or skipping them.

Summarize changed files, test results and unresolved issues.

Commit only after you have reviewed the result.

The Everything Claude Code toolkit's TDD, code-review and verification workflows are intended to support this approach. 

GitHub
+1

9. Generate your first Android APK
When the app works in Expo Go, you can generate a standalone Android APK with Expo Application Services (EAS).

Step 1: Install EAS CLI and sign in
npm install --global eas-cli
eas login
eas whoami
eas build:configure

EAS supports free-plan users with an Expo account, although build queue priority and usage allowances vary by plan. 

Expo documentation
+1

Step 2: Configure eas.json
Create or edit eas.json in the project root:


{
  "build": {
    "preview": {
      "distribution": "internal",
      "android": {
        "buildType": "apk"
      }
    },
    "production": {
      "android": {
        "buildType": "app-bundle"
      }
    }
  }
}

The preview profile generates an APK for direct installation. The production profile generates an Android App Bundle for a store release.

Step 3: Set the Android package name
In app.json, configure your app's name, slug and unique Android application ID. For example:


{
  "expo": {
    "name": "Reels Mobile",
    "slug": "reels-mobile",
    "android": {
      "package": "com.yourbrand.reels"
    }
  }
}

Merge these settings into your existing app.json; don't overwrite other Expo-generated configuration that your app needs. Replace com.yourbrand.reels with a package identifier you control before release.

Step 4: Build
eas build --platform android --profile preview

When the build finishes, EAS will provide a build page with a download link. Download the APK, transfer it to your phone if necessary, and install it. Android may ask you to allow installation from that source.

The build is not complete until you have tested the actual APK, not just the Expo Go preview. See the official Expo build guide and EAS setup guide. 

Expo documentation
+1

10. Your free-tier budget
Component

Initial cost

Main limitation

React Native + Expo

$0

Local development and cloud build quotas

GitHub

$0

Free repository and account limits

Supabase

$0

Database, storage, bandwidth and inactivity limits

Everything Claude Code

$0

Toolkit is open source; coding-agent usage may cost money

Android APK installation

$0

Users must install the APK themselves

Google Play publication

Not required initially

Separate registration fee if you publish later

Keep a note of current quotas before inviting real users. In particular, video playback traffic can grow much faster than database traffic.

11. Your next action
Start by getting the Expo project running and installing the coding toolkit. Then build only the feed, using a few sample videos that you have permission to play.

Once that works, connect Supabase and add authentication. Implement external embeds and creator uploads separately so that failures in one content source don't break the whole feed.

The single most important milestone is this: you can swipe through videos smoothly on your Android phone, and only the active video plays. Everything else can be built on top of that.

