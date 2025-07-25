import React, { useState, useRef, useEffect } from "react";
import { 
  FiMessageCircle, 
  FiThumbsUp, 
  FiThumbsDown, 
  FiMoreVertical,
  FiEdit3,
  FiTrash2,
  FiSend,
  FiX,
  FiHeart,
  FiUser,
  FiClock,
  FiPin,
  FiFlag
} from "react-icons/fi";
import { Button } from "../index.js";
import createCommentQuery from "../../hooks/react-query/mutation/comment/createCommentQuery.jsx";
import deleteCommentQuery from "../../hooks/react-query/mutation/comment/deleteCommentQuery.jsx";
import getVideoCommentQuery from "../../hooks/react-query/query/comment/getVideoCommentQuery.jsx";
import updateCommentQuery from "../../hooks/react-query/mutation/comment/updateCommentQuery.jsx";
import { getSafeImageUrl, getFallbackAvatar, handleImageError } from "../../utils/imageUtils";
import { useSelector } from "react-redux";

const CommentSection = ({ slug }) => {
  const userData = useSelector((state) => state.auth.userData);
  const [isCommentBoxOpen, setIsCommentBoxOpen] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [editId, setEditId] = useState(null);
  const [commentText, setCommentText] = useState("");
  const [updateCommentText, setUpdateCommentText] = useState("");
  const [activeDropdown, setActiveDropdown] = useState(null);
  const [sortBy, setSortBy] = useState('newest');
  const [likedComments, setLikedComments] = useState(new Set());
  const [dislikedComments, setDislikedComments] = useState(new Set());
  const textareaRef = useRef(null);

  const { mutate: createComment, isPending: createPending } = createCommentQuery(slug, commentText);
  const { mutate: deleteComment, isPending: deletePending } = deleteCommentQuery();
  const { data: comments } = getVideoCommentQuery(slug);
  const { mutate: updateComment, isPending: updatePending } = updateCommentQuery(updateCommentText);

  // Auto-resize textarea
  useEffect(() => {
    if (textareaRef.current) {
      textareaRef.current.style.height = 'auto';
      textareaRef.current.style.height = textareaRef.current.scrollHeight + 'px';
    }
  }, [commentText, updateCommentText]);

  const handleEdit = (commentId, currentContent) => {
    setEditMode(true);
    setEditId(commentId);
    setUpdateCommentText(currentContent);
    setActiveDropdown(null);
  };

  const handleCancelEdit = () => {
    setEditMode(false);
    setEditId(null);
    setUpdateCommentText("");
  };

  const handleSubmitComment = () => {
    if (editMode) {
      updateComment(editId, updateCommentText);
      handleCancelEdit();
    } else {
      createComment(commentText);
      setCommentText("");
      setIsCommentBoxOpen(false);
    }
  };

  const handleCommentLike = (commentId) => {
    const newLiked = new Set(likedComments);
    const newDisliked = new Set(dislikedComments);
    
    if (likedComments.has(commentId)) {
      newLiked.delete(commentId);
    } else {
      newLiked.add(commentId);
      newDisliked.delete(commentId);
    }
    
    setLikedComments(newLiked);
    setDislikedComments(newDisliked);
  };

  const handleCommentDislike = (commentId) => {
    const newLiked = new Set(likedComments);
    const newDisliked = new Set(dislikedComments);
    
    if (dislikedComments.has(commentId)) {
      newDisliked.delete(commentId);
    } else {
      newDisliked.add(commentId);
      newLiked.delete(commentId);
    }
    
    setLikedComments(newLiked);
    setDislikedComments(newDisliked);
  };

  const formatTimeAgo = (date) => {
    if (!date) return "Just now";
    const now = new Date();
    const commentDate = new Date(date);
    const diffInSeconds = Math.floor((now - commentDate) / 1000);
    
    if (diffInSeconds < 60) return "Just now";
    if (diffInSeconds < 3600) return `${Math.floor(diffInSeconds / 60)}m ago`;
    if (diffInSeconds < 86400) return `${Math.floor(diffInSeconds / 3600)}h ago`;
    if (diffInSeconds < 2592000) return `${Math.floor(diffInSeconds / 86400)}d ago`;
    return commentDate.toLocaleDateString();
  };

  const sortedComments = comments?.docs?.sort((a, b) => {
    switch (sortBy) {
      case 'oldest':
        return new Date(a.createdAt) - new Date(b.createdAt);
      case 'popular':
        return (b.likeCount || 0) - (a.likeCount || 0);
      case 'newest':
      default:
        return new Date(b.createdAt) - new Date(a.createdAt);
    }
  }) || [];

  return (
    <div className="space-y-6">
      {/* Comments Header */}
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-4">
          <h3 className="text-xl font-semibold text-text flex items-center gap-2">
            <FiMessageCircle className="w-5 h-5 text-primary" />
            {comments?.totalDocs || 0} Comments
          </h3>
        </div>
        
        {/* Sort Options */}
        <div className="flex items-center gap-2">
          <select
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="bg-gray-800/50 border border-gray-700 rounded-lg px-3 py-2 text-sm text-text focus:outline-none focus:ring-2 focus:ring-primary/50"
          >
            <option value="newest">Newest first</option>
            <option value="oldest">Oldest first</option>
            <option value="popular">Most liked</option>
          </select>
        </div>
      </div>

      {/* Add Comment Section */}
      <div className="space-y-4">
        <div className="flex items-start gap-4">
          <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
            <img 
              src={getSafeImageUrl(userData?.data?.avatar, getFallbackAvatar(userData?.data?.userName))} 
              alt={userData?.data?.userName}
              className="w-full h-full object-cover"
              onError={(e) => handleImageError(e, getFallbackAvatar(userData?.data?.userName))}
            />
            <div 
              className="image-fallback w-full h-full flex items-center justify-center bg-gray-700"
              style={{ display: 'none' }}
            >
              <FiUser className="w-5 h-5 text-gray-400" />
            </div>
          </div>
          
          <div className="flex-1">
            <div className={`transition-all duration-300 ${isCommentBoxOpen ? 'space-y-3' : ''}`}>
              <textarea
                ref={textareaRef}
                value={commentText}
                onChange={(e) => setCommentText(e.target.value)}
                onFocus={() => setIsCommentBoxOpen(true)}
                placeholder="Add a comment..."
                className={`w-full bg-transparent border-b-2 border-gray-700 focus:border-primary text-text placeholder-gray-400 resize-none transition-all duration-300 ${
                  isCommentBoxOpen ? 'pb-2 min-h-[80px]' : 'pb-2 min-h-[40px]'
                } focus:outline-none`}
                rows={1}
              />
              
              {isCommentBoxOpen && (
                <div className="flex items-center justify-between animate-fade-in">
                  <div className="flex items-center gap-2 text-sm text-gray-400">
                    <span>{commentText.length}/500</span>
                  </div>
                  
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => {
                        setIsCommentBoxOpen(false);
                        setCommentText("");
                      }}
                      className="px-4 py-2 text-gray-400 hover:text-text transition-colors duration-200"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={handleSubmitComment}
                      disabled={!commentText.trim() || createPending}
                      className="btn-primary px-4 py-2 rounded-full flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
                    >
                      {createPending ? (
                        <div className="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                      ) : (
                        <FiSend className="w-4 h-4" />
                      )}
                      Comment
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Comments List */}
      <div className="space-y-6">
        {sortedComments.map((comment, index) => (
          <div 
            key={comment._id} 
            className="group animate-fade-in"
            style={{ animationDelay: `${index * 0.1}s` }}
          >
            <div className="flex items-start gap-4">
              {/* Avatar */}
              <div className="w-10 h-10 rounded-full overflow-hidden bg-gray-800 flex-shrink-0">
                <img 
                  src={getSafeImageUrl(comment?.owner?.avatar, getFallbackAvatar(comment?.owner?.userName))} 
                  alt={comment?.owner?.userName}
                  className="w-full h-full object-cover"
                  onError={(e) => handleImageError(e, getFallbackAvatar(comment?.owner?.userName))}
                />
                <div 
                  className="image-fallback w-full h-full flex items-center justify-center bg-gray-700"
                  style={{ display: 'none' }}
                >
                  <FiUser className="w-5 h-5 text-gray-400" />
                </div>
              </div>

              {/* Comment Content */}
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <h4 className="font-medium text-text hover:text-primary cursor-pointer transition-colors duration-200">
                    {comment?.owner?.fullname || comment?.owner?.userName}
                  </h4>
                  <span className="text-xs text-gray-500 flex items-center gap-1">
                    <FiClock className="w-3 h-3" />
                    {formatTimeAgo(comment?.createdAt)}
                  </span>
                </div>

                {/* Comment Text or Edit Mode */}
                {editMode && editId === comment._id ? (
                  <div className="space-y-3">
                    <textarea
                      value={updateCommentText}
                      onChange={(e) => setUpdateCommentText(e.target.value)}
                      className="w-full bg-gray-800/50 border border-gray-700 rounded-lg p-3 text-text placeholder-gray-400 resize-none focus:outline-none focus:ring-2 focus:ring-primary/50 focus:border-primary"
                      rows={3}
                    />
                    <div className="flex items-center gap-2">
                      <button
                        onClick={handleCancelEdit}
                        className="px-3 py-1.5 text-sm text-gray-400 hover:text-text transition-colors duration-200"
                      >
                        Cancel
                      </button>
                      <button
                        onClick={handleSubmitComment}
                        disabled={!updateCommentText.trim() || updatePending}
                        className="btn-primary px-3 py-1.5 text-sm rounded-lg flex items-center gap-2 disabled:opacity-50"
                      >
                        {updatePending ? (
                          <div className="w-3 h-3 border-2 border-white/30 border-t-white rounded-full animate-spin" />
                        ) : (
                          <FiEdit3 className="w-3 h-3" />
                        )}
                        Update
                      </button>
                    </div>
                  </div>
                ) : (
                  <>
                    <p className="text-gray-300 mb-3 leading-relaxed">
                      {comment?.content}
                    </p>

                    {/* Comment Actions */}
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-1">
                        {/* Like Button */}
                        <button
                          onClick={() => handleCommentLike(comment._id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                            likedComments.has(comment._id)
                              ? 'bg-primary/20 text-primary'
                              : 'hover:bg-gray-800/50 text-gray-400 hover:text-text'
                          }`}
                        >
                          <FiThumbsUp className="w-4 h-4" />
                          <span>{(comment.likeCount || 0) + (likedComments.has(comment._id) ? 1 : 0)}</span>
                        </button>

                        {/* Dislike Button */}
                        <button
                          onClick={() => handleCommentDislike(comment._id)}
                          className={`flex items-center gap-1 px-3 py-1.5 rounded-full text-sm transition-all duration-200 ${
                            dislikedComments.has(comment._id)
                              ? 'bg-red-500/20 text-red-400'
                              : 'hover:bg-gray-800/50 text-gray-400 hover:text-text'
                          }`}
                        >
                          <FiThumbsDown className="w-4 h-4" />
                        </button>

                        {/* Reply Button */}
                        <button className="px-3 py-1.5 rounded-full text-sm text-gray-400 hover:text-text hover:bg-gray-800/50 transition-all duration-200">
                          Reply
                        </button>
                      </div>

                      {/* More Options */}
                      <div className="relative">
                        <button
                          onClick={() => setActiveDropdown(activeDropdown === comment._id ? null : comment._id)}
                          className="p-2 rounded-full text-gray-400 hover:text-text hover:bg-gray-800/50 transition-all duration-200 opacity-0 group-hover:opacity-100"
                        >
                          <FiMoreVertical className="w-4 h-4" />
                        </button>

                        {activeDropdown === comment._id && (
                          <div className="absolute right-0 top-full mt-2 bg-gray-900 border border-gray-700 rounded-lg shadow-xl z-10 min-w-[160px] animate-scale-in">
                            <div className="py-2">
                              {comment?.owner?._id === userData?.data?._id && (
                                <>
                                  <button
                                    onClick={() => handleEdit(comment._id, comment.content)}
                                    className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-text flex items-center gap-3 transition-colors duration-200"
                                  >
                                    <FiEdit3 className="w-4 h-4" />
                                    Edit
                                  </button>
                                  <button
                                    onClick={() => {
                                      deleteComment(comment._id);
                                      setActiveDropdown(null);
                                    }}
                                    disabled={deletePending}
                                    className="w-full px-4 py-2 text-left text-sm text-red-400 hover:bg-red-500/10 hover:text-red-300 flex items-center gap-3 transition-colors duration-200 disabled:opacity-50"
                                  >
                                    <FiTrash2 className="w-4 h-4" />
                                    Delete
                                  </button>
                                </>
                              )}
                              <button className="w-full px-4 py-2 text-left text-sm text-gray-300 hover:bg-gray-800 hover:text-text flex items-center gap-3 transition-colors duration-200">
                                <FiFlag className="w-4 h-4" />
                                Report
                              </button>
                            </div>
                          </div>
                        )}
                      </div>
                    </div>
                  </>
                )}
              </div>
            </div>
          </div>
        ))}

        {/* Empty State */}
        {sortedComments.length === 0 && (
          <div className="text-center py-12">
            <div className="w-16 h-16 mx-auto mb-4 bg-gray-800/50 rounded-full flex items-center justify-center">
              <FiMessageCircle className="w-8 h-8 text-gray-400" />
            </div>
            <h3 className="text-lg font-medium text-text mb-2">No comments yet</h3>
            <p className="text-gray-400">Be the first to share your thoughts!</p>
          </div>
        )}
      </div>

      {/* Click outside to close dropdown */}
      {activeDropdown && (
        <div 
          className="fixed inset-0 z-5" 
          onClick={() => setActiveDropdown(null)}
        />
      )}
    </div>
  );
};

export default CommentSection;
