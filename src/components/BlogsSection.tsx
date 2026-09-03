import { useState, useMemo, useEffect, useRef, memo } from "react";
import { JOURNAL_ENTRIES, JournalEntry } from "../data/journal";
import { motion, AnimatePresence } from "motion/react";
import { 
  BookOpen, Calendar, Clock, ChevronRight, Hash, ArrowLeft, 
  Search, Heart, MessageSquare, Share2, Bookmark, Check, Send, Sparkles, X, ChevronLeft,
  FileText, Feather, ShieldCheck
} from "lucide-react";

function BlogsSectionComponent() {
  const [selectedArticleId, setSelectedArticleId] = useState<string>(JOURNAL_ENTRIES[0].id);
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
  
  // Custom states for article interactivity
  const [likesState, setLikesState] = useState<{ [id: string]: number }>(() => {
    const initialLikes: { [id: string]: number } = {};
    JOURNAL_ENTRIES.forEach(article => {
      initialLikes[article.id] = article.likes ?? 12;
    });
    return initialLikes;
  });
  const [likedArticles, setLikedArticles] = useState<{ [id: string]: boolean }>({});
  
  const [commentsState, setCommentsState] = useState<{ [id: string]: any[] }>(() => {
    const initialComments: { [id: string]: any[] } = {};
    JOURNAL_ENTRIES.forEach(article => {
      initialComments[article.id] = article.comments || [];
    });
    return initialComments;
  });

  const [newCommentAuthor, setNewCommentAuthor] = useState("");
  const [newCommentText, setNewCommentText] = useState("");

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

  const categories = [
    "all", 
    "Academics", 
    "DSA & Problem Solving", 
    "Computer Vision", 
    "Hackathon Engineering", 
    "Discipline & Cadence"
  ];

  const activeArticle = useMemo(() => {
    return JOURNAL_ENTRIES.find((b) => b.id === selectedArticleId) || JOURNAL_ENTRIES[0];
  }, [selectedArticleId]);

  const [shareSuccess, setShareSuccess] = useState<string | null>(null);

  const handleShare = async (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const shareData = {
      title: activeArticle.title,
      text: activeArticle.excerpt || activeArticle.summary,
      url: window.location.href
    };

    if (navigator.share) {
      try {
        await navigator.share(shareData);
        setShareSuccess("Shared successfully!");
        setTimeout(() => setShareSuccess(null), 3000);
      } catch (err: any) {
        if (err.name !== "AbortError") {
          navigator.clipboard.writeText(window.location.href);
          setShareSuccess("Link copied!");
          setTimeout(() => setShareSuccess(null), 3000);
        }
      }
    } else {
      navigator.clipboard.writeText(window.location.href);
      setShareSuccess("Link copied!");
      setTimeout(() => setShareSuccess(null), 3000);
    }
  };

  const handleLike = (e?: React.MouseEvent) => {
    if (e) e.stopPropagation();
    const isCurrentlyLiked = likedArticles[activeArticle.id];
    setLikedArticles(prev => ({ ...prev, [activeArticle.id]: !isCurrentlyLiked }));
    setLikesState(prev => ({
      ...prev,
      [activeArticle.id]: (prev[activeArticle.id] || 0) + (isCurrentlyLiked ? -1 : 1)
    }));
  };

  const handleAddComment = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCommentText.trim()) return;

    const newComment = {
      id: Date.now().toString(),
      author: newCommentAuthor.trim() || "Peer Developer",
      text: newCommentText.trim(),
      date: "Just now"
    };

    setCommentsState(prev => ({
      ...prev,
      [activeArticle.id]: [...(prev[activeArticle.id] || []), newComment]
    }));

    setNewCommentText("");
  };

  const filteredArticles = useMemo(() => {
    return JOURNAL_ENTRIES.filter((article) => {
      const excerptText = article.excerpt || article.summary || "";
      const contentText = Array.isArray(article.content) ? article.content.join(" ") : (article.content || "");
      const matchesSearch = 
        article.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        excerptText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        contentText.toLowerCase().includes(searchQuery.toLowerCase()) ||
        article.tags.some(t => t.toLowerCase().includes(searchQuery.toLowerCase()));

      const matchesCat = selectedCategory === "all" || article.category.toLowerCase() === selectedCategory.toLowerCase();

      return matchesSearch && matchesCat;
    });
  }, [searchQuery, selectedCategory]);

  return (
    <div className="space-y-12 font-sans relative" id="journal">
      {/* Glow Blur Accent */}
      <div className="absolute top-1/4 left-10 w-[350px] h-[350px] bg-purple-500/5 rounded-full blur-[140px] pointer-events-none -z-10" />

      {/* Header */}
      <div className="space-y-4">
        <div className="inline-flex items-center gap-2 px-3 py-1 bg-zinc-950/80 border border-zinc-900 rounded-full">
          <Feather className="w-3.5 h-3.5 text-purple-400" />
          <span className="text-[10px] text-zinc-400 font-mono tracking-widest uppercase font-bold">
            ENGINEERING NOTES & REFLECTIONS
          </span>
        </div>

        <div className="flex flex-col md:flex-row md:items-end justify-between gap-6 border-b border-zinc-900 pb-8">
          <div>
            <h2 
              style={{ fontSize: "clamp(1.5rem, 3.5vw, 3.5rem)" }} 
              className="font-bold tracking-tight text-white font-display mt-1"
            >
              Engineering Notes & Reflections
            </h2>
            <p className="text-xs sm:text-sm text-zinc-400 max-w-xl mt-1 leading-relaxed">
              Reflective engineering essays on the B.Tech CSE transition, deliberate algorithmic mastery, edge computer vision architectures, and disciplined study cadences.
            </p>
          </div>

          {/* Search Bar */}
          <div className="relative w-full md:w-72">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-500" />
            <input
              type="text"
              placeholder="Search essays, tags..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="w-full bg-zinc-950 border border-zinc-900 hover:border-zinc-800 focus:border-purple-500/50 rounded-xl pl-10 pr-4 py-2.5 text-xs text-white placeholder-zinc-500 outline-none transition-all"
            />
          </div>
        </div>

        {/* Filter Categories */}
        <div className="flex flex-wrap gap-1.5 p-1 bg-zinc-950 border border-zinc-900 rounded-2xl max-w-2xl overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setSelectedCategory(cat)}
              className={`text-xs px-3.5 py-1.5 rounded-xl transition-all cursor-pointer capitalize font-medium ${
                selectedCategory === cat
                  ? "bg-zinc-900 text-white shadow-md border border-zinc-800"
                  : "bg-transparent text-zinc-400 hover:text-white"
              }`}
            >
              {cat === "all" ? "All Essays (5)" : cat}
            </button>
          ))}
        </div>
      </div>

      {/* Articles Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {filteredArticles.map((article) => {
          const isBookmarked = bookmarks.includes(article.id);
          return (
            <div
              key={article.id}
              onClick={() => {
                setSelectedArticleId(article.id);
                setIsReading(true);
              }}
              className="glass-card rounded-2xl overflow-hidden flex flex-col justify-between group transition-all duration-300 border border-zinc-850 hover:border-purple-500/30 cursor-pointer shadow-lg"
            >
              <div className="p-6 space-y-4 flex-1">
                <div className="flex items-center justify-between gap-2">
                  <span className="text-[9px] font-mono uppercase tracking-wider bg-purple-950/40 text-purple-300 border border-purple-800/40 px-2.5 py-1 rounded-full font-bold">
                    {article.category}
                  </span>
                  <div className="flex items-center gap-2 text-[10px] text-zinc-500 font-mono">
                    <Clock className="w-3 h-3" />
                    <span>{article.readTime}</span>
                  </div>
                </div>

                <div className="space-y-2">
                  <h3 className="text-base font-bold text-white font-display leading-snug group-hover:text-purple-300 transition-colors">
                    {article.title}
                  </h3>
                  <p className="text-xs text-zinc-400 leading-relaxed line-clamp-3">
                    {article.excerpt || article.summary}
                  </p>
                </div>

                <div className="flex flex-wrap gap-1 pt-1">
                  {article.tags.map((tag, idx) => (
                    <span key={idx} className="text-[9px] bg-zinc-900 text-zinc-400 px-2 py-0.5 rounded border border-zinc-850 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              <div className="p-6 pt-0 border-t border-zinc-900 mt-4 flex items-center justify-between text-xs">
                <span className="text-[10px] text-zinc-500 font-mono">
                  {article.date}
                </span>
                <span className="flex items-center gap-1 text-cyan-400 group-hover:text-purple-300 font-mono font-bold text-xs transition-colors">
                  <span>Read Reflection</span>
                  <ChevronRight className="w-3.5 h-3.5 transition-transform group-hover:translate-x-0.5" />
                </span>
              </div>
            </div>
          );
        })}
      </div>

      {/* Focus Reader Overlay Modal */}
      <AnimatePresence>
        {isReading && activeArticle && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.25 }}
            ref={readerScrollRef}
            onScroll={handleReaderScroll}
            className="fixed inset-0 z-50 bg-[#070709]/98 backdrop-blur-2xl overflow-y-auto px-4 py-12"
          >
            {/* Reading progress bar */}
            <div className="fixed top-0 left-0 right-0 h-1 bg-zinc-950 z-50 pointer-events-none">
              <div 
                ref={progressBarRef}
                className="h-full bg-gradient-to-r from-purple-500 to-cyan-400 origin-left"
                style={{ transform: "scaleX(0)" }}
              />
            </div>

            <div className="max-w-3xl mx-auto space-y-8">
              {/* Back strip */}
              <div className="flex items-center justify-between">
                <button 
                  onClick={() => setIsReading(false)}
                  className="flex items-center gap-2 px-4 py-2 rounded-full bg-zinc-900 hover:bg-zinc-800 border border-zinc-800 text-zinc-300 hover:text-white transition-all text-xs font-mono font-bold cursor-pointer"
                >
                  <ChevronLeft className="w-4 h-4" />
                  <span>Back to Notes</span>
                </button>

                <div className="flex items-center gap-2">
                  <button
                    onClick={(e) => toggleBookmark(activeArticle.id, e)}
                    className={`p-2 rounded-xl border transition-all cursor-pointer ${
                      bookmarks.includes(activeArticle.id)
                        ? "bg-purple-950/40 border-purple-500/30 text-purple-400"
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

              {shareSuccess && (
                <div className="bg-emerald-950/50 border border-emerald-800/40 text-emerald-400 text-xs px-4 py-2 rounded-xl text-center font-mono">
                  {shareSuccess}
                </div>
              )}

              {/* Essay Header */}
              <div className="space-y-4 border-b border-zinc-850 pb-6">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-mono uppercase tracking-wider bg-purple-950/40 text-purple-300 border border-purple-800/40 px-3 py-1 rounded-full font-bold">
                    {activeArticle.category}
                  </span>
                  <span className="text-[10px] text-zinc-500 font-mono">
                    {activeArticle.date} • {activeArticle.readTime}
                  </span>
                </div>
                <h1 className="text-2xl sm:text-3xl md:text-4xl font-extrabold text-white font-display leading-tight">
                  {activeArticle.title}
                </h1>
                <p className="text-sm text-zinc-400 leading-relaxed font-sans italic border-l-2 border-purple-500 pl-4">
                  "{activeArticle.excerpt || activeArticle.summary}"
                </p>
              </div>

              {/* Essay Body */}
              <div className="prose prose-invert max-w-none text-zinc-300 text-sm sm:text-base leading-relaxed space-y-4 font-sans">
                {(Array.isArray(activeArticle.content) ? activeArticle.content : activeArticle.content.split("\n\n")).map((para, idx) => {
                  if (para.startsWith("## ")) {
                    return (
                      <h2 key={idx} className="text-xl font-bold text-white font-display pt-4 pb-1 border-b border-zinc-900">
                        {para.replace("## ", "")}
                      </h2>
                    );
                  }
                  if (para.startsWith("### ")) {
                    return (
                      <h3 key={idx} className="text-base font-bold text-purple-300 font-display pt-2">
                        {para.replace("### ", "")}
                      </h3>
                    );
                  }
                  if (para.startsWith("- ")) {
                    const items = para.split("\n").map(line => line.replace("- ", ""));
                    return (
                      <ul key={idx} className="space-y-1.5 pl-4 list-disc text-zinc-300 text-xs sm:text-sm">
                        {items.map((it, i) => (
                          <li key={i}>{it}</li>
                        ))}
                      </ul>
                    );
                  }
                  return (
                    <p key={idx} className="text-zinc-300 leading-relaxed text-xs sm:text-sm">
                      {para}
                    </p>
                  );
                })}
              </div>

              {/* Author Footer & Interactivity */}
              <div className="border-t border-zinc-850 pt-6 space-y-6">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-3">
                    <button
                      onClick={handleLike}
                      className={`flex items-center gap-2 px-4 py-2 rounded-xl border text-xs font-mono font-bold transition-all cursor-pointer ${
                        likedArticles[activeArticle.id]
                          ? "bg-pink-950/40 border-pink-500/40 text-pink-400"
                          : "bg-zinc-900 hover:bg-zinc-850 border-zinc-800 text-zinc-300"
                      }`}
                    >
                      <Heart className={`w-4 h-4 ${likedArticles[activeArticle.id] ? "fill-current text-pink-400" : ""}`} />
                      <span>{likesState[activeArticle.id] || 0} Likes</span>
                    </button>
                  </div>

                  <div className="flex items-center gap-2 font-mono text-xs text-zinc-500">
                    <ShieldCheck className="w-4 h-4 text-emerald-400" />
                    <span>Verified Engineering Reflection</span>
                  </div>
                </div>

                {/* Comments Section */}
                <div className="glass-card p-6 rounded-2xl space-y-4 border border-zinc-850">
                  <h4 className="text-xs font-mono uppercase tracking-wider text-white font-bold flex items-center gap-2">
                    <MessageSquare className="w-4 h-4 text-cyan-400" />
                    <span>Discussion & Peer Notes ({(commentsState[activeArticle.id] || []).length})</span>
                  </h4>

                  <div className="space-y-3">
                    {(commentsState[activeArticle.id] || []).map((comm: any) => (
                      <div key={comm.id} className="p-3 bg-zinc-950/60 rounded-xl border border-zinc-900 text-xs space-y-1">
                        <div className="flex items-center justify-between text-[10px] text-zinc-500 font-mono">
                          <span className="text-purple-300 font-bold">{comm.author}</span>
                          <span>{comm.date}</span>
                        </div>
                        <p className="text-zinc-300 font-sans">{comm.text}</p>
                      </div>
                    ))}
                  </div>

                  {/* Add comment form */}
                  <form onSubmit={handleAddComment} className="space-y-2 pt-2">
                    <input
                      type="text"
                      placeholder="Your handle or name (optional)"
                      value={newCommentAuthor}
                      onChange={(e) => setNewCommentAuthor(e.target.value)}
                      className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                    />
                    <div className="flex gap-2">
                      <input
                        type="text"
                        placeholder="Add a reflective note or question..."
                        value={newCommentText}
                        onChange={(e) => setNewCommentText(e.target.value)}
                        className="flex-1 bg-zinc-900/60 border border-zinc-800 rounded-xl px-3.5 py-2 text-xs text-white placeholder-zinc-500 outline-none"
                      />
                      <button
                        type="submit"
                        className="bg-purple-600 hover:bg-purple-500 text-white px-4 py-2 rounded-xl text-xs font-mono font-bold transition-all"
                      >
                        Post
                      </button>
                    </div>
                  </form>
                </div>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}

const BlogsSection = memo(BlogsSectionComponent);
export default BlogsSection;
