import React, { useState } from "react";
import { Link, useParams } from "react-router-dom";
import { 
  FiThumbsUp, 
  FiThumbsDown, 
  FiShare2, 
  FiDownload, 
  FiMoreHorizontal,
  FiPlay,
  FiEye,
  FiCalendar,
  FiUser
} from "react-icons/fi";
import { Button, CommentSection, Loader } from "../components";
import videoQuery from "../hooks/react-query/query/videos/videoQuery.jsx";
import toggleSubscribeQuery from "../hooks/react-query/mutation/subscribe/toggleSubscribeQuery.jsx";
import likeToggleQuery from "../hooks/react-query/mutation/Like/likeToggleQuery.jsx";
import { Avatar } from "@mui/material";

const Videos = () => {
  const { slug } = useParams();
  const { data: video, isLoading } = videoQuery(slug);
  const [showFullDescription, setShowFullDescription] = useState(false);

  const { mutate: subscribe, isPending: subscribePending } = toggleSubscribeQuery(
    video?.owner?._id,
    video?._id
  );
  const { mutate: Like, isPending: likePending } = likeToggleQuery(video?._id);

  if (isLoading) return <Loader text="Loading video..." />;

  const formatViews = (count) => {
    if (count >= 1000000) return `${(count / 1000000).toFixed(1)}M`;
    if (count >= 1000) return `${(count / 1000).toFixed(1)}K`;
    return count?.toString() || "0";
  };

  const formatDate = (date) => {
    if (!date) return "Recently";
    return new Date(date).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  return (
    <div className="min-h-screen bg-background">
      <div className="max-w-7xl mx-auto px-4 py-6">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-8">
          {/* Main Video Section */}
          <div className="xl:col-span-2 space-y-6">
            {/* Video Player */}
            <div className="relative bg-black rounded-2xl overflow-hidden shadow-2xl">
              <video
                src={video?.videoFile?.url}
                controls
                autoPlay
                className="w-full aspect-video object-contain"
                poster={video?.thumbnail?.url}
              />
            </div>

            {/* Video Info */}
            <div className="space-y-4">
              {/* Title and Stats */}
              <div>
                <h1 className="text-2xl md:text-3xl font-bold text-text mb-3 leading-tight">
                  {video?.title}
                </h1>
                <div className="flex items-center gap-4 text-sm text-gray-400">
                  <div className="flex items-center gap-1">
                    <FiEye className="w-4 h-4" />
                    <span>{formatViews(video?.views)} views</span>
                  </div>
                  <div className="flex items-center gap-1">
                    <FiCalendar className="w-4 h-4" />
                    <span>{formatDate(video?.createdAt)}</span>
                  </div>
                </div>
              </div>

              {/* Action Buttons */}
              <div className="flex flex-wrap items-center justify-between gap-4 py-4 border-y border-gray-800/50">
                <div className="flex items-center gap-2">
                  <Button
                    onClick={() => Like()}
                    loading={likePending}
                    variant="ghost"
                    className="flex items-center gap-2 px-4 py-2"
                  >
                    <FiThumbsUp className="w-5 h-5" />
                    <span>{formatViews(video?.likeCount)}</span>
                  </Button>
                  
                  <Button variant="ghost" className="flex items-center gap-2 px-4 py-2">
                    <FiThumbsDown className="w-5 h-5" />
                  </Button>
                </div>

                <div className="flex items-center gap-2">
                  <Button variant="ghost" className="flex items-center gap-2 px-4 py-2">
                    <FiShare2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </Button>
                  
                  <Button variant="ghost" className="flex items-center gap-2 px-4 py-2">
                    <FiDownload className="w-5 h-5" />
                    <span className="hidden sm:inline">Download</span>
                  </Button>
                  
                  <Button variant="ghost" className="p-2">
                    <FiMoreHorizontal className="w-5 h-5" />
                  </Button>
                </div>
              </div>

              {/* Channel Info */}
              <div className="flex items-start justify-between gap-4 p-6 bg-gray-900/30 rounded-2xl">
                <div className="flex items-start gap-4 flex-1">
                  <Link to={`/channel/${video?.owner?._id}`}>
                    <Avatar
                      src={video?.owner?.avatar}
                      alt={video?.owner?.userName}
                      sx={{ width: 56, height: 56 }}
                      className="hover:scale-105 transition-transform duration-200"
                    />
                  </Link>
                  
                  <div className="flex-1 min-w-0">
                    <Link 
                      to={`/channel/${video?.owner?._id}`}
                      className="block hover:text-primary transition-colors duration-200"
                    >
                      <h3 className="font-semibold text-text text-lg">
                        {video?.owner?.userName}
                      </h3>
                    </Link>
                    <p className="text-sm text-gray-400 mb-3">
                      {formatViews(video?.owner?.subscriberCount)} subscribers
                    </p>
                    
                    {/* Description */}
                    <div className="text-sm text-gray-300">
                      <p className={`${showFullDescription ? '' : 'line-clamp-3'}`}>
                        {video?.description}
                      </p>
                      {video?.description && video.description.length > 150 && (
                        <button
                          onClick={() => setShowFullDescription(!showFullDescription)}
                          className="text-primary hover:text-accent mt-2 font-medium"
                        >
                          {showFullDescription ? 'Show less' : 'Show more'}
                        </button>
                      )}
                    </div>
                  </div>
                </div>

                <Button
                  onClick={() => subscribe()}
                  loading={subscribePending}
                  variant={video?.owner?.isSubscribed ? "secondary" : "primary"}
                  className="flex-shrink-0"
                >
                  {video?.owner?.isSubscribed ? "Unsubscribe" : "Subscribe"}
                </Button>
              </div>
            </div>

            {/* Comments Section */}
            <div className="bg-gray-900/30 rounded-2xl p-6">
              <CommentSection slug={slug} />
            </div>
          </div>

          {/* Sidebar - Recommended Videos */}
          <div className="space-y-6">
            <div className="sticky top-24">
              <h2 className="text-xl font-semibold text-text mb-6 flex items-center gap-2">
                <FiPlay className="w-5 h-5 text-primary" />
                Up Next
              </h2>

              <div className="space-y-4">
                {/* Placeholder for recommended videos */}
                {[...Array(8)].map((_, i) => (
                  <div key={i} className="flex gap-3 p-3 rounded-xl hover:bg-gray-900/30 transition-colors duration-200 cursor-pointer group">
                    <div className="relative flex-shrink-0">
                      <div className="w-40 h-24 bg-gray-700 rounded-lg shimmer"></div>
                      <div className="absolute inset-0 flex items-center justify-center opacity-0 group-hover:opacity-100 transition-opacity duration-200">
                        <div className="bg-black/80 rounded-full p-2">
                          <FiPlay className="w-4 h-4 text-white ml-0.5" />
                        </div>
                      </div>
                    </div>
                    
                    <div className="flex-1 min-w-0 space-y-1">
                      <h4 className="font-medium text-text text-sm line-clamp-2 group-hover:text-primary transition-colors duration-200">
                        Sample Video Title {i + 1} - This is a longer title to test truncation
                      </h4>
                      <p className="text-xs text-gray-400 hover:text-gray-300 transition-colors duration-200">
                        Channel Name {i + 1}
                      </p>
                      <div className="flex items-center gap-2 text-xs text-gray-500">
                        <span>{Math.floor(Math.random() * 100)}K views</span>
                        <span>•</span>
                        <span>{Math.floor(Math.random() * 7) + 1} days ago</span>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default Videos;
