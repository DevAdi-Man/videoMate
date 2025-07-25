// Utility functions for handling images

/**
 * Get full image URL from backend response
 * @param {string|object} imageUrl - Image URL from backend (can be string or object with url property)
 * @returns {string|null} - Full image URL or null
 */
export const getImageUrl = (imageUrl) => {
  // Handle null, undefined, or empty values
  if (!imageUrl) return null;
  
  // If imageUrl is an object (like {url: "..."})
  if (typeof imageUrl === 'object' && imageUrl.url) {
    imageUrl = imageUrl.url;
  }
  
  // Ensure imageUrl is a string
  if (typeof imageUrl !== 'string') {
    console.warn('Invalid imageUrl type:', typeof imageUrl, imageUrl);
    return null;
  }
  
  // If it's already a full URL (starts with http/https)
  if (imageUrl.startsWith('http')) {
    return imageUrl;
  }
  
  // If it's a relative path, prepend backend URL
  const backendUrl = import.meta.env.VITE_BACKEND_URL || 'http://localhost:8000';
  return `${backendUrl}${imageUrl.startsWith('/') ? '' : '/'}${imageUrl}`;
};

/**
 * Get safe image URL with fallback
 * @param {string|object} imageUrl - Image URL from backend
 * @param {string} fallbackUrl - Fallback URL if main image fails
 * @returns {string} - Safe image URL
 */
export const getSafeImageUrl = (imageUrl, fallbackUrl) => {
  const safeUrl = getImageUrl(imageUrl);
  return safeUrl || fallbackUrl || null;
};

/**
 * Get fallback avatar based on username
 * @param {string} userName - User's name
 * @returns {string} - Avatar URL from UI Avatars
 */
export const getFallbackAvatar = (userName) => {
  const name = userName || 'User';
  const initials = name.split(' ').map(n => n[0]).join('').toUpperCase().slice(0, 2);
  return `https://ui-avatars.com/api/?name=${encodeURIComponent(initials)}&background=e092bc&color=ffffff&size=200&bold=true&rounded=true`;
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
  if (!event || !event.target) return;
  
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
