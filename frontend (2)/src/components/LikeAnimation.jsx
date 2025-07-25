import React, { useState, useEffect } from 'react';
import { FiHeart, FiThumbsUp } from 'react-icons/fi';

const LikeAnimation = ({ isLiked, onClick, count, type = 'thumbs' }) => {
  const [showAnimation, setShowAnimation] = useState(false);
  const [particles, setParticles] = useState([]);

  const handleClick = (e) => {
    onClick();
    
    if (!isLiked) {
      // Create particles for animation
      const rect = e.currentTarget.getBoundingClientRect();
      const newParticles = Array.from({ length: 6 }, (_, i) => ({
        id: Date.now() + i,
        x: rect.left + rect.width / 2,
        y: rect.top + rect.height / 2,
        angle: (i * 60) * (Math.PI / 180),
        velocity: 2 + Math.random() * 2,
      }));
      
      setParticles(newParticles);
      setShowAnimation(true);
      
      // Clear animation after duration
      setTimeout(() => {
        setShowAnimation(false);
        setParticles([]);
      }, 1000);
    }
  };

  const Icon = type === 'heart' ? FiHeart : FiThumbsUp;

  return (
    <>
      <button
        onClick={handleClick}
        className={`relative flex items-center gap-2 px-4 py-2.5 rounded-full font-medium transition-all duration-300 overflow-hidden ${
          isLiked 
            ? 'bg-gradient-to-r from-primary to-accent text-white shadow-lg shadow-primary/25 scale-105' 
            : 'hover:bg-gray-800 text-gray-300 hover:text-white hover:scale-105'
        }`}
      >
        {/* Background pulse effect */}
        {isLiked && (
          <div className="absolute inset-0 bg-gradient-to-r from-primary to-accent opacity-20 animate-pulse rounded-full"></div>
        )}
        
        {/* Icon with animation */}
        <Icon 
          className={`w-5 h-5 relative z-10 transition-all duration-300 ${
            isLiked ? 'scale-110 animate-bounce' : ''
          } ${showAnimation ? 'animate-pulse' : ''}`} 
        />
        
        {/* Count with animation */}
        <span className={`font-semibold relative z-10 transition-all duration-300 ${
          showAnimation ? 'animate-bounce' : ''
        }`}>
          {count}
        </span>
        
        {/* Ripple effect */}
        {showAnimation && (
          <div className="absolute inset-0 rounded-full border-2 border-primary animate-ping opacity-75"></div>
        )}
      </button>

      {/* Floating particles */}
      {showAnimation && (
        <div className="fixed inset-0 pointer-events-none z-50">
          {particles.map((particle) => (
            <div
              key={particle.id}
              className="absolute w-2 h-2 bg-primary rounded-full animate-ping"
              style={{
                left: particle.x,
                top: particle.y,
                transform: `translate(${Math.cos(particle.angle) * particle.velocity * 20}px, ${Math.sin(particle.angle) * particle.velocity * 20}px)`,
                animationDuration: '0.6s',
                animationDelay: `${Math.random() * 0.2}s`,
              }}
            />
          ))}
        </div>
      )}
    </>
  );
};

export default LikeAnimation;
