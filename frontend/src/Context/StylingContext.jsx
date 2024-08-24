import React, { createContext, useState, useContext } from 'react';

const TextStyleContext = createContext();

export const TextStyleProvider = ({ children }) => {
  const [textStyle, setTextStyle] = useState({
    isBold: false,
    isItalic: false,
    isStrikeThrough: false
  });

  const toggleStyle = (style) => {
    setTextStyle(prev => ({ ...prev, [style]: !prev[style] }));
  };

  return (
    <TextStyleContext.Provider value={{ textStyle, toggleStyle }}>
      {children}
    </TextStyleContext.Provider>
  );
};

export const useTextStyle = () => useContext(TextStyleContext);
