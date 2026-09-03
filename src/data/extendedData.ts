
export interface AchievementItem {
  id: string;
  title: string;
  date: string;
  organization: string;
  description: string;
  category: string;
  iconName: string;
}

export interface YouTubeVideo {
  id: string;
  title: string;
  thumbnailUrl: string;
  views: string;
  duration: string;
  watchUrl: string;
}

export interface FreelanceService {
  id: string;
  title: string;
  price: string;
  timeline: string;
  features: string[];
  description: string;
}

export interface TestimonialItem {
  id: string;
  name: string;
  role: string;
  organization: string;
  content: string;
  type: 'Client' | 'Teacher' | 'Mentor';
}

export interface BlogArticle {
  id: string;
  title: string;
  excerpt: string;
  date: string;
  readTime: string;
  category: string;
  tags: string[];
  likes: number;
  comments: any[];
  coverUrl: string;
  contentParagraphs?: string[];
}

export interface CertificationItem {
  id: string;
  name: string;
  logo: string;
  issuer: string;
  date: string;
  credentialId?: string;
  credentialUrl?: string;
  image?: string;
  status: 'Active' | 'Future';
  skillsLearned: string[];
}

export interface ExtendedProject {
  id: string;
  title: string;
  description: string;
  shortDescription: string;
  longDescription?: string;
  problemStatement?: string;
  objectives?: string[];
  database?: string;
  techStack?: string[];
  metrics?: any[];
  features?: string[];
  architecture?: string[];
  challenges?: string[];
  solutions?: string[];
  lessonsLearned?: string[];
  futureImprovements?: string[];
  timeline?: any[];
  status?: string;
  duration?: string;
  tags: string[];
  category: string;
  imageUrl: string;
  featured: boolean;
  githubUrl?: string;
  liveUrl?: string;
  demoUrl?: string;
  stats?: {
    stars?: number;
    forks?: number;
    commits?: number;
  };
}


export const EXTENDED_DATA = {
  experience: [
    {
      type: 'Freelancing',
      role: 'Freelancer',
      company: 'Self-Employed',
      period: '2023 - Present',
      description: ['Built various projects and helped clients solve their problems.'],
      skills: ['React', 'Node.js']
    },
    {
      type: 'Content Creation',
      role: 'Content Creator',
      company: 'YouTube',
      period: '2023 - Present',
      description: ['Shared technical knowledge on YouTube.'],
      skills: ['Video Editing', 'Content Strategy']
    },
    {
      type: 'Volunteer',
      role: 'Volunteer',
      company: 'Labs',
      period: '2024',
      description: ['Volunteered at college labs.'],
      skills: ['Leadership']
    },
    {
      type: 'Open Source',
      role: 'Contributor',
      company: 'Open Source',
      period: '2023 - Present',
      description: ['Contributed to multiple open-source repositories.'],
      skills: ['Git', 'Collaboration']
    }
  ] as any[],
    certifications: [
    {
      id: "cert-1",
      name: 'Machine Learning Specialization',
      logo: 'Brain',
      issuer: 'DeepLearning.AI',
      date: 'Dec 2024',
      status: 'Active',
      skillsLearned: ['Python', 'PyTorch']
    },
    {
      id: "cert-2",
      name: 'Google Cloud Certified',
      logo: 'Cloud',
      issuer: 'Google',
      date: 'Feb 2025',
      status: 'Future',
      skillsLearned: ['Cloud Compute', 'GCP']
    }
  ] as CertificationItem[],
  projects: [
    {
      id: "proj-1",
      title: "Obsidian Optics",
      description: "YOLOv8 tracking on edge devices.",
      tags: ["Python", "YOLOv8", "OpenCV"],
      category: "AI",
      imageUrl: "https://picsum.photos/seed/proj1/400/300",
      featured: true
    }
  ] as ExtendedProject[],
  achievements: [
    {
      id: 'ach-table-tennis',
      title: '1st Position – Inter-school Table Tennis (3x)',
      date: 'Multiple',
      organization: 'Inter-school Tournaments',
      description: 'Secured 1st position across three separate table tennis championships.',
      category: 'Sports',
      iconName: 'TrendingUp'
    },
    {
      id: 'ach-toycathon',
      title: 'Finalist – Toycathon',
      date: 'Past',
      organization: 'Government of India',
      description: 'Reached the finals of the national Toycathon competition organized by the Government of India.',
      category: 'Hackathons',
      iconName: 'Code'
    },
    {
      id: 'ach-certs',
      title: 'Professional Certifications',
      date: 'Ongoing',
      organization: 'Microsoft, Coursera, Udemy',
      description: 'Completed various industry-recognized certifications across Microsoft, Coursera, and Udemy platforms.',
      category: 'Academics',
      iconName: 'Award'
    }
  ] as AchievementItem[],
  youtubeVideos: [
    {
      id: 'video-1',
      title: 'How I Built a Real-Time Perimetric AI Alert System',
      thumbnailUrl: 'https://images.unsplash.com/photo-1515879218367-8466d910aaa4?auto=format&fit=crop&q=80&w=400',
      views: '12K',
      duration: '14:25',
      watchUrl: 'https://youtube.com/sayam-mukherjee-placeholder'
    },
    {
      id: 'video-2',
      title: 'Financial NLP Sentiment Models with Python & FinBERT',
      thumbnailUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=400',
      views: '8.4K',
      duration: '18:10',
      watchUrl: 'https://youtube.com/sayam-mukherjee-placeholder'
    }
  ] as YouTubeVideo[],
  freelanceServices: [
    {
      id: 'service-thumbnail',
      title: 'Click-Driven YouTube Thumbnail Design',
      price: '$25 / Asset',
      timeline: '24-48 Hours',
      features: [
        'Advanced Visual Psychology & Focal Contrast framing',
        'High-Resolution 4K exports',
        '3 Revisions with direct audience analytics adjustments',
        'Perfect typography selection with custom color grading'
      ],
      description: 'Creating premium, high-contrast, clickable graphic templates.'
    }
  ] as FreelanceService[],
  testimonials: [
    {
      id: 'test-1',
      name: 'Rohan Sharma',
      role: 'Lead Visual Strategist',
      organization: 'TechVibe Media',
      content: "Sayam transformed our visual assets. His execution speed and grasp of design clarity are exceptional.",
      type: 'Client'
    }
  ] as TestimonialItem[],
  blogArticles: [
    {
      id: 'obsidian-optics-deep-dive',
      title: 'Deploying Custom YOLOv8 Tracking Systems to Edge Devices',
      excerpt: 'An engineering case study on model quantization, Region-of-Interest clipping, and Kalman-based tracking optimization.',
      date: 'May 14, 2025',
      readTime: '6 min read',
      category: 'Artificial Intelligence',
      tags: ['YOLOv8', 'PyTorch', 'Edge AI', 'Computer Vision'],
      likes: 142,
      comments: [
        { author: 'Rahul Gupta', text: 'Excellent analysis! The quantization results on FP16 vs INT8 are spot on.', date: 'May 15, 2025' },
        { author: 'Prof. J. Roy', text: 'Highly detailed work. The math behind Kalman filter tuning is extremely useful.', date: 'May 18, 2025' }
      ],
      coverUrl: 'https://images.unsplash.com/photo-1526374965328-7f61d4dc18c5?auto=format&fit=crop&q=80&w=600',
      contentParagraphs: [
        "In deploying high-signal computer vision models to localized boundary systems, raw parameter sizes are the chief computational bottleneck. A standard YOLOv8n network, despite being optimized, demands significant FLOPs when run at high-definition frame rates. To mitigate this on low-powered edge nodes, we must look into advanced post-training quantization (PTQ) techniques.",
        "Our optimization pipeline starts by translating PyTorch weights into ONNX intermediate representation layers, followed by dynamic and static FP16 (half-precision) quantization. By representing float32 parameters as float16, we compress the footprint by exactly 50% while sustaining a negligible Mean Average Precision (mAP50-95) degradation of less than 0.2%. On our target embedded processor, this shifts inference latencies from a sluggish 74ms down to a fluid, real-time 18ms per frame.",
        "Beyond quantization, frame-by-frame inference on full-resolution images is redundant. We engineered a dynamic Region-of-Interest (ROI) clipping layer. This algorithm identifies bounding coordinates from preceding frames and restricts the subsequent YOLO scan solely to that dynamic sub-grid, reducing processed pixel volumes by up to 60%. If tracking is broken or object acceleration spikes, the system automatically falls back to full-frame scans.",
        "To achieve smooth, continuous trajectories despite temporal occlusions (where objects are temporarily blocked by walls or other items), we implemented a multi-dimensional Kalman Filter. By combining linear velocity motion equations with visual feature affinity scores, our tracking loops maintain precise target vectors even when the YOLO detector fails to fire for 5-10 consecutive frames. The combination of quantized weights, dynamic ROI clipping, and Kalman recovery creates an incredibly robust, production-ready edge vision asset."
      ]
    },
    {
      id: 'react-suspense-state-management',
      title: 'Asynchronous React State Management & Concurrent Suspense Trees',
      excerpt: 'Deep dive into standard client-side state hooks, concurrency schedulers, and optimizing re-render boundaries.',
      date: 'June 10, 2025',
      readTime: '8 min read',
      category: 'Web Development',
      tags: ['React', 'TypeScript', 'State Engines', 'Performance'],
      likes: 98,
      comments: [
        { author: 'Siddharth M.', text: 'This cleared up so much confusion around useTransition and startTransition!', date: 'June 11, 2025' }
      ],
      coverUrl: 'https://images.unsplash.com/photo-1633356122544-f134324a6cee?auto=format&fit=crop&q=80&w=600',
      contentParagraphs: [
        "Modern web applications demand fluid interfaces that remain responsive even during heavy data synchronization or layout transformations. In the early days of React, state changes were synchronous, meaning any complex calculation or large DOM sweep would completely block user inputs, causing visible stuttering and dropping valuable frame rates.",
        "React's Concurrent features and Suspense structures introduce a fundamental paradigm shift. Instead of treating rendering as an atomic, un-interruptible sequence, the concurrent scheduler breaks updates into high-priority and low-priority tasks. By leveraging the 'useTransition' hook, we can mark non-urgent state updates—such as switching complex dashboard charts or searching deep note indices—as transitions that yield control back to the main browser thread when a keypress or click event occurs.",
        "Let us consider a concrete example: a developer portfolio with dynamic search querying over hundreds of items. When the user types a character, updating the input text field is a high-priority action that must show immediate visual feedback (e.g. at 60 FPS). However, updating the filtered result grid can be deferred. Wrapping the filter state setter in 'startTransition' allows React to pause the rendering of the results, register the next keystroke immediately, and resume the filter computation in the background, resulting in a buttery-smooth typing experience.",
        "Furthermore, managing asynchronous layout loading with Suspense boundary wrappers prevents partial, jarring layouts. When combined with localized cache engines, Suspense allows components to declare that they are 'waiting' for a background dataset, gracefully rendering a skeleton loader without raising complex state variables or risking layout shifting. Crafting clean, isolated boundary contexts ensures that only the affected nodes rebuild, preserving computing resources and minimizing DOM re-draws."
      ]
    },
    {
      id: 'stock-sentiment-analysis',
      title: 'Designing Low-Latency Sentiment Analyzers for Stock Market Alpha',
      excerpt: 'Leveraging FinBERT models, streaming financial news APIs, and real-time visualization pipelines to identify short-term market momentum.',
      date: 'June 28, 2025',
      readTime: '10 min read',
      category: 'Finance',
      tags: ['FinBERT', 'NLP', 'Python', 'WebSockets', 'Data Visualization'],
      likes: 185,
      comments: [
        { author: 'Ananya S.', text: 'Incredible! Do you feed this into a live algorithmic trader?', date: 'June 29, 2025' }
      ],
      coverUrl: 'https://images.unsplash.com/photo-1611974789855-9c2a0a7236a3?auto=format&fit=crop&q=80&w=600',
      contentParagraphs: [
        "In modern stock and derivative trading environments, speed is the ultimate arbiter of profitable operations. While traditional quantitative systems scan basic historical prices and volumes, modern alpha is increasingly derived from high-frequency text streams: press releases, earning transcripts, central bank speeches, and global news feeds.",
        "To process this massive volume of natural language in real-time, we constructed a low-latency sentiment analysis pipeline. At its core, the system utilizes FinBERT—a specialized BERT model pre-trained on a massive corpus of financial communications. FinBERT is highly adept at distinguishing terms that carry distinct financial connotations (such as 'bullish interest' or 'rate cuts') which generic sentiment models often classify incorrectly or neutrally.",
        "Our ingestion layer connects to major financial streaming feeds via low-overhead WebSockets. As headlines arrive, they are instantly queued in an in-memory database and pushed to our FinBERT inference engine. To maximize throughput and keep latencies under 50ms, we host the model in an optimized ONNX Runtime environment backed by TensorRT-accelerated GPU nodes. The engine returns a precise probability vector for three sentiment states: Positive, Negative, and Neutral.",
        "These sentiment scores are then aggregated into a moving average index and streamed directly to a React-based interactive canvas. The UI uses real-time line charts and heatmaps to project sentiment shifts alongside actual asset price candles. When the sentiment index crosses established upper or lower Bollinger Bands, it triggers system alerts indicating momentum shifts, allowing traders to execute positions ahead of broad-market retail distribution. Leveraging high-frequency NLP translates public information into actionable, high-probability trading signals."
      ]
    },
    {
      id: 'mastering-complex-systems',
      title: 'A Structured System for Autodidactic Engineering & Rapid Synthesis',
      excerpt: 'Documenting my personal learning pipeline for acquiring deep expertise in new software frameworks, AI research papers, and technical paradigms.',
      date: 'July 01, 2025',
      readTime: '5 min read',
      category: 'Learning Journey',
      tags: ['Autodidactism', 'Cognitive Loading', 'Productivity', 'Systems Thinking'],
      likes: 112,
      comments: [
        { author: 'Meera K.', text: 'This structured approach is wonderful. The distinction between passive intake and active projection resonates deeply.', date: 'July 02, 2025' }
      ],
      coverUrl: 'https://images.unsplash.com/photo-1456513080510-7bf3a84b82f8?auto=format&fit=crop&q=80&w=600',
      contentParagraphs: [
        "The velocity of technological advancement demands an equally rapid cognitive framework for skill acquisition. For an undergraduate in Computer Science navigating both demanding coursework and fast-paced industry environments, relying on unstructured, passive reading of manuals is no longer viable. True mastery requires a systematic, feedback-driven pipeline.",
        "My learning pipeline, which I call the 'Active Projection Framework', begins with a high-level topographical scan of the subject matter. Instead of starting with small syntax tutorials, I seek out high-signal architectural overviews or original research papers. The objective is to map out the 'first-principles' constraints—for instance, understanding memory allocation bounds before writing high-performance C++ or learning backpropagation mechanics before training PyTorch models.",
        "Once the mental topography is established, I move directly to localized, intentional breaking points. I build extremely minimal sandboxes designed to isolate specific features or failure modes. For example, when learning React Concurrent rendering, I write a deliberately heavy component loop to test when and why the browser's main thread starts dropping keypress events. This hands-on, active experimentation uncovers practical constraints that documentation rarely emphasizes.",
        "The final and most crucial step is projection: synthesizing what has been learned into structured documentation or public journals. Teaching a concept—whether by creating a detailed Obsidian journal entry, sharing a codebase on GitHub, or presenting to a college community—forces me to clarify latent assumptions and resolve lingering gaps in understanding. Through consistent active synthesis, complex technical systems transform from black boxes into modular tools ready for real-world application."
      ]
    }
  ] as BlogArticle[]
};
