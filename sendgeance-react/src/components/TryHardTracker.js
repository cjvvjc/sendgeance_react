import React, { useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const TryHardTracker = ({ startDate, endDate }) => {
  const [patheticCount, setPatheticCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  const handleIncrement = async (difficulty) => {
    // Update the count and send to the server
    switch (difficulty) {
      case 'pathetic':
        setPatheticCount(patheticCount + 1);
        await updateDifficultyCount('pathetic', patheticCount + 1);
        break;
      case 'medium':
        setMediumCount(mediumCount + 1);
        await updateDifficultyCount('medium', mediumCount + 1);
        break;
      case 'hard':
        setHardCount(hardCount + 1);
        await updateDifficultyCount('hard', hardCount + 1);
        break;
      default:
        break;
    }
  };

  const handleDecrement = async (difficulty) => {
    // Update the count and send to the server
    switch (difficulty) {
      case 'pathetic':
        setPatheticCount(Math.max(0, patheticCount - 1));
        await updateDifficultyCount('pathetic', Math.max(0, patheticCount - 1));
        break;
      case 'medium':
        setMediumCount(Math.max(0, mediumCount - 1));
        await updateDifficultyCount('medium', Math.max(0, mediumCount - 1));
        break;
      case 'hard':
        setHardCount(Math.max(0, hardCount - 1));
        await updateDifficultyCount('hard', Math.max(0, hardCount - 1));
        break;
      default:
        break;
    }
  };

  const updateDifficultyCount = async (difficulty, count) => {
    try {
      await axios.post('http://localhost:5000/session/difficulty/update', {
        startDate,
        endDate,
        difficulty,
        count,
      });
    } catch (error) {
      console.error('Error updating difficulty count:', error);
    }
  };

  return (
    <React.Fragment>
      <div style={{ position: 'fixed', bottom: 0, width: '100%', background: '#ffffff', padding: '10px', marginLeft: "200px" }}>
        <Row className="mt-4">
          <Col >
            <Button variant="warning" className="mr-2" onClick={() => handleDecrement('pathetic')}>
              -
            </Button>
            {" Pathetic: "} {patheticCount} {" "}
            <Button variant="warning" className="ml-2" onClick={() => handleIncrement('pathetic')}>
              +
            </Button>
          </Col>
          <Col>
            <Button variant="secondary" className="mr-2" onClick={() => handleDecrement('medium')}>
              -
            </Button>
            {" Medium: "} {mediumCount} {" "}
            <Button variant="secondary" className="ml-2" onClick={() => handleIncrement('medium')}>
              +
            </Button>
          </Col>
          <Col>
            <Button variant="danger" className="mr-2" onClick={() => handleDecrement('hard')}>
              -
            </Button>
            {" Hard: "} {hardCount} {" "}
            <Button variant="danger" className="ml-2" onClick={() => handleIncrement('hard')}>
              +
            </Button>
          </Col>
        </Row>
      </div>
    </React.Fragment>
    
  );
};

export default TryHardTracker;
