import * as React from 'react';
import './style.css';
import ClickMe from './components/ClickMe';
import Parralax from './components/Parralax';
import DissolveImage from './components/DissolveImage';

export default function App() {
  const [isFadingOut, setIsFadingOut] = React.useState(false);

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
  return (
    <div>
      <h1></h1>
      <DissolveImage
        imgage="https://raw.githubusercontent.com/malwozniak/react-ts-1dq1it/main/textures/img1.jpg"
        width={400}
        height={300}
        dissolveDuration={500}
      />
      <ClickMe onClick={handleClick} />
    </div>
  );
}
