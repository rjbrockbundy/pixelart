import React, { useState, useEffect } from 'react';
import { Modal, Form, Dropdown, Button } from 'react-bootstrap';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import Row from 'react-bootstrap/Row';
import Col from 'react-bootstrap/Col';
import './SavePopus.css'
import './App.css';

const SavePopup = ({ onShow, onHide, gridRef }) => {
    const [fileName, setFileName] = useState('');
    const [fileFormat, setFileFormat] = useState('.jpg');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(false);

    useEffect(() => {
        setShow(onShow);
    }, [onShow]);
    const handleClose = () => {
        onHide();
        setShow(false);
    };

    const handleSave = () => {
        setIsLoading(true);

        const gridElement = gridRef.current;

        if (!gridElement) {
            console.error("Grid element not found.");
            return;
        }


        htmlToImage
            .toPng(gridElement, { backgroundColor: 'rgba(0,0,0,0)' })
            .then(function (dataUrl) {
                saveAs(dataUrl, fileName + fileFormat);
            })
            .catch(function (error) {
                console.error('Error saving image:', error);
            })
            .finally(function () {
                setIsLoading(false);
                handleClose(); // Close the modal after saving
            });
    };

    const fileFormatOptions = ['.jpg', '.jpeg', '.png', '.gif'];
    return (
        <>
            <Modal show={show} onHide={handleClose} className="modal-popup">
                {isLoading ? <div className="App-logo">
                    <FontAwesomeIcon icon={faArrowsRotate} spin className='App-spin' />
                </div> : null}

                <Modal.Body className="modal-body">
                    <Row>
                        <Form>
                            <Form.Group controlId="fileName">
                                <Form.Label>File Name</Form.Label>
                                <Form.Control
                                    type="text"
                                    placeholder="Enter file name"
                                    value={fileName}
                                    onChange={(e) => setFileName(e.target.value)}
                                    className='modal-input'
                                />
                            </Form.Group>
                            <Form.Group controlId="fileFormat">
                                <Form.Label>File Format</Form.Label>
                                <Dropdown>
                                    <Dropdown.Toggle variant="light" id="dropdown-basic" className='modal-input button-89' >
                                        {fileFormat.toUpperCase()}
                                    </Dropdown.Toggle>
                                    <Dropdown.Menu>
                                        {fileFormatOptions.map((file) => (
                                            <Dropdown.Item className='modal-input' onClick={() => setFileFormat(file)} key={file}>
                                                {file.toUpperCase()}
                                            </Dropdown.Item>
                                        ))}
                                    </Dropdown.Menu>
                                </Dropdown>
                            </Form.Group>
                        </Form>
                    </Row>
                    <hr />
                    <Row className="modal-foot">
                        <Col>
                            <Button onClick={handleClose} className="button-89">
                                Cancel
                            </Button>
                        </Col>
                        <Col style={{ display: 'flex', justifyContent: 'right' }}>
                            <Button className="button-89" onClick={() => handleSave("grid")}>
                                Save
                            </Button>
                        </Col>
                    </Row>

                </Modal.Body>

            </Modal>
        </>
    );
};
export default SavePopup;
