import {  UserRole, UploadStatus } from '@prisma/client';
import { hash } from 'bcrypt';
import { prisma } from '../lib/prisma';


// Helper function to create a slug from title
function createSlug(title: string): string {
  return title
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/(^-|-$)/g, '');
}

// Helper function to generate random ratings
function randomRating(): number {
  return Math.round((Math.random() * 4 + 1) * 10) / 10; // Random between 1.0 and 5.0
}

// Helper function to generate random subscriber count
function randomSubscriberCount(): number {
  return Math.floor(Math.random() * 10000) + 100;
}

async function main() {
  console.log('🌱 Starting database seeding...');

  // Clear existing data
  await prisma.session.deleteMany();
  await prisma.roleChange.deleteMany();
  await prisma.upload.deleteMany();
  await prisma.review.deleteMany();
  await prisma.subscription.deleteMany();
  await prisma.episode.deleteMany();
  await prisma.podcast.deleteMany();
  await prisma.user.deleteMany();

  console.log('🗑️  Cleared existing data');

  // Create Users
  const hashedPassword = await hash('password123', 12);
  
  const users = await Promise.all([
    // Admin User
    prisma.user.create({
      data: {
        email: 'admin@podcast.com',
        username: 'admin',
        displayName: 'Admin User',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Platform administrator',
        role: UserRole.ADMIN,
        isVerified: true,
      },
    }),

    // Creators
    prisma.user.create({
      data: {
        email: 'sarah.johnson@podcast.com',
        username: 'sarah_johnson',
        displayName: 'Sarah Johnson',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face',
        bio: 'Tech entrepreneur and podcast host. Passionate about startup stories and innovation.',
        role: UserRole.CREATOR,
        isVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'mike.chen@podcast.com',
        username: 'mike_chen',
        displayName: 'Mike Chen',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face',
        bio: 'History professor turned podcast creator. Exploring untold stories from the past.',
        role: UserRole.CREATOR,
        isVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'emma.williams@podcast.com',
        username: 'emma_williams',
        displayName: 'Emma Williams',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face',
        bio: 'True crime investigative journalist with 10+ years experience.',
        role: UserRole.CREATOR,
        isVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'david.garcia@podcast.com',
        username: 'david_garcia',
        displayName: 'David Garcia',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face',
        bio: 'Professional comedian and entertainment industry insider.',
        role: UserRole.CREATOR,
        isVerified: true,
      },
    }),

    // Listeners
    prisma.user.create({
      data: {
        email: 'alice.brown@email.com',
        username: 'alice_brown',
        displayName: 'Alice Brown',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&h=150&fit=crop&crop=face',
        bio: 'Podcast enthusiast and tech worker.',
        role: UserRole.LISTENER,
        isVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'john.doe@email.com',
        username: 'john_doe',
        displayName: 'John Doe',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1519244703995-f4e0f30006d5?w=150&h=150&fit=crop&crop=face',
        bio: 'Marketing professional who loves learning through podcasts.',
        role: UserRole.LISTENER,
        isVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'lisa.taylor@email.com',
        username: 'lisa_taylor',
        displayName: 'Lisa Taylor',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&h=150&fit=crop&crop=face',
        bio: 'Student and aspiring entrepreneur.',
        role: UserRole.LISTENER,
        isVerified: false,
      },
    }),

    prisma.user.create({
      data: {
        email: 'robert.wilson@email.com',
        username: 'robert_wilson',
        displayName: 'Robert Wilson',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face',
        bio: 'Retired teacher with a passion for history podcasts.',
        role: UserRole.LISTENER,
        isVerified: true,
      },
    }),

    prisma.user.create({
      data: {
        email: 'maria.rodriguez@email.com',
        username: 'maria_rodriguez',
        displayName: 'Maria Rodriguez',
        passwordHash: hashedPassword,
        avatar: 'https://images.unsplash.com/photo-1487412720507-e7ab37603c6f?w=150&h=150&fit=crop&crop=face',
        bio: 'Healthcare worker who enjoys comedy and true crime podcasts.',
        role: UserRole.LISTENER,
        isVerified: true,
      },
    }),
  ]);

  console.log('👥 Created users');

  // Get creators for podcast creation
  const creators = users.filter(user => user.role === UserRole.CREATOR);
  const listeners = users.filter(user => user.role === UserRole.LISTENER);

  // Create Podcasts
  const podcasts = await Promise.all([
    // Sarah's Tech Startup Podcast
    prisma.podcast.create({
      data: {
        title: 'The Startup Journey',
        description: 'Weekly interviews with successful entrepreneurs sharing their startup stories, failures, and lessons learned.',
        slug: createSlug('The Startup Journey'),
        imageUrl: 'https://images.unsplash.com/photo-1556075798-4825dfaaf498?w=400&h=400&fit=crop',
        category: 'Business',
        language: 'en',
        tags: ['startup', 'entrepreneurship', 'business', 'interviews'],
        rating: randomRating(),
        subscriberCount: randomSubscriberCount(),
        totalEpisodes: 0, // Will be updated after episodes are created
        isExplicit: false,
        isActive: true,
        isPublic: true,
        creatorId: creators[0].id, // Sarah Johnson
      },
    }),

    // Mike's History Podcast
    prisma.podcast.create({
      data: {
        title: 'Hidden History',
        description: 'Uncovering fascinating stories from history that you probably never learned in school.',
        slug: createSlug('Hidden History'),
        imageUrl: 'https://images.unsplash.com/photo-1481627834876-b7833e8f5570?w=400&h=400&fit=crop',
        category: 'History',
        language: 'en',
        tags: ['history', 'education', 'stories', 'documentary'],
        rating: randomRating(),
        subscriberCount: randomSubscriberCount(),
        totalEpisodes: 0,
        isExplicit: false,
        isActive: true,
        isPublic: true,
        creatorId: creators[1].id, // Mike Chen
      },
    }),

    // Emma's True Crime Podcast
    prisma.podcast.create({
      data: {
        title: 'Cold Case Files',
        description: 'In-depth investigations into unsolved mysteries and cold cases from around the world.',
        slug: createSlug('Cold Case Files'),
        imageUrl: 'https://images.unsplash.com/photo-1578662996442-48f60103fc96?w=400&h=400&fit=crop',
        category: 'True Crime',
        language: 'en',
        tags: ['true crime', 'mystery', 'investigation', 'documentary'],
        rating: randomRating(),
        subscriberCount: randomSubscriberCount(),
        totalEpisodes: 0,
        isExplicit: true,
        isActive: true,
        isPublic: true,
        creatorId: creators[2].id, // Emma Williams
      },
    }),

    // David's Comedy Podcast
    prisma.podcast.create({
      data: {
        title: 'Behind the Curtain',
        description: 'Comedian David Garcia interviews fellow comedians and entertainment industry professionals.',
        slug: createSlug('Behind the Curtain'),
        imageUrl: 'https://images.unsplash.com/photo-1516280440614-37939bbacd81?w=400&h=400&fit=crop',
        category: 'Comedy',
        language: 'en',
        tags: ['comedy', 'entertainment', 'interviews', 'behind-the-scenes'],
        rating: randomRating(),
        subscriberCount: randomSubscriberCount(),
        totalEpisodes: 0,
        isExplicit: true,
        isActive: true,
        isPublic: true,
        creatorId: creators[3].id, // David Garcia
      },
    }),

    // Sarah's Second Podcast
    prisma.podcast.create({
      data: {
        title: 'Tech Talk Daily',
        description: 'Daily 15-minute episodes covering the latest in technology news and trends.',
        slug: createSlug('Tech Talk Daily'),
        imageUrl: 'https://images.unsplash.com/photo-1518709268805-4e9042af2176?w=400&h=400&fit=crop',
        category: 'Technology',
        language: 'en',
        tags: ['technology', 'news', 'daily', 'trends'],
        rating: randomRating(),
        subscriberCount: randomSubscriberCount(),
        totalEpisodes: 0,
        isExplicit: false,
        isActive: true,
        isPublic: true,
        creatorId: creators[0].id, // Sarah Johnson
      },
    }),

    // Mike's Second Podcast (Inactive)
    prisma.podcast.create({
      data: {
        title: 'Ancient Civilizations',
        description: 'A deep dive into ancient civilizations and their lasting impact on modern society.',
        slug: createSlug('Ancient Civilizations'),
        imageUrl: 'https://images.unsplash.com/photo-1539650116574-75c0c6d73f6e?w=400&h=400&fit=crop',
        category: 'History',
        language: 'en',
        tags: ['ancient history', 'civilizations', 'archaeology', 'culture'],
        rating: randomRating(),
        subscriberCount: randomSubscriberCount(),
        totalEpisodes: 0,
        isExplicit: false,
        isActive: false, // Inactive podcast
        isPublic: true,
        creatorId: creators[1].id, // Mike Chen
      },
    }),
  ]);

  console.log('🎙️  Created podcasts');

  // Create Episodes for each podcast
  const episodes: any[] = [];

  // Episodes for "The Startup Journey"
  const startupEpisodes = await Promise.all([
    prisma.episode.create({
      data: {
        title: 'From Idea to IPO: The Spotify Story',
        slug: createSlug('From Idea to IPO: The Spotify Story'),
        description: 'How Daniel Ek built Spotify from a simple idea into a music streaming giant.',
        audioUrl: 'https://example.com/audio/startup-journey-001.mp3',
        duration: 2850, // 47 minutes 30 seconds
        episodeNumber: 1,
        isPublished: true,
        publishDate: '2024-01-15',
        podcastId: podcasts[0].id,
        creatorId: creators[0].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'Failing Fast: Learning from Startup Mistakes',
        slug: createSlug('Failing Fast: Learning from Startup Mistakes'),
        description: 'Entrepreneurs share their biggest failures and the lessons they learned.',
        audioUrl: 'https://example.com/audio/startup-journey-002.mp3',
        duration: 3120, // 52 minutes
        episodeNumber: 2,
        isPublished: true,
        publishDate: '2024-01-22',
        podcastId: podcasts[0].id,
        creatorId: creators[0].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'The Future of FinTech with Stripe\'s Patrick Collison',
        slug: createSlug('The Future of FinTech with Stripe\'s Patrick Collison'),
        description: 'An exclusive interview with Stripe co-founder about the future of online payments.',
        audioUrl: 'https://example.com/audio/startup-journey-003.mp3',
        duration: 2940, // 49 minutes
        episodeNumber: 3,
        isPublished: true,
        publishDate: '2024-01-29',
        podcastId: podcasts[0].id,
        creatorId: creators[0].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'Building a Remote-First Company',
        slug: createSlug('Building a Remote-First Company'),
        description: 'How to build and scale a successful remote-first startup in the post-pandemic world.',
        audioUrl: 'https://example.com/audio/startup-journey-004.mp3',
        duration: 2760, // 46 minutes
        episodeNumber: 4,
        isPublished: false, // Unpublished episode
        publishDate: '2024-02-05',
        podcastId: podcasts[0].id,
        creatorId: creators[0].id,
      },
    }),
  ]);

  // Episodes for "Hidden History"
  const historyEpisodes = await Promise.all([
    prisma.episode.create({
      data: {
        title: 'The Lost Library of Alexandria',
        slug: createSlug('The Lost Library of Alexandria'),
        description: 'Separating fact from fiction about the ancient world\'s greatest library.',
        audioUrl: 'https://example.com/audio/hidden-history-001.mp3',
        duration: 3300, // 55 minutes
        episodeNumber: 1,
        isPublished: true,
        publishDate: '2024-01-10',
        podcastId: podcasts[1].id,
        creatorId: creators[1].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'The Real Cleopatra: Beyond the Myths',
        slug: createSlug('The Real Cleopatra: Beyond the Myths'),
        description: 'Exploring the true story of Egypt\'s last pharaoh and her political genius.',
        audioUrl: 'https://example.com/audio/hidden-history-002.mp3',
        duration: 2880, // 48 minutes
        episodeNumber: 2,
        isPublished: true,
        publishDate: '2024-01-17',
        podcastId: podcasts[1].id,
        creatorId: creators[1].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'The Forgotten Women of WWII Codebreaking',
        slug: createSlug('The Forgotten Women of WWII Codebreaking'),
        description: 'The untold stories of women who helped win WWII through their codebreaking work.',
        audioUrl: 'https://example.com/audio/hidden-history-003.mp3',
        duration: 3180, // 53 minutes
        episodeNumber: 3,
        isPublished: true,
        publishDate: '2024-01-24',
        podcastId: podcasts[1].id,
        creatorId: creators[1].id,
      },
    }),
  ]);

  // Episodes for "Cold Case Files"
  const crimeEpisodes = await Promise.all([
    prisma.episode.create({
      data: {
        title: 'The Zodiac Killer: New Evidence Emerges',
        slug: createSlug('The Zodiac Killer: New Evidence Emerges'),
        description: 'Recent developments in the decades-old Zodiac Killer case.',
        audioUrl: 'https://example.com/audio/cold-case-001.mp3',
        duration: 4200, // 70 minutes
        episodeNumber: 1,
        isPublished: true,
        publishDate: '2024-01-12',
        podcastId: podcasts[2].id,
        creatorId: creators[2].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'The Disappearance of Amelia Earhart',
        slug: createSlug('The Disappearance of Amelia Earhart'),
        description: 'Examining the latest theories about what happened to the famous aviator.',
        audioUrl: 'https://example.com/audio/cold-case-002.mp3',
        duration: 3900, // 65 minutes
        episodeNumber: 2,
        isPublished: true,
        publishDate: '2024-01-19',
        podcastId: podcasts[2].id,
        creatorId: creators[2].id,
      },
    }),
  ]);

  // Episodes for "Behind the Curtain"
  const comedyEpisodes = await Promise.all([
    prisma.episode.create({
      data: {
        title: 'Stand-Up Secrets with Jerry Seinfeld',
        slug: createSlug('Stand-Up Secrets with Jerry Seinfeld'),
        description: 'The comedy legend shares insights into the art of stand-up comedy.',
        audioUrl: 'https://example.com/audio/behind-curtain-001.mp3',
        duration: 3600, // 60 minutes
        episodeNumber: 1,
        isPublished: true,
        publishDate: '2024-01-14',
        podcastId: podcasts[3].id,
        creatorId: creators[3].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'The Art of Improv with Tina Fey',
        slug: createSlug('The Art of Improv with Tina Fey'),
        description: 'How improv training shaped one of comedy\'s biggest stars.',
        audioUrl: 'https://example.com/audio/behind-curtain-002.mp3',
        duration: 3420, // 57 minutes
        episodeNumber: 2,
        isPublished: true,
        publishDate: '2024-01-21',
        podcastId: podcasts[3].id,
        creatorId: creators[3].id,
      },
    }),
  ]);

  // Episodes for "Tech Talk Daily"
  const techEpisodes = await Promise.all([
    prisma.episode.create({
      data: {
        title: 'AI Revolution: ChatGPT\'s Impact on Tech',
        slug: createSlug('AI Revolution: ChatGPT\'s Impact on Tech'),
        description: 'How ChatGPT is changing the technology landscape.',
        audioUrl: 'https://example.com/audio/tech-talk-001.mp3',
        duration: 900, // 15 minutes
        episodeNumber: 1,
        isPublished: true,
        publishDate: '2024-02-01',
        podcastId: podcasts[4].id,
        creatorId: creators[0].id,
      },
    }),
    prisma.episode.create({
      data: {
        title: 'The Rise of Electric Vehicles',
        slug: createSlug('The Rise of Electric Vehicles'),
        description: 'Tesla\'s influence on the automotive industry.',
        audioUrl: 'https://example.com/audio/tech-talk-002.mp3',
        duration: 870, // 14.5 minutes
        episodeNumber: 2,
        isPublished: true,
        publishDate: '2024-02-02',
        podcastId: podcasts[4].id,
        creatorId: creators[0].id,
      },
    }),
  ]);

  episodes.push(...startupEpisodes, ...historyEpisodes, ...crimeEpisodes, ...comedyEpisodes, ...techEpisodes);

  console.log('📻 Created episodes');

  // Update podcast episode counts
  await Promise.all(podcasts.map(async (podcast, index) => {
    const episodeCount = episodes.filter(ep => ep.podcastId === podcast.id).length;
    await prisma.podcast.update({
      where: { id: podcast.id },
      data: { totalEpisodes: episodeCount },
    });
  }));

  console.log('📊 Updated podcast episode counts');

  // Create Subscriptions
  const subscriptions = [];
  
  // Each listener subscribes to random podcasts
  for (const listener of listeners) {
    const numSubscriptions = Math.floor(Math.random() * 4) + 1; // 1-4 subscriptions per listener
    const subscribedPodcasts = podcasts
      .sort(() => 0.5 - Math.random())
      .slice(0, numSubscriptions);

    for (const podcast of subscribedPodcasts) {
      const subscription = await prisma.subscription.create({
        data: {
          userId: listener.id,
          podcastId: podcast.id,
          createdAt: new Date(Date.now() - Math.random() * 30 * 24 * 60 * 60 * 1000), // Random date within last 30 days
        },
      });
      subscriptions.push(subscription);
    }
  }

  // Some creators also subscribe to other podcasts
  const creatorSubscriptions = await Promise.all([
    prisma.subscription.create({
      data: {
        userId: creators[0].id, // Sarah subscribes to Mike's history podcast
        podcastId: podcasts[1].id,
      },
    }),
    prisma.subscription.create({
      data: {
        userId: creators[1].id, // Mike subscribes to Emma's true crime podcast
        podcastId: podcasts[2].id,
      },
    }),
    prisma.subscription.create({
      data: {
        userId: creators[2].id, // Emma subscribes to David's comedy podcast
        podcastId: podcasts[3].id,
      },
    }),
  ]);

  subscriptions.push(...creatorSubscriptions);

  console.log('📱 Created subscriptions');

  // Create Reviews
  const reviews = [];
  
  // Generate reviews from listeners and creators
  const reviewers = [...listeners, ...creators.slice(0, 2)]; // Some creators can review too
  
  for (const reviewer of reviewers) {
    const numReviews = Math.floor(Math.random() * 3) + 1; // 1-3 reviews per user
    const reviewedPodcasts = podcasts
      .filter(p => p.creatorId !== reviewer.id) // Don't review own podcasts
      .sort(() => 0.5 - Math.random())
      .slice(0, numReviews);

    for (const podcast of reviewedPodcasts) {
      const rating = Math.floor(Math.random() * 5) + 1; // 1-5 stars
      const comments = [
        'Great content and engaging host!',
        'Really informative episodes, learned a lot.',
        'Love the storytelling style.',
        'Excellent production quality.',
        'Perfect length for my commute.',
        'Host has a great voice and personality.',
        'Well-researched topics.',
        'Could use better audio quality.',
        'Episodes are a bit too long for my taste.',
        'Amazing guest interviews!',
      ];

      const review = await prisma.review.create({
        data: {
          userId: reviewer.id,
          podcastId: podcast.id,
          rating,
          comment: rating >= 4 ? comments[Math.floor(Math.random() * 7)] : comments[7 + Math.floor(Math.random() * 3)],
          createdAt: new Date(Date.now() - Math.random() * 60 * 24 * 60 * 60 * 1000), // Random date within last 60 days
        },
      });
      reviews.push(review);
    }
  }

  console.log('⭐ Created reviews');

  // Update podcast ratings based on reviews
  for (const podcast of podcasts) {
    const podcastReviews = reviews.filter(r => r.podcastId === podcast.id);
    if (podcastReviews.length > 0) {
      const avgRating = podcastReviews.reduce((sum, review) => sum + review.rating, 0) / podcastReviews.length;
      await prisma.podcast.update({
        where: { id: podcast.id },
        data: { rating: Math.round(avgRating * 10) / 10 },
      });
    }
  }

  console.log('📊 Updated podcast ratings');

  // Create Upload records
  const uploads = await Promise.all([
    // Successful uploads
    prisma.upload.create({
      data: {
        userId: creators[0].id,
        fileName: 'startup-journey-episode-5.mp3',
        fileUrl: 'https://example.com/uploads/startup-journey-005.mp3',
        fileSize: 52428800, // ~50MB
        status: UploadStatus.COMPLETED,
        createdAt: new Date(Date.now() - 2 * 24 * 60 * 60 * 1000), // 2 days ago
      },
    }),
    prisma.upload.create({
      data: {
        userId: creators[1].id,
        fileName: 'hidden-history-episode-4.mp3',
        fileUrl: 'https://example.com/uploads/hidden-history-004.mp3',
        fileSize: 48234567, // ~46MB
        status: UploadStatus.COMPLETED,
        createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000), // 1 day ago
      },
    }),
    // Processing upload
    prisma.upload.create({
      data: {
        userId: creators[2].id,
        fileName: 'cold-case-episode-3.mp3',
        fileUrl: 'https://example.com/uploads/cold-case-003.mp3',
        fileSize: 67891234, // ~65MB
        status: UploadStatus.PROCESSING,
        createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000), // 2 hours ago
      },
    }),
    // Failed upload
    prisma.upload.create({
      data: {
        userId: creators[3].id,
        fileName: 'behind-curtain-episode-3.mp3',
        fileUrl: '',
        fileSize: 0,
        status: UploadStatus.FAILED,
        createdAt: new Date(Date.now() - 30 * 60 * 1000), // 30 minutes ago
      },
    }),
    // Pending upload
    prisma.upload.create({
      data: {
        userId: creators[0].id,
        fileName: 'tech-talk-episode-3.mp3',
        fileUrl: '',
        fileSize: 15728640, // ~15MB
        status: UploadStatus.PENDING,
        createdAt: new Date(Date.now() - 5 * 60 * 1000), // 5 minutes ago
      },
    }),
  ]);

  console.log('📤 Created upload records');

  // Create Role Change records (audit trail)
  const roleChanges = await Promise.all([
    // User who got promoted from LISTENER to CREATOR
    prisma.roleChange.create({
      data: {
        userId: creators[0].id, // Sarah was promoted
        fromRole: UserRole.LISTENER,
        toRole: UserRole.CREATOR,
        reason: 'User requested creator privileges to start podcast',
        createdAt: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000), // 30 days ago
      },
    }),
    prisma.roleChange.create({
      data: {
        userId: creators[1].id, // Mike was promoted
        fromRole: UserRole.LISTENER,
        toRole: UserRole.CREATOR,
        reason: 'User requested creator privileges to start history podcast',
        createdAt: new Date(Date.now() - 45 * 24 * 60 * 60 * 1000), // 45 days ago
      },
    }),
    prisma.roleChange.create({
      data: {
        userId: creators[2].id, // Emma was promoted
        fromRole: UserRole.LISTENER,
        toRole: UserRole.CREATOR,
        reason: 'User requested creator privileges for true crime content',
        createdAt: new Date(Date.now() - 60 * 24 * 60 * 60 * 1000), // 60 days ago
      },
    }),
    prisma.roleChange.create({
      data: {
        userId: creators[3].id, // David was promoted
        fromRole: UserRole.LISTENER,
        toRole: UserRole.CREATOR,
        reason: 'User requested creator privileges for comedy podcast',
        createdAt: new Date(Date.now() - 20 * 24 * 60 * 60 * 1000), // 20 days ago
      },
    }),
  ]);

  console.log('🔄 Created role change records');

  // Create some Session records for active users
  const sessions = await Promise.all([
    prisma.session.create({
      data: {
        id: 'session_sarah_' + Date.now(),
        userId: creators[0].id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.session.create({
      data: {
        id: 'session_alice_' + Date.now(),
        userId: listeners[0].id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
    prisma.session.create({
      data: {
        id: 'session_john_' + Date.now(),
        userId: listeners[1].id,
        expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000), // 7 days from now
      },
    }),
  ]);

  console.log('🔑 Created session records');

  // Final statistics
  console.log('\n📈 Seeding completed successfully!');
  console.log('==================================');
  console.log(`👥 Users created: ${users.length}`);
  console.log(`   - Admins: 1`);
  console.log(`   - Creators: ${creators.length}`);
  console.log(`   - Listeners: ${listeners.length}`);
  console.log(`🎙️  Podcasts created: ${podcasts.length}`);
  console.log(`📻 Episodes created: ${episodes.length}`);
  console.log(`📱 Subscriptions created: ${subscriptions.length}`);
  console.log(`⭐ Reviews created: ${reviews.length}`);
  console.log(`📤 Uploads created: ${uploads.length}`);
  console.log(`🔄 Role changes created: ${roleChanges.length}`);
  console.log(`🔑 Sessions created: ${sessions.length}`);
  console.log('==================================');
  
  console.log('\n🎯 Sample login credentials:');
  console.log('Email: admin@podcast.com (Admin)');
  console.log('Email: sarah.johnson@podcast.com (Creator)');
  console.log('Email: alice.brown@email.com (Listener)');
  console.log('Password: password123 (for all accounts)');
}

main()
  .catch((e) => {
    console.error('❌ Error during seeding:', e);
    process.exit(1);
  })
  .finally(async () => {
    await prisma.$disconnect();
  });