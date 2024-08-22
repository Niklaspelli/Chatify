import React from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import "../index.css";

function Home() {
  return (
    <>
      <div style={HomeContainerStyle}>
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Row className="justify-content-center w-100">
            <div className="homeH1">Välkommen till Chatify!</div>
            <div
              style={{
                color: "white",
                fontSize: "30px",
                display: "flow",
                float: "right",
              }}
            >
              Hitta din bästis och börja prata redan idag!
            </div>
          </Row>
        </Container>
      </div>{" "}
      <div className="BackgroundContainer">
        <div className="homeBackground"> </div>
      </div>
    </>
  );
}

export default Home;

const HomeContainerStyle = {
  marginTop: "50px",
  marginBottom: "15px",
  display: "flex",
  justifyContent: "center",
};
