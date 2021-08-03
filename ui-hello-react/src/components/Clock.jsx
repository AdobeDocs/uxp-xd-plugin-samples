import React, { useEffect, useState } from 'react';

const Clock = () => {
  const [now, setNow] = useState(Date.now());
  let timer = undefined;

  useEffect(() => {
    timer = setInterval(() => update(), 1000);

    return () => {
      clearInterval(timer);
    };
  }, []);

  const update = () => {
    setNow(Date.now());
  };

  const currentTime = new Date(now).toLocaleTimeString();

  return <sp-body>{currentTime}</sp-body>;
};

export default Clock;
