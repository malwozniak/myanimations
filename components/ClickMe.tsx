import * as React from 'react';
import '../style.css';
import PropTypes from 'prop-types';

type ClickMeProps = {
  onClick: () => void;
};

const ClickMe: React.FC<ClickMeProps> = ({ onClick }) => {
  //
  return <button onClick={onClick}>ClickMe</button>;
};

export default ClickMe;
