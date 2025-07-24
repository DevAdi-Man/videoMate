import React, { useState } from "react";
import { Link } from "react-router-dom";
import auth from "../services/auth";
import { useQuery } from "@tanstack/react-query";
import { Loader } from "../components";
import { 
  FiClock, 
  FiTrash2, 
  FiSearch, 
  FiCalendar, 
  FiPlay,
  FiEye,
  FiUser,
  FiMoreVertical
} from "react-icons/fi";

const VideoHistory = () => {
  const [searchQuery, setSearchQuery] = useState("");
  const [selectedPeriod, setSelectedPeriod] = useState("all");

  const fetchedHistory = async () => {
    try {
      const history = await auth.getWatchHistory();
      return history.data;
    } catch (error) {
      console.log(error);
      return [];
    }
  };

  const { isLoading, data: history = [] } = useQuery({ 
    queryKey: ["history"], 
    queryFn: fetchedHistory 
  });

  // Filter history based on search and time period
  const filteredHistory = history.filter(item => {
    const matchesSearch = item.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                         item.owner?.userName.toLowerCase().includes(searchQuery.toLowerCase());
    
    if (selectedPeriod === "all") return matchesSearch;
    
    const itemDate = new Date(item.createdAt);
    const now = new Date();
    const daysDiff = Math.floor((now - itemDate) / (1000 * 60 * 60 * 24));
    
    switch (selectedPeriod) {
      case "today":
        return matchesSearch && daysDiff === 0;
      case "week":
        return matchesSearch && daysDiff <= 7;
      case "month":
        return matchesSearch && daysDiff <= 30;
      default:
        return matchesSearch;
    }
  });

  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || "0";
  };

  const formatTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const videoDate = new Date(date);
    const diffInSeconds = Math.floor((now - videoDate) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
  };

  const periodOptions = [
    { value: "all", label: "All time" },
    { value: "today", label: "Today" },
    { value: "week", label: "This week" },
    { value: "month", label: "This month" },
  ];

  if (isLoading) {
    return <Loader text="Loading your watch history..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-blue-500/10 via-background to-purple-500/10 py-16 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(59,130,246,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-blue-500/20 rounded-full">
              <FiClock className="w-12 h-12 text-blue-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Watch History
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Keep track of videos you've watched • {history.length} videos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {history.length > 0 ? (
          <>
            {/* Controls */}
            <div className="flex flex-col lg:flex-row gap-4 mb-8">
              {/* Search Bar */}
              <div className="flex-1 relative">
                <FiSearch className="absolute left-4 top-1/2 transform -translate-y-1/2 w-5 h-5 text-gray-400" />
                <input
                  type="text"
                  placeholder="Search your history..."
                  value={searchQuery}
                  onChange={(e) => setSearchQuery(e.target.value)}
                  className="w-full pl-12 pr-4 py-3 bg-gray-900/50 border border-gray-700 rounded-lg 
                           text-text placeholder-gray-400 focus:outline-none focus:ring-2 
                           focus:ring-blue-500/50 focus:border-blue-500 transition-all duration-200"
                />
              </div>

              {/* Time Period Filter */}
              <div className="flex gap-2">
                {periodOptions.map((option) => (
                  <button
                    key={option.value}
                    onClick={() => setSelectedPeriod(option.value)}
                    className={`px-4 py-3 rounded-lg font-medium transition-all duration-200 whitespace-nowrap
                               ${selectedPeriod === option.value 
                                 ? 'bg-blue-500 text-white shadow-glow' 
                                 : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-text'
                               }`}
                  >
                    {option.label}
                  </button>
                ))}
              </div>

              {/* Clear History Button */}
              <button className="flex items-center gap-2 px-4 py-3 bg-red-600/20 text-red-400 
                               rounded-lg hover:bg-red-600/30 transition-colors duration-200">
                <FiTrash2 className="w-4 h-4" />
                <span className="hidden sm:inline">Clear History</span>
              </button>
            </div>

            {/* History List */}
            {filteredHistory.length > 0 ? (
              <div className="space-y-4">
                {filteredHistory.map((item, index) => (
                  <div 
                    key={item._id} 
                    className="group flex gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 
                             transition-all duration-200 animate-fade-in"
                    style={{ animationDelay: `${index * 0.05}s` }}
                  >
                    {/* Thumbnail */}
                    <Link to={`/video/${item._id}`} className="flex-shrink-0 relative">
                      <div className="w-48 h-28 bg-gray-800 rounded-lg overflow-hidden">
                        <img
                          src={item.thumbnail?.url}
                          alt={item.title}
                          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-200"
                        />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 
                                      transition-opacity duration-200 flex items-center justify-center">
                          <div className="bg-white/90 rounded-full p-2">
                            <FiPlay className="w-4 h-4 text-black ml-0.5" />
                          </div>
                        </div>
                      </div>
                    </Link>

                    {/* Video Details */}
                    <div className="flex-1 min-w-0 space-y-2">
                      <Link to={`/video/${item._id}`}>
                        <h3 className="text-text font-medium text-lg line-clamp-2 hover:text-primary 
                                     transition-colors duration-200">
                          {item.title}
                        </h3>
                      </Link>

                      {/* Channel Info */}
                      <Link 
                        to={`/channel/${item.owner?.userName}`}
                        className="flex items-center gap-2 text-gray-400 hover:text-text 
                                 transition-colors duration-200 w-fit"
                      >
                        <FiUser className="w-4 h-4" />
                        <span className="text-sm">{item.owner?.userName}</span>
                      </Link>

                      {/* Stats */}
                      <div className="flex items-center gap-4 text-sm text-gray-500">
                        <div className="flex items-center gap-1">
                          <FiEye className="w-4 h-4" />
                          <span>{formatViews(item.views)} views</span>
                        </div>
                        <span>•</span>
                        <span>Watched {formatTimeAgo(item.watchedAt || item.createdAt)}</span>
                      </div>

                      {/* Description */}
                      <p className="text-sm text-gray-400 line-clamp-2">
                        {item.description}
                      </p>
                    </div>

                    {/* Actions */}
                    <div className="flex-shrink-0 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <button className="p-2 hover:bg-gray-800 rounded-lg transition-colors duration-200">
                        <FiMoreVertical className="w-5 h-5 text-gray-400" />
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              /* No Results */
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                  <FiSearch className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">No videos found</h3>
                <p className="text-gray-400">Try adjusting your search or time period filter.</p>
              </div>
            )}
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <FiClock className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-text mb-4">No watch history yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Videos you watch will appear here. Start exploring to build your history.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="btn-primary px-6 py-3 rounded-lg font-medium"
            >
              Start Watching
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default VideoHistory;
