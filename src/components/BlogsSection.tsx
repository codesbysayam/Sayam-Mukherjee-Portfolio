import { useState, useMemo, useEffect, useRef, memo } from "react";
import { EXTENDED_DATA, BlogArticle } from "../data/extendedData";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Calendar, Clock, ChevronRight, Hash, ArrowLeft, 
  Search, Heart, MessageSquare, Share2, Bookmark, Check, Send, Sparkles, X, ChevronLeft
} from "lucide-react";

function BlogsSection() {
  const [selectedArticleId, setSelectedArticleId] = useState<string>("");
  const [isReading, setIsReading] = useState(false);
  const [searchQuery, setSearchQuery] = useState<string>("");
  const [selectedCategory, setSelectedCategory] = useState<string>("all");
  
  const readerScrollRef = useRef<HTMLDivElement>(null);
  const progressBarRef = useRef<HTMLDivElement>(null);

  const handleReaderScroll = () => {
    if (!readerScrollRef.current || !progressBarRef.current) return;
    const { scrollTop, scrollHeight, clientHeight } = readerScrollRef.current;
    const maxScroll = scrollHeight - clientHeight;
    const progress = maxScroll > 0 ? scrollTop / maxScroll : 0;
    progressBarRef.current.style.transform = `scaleX(${progress})`;
  };

  useEffect(() => {
    if (isReading && readerScrollRef.current) {
      readerScrollRef.current.scrollTop = 0;
      if (progressBarRef.current) {
        progressBarRef.current.style.transform = "scaleX(0)";
      }
    }
  }, [isReading, selectedArticleId]);
  
  // Custom states for article interactivity (initialized dynamically to prevent out-of-bounds crashes)
  const [likesState, setLikesState] = useState<{ [id: string]: number }>(() => {
    const initialLikes: { [id: string]: number } = {};
    EXTENDED_DATA.blogArticles.forEach(article => {
      initialLikes[article.id] = article.likes;
    });
    return initialLikes;
  });
  const [likedArticles, setLikedArticles] = useState<{ [id: string]: boolean }>({});
  
  const [commentsState, setCommentsState] = useState<{ [id: string]: any[] }>(() => {
    const initialComments: { [id: string]: any[] } = {};
    EXTENDED_DATA.blogArticles.forEach(article => {
      initialComments[article.id] = article.comments || [];
    });
    return initialComments;
  });

  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

  // Newsletter subscription states
  const [newsletterName, setNewsletterName] = useState("");
  const [newsletterEmail, setNewsletterEmail] = useState("");
  const [newsletterSubscribed, setNewsletterSubscribed] = useState(false);
  const [newsletterLoading, setNewsletterLoading] = useState(false);

  // Reading List / Bookmarks LocalStorage State
  const [bookmarks, setBookmarks] = useState<string[]>(() => {
    try {
      const stored = localStorage.getItem("portfolio_reading_list");
      return stored ? JSON.parse(stored) : [];
    } catch {
      return [];
    }
  });

  const toggleBookmark = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    setBookmarks(prev => {
      const updated = prev.includes(id) 
        ? prev.filter(bId => bId !== id) 
        : [...prev, id];
      localStorage.setItem("portfolio_reading_list", JSON.stringify(updated));
      window.dispatchEvent(new Event("portfolio_bookmarks_updated"));
      return updated;
    });
  };

  // Listen to remote article selection events from the Command Menu
  useEffect(() => {
    const handleSelectArticle = (e: any) => {
      if (e.detail?.id) {
        setSelectedArticleId(e.detail.id);
        setIsReading(true);
      }
    };

    window.addEventListener("portfolio_select_article" as any, handleSelectArticle);

    const storedSel = localStorage.getItem("portfolio_selected_article_id");
    if (storedSel) {
      setSelectedArticleId(storedSel);
      setIsReading(true);
      localStorage.removeItem("portfolio_selected_article_id");
    }

    return () => {
      window.removeEventListener("portfolio_select_article" as any, handleSelectArticle);
    };
  }, []);

  const categories = ["all", "AI Research", "Software Engineering", "Learning Journey"];

  const activeArticle = useMemo(() => {
    return EXTENDED_DATA.blogArticles.find((b) => b.id === selectedArticleId) || EXTENDED_DATA.blogArticles[0];
  }, [selectedArticleId]);

  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  const copyFallback = () => {
    try {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess("Link copied!");
      setTimeout(() => setShareSuccess(null), 3000);
    } catch (err) {
      setShareSuccess("Could not copy link");
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareData = {
      title: activeArticle.title,
      text: activeArticle.excerpt,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess("Shared successfully!");
        setTimeout(() => setShareSuccess(null), 3000);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          copyFallback();
        }
      }
    } else {
      copyFallback();
    }
  };

  // Filtering articles list
  const filteredArticles = useMemo(() => {
    return EXTENDED_DATA.blogArticles.filter((article) => {
      const query = searchQuery.toLowerCase().trim();
      const matchesSearch = query === "" ||
        article.title.toLowerCase().includes(query) ||
        article.excerpt.toLowerCase().includes(query) ||
        article.tags.some(tag => tag.toLowerCase().includes(query));

      const matchesCategory = selectedCategory === "all" || 
        (selectedCategory === "AI Research" && (article.category === "Artificial Intelligence" || article.category === "Finance")) ||
        (selectedCategory === "Software Engineering" && (article.category === "Web Development" || article.category === "Programming")) ||
        (selectedCategory === "Learning Journey" && (article.category === "Learning Journey" || article.category === "Personal Growth" || article.category === "Productivity" || article.category === "Career")) ||
        article.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCategory;
    });
  }, [searchQuery, selectedCategory]);

  const handleLike = (id: string, e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    if (likedArticles[id]) {
      setLikesState(prev => ({ ...prev, [id]: prev[id] - 1 }));
      setLikedArticles(prev => ({ ...prev, [id]: false }));
    } else {
      setLikesState(prev => ({ ...prev, [id]: prev[id] + 1 }));
      setLikedArticles(prev => ({ ...prev, [id]: true }));
    }
  };

  const handleAddComment = (e: React.FormEvent, articleId: string) => {
    e.preventDefault();
    if (!newCommentAuthor.trim() || !newCommentText.trim()) return;

    const comment = {
      author: newCommentAuthor.trim(),
      text: newCommentText.trim(),
      date: new Date().toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" })
    };

    setCommentsState(prev => ({
      ...prev,
      [articleId]: [...(prev[articleId] || []), comment]
    }));

    setNewCommentAuthor("");
    setNewCommentText("");
  };

  const handleNewsletterSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newsletterEmail.trim()) return;

    setNewsletterLoading(true);
    setTimeout(() => {
      setNewsletterLoading(false);
      setNewsletterSubscribed(true);
      setNewsletterName("");
      setNewsletterEmail("");
      setTimeout(() => {
        setNewsletterSubscribed(false);
      }, 6000);
    }, 1200);
  };

  return (
    <div className="space-y-12 font-sans relative" id="blog-catalog">
      {/* Title Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-6">
        <div className="space-y-3">
          <span className="text-xs text-purple-400 tracking-widest uppercase font-mono font-bold block">
            OBSIDIAN JOURNAL
          </span>
          <h2 
            style={{ fontSize: "clamp(2rem, 4vw, 3.5rem)" }} 
            className="font-bold tracking-tight text-white font-display leading-tight"
          >
            Engineering Chronicles
          </h2>
          <p className="text-sm text-zinc-400 max-w-xl leading-relaxed">
            Personal engineering diary documenting neural networks, stock sentiment NLP systems, state-machine synchronization, and structured learning frameworks.
          </p>
        </div>

        {/* Categories picker */}
        <div className="flex bg-zinc-950/60 border border-zinc-900 rounded-2xl p-1 overflow-x-auto max-w-full scrollbar-none">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-[10px] font-mono uppercase tracking-wider px-4 py-2 rounded-xl font-medium transition-all cursor-pointer whitespace-nowrap ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white shadow-md border border-zinc-800"
                  : "text-zinc-500 hover:text-white"
              }`}
            >
              {cat}
            </button>
          ))}
        </div>
      </div>

      {/* Directory explorer & Search Header */}
      <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4">
        <div className="relative flex-1 max-w-md">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
          <input
            type="text"
            placeholder="Search journals, categories, tags..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="w-full bg-zinc-950/80 border border-zinc-850 hover:border-zinc-700 focus:border-purple-500/60 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
          />
        </div>
        <span className="text-[10px] text-zinc-500 uppercase font-mono tracking-wider block sm:text-right">
          Index: <strong>{filteredArticles.length}</strong> matching entries
        </span>
      </div>

      {/* Beautiful Editorial Grid of Articles */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
        {filteredArticles.map((article) => {
          const isBookmarked = bookmarks.includes(article.id);
          return (
            <div
              key={article.id}
              onClick={() => {
                setSelectedArticleId(article.id);
                setIsReading(true);
              }}
              className="group flex flex-col justify-between bg-zinc-950/40 hover:bg-zinc-900/40 border border-zinc-900 hover:border-zinc-800 rounded-2xl overflow-hidden transition-all duration-300 cursor-pointer shadow-lg hover:shadow-2xl relative"
            >
              {/* Cover Banner */}
              <div className="relative aspect-[16/8] w-full overflow-hidden bg-zinc-900 border-b border-zinc-900">
                <img 
                  src={article.coverUrl} 
                  alt={article.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/20 to-transparent opacity-80" />
                
                {/* Micro Actions on card */}
                <div className="absolute top-3 right-3 flex items-center gap-1.5 z-10">
                  <button
                    onClick={(e) => toggleBookmark(article.id, e)}
                    className={`p-2 rounded-lg border backdrop-blur-md transition-all ${
                      isBookmarked
                        ? "bg-cyan-950/50 border-cyan-500/30 text-cyan-400"
                        : "bg-zinc-950/60 border-white/[0.04] text-zinc-400 hover:text-white"
                    }`}
                    title={isBookmarked ? "Remove Bookmark" : "Save article"}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${isBookmarked ? "fill-current" : ""}`} />
                  </button>
                </div>

                <div className="absolute bottom-3 left-3 flex items-center gap-2">
                  <span className="text-[9px] font-mono uppercase bg-zinc-950/80 text-purple-300 border border-purple-500/20 px-2 py-0.5 rounded-md backdrop-blur-sm">
                    {article.category}
                  </span>
                </div>
              </div>

              {/* Core snippet details */}
              <div className="p-5 flex-1 flex flex-col justify-between space-y-4">
                <div className="space-y-2">
                  <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500">
                    <span className="flex items-center gap-1"><Calendar className="w-3 h-3" /> {article.date}</span>
                    <span>•</span>
                    <span className="flex items-center gap-1"><Clock className="w-3 h-3" /> {article.readTime}</span>
                  </div>

                  <h3 className="text-base font-bold text-white leading-snug group-hover:text-purple-300 transition-colors duration-200">
                    {article.title}
                  </h3>

                  <p className="text-xs text-zinc-400 line-clamp-2 leading-relaxed">
                    {article.excerpt}
                  </p>
                </div>

                {/* Card footer */}
                <div className="flex items-center justify-between pt-4 border-t border-zinc-900/60 text-[10px] font-mono">
                  <div className="flex items-center gap-1.5 text-zinc-500">
                    <Heart className="w-3.5 h-3.5 text-pink-500/60" />
                    <span>{likesState[article.id] || 0}</span>
                    <span className="ml-2">•</span>
                    <MessageSquare className="w-3.5 h-3.5 text-cyan-500/60 ml-1" />
                    <span>{(commentsState[article.id] || []).length} comments</span>
                  </div>

                  <span className="flex items-center gap-1 text-cyan-400 group-hover:text-purple-300 font-bold transition-colors">
                    READ ARTICLE <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-1" />
                  </span>
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {/* Newsletter signup widget banner */}
      <div className="glass-card rounded-2xl p-6 md:p-8 flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="space-y-3 max-w-xl text-center md:text-left">
          <div className="flex items-center justify-center md:justify-start gap-1.5 text-xs font-mono text-purple-400">
            <Sparkles className="w-4 h-4 text-purple-500" />
            <span>WEEKLY HIGH-SIGNAL TRANSMISSIONS</span>
          </div>

          <h3 className="text-xl md:text-2xl font-bold text-white font-display tracking-tight">
            Subscribe to the Obsidian newsletter
          </h3>
          <p className="text-xs text-zinc-400 leading-relaxed">
            Get technical articles, deep learning paper reviews, and custom asset layouts directly inside your inbox. No tracking or telemetry spam.
          </p>
        </div>

        {/* Newsletter Form */}
        <div className="shrink-0 w-full md:w-auto relative">
          {newsletterSubscribed ? (
            <div className="text-center md:text-right space-y-2 py-2">
              <span className="inline-flex items-center gap-1.5 text-xs font-bold text-emerald-400 bg-emerald-950/20 px-4 py-2.5 rounded-xl border border-emerald-800/20">
                <Check className="w-4 h-4" /> Subscription Confirmed!
              </span>
            </div>
          ) : (
            <form onSubmit={handleNewsletterSubmit} className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Your name"
                value={newsletterName}
                onChange={(e) => setNewsletterName(e.target.value)}
                className="bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all w-full sm:w-40"
              />
              <input
                type="email"
                required
                placeholder="yourname@domain.com"
                value={newsletterEmail}
                onChange={(e) => setNewsletterEmail(e.target.value)}
                className="bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 rounded-xl px-3.5 py-3 text-xs text-white placeholder-zinc-500 outline-none transition-all w-full sm:w-48"
              />
              <button
                type="submit"
                disabled={newsletterLoading}
                className="bg-gradient-to-r from-purple-600 to-indigo-700 hover:from-purple-500 hover:to-indigo-600 text-white text-xs font-bold px-5 py-3 rounded-xl transition-all cursor-pointer whitespace-nowrap min-h-[40px]"
              >
                {newsletterLoading ? "Enrolling..." : "Subscribe Now"}
              </button>
            </form>
          )}
        </div>
      </div>

      {/* IMMERSIVE FOCUS READER OVERLAY */}
      <AnimatePresence>
        {isReading && activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            ref={readerScrollRef}
            onScroll={handleReaderScroll}
            className="fixed inset-0 z-50 bg-[#070709]/98 backdrop-blur-3xl overflow-y-auto px-4 py-16 scrollbar-thin"
          >
            {/* Top Fixed Progress Line inside reader overlay */}
            <div className="fixed top-0 left-0 right-0 h-[4px] bg-zinc-950/60 z-[100] pointer-events-none">
              <div 
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-purple-500 via-indigo-500 to-cyan-400 origin-left will-change-transform"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            {/* Float Back/Controls Top Strip */}
            <div className="max-w-3xl mx-auto flex items-center justify-between mb-8 relative z-10">
              <button 
                onClick={() => setIsReading(false)}
                className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-850 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-[11px] font-mono font-bold cursor-pointer group"
              >
                <ChevronLeft className="w-4 h-4 transition-transform group-hover:-translate-x-1" />
                <span>BACK TO JOURNAL</span>
              </button>

              <div className="flex items-center gap-2">
                <button
                  onClick={(e) => toggleBookmark(activeArticle.id, e)}
                  className={`p-2 rounded-xl border transition-all cursor-pointer ${
                    bookmarks.includes(activeArticle.id)
                      ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400"
                      : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                  }`}
                  title="Bookmark Article"
                >
                  <Bookmark className={`w-4 h-4 ${bookmarks.includes(activeArticle.id) ? "fill-current" : ""}`} />
                </button>
                <button
                  onClick={(e) => handleShare(e)}
                  className="p-2 bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white rounded-xl transition-all cursor-pointer"
                  title="Share Article"
                >
                  <Share2 className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Main Reading Container */}
            <motion.div
              initial={{ opacity: 0, y: 15, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 15, scale: 0.98 }}
              transition={{ duration: 0.4, ease: [0.16, 1, 0.3, 1] }}
              className="max-w-3xl mx-auto space-y-8 text-left pb-24 relative"
            >
              {/* Cover Image banner with soft visual reflection aspect */}
              <div className="relative aspect-[21/9] w-full rounded-2xl overflow-hidden bg-zinc-900 border border-zinc-850 shadow-2xl">
                <img 
                  src={activeArticle.coverUrl} 
                  alt={activeArticle.title} 
                  referrerPolicy="no-referrer"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-zinc-950 via-zinc-950/30 to-transparent" />
              </div>

              {/* Title Header with large beautiful editorial typography */}
              <div className="space-y-4 border-b border-zinc-900 pb-8">
                <div className="flex flex-wrap items-center gap-3 text-xs text-zinc-500 font-mono">
                  <span className="text-purple-400 font-bold uppercase tracking-wider">{activeArticle.category}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Calendar className="w-3.5 h-3.5" /> {activeArticle.date}</span>
                  <span>•</span>
                  <span className="flex items-center gap-1"><Clock className="w-3.5 h-3.5" /> {activeArticle.readTime}</span>
                </div>

                <h1 className="text-3xl md:text-4xl lg:text-5xl font-extrabold text-white tracking-tight leading-[1.15] font-display">
                  {activeArticle.title}
                </h1>

                {/* Author card strip */}
                <div className="flex items-center gap-3 pt-2">
                  <div className="w-8 h-8 rounded-full overflow-hidden border border-purple-500/30 bg-purple-950/50 flex items-center justify-center text-xs font-bold text-white font-mono">
                    SM
                  </div>
                  <div>
                    <h4 className="text-xs font-bold text-white">Sayam Mukherjee</h4>
                    <p className="text-[10px] text-zinc-500 font-mono">Undergraduate Developer & AI Researcher</p>
                  </div>
                </div>
              </div>

              {/* Beautiful, High-contrast, Editorial longform paragraphs */}
              <div className="text-base md:text-lg text-zinc-300 leading-relaxed font-sans space-y-6">
                <p className="text-lg md:text-xl font-medium text-purple-200 leading-relaxed border-l-2 border-purple-500/40 pl-4 py-1 italic">
                  {activeArticle.excerpt}
                </p>
                
                {activeArticle.contentParagraphs && activeArticle.contentParagraphs.length > 0 ? (
                  activeArticle.contentParagraphs.map((para, idx) => (
                    <p key={idx} className="leading-relaxed text-zinc-300 antialiased font-normal">
                      {para}
                    </p>
                  ))
                ) : (
                  <>
                    <p>
                      In constructing this piece of our personal workspace, we sought to outline practical applications. Leveraging FP16 half-precision parameters in our local scripts drives inference latencies down, ensuring high rendering frame rates even on low-powered edge nodes.
                    </p>
                    <p>
                      Similarly, integrating social text sentiment indexes directly inside React charting suites reveals deep market correlations that traditional technical analysis formulas often overlook. Consistently maintaining balanced schedules helps ensure both high-grade university results and rapid turnaround times for global freelance design clients.
                    </p>
                  </>
                )}
              </div>

              {/* Article Interactivity / Reactions Deck */}
              <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-t border-b border-zinc-900 py-6 my-12 text-sm font-mono">
                <div className="flex items-center gap-6">
                  <button
                    onClick={(e) => handleLike(activeArticle.id, e)}
                    className={`flex items-center gap-2 cursor-pointer transition-colors ${
                      likedArticles[activeArticle.id] ? "text-pink-500 font-bold" : "text-zinc-500 hover:text-pink-400"
                    }`}
                  >
                    <Heart className={`w-5 h-5 ${likedArticles[activeArticle.id] ? "fill-current scale-110" : ""}`} />
                    <span>{likesState[activeArticle.id] || 0} Likes</span>
                  </button>

                  <div className="text-zinc-500 flex items-center gap-2">
                    <MessageSquare className="w-5 h-5 text-cyan-400" />
                    <span>{(commentsState[activeArticle.id] || []).length} Comments</span>
                  </div>
                </div>

                <div className="flex gap-2 items-center w-full sm:w-auto">
                  {shareSuccess && (
                    <span className="text-xs text-emerald-400 font-mono bg-emerald-950/20 border border-emerald-500/20 px-3 py-1.5 rounded-lg animate-pulse">
                      {shareSuccess}
                    </span>
                  )}
                  <button
                    onClick={() => toggleBookmark(activeArticle.id)}
                    className={`flex items-center gap-2 px-4 py-2 border rounded-xl text-xs transition-all cursor-pointer ${
                      bookmarks.includes(activeArticle.id)
                        ? "bg-cyan-950/40 border-cyan-500/30 text-cyan-400"
                        : "bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-400 hover:text-white"
                    }`}
                  >
                    <Bookmark className={`w-3.5 h-3.5 ${bookmarks.includes(activeArticle.id) ? "fill-current" : ""}`} />
                    <span>{bookmarks.includes(activeArticle.id) ? "SAVED TO READING LIST" : "SAVE FOR LATER"}</span>
                  </button>
                </div>
              </div>

              {/* Comments Section */}
              <div className="space-y-6">
                <div className="flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-500 uppercase tracking-widest block">Note Discussion board</span>
                  <span className="text-xs font-mono text-purple-400">{(commentsState[activeArticle.id] || []).length} Comments</span>
                </div>
                
                <div className="space-y-4">
                  {(commentsState[activeArticle.id] || []).map((comm, idx) => (
                    <div key={idx} className="bg-zinc-900/40 border border-zinc-900 p-4 rounded-xl space-y-1.5 text-xs">
                      <div className="flex justify-between items-center text-[10px] font-mono text-zinc-500">
                        <span className="text-zinc-200 font-bold">{comm.author}</span>
                        <span>{comm.date}</span>
                      </div>
                      <p className="text-zinc-400 leading-normal text-xs">{comm.text}</p>
                    </div>
                  ))}
                </div>

                {/* Add comment form */}
                <form onSubmit={(e) => handleAddComment(e, activeArticle.id)} className="space-y-4 pt-4 border-t border-zinc-900/60">
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                    <input
                      type="text"
                      required
                      placeholder="Your name"
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      className="bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 focus:border-purple-500/60 rounded-xl px-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
                    />
                  </div>
                  <div className="relative">
                    <textarea
                      rows={3}
                      required
                      placeholder="Join the discussion... write a constructive public response."
                      value={newCommentText}
                      onChange={(e) => setNewCommentText(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-850 hover:border-zinc-700 focus:border-purple-500/60 rounded-xl p-4 text-xs text-white placeholder-zinc-500 outline-none transition-all resize-none"
                    />
                    <button
                      type="submit"
                      className="absolute right-3 bottom-3 text-purple-400 hover:text-cyan-300 cursor-pointer p-1.5 bg-zinc-950 hover:bg-zinc-900 border border-zinc-800 rounded-lg transition-all"
                    >
                      <Send className="w-3.5 h-3.5" />
                    </button>
                  </div>
                </form>
              </div>

              {/* Tag capsules and encryption status bar footer */}
              <div className="pt-12 mt-12 border-t border-zinc-900 flex flex-wrap gap-2 items-center justify-between text-[10px] font-mono text-zinc-500">
                <div className="flex flex-wrap gap-2">
                  {activeArticle.tags.map((tag) => (
                    <span key={tag} className="bg-zinc-900 border border-zinc-850 px-2.5 py-1 rounded-md text-zinc-400 font-mono">#{tag}</span>
                  ))}
                </div>
                <span>Vault Status: Secure • Live Comments Enabled</span>
              </div>

            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

export default memo(BlogsSection);
