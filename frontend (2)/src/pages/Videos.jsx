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
  FiUser,
  FiFlag,
  FiBookmark,
  FiCopy
} from "react-icons/fi";
import { Button, CommentSection, Loader } from "../components";
import videoQuery from "../hooks/react-query/query/videos/videoQuery.jsx";
import toggleSubscribeQuery from "../hooks/react-query/mutation/subscribe/toggleSubscribeQuery.jsx";
import likeToggleQuery from "../hooks/react-query/mutation/Like/likeToggleQuery.jsx";
import { Avatar } from "@mui/material";
import LikeAnimation from "../components/LikeAnimation.jsx";
import { useToast } from "../components/Toast.jsx";

const Videos = () => {
  const { slug } = useParams();
  const { data: video, isLoading } = videoQuery(slug);
  const [showFullDescription, setShowFullDescription] = useState(false);
  const { showToast, ToastContainer } = useToast();

  const { mutate: subscribe, isPending: subscribePending } = toggleSubscribeQuery(
    video?.owner?._id,
    video?._id
  );
  const { mutate: Like, isPending: likePending } = likeToggleQuery(video?._id);

  // Enhanced like handler with toast (single toast only)
  const handleLike = () => {
    const wasLiked = video?.isLiked;
    Like();
    
    // Show toast only once with appropriate message
    setTimeout(() => {
      showToast(
        wasLiked ? 'Removed from liked videos' : 'Added to liked videos',
        'like',
        { 
          icon: <FiThumbsUp className="w-5 h-5" />,
          duration: 2000 
        }
      );
    }, 100); // Small delay to ensure state update
  };

  // Enhanced share handler
  const handleShare = async () => {
    try {
      if (navigator.share) {
        await navigator.share({
          title: video?.title,
          text: video?.description,
          url: window.location.href
        });
        showToast('Shared successfully!', 'share');
      } else {
        await navigator.clipboard.writeText(window.location.href);
        showToast('Link copied to clipboard!', 'share');
      }
    } catch (error) {
      showToast('Failed to share', 'error');
    }
  };

  // Enhanced download handler
  const handleDownload = () => {
    try {
      const link = document.createElement('a');
      link.href = video?.videoFile?.url;
      link.download = video?.title || 'video';
      link.click();
      showToast('Download started!', 'download');
    } catch (error) {
      showToast('Download failed', 'error');
    }
  };

  if (isLoading) return <Loader text="Loading video..." />;

  // Check if this is an external video (from Rapid API)
  const isExternalVideo = slug?.startsWith('yt-');
  
  // If external video, show message and redirect to YouTube
  if (isExternalVideo) {
    const videoId = slug?.replace('yt-', '');
    const youtubeUrl = `https://www.youtube.com/watch?v=${videoId}`;
    
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="max-w-2xl mx-auto px-4 text-center">
          <div className="bg-gray-900/50 rounded-2xl p-8 border border-gray-800/50">
            <div className="w-24 h-24 mx-auto mb-6 bg-red-500/20 rounded-full flex items-center justify-center">
              <FiPlay className="w-12 h-12 text-red-400" />
            </div>
            
            <h2 className="text-2xl font-bold text-text mb-4">
              YouTube Trending Video
            </h2>
            
            <p className="text-gray-400 mb-6 leading-relaxed">
              This is a trending video from YouTube. Click below to watch it on YouTube, 
              or go back to explore videos uploaded by our community.
            </p>
            
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <a
                href={youtubeUrl}
                target="_blank"
                rel="noopener noreferrer"
                className="btn-primary px-6 py-3 rounded-lg font-medium flex items-center justify-center gap-2"
              >
                <FiPlay className="w-5 h-5" />
                Watch on YouTube
              </a>
              
              <Link
                to="/"
                className="btn-secondary px-6 py-3 rounded-lg font-medium"
              >
                Back to Home
              </Link>
            </div>
            
            <div className="mt-8 p-4 bg-blue-500/10 border border-blue-500/20 rounded-lg">
              <h3 className="text-blue-400 font-semibold mb-2">Want to watch videos directly?</h3>
              <p className="text-sm text-gray-400 mb-3">
                Upload your own videos to watch them directly on our platform with full functionality!
              </p>
              <Link
                to="/content"
                className="inline-flex items-center gap-2 text-blue-400 hover:text-blue-300 text-sm font-medium"
              >
                <FiPlay className="w-4 h-4" />
                Upload Your Video
              </Link>
            </div>
          </div>
        </div>
      </div>
    );
  }

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
              <div className="flex flex-wrap items-center justify-between gap-4 py-6 border-y border-gray-800/50">
                {/* Like/Dislike Section */}
                <div className="flex items-center gap-1 bg-gray-900/50 rounded-full p-1">
                  <LikeAnimation
                    isLiked={video?.isLiked}
                    onClick={handleLike}
                    count={formatViews(video?.likeCount)}
                    type="thumbs"
                  />
                  
                  <div className="w-px h-6 bg-gray-700"></div>
                  
                  <button className="flex items-center gap-2 px-4 py-2.5 rounded-full font-medium text-gray-300 hover:text-white hover:bg-gray-800 transition-all duration-300">
                    <FiThumbsDown className="w-5 h-5" />
                  </button>
                </div>

                {/* Other Actions */}
                <div className="flex items-center gap-2">
                  {/* Share Button */}
                  <button 
                    onClick={handleShare}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/50 hover:bg-gray-800 rounded-full font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <FiShare2 className="w-5 h-5" />
                    <span className="hidden sm:inline">Share</span>
                  </button>
                  
                  {/* Download Button */}
                  <button 
                    onClick={handleDownload}
                    className="flex items-center gap-2 px-4 py-2.5 bg-gray-900/50 hover:bg-gray-800 rounded-full font-medium text-gray-300 hover:text-white transition-all duration-300 hover:scale-105"
                  >
                    <FiDownload className="w-5 h-5" />
                    <span className="hidden sm:inline">Download</span>
                  </button>
                  
                  {/* More Options */}
                  <div className="relative group">
                    <button className="p-2.5 bg-gray-900/50 hover:bg-gray-800 rounded-full text-gray-300 hover:text-white transition-all duration-300 hover:scale-105">
                      <FiMoreHorizontal className="w-5 h-5" />
                    </button>
                    
                    {/* Dropdown Menu */}
                    <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[200px] opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all duration-200 animate-scale-in">
                      <div className="py-2">
                        <button 
                          onClick={() => showToast('Video reported', 'info')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-text flex items-center gap-3 transition-colors duration-200"
                        >
                          <FiFlag className="w-4 h-4" />
                          Report video
                        </button>
                        <button 
                          onClick={() => showToast('Saved to Watch Later', 'success')}
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-text flex items-center gap-3 transition-colors duration-200"
                        >
                          <FiBookmark className="w-4 h-4" />
                          Save to playlist
                        </button>
                        <button 
                          onClick={handleShare}
                          className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-text flex items-center gap-3 transition-colors duration-200"
                        >
                          <FiCopy className="w-4 h-4" />
                          Copy link
                        </button>
                      </div>
                    </div>
                  </div>
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
            <div className="sticky">
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
      
      {/* Toast Container */}
      <ToastContainer />
    </div>
  );
};

export default Videos;
