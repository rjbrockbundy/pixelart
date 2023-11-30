import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import { ColorPicker, useColor, ColorService} from "react-color-palette";
import "react-color-palette/css";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';



function App() {
  const gridArray = Array.from({ length: 32 }, () => Array(32).fill('null'));
  const [divColors, setDivColors] = useState(() =>
    gridArray.map(() => Array(32).fill('white'))
  );
  const [color, setColor] = useColor("#000");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [gridBorder, setGridBorder] = useState(true);
  const handleDivClick = (rowIndex, colIndex) => {

    // Update the state to change the color of the clicked div
    const newColors = [...divColors];
    newColors[rowIndex][colIndex] = color.hex;
    setDivColors(newColors);
  }

  const SaveButton = (id) => {
    htmlToImage.toPng(document.getElementById(id))
      .then(function (dataUrl) {
        saveAs(dataUrl, 'MyPixelArt.png');
      });
  }

  const presetColors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080', '#000000', '#FFFFFF', '#808080'];

  return (
    <Container fluid={true} className="p-0" style={{ border: '1px solid #ddd' }}>
      <Row>
        <Col md={9} id="grid" style={{ userSelect: 'none' }}>
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
                    border: gridBorder ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0,0,0,0.0)',
                  }}
                  onClick={() => handleDivClick(rowIndex, colIndex)}
                  onMouseDown={() => setIsMouseDown(!isMouseDown) && handleDivClick(rowIndex, colIndex)}
                  onMouseUp={() => setIsMouseDown(!isMouseDown)}
                  onMouseEnter={() => isMouseDown && handleDivClick(rowIndex, colIndex)}
                >
                  {/* Fix onMouseDown and dragging drawing so that the div that is mouseDown on also gets coloured */}
                </div>
              ))}
            </Row>

          ))}

        </Col>

        <Col md={3}>
          <h1>Color Picker</h1>
          <Row>
            {presetColors.map((mapColor, index) => (
              <Col key={index}
                style={{
                  width: '25px', // Adjust the width as needed
                  height: '25px', // Adjust the height as needed
                  fontSize: '10px',
                  textAlign: 'center',
                  overflow: 'hidden', // Hide overflow content
                  backgroundColor: mapColor,
                }}
                onClick={() => setColor(ColorService.convert('hex', mapColor))}
              >
              </Col>
            ))}
          </Row>
          <ColorPicker color={color} onChange={setColor} />
        </Col>
      </Row>
      <Row>
        <Col md={4}>
          <button onClick={() => SaveButton('grid')}>Save</button>
          <button onClick={() => setGridBorder(!gridBorder)}>Grid Off</button>
        </Col>
      </Row>
    </Container>

  );
}

export default App;
