import * as React from 'react';
import './style.css';
import { gsap } from 'gsap';
import ScrollTrigger from "gsap/ScrollTrigger";
import ClickMe from './components/ClickMe';
import PageWrapper from './components/PageWrapper';
import DissolveImage from './components/DissolveImage';


export default function App() {
  const [isFadingOut, setIsFadingOut] = React.useState(false);
  const titleRef = React.useRef(null);
  let bgImage = document.querySelector('.img-container');

  const handleClick = () => {
    console.log('Button clicked!');
    setIsFadingOut(true);
    document.documentElement.style.transition = '10s';
    document.documentElement.style.opacity = '0';
    setTimeout(() => {
      document.documentElement.style.transition = '10s';
      document.documentElement.style.opacity = '1';
    }, 10000);
  };

  React.useEffect(() => {
    gsap.from(titleRef.current, {
      x: 100,
      duration: 0.6,
      delay: 0.2,
      ease: 'back.out(1.7)',
    });
    gsap.registerPlugin(ScrollTrigger);

    gsap.fromTo(
      bgImage,
      {
        clipPath: 'circle(5% at 77% 40%)',
      },
      {
        clipPath: 'circle(75% at 50% 50%)',
        ease: 'none',

        //  We want to do that animation on scroll
        scrollTrigger: {
          trigger: bgImage,
          scrub: 1,
          start: 'top center',
          end: 'top center-=200',
        },
      }
    );
  });

  return (
    <div>
      <PageWrapper>
        <h1 ref={titleRef}>Home Page</h1>
      </PageWrapper>
      <div>
        {' '}
        <img src="https://raw.githubusercontent.com/malwozniak/react-ts-1dq1it/main/textures/img1.jpg" />
      </div>
      {/* <DissolveImage
        imgage="https://raw.githubusercontent.com/malwozniak/react-ts-1dq1it/main/textures/img1.jpg"
        width={400}
        height={300}
        dissolveDuration={500}
      /> */}
      <ClickMe onClick={handleClick} />
    </div>
  );
}
