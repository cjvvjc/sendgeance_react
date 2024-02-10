import React, { forwardRef, useEffect, useState } from "react";
import { Button, Row, Col } from "react-bootstrap";
import axios from "axios";
import { useSession } from "../context/SessionContext";

const TryHardTracker = forwardRef(({ startDate, endDate }, ref) => {
  const { sessionData, updateSession } = useSession();

  const handleIncrement = (difficulty) => {
    const newCount = (sessionData[`${difficulty}Count`] || 0) + 1;

    // Update the session context
    updateSession({ [`${difficulty}Count`]: newCount });
  };

  const handleDecrement = (difficulty) => {
    const newCount = Math.max(0, (sessionData[`${difficulty}Count`] || 0) - 1);

    // Update the session context
    updateSession({ [`${difficulty}Count`]: newCount });
  };

  return (
    <div
      style={{
        position: "fixed",
        bottom: 0,
        width: "100%",
        background: "#ffffff",
        marginLeft: "200px",
        height: "80px",
      }}
    >
      <Row className="mt-4">
        <Col>
          <Button
            variant="warning"
            className="mr-2"
            onClick={() => handleDecrement("pathetic")}
          >
            -
          </Button>
          {" Pathetic: "} {sessionData.patheticCount || 0}{" "}
          <Button
            variant="warning"
            className="ml-2"
            onClick={() => handleIncrement("pathetic")}
          >
            +
          </Button>
        </Col>
        <Col>
          <Button
            variant="secondary"
            className="mr-2"
            onClick={() => handleDecrement("medium")}
          >
            -
          </Button>
          {" Medium: "} {sessionData.mediumCount || 0}{" "}
          <Button
            variant="secondary"
            className="ml-2"
            onClick={() => handleIncrement("medium")}
          >
            +
          </Button>
        </Col>
        <Col>
          <Button
            variant="danger"
            className="mr-2"
            onClick={() => handleDecrement("hard")}
          >
            -
          </Button>
          {" Hard: "} {sessionData.hardCount || 0}{" "}
          <Button
            variant="danger"
            className="ml-2"
            onClick={() => handleIncrement("hard")}
          >
            +
          </Button>
        </Col>
        <Col>
          <Button
            variant="primary"
            className="mr-2"
            onClick={() => handleDecrement("good")}
          >
            -
          </Button>
          {" Good: "} {sessionData.goodCount || 0}{" "}
          <Button
            variant="primary"
            className="ml-2"
            onClick={() => handleIncrement("good")}
          >
            +
          </Button>
        </Col>
      </Row>
    </div>
  );
});

export default TryHardTracker;
