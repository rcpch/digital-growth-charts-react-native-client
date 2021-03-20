import React, {useState, useEffect} from 'react';

import AppText from './AppText';

type propTypes = {children: string; style?: any};

const LoadingOrText = ({children, style}: propTypes) => {
  const [dotArray, setDotArray] = useState(['']);

  useEffect(() => {
    if (!children) {
      const interval = setInterval(() => {
        if (dotArray.length < 5) {
          setDotArray(dotArray.concat(['.']));
        } else {
          setDotArray(['']);
        }
      }, 500);
      return () => clearInterval(interval);
    }
  }, [dotArray, children]);

  return (
    <AppText style={style}>{children || 'Loading' + dotArray.join('')}</AppText>
  );
};

export default LoadingOrText;
