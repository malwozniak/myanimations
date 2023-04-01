import React, { useState, useEffect } from 'react';
import styled from 'styled-components';

const ParallaxContainer = styled.div`
  perspective: 1px;
  height: 100vh;
  overflow-x: hidden;
  overflow-y: auto;
`;

const ParallaxLayer = styled.div<{ depth: number }>`
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  transform: translateZ(${({ depth }) => depth}px) scale(${({ depth }) =>
  1 + depth / 100});
`;

const ParallaxImage = styled.img`
  width: 100%;
  height: 100%;
  object-fit: cover;
`;

const ParallaxText = styled.h1`
  color: white;
  font-size: 48px;
  font-weight: bold;
  margin-top: 30%;
`;

const Parallax: React.FC = () => {
  const [scrollTop, setScrollTop] = useState(0);

  useEffect(() => {
    const onScroll = (e: Event) => {
      setScrollTop((e.target as Element).scrollTop);
    };

    window.addEventListener('scroll', onScroll);

    return () => window.removeEventListener('scroll', onScroll);
  }, []);

  return (
    <ParallaxContainer>
      <ParallaxLayer depth={-3}>
        <ParallaxImage
          src="https://source.unsplash.com/random/800x600"
          alt="background"
        />
      </ParallaxLayer>
      <ParallaxLayer depth={6}>
        <ParallaxText>Parallax Title</ParallaxText>
      </ParallaxLayer>
      <ParallaxLayer depth={12}>
        <ParallaxImage
          src="https://source.unsplash.com/random/800x600"
          alt="foreground"
        />
      </ParallaxLayer>
    </ParallaxContainer>
  );
};

export default Parallax;
