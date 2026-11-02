/* ============================================================
   BOLDFACE · Spotlight · motion engine
   GSAP + ScrollTrigger + Lenis + raw WebGL
   ============================================================ */
(function () {
"use strict";
var REDUCED = window.matchMedia && matchMedia("(prefers-reduced-motion: reduce)").matches;
var TOUCH = window.matchMedia && matchMedia("(hover: none), (pointer: coarse)").matches;
var G = !!(window.gsap && window.ScrollTrigger);
if (G) gsap.registerPlugin(ScrollTrigger);
var $ = function (s, c) { return (c || document).querySelector(s); };
var $$ = function (s, c) { return Array.prototype.slice.call((c || document).querySelectorAll(s)); };
var clamp = function (v, a, b) { return Math.max(a, Math.min(b, v)); };
var lerp = function (a, b, t) { return a + (b - a) * t; };
var AR = '<svg viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8" aria-hidden="true"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';

var articles = {
  a1: {
    tag: 'LinkedIn',
    title: 'How to write a hook that does not start with &ldquo;I&rdquo;',
    meta: '5 min read &middot; LinkedIn &middot; Boldface Playbook',
    body: `<p>The first line of your LinkedIn post is doing one job. Not informing. Not entertaining. Not showcasing your expertise. Its only job is to make the reader stop scrolling and read the next line.</p>
<p>Most people write hooks that start with "I". "I recently realized..." "I have been thinking about..." "I want to share something..." The problem is not grammatical. The problem is that starting with "I" puts the focus on you before the reader has any reason to care about you.</p>
<h3>What actually stops the scroll</h3>
<p>The hooks that perform consistently well share one characteristic: <em>they create an open loop in the reader's mind.</em> They raise a question, introduce a contradiction or state something that requires resolution.</p>
<ul>
<li>A number that surprises. "We grew from 800 to 11,000 followers in 5 months. Here is what we changed."</li>
<li>A contradiction. "The best LinkedIn post I ever wrote had zero likes in the first hour."</li>
<li>A direct challenge. "Most founders are wasting their time on LinkedIn. Here is the specific mistake."</li>
<li>A story with immediate stakes. "Last Tuesday, a VC I had never spoken to DMed me about our round."</li>
</ul>
<h3>The rule</h3>
<p>Write your first line. Then ask yourself: <em>does this create a question the reader needs to answer?</em> If the honest answer is no, rewrite it. The content can be brilliant. If the first line does not hook, nobody reads the brilliant content.</p>
<p><strong>The best hooks are not clever. They are specific.</strong> Specificity creates curiosity. "I learned something about business" is ignored. "The conversation that changed how I price my work" gets clicks.</p>
<h3>A practical exercise</h3>
<p>Write five first lines for your next post before you write anything else. Pick the one that makes you most want to know what comes next. That is your hook. The rest of the post is just honouring the promise you made in that first line.</p>`
  },
  a2: {
    tag: 'Content Strategy',
    title: 'The 5 post types that actually generate inbound',
    meta: '6 min read &middot; Content Strategy &middot; Boldface Playbook',
    body: `<p>Most LinkedIn content gets likes. Some gets comments. Very little generates real business: DMs, meeting requests, partnership conversations, inbound leads. The difference is almost always the format.</p>
<p>After managing LinkedIn for 35+ founders and brands, we have seen exactly which post types move the needle on actual business outcomes versus vanity metrics. Here are the five that work.</p>
<h3>1. The Contrarian Take</h3>
<p>Pick a widely held belief in your industry and argue against it, with evidence. Not for the sake of being controversial, but because you genuinely believe the conventional wisdom is wrong. <em>This is the single highest-performing post type for authority building.</em> It positions you as someone who thinks independently and has the conviction to say so publicly.</p>
<h3>2. The Behind-the-Scenes Number</h3>
<p>Share a specific metric from your business or work with context. Not "we grew" but "we went from 12 inbound calls a month to 47 in 90 days by changing one thing in our LinkedIn profile." Numbers with context are credibility. They show you are someone who measures, which means you are someone who delivers.</p>
<h3>3. The Lesson from a Failure</h3>
<p>The most-shared posts on LinkedIn are almost never success stories. They are honest, specific accounts of something that went wrong and what the person learned. <strong>Vulnerability, when it is genuine and not performed, generates more trust than any highlight reel.</strong></p>
<h3>4. The Decision Framework</h3>
<p>Walk your audience through how you make a specific type of decision. How do you evaluate a new hire? How do you decide which clients to take on? How do you think about pricing? Frameworks are shareable because they are useful, and useful content gets passed around.</p>
<h3>5. The Direct Recommendation</h3>
<p>Recommend a book, a tool, a person, a resource, with genuine specificity about why. "This book changed how I think about X" is weak. "Chapter 7 of this book gave me a framework I use every week in client conversations" is specific enough to be trusted. <em>The person you recommend will often see it. New doors open.</em></p>`
  },
  a3: {
    tag: 'Personal Branding',
    title: 'Why your LinkedIn bio is quietly killing your credibility',
    meta: '4 min read &middot; Personal Branding &middot; Boldface Playbook',
    body: `<p>You have three seconds. That is the average time someone spends deciding whether to accept your connection request, click your profile or keep scrolling. In those three seconds, two things are doing all the work: your profile photo and your headline.</p>
<p>Most LinkedIn headlines read like a job title. "Founder at X" or "CEO | Helping companies grow" or the worst: "Entrepreneur | Speaker | Author | Consultant." None of these answer the only question the reader is actually asking: <em>why should I care about you?</em></p>
<h3>What your headline is actually for</h3>
<p>Your headline is not a job description. It is a value proposition. It should tell someone what you do, who you do it for and what outcome you create, in under twelve words. That is a hard constraint. It forces clarity.</p>
<p><strong>Weak:</strong> "Founder &amp; CEO | Passionate about startups"<br><strong>Strong:</strong> "I help D2C founders build LinkedIn audiences that convert to revenue"</p>
<h3>The About section nobody reads, and why</h3>
<p>Most About sections are written in the third person or are structured like a CV. Neither of these work because LinkedIn is a conversational platform. The About section that performs is written like a direct message to your ideal reader. First person. Specific. Ending with a clear ask or invitation.</p>
<h3>The fix, in order</h3>
<ul>
<li>Rewrite your headline as a value proposition. Who do you help, with what, to achieve what outcome.</li>
<li>Rewrite your About section in first person, starting with the problem your ideal client has.</li>
<li>Add a Featured section with your best content, a case study or a direct CTA.</li>
<li>Make sure your banner image says something, not nothing.</li>
</ul>
<p>These four changes take two hours. <em>The compounding effect of getting them right lasts for years.</em></p>`
  },
  a4: {
    tag: 'Strategy',
    title: 'How to build a content strategy in 90 minutes',
    meta: '7 min read &middot; Strategy &middot; Boldface Playbook',
    body: `<p>Most founders either have no content strategy, or an over-engineered one that collapses after two weeks. Neither works. What works is a simple, honest framework that takes 90 minutes to build and 20 minutes a week to maintain.</p>
<p>Here is the exact process we use with every new client.</p>
<h3>Minutes 0 to 20: Define the one person you are writing for</h3>
<p>Not a demographic. A specific person. The CFO of a Series A startup who is skeptical of personal branding but curious. The D2C founder who is exhausted by ads and looking for an organic channel. <em>Write their name down. Write what keeps them up at night.</em> Everything else flows from this.</p>
<h3>Minutes 20 to 40: Pick three content pillars</h3>
<p>Three topics you can write about indefinitely with genuine authority. Not broad topics like "leadership" or "growth" but specific angles. "What I have learned about pricing from working with 35 founders." "The mistakes early-stage D2C brands make on LinkedIn." "How I think about building in public." Three pillars, not more. Focus is the strategy.</p>
<h3>Minutes 40 to 60: Map your post formats</h3>
<p>For each pillar, identify two post formats that feel natural to you. Some people write well in lists. Others write better in narrative form. Some founders are comfortable sharing numbers. Others prefer ideas and frameworks. <strong>The best content strategy is the one you can sustain, not the one that looks most impressive in a deck.</strong></p>
<h3>Minutes 60 to 90: Build a 30-day calendar</h3>
<p>Eight to ten posts in 30 days. Map them out. Do not write them yet; just assign a topic, a pillar and a format to each slot. This is your operating document. When you sit down to write, you are not staring at a blank page. You have a brief.</p>
<p>That is it. 90 minutes. The rest is execution, which is the hard part, and also the part we handle for you.</p>`
  },
  a5: {
    tag: 'LinkedIn',
    title: 'The comment that got me three clients in one week',
    meta: '5 min read &middot; LinkedIn &middot; Boldface Playbook',
    body: `<p>In January, I left a comment on a post by a founder I had never spoken to. It was 47 words. Within 72 hours, three people who had seen that comment had sent me a connection request. One of them became a client within the week.</p>
<p>I have since run this as a deliberate strategy for clients and the results are consistent. <em>Strategic commenting is the most underused growth lever on LinkedIn.</em> Here is why it works and exactly how to do it.</p>
<h3>Why comments outperform posts for reach</h3>
<p>When you post original content, it reaches your existing network first. LinkedIn's algorithm decides how far it travels from there. When you comment on someone else's post, particularly one that is already performing well, your comment is seen by everyone who engages with that post. Many of them are not in your network. <strong>You are borrowing distribution from someone who has already earned it.</strong></p>
<h3>The anatomy of a comment that works</h3>
<p>A comment that builds your reputation does three things. It adds something the post did not already say. It demonstrates your specific expertise or perspective. And it makes the reader want to see more of what you think.</p>
<ul>
<li>Do not just agree. "Great post!" is noise. "This point about X resonates. We saw the same pattern when Y happened" is a contribution.</li>
<li>Be specific. The more specific your observation, the more credible you appear.</li>
<li>End with a question or a perspective that invites response. Conversations on LinkedIn are visible to everyone.</li>
</ul>
<h3>The practical system</h3>
<p>Identify 10 to 15 accounts your ideal clients follow. Check their posts every morning. Leave two to three substantive comments. Do this for 30 days. The compounding effect on your visibility and the quality of your inbound is significant. <em>It takes 20 minutes a day. Most people do not do it because it feels small. That is exactly why it works.</em></p>`
  },
  a6: {
    tag: "Newsletters",
    title: "How to start a LinkedIn newsletter people actually open",
    meta: "6 min read &middot; Newsletters &middot; Boldface Playbook",
    body: `<p>A LinkedIn post has a short life. It shows up in the feed for a day or two, reaches whoever the algorithm picks, and then it's gone. A LinkedIn newsletter works differently. Every subscriber gets a notification and an email when a new issue goes out, and when you launch, LinkedIn invites your network to subscribe.</p>
<p>That makes it the closest thing LinkedIn has to an owned channel. It's also the most commonly abandoned one. Plenty of newsletters launch with a burst of subscribers and go quiet by issue four. Here's how to start one that doesn't.</p>
<h3>1. Pick one promise, not a topic</h3>
<p>&ldquo;Thoughts on fintech&rdquo; is a topic. &ldquo;One lending decision a week, explained by someone who has signed off on thousands&rdquo; is a promise. The promise tells people exactly what they get and why they should get it from you. Write yours in one sentence before you do anything else. If you can't, you're not ready to launch.</p>
<h3>2. Name it so people remember it</h3>
<p>The name shows up in notifications and inboxes, so it does real work. Short beats clever. A name that hints at the promise beats one that only makes sense to you. Avoid your own name plus &ldquo;Insights&rdquo;; nobody remembers those.</p>
<h3>3. Choose a rhythm you can keep for a year</h3>
<p>Weekly works if you have a lot to say and your industry moves fast. Fortnightly or monthly suits most founders and executives. The test is simple: could you keep this pace through your busiest quarter? A monthly newsletter that never misses beats a weekly one that disappears in March.</p>
<h3>4. Write one idea per issue</h3>
<p>Most good issues land somewhere between 600 and 1,200 words, and almost all of them make one point well. A useful structure:</p>
<ul>
<li>Open with a specific moment: a meeting, a number, a decision.</li>
<li>Say what you think about it, plainly.</li>
<li>Explain why, with the reasoning or evidence only you have.</li>
<li>End with what the reader should do or watch for.</li>
</ul>
<p>Resist the roundup format, five links with a line each, unless curation genuinely is your value. It's easy to write and easy to ignore.</p>
<h3>5. Plan the first six issues before you launch</h3>
<p>Launch week brings the most attention you'll get, so the first issue needs to be your strongest. Plan six issues up front. It proves the idea has legs and gives you a buffer for the weeks when work gets in the way.</p>
<h3>6. Grow it on purpose</h3>
<ul>
<li>Write a post for each issue that stands on its own and points to the full piece.</li>
<li>Put the newsletter in your Featured section.</li>
<li>Mention it in your headline or About if it's central to what you do.</li>
<li>Share specific issues in conversations where they genuinely help.</li>
<li>Keep growing your network with the right people. Subscribers come from your network first.</li>
</ul>
<h3>7. Personal profile or company page?</h3>
<p>A newsletter from your personal profile builds trust in you. One from your company page builds the brand. If you're a founder starting from zero, start personal. People subscribe to people. You can always add a company newsletter later, once your <a href="/services/linkedin-company-page-management/" data-page="s-company">company page</a> has an audience of its own.</p>
<h3>The short version</h3>
<p>One clear promise, a name people remember, a rhythm you can keep, one idea per issue, and six issues planned before launch. Do that and you'll be ahead of most newsletters on LinkedIn.</p>
<p>If you'd rather someone else ran it, <a href="/services/linkedin-newsletter-management/" data-page="s-newsletter">we manage LinkedIn newsletters end to end</a>: setup, calendar, every issue written in your voice, and growth.</p>`
  },
  a7: {
    tag: 'LinkedIn',
    title: 'The C-suite guide to LinkedIn, for people who think social media is beneath them',
    meta: '7 min read &middot; LinkedIn &middot; Boldface Playbook',
    body: `<p>If you are a CEO, CFO or CTO who has not posted on LinkedIn in the last six months, this is for you. Not a lecture about being "more active on social media." A practical case for why your absence is costing you things you care about.</p>
<p>The argument usually goes something like this: "I have a business to run. I close deals at dinners and on the phone. LinkedIn is for people who do not have real relationships." It is a reasonable position. It is also increasingly wrong.</p>
<h3>What happens before the dinner</h3>
<p>Before a potential investor, client or board member agrees to a meeting, they do one thing: they search for you online. If they find a LinkedIn profile with a job title, a list of companies and no voice, they form an impression. That impression is of someone who is either not confident enough to say anything publicly or does not have anything interesting to say.</p>
<p>Neither is a great way to start a relationship. <em>The dinner you are relying on never happens if the search does not go well first.</em></p>
<h3>The specific opportunity most C-suite leaders are missing</h3>
<p>There is a category of opportunity that almost only comes through a visible personal brand: inbound from people who were not already in your network. Investor conversations initiated by someone who read your thinking about capital allocation. Board opportunities from a chairman who saw your post about governance. Talent reaching out because they want to work for someone who thinks the way you do.</p>
<p>These do not happen through your existing relationships. <strong>They happen through your public voice, or they do not happen at all.</strong></p>
<h3>What "being on LinkedIn" actually requires</h3>
<p>For a CFO or CTO, we are not talking about posting every day. We are talking about eight to ten posts a month, written in your voice, about things you genuinely think about. The financial strategy decisions you are wrestling with. The technology choices that actually matter. The leadership lessons you have earned.</p>
<p>You do not need to become an influencer. You need to be findable, legible and credible to the right people. That is a 20-minute-a-week commitment if you work with someone who knows what they are doing. <em>The question is not whether you have time for LinkedIn. The question is whether you can afford to remain invisible to the people who are looking for someone exactly like you.</em></p>`
  },
  a8: {
    tag: 'Content Strategy',
    title: 'How to write about failure on LinkedIn without it backfiring',
    meta: '5 min read &middot; Content Strategy &middot; Boldface Playbook',
    body: `<p>The most-shared, most-commented, most-DM-generating posts on LinkedIn are almost never about success. They are about failure. A deal that fell apart. A hire that went wrong. A strategy that made perfect sense and produced the opposite of the intended result.</p>
<p>This is not an accident. Failure posts work because they are rare. Most of what gets published on LinkedIn is sanitised, polished and optimistic. When someone tells the truth about something that went wrong, it stands out immediately. <em>The contrast alone creates engagement.</em></p>
<h3>Why most failure posts backfire</h3>
<p>The problem is that most people write failure posts incorrectly. They make one of two mistakes. The first is being vague: "I made some mistakes early in my career. Here is what I learned." This sounds like wisdom but feels like nothing. There is no story, no stakes, no specificity. Nobody is moved by a lesson without a scene.</p>
<p>The second mistake is over-performing vulnerability. The post that is clearly designed to seem humble rather than actually be humble. Readers can feel this immediately, and the trust damage is worse than saying nothing at all. <strong>Performed vulnerability is the most corrosive content you can publish.</strong></p>
<h3>The structure that works</h3>
<p>A failure post that builds your credibility instead of damaging it has four parts, in this order:</p>
<ul>
<li>The specific thing that went wrong, with enough detail that the reader can picture it.</li>
<li>Why you made the decision you made, the logic that seemed reasonable at the time.</li>
<li>What actually happened and what it cost you.</li>
<li>The one thing you now do differently as a direct result.</li>
</ul>
<p>Notice what is not on that list: a redemption arc that makes you look better than when you started, a list of generic lessons that could apply to anyone, or a tone that suggests you have fully resolved and transcended the failure.</p>
<h3>The test</h3>
<p>Before you post it, ask one question: <em>does this make me slightly uncomfortable?</em> Not because it is unprofessional, but because it is honest. If the answer is no, if the post feels completely safe to publish, it is probably not specific or vulnerable enough to work. The posts that perform best are the ones where the author thought twice before hitting publish. That hesitation is the signal that you are saying something real.</p>`
  },
  a9: {
    tag: 'Personal Branding',
    title: 'The personal brand toolkit every CFO should have',
    meta: '6 min read &middot; Personal Branding &middot; Boldface Playbook',
    body: `<p>Of all the C-suite roles, the CFO has perhaps the most underutilised personal brand potential. The CEO gets the profile pieces. The CTO gets the tech media coverage. The CFO, who arguably has the clearest, most credible view of how a business actually works, is almost always invisible online.</p>
<p>This is a significant missed opportunity. Not just for the individual CFO, but for the companies they work for and the candidates and investors they are trying to attract.</p>
<h3>Why CFO visibility matters more than you think</h3>
<p>A CFO who writes publicly about financial strategy, capital allocation, the realities of fundraising or how to build a resilient P&amp;L is signalling something that no press release can replicate: that this is a company run by adults who understand the fundamentals. <em>Investors read CFO content differently from CEO content.</em> They are looking for rigour, realism and the kind of unsentimental thinking that protects capital.</p>
<p>Beyond investor relations, a visible CFO attracts three things consistently: board advisory opportunities, executive recruiter attention and the interest of high-quality finance talent who want to work for someone they can learn from.</p>
<h3>What CFO content actually looks like</h3>
<p>The mistake most CFOs make when they do try to post is writing about things that are too broad. Leadership lessons, general business advice, motivational observations. None of this is distinctive. What is distinctive is the specific, hard-won knowledge of someone who has lived inside the numbers of a real business.</p>
<ul>
<li>The financing decision you made and why, including what you ruled out and why.</li>
<li>How you think about unit economics at different stages of growth.</li>
<li>The one metric you watch more closely than any other and what it is telling you right now.</li>
<li>What you wish founders understood about investor expectations before they walked into a Series A.</li>
</ul>
<h3>The baseline toolkit</h3>
<p>Every CFO who wants to build a credible digital presence needs exactly four things: a LinkedIn headline that describes what you do and who you do it for, an About section written in first person that starts with a problem your ideal reader has, a clear Featured section pointing to your best thinking, and a posting cadence of at least twice a month. <strong>That is the minimum. It is also, for most CFOs, more than their entire peer group is doing.</strong></p>
<p>The bar is low. The opportunity is large. The question is simply whether you want to be the finance leader in your space who has a voice, or the one who does not.</p>`
  },
  a10: {
    tag: "Networking",
    title: "How to network on LinkedIn without being that person",
    meta: "6 min read &middot; Networking &middot; Boldface Playbook",
    body: `<p>You know the message. You accept a connection request and within a minute there's a pitch in your inbox. Three paragraphs about their services, a calendar link, and a follow-up two days later asking if you saw it.</p>
<p>Nobody wants to be that person, so most senior people swing the other way and don't network on LinkedIn at all. That's a mistake. Done properly, LinkedIn is the best networking tool there has ever been. Here's how to use it without becoming the person everyone mutes.</p>
<h3>1. Start with a list, not a message</h3>
<p>Write down the 50 to 100 people who would change your next year if they knew you. Investors you'd like to raise from. Buyers at companies you want as clients. Peers you respect. Organisers of events you'd like to speak at. People you'd like to hire.</p>
<p>This list is the whole strategy. Without it, networking turns into connecting with whoever shows up in your feed.</p>
<h3>2. Be visible before you're in their inbox</h3>
<p>Before you send anything, spend a few weeks being useful in public. Read what the people on your list post and leave comments that add something: a counterpoint, an example from your own work, a question that shows you actually read it. &ldquo;Great post!&rdquo; doesn't count.</p>
<p>Done consistently, this changes everything. When your connection request finally arrives, it's from someone they already recognise.</p>
<h3>3. Write connection notes like a person</h3>
<p>A good connection note is short and specific. It says why you're reaching out and asks for nothing.</p>
<blockquote>Your post on credit underwriting for gig workers was the clearest thing I've read on it. We've been seeing the same pattern from the lender side. Would be good to be connected.</blockquote>
<p>No pitch. No calendar link. No &ldquo;I'd love to pick your brain&rdquo;.</p>
<h3>4. Let the relationship breathe</h3>
<p>After connecting, keep doing what you were doing: commenting, sharing their work when it's genuinely good, replying to their stories. If there's a natural reason to talk, a funding round, a new role, a post where you have something real to add, send a short message. Ask for a conversation only once there's a reason for one.</p>
<h3>5. Make the DM easy to say yes to</h3>
<p>When you do ask, be specific about why and keep it small. &ldquo;Would you be open to a 20 minute call next week? I'd like to compare notes on how you're handling enterprise procurement&rdquo; gets far more yeses than &ldquo;Let's connect sometime&rdquo;.</p>
<h3>6. Never automate it</h3>
<p>Automation tools promise hundreds of connections a week. What they deliver is hundreds of strangers who've seen your name attached to a template. LinkedIn's user agreement doesn't allow most of these tools, and accounts that use them get restricted. Your reputation is worth more than the time saved.</p>
<h3>7. Keep score of the right things</h3>
<p>Connection counts don't matter. Track how many people on your list now know who you are, how many conversations you've had, and what came out of them. Ten real relationships a quarter is a very good result.</p>
<h3>Where content fits in</h3>
<p>Networking and content feed each other. Your posts give people a reason to accept your request, and your network gives your posts the right first readers. That's why we run <a href="/services/linkedin-networking/" data-page="s-networking">strategic networking</a> and <a href="/services/linkedin-ghostwriting/" data-page="s-ghostwriting">content</a> under one plan for our clients.</p>`
  },
  a11: {
    tag: 'LinkedIn',
    title: 'Why consistency beats brilliance on LinkedIn every single time',
    meta: '5 min read &middot; LinkedIn &middot; Boldface Playbook',
    body: `<p>Every founder we have worked with has, at some point, published what they believed was their best post. The one they spent the most time on. The one with the sharpest insight, the cleanest structure, the most carefully chosen words. And sometimes it performed well. But more often than not, it was outperformed within the same month by something they wrote in 15 minutes on a Wednesday morning.</p>
<p>This is not a coincidence. It is a pattern. And it has taught us something important about how LinkedIn actually works: <em>the algorithm rewards regularity more than it rewards quality.</em> But more importantly, so do people.</p>
<h3>How trust is actually built online</h3>
<p>Think about the last time you reached out to someone you had been following on LinkedIn. The reason you reached out was not because of one post. It was because of ten posts, or twenty, spread over several months, that consistently made you think a specific thing about that person: that they understand this topic, that they think clearly, that they are worth talking to.</p>
<p>That accumulation of small impressions is how trust is built. No single post creates it. <strong>Consistency is the mechanism. Quality is the content of each individual moment.</strong></p>
<h3>What consistency actually requires</h3>
<p>When most people think about consistency, they imagine an exhausting daily posting schedule that requires them to manufacture opinions they do not have. This is not what we mean. For the founders and executives we work with, consistency means eight to ten posts a month, roughly twice a week, each one specific, honest and worth reading.</p>
<p>That is achievable. It is also, for almost anyone we have worked with, more than they were doing before. The gap between where most leaders are and where they need to be is not a gap of brilliance. It is a gap of regularity.</p>
<h3>The practical implication</h3>
<p>If you are choosing between writing one exceptional post a month and two decent posts a week, choose the two decent posts every time. The exceptional post will be forgotten. The two decent posts, repeated across six months, will build something that cannot be undone: a reputation for showing up.</p>
<p><em>Showing up is the strategy. Everything else is tactics.</em></p>`
  },
  a12: {
    tag: "Company Pages",
    title: "Company page or personal profile: where should founders post?",
    meta: "5 min read &middot; Company Pages &middot; Boldface Playbook",
    body: `<p>Almost every founder asks this question at some point. You have a company to build and limited time. Should your LinkedIn effort go into the company page or your personal profile?</p>
<p>The short answer: mostly your personal profile, with the company page doing a different job alongside it. Here's why, and how to split the work.</p>
<h3>People follow people</h3>
<p>On LinkedIn, people engage with people far more than with logos. A post from a founder about a hard decision they made will almost always travel further than the same story posted by the company page. It feels like a conversation, not an announcement.</p>
<p>That's why, at the early stage especially, the founder's profile is often the company's most effective marketing channel. Investors, candidates and buyers all look up the founder.</p>
<h3>What the company page is for</h3>
<p>The company page still matters. It just does a different job:</p>
<ul>
<li><strong>Proof.</strong> It's where people check that you're real: size, team, what you do, how active you are.</li>
<li><strong>Official news.</strong> Launches, funding, partnerships, awards.</li>
<li><strong>Hiring.</strong> Jobs, culture and the people candidates would work with.</li>
<li><strong>Customer stories.</strong> Case studies and results, told carefully.</li>
</ul>
<p>Think of the page as the shop window and the founder's profile as the person on the shop floor who actually talks to you.</p>
<h3>How to split your effort</h3>
<p>For most early stage founders, something like 80 percent of the effort on the personal profile and 20 percent on the page is a sensible start. As the company grows, shift the balance: add the leadership team, and give the page more to say with customer stories, hiring and launches.</p>
<h3>Make them work together</h3>
<ul>
<li>When the page announces something, the founder adds a personal take on why it matters.</li>
<li>When the founder posts something that does well, the page can reshare it with context.</li>
<li>Leadership team members post from their own expertise, so the company looks like a team, not one person.</li>
<li>Employees get easy, optional prompts to share in their own words.</li>
</ul>
<h3>When the company page should lead</h3>
<p>There are exceptions. Large companies with many leaders, regulated businesses where individuals can't say much, and consumer brands where the product is the story may lean more on the page. Even then, the posts that do best tend to have a person in them.</p>
<h3>The bottom line</h3>
<p>Founders: start with your own profile. Get it <a href="/services/linkedin-profile-optimisation/" data-page="s-profile">positioned properly</a>, post consistently, and let the company page carry the proof. When you're ready to bring in the leadership team and the page, that's what our <a href="/services/linkedin-company-page-management/" data-page="s-company">company page and teams</a> service is for.</p>`
  },
  a13: {
    tag: "Strategy",
    title: "LinkedIn agency, freelancer or in-house: which should you hire?",
    meta: "6 min read &middot; Strategy &middot; Boldface Playbook",
    body: `<p>Once you decide you need help with LinkedIn, there are three real options: a freelancer, an agency, or someone in-house. We run an agency, so we obviously have a side. But each option suits different people, and picking the wrong one wastes months. Here's an honest comparison.</p>
<h3>A freelance ghostwriter</h3>
<p><strong>Good for:</strong> one person who mainly needs posts written, and who's happy to steer the strategy themselves.</p>
<ul>
<li>Usually the most affordable option.</li>
<li>You work directly with the writer, so the voice can get very close.</li>
<li>Quality varies hugely. The best freelancers are excellent and booked up.</li>
<li>Most freelancers write. Fewer handle positioning, networking, newsletters or a company page.</li>
<li>If they get ill, busy or move on, your posting stops.</li>
</ul>
<h3>An in-house hire</h3>
<p><strong>Good for:</strong> larger companies with several leaders and a company page that all need consistent attention.</p>
<ul>
<li>Full-time attention and deep knowledge of the business.</li>
<li>The most expensive option once you count salary, management and tools.</li>
<li>Hard to find one person who can do strategy, sharp writing, design, video and networking.</li>
<li>Often pulled into other marketing work, so LinkedIn slips.</li>
</ul>
<h3>A LinkedIn agency</h3>
<p><strong>Good for:</strong> founders and executives who want the whole thing handled, from positioning to posts to the people they need to know.</p>
<ul>
<li>Strategy, writing, design, newsletters, networking and the company page under one plan.</li>
<li>Continuity: the work doesn't stop when one person is away.</li>
<li>Costs more than a freelancer and less than a senior hire.</li>
<li>The big risk: at many agencies a senior person sells the work and a junior person does it. Ask who will actually write your posts.</li>
</ul>
<h3>Five questions that decide it</h3>
<ul>
<li><strong>Do you need strategy, or just writing?</strong> If you know exactly what you want to say, a good freelancer might be enough.</li>
<li><strong>How many people need to post?</strong> One person suits a freelancer or agency. A whole leadership team plus a page starts to justify an agency or in-house team.</li>
<li><strong>Do you need networking and collaborations too?</strong> Most freelancers don't do this.</li>
<li><strong>How much of your time can you give?</strong> The less time you have, the more strategy and initiative you need from whoever you hire.</li>
<li><strong>What happens if they leave?</strong> Ask about continuity before you sign.</li>
</ul>
<h3>Our honest take</h3>
<p>If you're a founder or executive who wants LinkedIn to bring in real opportunities and you don't have time to run it, an agency where senior people do the work is usually the best value. If you just need a few posts tidied up, hire a good freelancer. If you're a large company with ten leaders, build a small in-house team and bring in specialists where needed.</p>
<p>Whichever you choose, read <a href="/playbook/how-to-choose-a-linkedin-agency-india/" data-article="a14">the ten questions to ask before you hire a LinkedIn agency</a> first. And if you want to see how we do it, here's <a href="/services/" data-page="services">everything we handle</a>.</p>`
  },
  a14: {
    tag: "Strategy",
    title: "How to choose a LinkedIn agency in India: 10 questions to ask first",
    meta: "7 min read &middot; Strategy &middot; Boldface Playbook",
    body: `<p>Search for a LinkedIn agency in India and you'll find dozens that promise the same thing: thought leadership, growth, authority. The websites blur together. The difference shows up three months in, when you either have a voice people recognise or a feed full of posts that sound like everyone else's.</p>
<p>These are the ten questions we'd ask if we were hiring an agency ourselves. A good agency will answer every one of them without flinching.</p>
<h3>1. Who will actually write my posts?</h3>
<p>The most important question. At many agencies a senior person sells the work and a junior writer does it. Ask for the name of the person who'll write for you, and ask to talk to them before you sign.</p>
<h3>2. How will you capture my voice?</h3>
<p>Look for a real process: a long intake call, voice notes, a read through things you've written or said. If the answer is &ldquo;we'll send you a questionnaire&rdquo;, expect generic content.</p>
<h3>3. Do you use automation for outreach or engagement?</h3>
<p>Automated connection requests, comment pods and engagement groups can get accounts restricted and make you look like a spammer. The right answer is a flat no.</p>
<h3>4. What happens before the first post?</h3>
<p>A good agency starts with positioning: what you want to be known for and who you want to reach. If they want to start posting in week one without that, they're selling volume, not strategy.</p>
<h3>5. Do I approve everything?</h3>
<p>Nothing should go out under your name without your sign-off. Ask how approvals work and how long they take you each week.</p>
<h3>6. What do you do beyond writing posts?</h3>
<p>Posts are one part of LinkedIn. Ask whether they handle your profile, a newsletter, networking with the people who matter, collaborations and your company page, or whether you'll need other people for those.</p>
<h3>7. What will you report on?</h3>
<p>Followers and impressions are easy to report and easy to inflate. Ask whether they track inbound: the messages, introductions and opportunities that came from your presence. That's the number that matters.</p>
<h3>8. Can I see real case studies?</h3>
<p>Ask for specific before and after examples with numbers and timeframes. Names may be confidential, but the details shouldn't be vague.</p>
<h3>9. What's the notice period?</h3>
<p>Long lock-ins are a warning sign. A confident agency works month to month with a reasonable notice period, because it expects you to stay for the results.</p>
<h3>10. Will you tell me if we're not a fit?</h3>
<p>Good agencies turn work down. If they'll take anyone who can pay, they won't be selective about the quality of your work either.</p>
<h3>Red flags</h3>
<ul>
<li>Guaranteed follower numbers or &ldquo;viral&rdquo; posts</li>
<li>Packages priced by number of posts with no mention of strategy</li>
<li>Samples that all sound the same, whoever they were written for</li>
<li>Any mention of pods, automation or growth hacks</li>
<li>Pressure to sign a six or twelve month contract up front</li>
</ul>
<p>For what it's worth, here's how we answer these: Koushik plans, writes and runs every engagement, we never use automation, everything is approved by you, and it's a monthly retainer with 30 days' notice. Read the <a href="/work/" data-page="case-studies">case studies</a> and decide for yourself, or compare the options in <a href="/playbook/linkedin-agency-vs-freelancer-vs-in-house/" data-article="a13">agency vs freelancer vs in-house</a>.</p>`
  },
  a15: {
    tag: "Ghostwriting",
    title: "What a LinkedIn ghostwriter actually does, and how to work with one",
    meta: "6 min read &middot; Ghostwriting &middot; Boldface Playbook",
    body: `<p>&ldquo;Ghostwriter&rdquo; makes it sound like someone sits in a room inventing opinions for you. A good LinkedIn ghostwriter does almost the opposite. The job is to get what's already in your head onto the page, sounding like you on a good day.</p>
<h3>What the job actually involves</h3>
<ul>
<li><strong>Positioning.</strong> Working out what you should be known for and who needs to hear it.</li>
<li><strong>Extraction.</strong> Pulling stories, opinions and lessons out of you through calls and voice notes.</li>
<li><strong>Writing.</strong> Turning that raw material into posts with strong first lines and a clear point.</li>
<li><strong>Editing for voice.</strong> Making sure every post sounds like you and not like a writer.</li>
<li><strong>Planning.</strong> A calendar that balances your topics and formats over the month.</li>
<li><strong>Learning.</strong> Watching what works, what doesn't, and adjusting.</li>
</ul>
<p>The writing is maybe a third of the work. The rest is thinking and listening.</p>
<h3>How voice gets captured</h3>
<p>Your voice is the sum of small things: how long your sentences run, which words you'd never use, how direct you are, whether you're funny. A good ghostwriter learns these from how you actually talk. That's why we start every engagement with a long intake call and ask for voice notes, and why the first few weeks involve more back and forth than later on.</p>
<h3>How much of your time it takes</h3>
<p>Less than you'd think, once it's running. A typical rhythm:</p>
<ul>
<li>A monthly call of 30 to 45 minutes to talk through what's on your mind</li>
<li>Voice notes when something happens that's worth a post</li>
<li>Approving drafts, usually on your phone</li>
</ul>
<p>Most of our clients spend under 30 minutes a week.</p>
<h3>Is it honest?</h3>
<p>As long as the ideas, experiences and opinions are yours, yes. Leaders have always had help with speeches, books and op-eds. The line is crossed when a ghostwriter invents experiences or opinions you don't hold. A good one never will.</p>
<h3>How to get great results from a ghostwriter</h3>
<ul>
<li><strong>Be honest in the intake.</strong> The specific, slightly uncomfortable stories make the best posts.</li>
<li><strong>Send raw material.</strong> A two minute voice note after a frustrating meeting is gold.</li>
<li><strong>Give direct feedback.</strong> &ldquo;I'd never say that&rdquo; helps more than polite approval.</li>
<li><strong>Approve quickly.</strong> Timely posts go stale if they sit in your inbox for a week.</li>
<li><strong>Stay engaged with replies.</strong> Comments are where relationships start, so show up there yourself.</li>
</ul>
<h3>What it shouldn't look like</h3>
<p>Posts you don't recognise. Stories that never happened. A tone that changes every week. Engagement bait. If you see these, your ghostwriter is writing for the algorithm, not for you.</p>
<p>If you'd like to see how we approach it, here's our <a href="/services/linkedin-ghostwriting/" data-page="s-ghostwriting">LinkedIn ghostwriting service</a>.</p>`
  },
  a16: {
    tag: "Personal Branding",
    title: "LinkedIn profile optimisation: a section by section checklist",
    meta: "7 min read &middot; Personal Branding &middot; Boldface Playbook",
    body: `<p>Before almost every important meeting, the other person looks you up. Your LinkedIn profile does the selling before you've said a word. This checklist goes section by section. Work through it in order, because the early sections matter most.</p>
<h3>Before you start: positioning</h3>
<p>Write one sentence: &ldquo;I want to be known by [these people] for [this thing].&rdquo; Every section below should support it. If you can't write the sentence, start there. Our guide to <a href="/playbook/linkedin-headline-and-about-section/" data-article="a3">why your LinkedIn bio is quietly killing your credibility</a> helps.</p>
<h3>Photo</h3>
<ul>
<li>Recent, well lit, your face filling most of the frame</li>
<li>Looking at the camera, dressed the way you would for an important meeting</li>
<li>Plain or softly blurred background</li>
</ul>
<h3>Banner</h3>
<ul>
<li>Reinforces your positioning: a line about what you do, your company, your newsletter or a talk</li>
<li>Readable on a phone, where most people will see it</li>
<li>Not a stock photo of a city skyline</li>
</ul>
<h3>Headline</h3>
<ul>
<li>Says what you do, who for and what changes for them</li>
<li>Uses the words your audience would search for</li>
<li>Skips the stack of titles: &ldquo;CEO | Speaker | Mentor | Investor&rdquo; tells nobody anything</li>
</ul>
<h3>About</h3>
<ul>
<li>The first two lines show before &ldquo;see more&rdquo;, so lead with the reader's problem or your point of view</li>
<li>Written in the first person, the way you talk</li>
<li>Includes proof: numbers, outcomes, notable work</li>
<li>Ends with a clear next step: what to message you about, or where to find your newsletter</li>
</ul>
<h3>Featured</h3>
<ul>
<li>Three or four items a stranger should see first</li>
<li>Your best post, a talk or podcast, your newsletter, a case study or your company</li>
<li>Updated every few months</li>
</ul>
<h3>Experience</h3>
<ul>
<li>Outcomes, not duties: what changed because you were there</li>
<li>Current role written with the most care</li>
<li>Older roles kept short</li>
</ul>
<h3>Skills, recommendations and the rest</h3>
<ul>
<li>Top skills match your positioning, not everything you've ever done</li>
<li>Two or three recent recommendations from people your audience respects</li>
<li>A custom profile URL with your name</li>
<li>Creator mode tools, if available to you, with topics that match your positioning</li>
</ul>
<h3>The final test</h3>
<p>Show your profile to someone who doesn't know you for ten seconds, then ask them what you do and who you do it for. If they can't answer, go back to the headline and About.</p>
<p>Want an outside eye? We do <a href="/services/linkedin-audit/" data-page="s-audit">LinkedIn profile audits</a> with a ranked fix list, or <a href="/services/linkedin-profile-optimisation/" data-page="s-profile">rebuild the whole profile</a> for you.</p>`
  },
  a17: {
    tag: "LinkedIn",
    title: "What actually gets reach on LinkedIn in 2026",
    meta: "6 min read &middot; LinkedIn &middot; Boldface Playbook",
    body: `<p>Every few months someone announces a new LinkedIn algorithm hack. Most of them are noise. LinkedIn changes the details often, and it doesn't publish exactly how the feed works. What follows isn't a secret formula. It's what we consistently see working across our clients' accounts, and what consistently doesn't.</p>
<h3>What helps</h3>
<p><strong>Real expertise, clearly shown.</strong> LinkedIn has said it wants to show people knowledge and advice from people who know what they're talking about. Posts that teach something specific, drawn from your own experience, tend to travel further and for longer than general commentary.</p>
<p><strong>A consistent topic.</strong> When you post about the same few subjects, the people who care about them engage, and your posts find more people like them. Jumping between topics makes that harder.</p>
<p><strong>Conversations in the comments.</strong> Thoughtful comments, and your replies to them, are a strong sign that a post is worth showing to more people. Reply to the good ones properly, especially in the first hour or two.</p>
<p><strong>Posts people stop and read.</strong> A strong first line and a post worth finishing matter more than any trick. If people scroll past, nothing else helps.</p>
<p><strong>Native formats.</strong> Document posts and carousels, short video and well formatted text all work when the content is good. Pick the format that suits the idea, not the one someone told you is favoured this month.</p>
<h3>What hurts</h3>
<ul>
<li><strong>Engagement bait.</strong> &ldquo;Comment YES if you agree&rdquo; posts and engagement pods tend to backfire, and LinkedIn has said it demotes them.</li>
<li><strong>Posting and disappearing.</strong> Ignoring the comments on your own post wastes its best moment.</li>
<li><strong>Too many outside links.</strong> In our experience, posts that send people off LinkedIn often travel less far. If a link matters, make the post useful on its own.</li>
<li><strong>Inconsistency.</strong> Three weeks of daily posts and then silence resets the progress you made.</li>
<li><strong>Automation.</strong> Mass connection requests and automated comments put your account at risk.</li>
</ul>
<h3>How often to post</h3>
<p>Two or three strong posts a week beats seven weak ones for most founders and executives. Quality and consistency matter more than volume. That's why we usually plan 8 to 12 posts a month for clients.</p>
<h3>What reach is actually for</h3>
<p>Reach is a means, not the goal. A post seen by 2,000 of the right people beats one seen by 200,000 of the wrong ones. Measure who's engaging and what conversations follow, not only how many impressions you got. Our guide to <a href="/playbook/linkedin-post-types-that-generate-inbound/" data-article="a2">the five post types that actually generate inbound</a> goes deeper.</p>
<p>If you'd like this handled for you, see our <a href="/services/linkedin-ghostwriting/" data-page="s-ghostwriting">LinkedIn content service</a>.</p>`
  },
  a18: {
    tag: "Personal Branding",
    title: "LinkedIn personal branding for founders in India: the complete guide",
    meta: "9 min read &middot; Personal Branding &middot; Boldface Playbook",
    body: `<p>In India, LinkedIn has become the place where founders get checked out. Investors, enterprise buyers, senior candidates and journalists all look you up there first. This guide brings together everything we've learned running LinkedIn for 35+ founders and executives across India, Dubai and Abu Dhabi.</p>
<h3>Why it matters for Indian founders</h3>
<p>India is one of LinkedIn's largest markets, with well over 100 million members, and most founders still don't use it well. That's the opportunity. A founder with a clear point of view and a steady presence stands out quickly, and the benefits reach every part of the business:</p>
<ul>
<li><strong>Fundraising.</strong> Investors arrive at the meeting already knowing how you think.</li>
<li><strong>Sales.</strong> B2B buyers trust founders they've read for months.</li>
<li><strong>Hiring.</strong> Good people want to work for founders they respect.</li>
<li><strong>Partnerships and invitations.</strong> Speaking slots, podcasts and collaborations find you.</li>
</ul>
<h3>Step 1: Positioning</h3>
<p>Decide what you want to be known for, and by whom. Not your company's tagline: your point of view. A fintech founder might want to be known for a sharp take on credit for small businesses. A D2C founder might want to be known as the person who understands Tier 2 consumers better than anyone. Pick three or four topics you'll own.</p>
<h3>Step 2: Profile</h3>
<p>Rebuild your profile around that position. Headline, About, Featured, experience and banner should all say the same thing. Our <a href="/playbook/linkedin-profile-optimisation-checklist/" data-article="a16">section by section profile checklist</a> walks through it.</p>
<h3>Step 3: Posts</h3>
<p>Two or three posts a week is plenty. The ones that work for founders tend to be:</p>
<ul>
<li>Decisions you made and why</li>
<li>Mistakes and what they taught you</li>
<li>What you see in your market that others miss</li>
<li>Lessons from customers, told carefully</li>
<li>Behind the scenes of building the company</li>
</ul>
<p>Write the first line with care; it decides whether anyone reads the rest. Our guide to <a href="/playbook/how-to-write-a-linkedin-hook/" data-article="a1">writing hooks</a> helps.</p>
<h3>Step 4: Newsletter</h3>
<p>Once you're posting consistently, a newsletter gives your most engaged followers more depth and lands in their notifications and email. Read <a href="/playbook/how-to-start-a-linkedin-newsletter/" data-article="a6">how to start a LinkedIn newsletter people actually open</a>.</p>
<h3>Step 5: Networking</h3>
<p>Content gets you seen. Networking gets you in the room. Build a list of the people who matter, comment on their posts with something useful, and connect with a short, personal note. Never automate it. Here's <a href="/playbook/linkedin-networking-without-spam/" data-article="a10">how to network without being that person</a>.</p>
<h3>Step 6: Collaborations</h3>
<p>Borrow audiences: co-written posts with respected peers, podcast and LinkedIn Live guest spots, and events. It's the fastest way to reach people who don't know you yet.</p>
<h3>Step 7: Your company page and team</h3>
<p>When the founder's presence is working, bring in the leadership team and give the company page more to say. Read <a href="/playbook/company-page-vs-personal-profile/" data-article="a12">company page or personal profile</a> for how to split the effort.</p>
<h3>How long it takes</h3>
<ul>
<li>Engagement and follower growth: four to six weeks</li>
<li>Inbound conversations: usually three to six months</li>
<li>Being known for something in your industry: six to twelve months</li>
</ul>
<p>For reference, a fintech founder in Mumbai we worked with went from 400 to 12,000 followers in nine months. A D2C beauty founder in Bangalore reached 8,000 in six months.</p>
<h3>What to measure</h3>
<p>Track inbound first: messages, introductions and opportunities that trace back to your presence. Then reach among the right people, whether people link your name to your topics, and who's new in your network. Follower counts come last.</p>
<h3>Doing it yourself vs getting help</h3>
<p>If you write well and can protect a few hours a week, you can do all of this yourself. If you can't, <a href="/playbook/linkedin-agency-vs-freelancer-vs-in-house/" data-article="a13">compare an agency, a freelancer and an in-house hire</a>, or see <a href="/for/founders/" data-page="for-founders">how we work with founders</a>.</p>`
  }
};

var articlesMeta = {
  a18: {tag:"Personal Branding", title:"LinkedIn personal branding for founders in India: the complete guide"},
  a1: {tag:"LinkedIn", title:"How to write a hook that does not start with I"},
  a2: {tag:"Content Strategy", title:"The 5 post types that actually generate inbound"},
  a16: {tag:"Personal Branding", title:"LinkedIn profile optimisation: a section by section checklist"},
  a3: {tag:"Personal Branding", title:"Why your LinkedIn bio is quietly killing your credibility"},
  a6: {tag:"Newsletters", title:"How to start a LinkedIn newsletter people actually open"},
  a10: {tag:"Networking", title:"How to network on LinkedIn without being that person"},
  a15: {tag:"Ghostwriting", title:"What a LinkedIn ghostwriter actually does, and how to work with one"},
  a4: {tag:"Strategy", title:"How to build a content strategy in 90 minutes"},
  a17: {tag:"LinkedIn", title:"What actually gets reach on LinkedIn in 2026"},
  a5: {tag:"LinkedIn", title:"The comment that got me three clients in one week"},
  a12: {tag:"Company Pages", title:"Company page or personal profile: where should founders post?"},
  a7: {tag:"LinkedIn", title:"The C-suite guide to LinkedIn"},
  a9: {tag:"Personal Branding", title:"The personal brand toolkit every CFO should have"},
  a13: {tag:"Strategy", title:"LinkedIn agency, freelancer or in-house: which should you hire?"},
  a14: {tag:"Strategy", title:"How to choose a LinkedIn agency in India: 10 questions to ask first"},
  a8: {tag:"Content Strategy", title:"How to write about failure on LinkedIn without it backfiring"},
  a11: {tag:"LinkedIn", title:"Why consistency beats brilliance on LinkedIn every single time"}
};

var articleExcerpts = {
  a18: "Positioning, profile, posts, newsletter, networking and time. Everything an Indian founder needs to build a personal brand on LinkedIn, in one place.",
  a1: "The first line of your post has one job: stop the scroll. Most people fail it the same predictable way.",
  a2: "Most LinkedIn content earns likes. Very little earns business. These five formats actually move the needle.",
  a16: "Your profile does the selling before you speak. A practical checklist for every section, from photo to experience.",
  a3: "You have three seconds. Your headline and About section are either working for you or quietly failing you.",
  a6: "A newsletter is the closest thing LinkedIn has to an owned channel. Most die by issue four. Here is how to start one that lasts.",
  a10: "Everyone has had the pitch slapped into their DMs seconds after connecting. Here is how to build real relationships on LinkedIn instead.",
  a15: "Ghostwriting is less about writing than people think. What a good LinkedIn ghostwriter really does, and how to get the best out of one.",
  a4: "Not an over-engineered plan that collapses in two weeks. A framework you can build in one sitting.",
  a17: "Forget the hacks. What we see working across our clients' accounts, and what quietly kills reach.",
  a5: "Strategic commenting is the most underused growth lever on LinkedIn. Here is exactly how it works.",
  a12: "Your company page and your personal profile do different jobs. Most founders put their effort in the wrong place. Here is how to split it.",
  a7: "Not a lecture. A practical case for why your absence online is costing you things you care about.",
  a9: "The CFO has the most underused personal brand in the C-suite. Here is exactly what to build.",
  a13: "Three ways to get your LinkedIn done for you, each with real trade-offs. An honest comparison, from people who obviously have a side.",
  a14: "Every LinkedIn agency's website sounds the same. These ten questions separate the good ones from the ones that will cost you six months.",
  a8: "Failure posts are the most powerful content on LinkedIn. They are also the most commonly botched.",
  a11: "The strongest personal brands are not built by the best writers. They are built by the most consistent ones."
};



var PAGE_SEO = {
  "home": { path: "/", title: "Boldface | The LinkedIn Agency for Founders, CEOs and Executives", desc: "Boldface runs your entire LinkedIn: profile, posts, newsletter, networking, collaborations and company pages, for founders, CEOs and executives in India, Dubai and Abu Dhabi. Book a free 30 minute strategy call." },
  "services": { path: "/services/", title: "LinkedIn Services: Profile, Content, Newsletters, Networking | Boldface", desc: "Profile and positioning, ghostwritten content, newsletter management, strategic networking, collaborations, company pages, audits and workshops. Everything on LinkedIn, handled." },
  "case-studies": { path: "/work/", title: "Case Studies | LinkedIn Results for Founders and Executives | Boldface", desc: "Real, documented case studies: LinkedIn audiences grown from scratch, inbound pipelines built and founder brands made visible across India and beyond." },
  "results": { path: "/results/", title: "Results | LinkedIn Growth, Reach and Inbound | Boldface", desc: "Follower growth, impression growth and inbound Boldface has delivered on LinkedIn for founders, executives and consultants." },
  "playbook": { path: "/playbook/", title: "The LinkedIn Playbook | Free Personal Branding Guides | Boldface", desc: "Eighteen free, practical guides on LinkedIn, personal branding, founder visibility and ghostwriting. The Boldface Playbook." },
  "about": { path: "/about/", title: "About Boldface | LinkedIn Studio in Bangalore", desc: "Boldface is a LinkedIn studio led by Koushik Agarwalla, running LinkedIn end to end for founders and executives across India, Dubai and Abu Dhabi." },
  "faq": { path: "/faq/", title: "FAQ | LinkedIn Management Questions | Boldface", desc: "How long results take, how ghostwriting captures your voice, how networking works, what engagements cost and how Boldface works. Honest answers." },
  "process": { path: "/process/", title: "Our Process | First Call to Live Content in 21 Days | Boldface", desc: "The exact week by week Boldface process: intake, positioning, profile rebuild, then content, newsletter, networking and collaborations every month." },
  "contact": { path: "/contact/", title: "Contact Boldface | Book a LinkedIn Strategy Call", desc: "Talk to Boldface about your LinkedIn: profile, content, newsletter, networking or company page. Book a free 30 minute call or reach out on WhatsApp, email or LinkedIn." },
  "s-profile": { path: "/services/linkedin-profile-optimisation/", title: "LinkedIn Profile Optimisation for Founders and Executives | Boldface", desc: "LinkedIn profile optimisation done properly: positioning, headline, About, Featured and experience rewritten so the right people get you in ten seconds. For founders and leaders in India and the UAE.", parent: "services" },
  "s-ghostwriting": { path: "/services/linkedin-ghostwriting/", title: "LinkedIn Ghostwriting for CEOs and Founders | Content Written in Your Voice | Boldface", desc: "LinkedIn ghostwriting for founders, CEOs and executives: 8 to 12 posts a month in your voice, plus carousels, short video and articles. Planned, written, designed and posted for you.", parent: "services" },
  "s-newsletter": { path: "/services/linkedin-newsletter-management/", title: "LinkedIn Newsletter Management and Writing Service | Boldface", desc: "We name, set up, plan, write and grow your LinkedIn newsletter. Every issue in your voice, published on schedule, with subscriber growth built in. For founders and executives.", parent: "services" },
  "s-networking": { path: "/services/linkedin-networking/", title: "Strategic LinkedIn Networking for Founders, No Automation | Boldface", desc: "Strategic LinkedIn networking done by people, not bots: a target list of investors, buyers and partners, personal connection notes, thoughtful comments and DM replies drafted for you.", parent: "services" },
  "s-collabs": { path: "/services/linkedin-collaborations/", title: "LinkedIn Collaborations, Lives, Events and Brand Partnerships | Boldface", desc: "Grow on LinkedIn by borrowing the right audiences: co-written posts with peers, podcast and LinkedIn Live guest spots, LinkedIn events and paid brand partnerships, set up and run for you.", parent: "services" },
  "s-company": { path: "/services/linkedin-company-page-management/", title: "LinkedIn Company Page Management and Employee Advocacy | Boldface", desc: "LinkedIn company page management that works through your people: page content and growth, leadership team profiles and posts, and employee posts made easy to share. One story across every account.", parent: "services" },
  "s-audit": { path: "/services/linkedin-audit/", title: "LinkedIn Profile Audit and LinkedIn Workshops for Teams | Boldface", desc: "A LinkedIn audit of your profile and content with a written fix list ranked by impact, or a hands-on LinkedIn workshop for your leadership team. For people who'd rather do it themselves.", parent: "services" },
  "for-founders": { path: "/for/founders/", title: "LinkedIn Personal Branding for Startup Founders | Boldface", desc: "LinkedIn personal branding for startup founders: positioning, ghostwritten posts, networking with investors and buyers, and a profile that sells before you speak. India, Dubai and Abu Dhabi." },
  "for-ceos": { path: "/for/ceos/", title: "Executive Branding on LinkedIn for CEOs and the C-suite | Boldface", desc: "Executive branding and LinkedIn ghostwriting for CEOs, CTOs, COOs and the C-suite: positioning, posts in your voice, a newsletter and networking, with under 30 minutes of your time a week." },
  "for-cfos": { path: "/for/cfos/", title: "LinkedIn Personal Branding for CFOs and Finance Leaders | Boldface", desc: "LinkedIn for CFOs and finance leaders: a profile that shows your judgement, posts that make finance readable, and a network that brings board roles, speaking invitations and advisory work." },
  "for-consultants": { path: "/for/consultants/", title: "LinkedIn for Consultants, Coaches, CAs and Legal Advisors | Boldface", desc: "LinkedIn for consultants, coaches, chartered accountants and legal advisors: positioning, ghostwritten posts and networking that bring in clients who already understand what you do." },
  "in-india": { path: "/linkedin-agency/india/", title: "LinkedIn Agency in India for Founders and Executives | Boldface", desc: "Boldface is a LinkedIn agency in India: personal branding, ghostwriting, newsletters, networking and company pages for founders, CEOs and executives in Bangalore, Mumbai, Delhi, Pune, Hyderabad and beyond." },
  "in-bangalore": { path: "/linkedin-agency/bangalore/", title: "LinkedIn Agency in Bangalore | Personal Branding for Founders | Boldface", desc: "A Bangalore LinkedIn agency for founders, CEOs and executives: personal branding, ghostwriting, newsletters, networking and company pages. Book a free 30 minute call." },
  "in-dubai": { path: "/linkedin-agency/dubai/", title: "LinkedIn Agency in Dubai for Founders, CEOs and Consultants | Boldface", desc: "LinkedIn personal branding, ghostwriting, networking and company page management for founders, CEOs and consultants in Dubai and the UAE, run remotely in a time zone just 90 minutes from ours." },
  "in-abu-dhabi": { path: "/linkedin-agency/abu-dhabi/", title: "LinkedIn Agency in Abu Dhabi for Executives and Founders | Boldface", desc: "LinkedIn personal branding and ghostwriting for executives, founders and advisors in Abu Dhabi: positioning, posts, newsletters, networking and company pages, run for you." }
};
var ART = {
  a1: { path: "/playbook/how-to-write-a-linkedin-hook/", title: "How to write a hook that does not start with I", desc: "How to write a LinkedIn hook that stops the scroll, and why the first line should almost never start with I. Practical examples from the Boldface Playbook." },
  a2: { path: "/playbook/linkedin-post-types-that-generate-inbound/", title: "The 5 post types that actually generate inbound", desc: "Most LinkedIn content earns likes, not business. The five post types that actually generate inbound for founders, executives and consultants." },
  a3: { path: "/playbook/linkedin-headline-and-about-section/", title: "Why your LinkedIn bio is quietly killing your credibility", desc: "Your LinkedIn headline and About section decide your credibility in three seconds. How to rewrite both so the right people take you seriously." },
  a4: { path: "/playbook/linkedin-content-strategy-in-90-minutes/", title: "How to build a content strategy in 90 minutes", desc: "How to build a LinkedIn content strategy in one 90 minute sitting: pillars, formats and a rhythm you can actually keep up." },
  a5: { path: "/playbook/linkedin-commenting-strategy/", title: "The comment that got me three clients in one week", desc: "Strategic commenting is the most underused growth lever on LinkedIn. How one comment led to three clients in a week, and how to do it yourself." },
  a7: { path: "/playbook/linkedin-for-c-suite-executives/", title: "The C-suite guide to LinkedIn", desc: "The C-suite guide to LinkedIn: why your absence online costs you board roles, hires and deals, and what to do about it without becoming a creator." },
  a8: { path: "/playbook/writing-about-failure-on-linkedin/", title: "How to write about failure on LinkedIn without it backfiring", desc: "Failure posts are some of the most powerful content on LinkedIn and the most often botched. How to write about failure without it backfiring." },
  a9: { path: "/playbook/linkedin-personal-brand-for-cfos/", title: "The personal brand toolkit every CFO should have", desc: "The personal brand toolkit every CFO should have: what to post, how to position yourself and why finance leaders are the most underused voices on LinkedIn." },
  a11: { path: "/playbook/linkedin-consistency/", title: "Why consistency beats brilliance on LinkedIn every single time", desc: "Why consistency beats brilliance on LinkedIn. The strongest personal brands aren't built by the best writers but by the people who keep showing up." },
  a6: { path: "/playbook/how-to-start-a-linkedin-newsletter/", title: "How to start a LinkedIn newsletter people actually open", desc: "How to start a LinkedIn newsletter that people open: picking a name and angle, how often to publish, what to write, and how to grow subscribers without begging." },
  a10: { path: "/playbook/linkedin-networking-without-spam/", title: "How to network on LinkedIn without being that person", desc: "How to network on LinkedIn without spamming: build a target list, comment before you connect, write connection notes that get accepted, and turn DMs into meetings." },
  a12: { path: "/playbook/company-page-vs-personal-profile/", title: "Company page or personal profile: where should founders post?", desc: "Should founders post on the LinkedIn company page or their personal profile? What each one is for, why personal posts usually reach further, and how to run both together." },
  a13: { path: "/playbook/linkedin-agency-vs-freelancer-vs-in-house/", title: "LinkedIn agency, freelancer or in-house: which should you hire?", desc: "Should you hire a LinkedIn agency, a freelance ghostwriter or someone in-house? An honest comparison of cost, quality, voice, consistency and control for founders and executives." },
  a14: { path: "/playbook/how-to-choose-a-linkedin-agency-india/", title: "How to choose a LinkedIn agency in India: 10 questions to ask first", desc: "How to choose the best LinkedIn agency in India for you: ten questions to ask about who writes, automation, voice, reporting, contracts and results before you sign." },
  a15: { path: "/playbook/what-a-linkedin-ghostwriter-does/", title: "What a LinkedIn ghostwriter actually does, and how to work with one", desc: "What does a LinkedIn ghostwriter do? How ghostwriting works for founders and executives, how voice is captured, how much time it takes you, and how to get great results." },
  a16: { path: "/playbook/linkedin-profile-optimisation-checklist/", title: "LinkedIn profile optimisation: a section by section checklist", desc: "A complete LinkedIn profile optimisation checklist for founders and executives: photo, banner, headline, About, Featured, experience, skills and recommendations, section by section." },
  a17: { path: "/playbook/what-gets-reach-on-linkedin/", title: "What actually gets reach on LinkedIn in 2026", desc: "What gets reach on LinkedIn in 2026: what we see working across client accounts, from expertise and comments to formats, timing and the habits that quietly kill your reach." },
  a18: { path: "/playbook/linkedin-personal-branding-for-founders-india/", title: "LinkedIn personal branding for founders in India: the complete guide", desc: "The complete guide to LinkedIn personal branding for founders in India: positioning, profile, what to post, newsletters, networking, collaborations, timelines and measuring what matters." }
};


/* ==========================================================
   VAANI · Boldface's assistant
   Local conversational engine: hand-written intents + BM25 retrieval
   over every page, case study, FAQ and Playbook article on the site.
   Optional: set window.VAANI_ENDPOINT to a server that proxies an LLM;
   Vaani will send it the question plus the best matching site passages.
   ========================================================== */
var Vaani = (function () {
  var CAL = "https://calendly.com/boldfaceonline/30min", WA = "https://wa.me/917077247111";
  var cal = function (t) { return '<a href="' + CAL + '" target="_blank" rel="noopener">' + (t || "book a 30-minute call") + "</a>"; };
  var wa = function (t) { return '<a href="' + WA + '" target="_blank" rel="noopener">' + (t || "WhatsApp us") + "</a>"; };
  var mail = function (e) { e = e || "koushik@boldface.click"; return '<a href="mailto:' + e + '">' + e + "</a>"; };
  var pg = function (id, t) { return '<a href="' + (PAGE_SEO[id] ? PAGE_SEO[id].path : "/") + '" data-page="' + id + '">' + t + "</a>"; };
  var art = function (id) { return '<a href="' + ART[id].path + '" data-article="' + id + '">' + articlesMeta[id].title + "</a>"; };
  var pick = function (arr) { return arr[Math.floor(Math.random() * arr.length)]; };
  var mem = { name: null, topic: null, last: null, turns: 0, pass: [], passI: 0, role: null };
  var nm = function () { return mem.name ? ", " + mem.name : ""; };

  /* ---------- text utils ---------- */
  var STOP = {}; ("a an the is are am was were be been being do does did i you we us our your yours my me to of in on for and or with at by from it this that these those what whats how can could would should will shall about any some just please tell know want need get have has had there their they them so if then than as into its im ive id u ur pls plz hey hi hello also really very much more like one can't cant dont don't does doesnt your you're youre who whom which when where why yes no ok okay").split(" ").forEach(function (w) { STOP[w] = 1; });
  function stem(w) {
    if (w.length <= 3) return w;
    return w.replace(/(ational|ization|ations|ation|ments|ment|ingly|ings|ing|edly|ed|ies|es|ly|s)$/, function (m) { return w.length - m.length >= 3 ? (m === "ies" ? "y" : "") : m; });
  }
  var SYN = {
    price: "cost fee fees charge charges pricing rate rates budget expensive cheap afford money pay paying retainer invoice package packages",
    linkedin: "li linkedin post posts posting profile feed followers connections",
    pr: "press media journalist journalists publication publications coverage newspaper news article feature features interview op-ed oped forbes",
    write: "ghostwrite ghostwriting ghostwriter writer writing content copy draft drafts",
    time: "long quick fast soon weeks months timeline time duration speed",
    contact: "reach call talk phone number email mail whatsapp book booking meeting calendly appointment schedule",
    result: "results outcome outcomes roi proof growth numbers stats metrics impact",
    case: "case cases example examples client clients work portfolio story stories"
  };
  var SYNIDX = {}; Object.keys(SYN).forEach(function (k) { SYN[k].split(" ").concat([k]).forEach(function (w) { SYNIDX[stem(w)] = stem(k); }); });
  function toks(t, expand) {
    var out = [];
    String(t).toLowerCase().replace(/[’']/g, "").replace(/[^a-z0-9+ ]/g, " ").split(/\s+/).forEach(function (w) {
      if (!w || STOP[w]) return;
      var s = stem(w); out.push(s);
      if (expand && SYNIDX[s] && SYNIDX[s] !== s) out.push(SYNIDX[s]);
    });
    return out;
  }
  function strip(h) { var d = document.createElement("div"); d.innerHTML = h; return (d.textContent || "").replace(/\s+/g, " ").trim(); }

  /* ---------- knowledge index (built from the live site) ---------- */
  var P = null, DF = {}, AVG = 0;
  function build() {
    if (P) return; hydrate(); P = [];
    function add(text, meta) { text = text.replace(/\s+/g, " ").trim(); if (text.length < 40) return; var t = toks(text, true); P.push({ text: text, t: t, page: meta.page, art: meta.art, title: meta.title || "" }); }
    document.querySelectorAll("main.pg").forEach(function (m) {
      var id = m.id;
      m.querySelectorAll(".acc-item").forEach(function (it) { add(it.querySelector(".t").textContent + " " + it.querySelector(".acc-a").textContent, { page: id, title: "FAQ" }); });
      m.querySelectorAll(".cs-item").forEach(function (it) {
        var who = it.querySelector(".who").textContent, tt = it.querySelector(".tt").textContent;
        var res = Array.prototype.map.call(it.querySelectorAll(".cs-res div"), function (d) { return (d.querySelector("b").textContent + " " + d.querySelector(".mono").textContent.toLowerCase()).trim(); }).join(", ");
        add(who + ". " + tt + ". Results: " + res + ".", { page: id, title: who });
        it.querySelectorAll(".cs-txt p").forEach(function (p) { add(who + ": " + p.textContent, { page: id, title: who }); });
      });
      m.querySelectorAll(".rc").forEach(function (rc) { add(rc.textContent, { page: id, title: "Results" }); });
      m.querySelectorAll("p, li, .srow, .tl-item, .member, .who-grid > div, .measure > div").forEach(function (el) {
        if (el.closest(".acc-item, .cs-item, .rc, #pb-article, .search, .namecard")) return;
        add(el.textContent, { page: id });
      });
    });
    Object.keys(articles).forEach(function (k) {
      var a = articles[k], tmp = document.createElement("div"); tmp.innerHTML = a.body;
      var chunk = "", title = strip(a.title);
      Array.prototype.forEach.call(tmp.children, function (el) {
        chunk += " " + el.textContent;
        if (chunk.length > 260) { add(title + ". " + chunk, { art: k, title: title }); chunk = ""; }
      });
      if (chunk) add(title + ". " + chunk, { art: k, title: title });
    });
    var tot = 0;
    P.forEach(function (p) { tot += p.t.length; var seen = {}; p.t.forEach(function (w) { if (!seen[w]) { seen[w] = 1; DF[w] = (DF[w] || 0) + 1; } }); });
    AVG = tot / P.length;
  }
  function search(q, n) {
    build();
    var qt = toks(q, true); if (!qt.length) return [];
    var N = P.length, res = [];
    P.forEach(function (p) {
      var tf = {}, s = 0; p.t.forEach(function (w) { tf[w] = (tf[w] || 0) + 1; });
      qt.forEach(function (w) {
        if (!tf[w]) return;
        var idf = Math.log(1 + (N - DF[w] + 0.5) / (DF[w] + 0.5));
        s += idf * (tf[w] * 2.2) / (tf[w] + 1.2 * (0.25 + 0.75 * p.t.length / AVG));
      });
      if (s > 0) res.push({ p: p, s: s });
    });
    res.sort(function (a, b) { return b.s - a.s; });
    return res.slice(0, n || 4);
  }
  function bestSentences(text, q) {
    var qt = toks(q, true), ss = text.match(/[^.!?]+[.!?]+["”]?/g) || [text];
    var scored = ss.map(function (s, i) { var t = toks(s, true), sc = 0; qt.forEach(function (w) { if (t.indexOf(w) > -1) sc++; }); return { s: s.trim(), sc: sc, i: i }; });
    var top = scored.slice().sort(function (a, b) { return b.sc - a.sc; }).slice(0, 2).sort(function (a, b) { return a.i - b.i; });
    var out = top.map(function (x) { return x.s; }).join(" ");
    return out.length > 30 ? out : ss.slice(0, 2).join(" ");
  }
  function source(p) {
    if (p.art) return " It's from our guide " + art(p.art) + ", if you want the full read.";
    var map = { "case-studies": "the " + pg("case-studies", "Work") + " page", results: "the " + pg("results", "Results") + " page", faq: "the " + pg("faq", "FAQ"), process: "the " + pg("process", "Process") + " page", services: "the " + pg("services", "Services") + " page", about: "the " + pg("about", "About") + " page", contact: "the " + pg("contact", "Contact") + " page", home: "our " + pg("home", "home page") };
    return map[p.page] ? " There's more on " + map[p.page] + "." : "";
  }
  function fromPassage(r, q, lead) {
    var txt = r.p.text.replace(/^[^:]{0,60}:\s/, function (m) { return r.p.title && m.indexOf(r.p.title) === 0 ? "" : m; });
    var body = /Results: /.test(txt) && txt.length < 400 ? txt.replace("Results: ", "The results: ") : bestSentences(txt, q);
    return (lead === undefined ? pick(["", "Here's the short version. ", "Good question. "]) : lead) + body + source(r.p);
  }

  /* ---------- roles / industries ---------- */
  var ROLES = [
    { re: /\b(cfo|finance head|chief financial|finance)\b/i, k: "cfo", a: "Then you're in good company. One of our clients was a CFO at a mid-cap company in Pune who had 18 years of experience and almost no public presence. In eight months he went to 5,200 followers and an expert feature on corporate governance. CFOs are some of the most under-used voices on LinkedIn, honestly." },
    { re: /\b(lawyer|legal|advocate|law firm|attorney|counsel)\b/i, k: "legal", a: "Lawyers often assume LinkedIn won't work for them. One of ours, an independent corporate lawyer in Hyderabad, tripled his inbound in six months and built 7,000 followers by writing about the legal mistakes founders make in term sheets, ESOPs and shareholder agreements." },
    { re: /\b(ca|chartered accountant|accountant|tax|audit)\b/i, k: "ca", a: "We worked with a chartered accountant who left the Big Four to start his own practice in Delhi. Six months later he had 6,500 followers and two to four qualified inbound enquiries every week." },
    { re: /\b(d2c|dtc|skincare|beauty|cosmetic|consumer brand|ecommerce|e-commerce)\b/i, k: "d2c", a: "D2C is a great fit. A skincare founder in Gurgaon went from invisible to 8,000 followers, media features and two industry panels, and people started finding the brand through her story instead of ads." },
    { re: /\b(saas|b2b|tech|software|startup|hr tech|ai)\b/i, k: "saas", a: "We've done a fair bit of B2B tech. An HR tech founder in Bangalore landed three major media features in four months, and a manufacturing SaaS founder in Chennai hit 5,000 followers and a national feature in three months." },
    { re: /\b(fintech|bank|banking|payments|lending)\b/i, k: "fintech", a: "Fintech is where one of our favourite stories comes from: a Mumbai founder who started with 400 followers and reached 12,000 in nine months, with three media features. By month six, journalists were reaching out to him." },
    { re: /\b(consultant|consulting|advisor|adviser|coach|coaching|freelancer)\b/i, k: "consult", a: "Consultants and coaches get some of the fastest wins because inbound is the whole game. A Pune strategy consultant tripled inbound leads in 90 days, and a Dubai management consultant got onto the speaking circuit with three talks in a year." },
    { re: /\b(edtech|education|learning|l&d|university|school)\b/i, k: "edtech", a: "We helped a London EdTech founder break into India from zero: three EdTech media features and two corporate partnerships in four months." },
    { re: /\b(doctor|healthcare|health|hospital|pharma|clinic|real estate|realty|architect|designer|hospitality)\b/i, k: "other", a: "We haven't published a case study in that exact space yet, but the method doesn't change much by industry: find the opinion only you can own, show up consistently, and build the right network around it. Worth a quick chat to see how it'd apply to you." }
  ];

  /* ---------- intents ---------- */
  var I = [
    { id: "greet", re: /^(hi+|hey+|hello+|yo|hola|namaste|good (morning|afternoon|evening)|sup|what'?s up)\b[!. ]*$/i, r: function () { return pick(["Hey" + nm() + "! What would you like to know about Boldface?", "Hi" + nm() + ". Ask me anything: services, pricing, results, how it works.", "Hello" + nm() + "! Happy to help. What's on your mind?"]); }, chips: ["What do you do?", "Pricing", "Show me results"] },
    { id: "how", re: /\bhow (are|r) (you|u)\b|how'?s it going|how do you do/i, r: function () { return pick(["Doing well, thanks for asking" + nm() + ". How can I help?", "All good here. Busy reading about LinkedIn hooks, as usual. What can I do for you?"]); } },
    { id: "thanks", re: /\b(thanks|thank you|thx|ty|appreciate|cheers|great help|helpful)\b/i, r: function () { return pick(["Anytime" + nm() + ". If you'd like to take it further, you can " + cal() + ".", "Happy to help. Anything else you want to know?", "You're welcome! I'm here if anything else comes up."]); } },
    { id: "bye", re: /^(bye|goodbye|see ya|see you|cya|later|ttyl|good night)\b/i, r: function () { return "Take care" + nm() + ". When you're ready, you can " + cal() + " or " + wa("drop us a WhatsApp") + "."; } },
    { id: "bot", re: /\b(are you (a )?(bot|human|real|ai|robot|person)|who are you|what are you|your name|who is vaani|you human)\b/i, r: function () { return "I'm Vaani, Boldface's assistant. I'm not a person, but I know this website inside out: every service, case study, FAQ and Playbook guide. For anything I can't answer, Koushik replies personally within a day."; } },
    { id: "human", re: /\b(talk|speak|chat|connect) (to|with) (a |an )?(human|person|someone|real|koushik|founder|team)|real person|human please|call me|callback|call back/i, r: function () { return "Of course. The quickest way to reach a human is to " + cal() + " (it goes straight into Koushik's calendar), or " + wa() + " on +91 70772 47111. You can also email " + mail() + "."; } },
    { id: "book", re: /\b(book|schedule|set up|arrange|fix)\b.*\b(call|meeting|chat|slot|time|consult)|\bcalendly\b|free call|discovery call|consultation|let'?s talk|get started|sign up|start working|hire you|work with you/i, r: function () { return pick(["Love that. Here's the link to " + cal("book a free 30-minute call") + ". You'll speak with Koushik directly. No pitch deck, just a straight conversation about where you are and what's realistic.", "Perfect. Grab any open slot here: " + cal("calendly.com/boldfaceonline/30min") + ". It's free, 30 minutes, and you'll leave with a clear plan either way."]); }, chips: ["What happens on the call?", "Pricing"] },
    { id: "callwhat", re: /what happens (on|in|during) the (first )?call|first call|bring to the call|prepare for the call/i, r: function () { return "It's 30 minutes with Koushik. He'll ask about your goals, where you are now, who you want to reach and your constraints. You don't need a brief or a deck. You'll leave knowing what we'd do, how long it would take and what it would cost. " + cal("Book it here") + "."; } },
    { id: "price", re: /\b(price|pricing|cost|costs|charge|fee|fees|how much|budget|expensive|cheap|afford|rates?|retainer|package|quote|inr|usd|rupees|lakh|dollars?)\b/i, r: function () { return pick(["Honest answer: there are no fixed packages, because a founder who wants a newsletter is a different job from a CEO who wants their whole LinkedIn plus the company page run. Everything runs as a monthly retainer with 30 days' notice and no lock-in. On a " + cal("30-minute call") + " you'll get an actual number, not a range.", "It's a monthly retainer, scoped to what you actually need: one piece, like a newsletter or networking, or your entire LinkedIn. No long contracts, 30 days' notice. The fastest way to a real figure is a " + cal("free 30-minute call") + "."]); }, chips: ["What's included?", "Contract terms", "Book a call"] },
    { id: "contract", re: /\b(contract|lock.?in|notice period|cancel|pause|stop|exit|minimum|commitment|terms)\b/i, r: function () { return "Monthly retainer, 30 days' notice. No lock-in, no penalty clauses, no complicated exit terms. If something isn't working, we'd rather hear it on a call than find out when you go quiet."; } },
    { id: "what", re: /\b(what (do|does) (you|boldface)(?! (track|measure|report|charge|cost))|what is boldface|services|what you offer|offerings|what can you do|help me with|tell me about boldface|about you|about boldface|what'?s included)\b/i, r: function () { mem.topic = "services"; return "Boldface runs LinkedIn end to end for founders, CEOs and executives:<br><br><b>1. Profile &amp; positioning:</b> what you should be known for, and a profile rebuilt around it.<br><b>2. Content:</b> 8 to 12 posts a month in your voice, plus carousels, short video and articles.<br><b>3. Newsletter:</b> set up, written and grown for you.<br><b>4. Strategic networking:</b> a list of people who matter, worked by hand every week.<br><b>5. Collaborations &amp; events:</b> co-written posts, podcasts, LinkedIn Lives and brand partnerships.<br><b>6. Company pages &amp; teams:</b> your page plus your leadership team.<br><br>There are also one-off audits and workshops. " + pg("services", "See every service") + "."; }, chips: ["Networking", "Newsletters", "Pricing"] },
    { id: "linkedin", weak: 1, re: /\b(linkedin (management|service|ghostwrit|manage|growth)|manage (my )?linkedin|run my linkedin|posts? (per|a|each) (month|week)|how many posts|profile (rewrite|optimi[sz]|audit))/i, r: function () { mem.topic = "linkedin"; return "We run your entire LinkedIn: a sharper profile (headline, About, Featured, banner), a monthly content plan, 8 to 12 posts a month written in your voice, carousels and short video, comments and engagement, and a monthly review of what's working. Add a newsletter, networking or collaborations whenever you're ready. You approve every post before it goes out, and most clients spend under 30 minutes a week on it."; }, chips: ["Networking", "Newsletters", "Pricing"] },
    { id: "newsletter", re: /\b(newsletters?|subscribers?|substack|mailing list)\b/i, r: function () { mem.topic = "newsletter"; return "Yes, we run LinkedIn newsletters end to end: the name and format, setup, an editorial calendar, every issue written in your voice and published, and subscriber growth. A newsletter reaches people through notifications and email, not just the feed, and LinkedIn invites your network to subscribe when it launches, so it's one of the best ways to build a real audience."; }, chips: ["Pricing", "What else do you do?"] },
    { id: "network", re: /\b(networking|network with|grow my network|connections? requests?|outreach|dms?|inbox|cold messag|introductions?|intros?|reach (the right|decision|investors|buyers)|meet (investors|buyers|clients))\b/i, r: function () { mem.topic = "networking"; return "Strategic networking is half of LinkedIn, and most people skip it. We build a list of the people who matter to you (investors, buyers, partners, peers) and work it every week: personal connection notes, thoughtful comments on their posts so they know your name before you ever message, and drafted replies for your DMs. All by hand. No automation tools and no templates, so your account is never at risk."; }, chips: ["Collaborations", "Pricing"] },
    { id: "collab", re: /\b(collabs?|collaborat\w*|co-?author\w*|co-?written|brand deals?|brand partnerships?|sponsorships?|paid partnerships?|creator deals?|podcasts?|guest spots?)\b/i, r: function () { mem.topic = "collabs"; return "We set up collaborations that put you in front of new audiences: co-written posts with peers, guest spots on podcasts and LinkedIn Lives, and joint events. If you have an audience brands want to reach, we source paid partnerships, negotiate them and handle the coordination."; }, chips: ["Networking", "Events", "Pricing"] },
    { id: "events", re: /\b(linkedin lives?|live ?stream|audio events?|webinars?|linkedin events?|events)\b/i, r: function () { return "We plan and run LinkedIn Lives, audio events and LinkedIn Events: the topic, the guests, the event page, the promotion before and the posts after. They're also a good excuse to invite the people on your networking list."; }, chips: ["Collaborations", "Pricing"] },
    { id: "company", re: /\b(company pages?|business pages?|brand pages?|organi[sz]ation pages?|employee advocacy|our company on linkedin|page for (my|our) (company|brand|startup|school))\b/i, r: function () { return "Yes, we run company pages too: the content calendar, posts, the page itself and follower growth. It works best paired with your leadership team, each person in their own voice, all telling one story, with posts your employees can share easily. People follow people before they follow logos."; }, chips: ["Teams", "Pricing"] },
    { id: "video", re: /\b(videos?|reels?|carousels?|document posts?|pdf posts?)\b/i, r: function () { return "Yes, for LinkedIn. Send us raw footage from your phone and we edit it into short clips with captions. We also design carousels and document posts. It all sits in the same monthly plan as your written posts."; }, chips: ["Content", "Pricing"] },
    { id: "audit", re: /\b(audit|review my profile|workshop|training|masterclass|one-?off|one time|diy|do it myself)\b/i, r: function () { return "If you'd rather run LinkedIn yourself, start with an audit: we review your profile and content and hand you a fix list ranked by impact. For leadership teams, we run a single working-session workshop. Both are one-off. " + cal("Book a call") + " to set one up."; } },
    { id: "pr", weak: 1, re: /\b(pr|press|media coverage|journalist|publication|featured in|get featured|op-?ed|news ?paper|forbes|economic times|yourstory|inc42|tedx)\b/i, r: function () { mem.topic = "pr"; return "We don't do traditional PR or press pitching. Boldface is all about LinkedIn, done properly. The closest we get is putting you in front of other people's audiences: guest spots on podcasts and LinkedIn Lives, co-written posts and collaborations with the right peers."; }, chips: ["Collaborations", "What do you do?"] },
    { id: "guarantee", re: /\b(guarantee|guaranteed|promise|assure|sure shot|100%)\b/i, r: function () { return "We don't guarantee specific placements or follower numbers, and you should be wary of anyone who does. What we do guarantee is the work: a real strategy, consistent content in your voice and steady, hands-on networking. The results on our " + pg("results", "Results page") + " are what that tends to produce."; } },
    { id: "voice", re: /\b(voice|sound like me|my tone|authentic|in my words|capture|fake|ai written|chatgpt|generic)\b/i, r: function () { return "That's the part we're fussiest about. The first two weeks go into nothing else: a long intake call, reading anything you've written or said in public, and voice notes of you talking through your topics. Then drafts go back and forth until you can't tell which ones you wrote yourself. No post goes out without your approval."; } },
    { id: "effort", re: /\b(my time|time commitment|how much time|involvement|involved|busy|hours|every day|daily)\b/i, r: function () { return "Very little. A monthly strategy call, approving posts before they go live, and the odd voice note. Most clients spend under 30 minutes a week. You definitely don't need to be on LinkedIn every day."; } },
    { id: "speed", re: /\b(how (long|soon|quickly|fast)|when will i see|timeline|results? (in|by)|take to work|how many months|overnight)\b/i, r: function () { return "Realistically: engagement and followers start moving in four to six weeks. Inbound conversations usually arrive between months three and six. A genuine shift in how your industry sees you takes six to twelve months. And from your first call to your first post going live is 21 days."; }, chips: ["The 21-day process", "Results"] },
    { id: "process", re: /\b(process|onboarding|how (does it|do you) work|steps|21 days|week one|first week|what happens after)\b/i, r: function () { return "It's 21 days from first call to first post:<br><br><b>Week 1:</b> a 45-minute intake call, then we study how you write and speak.<br><b>Week 2:</b> strategy: what you stand for, your three or four topics, your audience and a 90-day roadmap.<br><b>Week 3:</b> profile rewrite and your first four posts.<br><b>Week 4 onwards:</b> 8 to 12 posts a month, plus networking, newsletter and collaborations if you've signed up for them, and monthly review calls.<br><br>Full breakdown on the " + pg("process", "Process page") + "."; } },
    { id: "results", weak: 1, re: /\b(results?|proof|track record|success|numbers|stats|achievements|portfolio|clients? (you|have)|worked with|case stud(y|ies)|examples?)\b/i, r: function () { mem.topic = "results"; return "A few highlights: 35+ founders and executives, 265K+ followers built and 55M+ organic impressions across clients. Specific ones: a Mumbai fintech founder from 400 to 12,000 followers, a business coach with 6,500x impression growth in 12 weeks, a Hyderabad lawyer with 3x inbound in six months, and a chartered accountant with two to four qualified leads a week. All ten stories are on the " + pg("case-studies", "Work page") + "."; }, chips: ["Fintech story", "Lawyer story", "CFO story"] },
    { id: "brands", weak: 1, re: /\b(brands?|logos?|ather|bacardi|ajio|vini|cothas|kuku|bambino|darshan|raga|insyde|sgr)\b/i, r: function () { return "Our strategy team has worked alongside Ather, Bacardi, AJIO, Vini Cosmetics, Cothas Coffee, Kuku FM, Bambino, Darshan Incense, Darshan BlackStone, Raga Arts, Insyde Studio and SGR Stores. Those frameworks are what we now apply to individual leaders."; } },
    { id: "koushik", re: /\b(koushik|agarwalla|who('s| is) (the )?founder|founder of boldface|boldface founder|who runs|who owns|who started|owner of boldface|ceo of boldface)\b/i, r: function () { return "Koushik Agarwalla is the curator and execution lead. He plans, writes and runs every engagement himself. He's published three books, was Chief Organiser of TEDxChristUniversity, and previously worked at Unacademy and Emergent AI. You can find him on " + '<a href="https://www.linkedin.com/in/koushik-agarwalla" target="_blank" rel="noopener">LinkedIn</a>.'; } },
    { id: "sandeep", re: /\b(sandeep|komarla|advisor|disney|viacom|radio city)\b/i, r: function () { return "Sandeep Komarla is our brand strategy advisor. He spent 20+ years in brand and marketing at India's biggest media houses: AVP at Disney Star, Senior Director at Viacom18 and Marketing Head at Radio City, with 150+ business projects and 75+ strategic partnerships behind him."; } },
    { id: "team", re: /\b(team|who (will|would) (work|handle)|account manager|how many people|staff|employees|juniors?)\b/i, r: function () { return "You work directly with Koushik, not a junior account manager. Sandeep Komarla, ex-Disney Star and Viacom18, advises on every strategy. We keep the client list deliberately short so the attention stays proportionate to the work. " + pg("about", "More about us") + "."; } },
    { id: "where", weak: 1, re: /\b(where (are|is) (you|boldface)|location|based|office|city|bangalore|bengaluru|dubai|abu dhabi|uae|india|international|abroad|outside india|global|usa|uk|singapore|london)\b/i, r: function () { return "We're based in Bangalore and work with clients across India, Dubai and Abu Dhabi, plus the UK and Singapore among others. LinkedIn works the same everywhere, so location rarely matters."; } },
    { id: "contact", weak: 1, re: /\b(contact|email|e-mail|mail|phone|number|whatsapp|reach (you|out)|get in touch|address)\b/i, r: function () { return "Here's how to reach us:<br><br>Book a call: " + cal("calendly.com/boldfaceonline/30min") + "<br>WhatsApp: " + wa("+91 70772 47111") + "<br>New projects: " + mail() + "<br>Support: " + mail("contact@boldface.click") + "<br><br>We reply within 24 hours on working days."; } },
    { id: "teamli", re: /\b(whole team|leadership team|founding team|co-?founders|multiple people|executives at my company|for my team)\b/i, r: function () { return "Yes, we do teams, and company pages too. Each person gets their own positioning and voice, with a shared story connecting them so nobody ends up sounding like the comms department."; } },
    { id: "fit", weak: 1, re: /\b(right fit|good fit|who is it for|who do you work with|ideal client|qualify|eligible|small|beginner|no followers|zero followers|start from scratch)\b/i, r: function () { return "We're a good fit if you have something real to say (a business, a career, a hard-won opinion), you can think in months not days, and you want strategy rather than a posting schedule. Starting from zero is completely fine: several clients began with a few hundred followers. We're not the right choice if you want 10,000 followers by next month or you're choosing on price alone."; } },
    { id: "fake", re: /\b(buy followers|fake followers|bots?|pods?|engagement pods?|paid promotion|ads|boost(ed)?|sponsored)\b/i, r: function () { return "No bought followers, no engagement pods, no tricks. Every number we share is organic. It takes longer, but the people who follow you actually care, which is the whole point."; } },
    { id: "notdo", re: /\b(website|web design|seo|instagram|youtube|tiktok|facebook|twitter|x\.com|performance marketing|google ads|meta ads|logo design)\b/i, r: function () { return "Our focus is narrow on purpose: LinkedIn, all of it, for leaders and their companies. We don't run ads, do traditional PR, build websites or manage other social platforms. If you're unsure whether something fits, ask Koushik on a " + cal("quick call") + "."; } },
    { id: "playbook", weak: 1, re: /\b(playbook|guide|guides|blog|resources|free (tips|advice|guide)|learn|read|articles?)\b/i, r: function () { return "Our Playbook has 18 free guides, no sign-up. A few good starting points: " + art("a1") + ", " + art("a2") + " and " + art("a7") + ". " + pg("playbook", "See all eighteen") + "."; } },
    { id: "hook", re: /\b(hook|first line|opening line)\b/i, r: function () { return "Short version: your first line has one job, which is to make someone read the second line. Most people waste it starting with “I”. We wrote a whole guide on it: " + art("a1") + "."; } },
    { id: "measure", re: /\b(measure|kpi|track|metrics|report|reporting|analytics|vanity)\b/i, r: function () { return "We track four things: inbound (unprompted messages and opportunities), reach among the right people, positioning (are you linked to the thing you want to be known for) and your network (who's new in it, and the conversations and meetings it led to). You get a monthly review call on all of it."; } },
    { id: "different", re: /\b(different|why (you|boldface|choose)|better than|vs\.?|versus|other agenc|big agenc|compare|unique|special)\b/i, r: function () { return "Two things. You work with the founder on every piece, not a junior passing notes to another junior. And it's all LinkedIn, under one roof: your profile, posts, newsletter and network tell the same story because one team runs them."; } },
    { id: "nda", re: /\b(nda|confidential|privacy|private|anonymous|names? (withheld|hidden)|secret)\b/i, r: function () { return "Confidentiality is standard. That's why our case studies don't name clients: they asked us not to, and we respect that. Happy to sign an NDA if you need one."; } },
    { id: "approve", re: /\b(approv|review|sign.?off|edit|control|post without|my account|password|access)\b/i, r: function () { return "Nothing goes live without your approval. You review every post, you can edit anything, and we only publish what you've signed off."; } },
    { id: "careers", re: /\b(job|jobs|career|careers|hiring|intern|internship|work for you|join (you|your team)|vacanc|freelance writer)\b/i, r: function () { return "Thanks for the interest! Send a short note and some of your writing to " + mail() + ". Koushik reads everything."; } },
    { id: "partner", re: /\b(partner with (you|boldface)|agency partner|refer|referral|affiliate|white.?label|resell)\b/i, r: function () { return "Always open to good partnerships. Drop Koushik a line at " + mail() + " with a quick outline of what you have in mind."; } },
    { id: "hours", re: /\b(response time|reply|respond|working hours|open|available|weekend|timezone|ist)\b/i, r: function () { return "We reply within 24 hours on any working day. We're on IST in Bangalore, and calls can be booked across time zones on " + cal("Calendly") + "."; } },
    { id: "joke", re: /\b(joke|funny|make me laugh)\b/i, r: function () { return "Why did the founder's LinkedIn post flop? It started with “I'm humbled and excited to announce”. That one's on us to fix."; } },
    { id: "who", re: /\b(who (is|are) (this|it) for|for founders|for ceos|for executives|for cxos?|c-?suite)\b/i, r: function () { return "Three kinds of people tend to call us: founders and CEOs who are raising, hiring or selling; CFOs, CTOs and other C-suite leaders who want the industry voice their career has earned; and consultants and advisors who want clients arriving half-sold."; } }
  ];

  /* ---------- conversation ---------- */
  function more() {
    if (mem.pass.length > mem.passI + 1) { mem.passI++; return pick(["Here's another angle on that. ", "There's more. ", "Also worth knowing: "]) + fromPassage(mem.pass[mem.passI], mem.lastQ, ""); }
    return "That's most of what I've got on it" + nm() + ". For the deeper version, " + cal("grab 30 minutes with Koushik") + ".";
  }
  function reply(raw) {
    var q = raw.trim(), lc = q.toLowerCase(); mem.turns++;
    var m = q.match(/\b(?:my name is|i am|i'm|im|this is|call me)\s+([a-z][a-z'-]{1,20})\b/i);
    if (m && !/^(a|an|the|looking|interested|from|not|just|here|good|fine|ok|okay|new|curious|thinking|trying|working|founder|ceo|cfo|cto|consultant|lawyer|coach)$/i.test(m[1])) {
      mem.name = m[1].charAt(0).toUpperCase() + m[1].slice(1).toLowerCase();
      if (q.split(/\s+/).length <= 5) return { html: pick(["Nice to meet you, " + mem.name + ". What can I help you with?", "Hi " + mem.name + "! Good to have you here. What would you like to know?"]), chips: ["What do you do?", "Pricing", "Results"] };
    }
    if (/^(more|tell me more|go on|continue|and\??|elaborate|explain|example|for example|such as|like what|really\??|how so\??)$/i.test(lc)) return { html: more() };
    var qs = q.replace(/(\w{3,})s\b/g, "$1");
    for (var i = 0; i < ROLES.length; i++) {
      if (ROLES[i].re.test(qs) && /\b(work with|clients? (in|like)|experience (with|in)|worked with|do you do|good for|useful for|work for)\b/i.test(q)) { mem.role = ROLES[i].k; return { html: ROLES[i].a + " Want to " + cal("talk through how it'd work for you") + "?", chips: ["Pricing", "How long does it take?"] }; }
      if (ROLES[i].re.test(qs) && /\b(i am|i'm|im|as a|i run|i work|we are|we're|my (company|firm|startup|practice)|for (a|an))\b/i.test(q)) { mem.role = ROLES[i].k; return { html: ROLES[i].a + " Want to " + cal("talk through your situation") + "?", chips: ["Pricing", "How long does it take?"] }; }
    }
    var pre = null;
    for (var j = 0; j < I.length; j++) {
      if (!I[j].re.test(q)) continue;
      if (I[j].weak) {
        pre = pre || search(q, 5);
        var specific = /\b(tell me about|story|case|client|what happened|how did|example of|the (fintech|hr|ca|d2c|cfo|legal|lawyer|chennai|singapore|dubai|london|edtech|pune|delhi|mumbai|hyderabad|gurgaon|bangalore)\b)/i.test(q);
        if (pre.length && (pre[0].p.page === "case-studies" || pre[0].p.page === "results" || pre[0].p.art) && (specific ? pre[0].s > 4 : pre[0].s > 9)) {
          mem.pass = pre; mem.passI = 0; mem.lastQ = q;
          return { html: fromPassage(pre[0], q), chips: ["Tell me more", "Book a call"] };
        }
      }
      mem.last = I[j].id; return { html: I[j].r(), chips: I[j].chips };
    }
    for (var k = 0; k < ROLES.length; k++) if (ROLES[k].re.test(qs)) return { html: ROLES[k].a };
    var hits = search(q, 5);
    if (hits.length && hits[0].s > 3.2) {
      mem.pass = hits; mem.passI = 0; mem.lastQ = q;
      return { html: fromPassage(hits[0], q), chips: hits.length > 1 ? ["Tell me more", "Book a call"] : ["Book a call"] };
    }
    if (/\b(weather|cricket|movie|recipe|stock|crypto|bitcoin|politic|election|football|ipl|song|music)\b/i.test(q)) return { html: pick(["Ha, I'm strictly a LinkedIn nerd" + nm() + ". Ask me about LinkedIn or how we work and I'm all yours.", "That's outside my lane, sadly. I'm great on LinkedIn and personal branding though."]) };
    return { html: pick(["I don't want to guess on that one" + nm() + ". Koushik will have a proper answer: " + cal() + " or " + wa() + ".", "Good question, and not one I can answer well from here. Try asking it another way, or " + cal("put it to Koushik directly") + ". He replies within a day."]), chips: ["What do you do?", "Pricing", "Talk to a human"] };
  }
  async function ask(q) {
    if (window.VAANI_ENDPOINT) {
      try {
        var ctx = search(q, 4).map(function (h) { return h.p.text; });
        var r = await fetch(window.VAANI_ENDPOINT, { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ question: q, context: ctx, name: mem.name }) });
        if (r.ok) { var d = await r.json(); if (d && d.reply) return { html: d.reply }; }
      } catch (e) {}
    }
    return reply(q);
  }
  return { ask: ask, name: function () { return mem.name; } };
})();



/* ---------- splitting ---------- */
function splitWords(el, mask) {
  if (el._words) return el._words;
  var words = [];
  (function walk(node) {
    Array.prototype.slice.call(node.childNodes).forEach(function (n) {
      if (n.nodeType === 3) {
        var frag = document.createDocumentFragment();
        n.textContent.split(/(\s+)/).forEach(function (p) {
          if (!p) return;
          if (/^\s+$/.test(p)) { frag.appendChild(document.createTextNode(" ")); return; }
          var w = document.createElement("span"); w.className = "w";
          if (mask) {
            w.style.overflow = "hidden"; w.style.verticalAlign = "top"; w.style.paddingBottom = ".08em"; w.style.marginBottom = "-.08em";
            var i = document.createElement("span"); i.style.display = "inline-block"; i.textContent = p; w.appendChild(i); words.push(i);
          } else { w.textContent = p; words.push(w); }
          frag.appendChild(w);
        });
        n.parentNode.replaceChild(frag, n);
      } else if (n.nodeType === 1 && n.tagName !== "BR" && !n.classList.contains("sr")) walk(n);
    });
  })(el);
  el._words = words;
  return words;
}
function splitChars(el) {
  if (el._chars) return el._chars;
  var t = el.textContent; el.textContent = "";
  el._chars = Array.from(t).map(function (ch) {
    var s = document.createElement("span"); s.className = "c"; s.textContent = ch === " " ? " " : ch; el.appendChild(s); return s;
  });
  return el._chars;
}

/* ---------- button text roll ---------- */

/* ---------- smooth scroll ---------- */
var lenis = null, vel = 0;
if (window.Lenis && !REDUCED) {
  lenis = new Lenis({ lerp: 0.12, smoothWheel: true, wheelMultiplier: 1.05 });
  window.bfLenis = lenis;
  lenis.on("scroll", function (e) { vel = e.velocity || 0; });
  if (G) {
    lenis.on("scroll", ScrollTrigger.update);
    gsap.ticker.add(function (t) { lenis.raf(t * 1000); });
    gsap.ticker.lagSmoothing(0);
  } else (function raf(t) { lenis.raf(t); requestAnimationFrame(raf); })();
}
function toTop() { if (lenis) lenis.scrollTo(0, { immediate: true, force: true }); else window.scrollTo(0, 0); }
function lockScroll(on) { if (lenis) { on ? lenis.stop() : lenis.start(); } else document.documentElement.style.overflow = on ? "hidden" : ""; }
function onScroll(fn) { if (lenis) lenis.on("scroll", fn); else addEventListener("scroll", fn, { passive: true }); }

/* ---------- never allow sideways page scroll ---------- */
addEventListener("scroll", function () { if (window.scrollX) window.scrollTo(0, window.scrollY); }, { passive: true });

/* ---------- letters turn bold near the pointer ---------- */
function boldField(chars, area, base, opts) {
  if (!chars.length || area._bold) return; area._bold = true;
  opts = opts || {};
  var max = opts.max || 900, W = chars.map(function () { return base; }), px = -1e4, py = -1e4, active = false, raf = 0;
  function set(c, w) { c.style.fontVariationSettings = '"wght" ' + w.toFixed(0) + ', "wdth" 125'; }
  chars.forEach(function (c) { set(c, base); });
  if (REDUCED) return;
  function loop() {
    raf = 0; var moving = false, rad = Math.max(150, area.getBoundingClientRect().width * (opts.radius || 0.14));
    chars.forEach(function (c, i) {
      var t = base;
      if (active) {
        var r = c.getBoundingClientRect(), dx = r.left + r.width / 2 - px, dy = (r.top + r.height / 2 - py) * 1.6;
        var f = Math.max(0, 1 - Math.sqrt(dx * dx + dy * dy) / rad); f = f * f * (3 - 2 * f); t = base + (max - base) * f;
      }
      W[i] += (t - W[i]) * 0.16;
      if (Math.abs(t - W[i]) > 0.5) moving = true;
      set(c, W[i]);
    });
    if (moving) raf = requestAnimationFrame(loop);
  }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  area.addEventListener("pointermove", function (e) { px = e.clientX; py = e.clientY; active = true; kick(); });
  area.addEventListener("pointerleave", function () { active = false; kick(); });
  area.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") { active = false; kick(); } });
}
function enhance(root) {
  $$(".bl", root).forEach(function (b) {
    var t = b.innerHTML;
    b.className = "bt";
    b.innerHTML = "<span>" + t + '</span><span aria-hidden="true">' + t + "</span>";
  });
  $$(".bname", root).forEach(function (h) {
    var ch = []; $$("span", h).forEach(function (s) { ch = ch.concat(splitChars(s)); });
    boldField(ch, h.closest(".member"), 300, { radius: 0.12 });
  });
  initNamecard();
}
enhance(document);

/* pages that weren't pre-rendered into this URL wait in #pgStore until first needed */
var hydrated = false;
function hydrate() {
  if (hydrated) return; hydrated = true;
  var st = document.getElementById("pgStore"); if (!st) return;
  var data; try { data = JSON.parse(st.textContent); } catch (e) { return; }
  Object.keys(data).forEach(function (id) {
    var m = document.getElementById(id); if (!m) return;
    m.innerHTML = data[id]; enhance(m);
  });
  if (!Stage && document.getElementById("stage")) { Stage = makeStage(); if (Stage) { Stage.start(); $(".hero-fallback").style.opacity = 0; } }
}

/* ---------- magnetic + glow ---------- */
if (!TOUCH && !REDUCED) {
  document.addEventListener("pointermove", function (e) {
    var b = e.target.closest("[data-magnet]");
    if (b) {
      var r = b.getBoundingClientRect();
      b.style.transform = "translate(" + (e.clientX - r.left - r.width / 2) * 0.25 + "px," + (e.clientY - r.top - r.height / 2) * 0.35 + "px)";
    }
  }, { passive: true });
  document.addEventListener("pointerout", function (e) {
    var b = e.target.closest("[data-magnet]");
    if (b && !b.contains(e.relatedTarget)) { b.style.transition = "transform .7s cubic-bezier(.16,1,.3,1)"; b.style.transform = ""; setTimeout(function () { b.style.transition = ""; }, 700); }
  });
}
document.addEventListener("pointermove", function (e) {
  var g = e.target.closest("[data-glow],.wcard,.rc,.pb-card");
  if (!g) return;
  var r = g.getBoundingClientRect();
  g.style.setProperty("--gx", ((e.clientX - r.left) / r.width * 100) + "%");
  g.style.setProperty("--gy", ((e.clientY - r.top) / r.height * 100) + "%");
}, { passive: true });

/* ---------- nav hide ---------- */
(function () {
  var nav = $("#nav"), py = 0;
  onScroll(function () {
    var y = window.scrollY;
    document.body.classList.toggle("show-fab", y > innerHeight * 0.8 || current !== "home");
    if (y > 300 && y > py + 4 && !menuOpen) nav.classList.add("hide");
    else if (y < py - 4 || y < 300) nav.classList.remove("hide");
    py = y;
  });
})();

/* ---------- menu ---------- */
var menuOpen = false;
function openMenu() {
  menuOpen = true; document.body.classList.add("menu-open");
  $("#menuBtn").setAttribute("aria-expanded", "true");
  $$(".m-link .t > span").forEach(function (s, i) { s.style.transitionDelay = (0.25 + i * 0.04) + "s"; });
  lockScroll(true);
}
function closeMenu() {
  if (!menuOpen) return;
  menuOpen = false; document.body.classList.remove("menu-open");
  $("#menuBtn").setAttribute("aria-expanded", "false");
  $$(".m-link .t > span").forEach(function (s) { s.style.transitionDelay = "0s"; });
  lockScroll(false);
}
$("#menuBtn").addEventListener("click", function () { menuOpen ? closeMenu() : openMenu(); });
document.addEventListener("keydown", function (e) { if (e.key === "Escape") { closeMenu(); vaaniToggle(false); } });

/* ---------- delegated: accordion / case rows ---------- */
var _rs;
function refreshSoon(ms) { if (!G) return; clearTimeout(_rs); _rs = setTimeout(function () { ScrollTrigger.refresh(); }, ms); }
document.addEventListener("click", function (e) {
  var q = e.target.closest(".acc-q");
  if (q) {
    var it = q.parentNode, was = it.classList.contains("open");
    $$(".acc-item.open", it.parentNode).forEach(function (o) { o.classList.remove("open"); $(".acc-q", o).setAttribute("aria-expanded", "false"); });
    if (!was) { it.classList.add("open"); q.setAttribute("aria-expanded", "true"); }
    refreshSoon(750); return;
  }
  var cr = e.target.closest(".cs-row");
  if (cr) {
    var item = cr.parentNode, open = !item.classList.contains("open");
    item.classList.toggle("open", open); cr.setAttribute("aria-expanded", open ? "true" : "false");
    refreshSoon(850);
  }
});

/* ---------- local time ---------- */
(function () {
  function tick() {
    var t; try { t = new Intl.DateTimeFormat("en-IN", { hour: "2-digit", minute: "2-digit", hour12: false, timeZone: "Asia/Kolkata" }).format(new Date()); } catch (e) { return; }
    $$(".blr").forEach(function (el) { el.textContent = t; });
  }
  tick(); setInterval(tick, 30000);
})();

/* ---------- playbook ---------- */
(function () {
  var grid = $("#pbGrid"); if (!grid || grid.children.length) return;
  Object.keys(articlesMeta).forEach(function (id, i) {
    var m = articlesMeta[id], el = document.createElement("button");
    el.type = "button"; el.className = "pb-card"; el.dataset.cursor = "Read";
    el.innerHTML = '<div class="top"><span class="tag">' + m.tag + '</span><span class="num">' + (i < 9 ? "0" : "") + (i + 1) + "</span></div>" +
      "<h3>" + m.title + "</h3><p>" + (articleExcerpts[id] || "") + "</p>" + '<div class="go"><span>Read the guide</span>' + AR + "</div>";
    el.addEventListener("click", function () { openArticle(id); });
    grid.appendChild(el);
  });
})();
var artOpen = false;
function openArticle(id, fromPop, instant) {
  var a = articles[id]; if (!a) return;
  $("#art-tag").textContent = a.tag;
  $("#art-title").innerHTML = a.title; $("#art-title")._words = null;
  $("#art-meta").innerHTML = a.meta;
  $("#art-body").innerHTML = a.body;
  var rg = $("#related-grid"); rg.innerHTML = "";
  Object.keys(articlesMeta).filter(function (k) { return k !== id; }).sort(function () { return 0.5 - Math.random(); }).slice(0, 3).forEach(function (k) {
    var m = articlesMeta[k], b = document.createElement("a");
    b.href = ART[k].path; b.dataset.article = k; b.dataset.cursor = "Read";
    b.innerHTML = '<span class="lbl">' + m.tag + '</span><span class="h3">' + m.title + "</span>";
    rg.appendChild(b);
  });
  $("#pb-list").style.display = "none"; $("#pb-article").style.display = "block"; $("#artProg").style.display = "block";
  artOpen = true; if (!instant) toTop();
  if (ART[id]) {
    setMeta(ART[id].title + " | Boldface", ART[id].desc, ART[id].path);
    if (!fromPop && location.pathname !== ART[id].path) { try { history.pushState({ page: "playbook", art: id }, "", ART[id].path); } catch (e) {} }
  }
  if (G && !REDUCED && !instant) {
    gsap.fromTo(splitWords($("#art-title"), true), { yPercent: 110 }, { yPercent: 0, duration: 1.2, ease: "expo.out", stagger: 0.03 });
    gsap.fromTo("#art-body > *", { y: 30, opacity: 0 }, { y: 0, opacity: 1, duration: 1, ease: "expo.out", stagger: 0.03, delay: 0.2 });
  }
  refreshSoon(60);
}
function closeArticle(silent) {
  $("#pb-article").style.display = "none"; $("#pb-list").style.display = "block"; $("#artProg").style.display = "none";
  artOpen = false; toTop(); refreshSoon(60);
  if (!silent) {
    applyPageSeo("playbook");
    if (location.pathname !== PAGE_SEO.playbook.path) { try { history.pushState({ page: "playbook" }, "", PAGE_SEO.playbook.path); } catch (e) {} }
  }
}
onScroll(function () {
  if (!artOpen) return;
  var art = $("#pb-article"), r = art.getBoundingClientRect(), h = art.offsetHeight - innerHeight;
  $("#artProg").style.transform = "scaleX(" + clamp(-r.top / (h || 1), 0, 1) + ")";
});

/* ---------- name preview (final CTA): letters go bold under the cursor ---------- */
function initNamecard() {
  var inp = $("#nameInp"), out = $("#ncName"), cap = $("#ncCap"), box = $(".namecard"); if (!inp || inp._nc) return; inp._nc = true;
  var DEF_CAP = cap.textContent, prev = "", chars = [], W = [], A = [], px = -1e4, active = false, raf = 0;
  function base() { return out.classList.contains("on") ? { w: 800, a: 1 } : { w: 250, a: 0 }; }
  function fit() {
    out.style.setProperty("--fs", "");
    chars.forEach(function (c) { c.style.fontVariationSettings = '"wght" 900, "wdth" 125'; });
    var fs = parseFloat(getComputedStyle(out).fontSize), w = out.scrollWidth, max = box.clientWidth * 0.94;
    if (w > max) out.style.setProperty("--fs", (fs * max / w) + "px");
    paint(true);
  }
  function paint(snap) {
    var b = base(), moving = false;
    chars.forEach(function (c, i) {
      var tw = b.w, ta = b.a;
      if (active) {
        var r = c.getBoundingClientRect(), d = Math.abs(r.left + r.width / 2 - px), f = Math.max(0, 1 - d / Math.max(160, box.clientWidth * 0.16));
        f = f * f * (3 - 2 * f); tw = b.w + (900 - b.w) * f; ta = b.a + (1 - b.a) * f;
      }
      if (snap || REDUCED) { W[i] = tw; A[i] = ta; } else { W[i] += (tw - W[i]) * 0.18; A[i] += (ta - A[i]) * 0.18; }
      if (Math.abs(tw - W[i]) > 0.5 || Math.abs(ta - A[i]) > 0.005) moving = true;
      c.style.fontVariationSettings = '"wght" ' + W[i].toFixed(0) + ', "wdth" 125';
      c.style.color = "rgba(242,240,235," + A[i].toFixed(3) + ")";
    });
    return moving;
  }
  function loop() { raf = 0; if (paint(false)) raf = requestAnimationFrame(loop); }
  function kick() { if (!raf) raf = requestAnimationFrame(loop); }
  box.addEventListener("pointermove", function (e) { px = e.clientX; active = true; kick(); });
  box.addEventListener("pointerdown", function (e) { px = e.clientX; active = true; kick(); });
  box.addEventListener("pointerleave", function () { active = false; kick(); });
  box.addEventListener("pointerup", function (e) { if (e.pointerType !== "mouse") { active = false; kick(); } });
  function render() {
    var name = inp.value.replace(/\s+/g, " ").trim();
    out.classList.toggle("on", !!name);
    out._chars = null; out.textContent = name || "Your name";
    chars = splitChars(out);
    W = chars.map(function () { return base().w; }); A = chars.map(function () { return base().a; });
    if (name && name.length > prev.length && G && !REDUCED) gsap.fromTo(chars.slice(prev.length), { yPercent: 60, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.02 });
    cap.textContent = name ? "Right now, a search for \u201c" + name + "\u201d probably turns up a job title. Let's change what they find." : DEF_CAP;
    prev = name;
    fit();
  }
  inp.addEventListener("input", render);
  addEventListener("resize", fit);
  render();
}

/* ==========================================================
   WEBGL SPOTLIGHT
   ========================================================== */
function makeStage() {
  var cv = $("#stage"); if (!cv) return null;
  var gl = cv.getContext("webgl", { antialias: false, alpha: false, powerPreference: "high-performance" });
  if (!gl) { cv.style.display = "none"; return null; }
  var VS = "attribute vec2 p;void main(){gl_Position=vec4(p,0.,1.);}";
  var FS = [
    "precision highp float;",
    "uniform vec2 uR;uniform float uT;uniform vec2 uM;uniform float uF;",
    "float h(vec2 p){return fract(sin(dot(p,vec2(127.1,311.7)))*43758.5453);}",
    "float n(vec2 p){vec2 i=floor(p),f=fract(p);f=f*f*(3.-2.*f);return mix(mix(h(i),h(i+vec2(1,0)),f.x),mix(h(i+vec2(0,1)),h(i+vec2(1,1)),f.x),f.y);}",
    "float fbm(vec2 p){float v=0.,a=.5;for(int i=0;i<4;i++){v+=a*n(p);p=p*2.03+vec2(1.7,9.2);a*=.5;}return v;}",
    "void main(){",
    " vec2 uv=gl_FragCoord.xy/uR;float asp=uR.x/uR.y;vec2 p=vec2(uv.x*asp,uv.y);",
    " vec2 src=vec2((.5+(uM.x-.5)*.3)*asp,1.18);vec2 tgt=vec2(uM.x*asp,uM.y);",
    " vec2 dir=normalize(tgt-src);vec2 d=p-src;float al=dot(d,dir);float pe=length(d-dir*al);",
    " float wd=.02+al*.2;float beam=smoothstep(wd,wd*.1,pe)*smoothstep(0.,.3,al)*smoothstep(2.2,.5,al);",
    " vec2 q=p*1.8+vec2(uT*.015,-uT*.04);float s=fbm(q+1.6*n(q*1.3+vec2(0.,uT*.06)));float sm=smoothstep(.3,.95,s);",
    " float pool=exp(-dot((p-tgt)*vec2(1.,1.7),(p-tgt)*vec2(1.,1.7))*5.);",
    " float L=beam*(.22+.78*sm)*.62+pool*(.15+.3*sm)+sm*.035;",
    " vec3 col=vec3(.018)+vec3(1.,.965,.92)*L;",
    " float vig=smoothstep(1.35,.25,length((uv-.5)*vec2(asp*.75,1.)));col*=mix(.45,1.,vig);",
    " float g=h(floor(gl_FragCoord.xy*.5)+floor(uT*14.));col+=beam*step(.9965,g)*.35;",
    " gl_FragColor=vec4(col*uF,1.);",
    "}"
  ].join("\n");
  function sh(t, s) { var o = gl.createShader(t); gl.shaderSource(o, s); gl.compileShader(o); return o; }
  var pr = gl.createProgram();
  gl.attachShader(pr, sh(gl.VERTEX_SHADER, VS)); gl.attachShader(pr, sh(gl.FRAGMENT_SHADER, FS)); gl.linkProgram(pr);
  if (!gl.getProgramParameter(pr, gl.LINK_STATUS)) { cv.style.display = "none"; return null; }
  gl.useProgram(pr);
  var buf = gl.createBuffer(); gl.bindBuffer(gl.ARRAY_BUFFER, buf);
  gl.bufferData(gl.ARRAY_BUFFER, new Float32Array([-1, -1, 1, -1, -1, 1, 1, 1]), gl.STATIC_DRAW);
  var loc = gl.getAttribLocation(pr, "p"); gl.enableVertexAttribArray(loc); gl.vertexAttribPointer(loc, 2, gl.FLOAT, false, 0, 0);
  var uR = gl.getUniformLocation(pr, "uR"), uT = gl.getUniformLocation(pr, "uT"), uM = gl.getUniformLocation(pr, "uM"), uF = gl.getUniformLocation(pr, "uF");
  var SCALE = TOUCH ? 0.38 : 0.5, W = 0, H = 0;
  function size() {
    W = Math.max(2, Math.round(cv.clientWidth * SCALE)); H = Math.max(2, Math.round(cv.clientHeight * SCALE));
    cv.width = W; cv.height = H; gl.viewport(0, 0, W, H);
  }
  size(); addEventListener("resize", size);
  var tx = 0.7, ty = 0.55, mx = 0.7, my = 0.55, last = -1e9, t0 = performance.now(), visible = true, running = false;
  var state = { fade: 0 };
  addEventListener("pointermove", function (e) {
    var r = cv.getBoundingClientRect();
    if (e.clientY > r.bottom) return;
    tx = (e.clientX - r.left) / r.width; ty = 1 - (e.clientY - r.top) / r.height; last = performance.now();
  }, { passive: true });
  new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }).observe(cv);
  function frame() {
    requestAnimationFrame(frame);
    if (!visible || !cv.offsetParent) return;
    if (Math.max(2, Math.round(cv.clientWidth * SCALE)) !== W) size();
    var now = performance.now(), t = (now - t0) / 1000;
    if (now - last > 2500) { tx = 0.62 + 0.22 * Math.sin(t * 0.32); ty = 0.5 + 0.16 * Math.sin(t * 0.47 + 1.3); }
    mx += (tx - mx) * 0.045; my += (ty - my) * 0.045;
    gl.uniform2f(uR, W, H); gl.uniform1f(uT, REDUCED ? 3 : t); gl.uniform2f(uM, mx, my); gl.uniform1f(uF, state.fade);
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4);
  }
  return {
    start: function () { if (running) return; running = true; frame(); },
    on: function () {
      if (!G || REDUCED) { state.fade = 1; return; }
      gsap.timeline()
        .to(state, { fade: 0.7, duration: 0.06 }).to(state, { fade: 0.1, duration: 0.08 })
        .to(state, { fade: 0.85, duration: 0.05 }).to(state, { fade: 0.3, duration: 0.1 })
        .to(state, { fade: 1, duration: 1.4, ease: "power2.out" });
    },
    state: state
  };
}
var Stage = makeStage();
if (Stage) { Stage.start(); $(".hero-fallback").style.opacity = 0; }

/* ==========================================================
   PAGE MOUNTING
   ========================================================== */
var ctx = null, introQ = [], offs = [];
function onTick(fn) {
  if (G) { gsap.ticker.add(fn); offs.push(function () { gsap.ticker.remove(fn); }); }
  else { var live = true; (function l() { if (!live) return; fn(); requestAnimationFrame(l); })(); offs.push(function () { live = false; }); }
}
function on(el, ev, fn, opt) { el.addEventListener(ev, fn, opt); offs.push(function () { el.removeEventListener(ev, fn, opt); }); }
function prepMarquee(el) {
  var t = $(".mq-t", el); if (t._dup) return;
  var orig = t.innerHTML, guard = 0;
  while (t.scrollWidth < innerWidth * 1.3 && guard++ < 10) t.innerHTML += orig;
  t.innerHTML += t.innerHTML; t._dup = true;
}

function mount(id) {
  offs.forEach(function (f) { f(); }); offs = []; introQ = [];
  var page = document.getElementById(id);
  $$("[data-mq]", page).forEach(prepMarquee);
  if (!G) return;
  if (ctx) ctx.revert();
  ScrollTrigger.getAll().forEach(function (t) { t.kill(); });
  ctx = gsap.context(function () {
    if (INIT[id]) INIT[id](page);
    common(page);
    navTone(page);
    footer();
  });
  ScrollTrigger.sort();
  ScrollTrigger.refresh();
}
function runIntro() { var q = introQ; introQ = []; q.forEach(function (f) { f(); }); }

function common(page) {
  if (REDUCED) { $$("[data-count]", page).forEach(function (b) { b.textContent = b.dataset.count + (b.dataset.suffix || ""); }); return; }
  $$("[data-lines-intro]", page).forEach(function (h) {
    var ls = $$(".line > span", h);
    gsap.set(ls, { yPercent: 110 });
    introQ.push(function () { gsap.to(ls, { yPercent: 0, duration: 1.5, ease: "expo.out", stagger: 0.1 }); });
  });
  $$("[data-intro]", page).forEach(function (el, i) {
    gsap.set(el, { opacity: 0, y: 24 });
    introQ.push(function () { gsap.to(el, { opacity: 1, y: 0, duration: 1.4, ease: "expo.out", delay: 0.5 + i * 0.1 }); });
  });
  $$("[data-lines]", page).forEach(function (h) {
    var ws = splitWords(h, true);
    gsap.fromTo(ws, { yPercent: 110 }, { yPercent: 0, duration: 1.3, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: h, start: "top 85%", once: true } });
  });
  $$("[data-words]", page).forEach(function (p) {
    var ws = splitWords(p, false);
    gsap.fromTo(ws, { "--o": 0.16 }, { "--o": 1, ease: "none", stagger: 0.08, scrollTrigger: { trigger: p, start: "top 78%", end: "bottom 40%", scrub: 0.5 } });
  });
  $$("[data-rise]", page).forEach(function (el) {
    var kids = el.dataset.rise === "stagger" ? el.children : [el];
    gsap.from(kids, { y: 50, opacity: 0, duration: 1.3, ease: "expo.out", stagger: 0.1, scrollTrigger: { trigger: el, start: "top 86%", once: true } });
  });
  $$("[data-count]", page).forEach(function (b) {
    var o = { v: 0 }, n = +b.dataset.count, sfx = b.dataset.suffix || "";
    b.textContent = "0" + sfx;
    gsap.to(o, { v: n, duration: 2.2, ease: "expo.out", scrollTrigger: { trigger: b, start: "top 88%", once: true }, onUpdate: function () { b.textContent = Math.round(o.v) + sfx; } });
  });
  $$("[data-mq]", page).forEach(marquee);
}
function navTone(page) {
  var nav = $("#nav"); nav.classList.remove("on-light");
  $$(".light", page).forEach(function (sec) {
    ScrollTrigger.create({ trigger: sec, start: "top 42px", end: "bottom 42px", onToggle: function (st) { nav.classList.toggle("on-light", st.isActive); } });
  });
}

function marquee(el) {
  var t = $(".mq-t", el), dir = +(el.dataset.dir || 1), half = t.scrollWidth / 2, x = dir < 0 ? -half : 0, visible = true;
  var setX = gsap.quickSetter(t, "x", "px");
  var io = new IntersectionObserver(function (en) { visible = en[0].isIntersecting; }); io.observe(el); offs.push(function () { io.disconnect(); });
  on(window, "resize", function () { half = t.scrollWidth / 2; });
  onTick(function () {
    if (!visible) return;
    if (!half) half = t.scrollWidth / 2;
    x -= (0.55 + Math.min(Math.abs(vel) * 0.25, 8)) * dir;
    if (x <= -half) x += half; if (x > 0) x -= half;
    setX(x);
  });
}

/* ==========================================================
   PAGE INITS
   ========================================================== */
var INIT = {};
INIT.home = function (page) {
  if (Stage) introQ.push(function () { Stage.on(); });
  if (REDUCED) return;
  /* hero exit parallax */
  gsap.to(".hero-in", { yPercent: -18, opacity: 0, ease: "none", scrollTrigger: { trigger: ".hero", start: "top top", end: "bottom top", scrub: true } });
  if (Stage) gsap.to(Stage.state, { fade: 0.25, ease: "none", scrollTrigger: { trigger: ".hero", start: "40% top", end: "bottom top", scrub: true } });

  /* outline -> solid fill */
  var lines = $$(".fill-line", page);
  var ft = gsap.timeline({ scrollTrigger: { trigger: ".fill", start: "top top", end: "+=180%", pin: true, scrub: 0.6 } });
  lines.forEach(function (l, i) { ft.fromTo(l, { backgroundPosition: "100% 0" }, { backgroundPosition: "0% 0", ease: "none", duration: 1 }, i * 0.85); });
  ft.from(".fill-foot span", { opacity: 0, y: 20, stagger: 0.1, duration: 0.4 }, 0.2);

  /* services pinned slideshow */
  if (innerWidth > 900) {
    var slides = $$(".svc-slide", page), navs = $$(".svc-nav li", page), bars = $$(".svc-nav .bar i", page);
    slides.forEach(function (s, i) {
      if (i) { gsap.set($$(".line > span", s), { yPercent: 110 }); gsap.set([$("p", s), $("ul", s)], { opacity: 0, y: 30 }); gsap.set($(".svc-num", s), { opacity: 0, x: 60 }); }
    });
    var cur = 0;
    function show(i) {
      if (i === cur) return;
      var a = slides[cur], b = slides[i], dir = i > cur ? 1 : -1;
      gsap.to($$(".line > span", a), { yPercent: -110 * dir, duration: 0.7, ease: "expo.in", stagger: 0.04, overwrite: true });
      gsap.to([$("p", a), $("ul", a)], { opacity: 0, y: -30 * dir, duration: 0.5, ease: "power2.in", overwrite: true });
      gsap.to($(".svc-num", a), { opacity: 0, x: -60 * dir, duration: 0.6, ease: "power2.in", overwrite: true });
      gsap.fromTo($$(".line > span", b), { yPercent: 110 * dir }, { yPercent: 0, duration: 1.1, ease: "expo.out", stagger: 0.07, delay: 0.45, overwrite: true });
      gsap.fromTo([$("p", b), $("ul", b)], { opacity: 0, y: 30 * dir }, { opacity: 1, y: 0, duration: 1, ease: "expo.out", stagger: 0.08, delay: 0.65, overwrite: true });
      gsap.fromTo($(".svc-num", b), { opacity: 0, x: 60 * dir }, { opacity: 1, x: 0, duration: 1.2, ease: "expo.out", delay: 0.5, overwrite: true });
      navs.forEach(function (n, k) { n.classList.toggle("on", k === i); });
      cur = i;
    }
    ScrollTrigger.create({
      trigger: ".svc", start: "top top", end: "+=" + (innerHeight * 0.8 * slides.length), pin: ".svc-pin", scrub: true,
      onUpdate: function (s) {
        var p = s.progress * slides.length, i = Math.min(slides.length - 1, Math.floor(p));
        bars.forEach(function (b, k) { b.style.transform = "scaleX(" + clamp(p - k, 0, 1) + ")"; });
        show(i);
      }
    });
  }

  /* work horizontal reel */
  if (innerWidth > 900) {
    var track = $(".work-track", page), bar = $(".work-prog i", page);
    var dist = function () { return track.scrollWidth - innerWidth; };
    gsap.to(track, {
      x: function () { return -dist(); }, ease: "none",
      scrollTrigger: { trigger: ".work", start: "top top", end: function () { return "+=" + dist(); }, pin: ".work-pin", scrub: 0.8, invalidateOnRefresh: true, onUpdate: function (s) { bar.style.transform = "scaleX(" + s.progress + ")"; } }
    });
    gsap.from($$(".wcard", page), { y: 80, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.08, scrollTrigger: { trigger: ".work", start: "top 70%", once: true } });
  }

  /* logo tiles */
  gsap.from(".lg", { opacity: 0, y: 30, duration: 1, ease: "expo.out", stagger: 0.03, scrollTrigger: { trigger: ".logos", start: "top 80%", once: true } });

  /* search bar entrance */
  gsap.from(".search", { y: 40, opacity: 0, scale: 0.96, duration: 1.4, ease: "expo.out", scrollTrigger: { trigger: ".cta", start: "top 60%", once: true } });
  gsap.from(".namecard", { opacity: 0, duration: 1.6, ease: "power2.out", delay: 0.3, scrollTrigger: { trigger: ".cta", start: "top 60%", once: true } });
};

INIT.process = function (page) {
  $$(".tl-item", page).forEach(function (it) {
    ScrollTrigger.create({ trigger: it, start: "top 60%", onEnter: function () { it.classList.add("hit"); }, onLeaveBack: function () { it.classList.remove("hit"); } });
  });
};
INIT["case-studies"] = function (page) {
  if (REDUCED) return;
  gsap.from($$(".cs-item", page), { y: 40, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: ".cs-list", start: "top 88%", once: true } });
};
INIT.playbook = function (page) {
  if (REDUCED || artOpen) return;
  gsap.from($$(".pb-card", page), { y: 60, opacity: 0, duration: 1.2, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: "#pbGrid", start: "top 88%", once: true } });
};
INIT.faq = function (page) {
  if (REDUCED) return;
  gsap.from($$(".acc-item", page), { y: 30, opacity: 0, duration: 1, ease: "expo.out", stagger: 0.04, scrollTrigger: { trigger: ".faq-wrap", start: "top 88%", once: true } });
};

/* footer wordmark */
var footDone = false;
function footer() {
  var wm = $(".wordmark"), ch = splitChars(wm);
  boldField(ch, $(".foot"), 400, { radius: 0.16 });
  if (REDUCED || footDone) return;
  gsap.fromTo(ch, { yPercent: 100 }, { yPercent: 0, duration: 1.4, ease: "expo.out", stagger: 0.05, scrollTrigger: { trigger: wm, start: "top 95%", once: true, onEnter: function () { footDone = true; } } });
  wm.style.overflow = "hidden";
}

/* ==========================================================
   ROUTER
   ========================================================== */
function setMeta(title, desc, path) {
  document.title = title;
  var url = "https://boldface.online" + path, q = function (sel) { return document.querySelector(sel); };
  [['meta[name="description"]', desc], ['meta[property="og:url"]', url], ['meta[property="og:title"]', title], ['meta[property="og:description"]', desc], ['meta[name="twitter:title"]', title], ['meta[name="twitter:description"]', desc]]
    .forEach(function (m) { var el = q(m[0]); if (el) el.setAttribute("content", m[1]); });
  if (q('link[rel="canonical"]')) q('link[rel="canonical"]').setAttribute("href", url);
}
function applyPageSeo(id) { var s = PAGE_SEO[id]; if (s) setMeta(s.title, s.desc, s.path); }
function routeFromLocation() {
  var p = location.pathname.replace(/index\.html$/, ""), k;
  if (p.charAt(p.length - 1) !== "/") p += "/";
  for (k in ART) if (ART[k].path === p) return { page: "playbook", art: k };
  for (k in PAGE_SEO) if (PAGE_SEO[k].path === p) {
    if (k !== "home") return { page: k };
    var h = (location.hash || "").replace(/^#\/?/, "").replace(/\/+$/, "");
    if (h) {
      if (PAGE_SEO[h]) return { page: h, legacy: true };
      for (var j in PAGE_SEO) if (PAGE_SEO[j].path.replace(/^\/|\/$/g, "") === h) return { page: j, legacy: true };
    }
    return { page: "home" };
  }
  return { page: "home", unknown: true };
}
var current = null, busy = false;
function setActive(id) {
  var par = PAGE_SEO[id] && PAGE_SEO[id].parent;
  $$(".pg").forEach(function (p) { p.classList.toggle("on", p.id === id); });
  $$(".nav-links a,.m-link").forEach(function (a) { a.classList.toggle("on", a.dataset.page === id || (!!par && a.dataset.page === par)); });
}
function show(id, fromPop) {
  setActive(id); current = id;
  document.body.classList.toggle("show-fab", id !== "home");
  if (artOpen) closeArticle(true);
  toTop(); applyPageSeo(id);
  if (!fromPop && PAGE_SEO[id] && location.pathname !== PAGE_SEO[id].path) { try { history.pushState({ page: id }, "", PAGE_SEO[id].path); } catch (e) {} }
  mount(id);
}
function goTo(id, fromPop) {
  hydrate();
  if (!document.getElementById(id) || !PAGE_SEO[id]) id = "home";
  if (busy) return;
  if (id === current && !artOpen) { closeMenu(); if (lenis) lenis.scrollTo(0, { duration: 1.6 }); else scrollTo({ top: 0, behavior: "smooth" }); return; }
  if (!G || REDUCED) { closeMenu(); show(id, fromPop); runIntro(); return; }
  busy = true;
  var out = [document.getElementById(current), $(".foot")];
  gsap.timeline({ onComplete: function () { busy = false; } })
    .to(out, { opacity: 0, y: -24, duration: 0.35, ease: "power2.in" })
    .add(function () {
      closeMenu(); gsap.set(out, { clearProps: "transform,opacity" });
      show(id, fromPop);
      var inn = [document.getElementById(id), $(".foot")];
      gsap.fromTo(inn, { opacity: 0 }, { opacity: 1, duration: 0.6, ease: "power2.out", clearProps: "opacity" });
      runIntro();
    });
}
document.addEventListener("click", function (e) {
  if (e.defaultPrevented || e.button || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) return;
  if (e.target.closest("#artBack")) { e.preventDefault(); closeArticle(); return; }
  var ar = e.target.closest("[data-article]");
  if (ar) {
    e.preventDefault(); if (innerWidth < 720) vaaniToggle(false);
    if (current === "playbook") openArticle(ar.dataset.article);
    else { goTo("playbook"); setTimeout(function () { openArticle(ar.dataset.article); }, G && !REDUCED ? 900 : 0); }
    return;
  }
  var el = e.target.closest("[data-page]");
  if (el) { e.preventDefault(); if (el.closest("#vBox") && innerWidth < 720) vaaniToggle(false); goTo(el.dataset.page); }
});
addEventListener("popstate", function () {
  var r = routeFromLocation();
  if (r.art) {
    if (current === "playbook") openArticle(r.art, true);
    else { goTo("playbook", true); setTimeout(function () { openArticle(r.art, true); }, G && !REDUCED ? 900 : 0); }
    return;
  }
  if (r.page === current && artOpen) { closeArticle(true); applyPageSeo(current); return; }
  goTo(r.page, true);
});
addEventListener("hashchange", function () { var r = routeFromLocation(); if (r.legacy && r.page !== current) goTo(r.page); });
(function () {
  var wide = innerWidth > 900, t;
  addEventListener("resize", function () {
    clearTimeout(t);
    t = setTimeout(function () { var nw = innerWidth > 900; if (nw !== wide) { wide = nw; mount(current); } else if (G) ScrollTrigger.refresh(); }, 250);
  });
})();

/* ==========================================================
   LOADER + BOOT
   ========================================================== */
function boot() {
  var r = routeFromLocation(), id = r.page;
  if (!document.getElementById(id) || !PAGE_SEO[id]) id = "home";
  if (id !== document.body.getAttribute("data-route")) hydrate();
  setActive(id); current = id;
  document.body.classList.toggle("show-fab", id !== "home");
  if (r.art) openArticle(r.art, true, true); else applyPageSeo(id);
  try { history.replaceState(r.art ? { page: id, art: r.art } : { page: id }, "", r.legacy ? PAGE_SEO[id].path : location.href); } catch (e) {}
  mount(id);
  loader(runIntro);
}
function loader(done) {
  var L = $("#ldr");
  if (!G || REDUCED || !L) { if (L) L.style.display = "none"; if (Stage) Stage.state.fade = 1; done(); return; }
  var seen = false;
  var word = $(".ldr-word", L), ch = splitChars(word), num = $(".ldr-num", L), light = $(".ldr-light", L), roles = $$(".ldr-roles span", L), flash = $(".ldr-flash", L), fin = false;
  lockScroll(true);
  gsap.set(ch, { yPercent: 100, opacity: 0, "--w": 400 });
  word.style.opacity = 1;
  function wght() { ch.forEach(function (c) { c.style.fontVariationSettings = '"wght" ' + gsap.getProperty(c, "--w") + ', "wdth" 125'; }); }
  function zoomOrigin() {
    var l = ch[2].getBoundingClientRect(), wr = word.getBoundingClientRect();
    var sx = l.left + l.width * 0.2, sy = l.top + l.height * 0.55;
    word.style.transformOrigin = (sx - wr.left) + "px " + (sy - wr.top) + "px";
    return Math.max(innerWidth, innerHeight) * 2.2 / Math.max(8, l.width * 0.22);
  }
  function finish() {
    if (fin) return; fin = true;
    var sc = zoomOrigin();
    gsap.timeline()
      .to([roles, ".ldr-meta", light], { opacity: 0, duration: 0.3 })
      .to(word, { scale: sc, duration: 1.05, ease: "expo.in" }, "-=0.1")
      .set(flash, { opacity: 1 })
      .set([word, ".ldr-bg"], { opacity: 0 })
      .add(function () { lockScroll(false); if (G) ScrollTrigger.refresh(); done(); })
      .to(flash, { opacity: 0, duration: 0.9, ease: "power2.out" })
      .set(L, { display: "none" });
  }
  if (seen) {
    gsap.timeline({ onComplete: finish })
      .to(ch, { yPercent: 0, opacity: 1, duration: 0.6, ease: "expo.out", stagger: 0.03 })
      .to(ch, { "--w": 900, duration: 0.6, ease: "power3.inOut", stagger: 0.025, onUpdate: wght }, 0.15);
    return;
  }
  var o = { p: 0 };
  var tl = gsap.timeline({ onComplete: finish });
  tl.to(o, { p: 1, duration: 2.6, ease: "power1.inOut", onUpdate: function () { num.textContent = String(Math.round(o.p * 100)).padStart(3, "0"); } }, 0)
    .fromTo(light, { xPercent: -60, opacity: 0 }, { xPercent: 60, opacity: 1, duration: 2.2, ease: "power2.inOut" }, 0.1)
    .to(ch, { yPercent: 0, opacity: 1, duration: 0.9, ease: "expo.out", stagger: 0.06 }, 0.2)
    .to(ch, { "--w": 900, duration: 1.1, ease: "power3.inOut", stagger: { each: 0.07, from: "start" }, onUpdate: wght }, 0.9);
  roles.forEach(function (r, i) {
    tl.fromTo(r, { yPercent: 100, opacity: 0 }, { yPercent: 0, opacity: 1, duration: 0.35, ease: "expo.out" }, 0.5 + i * 0.45);
    if (i < roles.length - 1) tl.to(r, { yPercent: -100, opacity: 0, duration: 0.3, ease: "expo.in" }, 0.5 + i * 0.45 + 0.35);
  });
  L.addEventListener("click", function () { tl.progress(1); });
  setTimeout(finish, 6000);
}

/* ==========================================================
   VAANI
   ========================================================== */
var vOpen = false, vBusy = false;
function vaaniToggle(force) {
  vOpen = typeof force === "boolean" ? force : !vOpen;
  $("#vBox").classList.toggle("open", vOpen);
  document.body.classList.toggle("vaani-open", vOpen);
  $("#vFab").setAttribute("aria-expanded", vOpen ? "true" : "false");
  if (innerWidth < 720) lockScroll(vOpen);
  if (vOpen && !$("#vMsgs").children.length) {
    vMsg("a", "Hi, I'm Vaani. I know everything on this site: our services, pricing, process, every case study and all eighteen Playbook guides. What would you like to know?");
    vChips(["What do you do?", "How much does it cost?", "Show me results", "Book a call"]);
  }
  if (vOpen && !TOUCH) setTimeout(function () { $("#vInp").focus(); }, 350);
}
function vChips(list) {
  var cc = $("#vChips"); cc.innerHTML = "";
  (list || []).forEach(function (c) { var b = document.createElement("button"); b.type = "button"; b.textContent = c; b.addEventListener("click", function () { vSend(c); }); cc.appendChild(b); });
}
function vMsg(type, content) {
  var m = $("#vMsgs"), d = document.createElement("div");
  d.className = "v-m " + type;
  var bub = document.createElement("div"); bub.className = "bub";
  if (type === "u") bub.textContent = content; else bub.innerHTML = content;
  d.appendChild(bub); m.appendChild(d);
  if (G && !REDUCED) gsap.from(d, { y: 14, opacity: 0, duration: 0.5, ease: "expo.out" });
  m.scrollTop = m.scrollHeight;
}
async function vSend(text) {
  if (!text || !text.trim() || vBusy) return;
  vBusy = true;
  vMsg("u", text.trim()); $("#vInp").value = ""; vChips([]);
  var m = $("#vMsgs"), td = document.createElement("div");
  td.className = "v-m a"; td.innerHTML = '<div class="v-dots"><i></i><i></i><i></i></div>';
  m.appendChild(td); m.scrollTop = m.scrollHeight;
  var t0 = performance.now(), r = await Vaani.ask(text);
  var plain = r.html.replace(/<[^>]+>/g, ""), wait = Math.min(2200, 450 + plain.length * 9) - (performance.now() - t0);
  setTimeout(function () { td.remove(); vMsg("a", r.html); vChips(r.chips || []); vBusy = false; }, Math.max(0, wait));
}
$("#vFab").addEventListener("click", function () { vaaniToggle(); });
$("#vClose").addEventListener("click", function () { vaaniToggle(false); });
$("#vForm").addEventListener("submit", function (e) { e.preventDefault(); vSend($("#vInp").value); });

if (document.fonts && document.fonts.ready) {
  var booted = false, b = function () { if (!booted) { booted = true; boot(); } };
  document.fonts.ready.then(b); setTimeout(b, 1500);
} else boot();
})();

