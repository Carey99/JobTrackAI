import { useState, useRef, ReactNode } from 'react';
import { motion } from 'framer-motion';

interface TiltCardProps {
  children: ReactNode;
}

export function TiltCard({ children }: TiltCardProps) {
  const [tilt, setTilt] = useState({ x: 0, y: 0 });
  const cardRef = useRef<HTMLDivElement>(null);
  
  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    
    const rect = cardRef.current.getBoundingClientRect();
    const centerX = rect.left + rect.width / 2;
    const centerY = rect.top + rect.height / 2;
    
    const mouseX = e.clientX - centerX;
    const mouseY = e.clientY - centerY;
    
    // Calculate tilt - max 15 degrees
    const tiltX = (mouseY / (rect.height / 2)) * 10;
    const tiltY = -(mouseX / (rect.width / 2)) * 10;
    
    setTilt({ x: tiltX, y: tiltY });
  };
  
  const handleMouseLeave = () => {
    setTilt({ x: 0, y: 0 });
  };

  return (
    <motion.div
      ref={cardRef}
      className="w-full h-full perspective-1000 transform-gpu"
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      animate={{
        rotateX: tilt.x,
        rotateY: tilt.y,
        transformStyle: "preserve-3d"
      }}
      transition={{ type: "spring", stiffness: 300, damping: 20 }}
      whileHover={{ translateY: -10, transition: { duration: 0.2 } }}
    >
      <div className="w-full h-full relative">
        {/* Shiny reflection overlay */}
        <div 
          className="absolute inset-0 bg-gradient-to-br from-transparent via-white/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300"
          style={{
            transform: `translateX(${tilt.y * -4}px) translateY(${tilt.x * 4}px)`,
          }}
        />
        {children}
      </div>
    </motion.div>
  );
}