import React from 'react';
import logo from './logo.svg';
import './App.css';
import HexMap from "./HexMap";






function App() {
  const [dimensions, setDimensions] = React.useState({ width: 800, height: 600 });

  React.useEffect(() => {
    const handleResize = () => {
      setDimensions({
        width: window.innerWidth,
        height: window.innerHeight,
      });
    };

    handleResize(); // set immediately on mount
    window.addEventListener("resize", handleResize);
    return () => window.removeEventListener("resize", handleResize);
  }, []);
  return (
    <div className='App'>
      <h1>top of map</h1>
      <HexMap windowWidth={dimensions.width} windowHeight={dimensions.height} />
      <h1>bottom of map</h1>
    </div>
  );
}

export default App;
