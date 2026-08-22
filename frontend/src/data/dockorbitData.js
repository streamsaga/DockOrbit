export const CATEGORIES = [
  {
    id: "programming",
    name: "Programming",
    icon: "Code",
    channelCount: 342,
    topScore: 96,
    description: "Full-stack development, algorithms, software engineering, and clean architecture."
  },
  {
    id: "cybersecurity",
    name: "Cybersecurity",
    icon: "Shield",
    channelCount: 189,
    topScore: 94,
    description: "Ethical hacking, network security, penetration testing, and cloud safety."
  },
  {
    id: "technology",
    name: "Technology",
    icon: "Cpu",
    channelCount: 512,
    topScore: 95,
    description: "AI breakthroughs, hardware reviews, tech industry deep-dives, and trends."
  },
  {
    id: "education",
    name: "Education",
    icon: "GraduationCap",
    channelCount: 420,
    topScore: 98,
    description: "Mathematics, physics, computer science fundamentals, and academic lectures."
  },
  {
    id: "design",
    name: "Design",
    icon: "Palette",
    channelCount: 264,
    topScore: 92,
    description: "UI/UX design systems, motion graphics, 3D modeling, and product design."
  },
  {
    id: "finance",
    name: "Finance",
    icon: "TrendingUp",
    channelCount: 310,
    topScore: 91,
    description: "Investing fundamentals, economics, personal finance, and market analysis."
  },
  {
    id: "science",
    name: "Science",
    icon: "Atom",
    channelCount: 275,
    topScore: 97,
    description: "Astrophysics, biology, quantum mechanics, and scientific experimentation."
  },
  {
    id: "business",
    name: "Business",
    icon: "Briefcase",
    channelCount: 298,
    topScore: 90,
    description: "Startup building, product management, marketing strategies, and leadership."
  },
  {
    id: "gaming",
    name: "Gaming",
    icon: "Gamepad2",
    channelCount: 680,
    topScore: 89,
    description: "Game dev tutorials, esports analysis, mechanics deep dives, and retrospective reviews."
  },
  {
    id: "entertainment",
    name: "Entertainment",
    icon: "Film",
    channelCount: 840,
    topScore: 88,
    description: "Film analysis, storytelling mechanics, video essays, and documentary content."
  }
];

export const CHANNELS = [
  {
    id: "fireship",
    name: "Fireship",
    handle: "@fireship",
    avatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80",
    verified: true,
    category: "Programming",
    country: "United States",
    subscribers: "3.2M",
    subscribersCount: 3200000,
    avgViews: "450K",
    avgViewsCount: 450000,
    engagementRate: "8.9%",
    engagementValue: 8.9,
    uploadConsistency: "3x / week",
    consistencyScore: 95,
    channelAge: "6 years",
    url: "https://youtube.com/@fireship",
    qualityScore: 96,
    scoreBreakdown: {
      engagement: 94,
      consistency: 98,
      contentActivity: 96,
      longevity: 92,
      audienceSignal: 96
    },
    strengths: [
      "Ultra-dense 100-second code summaries with zero fluff",
      "High viewer retention & active comment section",
      "Consistent weekly schedule without burnout lapses"
    ],
    concerns: [
      "Fast pacing may require re-watching for beginners"
    ],
    viewsHistory: [320, 380, 410, 430, 420, 450],
    subsHistory: [2.6, 2.7, 2.9, 3.0, 3.1, 3.2],
    uploadFrequencyHistory: [12, 11, 13, 12, 14, 12],
    recentVideos: [
      {
        id: "v1",
        title: "React 19 in 100 Seconds",
        views: "680K",
        likes: "42K",
        comments: "1.8K",
        publishedDate: "2 days ago",
        thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "v2",
        title: "7 AI Tools Every Engineer Should Know",
        views: "520K",
        likes: "31K",
        comments: "1.2K",
        publishedDate: "6 days ago",
        thumbnail: "https://images.unsplash.com/photo-1677442136019-21780efad99a?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "v3",
        title: "Is Rust Replacing C++ in 2026?",
        views: "890K",
        likes: "58K",
        comments: "3.4K",
        publishedDate: "2 weeks ago",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "3blue1brown",
    name: "3Blue1Brown",
    handle: "@3blue1brown",
    avatar: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=160&q=80",
    verified: true,
    category: "Education",
    country: "United States",
    subscribers: "6.1M",
    subscribersCount: 6100000,
    avgViews: "1.8M",
    avgViewsCount: 1800000,
    engagementRate: "11.4%",
    engagementValue: 11.4,
    uploadConsistency: "1x / month",
    consistencyScore: 82,
    channelAge: "9 years",
    url: "https://youtube.com/@3blue1brown",
    qualityScore: 98,
    scoreBreakdown: {
      engagement: 98,
      consistency: 84,
      contentActivity: 95,
      longevity: 99,
      audienceSignal: 98
    },
    strengths: [
      "World-class visual animations (Manim library author)",
      "Unmatched intuitive explanations of deep math & neural nets",
      "Exceptionally high likes-to-view ratio and community reverence"
    ],
    concerns: [
      "Longer gaps between video releases due to custom production"
    ],
    viewsHistory: [1400, 1500, 1650, 1700, 1750, 1800],
    subsHistory: [5.2, 5.4, 5.6, 5.8, 6.0, 6.1],
    uploadFrequencyHistory: [1, 2, 1, 1, 2, 1],
    recentVideos: [
      {
        id: "v4",
        title: "How Transformers Work: Neural Network Geometry",
        views: "2.4M",
        likes: "180K",
        comments: "9.2K",
        publishedDate: "3 weeks ago",
        thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=400&q=80"
      },
      {
        id: "v5",
        title: "Linear Algebra Chapter 1: Vector Spaces",
        views: "4.1M",
        likes: "290K",
        comments: "14.5K",
        publishedDate: "1 month ago",
        thumbnail: "https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "networkchuck",
    name: "NetworkChuck",
    handle: "@NetworkChuck",
    avatar: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=160&q=80",
    verified: true,
    category: "Cybersecurity",
    country: "United States",
    subscribers: "3.8M",
    subscribersCount: 3800000,
    avgViews: "380K",
    avgViewsCount: 380000,
    engagementRate: "7.6%",
    engagementValue: 7.6,
    uploadConsistency: "2x / month",
    consistencyScore: 88,
    channelAge: "7 years",
    url: "https://youtube.com/@NetworkChuck",
    qualityScore: 93,
    scoreBreakdown: {
      engagement: 92,
      consistency: 88,
      contentActivity: 91,
      longevity: 94,
      audienceSignal: 90
    },
    strengths: [
      "Engaging hands-on lab approach to Linux, Cisco, & hacking",
      "High energy presentation that makes networking accessible",
      "Clear step-by-step terminal guides"
    ],
    concerns: [
      "Heavy sponsor integration in video intros"
    ],
    viewsHistory: [310, 330, 340, 360, 370, 380],
    subsHistory: [3.1, 3.3, 3.5, 3.6, 3.7, 3.8],
    uploadFrequencyHistory: [3, 2, 3, 2, 2, 2],
    recentVideos: [
      {
        id: "v6",
        title: "You Need to Learn Docker RIGHT NOW!!",
        views: "810K",
        likes: "45K",
        comments: "2.1K",
        publishedDate: "5 days ago",
        thumbnail: "https://images.unsplash.com/photo-1607799279861-4dd421887fb3?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "mkbhd",
    name: "Marques Brownlee",
    handle: "@mkbhd",
    avatar: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?auto=format&fit=crop&w=160&q=80",
    verified: true,
    category: "Technology",
    country: "United States",
    subscribers: "18.5M",
    subscribersCount: 18500000,
    avgViews: "2.5M",
    avgViewsCount: 2500000,
    engagementRate: "6.8%",
    engagementValue: 6.8,
    uploadConsistency: "2x / week",
    consistencyScore: 96,
    channelAge: "16 years",
    url: "https://youtube.com/@mkbhd",
    qualityScore: 95,
    scoreBreakdown: {
      engagement: 91,
      consistency: 98,
      contentActivity: 96,
      longevity: 99,
      audienceSignal: 93
    },
    strengths: [
      "Industry-leading 8K cinematography & technical clarity",
      "Unparalleled longevity and editorial independence",
      "Consistently high production values"
    ],
    concerns: [
      "Broad consumer tech focus rather than deep developer tutorials"
    ],
    viewsHistory: [2100, 2200, 2350, 2400, 2450, 2500],
    subsHistory: [17.1, 17.5, 17.8, 18.0, 18.2, 18.5],
    uploadFrequencyHistory: [8, 9, 8, 10, 8, 9],
    recentVideos: [
      {
        id: "v7",
        title: "Apple Vision Pro 2: 6 Months Later",
        views: "3.2M",
        likes: "190K",
        comments: "8.1K",
        publishedDate: "4 days ago",
        thumbnail: "https://images.unsplash.com/photo-1593508512255-86ab42a8e620?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "veritasium",
    name: "Veritasium",
    handle: "@veritasium",
    avatar: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=160&q=80",
    verified: true,
    category: "Science",
    country: "Canada",
    subscribers: "15.8M",
    subscribersCount: 15800000,
    avgViews: "4.2M",
    avgViewsCount: 4200000,
    engagementRate: "9.2%",
    engagementValue: 9.2,
    uploadConsistency: "2x / month",
    consistencyScore: 90,
    channelAge: "13 years",
    url: "https://youtube.com/@veritasium",
    qualityScore: 97,
    scoreBreakdown: {
      engagement: 97,
      consistency: 91,
      contentActivity: 96,
      longevity: 99,
      audienceSignal: 96
    },
    strengths: [
      "Rigorous scientific methodology & peer-reviewed research",
      "Counter-intuitive physics experiments & historical context",
      "Exceptional viewer retention & academic citations"
    ],
    concerns: [
      "Occasional dramatic thumbnail framing"
    ],
    viewsHistory: [3800, 3900, 4000, 4100, 4150, 4200],
    subsHistory: [14.2, 14.6, 15.0, 15.3, 15.6, 15.8],
    uploadFrequencyHistory: [2, 2, 3, 2, 2, 2],
    recentVideos: [
      {
        id: "v8",
        title: "The Impossible Quantum Paradox That Confused Einstein",
        views: "5.1M",
        likes: "310K",
        comments: "16.4K",
        publishedDate: "1 week ago",
        thumbnail: "https://images.unsplash.com/photo-1532094349884-543bc11b234d?auto=format&fit=crop&w=400&q=80"
      }
    ]
  },
  {
    id: "theo-t3",
    name: "Theo - t3.gg",
    handle: "@theo-t3",
    avatar: "https://images.unsplash.com/photo-1534528741775-53994a69daeb?auto=format&fit=crop&w=160&q=80",
    verified: true,
    category: "Programming",
    country: "United States",
    subscribers: "390K",
    subscribersCount: 390000,
    avgViews: "110K",
    avgViewsCount: 110000,
    engagementRate: "12.1%",
    engagementValue: 12.1,
    uploadConsistency: "4x / week",
    consistencyScore: 96,
    channelAge: "4 years",
    url: "https://youtube.com/@theo-t3",
    qualityScore: 92,
    scoreBreakdown: {
      engagement: 96,
      consistency: 97,
      contentActivity: 94,
      longevity: 84,
      audienceSignal: 94
    },
    strengths: [
      "First-hand ex-Twitch engineer web architecture commentary",
      "Extremely high engagement rate relative to channel size",
      "Honest, unfiltered breakdown of tech stacks"
    ],
    concerns: [
      "Opinionated tech takes may provoke debate"
    ],
    viewsHistory: [70, 85, 95, 100, 105, 110],
    subsHistory: [0.24, 0.28, 0.31, 0.34, 0.37, 0.39],
    uploadFrequencyHistory: [16, 18, 15, 17, 16, 16],
    recentVideos: [
      {
        id: "v9",
        title: "Why Everyone Is Quitting Next.js App Router",
        views: "210K",
        likes: "18K",
        comments: "1.9K",
        publishedDate: "1 day ago",
        thumbnail: "https://images.unsplash.com/photo-1555066931-4365d14bab8c?auto=format&fit=crop&w=400&q=80"
      }
    ]
  }
];

export const PLAYLISTS = [
  {
    id: "react-full-course-2026",
    title: "Complete React 19 & Next.js App Router Masterclass",
    creator: "Fireship & CodeCamp",
    creatorAvatar: "https://images.unsplash.com/photo-1618005182384-a83a8bd57fbe?auto=format&fit=crop&w=160&q=80",
    thumbnail: "https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&w=600&q=80",
    videoCount: 24,
    totalDuration: "14h 25m",
    estimatedCompletion: "~14 days at 45 min/day",
    difficulty: "Intermediate",
    category: "Programming",
    qualityScore: 95,
    scoreBreakdown: {
      engagement: 96,
      consistency: 94,
      contentActivity: 96,
      longevity: 91,
      audienceSignal: 97
    },
    topicsCovered: [
      { name: "React 19 Server Components", depth: 95 },
      { name: "State Management (Zustand & Context)", depth: 90 },
      { name: "Next.js App Router & SSR", depth: 88 },
      { name: "TypeScript Strict Integration", depth: 85 },
      { name: "Tailwind CSS & Component Systems", depth: 92 }
    ],
    missingTopics: [
      "Micro-frontend architecture",
      "Advanced Web Worker offloading",
      "End-to-end Playwright testing"
    ],
    aiSummary: "A modern, highly-acclaimed full-stack frontend roadmap covering React 19 server actions, hooks optimization, and production Next.js deployments. Built with pragmatic projects and zero outdated class components.",
    viewerSentiment: {
      positive: 94,
      neutral: 4,
      negative: 2,
      keyThemes: [
        "Pacing is crisp and respects viewer time",
        "Real-world project structure rather than toy examples",
        "Clear explanation of Server vs Client components"
      ]
    },
    videosRoadmap: [
      { step: "01", title: "Introduction to React 19 Architecture", duration: "24m", type: "Core Concept" },
      { step: "02", title: "JSX, Props & State Fundamentals", duration: "42m", type: "Hands-on Lab" },
      { step: "03", title: "Mastering useEffect & Custom Hooks", duration: "55m", type: "Deep Dive" },
      { step: "04", title: "Server Actions & Form Handling", duration: "48m", type: "Project Lab" },
      { step: "05", title: "Building DockOrbit Web App End-to-End", duration: "2h 10m", type: "Capstone" }
    ]
  },
  {
    id: "linear-algebra-3blue1brown",
    title: "Essence of Linear Algebra",
    creator: "3Blue1Brown",
    creatorAvatar: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=160&q=80",
    thumbnail: "https://images.unsplash.com/photo-1509228468518-180dd4864904?auto=format&fit=crop&w=600&q=80",
    videoCount: 16,
    totalDuration: "3h 40m",
    estimatedCompletion: "~7 days at 30 min/day",
    difficulty: "Beginner to Advanced",
    category: "Education",
    qualityScore: 99,
    scoreBreakdown: {
      engagement: 99,
      consistency: 92,
      contentActivity: 98,
      longevity: 100,
      audienceSignal: 99
    },
    topicsCovered: [
      { name: "Vectors, Linear Combinations & Span", depth: 100 },
      { name: "Matrix Transformations & Determinants", depth: 98 },
      { name: "Eigenvalues & Eigenvectors", depth: 96 },
      { name: "Dot Products & Cross Products", depth: 95 }
    ],
    missingTopics: [
      "Numerical linear algebra algorithms (LU Decomposition code implementation)"
    ],
    aiSummary: "The gold standard for visual intuitive mathematical comprehension. Instead of rote matrix multiplication formulas, Grant Sanderson visualizes space stretching, rotations, and vector spaces.",
    viewerSentiment: {
      positive: 98,
      neutral: 1,
      negative: 1,
      keyThemes: [
        "Unlocks college linear algebra intuition effortlessly",
        "Animations make abstract math crystal clear",
        "Must-watch before learning machine learning algorithms"
      ]
    },
    videosRoadmap: [
      { step: "01", title: "Vectors, what are they?", duration: "10m", type: "Concept" },
      { step: "02", title: "Linear combinations, span, and basis vectors", duration: "12m", type: "Concept" },
      { step: "03", title: "Linear transformations and matrices", duration: "11m", type: "Concept" },
      { step: "04", title: "Matrix multiplication as composition", duration: "14m", type: "Concept" },
      { step: "05", title: "Eigenvectors and eigenvalues", duration: "17m", type: "Deep Dive" }
    ]
  },
  {
    id: "ethical-hacking-networkchuck",
    title: "Practical Ethical Hacking & Linux Fundamentals",
    creator: "NetworkChuck",
    creatorAvatar: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=160&q=80",
    thumbnail: "https://images.unsplash.com/photo-1563986768609-322da13575f3?auto=format&fit=crop&w=600&q=80",
    videoCount: 30,
    totalDuration: "18h 10m",
    estimatedCompletion: "~18 days at 1 hr/day",
    difficulty: "Beginner",
    category: "Cybersecurity",
    qualityScore: 92,
    scoreBreakdown: {
      engagement: 94,
      consistency: 90,
      contentActivity: 92,
      longevity: 91,
      audienceSignal: 93
    },
    topicsCovered: [
      { name: "Linux Terminal & CLI Mastery", depth: 95 },
      { name: "TCP/IP & Wireshark Packet Analysis", depth: 88 },
      { name: "Nmap Network Scanning", depth: 92 },
      { name: "Python Scripting for Hackers", depth: 84 }
    ],
    missingTopics: [
      "Binary exploitation & reverse engineering"
    ],
    aiSummary: "An approachable hands-on entry point into computer networking, Linux CLI, and ethical hacking fundamentals. Excellent for absolute beginners preparing for CompTIA Security+ or CEH.",
    viewerSentiment: {
      positive: 92,
      neutral: 6,
      negative: 2,
      keyThemes: [
        "Interactive lab format keeps learners engaged",
        "Great for building foundational terminal confidence",
        "Coffee references add fun personality"
      ]
    },
    videosRoadmap: [
      { step: "01", title: "You need to learn Linux RIGHT NOW!!", duration: "22m", type: "Hands-on" },
      { step: "02", title: "Networking Basics for Hackers", duration: "35m", type: "Concept" },
      { step: "03", title: "Wireshark Packet Analysis Lab", duration: "40m", type: "Lab" }
    ]
  }
];
