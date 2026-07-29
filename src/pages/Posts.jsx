import { useState, useMemo } from "react";
import {
  FiFilter,
  FiPlusCircle,
  FiRefreshCw,
  FiTrendingUp,
  FiWifiOff,
  FiSearch,
  FiMessageSquare,
  FiSend,
  FiUserPlus,
  FiCheck,
} from "react-icons/fi";
import { useNavigate } from "react-router-dom";
import PostCard from "../components/PostCard/PostCard";
import useAuth from "../hooks/useAuth";
import useOffline from "../hooks/useOffline";
import {
  CreateComment,
  DeleteComment,
  DeletePost,
  GetAllPosts,
  LikePost,
  UpdatePost,
} from "../services/postService";

const Posts = () => {
  const navigate = useNavigate();
  const { userData } = useAuth();
  const { isOnline, forceDetect } = useOffline();

  const getPosts = GetAllPosts();
  const createComment = CreateComment();
  const deletePost = DeletePost();
  const updatePost = UpdatePost();
  const likePost = LikePost();
  const deleteComment = DeleteComment();

  // Search & Filter States
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedTag, setSelectedTag] = useState("");
  const [filterImagesOnly, setFilterImagesOnly] = useState(false);

  // Chat Widget States
  const [chatMessage, setChatMessage] = useState("");
  const [chatHistory, setChatHistory] = useState([
    { sender: "bot", text: "Hello! Try chatting with me. I'm a simulated local chatbot." }
  ]);

  // Follow State Recommendations
  const [followedUsers, setFollowedUsers] = useState({});

  const posts = getPosts?.data?.posts || [];

  // Filter & Sort Logic
  const allPosts = useMemo(() => {
    let result = [...posts];

    // Filter by text search
    if (searchQuery.trim()) {
      const q = searchQuery.toLowerCase();
      result = result.filter(
        (p) =>
          p.body?.toLowerCase().includes(q) ||
          p.user?.name?.toLowerCase().includes(q)
      );
    }

    // Filter by selected tag
    if (selectedTag) {
      result = result.filter((p) => p.body?.toLowerCase().includes(selectedTag.toLowerCase()));
    }

    // Filter by images only
    if (filterImagesOnly) {
      result = result.filter((p) => !!p.image);
    }

    // Sort by latest
    return result.sort((a, b) => new Date(b.createdAt) - new Date(a.createdAt));
  }, [posts, searchQuery, selectedTag, filterImagesOnly]);

  // Calculate trending tags dynamically from actual posts
  const trendingTags = useMemo(() => {
    const counts = {};
    posts.forEach((post) => {
      if (!post.body) return;
      const hashtags = post.body.match(/#[\w\u0600-\u06FF]+/g) || [];
      const uniqueHashtags = [...new Set(hashtags.map((t) => t.toLowerCase()))];
      uniqueHashtags.forEach((tag) => {
        counts[tag] = (counts[tag] || 0) + 1;
      });
    });

    return Object.entries(counts)
      .map(([tag, count]) => ({ tag, count }))
      .sort((a, b) => b.count - a.count)
      .slice(0, 5);
  }, [posts]);

  const handleAddComment = async (postId, content) => {
    return new Promise((resolve, reject) => {
      createComment.mutate(
        { post: postId, content },
        {
          onSuccess: () => {
            getPosts.refetch();
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  const handleDeletePost = async (postId) => {
    return new Promise((resolve, reject) => {
      deletePost.mutate(
        { id: postId },
        {
          onSuccess: () => {
            getPosts.refetch();
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  const handleUpdatePost = async (postId, formData) => {
    return new Promise((resolve, reject) => {
      updatePost.mutate(formData, {
        onSuccess: () => {
          getPosts.refetch();
          resolve();
        },
        onError: (error) => {
          reject(error);
        },
      });
    });
  };

  const handleToggleLike = async (postId) => {
    return new Promise((resolve, reject) => {
      likePost.mutate(
        { id: postId },
        {
          onSuccess: () => {
            getPosts.refetch();
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  const handleDeleteComment = async (postId, commentId) => {
    return new Promise((resolve, reject) => {
      deleteComment.mutate(
        { id: commentId },
        {
          onSuccess: () => {
            getPosts.refetch();
            resolve();
          },
          onError: (error) => {
            reject(error);
          },
        },
      );
    });
  };

  // Mock chatbot responses
  const handleSendChat = (e) => {
    e.preventDefault();
    if (!chatMessage.trim()) return;

    const userMsg = chatMessage;
    const nextHistory = [...chatHistory, { sender: "user", text: userMsg }];
    setChatHistory(nextHistory);
    setChatMessage("");

    setTimeout(() => {
      let botReply = "That's cool! Feel free to share your thoughts here.";
      const lower = userMsg.toLowerCase();
      if (lower.includes("hello") || lower.includes("hi")) {
        botReply = "Hey there! Hope you are enjoying the local social feed.";
      } else if (lower.includes("like") || lower.includes("unlike")) {
        botReply = "Likes are fully persistent! Try clicking the like button on any post.";
      } else if (lower.includes("database") || lower.includes("db")) {
        botReply = "We are currently using the disk-based data.db local file!";
      } else if (lower.includes("comment")) {
        botReply = "You can add comments instantly and they save right to the data.db file.";
      }

      setChatHistory((prev) => [...prev, { sender: "bot", text: botReply }]);
    }, 600);
  };

  const toggleFollow = (username) => {
    setFollowedUsers((prev) => ({
      ...prev,
      [username]: !prev[username],
    }));
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-100">
      <div className="container mx-auto max-w-6xl px-4 py-8">
        {/* Header Section */}
        <div className="relative bg-white rounded-3xl shadow-2xl overflow-hidden mb-8 animate-fadeIn">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-purple-500/5 to-pink-500/5"></div>
          <div className="absolute top-0 right-0 w-64 h-64 bg-gradient-to-br from-blue-400 to-purple-600 rounded-full blur-3xl opacity-10"></div>

          <div className="relative p-6 md:p-8">
            <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
              <div>
                <div className="flex items-center gap-3 mb-2">
                  <div className="p-3 bg-gradient-to-br from-blue-500 to-purple-600 rounded-2xl shadow-lg">
                    <FiTrendingUp className="w-6 h-6 text-white" />
                  </div>
                  <h1 className="text-4xl font-black bg-gradient-to-r from-blue-600 via-purple-600 to-pink-600 text-transparent bg-clip-text">
                    Discover Feed
                  </h1>
                </div>
                <p className="text-gray-600 ml-1">
                  Explore what's happening in the community
                </p>
              </div>

              <button
                onClick={() => navigate("/posts/create")}
                className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white font-bold rounded-xl shadow-lg hover:shadow-xl hover:scale-105 transition-all duration-300 whitespace-nowrap cursor-pointer"
              >
                <FiPlusCircle className="w-5 h-5" />
                Create Post
              </button>
            </div>
          </div>
        </div>

        {/* Grid Layout */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left/Middle: Feed & Search */}
          <div className="lg:col-span-2 space-y-6">
            {/* Search and Filters Bar */}
            <div className="bg-white rounded-3xl shadow-xl p-6 space-y-4">
              <div className="relative">
                <FiSearch className="absolute top-1/2 left-4 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                <input
                  type="text"
                  placeholder="Search posts by content or author..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-50 border-2 border-gray-100 rounded-2xl focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200"
                />
              </div>

              <div className="flex flex-wrap items-center justify-between gap-3 pt-2">
                <div className="flex items-center gap-2">
                  <button
                    onClick={() => setFilterImagesOnly(!filterImagesOnly)}
                    className={`px-4 py-2 rounded-xl text-xs font-bold border-2 transition-all duration-200 cursor-pointer ${
                      filterImagesOnly
                        ? "bg-blue-600 border-blue-600 text-white"
                        : "border-gray-200 text-gray-600 hover:border-gray-300"
                    }`}
                  >
                    🖼️ Images Only
                  </button>

                  {selectedTag && (
                    <button
                      onClick={() => setSelectedTag("")}
                      className="px-4 py-2 rounded-xl text-xs font-bold bg-purple-100 border-2 border-purple-200 text-purple-700 hover:bg-purple-200 transition-colors duration-200 cursor-pointer"
                    >
                      Tag: {selectedTag} ✕
                    </button>
                  )}
                </div>

                <span className="text-xs text-gray-500 font-semibold">
                  Showing {allPosts.length} posts
                </span>
              </div>
            </div>

            {/* Posts feed list */}
            <div className="space-y-4">
              {!isOnline ? (
                <div className="bg-white rounded-3xl shadow-lg p-10 md:p-16 text-center border border-red-100">
                  <div className="inline-flex items-center justify-center w-20 h-20 bg-gradient-to-br from-red-50 via-orange-50 to-rose-100 rounded-2xl mb-6 border border-red-100">
                    <FiWifiOff className="w-10 h-10 text-red-500" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    You are offline
                  </h3>
                  <p className="text-gray-600 mb-6 max-w-md mx-auto">
                    Please check your internet connection.
                  </p>
                  <button
                    onClick={forceDetect}
                    className="inline-flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-red-500 to-pink-600 text-white font-semibold rounded-xl shadow-md hover:shadow-lg hover:scale-105 transition-all duration-300"
                  >
                    <FiRefreshCw className="w-5 h-5" />
                    Retry connection
                  </button>
                </div>
              ) : getPosts.isLoading ? (
                <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                  <div className="inline-flex items-center justify-center w-16 h-16 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full mb-4">
                    <div className="animate-spin rounded-full h-8 w-8 border-4 border-blue-600 border-t-transparent"></div>
                  </div>
                  <p className="text-gray-600 font-semibold">
                    Loading amazing posts...
                  </p>
                </div>
              ) : allPosts.length === 0 ? (
                <div className="bg-white rounded-3xl shadow-lg p-16 text-center">
                  <div className="inline-flex items-center justify-center w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-3xl mb-6">
                    <FiTrendingUp className="w-12 h-12 text-blue-600" />
                  </div>
                  <h3 className="text-2xl font-bold text-gray-900 mb-2">
                    No matching posts
                  </h3>
                  <p className="text-gray-600 mb-8 max-w-md mx-auto">
                    No results found for your search query. Try typing something else!
                  </p>
                </div>
              ) : (
                <>
                  {/* Posts List */}
                  {allPosts.map((post) => (
                    <PostCard
                      key={post._id}
                      post={post}
                      onAddComment={handleAddComment}
                      onPostDeleted={handleDeletePost}
                      onPostUpdated={handleUpdatePost}
                      onToggleLike={handleToggleLike}
                      onDeleteComment={handleDeleteComment}
                      onPostClick={(postId) => navigate(`/posts/${postId}`)}
                    />
                  ))}
                </>
              )}
            </div>
          </div>

          {/* Right: Sidebar widgets */}
          <div className="space-y-6">
            {/* Trending Topics Widget */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-white/40">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                🔥 Trending Topics
              </h3>
              <div className="space-y-2">
                {trendingTags.length === 0 ? (
                  <p className="text-xs text-gray-400 font-semibold p-2 text-center">
                    No hashtags yet! Try creating a post with a #tag
                  </p>
                ) : (
                  trendingTags.map((item) => (
                    <button
                      key={item.tag}
                      onClick={() => setSelectedTag(item.tag)}
                      className="w-full flex justify-between items-center p-2.5 rounded-xl hover:bg-slate-50 transition-colors duration-200 text-left cursor-pointer group"
                    >
                      <span className="font-semibold text-sm text-gray-700 group-hover:text-blue-600">
                        {item.tag}
                      </span>
                      <span className="text-xs text-gray-400 font-medium">
                        {item.count} {item.count === 1 ? "post" : "posts"}
                      </span>
                    </button>
                  ))
                )}
              </div>
            </div>
            {/* Who to Follow Recommendation Widget */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-white/40">
              <h3 className="font-bold text-lg text-gray-800 mb-4 flex items-center gap-2">
                ✨ Recommended Creators
              </h3>
              <div className="space-y-4">
                {[
                  { name: "Sarah Connor", handle: "@sarah_c", initial: "S", color: "from-pink-500 to-rose-500" },
                  { name: "John Doe", handle: "@johndoe", initial: "J", color: "from-blue-500 to-indigo-500" },
                  { name: "Alice Cooper", handle: "@alice_c", initial: "A", color: "from-purple-500 to-indigo-500" },
                ].map((creator) => (
                  <div key={creator.handle} className="flex items-center justify-between gap-3">
                    <div className="flex items-center gap-3">
                      <div className={`w-10 h-10 rounded-full bg-gradient-to-br ${creator.color} flex items-center justify-center text-white font-bold text-sm shadow-md`}>
                        {creator.initial}
                      </div>
                      <div>
                        <p className="font-bold text-sm text-gray-800">{creator.name}</p>
                        <p className="text-xs text-gray-400">{creator.handle}</p>
                      </div>
                    </div>
                    <button
                      onClick={() => toggleFollow(creator.handle)}
                      className={`p-2 rounded-xl text-xs font-bold transition-all duration-200 cursor-pointer ${
                        followedUsers[creator.handle]
                          ? "bg-green-50 border border-green-200 text-green-600 hover:bg-green-100"
                          : "bg-blue-50 border border-blue-200 text-blue-600 hover:bg-blue-100"
                      }`}
                    >
                      {followedUsers[creator.handle] ? <FiCheck className="w-4 h-4" /> : <FiUserPlus className="w-4 h-4" />}
                    </button>
                  </div>
                ))}
              </div>
            </div>

            {/* Direct Messaging Chat Widget */}
            <div className="bg-white rounded-3xl shadow-xl p-6 border border-white/40 flex flex-col h-[320px]">
              <h3 className="font-bold text-lg text-gray-800 mb-2 flex items-center gap-2">
                💬 Direct Assistant Chat
              </h3>
              
              {/* Chat Output Area */}
              <div className="flex-1 overflow-y-auto mb-3 space-y-2.5 p-2 bg-gray-50 rounded-2xl text-xs max-h-[170px] scrollbar-thin">
                {chatHistory.map((msg, i) => (
                  <div
                    key={i}
                    className={`p-2.5 rounded-2xl max-w-[85%] leading-relaxed ${
                      msg.sender === "user"
                        ? "bg-blue-600 text-white ml-auto rounded-tr-none"
                        : "bg-white border border-gray-100 text-gray-700 mr-auto rounded-tl-none"
                    }`}
                  >
                    {msg.text}
                  </div>
                ))}
              </div>

              {/* Chat Input Area */}
              <form onSubmit={handleSendChat} className="flex gap-2">
                <input
                  type="text"
                  placeholder="Ask chatbot..."
                  value={chatMessage}
                  onChange={(e) => setChatMessage(e.target.value)}
                  className="flex-1 px-3 py-2 bg-gray-50 border-2 border-gray-100 rounded-xl text-xs focus:border-blue-500 focus:bg-white focus:outline-none transition-all duration-200"
                />
                <button
                  type="submit"
                  className="p-2 bg-blue-600 hover:bg-blue-700 text-white rounded-xl transition-colors duration-200 cursor-pointer"
                >
                  <FiSend className="w-4 h-4" />
                </button>
              </form>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Posts;
