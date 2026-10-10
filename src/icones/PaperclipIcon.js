import React from 'react';
import Svg, { Path } from 'react-native-svg';

const PaperclipIcon = ({ size = 22, color = '#2d5a3e', strokeWidth = 1.8 }) => (
  <Svg width={size} height={size} viewBox="0 0 24 24" fill="none">
    <Path
      d="M15 6v9.5a3 3 0 0 1-6 0V6.5a5 5 0 0 1 10 0v9a7 7 0 0 1-14 0V8"
      stroke={color}
      strokeWidth={strokeWidth}
      strokeLinecap="round"
      strokeLinejoin="round"
    />
  </Svg>
);

export default PaperclipIcon;
