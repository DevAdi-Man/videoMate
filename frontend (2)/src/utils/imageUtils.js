// Utility functions for handling images

/**
 * Get full image URL from backend response
 * @param {string} imageUrl - Image URL from backend
 * @returns {string} - Full image URL or fallback
 */
export const getImageUrl = (imageUrl) => {
  if (!imageUrl) return null;
  
  // If it's already a full URL (starts with http/https)
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

/**
 * Get fallback avatar based on username
 * @param {string} userName - User's name
 * @returns {string} - Avatar URL from UI Avatars
 */
export const getFallbackAvatar = (userName) => {
  const name = userName || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase();
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=e092bc&color=ffffff&size=200&bold=true`;
};

/**
 * Get placeholder image for covers
 * @param {number} width - Image width
 * @param {number} height - Image height
 * @returns {string} - Placeholder image URL
 */
export const getPlaceholderImage = (width = 800, height = 400) => {
  return `https://images.unsplash.com/photo-1557804506-669a67965ba0?w=${width}&h=${height}&fit=crop&crop=entropy&auto=format&q=80`;
};

/**
 * Handle image loading errors
 * @param {Event} event - Image error event
 * @param {string} fallbackUrl - Fallback image URL
 */
export const handleImageError = (event, fallbackUrl) => {
  if (fallbackUrl && event.target.src !== fallbackUrl) {
    event.target.src = fallbackUrl;
  } else {
    event.target.style.display = 'none';
    // Show fallback element if exists
    const fallbackElement = event.target.nextElementSibling;
    if (fallbackElement && fallbackElement.classList.contains('image-fallback')) {
      fallbackElement.style.display = 'flex';
    }
  }
};
