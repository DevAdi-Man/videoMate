import React, { useState } from "react";
import { useSelector } from "react-redux";
import { ChannelComponent, Loader, Modal, VideoCard } from "../components";
import getChannelQuery from "../hooks/react-query/query/channel/getChannelQuery";
import getMyVideoQuery from "../hooks/react-query/query/channel/getMyVideoQuery";
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
  FiList
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
    <div className="min-h-screen bg-background">
      {/* Channel Header */}
      <div className="relative">
        {/* Cover Image */}
        <div className="h-48 md:h-64 bg-gradient-to-r from-primary/20 to-accent/20 relative overflow-hidden">
          {channel?.coverImage && (
            <img 
              src={channel.coverImage} 
              alt="Cover" 
              className="w-full h-full object-cover"
            />
          )}
          <div className="absolute inset-0 bg-black/30"></div>
        </div>

        {/* Channel Info */}
        <div className="max-w-7xl mx-auto px-4 -mt-16 relative z-10">
          <div className="flex flex-col md:flex-row items-start md:items-end gap-6 mb-8">
            <div className="w-32 h-32 rounded-full border-4 border-background overflow-hidden bg-gray-800 flex-shrink-0">
              <img 
                src={userData.data?.avatar} 
                alt={userData.data?.userName}
                className="w-full h-full object-cover"
              />
            </div>
            
            <div className="flex-1 min-w-0">
              <h1 className="text-3xl md:text-4xl font-bold text-text mb-2">
                {userData.data?.fullname}
              </h1>
              <p className="text-gray-400 mb-4">@{userData.data?.userName}</p>
              <div className="flex flex-wrap gap-4 text-sm text-gray-300">
                <span>{formatNumber(channel?.subscriberCount)} subscribers</span>
                <span>•</span>
                <span>{videos.length} videos</span>
              </div>
            </div>

            <div className="flex gap-3">
              <Modal />
              <button className="btn-secondary flex items-center gap-2">
                <FiEdit3 className="w-4 h-4" />
                Edit Channel
              </button>
            </div>
          </div>
        </div>
      </div>

      <div className="max-w-7xl mx-auto px-4 py-8">
        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-8">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="card text-center">
                <Icon className={`w-8 h-8 mx-auto mb-3 ${stat.color}`} />
                <div className="text-2xl font-bold text-text mb-1">
                  {formatNumber(stat.value)}
                </div>
                <div className="text-sm text-gray-400">{stat.label}</div>
              </div>
            );
          })}
        </div>

        {/* Tabs */}
        <div className="flex items-center justify-between mb-8">
          <div className="flex gap-1 bg-gray-800/50 rounded-lg p-1">
            {tabs.map((tab) => {
              const Icon = tab.icon;
              return (
                <button
                  key={tab.id}
                  onClick={() => setSelectedTab(tab.id)}
                  className={`flex items-center gap-2 px-4 py-2 rounded-md font-medium transition-all duration-200 ${
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
          <div className="card text-center py-16">
            <FiTrendingUp className="w-16 h-16 mx-auto mb-4 text-gray-400" />
            <h3 className="text-xl font-semibold text-text mb-2">Analytics Coming Soon</h3>
            <p className="text-gray-400">Detailed analytics and insights will be available here</p>
          </div>
        )}
      </div>
    </div>
  );
};

export default MyContent;
