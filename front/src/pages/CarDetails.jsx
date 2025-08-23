import React, { useEffect, useState } from "react";
import { useNavigate, useLocation } from "react-router-dom";
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
import { useDispatch, useSelector } from "react-redux";
import { getVehicles } from "../redux/slice/vehicles.slice";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function CarDetails() {
  const navigate = useNavigate();
  const location = useLocation();
  const dispatch = useDispatch();

  // Fixed: Access the correct state structure
  const { vehicles = [], loading = false } = useSelector(
    (state) => state.vehicle || {}
  );

  const [show, setShow] = useState(false);
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  // Get car data from state, if not available redirect to taxi page
  const car = location.state?.car;



  useEffect(() => {
    if (!car) {
      navigate("/taxi");
      return;
    }
    dispatch(getVehicles());
  }, [car, dispatch, navigate]);

  // Filter related cars - using both _id and id for compatibility
  const relatedCars = vehicles
    ?.filter((v) => v.make?.toLowerCase() === car.make?.toLowerCase() && v._id !== car._id)
    .slice(0, 4);

  console.log("All vehicles from Redux:", vehicles);
  console.log("Current car:", car);
  console.log("Related cars:", relatedCars);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  const handleSubmit = (e) => {
    e.preventDefault();
    toast.success("Cab booked successfully!");
    handleClose();
  };

  return (
    <>
      {/* Hero Section */}
      <section
        className="z_car_hero position-relative"
        style={{
          backgroundImage: `url(${car.images ? `http://localhost:5000${car.images}` : 'https://via.placeholder.com/800x400'})`,
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
          <h1 className="fw-bold">{car.model || car.name || "Taxi"}</h1>
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
                src={car.images ? `http://localhost:5000${car.images}` : 'https://via.placeholder.com/400x300'}
                alt={car.model || car.name}
                className="img-fluid z_car_img"
                style={{ maxHeight: '400px', objectFit: 'cover', borderRadius: '10px' }}
              />
            </div>

            {/* Car Details */}
            <div className="col-lg-7">
              <div className="text-lg-start text-center">
                <p className="text-uppercase fw-bold z_text-warning mb-1">
                  Best Taxi Service
                </p>
                <h2 className="fw-bold">{car.model || car.name}</h2>
                {car.make && (
                  <p className="text-muted mb-2">Brand: {car.make}</p>
                )}
                <div className="d-flex justify-content-md-center justify-content-lg-start flex-wrap gap-3 my-3 text-muted">
                  <span>Per KM: {car.perKmRate}</span>
                  {car.fuelType && (
                    <span>
                      <FaGasPump className="me-1" />
                      Fuel: {car.fuelType}
                    </span>
                  )}
                </div>
                <button className="z_btn_taxi mb-4" onClick={handleShow}>
                  Book Taxi Now →
                </button>
              </div>

              {/* Key Information */}
              <h5 className="fw-bold">Key Information</h5>
              <div className="row mt-3 gy-3">
                {[
                  {
                    label: "Passengers",
                    value: car.passengers || "N/A",
                    icon: <FaUsers />,
                  },
                  {
                    label: "Luggage Carry",
                    value: car.luggageCarry || "N/A",
                    icon: <FaSuitcase />,
                  },
                  {
                    label: "Taxi Doors",
                    value: car.taxiDoors || car.doors || "N/A",
                    icon: <FaDoorClosed />,
                  },
                  {
                    label: "Air Condition",
                    value: car.airCondition ? "Yes" : "No",
                    icon: <FaSnowflake />,
                  },
                  {
                    label: "GPS Navigation",
                    value: car.gpsNavigation ? "Yes" : "No",
                    icon: <FaMapMarkedAlt />,
                  },
                  {
                    label: "Category",
                    value: car.category || car.type || "Standard",
                    icon: <FaCarSide />,
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
            <p className="text-muted">
              {car.description ||
                `Experience premium comfort and reliability with our ${car.model || car.name}. 
               This well-maintained vehicle offers excellent performance, safety features, 
               and a comfortable ride for all your travel needs. Perfect for both short trips 
               and long journeys with professional service guaranteed.`}
            </p>
          </div>
        </div>
      </section>

      {/* Similar Cars Section */}
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

          {loading ? (
            <p className="text-center">Loading cars...</p>
          ) : relatedCars?.length === 0 ? (
            <div className="text-center py-5">
              <svg
                width="180"
                height="180"
                viewBox="0 0 200 200"
                role="img"
                aria-label="No similar cars"
                style={{ opacity: 0.9 }}
              >
                <defs>
                  <linearGradient id="grad" x1="0" y1="0" x2="1" y2="1">
                    <stop offset="0%" stopColor="currentColor" stopOpacity="0.15" />
                    <stop offset="100%" stopColor="currentColor" stopOpacity="0.05" />
                  </linearGradient>
                </defs>

                {/* soft backdrop */}
                <circle cx="100" cy="100" r="90" fill="url(#grad)" />

                {/* car body */}
                <g stroke="currentColor" strokeWidth="3" fill="none">
                  {/* chassis */}
                  <rect x="48" y="92" rx="8" ry="8" width="104" height="30" />
                  {/* cabin */}
                  <path d="M70 92 L92 72 H138 a8 8 0 0 1 8 8 v12" />
                  {/* windows */}
                  <path d="M96 78 H132 a4 4 0 0 1 4 4 v10 H90 Z" opacity="0.5" />
                  {/* wheels */}
                  <circle cx="72" cy="128" r="12" />
                  <circle cx="128" cy="128" r="12" />
                </g>

                {/* magnifying glass */}
                <g transform="translate(118,30)" stroke="currentColor" strokeWidth="3" fill="none">
                  <circle cx="22" cy="22" r="18" />
                  <line x1="36" y1="36" x2="52" y2="52" strokeLinecap="round" />
                </g>
              </svg>

              <h5 className="mt-3 mb-1">No similar cars found</h5>
              <p className="text-muted mb-0">Try changing make, model, or category.</p>
            </div>
          ) : (
            <div className="z_cars_container">
              <div className="z_cars_row">
                {relatedCars.map((relatedCar) => (
                  console.log("Related Car:", relatedCar),

                  <div
                    key={relatedCar._id || relatedCar.id}
                    className={`z_car_card ${hoveredCard === (relatedCar._id || relatedCar.id) ? "z_car_card_hover" : ""
                      }`}
                    onMouseEnter={() => setHoveredCard(relatedCar._id || relatedCar.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                    style={{ cursor: "pointer" }}
                    onClick={() =>
                      navigate("/CarDetails", { state: { car: relatedCar } })
                    }
                  >
                    <div className="z_car_image_container">
                      <img
                        src={
                          relatedCar.images
                            ? `http://localhost:5000${relatedCar.images}`
                            : "https://via.placeholder.com/300x200"
                        }
                        alt={relatedCar.model || relatedCar.name}
                        className="z_car_image"
                      />
                    </div>

                    <div className="z_car_card_body">
                      <h5 className="z_car_name">
                        {relatedCar.model || relatedCar.name}
                      </h5>
                      <div className="z_car_price">{relatedCar.price}</div>
                      <div className="z_car_separator"></div>

                      <div className="z_car_features">

                        <div className="z_car_feature">
                          <div className="z_car_feature_left">
                            <div className="z_car_feature_icon">
                              <FaDoorClosed size={16} />
                            </div>
                            <span>Texi Doors:</span>
                          </div>
                          <span className="z_car_feature_value"> {relatedCar.taxiDoors}</span>
                        </div>

                        <div className="z_car_feature">
                          <div className="z_car_feature_left">
                            <div className="z_car_feature_icon">
                              <FaUsers size={16} />
                            </div>
                            <span>Passengers:</span>
                          </div>
                          <span className="z_car_feature_value">
                            {relatedCar.passengers}
                          </span>
                        </div>

                        <div className="z_car_feature">
                          <div className="z_car_feature_left">
                            <div className="z_car_feature_icon">
                              <FaSuitcaseRolling size={16} />
                            </div> <span>Luggage Carry:</span>
                          </div>
                          <span className="z_car_feature_value">
                            {relatedCar.luggageCarry}
                          </span>
                        </div>


                        <div className="z_car_feature">
                          <div className="z_car_feature_left">
                            <div className="z_car_feature_icon">
                              <FaSnowflake size={16} />
                            </div> <span>Air Condition:</span>
                          </div>
                          <span className="z_car_feature_value">
                            {relatedCar.airCondition ? "Yes" : "No"}
                          </span>
                        </div>


                        <div className="z_car_feature">
                          <div className="z_car_feature_left">
                            <div className="z_car_feature_icon">
                              <FaMapMarkerAlt size={16} />
                            </div>
                            <span>GPS Navigation:</span>
                          </div>
                          <span className="z_car_feature_value">
                            {relatedCar.gpsNavigation ? "Yes" : "No"}
                          </span>
                        </div>
                      </div>


                      {/* Book Taxi Button */}
                      <button
                        className={`z_car_book_button ${hoveredButton === (relatedCar._id || relatedCar.id)
                          ? "z_car_book_button_hover"
                          : ""
                          }`}
                        onMouseEnter={() => setHoveredButton(relatedCar._id || relatedCar.id)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={(e) => {
                          e.stopPropagation();
                          setShow(true);
                        }}
                      >
                        Book Taxi Now →
                      </button>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section >

      {/* Booking Form Modal */}
      < Modal show={show} onHide={handleClose} centered >
        <Modal.Header closeButton>
          <Modal.Title>Book Your Cab - {car.model || car.name}</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            {/* Display selected car info */}
            <div className="mb-3 p-3" style={{ backgroundColor: '#f8f9fa', borderRadius: '8px' }}>
              <div className="d-flex align-items-center">
                <img
                  src={car.images ? `http://localhost:5000${car.images}` : 'https://via.placeholder.com/60x40'}
                  alt={car.model || car.name}
                  style={{ width: '60px', height: '40px', objectFit: 'cover', borderRadius: '4px' }}
                  className="me-3"
                />
                <div>
                  <h6 className="mb-0">{car.model || car.name}</h6>
                  <small className="text-muted">{car.price}</small>
                </div>
              </div>
            </div>

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
                max={car.passengers || 8}
                placeholder={`Max ${car.passengers || 8} passengers`}
                required
              />
            </Form.Group>

            <Form.Group controlId="message" className="mb-3">
              <Form.Label>Additional Message (Optional)</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                placeholder="Any special requests or additional information..."
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
      </Modal >
    </>
  );
}