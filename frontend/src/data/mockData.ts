import { Podcast, Episode } from "@/types";

// Mock audio URLs (using placeholder audio for demo)
const getMockAudioUrl = (id: string) =>
  `https://www.soundjay.com/misc/sounds-1/bell-ringing-05.wav?id=${id}`;

// Sample episodes for different podcasts
const techTalkEpisodes: Episode[] = [
  {
    id: "tt-001",
    title: "The Future of AI Development",
    description:
      "Exploring the latest trends in artificial intelligence and machine learning development.",
    audioUrl: getMockAudioUrl("tt-001"),
    duration: 2340, // 39 minutes
    publishDate: "2024-06-01",
    episodeNumber: 125,
    seasonNumber: 5,
    slug: "future-of-ai-development",
    showNotes:
      "In this episode, we discuss the latest advancements in AI technology...",
  },
  {
    id: "tt-002",
    title: "Building Scalable Web Applications",
    description:
      "Best practices for creating web applications that can handle millions of users.",
    audioUrl: getMockAudioUrl("tt-002"),
    duration: 2880, // 48 minutes
    publishDate: "2024-05-28",
    episodeNumber: 124,
    seasonNumber: 5,
    slug: "building-scalable-web-applications",
  },
  {
    id: "tt-003",
    title: "The Evolution of JavaScript Frameworks",
    description:
      "From jQuery to React to the next generation of JavaScript frameworks.",
    audioUrl: getMockAudioUrl("tt-003"),
    duration: 2160, // 36 minutes
    publishDate: "2024-05-25",
    episodeNumber: 123,
    seasonNumber: 5,
    slug: "evolution-of-javascript-frameworks",
  },
];

const businessInsightsEpisodes: Episode[] = [
  {
    id: "bi-001",
    title: "Startup Funding in 2024",
    description:
      "Understanding the current landscape of venture capital and startup funding.",
    audioUrl: getMockAudioUrl("bi-001"),
    duration: 3120, // 52 minutes
    publishDate: "2024-06-02",
    episodeNumber: 89,
    seasonNumber: 3,
    slug: "startup-funding-2024",
  },
  {
    id: "bi-002",
    title: "Remote Work Revolution",
    description:
      "How remote work is changing business operations and company culture.",
    audioUrl: getMockAudioUrl("bi-002"),
    duration: 2640, // 44 minutes
    publishDate: "2024-05-30",
    episodeNumber: 88,
    seasonNumber: 3,
    slug: "remote-work-revolution",
  },
];

const comedyHourEpisodes: Episode[] = [
  {
    id: "ch-001",
    title: "Life as a Software Developer",
    description: "Hilarious takes on the daily struggles of coding life.",
    audioUrl: getMockAudioUrl("ch-001"),
    duration: 1800, // 30 minutes
    publishDate: "2024-06-03",
    episodeNumber: 67,
    seasonNumber: 2,
    slug: "life-as-software-developer",
  },
  {
    id: "ch-002",
    title: "Tech Support Horror Stories",
    description: "The funniest and most frustrating tech support experiences.",
    audioUrl: getMockAudioUrl("ch-002"),
    duration: 2100, // 35 minutes
    publishDate: "2024-05-31",
    episodeNumber: 66,
    seasonNumber: 2,
    slug: "tech-support-horror-stories",
  },
];

const scienceExplainedEpisodes: Episode[] = [
  {
    id: "se-001",
    title: "Quantum Computing Simplified",
    description: "Making quantum computing concepts accessible to everyone.",
    audioUrl: getMockAudioUrl("se-001"),
    duration: 2520, // 42 minutes
    publishDate: "2024-06-01",
    episodeNumber: 43,
    seasonNumber: 2,
    slug: "quantum-computing-simplified",
  },
  {
    id: "se-002",
    title: "Climate Change and Technology",
    description:
      "How technology is helping us understand and combat climate change.",
    audioUrl: getMockAudioUrl("se-002"),
    duration: 2880, // 48 minutes
    publishDate: "2024-05-29",
    episodeNumber: 42,
    seasonNumber: 2,
    slug: "climate-change-technology",
  },
];

const historyUnfoldedEpisodes: Episode[] = [
  {
    id: "hu-001",
    title: "The History of Computing",
    description: "From mechanical calculators to modern supercomputers.",
    audioUrl: getMockAudioUrl("hu-001"),
    duration: 3600, // 60 minutes
    publishDate: "2024-05-30",
    episodeNumber: 156,
    seasonNumber: 8,
    slug: "history-of-computing",
  },
];

export const mockPodcasts: Podcast[] = [
  {
    id: "tech-talk-daily",
    title: "Tech Talk Daily",
    description:
      "Your daily dose of technology news, insights, and discussions with industry experts.",
    author: "Sarah Chen",
    category: "Technology",
    imageUrl: "/images/podcasts/tech-talk-daily.jpg",
    episodes: techTalkEpisodes,
    totalEpisodes: 125,
    slug: "tech-talk-daily",
    language: "English",
    tags: ["Technology", "AI", "Web Development", "Programming"],
    rating: 4.8,
    subscriberCount: 125000,
    isExplicit: false,
    createdAt: "2020-01-15",
    updatedAt: "2024-06-01",
  },
  {
    id: "business-insights",
    title: "Business Insights",
    description:
      "Deep dives into business strategy, entrepreneurship, and market trends.",
    author: "Michael Rodriguez",
    category: "Business",
    imageUrl: "/images/podcasts/business-insights.jpg",
    episodes: businessInsightsEpisodes,
    totalEpisodes: 89,
    slug: "business-insights",
    language: "English",
    tags: ["Business", "Entrepreneurship", "Startups", "Finance"],
    rating: 4.6,
    subscriberCount: 87000,
    isExplicit: false,
    createdAt: "2021-03-10",
    updatedAt: "2024-06-02",
  },
  {
    id: "comedy-hour",
    title: "Comedy Hour",
    description:
      "Laughs, jokes, and humorous takes on everyday life and current events.",
    author: "Alex Thompson",
    category: "Comedy",
    imageUrl: "/images/podcasts/comedy-hour.jpg",
    episodes: comedyHourEpisodes,
    totalEpisodes: 67,
    slug: "comedy-hour",
    language: "English",
    tags: ["Comedy", "Humor", "Entertainment"],
    rating: 4.4,
    subscriberCount: 45000,
    isExplicit: true,
    createdAt: "2022-05-20",
    updatedAt: "2024-06-03",
  },
  {
    id: "science-explained",
    title: "Science Explained",
    description:
      "Making complex scientific concepts simple and accessible to everyone.",
    author: "Dr. Emily Watson",
    category: "Science",
    imageUrl: "/images/podcasts/science-explained.jpg",
    episodes: scienceExplainedEpisodes,
    totalEpisodes: 43,
    slug: "science-explained",
    language: "English",
    tags: ["Science", "Education", "Research", "Physics"],
    rating: 4.9,
    subscriberCount: 92000,
    isExplicit: false,
    createdAt: "2022-08-12",
    updatedAt: "2024-06-01",
  },
  {
    id: "history-unfolded",
    title: "History Unfolded",
    description:
      "Exploring fascinating historical events and the people who shaped our world.",
    author: "Professor James Mitchell",
    category: "History",
    imageUrl: "/images/podcasts/history-unfolded.jpg",
    episodes: historyUnfoldedEpisodes,
    totalEpisodes: 156,
    slug: "history-unfolded",
    language: "English",
    tags: ["History", "Education", "Culture", "Biography"],
    rating: 4.7,
    subscriberCount: 78000,
    isExplicit: false,
    createdAt: "2019-09-05",
    updatedAt: "2024-05-30",
  },
  {
    id: "wellness-weekly",
    title: "Wellness Weekly",
    description:
      "Tips and advice for maintaining physical and mental health in modern life.",
    author: "Dr. Maria Garcia",
    category: "Health & Fitness",
    imageUrl: "/images/podcasts/wellness-weekly.jpg",
    episodes: [],
    totalEpisodes: 78,
    slug: "wellness-weekly",
    language: "English",
    tags: ["Health", "Fitness", "Mental Health", "Nutrition"],
    rating: 4.5,
    subscriberCount: 56000,
    isExplicit: false,
    createdAt: "2021-11-15",
    updatedAt: "2024-05-28",
  },
  {
    id: "true-crime-stories",
    title: "True Crime Stories",
    description:
      "Investigating real criminal cases with thorough research and compelling storytelling.",
    author: "Detective Sarah Brooks",
    category: "True Crime",
    imageUrl: "/images/podcasts/true-crime-stories.jpg",
    episodes: [],
    totalEpisodes: 134,
    slug: "true-crime-stories",
    language: "English",
    tags: ["True Crime", "Investigation", "Mystery", "Justice"],
    rating: 4.8,
    subscriberCount: 145000,
    isExplicit: true,
    createdAt: "2020-06-22",
    updatedAt: "2024-05-27",
  },
  {
    id: "startup-stories",
    title: "Startup Stories",
    description:
      "Interviews with founders and entrepreneurs about their journey building companies.",
    author: "Rachel Kim",
    category: "Business",
    imageUrl: "/images/podcasts/startup-stories.jpg",
    episodes: [],
    totalEpisodes: 92,
    slug: "startup-stories",
    language: "English",
    tags: ["Startups", "Entrepreneurship", "Interviews", "Business"],
    rating: 4.6,
    subscriberCount: 68000,
    isExplicit: false,
    createdAt: "2021-07-08",
    updatedAt: "2024-05-26",
  },
];

// Featured podcasts for homepage
export const featuredPodcasts = mockPodcasts.slice(0, 3);

// Recently added episodes
export const recentEpisodes = [
  ...techTalkEpisodes.slice(0, 1),
  ...businessInsightsEpisodes.slice(0, 1),
  ...comedyHourEpisodes.slice(0, 1),
  ...scienceExplainedEpisodes.slice(0, 1),
].sort(
  (a, b) =>
    new Date(b.publishDate).getTime() - new Date(a.publishDate).getTime()
);

// Popular categories with counts
export const popularCategories = [
  { name: "Technology", count: 2 },
  { name: "Business", count: 2 },
  { name: "Comedy", count: 1 },
  { name: "Science", count: 1 },
  { name: "History", count: 1 },
  { name: "Health & Fitness", count: 1 },
  { name: "True Crime", count: 1 },
];
