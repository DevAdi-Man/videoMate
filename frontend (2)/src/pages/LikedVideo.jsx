import React, { useState } from "react";
import videoService from "../services/VideoService";
import { useQuery } from "@tanstack/react-query";
import { Loader, VideoCard } from "../components/index";
import { FiHeart, FiGrid, FiList, FiFilter, FiCalendar, FiClock } from "react-icons/fi";

const LikedVideo = () => {
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  const handleLikeVideo = async () => {
    try {
      const LikeData = await videoService.LikedVideos();
      return LikeData;
    } catch (error) {
      console.log(error);
    }
  };

  const { isLoading, data: like } = useQuery({
    queryKey: ["Like"],
    queryFn: handleLikeVideo,
  });

  if (isLoading) {
    return <Loader text="Loading your liked videos..." />;
  }

  const likedVideos = like || [];

  // Sort videos based on selected option
  const sortedVideos = [...likedVideos].sort((a, b) => {
    switch (sortBy) {
      case 'recent':
        return new Date(b.createdAt) - new Date(a.createdAt);
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'title':
        return a.video.title.localeCompare(b.video.title);
      default:
        return 0;
    }
  });

  const sortOptions = [
    { value: 'recent', label: 'Recently Liked', icon: FiClock },
    { value: 'oldest', label: 'Oldest First', icon: FiCalendar },
    { value: 'title', label: 'Title A-Z', icon: FiFilter },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-red-500/10 via-background to-pink-500/10 py-16 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(239,68,68,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <div className="flex items-center justify-center mb-6">
            <div className="p-4 bg-red-500/20 rounded-full">
              <FiHeart className="w-12 h-12 text-red-400" />
            </div>
          </div>
          <h1 className="text-4xl md:text-5xl font-bold text-text mb-4">
            Liked Videos
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Your collection of favorite videos • {likedVideos.length} videos
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {likedVideos.length > 0 ? (
          <>
            {/* Controls Bar */}
            <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
              {/* Sort Options */}
              <div className="flex flex-wrap gap-2">
                {sortOptions.map((option) => {
                  const Icon = option.icon;
                  return (
                    <button
                      key={option.value}
                      onClick={() => setSortBy(option.value)}
                      className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                                 ${sortBy === option.value 
                                   ? 'bg-red-500 text-white shadow-glow' 
                                   : 'bg-gray-800/50 text-gray-300 hover:bg-gray-700/50 hover:text-text'
                                 }`}
                    >
                      <Icon className="w-4 h-4" />
                      {option.label}
                    </button>
                  );
                })}
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'grid' 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-text'
                  }`}
                >
                  <FiGrid className="w-4 h-4" />
                </button>
                <button
                  onClick={() => setViewMode('list')}
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-red-500 text-white' 
                      : 'text-gray-400 hover:text-text'
                  }`}
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* Videos Grid/List */}
            <div className={`${
              viewMode === 'grid' 
                ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
                : 'space-y-4'
            }`}>
              {sortedVideos.map((item, index) => (
                <div 
                  key={item._id} 
                  className={`animate-fade-in group relative ${
                    viewMode === 'list' ? 'flex gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-colors' : ''
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  <VideoCard {...item.video} viewMode={viewMode} />
                  
                  {/* Liked indicator */}
                  <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                    <div className="bg-red-500/90 rounded-full p-2">
                      <FiHeart className="w-4 h-4 text-white fill-current" />
                    </div>
                  </div>
                </div>
              ))}
            </div>

            {/* Load More Button */}
            <div className="text-center mt-12 mb-8">
              <button className="btn-secondary px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
                Load More Videos
              </button>
            </div>
          </>
        ) : (
          /* Empty State */
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <FiHeart className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-2xl font-semibold text-text mb-4">No liked videos yet</h3>
            <p className="text-gray-400 mb-8 max-w-md mx-auto">
              Start exploring and like videos you enjoy. They'll appear here for easy access later.
            </p>
            <button 
              onClick={() => window.history.back()}
              className="btn-primary px-6 py-3 rounded-lg font-medium"
            >
              Discover Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default LikedVideo;
