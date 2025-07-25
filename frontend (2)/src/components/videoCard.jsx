import { Avatar } from "@mui/material";
import { Link } from "react-router-dom";
import { FiPlay, FiClock, FiEye, FiExternalLink } from "react-icons/fi";
import { useState } from "react";
import { getImageUrl, getFallbackAvatar, handleImageError } from "../utils/imageUtils";

const VideoCard = ({ views, _id, title, thumbnail, owner, duration, createdAt, isExternal }) => {
  const [isHovered, setIsHovered] = useState(false);
  const [imageLoaded, setImageLoaded] = useState(false);

  // Check if this is an external video
  const isExternalVideo = isExternal || _id?.startsWith('yt-');

  // Format views count
  const formatViews = (count) => {
    if (count >= 1000000) {
      return `${(count / 1000000).toFixed(1)}M`;
    } else if (count >= 1000) {
      return `${(count / 1000).toFixed(1)}K`;
    }
    return count?.toString() || "0";
  };

  // Format duration
  const formatDuration = (seconds) => {
    if (!seconds) return "0:00";
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, '0')}`;
  };

  // Format time ago
  const formatTimeAgo = (date) => {
    if (!date) return "Recently";
    const now = new Date();
    const videoDate = new Date(date);
    const diffInSeconds = Math.floor((now - videoDate) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    if (diffInSeconds < 31536000) return `${Math.floor(diffInSeconds / 2592000)}mo ago`;
    return `${Math.floor(diffInSeconds / 31536000)}y ago`;
  };

  return (
    <div 
      className="group cursor-pointer transition-all duration-300 hover:scale-[1.02]"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      <Link to={`/video/${_id}`}>
        <div className="relative w-full aspect-video overflow-hidden rounded-xl bg-gray-900/50">
          {/* Thumbnail */}
          <img
            src={thumbnail?.url}
            alt={title}
            className={`w-full h-full object-cover transition-all duration-500 
                       ${imageLoaded ? 'opacity-100' : 'opacity-0'}
                       ${isHovered ? 'scale-110' : 'scale-100'}`}
            onLoad={() => setImageLoaded(true)}
          />
          
          {/* Loading skeleton */}
          {!imageLoaded && (
            <div className="absolute inset-0 bg-gradient-to-r from-gray-800 via-gray-700 to-gray-800 animate-pulse" />
          )}
          
          {/* Play overlay */}
          <div className={`absolute inset-0 bg-black/20 flex items-center justify-center
                          transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'}`}>
            <div className="bg-white/90 rounded-full p-3 transform transition-transform duration-300 hover:scale-110">
              {isExternalVideo ? (
                <FiExternalLink className="w-6 h-6 text-black" />
              ) : (
                <FiPlay className="w-6 h-6 text-black ml-1" />
              )}
            </div>
          </div>
          
          {/* External video badge */}
          {isExternalVideo && (
            <div className="absolute top-2 left-2 bg-red-500/90 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <FiExternalLink className="w-3 h-3" />
              YouTube
            </div>
          )}
          
          {/* Duration badge */}
          {duration && (
            <div className="absolute bottom-2 right-2 bg-black/80 text-white text-xs px-2 py-1 rounded-md flex items-center gap-1">
              <FiClock className="w-3 h-3" />
              {formatDuration(duration)}
            </div>
          )}
          
          {/* Gradient overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/30 via-transparent to-transparent" />
        </div>
      </Link>

      {/* Video Info */}
      <div className="flex mt-3 gap-x-3">
        {/* Channel Avatar */}
        <Link 
          to={`/channel/${owner?.userName}`}
          className="flex-shrink-0 transition-transform duration-200 hover:scale-110"
        >
          <Avatar
            alt={owner?.userName || "Channel"}
            src={getImageUrl(owner?.avatar) || getFallbackAvatar(owner?.userName)}
            sx={{ 
              width: 40, 
              height: 40,
              border: '2px solid transparent',
              bgcolor: '#e092bc',
              '&:hover': {
                border: '2px solid #e092bc'
              }
            }}
          />
          />
        </Link>

        {/* Video Details */}
        <div className="flex flex-col overflow-hidden flex-1 min-w-0">
          {/* Title */}
          <Link to={`/video/${_id}`}>
            <h3 className="text-text font-medium leading-snug line-clamp-2 text-sm sm:text-base
                         hover:text-primary transition-colors duration-200 cursor-pointer">
              {title}
            </h3>
          </Link>
          
          {/* Channel Name */}
          <Link
            to={`/channel/${owner?.userName}`}
            className="text-xs sm:text-sm text-gray-400 mt-1 hover:text-text 
                     transition-colors duration-200 truncate"
          >
            {owner?.userName}
          </Link>
          
          {/* Views and Time */}
          <div className="flex items-center gap-2 mt-1 text-xs text-gray-500">
            <div className="flex items-center gap-1">
              <FiEye className="w-3 h-3" />
              <span>{formatViews(views)} views</span>
            </div>
            <span>•</span>
            <span>{formatTimeAgo(createdAt)}</span>
          </div>
        </div>
      </div>
    </div>
  );
};

export default VideoCard;
