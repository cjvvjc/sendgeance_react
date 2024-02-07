import React, { forwardRef, useEffect, useState } from 'react';
import { Button, Row, Col } from 'react-bootstrap';
import { useSession } from '../context/SessionContext';
import axios from 'axios';

const TryHardTracker = forwardRef(({ startDate, endDate }, ref) => {
  const { updateSession, sessionData } = useSession();

  const [patheticCount, setPatheticCount] = useState(0);
  const [mediumCount, setMediumCount] = useState(0);
  const [hardCount, setHardCount] = useState(0);

  useEffect(() => {
    const fetchCounts = async () => {
      try {
        const response = await axios.get('http://localhost:5000/session/latest');
        if (response.data) {
          setPatheticCount(response.data.patheticCount || 0);
          setMediumCount(response.data.mediumCount || 0);
          setHardCount(response.data.hardCount || 0);
        }
      } catch (error) {
        console.error('Error fetching counts:', error);
      }
    };

    fetchCounts();
  }, []);


  const handleIncrement = (difficulty) => {
    let newCount = (sessionData[`${difficulty}Count`] || 0) + 1;
    
    // Update the local state
    switch (difficulty) {
      case 'pathetic':
        setPatheticCount(newCount);
        break;
      case 'medium':
        setMediumCount(newCount);
        break;
      case 'hard':
        setHardCount(newCount);
        break;
      default:
        break;
    }

    // Update the session context
    updateSession({ ...sessionData, [`${difficulty}Count`]: newCount });
  };

  const handleDecrement = (difficulty) => {
    let newCount = Math.max(0, (sessionData[`${difficulty}Count`] || 0) - 1);

    // Update the local state
    switch (difficulty) {
      case 'pathetic':
        setPatheticCount(newCount);
        break;
      case 'medium':
        setMediumCount(newCount);
        break;
      case 'hard':
        setHardCount(newCount);
        break;
      default:
        break;
    }

    // Update the session context
    updateSession({ ...sessionData, [`${difficulty}Count`]: newCount });
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
});

export default TryHardTracker;
