import './App.css';
import Container from 'react-bootstrap/Container';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import React, { useState } from 'react';
import { ColorPicker, useColor, ColorService } from "react-color-palette";
import "react-color-palette/css";
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import logo from './logo.svg';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faPen, faFloppyDisk, faFillDrip, faArrowsRotate } from '@fortawesome/free-solid-svg-icons';

function App() {
  const gridArray = Array.from({ length: 32 }, () => Array(32).fill('null'));
  const [divColors, setDivColors] = useState(() =>
    gridArray.map(() => Array(32).fill('white'))
  );
  const [color, setColor] = useColor("#000");
  const [isMouseDown, setIsMouseDown] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [gridBorder, setGridBorder] = useState(true);
  const [bucketFill, setBucketFill] = useState(false);
  const handleDivClick = (rowIndex, colIndex) => {

    // Update the state to change the color of the clicked div
    const newColors = [...divColors];
    if (bucketFill) {
      const targetColor = newColors[rowIndex][colIndex];
      if (targetColor !== color.hex) {
        // Perform bucket fill only if the clicked div has a different color

        const fill = (row, col) => {
          // Check if the pixel is within bounds
          if (row < 0 || row >= newColors.length || col < 0 || col >= newColors[0].length) {
            return;
          }

          // Check if the pixel has the same color as the target color
          if (newColors[row][col] === targetColor) {
            newColors[row][col] = color.hex; // Change the color
            // Recursively fill adjacent pixels
            fill(row + 1, col);
            fill(row - 1, col);
            fill(row, col + 1);
            fill(row, col - 1);
          }
        };

        fill(rowIndex, colIndex);
      }
    } else {
      // Regular click without bucket fill
      newColors[rowIndex][colIndex] = color.hex;
    }
    setDivColors(newColors);
  }

  function SaveButton(id) {
    setIsLoading(true);

    setTimeout(() => {
      htmlToImage.toPng(document.getElementById(id), { backgroundColor: 'rgba(0,0,0,0)' })
        .then(function (dataUrl) {
          saveAs(dataUrl, 'MyPixelArt.png');
        })
        .catch(function (error) {
          console.error('Error saving image:', error);
        })
        .finally(function () {
          setIsLoading(false);
        });
    }, 30); // Use a small timeout to allow the loading state to update before the image conversion starts
  }

  const presetColors = ['#FF0000', '#FFA500', '#FFFF00', '#008000', '#0000FF', '#800080', '#000000', '#FFFFFF', '#808080'];

  return (
    <Container fluid={true} className="p-0" style={{ border: '1px solid #ddd' }}>
      {isLoading ? <div className="App-logo">
        <FontAwesomeIcon icon={faArrowsRotate} spin className='App-spin' />
      </div> : null}

      <Row xs={{ gutterX: 0 }} style={{ background: 'rgba(128,128,128,.5)', height: '100vh' }}>
        <Col md={8} style={{ userSelect: 'none', justifyContent: 'center' }}  >
          <div id="grid" style={{ minWidth: '832px' }}>
            {gridArray.map((row, rowIndex) => (
              <Row key={rowIndex} style={{ margin: '0'}} xs={{ gutterX: 0 }}>
                {row.map((col, colIndex) => (
                  <div
                    key={colIndex}

                    style={{
                      width: '25px', // Adjust the width as needed
                      height: '25px', // Adjust the height as needed
                      backgroundColor: divColors[rowIndex][colIndex],
                      border: gridBorder ? '1px solid rgba(0,0,0,0.1)' : '1px solid rgba(0,0,0,0.0)',
                      maxWidth: '100vw',
                      zIndex: 200,
                    }}
                    onMouseDown={() => { setIsMouseDown(!isMouseDown); handleDivClick(rowIndex, colIndex) }}
                    onMouseUp={() => setIsMouseDown(!isMouseDown)}
                    onMouseEnter={() => isMouseDown && !bucketFill && handleDivClick(rowIndex, colIndex)}
                  >
                    {/* Fix onMouseDown and dragging drawing so that the div that is mouseDown on also gets coloured */}
                  </div>
                ))}
              </Row>

            ))}
          </div>
        </Col>

        <Col md={3}>
          <h1>Color Picker</h1>
          <Row>
            {presetColors.map((mapColor, index) => (
              <Col key={index}
                className='preset-colours'
                style={{
                  width: '25px', // Adjust the width as needed
                  height: '25px', // Adjust the height as needed
                  fontSize: '10px',
                  textAlign: 'center',
                  overflow: 'hidden', // Hide overflow content
                  marginBottom: '5px',
                  borderRadius: '25px',
                  backgroundColor: mapColor,
                }}
                onClick={() => setColor(ColorService.convert('hex', mapColor))}
              >
              </Col>
            ))}
          </Row>
          <ColorPicker color={color} onChange={setColor} hideAlpha={true} />
          <Row style={{ marginTop: '2vh' }}>
            <Col style={{ justifyContent: 'space-between', display: 'flex' }}>
              <button className='button-89' onClick={() => SaveButton('grid')} >
                <FontAwesomeIcon icon={faFloppyDisk} />
              </button>
              <button className='button-89' onClick={() => setGridBorder(!gridBorder)}>Grid Off</button>
              <button className='button-89' onClick={() => setBucketFill(!bucketFill)} >
                {bucketFill ? <FontAwesomeIcon icon={faPen} id="penButton" /> : <FontAwesomeIcon id="bucketButton" icon={faFillDrip} />}
              </button>
            </Col>
          </Row>
        </Col>
        <Col md={1} />
      </Row>

    </Container>

  );
}

export default App;
