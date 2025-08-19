import React, { useState } from "react";
import { useNavigate } from "react-router-dom";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  FaCarSide,
  FaUsers,
  FaSuitcase,
  FaCogs,
  FaCalendarAlt,
  FaGasPump,
  FaSnowflake,
  FaMapMarkedAlt,
  FaUserTie,
  FaCheck,
  FaDoorClosed,
  FaSuitcaseRolling,
  FaMapMarkerAlt,
  FaDollarSign,
  FaMoneyBillWave,
} from "react-icons/fa";
import "../style/singlecar.css";
import "../style/z_app.css";
import Footer from "../component/Footer";

export default function CarDetails() {
  const navigate = useNavigate();
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cab booked successfully!");
    handleClose();
  };

  const car = {
    name: "Mercedes Benz Taxi",
    baseRate: "$2.30/km",
    bookingFee: "$0.99",
    info: [
      { icon: <FaCarSide />, label: "Taxi Doors", value: "4" },
      { icon: <FaUsers />, label: "Passengers", value: "4" },
      { icon: <FaSuitcase />, label: "Luggage Carry", value: "3" },
      { icon: <FaCogs />, label: "Transmission", value: "Automatic" },
      { icon: <FaCalendarAlt />, label: "Build Year", value: "2023" },
      { icon: <FaGasPump />, label: "Fuel Type", value: "Diesel" },
      { icon: <FaSnowflake />, label: "Air Condition", value: "Yes" },
      { icon: <FaMapMarkedAlt />, label: "GPS Navigation", value: "Yes" },
      { icon: <FaUserTie />, label: "Driver Choose", value: "Yes" },
    ],
    description:
      "Many variations of passages of Lorem Ipsum available but the majority have suffered alteration in some form...",
    features: [
      "Manual AC",
      "Premium sound system",
      "Memory seat",
      "Navigation system",
      "Android Auto",
      "Adaptive Cruise Control",
      "Heated front seats",
      "Apple CarPlay",
      "Cooler Seat",
      "Heated rear seats",
      "Panoramic roof",
      "Touch Screen",
    ],
    image:
      "https://i.pinimg.com/originals/6a/ac/da/6aacda21c359bfe6a34d8f8920b0c657.jpg",
  };

  const carData = [
    {
      id: 1,
      name: "BMW M5 2019 MODEL",
      image:
        "https://daxstreet.com/wp-content/uploads/2025/03/2019-BMW-M5-Competition.jpg",
      price: "$1.25/km",
      doors: 4,
      passengers: 4,
      luggage: 2,
      airCondition: "Yes",
      gps: "Yes",
    },
    {
      id: 2,
      name: "SUV PREMIUM MODEL",
      image:
        "https://content.assets.pressassociation.io/2024/11/26171902/51ad881d-b38b-4d93-b57d-e320a96f7046.jpg?w=1280",
      price: "$2.50/km",
      doors: 4,
      passengers: 6,
      luggage: 4,
      airCondition: "Yes",
      gps: "Yes",
    },
    {
      id: 3,
      name: "MINI COOPER MODEL",
      image:
        "https://i.pinimg.com/originals/cb/f5/43/cbf543ffda479dc025d686e80df8648e.jpg",
      price: "$0.85/km",
      doors: 2,
      passengers: 3,
      luggage: 2,
      airCondition: "Yes",
      gps: "Yes",
    },
    {
      id: 4,
      name: "LUXURY SEDAN MODEL",
      image:
        "https://www.cadillaccanada.ca/content/dam/cadillac/na/canada/english/index/navigation/vehicles/2025/vehicles-drp-sedans-25-ct4.png?imwidth=1200",
      price: "$3.75/km",
      doors: 4,
      passengers: 4,
      luggage: 3,
      airCondition: "Yes",
      gps: "Yes",
    },
  ];

  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  return (
    <>
      {/* Hero Section */}
      <section
        className="z_car_hero position-relative"
        style={{
          backgroundImage: `url(${car.image})`,
          backgroundSize: "cover",
          backgroundPosition: "center",
          height: "60vh",
        }}
      >
        <div
          className="z_car_overlay position-absolute top-0 start-0 w-100 h-100"
          style={{
            backgroundColor: "rgba(0,0,0,0.5)",
          }}
        ></div>
        <div className="position-absolute top-50 start-50 translate-middle text-center text-white">
          <h1 className="fw-bold">{car.name}</h1>
          <p className="mb-0">Best Taxi Service in Town</p>
        </div>
      </section>

      {/* Car Details Section */}
      <section className="z_car_details py-5">
        <div className="container">
          <div className="row g-4 align-items-start">
            {/* Car Image */}
            <div className="col-lg-5 text-center">
              <img
                src={car.image}
                alt={car.name}
                className="img-fluid z_car_img"
              />
            </div>

            {/* Car Details */}
            <div className="col-lg-7">
              <div className="text-lg-start text-center">
                <p className="text-uppercase fw-bold z_text-warning mb-1">
                  Best Taxi Service
                </p>
                <h2 className="fw-bold">{car.name}</h2>
                <div className="d-flex justify-content-md-center justify-content-lg-start flex-wrap gap-3 my-3 text-muted">
                  <span>Base Rate: {car.baseRate}</span>
                  <span>
                    <FaGasPump className="me-1" />
                    Booking Fee: {car.bookingFee}
                  </span>
                </div>
                <button className="z_btn_taxi  mb-4">Book Taxi Now →</button>
              </div>

              {/* Key Information */}
              <h5 className="fw-bold">Key Information</h5>
              <div className="row mt-3 gy-3">
                {[
                  {
                    label: "Passengers",
                    value: car.passengers,
                    icon: <FaUsers />,
                  },
                  {
                    label: "Luggage Carry",
                    value: car.luggageCarry,
                    icon: <FaSuitcase />,
                  },
                  {
                    label: "Air Condition",
                    value: car.airCondition,
                    icon: <FaSnowflake />,
                  },
                  {
                    label: "GPS Navigation",
                    value: car.gpsNavigation,
                    icon: <FaMapMarkedAlt />,
                  },
                  {
                    label: "Per Km Rate",
                    value: car.perKmRate,
                    icon: <FaDollarSign />,
                  },
                  {
                    label: "Extra Km Rate",
                    value: car.extraKmRate,
                    icon: <FaMoneyBillWave />,
                  },
                ].map((item, idx) => (
                  <div key={idx} className="col-12 col-sm-6 col-md-6 col-lg-4">
                    <div className="d-flex align-items-center">
                      <div className="z_icon_circle me-2">{item.icon}</div>
                      <div>
                        <div className="fw-semibold">{item.label}</div>
                        <small className="text-muted">{item.value}</small>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>

          {/* Description */}
          <div className="mt-5">
            <h4 className="fw-bold">Description</h4>
            <p className="text-muted">{car.description}</p>
          </div>

          {/* Features */}
          <div className="mt-4">
            <h4 className="fw-bold">Taxi Features</h4>
            <div className="row mt-3 gy-2">
              {car.features.map((feature, idx) => (
                <div key={idx} className="col-sm-6 col-md-4">
                  <FaCheck className=" me-2" /> {feature}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Our Cab Let's Check Available Cars*/}
      <section className="z_avlbl_section py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="z_avlbl_title">
              Similar Cars —{" "}
              <span className="z_default_txt"> Explore Related Options</span>
            </h2>
            <p className="z_avlbl_subtitle">
              Discover cars with similar style, features, and performance to
              match your needs perfectly.
            </p>
          </div>

          {/* Car Cards */}
          <div className="z_cars_container">
            <div className="z_cars_row">
              {carData.map((car) => (
                <div
                  key={car.id}
                  className={`z_car_card ${
                    hoveredCard === car.id ? "z_car_card_hover" : ""
                  }`}
                  onMouseEnter={() => setHoveredCard(car.id)}
                  onMouseLeave={() => setHoveredCard(null)}
                >
                  <div className="z_car_image_container">
                    <img
                      src={car.image}
                      alt={car.name}
                      className="z_car_image"
                    />
                  </div>

                  <div className="z_car_card_body">
                    <h5 className="z_car_name">{car.name}</h5>
                    <div className="z_car_price">{car.price}</div>
                    <div className="z_car_separator"></div>

                    <div className="z_car_features">
                      <div className="z_car_feature">
                        <div className="z_car_feature_left">
                          <div className="z_car_feature_icon">
                            <FaDoorClosed size={16} />
                          </div>
                          <span>Taxi Doors:</span>
                        </div>
                        <span className="z_car_feature_value">{car.doors}</span>
                      </div>

                      <div className="z_car_feature">
                        <div className="z_car_feature_left">
                          <div className="z_car_feature_icon">
                            <FaUsers size={16} />
                          </div>
                          <span>Passengers:</span>
                        </div>
                        <span className="z_car_feature_value">
                          {car.passengers}
                        </span>
                      </div>

                      <div className="z_car_feature">
                        <div className="z_car_feature_left">
                          <div className="z_car_feature_icon">
                            <FaSuitcaseRolling size={16} />
                          </div>
                          <span>Luggage Carry:</span>
                        </div>
                        <span className="z_car_feature_value">
                          {car.luggage}
                        </span>
                      </div>

                      <div className="z_car_feature">
                        <div className="z_car_feature_left">
                          <div className="z_car_feature_icon">
                            <FaSnowflake size={16} />
                          </div>
                          <span>Air Condition:</span>
                        </div>
                        <span className="z_car_feature_value">
                          {car.airCondition}
                        </span>
                      </div>

                      <div className="z_car_feature">
                        <div className="z_car_feature_left">
                          <div className="z_car_feature_icon">
                            <FaMapMarkerAlt size={16} />
                          </div>
                          <span>GPS Navigation:</span>
                        </div>
                        <span className="z_car_feature_value">{car.gps}</span>
                      </div>
                    </div>

                    {/* Book Taxi Button */}
                    <button
                      className={`z_car_book_button ${
                        hoveredButton === car.id
                          ? "z_car_book_button_hover"
                          : ""
                      }`}
                      onMouseEnter={() => setHoveredButton(car.id)}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={handleShow}
                    >
                      Book Taxi Now →
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Booking Form Modal */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>Book Your Cab</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="name">
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter your name"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control
                    type="tel"
                    placeholder="Enter phone number"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="pickup">
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter pickup location"
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="drop">
                  <Form.Label>Drop Location</Form.Label>
                  <Form.Control
                    type="text"
                    placeholder="Enter drop location"
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="date">
                  <Form.Label>Pickup Date</Form.Label>
                  <Form.Control type="date" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="time">
                  <Form.Label>Pickup Time</Form.Label>
                  <Form.Control type="time" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="passengers" className="mb-3">
              <Form.Label>Number of Passengers</Form.Label>
              <Form.Control
                type="number"
                min="1"
                placeholder="Enter passengers"
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit">
              Confirm Booking
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>

    </>
  );
}
