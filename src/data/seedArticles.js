// Seed content pulled from the current unmignite.com site so the demo feels real.
// Everything here is editable (and extendable) from the Studio once you log in.

export const SECTIONS = [
  { slug: 'music', name: 'Music', color: '#ff10a3', blurb: 'No filters, no censors. Just pure music journalism.' },
  { slug: 'film-tv', name: 'Film & TV', color: '#f73630', blurb: 'From the silver screen to the small screen — watched, dissected, adored.' },
  { slug: 'beauty-style', name: 'Beauty & Style', color: '#ffed00', blurb: 'Runways, racks and everything your wardrobe is afraid to ask.' },
  { slug: 'opinions', name: 'Opinions', color: '#8acd01', blurb: 'Loud thoughts, carefully written. Agree at your own risk.' },
  { slug: 'food-travel', name: 'Food & Travel', color: '#fc4c00', blurb: 'Eat first, write later. Stories from plates and places.' },
  { slug: 'news', name: 'News', color: '#f73630', blurb: 'What is happening on campus and why it matters.' },
  { slug: 'sports', name: 'Sports', color: '#8acd01', blurb: 'Sweat, rivalries and glory — varsity and beyond.' },
  { slug: 'notts-uncovered', name: 'Notts Uncovered', color: '#fc4c00', blurb: 'The hidden corners of Nottingham, uncovered one story at a time.' },
  { slug: 'the-review', name: 'The Review', color: '#737373', blurb: 'Our flagship long-reads and annual print edition.' },
]

export const seedArticles = [
  {
    id: 'a1',
    slug: 'pink-floyd-had-a-great-gig-in-the-sky-so-25db-had-theirs-in-a-lecture-hall',
    title: 'Pink Floyd Had a Great Gig in the Sky, So 25dB Had Theirs in a Lecture Hall.',
    dek: 'Did you know our very own UNM campus has its own local pop-punk band, 25dB? Our Music writer, Atirah, attended their Analysis Paralysis EP launch and spoke with the band about their music, inspirations, and what they have in store next.',
    section: 'music',
    author: 'Raja Nurdini Akmar Atirah',
    date: '2026-05-25',
    readTime: 6,
    cover: 'https://static.wixstatic.com/media/637e18_20d9c7ed8b1844e08459a28bbd7f5909~mv2.jpg/v1/fill/w_1000,h_667,al_c,q_85,usm_0.66_1.00_0.01/637e18_20d9c7ed8b1844e08459a28bbd7f5909~mv2.jpg',
    coverCredit: 'Alif Farhan',
    tags: ['Local Music', 'Band Interview', '25dB'],
    featured: true,
    status: 'published',
    credits: { writer: 'Raja Nurdini Akmar Atirah', editor: 'Syamilah', chief: 'Sue Ann' },
    body: `
<p>While everyone was having fun with April Fools on Instagram, local pop-punk band 25dB decided to go against the tradition and announce something big (and legitimate): an EP launch party exclusively on the UNM campus.</p>
<p>Hearing about the show, I stepped into the venue hours before it started to be greeted by familiar faces of 25dB: Zu (guitarist), Irsyad (frontman), Darren (drummer) and Hanna (bassist).</p>
<p>Although it was still soundcheck, the room filled up with more and more people, and soon completely swamped within the next hour.</p>
<p>When the clock struck 7:30pm, the show began. Irsyad opened the night by thanking the audience for coming to the show, sharing that the performance also marked a significant milestone as part of his Final Year Project. His words carried a sincere sense of gratitude as he introduced the first song of the night: “As You Should”, an upbeat song written by himself.</p>
<p>Darren gave the cue, and soon the sound of instruments electrifyingly filled the hall, immediately leaving the audience in awe at first listen. Through its lyrics and the members’ expressions, the meaning behind it became obvious: a story of being led on, and the romantic frustrations from it.</p>
<blockquote><p>You confuse me / Endless cycles of my patience, / wearing thin and / wearing me out again.</p></blockquote>
<p>The melodies felt both comfortingly familiar and refreshingly new at the same time. “As You Should” captures the perplexity of an unreciprocated love, presenting it for what it is, without any sugarcoating.</p>
<p>The atmosphere darkened almost instantly for the second song, “Kill Me”. To everyone’s surprise, 25dB pivoted into a much heavier sound, embracing an almost hard rock edge — a combination of funky riffs, and lyrics that feel like a poem. Zu, screaming <em>Kill Me</em> over and over again, successfully seized the room’s attention.</p>
<h2>Resident Nervous Wreck</h2>
<p>Back to their original programme, the band introduced their EP’s third track “Resident Nervous Wreck”, or “RNW”, which was factually inspired by ‘the orange guy’ from the movie Inside Out 2: Anxiety.</p>
<blockquote><p>As your Resident Nervous Wreck / It’s my duty to serve no purpose / And wallow in my self deprived elation</p></blockquote>
<p>The song speaks aloud about the paralysis that often comes with anxiety and procrastination. The feeling of wanting to do something, but becoming so mentally overwhelmed that it stops you from functioning ‘normally’. It captures the frustrating state of avoiding action, just because thinking about it drains you out. Even if it's something you really care about.</p>
<p>Bassist Hanna took her turn to introduce their last song from Analysis Paralysis. In her words, “Pink Elephants” is a song about yearning.</p>
<blockquote><p>Am I there in your future? / Or am I just nothing, / but a distant memory?</p></blockquote>
<p>25dB ended their set with a song very familiar to emo fans: <em>Dear Maria, Count Me In</em>. As the members unplugged their instruments and left the stage, the crowd chanted one thing in unison — “Irsyad! Irsyad! Irsyad!”</p>
<h2>History of the Band</h2>
<p><strong>Irsyad:</strong> While I was in Year 1, me and Hanna (bassist) were playing in separate bands. In 2024, we decided to form a band with Darren (drummer) and another friend, called Light Rail Transit or LRT. As Hanna graduated, and I took a gap year, LRT was not really a thing for a while, until I met Zu. We played in a Malay indie rock band quite a few times, which was pretty fun. So one day, I just asked him “Hey, you wanna be in an actual band together?” And the rest is history.</p>
<h2>25dB, Why the Name?</h2>
<p><strong>Irsyad:</strong> This is my favourite question to answer. The meaning changes every time but the origin behind it was that one day, I went for breakfast. While queuing to pay, the guy in front of me had a 25 dollar bill. Which shocked me, of course. And then it struck. <strong>25 Dollar Breakfast. 25dB.</strong></p>
<h2>Analysis Paralysis: The Story Behind Its Release</h2>
<p><strong>Irsyad:</strong> Our inspirations, even the name of the EP, are just from our lack of organisation, really. Me and my bandmates, we tend to get stuck in writing. Like, we’ll often have a cool riff or a cool lyric, but never really finish it as a whole song. I am a perfectionist and often overanalyse things. So when I told my lecturer about the creative block I had while curating this project, I realised I had an ‘Analysis Paralysis.’</p>
<p>The Analysis Paralysis EP Launch Party was, without a doubt, a huge success. Not only because of the band’s electrifying performances or the number of audience, but also because of how they managed to touch everyone’s hearts in one single night. Through raw emotions and passionate musicianship, 25dB marked their debut with a memorable and promising start.</p>
<p>Their journey may have begun in lecture halls, but who knows where it leads them next?</p>
<p><em>Analysis Paralysis is now available on Spotify.</em></p>
`,
  },
  {
    id: 'a2',
    slug: 'from-runway-to-racks-galliano-gets-a-barcode-at-zara',
    title: 'From Runway to Racks: Galliano Gets a Barcode at Zara',
    dek: 'Is John Galliano’s collaboration with Zara a bold new path to reinvention, or a compromise shaped by accessibility and commercial appeal? Our Beauty and Style writer, Yukthamugi, lets us in on her thoughts.',
    section: 'beauty-style',
    author: 'Yukthamugi',
    date: '2026-04-26',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_95cd6757251c43b2a06126df94b11cc7~mv2.webp/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/637e18_95cd6757251c43b2a06126df94b11cc7~mv2.webp',
    coverCredit: 'Dave Benett/Getty Images via Fast Company',
    tags: ['John Galliano', 'Zara', 'Fashion Collaboration'],
    featured: true,
    status: 'published',
    credits: { writer: 'Yukthamugi', editor: 'Germaine', chief: 'Sue Ann' },
    body: `
<p>In fashion, the most interesting collisions are rarely polite. They spark, they fracture, they seduce. The newly announced Zara x John Galliano collaboration does all three at once. Slated for September 2026, it arrives less like a partnership and more like a provocation:</p>
<blockquote><p>What happens when one of fashion’s most theatrical minds steps into the engine room of mass production?</p></blockquote>
<p>This is John Galliano’s return after a two-year hiatus following his departure from Maison Margiela in 2024, a re-entry not through the hushed reverence of couture but through the fluorescent-lit immediacy of Zara. The premise? “Re-authoring” the brand’s recent archives. Old Zara, reimagined through Galliano’s eye.</p>
<p>It sounds almost poetic. Also deeply strategic.</p>
<p>At first glance, the collaboration is wrapped in the language of sustainability, a buzzword so overworked it now arrives pre-sceptical. Zara positions the project as a creative intervention, where unsold inventory becomes an "archive", and excess becomes opportunity. Galliano himself leans into the narrative, describing a focus on form and proportion that transcends gender, season, and even story. This is not the Galliano of narrative excess, of gilded pharaohs and princesses, of Dior’s decadent dreamscapes. This is Galliano distilled – architectural, restrained, almost clinical.</p>
<p>But can Galliano ever truly be stripped of spectacle? And more importantly, should he?</p>
<h2>The Galliano Arena</h2>
<p>To understand the friction, one must revisit the Galliano arena. At Christian Dior (1996–2011), he transformed the runway into a theatre. Collections that didn’t just clothe the body but constructed entire worlds. The bias-cut dress, the newspaper print, the Dior saddle bag – each piece is a cultural artefact, steeped in narrative and craft. Later, at Maison Margiela, he pivoted by embracing deconstruction, anonymity, and the poetry of the unfinished.</p>
<p>Zara, however, is not a philosophy. It is a system. And systems demand efficiency.</p>
<p>The collaboration’s timing is almost too perfect. In July 2026, the European Union’s Ecodesign for Sustainable Products Regulation (ESPR) came into force, banning the destruction of unsold stock. For a brand built on speed, volume, and relentless newness, the implications are seismic. Inventory is no longer disposable. It must be dealt with creatively, legally, and visibly.</p>
<p>Enter Galliano, stage left.</p>
<p>The “re-authoring” concept suddenly reads less like an artistic whim and more like regulatory choreography. By reframing unsold garments as an "archive", Zara doesn’t just comply, it aestheticises compliance. Waste is no longer an operational burden; it becomes a design brief.</p>
<h2>Exclusivity Versus Access</h2>
<p>And yet, to dismiss the collaboration outright would be to ignore its cultural charge. The idea of Galliano has always been undeniably electric for many. For decades, his work has existed in rarefied spaces. Always seen and admired, yet largely unattainable. Zara offers something unprecedented: global, immediate, and democratic in scale. The girl next door, the student, and the casual observer are all granted entry into a design language once reserved for the elite.</p>
<p>It is fashion’s oldest tension, reframed for 2026: exclusivity versus access.</p>
<p>When the collection lands in September, it will shed its rhetoric and face its most unforgiving critic: the consumer. Not the abstract consumer of market reports, but the individual running their fingers along a seam, assessing the weight of a fabric, searching, perhaps unconsciously, for the ghost of Galliano within the garment.</p>
<p>Either way, Zara x Galliano is not just a collaboration. It is a litmus test. For sustainability. For authorship. For the future of fashion itself.</p>
<p>And like all the most compelling fashion moments, it leaves us with a question that lingers long after the clothes are gone: not just what we are wearing, but why.</p>
`,
  },
  {
    id: 'a3',
    slug: 'the-death-of-the-subculture',
    title: 'The Death of the Subculture',
    dek: 'Conformity’s greatest phobia used to be a unique group of people fuelled by a shared opinion, interest, behaviour or expression. Could it be that the 1% of society has learnt to play the rest of us?',
    section: 'opinions',
    author: 'Nathalie Claudia',
    date: '2026-04-19',
    readTime: 4,
    cover: 'https://static.wixstatic.com/media/637e18_d06111330a7a45b1804982cb81325571~mv2.jpg/v1/fill/w_697,h_848,al_c,q_85/637e18_d06111330a7a45b1804982cb81325571~mv2.jpg',
    coverCredit: 'Pinterest',
    tags: ['Consumerism', 'Subculture', 'Society'],
    featured: true,
    status: 'published',
    credits: { writer: 'Nathalie Claudia', editor: 'Penelope (Penny) Cheang', chief: 'Emma Gerard' },
    body: `
<p>Subcultures have driven pivotal aspects of society, especially within the spheres of expression. However, with the looming wave of technology and thereby the Internet…</p>
<blockquote><p>Is everyone more or less becoming each other?</p></blockquote>
<h2>How Have Subcultures Aided Society?</h2>
<p>Aside from supporting creativity and innovation (which in turn drove economies), the purpose of subcultures has consistently been to provide the notion that there is no such thing as “normal”. However, as the world modernises and the heavy weight of media condemns individuals, have subcultures lost their effect and perhaps been left in the past, as “trends” often are?</p>
<h2>The Evolution of Subculture</h2>
<p>Was that dark make-up a key component to your emo outfit? Well, guess what, now anyone can be emo or goth regardless of where they are, or who they are, by the easy swipe of a magical card. Consumerism and marketable products have transformed subcultures into aesthetics. The “bougie clean-girl” wardrobe is right there at ZARA and skateboarding rebelliousness has been downplayed at streetwear stores, all for the vibes, as long as it keeps making money.</p>
<p>When large corporations reduce rebellion into digits in their database, the subculture is no longer necessary to protect. Making a profit off of a subculture has chipped away at the weight or the worth of it, making it trendy and accessible worldwide, rather than special.</p>
<h2>Why Are Subcultures at Consumerism’s Mercy?</h2>
<p>Since when were skinny jeans out and baggy jeans in? Once upon a time, going to the gym wasn’t as aesthetic as today and neither was reading. But, lo and behold, it’s now considered “attractive” to be at the gym and well-read, all thanks to the algorithms on our devices. When specific habits are encouraged and supported by corporations and influencers, the masses tend to imitate. In time, viewers mimic what they consume, whether consciously or not, leading to a tied community that may view the world through a limited scope.</p>
<p>Essentially, consumerism not only kidnaps subcultures and rebrands them as aesthetics but also makes them unattainable. Viewers are given a minuscule of explosive taste, leaving them wanting more… and eventually giving more out of their pockets.</p>
<h2>Are We All “Replicas”?</h2>
<p>At this point in time, I believe deviation is the key to unlocking your earnest self. Yes, consumerism has exploited subcultures for their own benefit; however, media has provided the space for many users to express their individuality and agency to remind the globe of the true essence behind rebellion and subcultures.</p>
<p>If everyone around you, or on the Internet, or specifically on your FYP (crazy how that works) is more or less a copy of the next “looksmaxxing, 5am workouting, 3am doomscrolling” speck of being… be brave to be different and remind yourself that a culture can never be owned by money, a mere instrument designed to control generations of vibrant history.</p>
`,
  },
  {
    id: 'a4',
    slug: 'not-just-a-guest-how-food-tells-a-story-in-the-menu',
    title: 'Not Just A Guest: How Food Tells a Story in The Menu',
    dek: 'In The Menu, the dinner is not just a dinner. JY explores how food becomes a weapon for exposing elitism, ego, and the slow death of artistic passion.',
    section: 'food-travel',
    author: 'JY',
    date: '2026-04-26',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_34b26462a4914fb7aacc20e5696348be~mv2.png/v1/fill/w_1000,h_538,al_c,q_90,usm_0.66_1.00_0.01/637e18_34b26462a4914fb7aacc20e5696348be~mv2.png',
    coverCredit: 'Searchlight Pictures',
    tags: ['Film', 'Food', 'The Menu'],
    featured: true,
    status: 'published',
    credits: { writer: 'JY', editor: 'Ignite Editorial', chief: 'Sue Ann' },
    body: `
<p>In The Menu, the dinner is not just a dinner. Every course that arrives at the table of Hawthorn is a chapter, and every guest an unwilling character in a story Chef Slowik has been writing for years.</p>
<p>The film understands something that food writing has always known: what we eat is never just sustenance. It is class, it is memory, it is theatre. When the breadless bread plate lands in front of the diners — an accompaniment course with no bread, because “you will eat less than you desire and more than you deserve” — the satire stops being subtle and starts being surgical.</p>
<h2>The Art of Plating Resentment</h2>
<p>Each course escalates. Tortillas are laser-printed with the guests’ sins. A sous chef’s breaking point becomes part of the tasting menu. The film asks: at what point does craft curdle into contempt? When passion is consumed, photographed, reviewed and monetised for long enough, what is left of the person who once simply loved to cook?</p>
<p>And then there is the cheeseburger. The single most moving dish in the film is also its simplest — a smash burger, properly griddled, cheese melted just so. It is the only thing Slowik cooks all night with love, because it is the only thing anyone has asked of him with sincerity.</p>
<p>The Menu is a horror film about fine dining, but it is also a love letter to the meal that made you fall in love with food in the first place. It suggests, quietly, that the antidote to pretension is appetite — real, unembarrassed appetite.</p>
<p>Watch it hungry. Leave it thinking about who you cook for, and why.</p>
`,
  },
  {
    id: 'a5',
    slug: 'crime-101-moves-between-meditation-and-mayhem',
    title: 'Crime 101 Moves Between Meditation and Mayhem',
    dek: 'Slick heists, freeway philosophy and a cat-and-mouse duel that refuses to raise its voice. Ummo reviews Crime 101.',
    section: 'film-tv',
    author: 'Ummo',
    date: '2026-04-25',
    readTime: 4,
    cover: 'https://static.wixstatic.com/media/637e18_b7dd4d82a5fd405cabe0fcf2185a2ae6~mv2.jpg/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/637e18_b7dd4d82a5fd405cabe0fcf2185a2ae6~mv2.jpg',
    coverCredit: 'Amazon MGM Studios',
    tags: ['Film Review', 'Crime', 'Thriller'],
    featured: true,
    status: 'published',
    credits: { writer: 'Ummo', editor: 'Ignite Editorial', chief: 'Sue Ann' },
    body: `
<p>Crime 101 opens the way all great heist films do: with a rule. Never hit the same stretch of freeway twice. Never carry a gun. Never get greedy. The film then spends two hours watching its protagonist break exactly none of them, which turns out to be far more gripping than it has any right to be.</p>
<p>The film moves between meditation and mayhem — long, almost silent stretches of planning punctuated by jewel heists executed with the calm of a man folding laundry. It is a thriller that trusts stillness, and that trust pays off.</p>
<h2>The Duel</h2>
<p>Opposite him sits the insurance investigator who has spent a decade cataloguing the “101 jobs” — heists along the Pacific Coast Highway he is certain belong to one man. Their duel is conducted almost entirely through inference: two professionals reading each other's work like rival critics reading the same novel.</p>
<p>What elevates Crime 101 is its refusal to moralise. The film is not interested in whether crime pays; it is interested in what mastery costs. Both men are brilliant, both are lonely, and both understand the other better than anyone else in their lives does.</p>
<p>By the time the final job unravels — quietly, inevitably, on that same forbidden stretch of freeway — the film has made its point: obsession is the only crime either of them was ever really committing.</p>
`,
  },
  {
    id: 'a6',
    slug: 'brandy-melville-is-this-fashion-hell',
    title: 'Brandy Melville: Is This Fashion Hell?',
    dek: 'A teenage girl may look at Brandy Melville models with envy, but what is it about these “one-size-fits-all” pieces that makes them so irresistible? Caitlyn explores the appeal behind the trend and the concerns that follow.',
    section: 'beauty-style',
    author: 'Caitlyn',
    date: '2026-04-22',
    readTime: 4,
    cover: 'https://static.wixstatic.com/media/637e18_1ced2ac67a5e43abafec2834d79151f8~mv2.png/v1/fill/w_1000,h_559,al_c,q_90,usm_0.66_1.00_0.01/637e18_1ced2ac67a5e43abafec2834d79151f8~mv2.png',
    coverCredit: 'Brandy Melville',
    tags: ['Fast Fashion', 'Body Image', 'Brandy Melville'],
    featured: true,
    status: 'published',
    credits: { writer: 'Caitlyn', editor: 'Germaine', chief: 'Sue Ann' },
    body: `
<p>Walk into any Brandy Melville store and you will find the same thing: racks of soft baby tees, low-rise sweatpants, and tiny pleated skirts — all in one size. The brand calls it “one size fits most”. Its critics call it something else entirely.</p>
<p>A teenage girl may look at Brandy Melville models with envy, but what is it about these pieces that makes them so irresistible? Part of it is the aesthetic: effortless, Californian, expensively undone. Part of it is scarcity — if the top only comes in one size, wearing it becomes a quiet badge of belonging.</p>
<h2>The Cost of Belonging</h2>
<p>That badge has a price. When a brand's entire identity is built on exclusion, the clothes stop being clothes and become a measuring tape. The message is not subtle: fit the clothes, because the clothes will not fit you.</p>
<p>None of this has slowed the brand down. If anything, the controversy is part of the marketing — every exposé produces a new wave of curiosity, and every curiosity produces a new customer.</p>
<p>So, is this fashion hell? Perhaps the more honest answer is that Brandy Melville is a mirror. It reflects what the algorithmic beauty standard already demands, stitched into cotton and sold for RM60. The question is not why the brand exists. It is why it works.</p>
`,
  },
  {
    id: 'a7',
    slug: 'beyond-the-oscars-what-2025-films-are-worth-the-watch',
    title: 'Beyond the Oscars, What 2025 Films Are Worth the Watch?',
    dek: 'Award season never tells the whole story. Jessica rounds up the films that deserved your ticket money — trophies or not.',
    section: 'film-tv',
    author: 'Jessica',
    date: '2026-04-19',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_f8dc47dedf004f6cb9f16cca979682a1~mv2.jpg/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/637e18_f8dc47dedf004f6cb9f16cca979682a1~mv2.jpg',
    coverCredit: 'Ignite Film Desk',
    tags: ['Film', 'Oscars', 'Watchlist'],
    featured: false,
    status: 'published',
    credits: { writer: 'Jessica', editor: 'Ignite Editorial', chief: 'Sue Ann' },
    body: `
<p>Award season has a way of flattening a whole year of cinema into five nominees and one winner. But 2025 was deeper than its trophy shelf, and some of its best films never made it to the podium.</p>
<p>There was the quiet Malaysian family drama that played festivals to standing ovations and streaming to silence. The animated feature that out-wrote most of the live-action field. The horror film that was really a grief film wearing a mask.</p>
<h2>Start Here</h2>
<p>If you only have one weekend, start with the films that made us feel something in a lecture-hall screening at 9pm on a Tuesday — the truest test of cinema we know. Bring friends. Argue after. That is what the movies are for.</p>
<p>The Oscars are a snapshot of consensus. Your watchlist does not have to be.</p>
`,
  },
  {
    id: 'a8',
    slug: 'akira-kurosawa-a-giant-of-world-cinema',
    title: 'Akira Kurosawa: A Giant of World Cinema',
    dek: 'From Rashomon to Ran, Amirul Mukmin traces how one director taught the world to see motion, weather and honour on screen.',
    section: 'film-tv',
    author: 'Amirul Mukmin',
    date: '2026-04-19',
    readTime: 6,
    cover: 'https://static.wixstatic.com/media/637e18_13da8f52ca084b2f8c3db4c1b7a2dbdf~mv2.webp/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/637e18_13da8f52ca084b2f8c3db4c1b7a2dbdf~mv2.webp',
    coverCredit: 'Toho Studios',
    tags: ['Film History', 'Kurosawa', 'World Cinema'],
    featured: false,
    status: 'published',
    credits: { writer: 'Amirul Mukmin', editor: 'Ignite Editorial', chief: 'Sue Ann' },
    body: `
<p>Every filmmaker you love learned from someone who learned from Akira Kurosawa. Spielberg called him the pictorial Shakespeare of our time. Lucas borrowed the plot of The Hidden Fortress for a small space opera you may have heard of. Leone remade Yojimbo shot-for-shot and accidentally invented the spaghetti western.</p>
<p>But influence alone undersells him. Watch Seven Samurai today — nearly seventy years old — and it still moves like a modern film: the rain-soaked final battle, the telephoto compression of charging horses, the wipe cuts that carry you across a village like a turning page.</p>
<h2>Weather as Emotion</h2>
<p>Kurosawa understood that weather is emotion. Rain in his films is never just rain; it is grief with somewhere to fall. Wind is doubt. Snow is mercy. In Ran, his late-career Lear, the burning castle collapses in silence — no score, just smoke — and it remains one of the most devastating sequences ever put to film.</p>
<p>For students discovering him now: start with Rashomon for the idea, Seven Samurai for the craft, Ikiru for the heart, and Ran for the scale. Then watch everything else.</p>
<p>A giant is not someone who cannot be surpassed. A giant is someone everyone after must climb over. World cinema is still climbing.</p>
`,
  },
  {
    id: 'a9',
    slug: 'a-night-of-nostalgia-and-crescendos-at-mussoc-s-choir-chamber-music-orchestra',
    title: 'A Night of Nostalgia and Crescendos at MUSSOC’s Choir Chamber Music Orchestra',
    dek: 'Hayatun Syamilah spends an evening with UNM’s Music Society as strings, voices and memory swell together in the great hall.',
    section: 'music',
    author: 'Hayatun Syamilah',
    date: '2026-04-18',
    readTime: 4,
    cover: 'https://static.wixstatic.com/media/637e18_563954de56d74e0b8dde676b2c27ee83~mv2.jpg/v1/fill/w_1000,h_559,al_c,q_85,usm_0.66_1.00_0.01/637e18_563954de56d74e0b8dde676b2c27ee83~mv2.jpg',
    coverCredit: 'MUSSOC',
    tags: ['MUSSOC', 'Classical', 'Campus Events'],
    featured: false,
    status: 'published',
    credits: { writer: 'Hayatun Syamilah', editor: 'Syamilah', chief: 'Sue Ann' },
    body: `
<p>There is a particular hush that falls over a hall in the seconds before an orchestra begins — a collective held breath. At MUSSOC’s Choir Chamber Music Orchestra night, that hush arrived early and never fully left.</p>
<p>The programme moved from film scores to folk arrangements to one ambitious original composition by a final-year student, each piece introduced with the kind of nervous, joyful energy only a student ensemble can produce.</p>
<h2>The Crescendo</h2>
<p>The night peaked with a choral arrangement that had half the audience quietly mouthing the words. Around me, phone torches swayed. Someone's mother was crying. It was, in the best way, deeply uncool and completely sincere.</p>
<p>Student orchestras are a small miracle of logistics — rehearsals wedged between assignments, instruments borrowed, arrangements rewritten the week of the show. That the result sounds like this is a testament to what campus arts can be when given a stage.</p>
<p>Whatever MUSSOC plays next, arrive early. The hush is worth it.</p>
`,
  },
  {
    id: 'a10',
    slug: 'behind-the-women-architecting-african-sound',
    title: 'Behind The Women Architecting African Sound',
    dek: 'From amapiano’s log drums to afrobeats’ global takeover, Precious profiles the women producers and executives building the sound of a continent.',
    section: 'music',
    author: 'Precious',
    date: '2026-04-15',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_b4e4e682557a42108f7bd551b5a142a3~mv2.jpg/v1/fill/w_1000,h_563,al_c,q_85,usm_0.66_1.00_0.01/637e18_b4e4e682557a42108f7bd551b5a142a3~mv2.jpg',
    coverCredit: 'Ignite Music Desk',
    tags: ['Afrobeats', 'Amapiano', 'Women in Music'],
    featured: false,
    status: 'published',
    credits: { writer: 'Precious', editor: 'Syamilah', chief: 'Sue Ann' },
    body: `
<p>The story of African music’s global decade is usually told through its frontmen. But behind the streaming numbers and stadium tours is a quieter architecture — and a striking amount of it is being drawn by women.</p>
<p>They are the producers layering log drums at 3am in Johannesburg bedrooms, the engineers mixing Lagos sessions, the executives negotiating the deals that decide whether a song stays a local hit or becomes a global one.</p>
<h2>Building the Blueprint</h2>
<p>What makes this moment different is ownership. This generation is not asking for a seat at the table; they are building their own labels, publishing companies and studios — and signing each other.</p>
<p>The sound of a continent is not an accident. It is designed, argued over, mixed and mastered. Increasingly, the hands on the faders belong to women — and the blueprint they are drawing will outlast any single hit.</p>
`,
  },
  {
    id: 'a11',
    slug: 'a-night-with-dukes-a-band-still-on-their-quest',
    title: 'A Night with DUKES: A Band Still on Their Quest',
    dek: 'Naema chats with rising local indie-rock band DUKES at their first standalone gig about songwriting, a possible Chinese track, and the very serious question of who would survive being stranded on an island.',
    section: 'music',
    author: 'Naema',
    date: '2026-02-28',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_add6ebc451c842c88d77ed8947be83a4~mv2.jpg/v1/fill/w_1000,h_500,al_c,q_85,usm_0.66_1.00_0.01/637e18_add6ebc451c842c88d77ed8947be83a4~mv2.jpg',
    coverCredit: 'DUKES',
    tags: ['Local Music', 'Band Interview', 'Indie Rock'],
    featured: false,
    status: 'published',
    credits: { writer: 'Naema', editor: 'Syamilah', chief: 'Sue Ann' },
    body: `
<p>DUKES do not walk on stage so much as spill onto it — four musicians mid-conversation, mid-laugh, tuning as they go. Their first standalone gig had the energy of a house party that happened to have a soundboard.</p>
<p>Between sets, I sat down with the band to talk about their quest — their word, not mine — to figure out exactly what kind of band they are.</p>
<h2>The Quest</h2>
<p>“We have maybe three genres per song,” the frontman admits, not remotely apologetic. “That's the quest. We're still looking for the sound. Maybe the sound is looking for us.”</p>
<p>There is talk of a track in Chinese — “the chorus already exists, it lives in a voice memo” — and an extended, surprisingly heated debate about which member would survive longest stranded on an island. (Consensus: the drummer. Drummers are resourceful.)</p>
<p>Whatever DUKES find at the end of their quest, the search itself is already worth watching. Catch them small while you can.</p>
`,
  },
  {
    id: 'a12',
    slug: 'god-save-the-westwood-girl-punk-and-its-price-tag',
    title: 'God Save The Westwood Girl: Punk and Its Price Tag',
    dek: 'As punk evolves with modernity, does it risk losing its original bite? Yuktha traces the story of the Westwood Girl — the history, the rebellion, and what it means to embody one today.',
    section: 'beauty-style',
    author: 'Yukthamugi',
    date: '2025-12-21',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_e7b7c3f825e646bcaec23d9c17000e13~mv2.jpg/v1/fill/w_976,h_488,al_c,q_85/637e18_e7b7c3f825e646bcaec23d9c17000e13~mv2.jpg',
    coverCredit: 'Vivienne Westwood Archive',
    tags: ['Vivienne Westwood', 'Punk', 'Fashion History'],
    featured: false,
    status: 'published',
    credits: { writer: 'Yukthamugi', editor: 'Germaine', chief: 'Sue Ann' },
    body: `
<p>The pearls are the giveaway. Three strands, an orb pendant, worn with something tartan and a smudge of eyeliner — the uniform of the Westwood Girl, recognisable from Camden to TikTok.</p>
<p>But punk was never supposed to be a uniform. When Vivienne Westwood and Malcolm McLaren opened SEX on the King's Road in 1974, the clothes were a provocation: safety pins as jewellery, bondage straps as tailoring, the Queen’s face with a safety pin through her lip.</p>
<h2>The Price of Rebellion</h2>
<p>Half a century later, the orb sits on necklaces that retail for four figures, and the waiting list for the pearl choker is months long. The revolution has a recommended retail price.</p>
<p>And yet — Westwood herself never saw the contradiction as fatal. She spent her final decades using the brand as a megaphone for climate activism, insisting you could sell rebellion and mean it.</p>
<p>So what does it mean to be a Westwood Girl in a fast-fashion world? Perhaps this: buy less, choose well, make it last — her words — and remember that the pearls were always meant to be worn with a sneer.</p>
`,
  },
  {
    id: 'a13',
    slug: 'the-capitalism-of-it-me-why-we-buy-personalities-in-a-box',
    title: 'The Capitalism of “It Me”: Why We Buy Personalities in a Box',
    dek: 'As children, many of us carried a favourite toy everywhere. Today that instinct seems to have returned in a slightly stranger form. Once you notice them, you start seeing them everywhere.',
    section: 'opinions',
    author: 'Mirsyad',
    date: '2026-03-29',
    readTime: 4,
    cover: 'https://static.wixstatic.com/media/637e18_1c399a0dd936431ab4845c0657c1e7c5~mv2.jpg/v1/fill/w_750,h_1000,al_c,q_85,usm_0.66_1.00_0.01/637e18_1c399a0dd936431ab4845c0657c1e7c5~mv2.jpg',
    coverCredit: 'Ignite Opinions Desk',
    tags: ['Consumerism', 'Identity', 'Blind Boxes'],
    featured: false,
    status: 'published',
    credits: { writer: 'Mirsyad', editor: 'Penelope (Penny) Cheang', chief: 'Emma Gerard' },
    body: `
<p>As children, many of us carried a favourite toy everywhere. A stuffed bear, a small figurine, a worn-out blanket. Today that instinct has returned in a slightly stranger form: dangling from tote bags, lined up on monitor stands, unboxed on camera for millions of views.</p>
<p>The blind box economy runs on a simple trick — it sells you a mirror. Every figurine line comes with a taxonomy of moods and archetypes, and the marketing whispers: which one is you? “It me,” we reply, and tap pay.</p>
<h2>Personality, Retail Price: RM49.90</h2>
<p>There is nothing new about buying identity; we have always done it with band tees and sneakers. What is new is the precision. The algorithm knows you feel like the sad-eyed one in the bucket hat before you do.</p>
<p>None of this makes the little creatures on your desk sinister. Objects have always carried meaning for us. The question worth asking is simply whether we are collecting them, or whether the collecting is us — a personality assembled one blind box at a time, always one purchase short of complete.</p>
`,
  },
  {
    id: 'a14',
    slug: 'real-love-is-dead-or-at-least-thats-what-the-internet-convinced-you-to-believe',
    title: 'Real Love is Dead; or at Least That’s What the Internet Convinced You to Believe',
    dek: 'Gone are the days when grand romantic gestures led to happily ever after — because after all, isn’t real love dead? But what if you’ve just been fed a million and one lies on the Internet?',
    section: 'opinions',
    author: 'Mei Gerard',
    date: '2026-03-22',
    readTime: 5,
    cover: 'https://static.wixstatic.com/media/637e18_535670643a8941acb26e4a6e3f85a0bb~mv2.jpg/v1/fill/w_1000,h_500,al_c,q_85,usm_0.66_1.00_0.01/637e18_535670643a8941acb26e4a6e3f85a0bb~mv2.jpg',
    coverCredit: 'Ignite Opinions Desk',
    tags: ['Love', 'Internet Culture', 'Relationships'],
    featured: false,
    status: 'published',
    credits: { writer: 'Mei Gerard', editor: 'Penelope (Penny) Cheang', chief: 'Emma Gerard' },
    body: `
<p>Somewhere between the situationship discourse and the “he's a 6 but” audio, the Internet reached a verdict: real love is dead. Romance has been priced out, ghosted, reduced to a soft launch and an archived story.</p>
<p>Don't believe me? Open any comment section under a couple posting their anniversary. Half the replies are congratulations. The other half are warnings.</p>
<h2>The Case for the Defence</h2>
<p>But here is the thing about verdicts delivered by algorithms: they are optimised for engagement, not truth. Heartbreak content travels further than contentment. Nobody goes viral for a quiet, functional Tuesday with someone who loves them.</p>
<p>Real love never died. It just stopped performing. It is in the friend who saves you the last bite, the grandparents who still argue about directions, the person who learns your bus schedule without being asked.</p>
<p>The Internet convinced you that love must be cinematic to be real. The truth is closer to the opposite: the realest love is usually too busy being lived to be filmed.</p>
`,
  },
]
