import React, { useState } from "react";
import { Loader, VideoCard } from "../components";
import getAllVudeo from "../hooks/react-query/query/videos/getAllVudeo.jsx";
import useTrendingVideos from "../hooks/react-query/query/videos/useTrendingVideos";
import { FiTrendingUp, FiVideo, FiFilter, FiGrid, FiList } from "react-icons/fi";

const Home = () => {
  const { data: backendVideos, isLoading: loadingBackend } = getAllVudeo();
  const { data: trendingVideos, isLoading: loadingRapid } = useTrendingVideos();
  const [viewMode, setViewMode] = useState('grid');
  const [filter, setFilter] = useState('all');

  if (loadingBackend || loadingRapid) return <Loader text="Loading amazing videos..." />;

  const rapidAdapted = (trendingVideos || [])
    .filter((vid) => vid?.type === "video")
    .map((vid, i) => ({
      _id: `yt-${vid.video.videoId || i}`,
      title: vid.video.title,
      thumbnail: { url: vid.video.thumbnails?.[1]?.url },
      owner: {
        avatar: vid.video.author?.avatar?.[0]?.url,
        userName: vid.video.author?.title,
      },
      views: vid.video.stats?.views,
      isExternal: true,
      videoId: vid.video.videoId, // Store original YouTube video ID
      createdAt: vid.video.publishedTimeText,
    }));

  // Demo videos for testing (when no backend videos available)
  const demoVideos = backendVideos?.docs?.length === 0 ? [
    {
      _id: 'demo-1',
      title: 'Sample Video - Nature Documentary',
      thumbnail: { url: 'https://images.unsplash.com/photo-1441974231531-c6227db76b6e?w=500&h=300&fit=crop' },
      owner: {
        avatar: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=100&h=100&fit=crop&crop=face',
        userName: 'NatureChannel',
      },
      views: 15420,
      videoFile: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/BigBuckBunny.mp4' },
      description: 'A beautiful nature documentary showcasing wildlife.',
      createdAt: new Date().toISOString(),
      isDemo: true,
    },
    {
      _id: 'demo-2', 
      title: 'Tech Tutorial - Web Development',
      thumbnail: { url: 'https://images.unsplash.com/photo-1461749280684-dccba630e2f6?w=500&h=300&fit=crop' },
      owner: {
        avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=100&h=100&fit=crop&crop=face',
        userName: 'TechGuru',
      },
      views: 8930,
      videoFile: { url: 'https://commondatastorage.googleapis.com/gtv-videos-bucket/sample/ElephantsDream.mp4' },
      description: 'Learn modern web development techniques.',
      createdAt: new Date().toISOString(),
      isDemo: true,
    }
  ] : [];

  const allVideos = [...(backendVideos?.docs || []), ...demoVideos, ...rapidAdapted];

  const filteredVideos = filter === 'all' 
    ? allVideos 
    : filter === 'trending' 
    ? rapidAdapted 
    : backendVideos?.docs || [];

  const filterOptions = [
    { value: 'all', label: 'All Videos', icon: FiVideo },
    { value: 'trending', label: 'Trending', icon: FiTrendingUp },
    { value: 'uploaded', label: 'Uploaded', icon: FiVideo },
  ];

  return (
    <div className="min-h-screen bg-background">
      {/* Hero Section */}
      <div className="relative overflow-hidden bg-gradient-to-r from-primary/10 via-background to-accent/10 py-12 mb-8">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_30%_40%,rgba(224,146,188,0.1),transparent_50%)]"></div>
        <div className="relative max-w-7xl mx-auto px-4 text-center">
          <h1 className="text-4xl md:text-6xl font-bold gradient-text mb-4">
            Discover Amazing Content
          </h1>
          <p className="text-xl text-gray-300 max-w-2xl mx-auto">
            Explore trending videos and discover new creators from around the world
          </p>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4">
        {/* Controls Bar */}
        <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4 mb-8">
          {/* Filter Tabs */}
          <div className="flex flex-wrap gap-2">
            {filterOptions.map((option) => {
              const Icon = option.icon;
              return (
                <button
                  key={option.value}
                  onClick={() => setFilter(option.value)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium transition-all duration-200
                             ${filter === option.value 
                               ? 'bg-primary text-white shadow-glow' 
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
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-text'
              }`}
            >
              <FiGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewMode('list')}
              className={`p-2 rounded-md transition-all duration-200 ${
                viewMode === 'list' 
                  ? 'bg-primary text-white' 
                  : 'text-gray-400 hover:text-text'
              }`}
            >
              <FiList className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Videos Grid/List */}
        {filteredVideos.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 2xl:grid-cols-5 gap-6' 
              : 'space-y-4'
          }`}>
            {filteredVideos.map((video, index) => (
              <div 
                key={video._id} 
                className={`animate-fade-in ${
                  viewMode === 'list' ? 'flex gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-colors' : ''
                }`}
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <VideoCard {...video} viewMode={viewMode} />
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <FiVideo className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">No videos found</h3>
            <p className="text-gray-400">Try changing your filter or check back later for new content.</p>
          </div>
        )}

        {/* Load More Button */}
        {filteredVideos.length > 0 && (
          <div className="text-center mt-12 mb-8">
            <button className="btn-primary px-8 py-3 rounded-lg font-medium hover:shadow-lg transition-all duration-200">
              Load More Videos
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default Home;
