import * as React from 'react';
import './style.css';
import ClickMe from './ClickMe';
import Parralax from './Parralax';

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

      <ClickMe onClick={handleClick} />
    </div>
  );
}
