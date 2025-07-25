import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChannelComponent, Loader, Modal, VideoCard } from "../components";
import getChannelQuery from "../hooks/react-query/query/channel/getChannelQuery";
import getMyVideoQuery from "../hooks/react-query/query/channel/getMyVideoQuery";
import { getImageUrl, getFallbackAvatar, getPlaceholderImage, handleImageError, getSafeImageUrl } from "../utils/imageUtils";
import { 
  FiVideo, 
  FiPlus, 
  FiEdit3, 
  FiTrash2, 
  FiEye, 
  FiHeart,
  FiMessageCircle,
  FiTrendingUp,
  FiGrid,
  FiList,
  FiImage,
  FiUser
} from "react-icons/fi";

const MyContent = () => {
  const userData = useSelector((state) => state.auth.userData);
  const authStatus = useSelector((state) => state.auth.status);
  const [viewMode, setViewMode] = useState('grid');
  const [selectedTab, setSelectedTab] = useState('videos');

  const username = userData.data?.userName;
  const userId = userData.data?._id;
  
  const { data: channel, isLoading: channelLoading } = getChannelQuery(username);
  const { isLoading: videosLoading, data: myData } = getMyVideoQuery(userId);

  if (channelLoading || videosLoading) {
    return <Loader text="Loading your content..." />;
  }

  const videos = myData?.docs || [];

  const stats = [
    {
      label: "Total Videos",
      value: videos.length,
      icon: FiVideo,
      color: "text-blue-400"
    },
    {
      label: "Total Views",
      value: videos.reduce((acc, video) => acc + (video.views || 0), 0),
      icon: FiEye,
      color: "text-green-400"
    },
    {
      label: "Total Likes",
      value: videos.reduce((acc, video) => acc + (video.likeCount || 0), 0),
      icon: FiHeart,
      color: "text-red-400"
    },
    {
      label: "Subscribers",
      value: channel?.subscriberCount || 0,
      icon: FiTrendingUp,
      color: "text-purple-400"
    }
  ];

  const formatNumber = (num) => {
    if (num >= 1000000) return `${(num / 1000000).toFixed(1)}M`;
    if (num >= 1000) return `${(num / 1000).toFixed(1)}K`;
    return num?.toString() || "0";
  };

  const tabs = [
    { id: 'videos', label: 'Videos', icon: FiVideo },
    { id: 'analytics', label: 'Analytics', icon: FiTrendingUp },
  ];

  return (
    <div className="min-h-screen bg-background w-full">
      {/* Channel Header */}
      <div className="relative w-full">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-accent/20 relative overflow-hidden w-full">
          <img 
            src={getSafeImageUrl(channel?.coverImage, getPlaceholderImage(800, 400))} 
            alt="Cover" 
            className="w-full h-full object-cover"
            onError={(e) => handleImageError(e, getPlaceholderImage(800, 400))}
          />
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Channel Info */}
        <div className="max-w-7xl mx-auto px-4 -mt-12 sm:-mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-4 sm:gap-6 mb-6 sm:mb-8">
            <div className="w-24 h-24 sm:w-32 sm:h-32 rounded-full border-4 border-background overflow-hidden bg-gray-800 flex-shrink-0">
              <img 
                src={getSafeImageUrl(userData.data?.avatar, getFallbackAvatar(userData.data?.userName))} 
                alt={userData.data?.userName}
                className="w-full h-full object-cover"
                onError={(e) => handleImageError(e, getFallbackAvatar(userData.data?.userName))}
              />
              <div 
                className="image-fallback w-full h-full flex items-center justify-center bg-gray-700"
                style={{ display: 'none' }}
              >
                <FiUser className="w-12 h-12 sm:w-16 sm:h-16 text-gray-400" />
              </div>
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-2xl sm:text-3xl md:text-4xl font-bold text-text mb-2">
                {userData.data?.fullname}
              </h1>
              <p className="text-gray-400 mb-3 sm:mb-4 text-sm sm:text-base">@{userData.data?.userName}</p>
              <div className="flex flex-wrap gap-2 sm:gap-4 text-xs sm:text-sm text-gray-300">
                <span>{formatNumber(channel?.subscriberCount)} subscribers</span>
                <span>•</span>
                <span>{videos.length} videos</span>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2 sm:gap-3 w-full md:w-auto">
              <Modal />
              <button className="btn-secondary flex items-center justify-center gap-2 text-sm sm:text-base px-3 sm:px-4 py-2">
                <FiEdit3 className="w-4 h-4" />
                <span className="hidden sm:inline">Edit Channel</span>
                <span className="sm:hidden">Edit</span>
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-6 sm:py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-4 mb-6 sm:mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card text-center p-3 sm:p-4 lg:p-6">
                <Icon className={`w-6 h-6 sm:w-8 sm:h-8 mx-auto mb-2 sm:mb-3 ${stat.color}`} />
                <div className="text-lg sm:text-2xl font-bold text-text mb-1">
                  {formatNumber(stat.value)}
                </div>
                <div className="text-xs sm:text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center justify-between gap-4 mb-8">
          <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1 overflow-x-auto">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-md font-medium transition-all duration-200 whitespace-nowrap min-w-fit ${
                    selectedTab === tab.id
                      ? 'bg-primary text-white'
                      : 'text-gray-400 hover:text-text hover:bg-gray-700/50'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  {tab.label}
                </button>
              );
            })}
          </div>

          {selectedTab === 'videos' && (
            <div className="flex items-center gap-2 bg-gray-800/50 rounded-lg p-1 self-end sm:self-auto">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2.5 rounded-md transition-all duration-200 ${
                  viewMode === 'grid' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-text'
                }`}
                title="Grid View"
              >
                <FiGrid className="w-4 h-4" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2.5 rounded-md transition-all duration-200 ${
                  viewMode === 'list' 
                    ? 'bg-primary text-white' 
                    : 'text-gray-400 hover:text-text'
                }`}
                title="List View"
              >
                <FiList className="w-4 h-4" />
              </button>
            </div>
          )}
        </div>

        {/* Content */}
        {selectedTab === 'videos' && (
          <div>
            {videos.length > 0 ? (
              <div className={`${
                viewMode === 'grid' 
                  ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
                  : 'space-y-4'
              }`}>
                {videos.map((video, index) => (
                  <div 
                    key={video._id} 
                    className={`group relative animate-fade-in ${
                      viewMode === 'list' ? 'flex gap-4 p-4 bg-gray-900/30 rounded-xl hover:bg-gray-900/50 transition-colors' : ''
                    }`}
                    style={{ animationDelay: `${index * 0.1}s` }}
                  >
                    <VideoCard {...video} viewMode={viewMode} />
                    
                    {/* Action Buttons */}
                    <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                      <div className="flex gap-1">
                        <button className="p-2 bg-black/80 rounded-lg hover:bg-black/90 transition-colors">
                          <FiEdit3 className="w-4 h-4 text-white" />
                        </button>
                        <button className="p-2 bg-red-600/80 rounded-lg hover:bg-red-600/90 transition-colors">
                          <FiTrash2 className="w-4 h-4 text-white" />
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="text-center py-16">
                <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
                  <FiVideo className="w-12 h-12 text-gray-400" />
                </div>
                <h3 className="text-xl font-semibold text-text mb-2">No videos yet</h3>
                <p className="text-gray-400 mb-6">Start creating content to build your channel</p>
                <Modal />
              </div>
            )}
          </div>
        )}

        {selectedTab === 'analytics' && (
          <div className="w-full max-w-full">
            {/* Top Performing Videos */}
            <div className="card mb-6">
              <h3 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <FiTrendingUp className="w-5 h-5 text-primary" />
                Top Performing Videos
              </h3>
              {videos.length > 0 ? (
                <div className="space-y-4">
                  {videos
                    .sort((a, b) => (b.views || 0) - (a.views || 0))
                    .slice(0, 5)
                    .map((video, index) => (
                      <div key={video._id} className="flex items-center gap-4 p-4 bg-gray-800/30 rounded-lg hover:bg-gray-800/50 transition-colors">
                        <span className="text-xl font-bold text-primary min-w-[32px] flex-shrink-0">#{index + 1}</span>
                        <div className="w-20 h-14 bg-gray-700 rounded overflow-hidden flex-shrink-0">
                          <img 
                            src={getSafeImageUrl(video.thumbnail, getPlaceholderImage(160, 90))} 
                            alt={video.title}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, getPlaceholderImage(160, 90))}
                          />
                        </div>
                        
                        <div className="flex-1 min-w-0 overflow-hidden">
                          <h4 className="font-medium text-text line-clamp-2 mb-2">
                            {video.title}
                          </h4>
                          <div className="flex gap-4 text-sm text-gray-400">
                            <span className="flex items-center gap-1">
                              <FiEye className="w-4 h-4" />
                              {formatNumber(video.views || 0)} views
                            </span>
                            <span className="flex items-center gap-1">
                              <FiHeart className="w-4 h-4" />
                              {formatNumber(video.likeCount || 0)} likes
                            </span>
                          </div>
                        </div>
                      </div>
                    ))}
                </div>
              ) : (
                <div className="text-center py-12">
                  <FiVideo className="w-16 h-16 mx-auto mb-4 text-gray-400" />
                  <p className="text-gray-400">No videos to analyze yet</p>
                </div>
              )}
            </div>

            {/* Performance Insights */}
            <div className="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-6">
              <div className="card">
                <h4 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <FiEye className="w-5 h-5 text-blue-400" />
                  View Performance
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average views per video</span>
                    <span className="text-text font-medium">
                      {videos.length > 0 ? formatNumber(Math.round(videos.reduce((acc, video) => acc + (video.views || 0), 0) / videos.length)) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Most viewed video</span>
                    <span className="text-text font-medium">
                      {videos.length > 0 ? formatNumber(Math.max(...videos.map(v => v.views || 0))) : '0'}
                    </span>
                  </div>
                </div>
              </div>

              <div className="card">
                <h4 className="text-lg font-semibold text-text mb-4 flex items-center gap-2">
                  <FiHeart className="w-5 h-5 text-red-400" />
                  Engagement
                </h4>
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Average likes per video</span>
                    <span className="text-text font-medium">
                      {videos.length > 0 ? formatNumber(Math.round(videos.reduce((acc, video) => acc + (video.likeCount || 0), 0) / videos.length)) : '0'}
                    </span>
                  </div>
                  <div className="flex justify-between items-center">
                    <span className="text-gray-400">Most liked video</span>
                    <span className="text-text font-medium">
                      {videos.length > 0 ? formatNumber(Math.max(...videos.map(v => v.likeCount || 0))) : '0'}
                    </span>
                  </div>
                </div>
              </div>
            </div>

            {/* Coming Soon Section */}
            <div className="card text-center py-16">
              <FiTrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
              <h3 className="text-xl font-semibold text-text mb-2">Advanced Analytics Coming Soon</h3>
              <p className="text-gray-400 max-w-md mx-auto">
                Detailed analytics including watch time, audience retention, and revenue insights will be available here
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContent;
