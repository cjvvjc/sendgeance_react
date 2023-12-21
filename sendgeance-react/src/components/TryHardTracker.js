import React from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import axios from 'axios';

const TryHardTracker = ({ startDate, endDate, patheticCount, setPatheticCount, mediumCount, setMediumCount, hardCount, setHardCount }) => {

  const handleIncrement = async (difficulty) => {
    let newCount;
    switch (difficulty) {
      case 'pathetic':
        newCount = patheticCount + 1;
        setPatheticCount(newCount);
        break;
      case 'medium':
        newCount = mediumCount + 1;
        setMediumCount(newCount);
        break;
      case 'hard':
        newCount = hardCount + 1;
        setHardCount(newCount);
        break;
      default:
        break;
    }
  
    try {
      await updateDifficultyCount(difficulty, newCount);
    } catch (error) {
      console.error('Error updating difficulty count:', error);
    }
  };

  const handleDecrement = async (difficulty) => {
    let newCount;
    switch (difficulty) {
      case 'pathetic':
        newCount = Math.max(0, patheticCount - 1);
        setPatheticCount(newCount);
        break;
      case 'medium':
        newCount = Math.max(0, mediumCount - 1);
        setMediumCount(newCount);
        break;
      case 'hard':
        newCount = Math.max(0, hardCount - 1);
        setHardCount(newCount);
        break;
      default:
        break;
    }
  
    try {
      await updateDifficultyCount(difficulty, newCount);
    } catch (error) {
      console.error('Error updating difficulty count:', error);
    }
  };

  const updateDifficultyCount = async (difficulty, count) => {
    try {
        await axios.patch('http://localhost:5000/session/update-counts', {
            startDate,
            endDate,
            [`${difficulty}Count`]: count,
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
