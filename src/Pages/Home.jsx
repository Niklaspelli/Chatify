import React from "react";
import { Container, Button, Col, Row } from "react-bootstrap";
import "../index.css";

function Home() {
  return (
    <>
      <div style={HomeContainerStyle}>
        <Container className="d-flex justify-content-center align-items-center vh-100">
          <Row className="justify-content-center w-100">
            <h1
              className="homeH1" /* style={{ fontSize: "70px", color: "white" }} */
            >
              Välkommen till Chatify!
            </h1>
            <div style={{ color: "white", fontSize: "40px" }}>
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
