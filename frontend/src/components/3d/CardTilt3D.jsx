import React, { useRef, useState } from 'react';
import { motion } from 'framer-motion';

const CardTilt3D = ({
  children,
  className = '',
  glare = true,
  maxTilt = 12,
  glowColor = 'rgba(99, 102, 241, 0.25)',
}) => {
  const cardRef = useRef(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePosition, setGlarePosition] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = (e) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -maxTilt;
    const rY = ((x - centerX) / centerX) * maxTilt;

    setRotateX(rX);
    setRotateY(rY);

    if (glare) {
      setGlarePosition({
        x: (x / rect.width) * 100,
        y: (y / rect.height) * 100,
        opacity: 0.2,
      });
    }
  };

  const handleMouseLeave = () => {
    setRotateX(0);
    setRotateY(0);
    setGlarePosition((prev) => ({ ...prev, opacity: 0 }));
  };

  return (
    <motion.div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX,
        rotateY,
      }}
      transition={{
        type: 'spring',
        stiffness: 300,
        damping: 25,
      }}
      style={{
        transformStyle: 'preserve-3d',
      }}
      className={`relative perspective-1000 group transition-shadow duration-300 ${className}`}
    >
      {/* Glare spotlight reflection */}
      {glare && (
        <div
          className="absolute inset-0 pointer-events-none rounded-[inherit] z-20 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePosition.x}% ${glarePosition.y}%, ${glowColor}, transparent 65%)`,
            opacity: glarePosition.opacity,
          }}
        />
      )}

      {/* Card Content with 3D pop */}
      <div style={{ transform: 'translateZ(15px)' }} className="h-full">
        {children}
      </div>
    </motion.div>
  );
};

export default CardTilt3D;
