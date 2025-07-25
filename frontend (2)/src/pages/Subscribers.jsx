import React, { useState } from "react";
import { useSelector } from "react-redux";
import { Link } from "react-router-dom";
import { useMutation } from "@tanstack/react-query";
import { 
  FiUsers, 
  FiUserPlus, 
  FiUserMinus, 
  FiSearch,
  FiFilter,
  FiGrid,
  FiList,
  FiUser
} from "react-icons/fi";
import { Loader, Button } from "../components";
import getSubscribedChannelQuery from "../hooks/react-query/query/subscribe/getSubscribedChannelQuery";
import { queryClient } from "../utils/query-client";
import videoService from "../services/VideoService";
import { getSafeImageUrl, getFallbackAvatar, handleImageError } from "../utils/imageUtils";

const Subscribers = () => {
  const userData = useSelector((state) => state.auth.userData);
  const [searchTerm, setSearchTerm] = useState("");
  const [viewMode, setViewMode] = useState('grid');
  const [sortBy, setSortBy] = useState('recent');

  const userId = userData.data?._id;
  const { data: subscribedChannels, isLoading } = getSubscribedChannelQuery(userId);

  // Subscribe/Unsubscribe mutation
  const subscribeMutation = useMutation({
    mutationFn: (channelId) => videoService.toggleSubscription(channelId),
    onSuccess: () => {
      queryClient.invalidateQueries(['subscribedChannels']);
      queryClient.invalidateQueries(['channel']);
    },
  });

  const handleSubscribeToggle = (channelId, isSubscribed) => {
    subscribeMutation.mutate(channelId);
  };

  // Filter and sort channels
  const filteredChannels = subscribedChannels?.filter(channel =>
    channel?.channelData?.userName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    channel?.channelData?.fullname?.toLowerCase().includes(searchTerm.toLowerCase())
  ) || [];

  const sortedChannels = [...filteredChannels].sort((a, b) => {
    switch (sortBy) {
      case 'name':
        return (a?.channelData?.userName || '').localeCompare(b?.channelData?.userName || '');
      case 'subscribers':
        return (b?.channelData?.subscriberCount || 0) - (a?.channelData?.subscriberCount || 0);
      case 'recent':
      default:
        return new Date(b?.createdAt || 0) - new Date(a?.createdAt || 0);
    }
  });

  const formatSubscriberCount = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || "0";
  };

  if (isLoading) {
    return <Loader text="Loading your subscriptions..." />;
  }

  return (
    <div className="min-h-screen bg-background">
      {/* Header Section */}
      <div className="bg-gradient-to-r from-primary/10 to-accent/10 border-b border-gray-800/50">
        <div className="max-w-7xl mx-auto px-4 py-8">
          <div className="flex items-center gap-4 mb-6">
            <div className="w-16 h-16 bg-primary/20 rounded-full flex items-center justify-center">
              <FiUsers className="w-8 h-8 text-primary" />
            </div>
            <div>
              <h1 className="text-3xl font-bold text-text mb-2">Your Subscriptions</h1>
              <p className="text-gray-400">
                {subscribedChannels?.length || 0} channels you're following
              </p>
            </div>
          </div>

          {/* Search and Filters */}
          <div className="flex flex-col sm:flex-row gap-4 items-stretch sm:items-center justify-between">
            {/* Search Bar */}
            <div className="relative flex-1 max-w-md">
              <FiSearch className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
              <input
                type="text"
                placeholder="Search subscriptions..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
                className="w-full pl-10 pr-4 py-2.5 bg-gray-900/50 border border-gray-700 rounded-lg text-text placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200"
              />
            </div>

            {/* Controls */}
            <div className="flex items-center gap-3">
              {/* Sort Dropdown */}
              <div className="relative">
                <select
                  value={sortBy}
                  onChange={(e) => setSortBy(e.target.value)}
                  className="appearance-none bg-gray-800/50 border border-gray-700 rounded-lg px-4 py-2.5 text-text focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary transition-all duration-200 pr-10"
                >
                  <option value="recent">Recently Subscribed</option>
                  <option value="name">Name (A-Z)</option>
                  <option value="subscribers">Most Subscribers</option>
                </select>
                <FiFilter className="absolute right-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4 pointer-events-none" />
              </div>

              {/* View Mode Toggle */}
              <div className="flex items-center gap-1 bg-gray-800/50 rounded-lg p-1">
                <button
                  onClick={() => setViewMode('grid')}
                  className={`p-2 rounded-md transition-all duration-200 ${
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
                  className={`p-2 rounded-md transition-all duration-200 ${
                    viewMode === 'list' 
                      ? 'bg-primary text-white' 
                      : 'text-gray-400 hover:text-text'
                  }`}
                  title="List View"
                >
                  <FiList className="w-4 h-4" />
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Content Section */}
      <div className="max-w-7xl mx-auto px-4 py-8">
        {sortedChannels.length > 0 ? (
          <div className={`${
            viewMode === 'grid' 
              ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6' 
              : 'space-y-4'
          }`}>
            {sortedChannels.map((subscription, index) => {
              const channel = subscription?.channelData;
              if (!channel) return null;

              return (
                <div 
                  key={channel._id || index}
                  className={`group animate-fade-in ${
                    viewMode === 'grid' 
                      ? 'card hover:shadow-xl hover:scale-105 transition-all duration-300' 
                      : 'card flex items-center gap-6 hover:bg-gray-800/30'
                  }`}
                  style={{ animationDelay: `${index * 0.1}s` }}
                >
                  {viewMode === 'grid' ? (
                    // Grid View
                    <div className="text-center">
                      <Link to={`/channel/${channel.userName}`} className="block">
                        <div className="relative mb-4">
                          <div className="w-24 h-24 mx-auto rounded-full overflow-hidden bg-gray-800 border-4 border-gray-700 group-hover:border-primary/50 transition-colors duration-300">
                            <img 
                              src={getSafeImageUrl(channel.avatar, getFallbackAvatar(channel.userName))} 
                              alt={channel.userName}
                              className="w-full h-full object-cover"
                              onError={(e) => handleImageError(e, getFallbackAvatar(channel.userName))}
                            />
                            <div 
                              className="image-fallback w-full h-full flex items-center justify-center bg-gray-700"
                              style={{ display: 'none' }}
                            >
                              <FiUser className="w-12 h-12 text-gray-400" />
                            </div>
                          </div>
                          {/* Online indicator (if available) */}
                          <div className="absolute bottom-2 right-1/2 transform translate-x-1/2 translate-y-1/2 w-4 h-4 bg-green-500 rounded-full border-2 border-background opacity-0 group-hover:opacity-100 transition-opacity duration-300"></div>
                        </div>
                        
                        <h3 className="font-semibold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
                          {channel.fullname || channel.userName}
                        </h3>
                        <p className="text-sm text-gray-400 mb-1">@{channel.userName}</p>
                        <p className="text-xs text-gray-500 mb-4">
                          {formatSubscriberCount(channel.subscriberCount)} subscribers
                        </p>
                      </Link>
                      
                      <button
                        onClick={() => handleSubscribeToggle(channel._id, true)}
                        disabled={subscribeMutation.isLoading}
                        className="btn-secondary w-full flex items-center justify-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-200"
                      >
                        <FiUserMinus className="w-4 h-4" />
                        {subscribeMutation.isLoading ? 'Updating...' : 'Unsubscribe'}
                      </button>
                    </div>
                  ) : (
                    // List View
                    <>
                      <Link to={`/channel/${channel.userName}`} className="flex items-center gap-4 flex-1 min-w-0">
                        <div className="w-16 h-16 rounded-full overflow-hidden bg-gray-800 border-2 border-gray-700 flex-shrink-0">
                          <img 
                            src={getSafeImageUrl(channel.avatar, getFallbackAvatar(channel.userName))} 
                            alt={channel.userName}
                            className="w-full h-full object-cover"
                            onError={(e) => handleImageError(e, getFallbackAvatar(channel.userName))}
                          />
                          <div 
                            className="image-fallback w-full h-full flex items-center justify-center bg-gray-700"
                            style={{ display: 'none' }}
                          >
                            <FiUser className="w-8 h-8 text-gray-400" />
                          </div>
                        </div>
                        
                        <div className="flex-1 min-w-0">
                          <h3 className="font-semibold text-text mb-1 line-clamp-1 group-hover:text-primary transition-colors duration-200">
                            {channel.fullname || channel.userName}
                          </h3>
                          <p className="text-sm text-gray-400 mb-1">@{channel.userName}</p>
                          <p className="text-xs text-gray-500">
                            {formatSubscriberCount(channel.subscriberCount)} subscribers
                          </p>
                        </div>
                      </Link>
                      
                      <button
                        onClick={() => handleSubscribeToggle(channel._id, true)}
                        disabled={subscribeMutation.isLoading}
                        className="btn-secondary flex items-center gap-2 hover:bg-red-600 hover:text-white transition-all duration-200 flex-shrink-0"
                      >
                        <FiUserMinus className="w-4 h-4" />
                        {subscribeMutation.isLoading ? 'Updating...' : 'Unsubscribe'}
                      </button>
                    </>
                  )}
                </div>
              );
            })}
          </div>
        ) : (
          // Empty State
          <div className="text-center py-16">
            <div className="w-24 h-24 mx-auto mb-6 bg-gray-800/50 rounded-full flex items-center justify-center">
              <FiUsers className="w-12 h-12 text-gray-400" />
            </div>
            <h3 className="text-xl font-semibold text-text mb-2">
              {searchTerm ? 'No channels found' : 'No subscriptions yet'}
            </h3>
            <p className="text-gray-400 mb-6 max-w-md mx-auto">
              {searchTerm 
                ? `No channels match "${searchTerm}". Try a different search term.`
                : 'Start exploring and subscribe to channels you love to see them here.'
              }
            </p>
            {!searchTerm && (
              <Link to="/" className="btn-primary inline-flex items-center gap-2">
                <FiUserPlus className="w-4 h-4" />
                Discover Channels
              </Link>
            )}
          </div>
        )}
      </div>
    </div>
  );
};

export default Subscribers;
