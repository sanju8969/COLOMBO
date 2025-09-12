import React, { useEffect, useRef } from 'react';
import gsap from 'gsap';
import { TextPlugin } from 'gsap/TextPlugin';

gsap.registerPlugin(TextPlugin);

interface MorphingTextProps {
  texts: string[];
  className?: string;
  duration?: number;
}

const MorphingText: React.FC<MorphingTextProps> = ({ 
  texts, 
  className = '', 
  duration = 2 
}) => {
  const textRef = useRef<HTMLSpanElement>(null);

  useEffect(() => {
    if (!textRef.current || texts.length === 0) return;

    const tl = gsap.timeline({ repeat: -1 });

    texts.forEach((text, index) => {
      tl.to(textRef.current, {
        duration: 0.5,
        text: text,
        ease: "none"
      })
      .to(textRef.current, {
        duration: duration,
        delay: 0.5
      });
    });

    return () => {
      tl.kill();
    };
  }, [texts, duration]);

  return (
    <span ref={textRef} className={className}>
      {texts[0] || ''}
    </span>
  );
};

export default MorphingText;