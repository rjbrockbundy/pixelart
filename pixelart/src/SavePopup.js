import React, { useState } from 'react';
import { Modal, Button, Form, Dropdown } from 'react-bootstrap';
import * as htmlToImage from 'html-to-image';
import { saveAs } from 'file-saver';
import { faArrowsRotate } from '@fortawesome/free-solid-svg-icons';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';

const SavePopup = ({ onShow, onHide, gridRef }) => {
    const [fileName, setFileName] = useState('');
    const [fileFormat, setFileFormat] = useState('.jpg');
    const [isLoading, setIsLoading] = useState(false);
    const [show, setShow] = useState(onShow);

    const handleClose = () => setShow(false);

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
                onHide(); // Close the modal after saving
            });
    };

    const fileFormatOptions = ['.jpg', '.jpeg', '.png', '.gif'];
    return (
        <Modal show={show} onHide={handleClose}>
            {isLoading ? <div className="App-logo">
                <FontAwesomeIcon icon={faArrowsRotate} spin className='App-spin' />
            </div> : null}
            <Modal.Header closeButton>
                <Modal.Title>Save Popup</Modal.Title>
            </Modal.Header>
            <Modal.Body>
                <Form>
                    <Form.Group controlId="fileName">
                        <Form.Label>File Name</Form.Label>
                        <Form.Control
                            type="text"
                            placeholder="Enter file name"
                            value={fileName}
                            onChange={(e) => setFileName(e.target.value)}
                        />
                    </Form.Group>
                    <Form.Group controlId="fileFormat">
                        <Form.Label>File Format</Form.Label>
                        <Dropdown>
                            <Dropdown.Toggle variant="secondary" id="dropdown-basic">
                                {fileFormat}
                            </Dropdown.Toggle>
                            <Dropdown.Menu>
                                {fileFormatOptions.map((file) => (
                                    <Dropdown.Item onClick={() => setFileFormat(file)} key={file}>
                                        {file}
                                    </Dropdown.Item>
                                ))}
                            </Dropdown.Menu>
                        </Dropdown>
                    </Form.Group>
                </Form>
            </Modal.Body>
            <Modal.Footer>
                <Button variant="secondary" onClick={() => handleClose}>
                    Cancel
                </Button>
                <Button variant="primary" onClick={() => handleSave("grid")}>
                    Save
                </Button>
            </Modal.Footer>
        </Modal>
    );
};
export default SavePopup;
