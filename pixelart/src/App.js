import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import { ColorPicker, useColor } from "react-color-palette";
import "react-color-palette/css";



function App() {
  const gridArray = Array.from({ length: 32 }, () => Array(32).fill('null'));
  const [divColors, setDivColors] = useState(() =>
    gridArray.map(() => Array(32).fill('white'))
  );
  const [color, setColor] = useColor("#561ecb");
  const [isMouseDown, setIsMouseDown] = useState(false);

  const handleDivClick = (rowIndex, colIndex) => {

    // Update the state to change the color of the clicked div
    const newColors = [...divColors];
    newColors[rowIndex][colIndex] = color.hex;
    setDivColors(newColors);
  }

  return (
    <Container fluid={true} className="p-0" style={{ border: '1px solid #ddd' }}>
      <Row>
        <Col md={9}>
          {gridArray.map((row, rowIndex) => (
            <Row key={rowIndex} style={{ margin: '0' }}>
              {row.map((col, colIndex) => (
                <div
                  key={colIndex}

                  style={{
                    width: '25px', // Adjust the width as needed
                    height: '25px', // Adjust the height as needed
                    fontSize: '10px',
                    textAlign: 'center',
                    overflow: 'hidden', // Hide overflow content
                    backgroundColor: divColors[rowIndex][colIndex],
                  }}
                  onClick={() => handleDivClick(rowIndex, colIndex)}
                  onMouseDown={() => setIsMouseDown(!isMouseDown) && handleDivClick(rowIndex, colIndex)}
                  onMouseUp={() => setIsMouseDown(!isMouseDown)}
                  onMouseEnter={() => isMouseDown && handleDivClick(rowIndex, colIndex)}
                >
                  {/* Fix onMouseDown and dragging drawing so that the div that is mouseDown on also gets coloured */}
                  {`${rowIndex + 1}`}
                </div>
              ))}
            </Row>
          ))}
        </Col>
        <Col md={3}>
          <ColorPicker color={color} onChange={setColor} />
        </Col>
      </Row>
    </Container>

  );
}

export default App;
