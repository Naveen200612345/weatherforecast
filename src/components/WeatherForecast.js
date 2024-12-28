import React from 'react';
import { Row, Col, Card } from 'react-bootstrap';

const WeatherForecast = ({ forecast }) => {
  return (
    <Row>
      {forecast.map((day, index) => (
        <Col key={index} sm={6} md={2} className="mb-4">
          <Card className="text-center">
            <Card.Body>
              <Card.Title>{day.date}</Card.Title>
              <img
                src={`https://openweathermap.org/img/wn/${day.icon}.png`}
                alt={day.condition}
              />
              
              <h5>{day.temp.max}° / {day.temp.min}°</h5>
              <p>{day.condition}</p>
            </Card.Body>
          </Card>
        </Col>
      ))}
    </Row>
  );
};

export default WeatherForecast;
