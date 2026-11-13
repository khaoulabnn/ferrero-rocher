// The presentation's structure, in the exact order and wording of the group
// report (DM assignment .docx). Part 1 is labelled a–g and Part 2 a–e, as in the
// assignment question; ids keep the report's numbering (1.1–2.5) for internal links. `components` are the elements each section must
// cover according to the assignment question; their text is filled in by the
// section's presenter. Empty fields show as designed headings only.

export const SECTIONS = [
  { id: 'exec', no: '', title: 'Executive Summary', presenter: 'Khaoula', part: 0,
    components: { 'Executive summary': '' } },                                     // EDIT (group)

  { id: '1.1', no: 'a.', title: 'Content Marketing', presenter: 'Khaoula', part: 1,
    sub: ['Campaign Overview', 'Content Strategy and Creation', 'Performance Evaluation'] },
  { id: '1.2', no: 'b.', title: 'Display Advertising', presenter: 'Hodan', part: 1,
    components: { 'Ad formats': '', 'Buying models': '', 'Targeting techniques': '' } },          // EDIT (Hodan)
  { id: '1.3', no: 'c.', title: 'Social Media Marketing', presenter: 'Lina', part: 1,
    components: { 'Platform-specific strategies': '', 'Sample posts': '', 'Campaign ideas': '' } }, // EDIT (Lina)
  { id: '1.4', no: 'd.', title: 'Website Optimisation', presenter: 'Karen', part: 1,
    components: { 'User experience': '', 'Site performance': '', 'Mobile responsiveness': '', 'Landing page effectiveness': '' } }, // EDIT (Karen)
  { id: '1.5', no: 'e.', title: 'Search Engine Optimisation (SEO)', presenter: 'Karen', part: 1,
    components: { 'Keyword research': '', 'On-page SEO': '', 'Off-page SEO': '', 'Optimisation techniques': '' } }, // EDIT (Karen)
  { id: '1.6', no: 'f.', title: 'Paid Search Campaigns', presenter: 'Hansan', part: 1,
    // updated slides received 5 Nov 2026 (Hansan Paid_Search_Slides.pptx); the full wording is in PAID below
    components: { 'Targeting approach': 'Branded + everyday-gifting keywords; broad, multicultural Malaysian audience; ads run all year',
      'Ad copy examples': 'Proposed ad mock-ups: headlines max. 30 characters, descriptions max. 90',
      'Bidding strategy': 'Bids follow the awareness objective' } },
  { id: '1.7', no: 'g.', title: 'Customer Relationship Management (CRM)', presenter: 'Hodan', part: 1,
    components: { 'CRM tools': '', 'Engagement': '', 'Retention': '', 'Loyalty': '' } },          // EDIT (Hodan)

  { id: '2.1', no: 'a.', title: 'Introduction to Digital Marketing', presenter: 'Hansan', part: 2,
    components: { 'Strategic marketing paradigm shift': '', 'Traditional marketing practices': '', 'Digital marketing practices': '' } }, // EDIT (Hansan)
  { id: '2.2', no: 'b.', title: 'Aligning Digital Marketing with Business Strategy', presenter: 'Hodan', part: 2,
    components: { 'Strategic planning': '', 'E-business planning': '', 'ESP framework': '', 'E-business models': '', 'Digital performance metrics': '' } }, // EDIT (Hodan)
  { id: '2.3', no: 'c.', title: 'Challenges and Research in the Digital Landscape', presenter: 'Karen', part: 2,
    components: { 'Current trends': '', 'Challenges': '', 'Implications of internet technologies': '', 'Digital buyer journey': '' } }, // EDIT (Karen)
  { id: '2.4', no: 'd.', title: 'Effective Digital Strategy', presenter: 'Lina', part: 2,
    components: { 'Objective setting': '', 'Resource allocation': '', 'Budgeting considerations': '' } }, // EDIT (Lina)
  { id: '2.5', no: 'e.', title: 'User Experience and Personalisation', presenter: 'Khaoula', part: 2,
    components: { 'Importance of user experience': 'from draft', 'UX and UI': 'from draft', 'Personalisation strategies': 'from draft' } },
];

export const byId = id => SECTIONS.find(s => s.id === id);

// Facts quoted from the report, §1.1.1 Campaign Overview
export const CAMPAIGN = {
  name: 'You Don’t Need an Occasion',
  tagline: 'Share a little love.',
  market: 'Ferrero Rocher, Malaysia',
  context: 'In Malaysia’s multicultural market, the chocolate is commonly linked to festive and milestone gifting (for example Hari Raya, Chinese New Year and Deepavali), which leaves ordinary days unclaimed.',
  concept: 'The Unsent Message',
  conceptLine: 'A thank-you left unsaid is finally shared, with Ferrero Rocher, on an ordinary day.',
  objective: 'Increase brand awareness by shifting the perception of Ferrero Rocher from occasion-only gifting to an everyday gesture of affection and appreciation.',
  audience: 'Malaysians of all backgrounds, with stories about families, friends, couples and everyday moments.',
  status: 'Fictional student concept, not affiliated with Ferrero.',
};

// 1.6 Paid Search Campaigns — Hansan's content, word for word from her slides
// (Paid_Search_Slides.pptx, received 3 Nov 2026). Edit here; the six 1.6 scenes read it.
export const PAID = {
  // Hansan's updated slides (Hansan Paid_Search_Slides.pptx, received 5 Nov 2026), word for word.
  // They replace the slides received on 3 Nov.
  search: {
    title: 'Search today',
    lead: 'Search shows an unclaimed brand name and occasion-only demand',
    findings: [
      ['Unclaimed brand name', 'the only ad on “ferrero rocher” is a florist’s, not Ferrero’s'],
      ['Occasion-only demand', 'searches peak at Christmas (100) and February (84), then fall to 24 in June'],
      ['Growing everyday need', '“small gift ideas” searches rose ninefold year on year'],
    ],
    shot: { src: 'assets/paid/bing-ferrero-rocher.png', caption: 'Bing search for “ferrero rocher” in Malaysia' },
    chart: { src: 'assets/paid/trends-ferrero-rocher-my-2026.png', caption: 'Google Trends, “ferrero rocher”, Malaysia, Oct 2025 – Oct 2026' },
  },
  audience: {
    title: 'Audience and timing',
    lead: ['Occasion-only demand, ', 'year-round ads'],
    text: 'broad, multicultural Malaysian audience + remarketing to campaign-video viewers; ads run all year',
    points: [['Audience', 'broad, multicultural Malaysian audience'], ['Remarketing', 'to campaign-video viewers'], ['Timing', 'ads run all year']],
  },
  keywords: {
    title: 'Google Ads',
    lead: 'Google Search Ads: branded + everyday-gifting keywords',
    branded: { list: ['ferrero rocher', 'ferrero rocher price malaysia'], why: 'defend the name from resellers', cite: '(Simonov et al., 2018)' },
    everyday: { list: ['thank you gift', 'gift for colleague', 'chocolate to share'], why: 'reach people who have not chosen a brand', cite: '(Tunuguntla et al., 2023)' },
    negative: ['empty box', 'wholesale', 'jobs'],
  },
  ads: {
    title: 'Google Ads examples',
    lead: 'Proposed ad mock-ups: headlines max. 30 characters, descriptions max. 90',
    cite: '(Google, n.d.-a)',
    list: [
      { label: 'Brand ad', url: 'www.ferrerorocher.com', headlines: ['Ferrero Rocher Malaysia', 'No Occasion Needed', 'Share a Little Love'],
        description: 'You don’t need a special day to show you care. Watch our story and share a little love.',
        sitelinks: ['Watch the Film', 'Read the Story', 'Find a Store'] },
      { label: 'Everyday-gifting ad', url: 'www.ferrerorocher.com', headlines: ['A Small Gift, Any Day', 'Just Because, Share Gold'],
        description: 'A small gesture can make an ordinary day special. Find Ferrero Rocher near you.' },
    ],
  },
  bidding: {
    title: 'Bidding strategy',
    lead: 'Bids follow the awareness objective',
    brand: { who: 'Brand keywords', strategy: 'Target Impression Share', why: 'Keep Ferrero Rocher at the top, above resellers', cite: '(Google, n.d.-b; Simonov et al., 2018)' },
    gifting: { who: 'Gifting keywords', first: ['Maximize Clicks', 'Cost cap while testing'], then: ['then Conversions', 'then bid for video plays and “Find a Store” clicks'],
      note: 'Top spot not required', cite: '(Ghose & Yang, 2009)' },
    budget: 'Budget: steady all year, to match the year-round message',
  },
  measure: {
    title: 'Measurement of success',
    test: { head: 'Controlled test, not clicks alone', text: 'Pause ads in selected Malaysian regions and compare results, since click data overstate impact', cite: '(Blake et al., 2015)' },
    list: [['Brand', 'impression share'], ['Click-through', 'rate (CTR)'], ['Campaign page', 'visits']],
    note: 'Proposed KPIs, not achieved results',
  },
};

// Khaoula's opening and Part 2 e. — word for word from her deck
// (Ferrero Rocher Malaysia Opening and Content Marketing.pptx, received 3 Nov 2026).
export const OPENING = {
  challenge: {
    label: 'The brand challenge',
    quote: '“Ferrero Rocher is only for special occasions.”',
    problem: ['The problem', 'Linked mainly to special occasions and gifting'],
    opportunity: ['The opportunity', 'An everyday chocolate to share, for everyday gestures of affection and appreciation'],
  },
  overview: {
    label: 'Campaign overview',
    name: 'You Don’t Need a Special Occasion',
    facts: [['Market', 'Malaysia'], ['Primary objective', 'Increase brand awareness'], ['Core message', 'Everyday moments are worth sharing.'],
      ['Target audience', 'Diverse cultural representation, with stories featuring families, friends, couples, and everyday moments']],
    tagline: '“You don’t need an occasion. Share a little love.”',
  },
  intro: {
    label: 'Introducing our campaign',
    line: 'Calendars mark the special days. Gold marks the ordinary ones.',
    position: 'Our campaign positions Ferrero Rocher as part of everyday moments, not only special days.',
    share: 'Share a little love without waiting for a reason.',
    from: 'Only for special occasions',
    to: 'An everyday gesture of affection and appreciation',
  },
};

// BUILT = exists in the campaign assets; PROPOSED = idea in the report, not built.
export const UXP = {
  touch: {
    title: 'One message, one look, a clear next step',
    ux: 'UX is how smoothly the journey works.', ui: 'UI is how clearly it looks and presents.',
    cards: [
      { stage: 'Awareness', status: 'BUILT', name: 'Display banners', buttons: ['Watch the story'], note: 'Three sizes, including mobile', img: 'assets/img/ferrero-rocher-banner-300x250@2x.png' },
      { stage: 'Awareness', status: 'BUILT', name: 'Video', lines: ['Short social cut for quick viewing', 'Original song for recall'], video: 'assets/clips/short.mp4', img: 'assets/posters/short.jpg' },
      { stage: 'Interest', status: 'BUILT', name: 'Blog article', buttons: ['Read the story', 'Pick a Tuesday'], note: 'Works on phone and desktop', img: 'blog/img/hero-wide.jpg' },
      { stage: 'Retention', status: 'BUILT', name: 'Email newsletter', buttons: ['Share a little love'], note: '640 px wide, dark-mode support', img: 'newsletter/img/hero.jpg' },
    ],
    footnote: 'BUILT: exists in our campaign assets. PROPOSED: idea in our report, not built. Email not yet tested in real email clients.',
  },
  page: {
    title: 'From reading the story to sharing it',
    caption: 'Blog article, the campaign page (opening view)',
    steps: [['Find', 'SEO tags help people discover the page'], ['Land', 'one headline, three buttons: Read the story, Pick a Tuesday, Share a little love'],
      ['Share', 'message tool (Pick a Tuesday)'], ['Any screen', 'tested from 320 to 1440 px']],
    note: 'Built and browser-tested. Set to noindex on purpose, with a placeholder canonical link.',
  },
  pers: {
    title: 'Make sharing relevant to each person',
    cards: [
      ['By relationship', 'Pick friend, colleague or family for matching message prompts and gift sizes', 'Fits our moments: friend, colleague, family'],
      ['Email triggers', 'Browse-abandonment reminders, replacing festive-only mailings'],
      ['Opt-in reminders', 'Reminders for ordinary dates people choose themselves'],
      ['Dynamic content', 'Content that adapts by device and location'],
    ],
    privacy: 'Privacy first: opt-in, minimal, transparent and easy to withdraw, in line with Malaysia’s PDPA 2010 as amended.',
    cite: 'Tam & Ho (2006): personalisation can decrease effort and increase relevance.',
  },
  support: {
    title: 'How it supports awareness and everyday sharing',
    cols: [
      ['Brand awareness', [['BUILT', 'Same slogan and look on every touchpoint'], ['BUILT', 'Short video and banners, quick to view and share']]],
      ['Everyday sharing', [['BUILT', 'Clear buttons and a message tool on the page'], ['PROPOSED', 'Relationship-based message prompts'], ['PROPOSED', 'Opt-in reminders for self-chosen ordinary dates']]],
    ],
    test: 'How we will test it (proposed): A/B test against non-personalised groups. Track click-through, conversion, repeat purchase, order value, task completion and unsubscribe rate.',
    kpis: 'Part 1 KPIs: video views (awareness), shares and UGC (advocacy).',
  },
};

// Karen's Part 1 d. and e. — word for word from her slides and speaker notes
// (Karen_Website_SEO_DigitalLandscape_v3.pptx, received 3 Nov 2026).
export const KAREN = {
  audit: {
    title: 'Website optimisation audit',
    lead: ['Mobile is the ', 'weak point'],                       // notes: “every lab test shows mobile as the weak point”
    desktop: { label: 'Desktop performance', score: 91, sub: 'Lighthouse' },
    mobile: { label: 'Mobile performance', score: 68, sub: '45/100 in Backlinko' },
    findings: [
      'Core Web Vitals pass for real users, but mobile lab tests are much weaker',
      'Mobile main content loads in 4.1 s, above Google’s 2.5 s threshold',
      'Render-blocking code is the main issue: fixing it could save about 2.28 s',
      'Navigation is occasion-led: 3 of 8 homepage categories are festive',
    ],
    why: 'The navigation is built around festivals, which reinforces the perception the campaign wants to change.',
    cite: 'Speed matters even for awareness: a 0.1-second mobile improvement increased page views and site progression (Deloitte, 2020).',
    shots: [
      { src: 'assets/karen/pagespeed.png', caption: 'PageSpeed Insights mobile real-user data' },
      { src: 'assets/karen/lighthouse.png', caption: 'Lighthouse mobile report' },
    ],
  },
  search: {
    title: 'SEO analysis',
    lead: ['People search for ', 'price and for small gift ideas'],   // notes, slide 2
    kd: [
      { label: 'Keyword difficulty', value: '31%', sub: '“ferrero rocher”, Malaysia', note: 'Brand searches are fairly easy to rank for in Malaysia.' },
      { label: 'Bouquet keywords', value: '13%', sub: 'KD: easy to rank', note: 'Bouquet keywords are the cheapest organic opportunity.' },
    ],
    // [keyword, searches (MY), competition / KD, which main search it belongs to]
    table: [
      ['ferrero rocher', '10K–100K', 'High; KD 31%', ''],
      ['small gift ideas', '100–1K (+900%)', 'High', 'gift'],
      ['sweet treat', '100–1K', 'Low', ''],
      ['chocolate bouquet', '1K–10K', 'High', 'bouquet'],
      ['ferrero rocher bouquet', '480', 'KD 13%', 'bouquet'],
      ['harga ferrero rocher', '590', 'KD 13%', 'price'],
      ['chocolate gift', '100–1K', 'High', ''],
    ],
    main: { label: 'Main searches in Malaysia', items: [['price', 'Price (“harga ferrero rocher”)'], ['bouquet', 'Bouquets'], ['gift', 'Small gift ideas (+900% YoY)']] },
    sources: 'Sources: Google Keyword Planner and Semrush (Malaysia)',
  },
  links: {
    onpage: { label: 'On-page gaps', items: ['11 images without alt text', '31-character meta description', 'no Open Graph preview'],
      why: 'These matter because the campaign relies on sharing.' },
    offpage: [
      { label: 'Domain authority', value: '50', sub: 'Moz' },
      { label: 'Linking domains', value: '177', sub: '7,100 links; little growth' },
    ],
    lever: { line: 'Off-page, links come from only 177 domains, so backlinks are the next lever:', who: ['Food bloggers', 'Florists', '#ShareALittleLove PR'] },
    shot: { src: 'assets/karen/moz.png', caption: 'Moz Link Explorer overview' },
    sources: 'Sources: Moz Link Explorer; Backlinko SEO Checker',
  },
};

// Lina's Part 1 c. — word for word from her slides and her rollout figure
// (Lina social media ppt.pptx, received 7 Nov 2026).
export const LINA = {
  audit: {
    title: 'From an absent brand to one role per platform',
    label: 'Audit (28 Oct 2026)',
    shot: { src: 'assets/lina/audit.jpg', caption: 'Figure 1.3.6: Facebook MY, Instagram Spain, TikTok Mexico', alt: 'Social media audit screenshots' },
    findings: ['No Malaysian Instagram or TikTok', 'Facebook inactive since April (2 reactions)', 'Positioning: “the most special moments” only'],
  },
  platforms: {
    label: 'Platform mock-ups (original)',
    list: [
      { name: 'TikTok', role: 'young adults, 15 to 30 s edit, #ShareALittleLove', src: 'assets/lina/tiktok.jpg', alt: 'TikTok short-edit mock-up' },
      { name: 'Facebook', role: 'families, bilingual tag post', src: 'assets/lina/facebook.jpg', alt: 'Facebook bilingual post mock-up' },
      { name: 'YouTube', role: 'full film and song, 6 s bumpers', src: 'assets/lina/youtube.jpg', alt: 'YouTube thumbnail mock-up' },
      { name: 'Instagram', role: 'premium image, Reels and carousel', src: 'assets/lina/instagram-carousel.jpg', alt: 'Instagram carousel mock-up' },
    ],
  },
  rollout: {
    title: 'Campaign rollout',
    lead: ['Each wave turns ', 'viewers into sharers'],
    figure: 'Figure 1.3.5: social media rollout for one campaign wave',
    waves: [
      { name: 'Tease', when: 'Week 1', weeks: [1, 1], items: ['“Empty seat” 6 s clips (TikTok, Reels)', '15 s song snippet as TikTok sound', 'Story poll: “Who would you save a seat for?”'] },
      { name: 'Launch', when: 'Weeks 2 to 4', weeks: [2, 4], items: ['Full film on YouTube + bumper ads', 'Short edit on TikTok, Instagram, Facebook', 'Micro-influencer posts go live'] },
      { name: 'Sustain', when: 'Weeks 5 to 8', weeks: [5, 8], items: ['#ShareALittleLove challenge (UGC)', 'Repost best entries, carousel tips', 'Video viewers added to remarketing lists'] },
    ],
    allYear: ['All year', 'waves run between the December and February peaks, so the brand links to ordinary days'],
    offpeak: 'Waves run in off-peak months (e.g. March to November), when search interest in the brand is lowest (Part 1 · e. and f.).',
    integration: ['Integration', 'every post links to the landing page; video viewers feed search remarketing'],
    engagement: { label: 'Engagement', head: 'Users become co-creators', text: 'Bilingual captions and labelled posts by Malay, Chinese and Indian micro-influencers build trust', cite: '(Lou & Yuan, 2019; Appel et al., 2020)' },
    kpis: ['Reach', 'Video completion', 'Shares', 'Hashtag entries'],
    kpiNote: 'Proposed KPIs, not achieved results', kpiCite: '(Schivinski & Dąbrowski, 2016)',
  },
};

// Hodan's Part 1 b. and g. — word for word from her slides and speaker notes
// (Hodan Ferrero Rocher – Display & CRM (2).pptx, received 7 Nov 2026).
export const HODAN = {
  reach: {
    title: 'Display advertising',
    lead: ['Reach people ', 'before they search.'],
    why: 'Nobody searches for a chocolate to share on an ordinary day, so display brings the message to people while they browse.',
    objectives: [['Reach and awareness', 'Show the message to as many people in Malaysia as possible'], ['Visits to the story', 'Bring interested viewers to the campaign blog page']],
    choice: 'In Google Ads, we chose a Display campaign rather than the Search campaign Google recommended.',
    shot: { src: 'assets/hodan/display-campaign.png', caption: 'Display campaign set up in Google Ads', alt: 'Google Ads screen where the Display campaign type is selected instead of the recommended Search campaign' },
    campaign: 'Ferrero Rocher Malaysia · “You Don’t Need a Special Occasion”',
  },
  formats: {
    title: 'Formats',
    lead: ['Three sizes. ', 'Three moments.'],
    sizes: [
      { size: '728 × 90', name: 'Leaderboard', moment: 'Affection', where: 'Desktop · top of web pages' },
      { size: '300 × 250', name: 'Medium rectangle', moment: 'Happiness', where: 'Within articles, mobile and desktop' },
      { size: '320 × 50', name: 'Mobile banner', moment: 'Reconciliation', where: 'Mobile · bottom of a phone screen' },
    ],
    same: 'Same photo, colours, slogan and “Watch the story” button: one recognisable campaign.',
    why: 'We use the traditional static format, because the message has to be understood at a glance.',
    shot: { src: 'assets/hodan/banner-placements.jpg', alt: 'Mock-up of the three proposed banners: a leaderboard on a desktop news page, a medium rectangle inside a mobile article and a mobile banner at the bottom of a phone screen' },
    source: 'Traditional static banners in standard Google Display Network sizes (Google, n.d.)',
  },
  buying: {
    title: 'Buying',
    lead: ['Pay to be seen, ', 'not to be clicked.'],
    list: [['Viewable CPM', 'Pay per 1,000 impressions people can actually see'], ['Network buy', 'Google Display Network: many sites and apps, one platform'], ['Programmatic + dayparting', 'Ads in the evenings and at weekends, when people browse freely']],
    notUsed: ['CPC', 'CPL', 'CPA'],
    notUsedWhy: 'The campaign asks for attention, not for forms or purchases.',
    shot: { src: 'assets/hodan/vcpm.png', caption: 'Viewable CPM bid strategy set up in Google Ads', alt: 'Google Ads bidding screen with Viewable impressions selected and the message that the campaign will use the Viewable CPM bid strategy' },
  },
  targeting: {
    title: 'Targeting',
    lead: ['Reach new people, ', 'then remind them.'],
    steps: [['Geo + language', 'Malaysia, English and Bahasa Malaysia'], ['(a) Contextual', 'pages about food and family'], ['(b) Behavioural', '“Foodies” and “Family-Focused”'], ['Retargeting', 'blog visitors later see the other moments']],
    leftOut: 'Gift and holiday segments left out on purpose, because they would link the brand back to special occasions.',
    measured: [['Reach', ['Impressions', 'Reach', 'Viewability']], ['Visits to the story', ['Click-through rate', 'Cost per click', 'Blog page visits']]],
    shot: { src: 'assets/hodan/targeting.png', caption: 'Targeting set up in Google Ads · Gift and holiday segments left out on purpose', alt: 'Google Ads screenshots: Topics set to Food and Drink and Family and Relationships, and affinity segments Foodies and Family-Focused' },
  },
  crm: {
    title: 'Customer Relationship Management (CRM) · Airtable',
    lead: ['The CRM, ', 'built in Airtable.'],
    parts: [
      { tag: '(a) The form', lines: ['Each answer goes straight into the CRM base', 'Explicit consent, in line with Malaysia’s PDPA'], src: 'assets/hodan/crm-form.png', alt: 'Airtable form editor with fields for first name, last name, email, preferred language, favourite everyday moment and email consent' },
      { tag: '(b) The contacts', lines: ['Grouped by moment and language, ready for personalised emails'], src: 'assets/hodan/crm-contacts.png', alt: 'Airtable contacts table grouped by favourite moment, with each contact’s preferred language' },
      { tag: '(c) The result', lines: ['Designed to take under a minute, with no birthday or festival question'], src: 'assets/hodan/crm-signup.png', alt: 'Final campaign sign-up form titled Share a little love, any day, with name, email, language, favourite moment, consent and a Join the community button' },
    ],
    base: '“Share a Little Love CRM” base in Airtable · Sample contacts are fictional test data',
  },
};
