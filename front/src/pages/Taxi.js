import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import '../style/z_app.css'
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';
import { IoSearch, IoCloseSharp } from 'react-icons/io5';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../component/Footer';
import { getVehicles } from '../redux/slice/vehicles.slice';

export default function Taxi() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [show, setShow] = useState(false);

  // Redux state
  const vehicles = useSelector((state) => state.vehicle.vehicles);

  console.log("vehicles", vehicles);

  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  // Enhanced filter function for better search
  const filteredCars = useMemo(() => {
    if (!searchTerm.trim()) {
      return vehicles || [];
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return (vehicles || []).filter(car => {
      // Helper function to safely convert to string and search
      const searchInField = (value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      };

      // Check if any of these fields contain the search term
      return (
        searchInField(car.name) ||
        searchInField(car.model) ||
        searchInField(car.make) ||
        searchInField(car.category) ||
        searchInField(car.price) ||
        searchInField(car.passengers) ||
        searchInField(car.taxiDoors) ||
        searchInField(car.doors) ||
        searchInField(car.luggageCarry) ||
        searchInField(car.type) ||
        searchInField(car.fuelType) ||
        // Add more fields as needed based on your car object structure
        (car.airCondition && searchLower.includes('ac')) ||
        (car.airCondition && searchLower.includes('air')) ||
        (car.gpsNavigation && searchLower.includes('gps')) ||
        (car.gpsNavigation && searchLower.includes('navigation'))
      );
    });
  }, [searchTerm, vehicles]);

  // Modal handlers
  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    // Search is handled by the useMemo, no additional action needed
    console.log(`Searching for: ${searchTerm}`);
  };

  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Form submitted successfully ✅");
    handleClose();
  };

  return (
    <>
      {/* Hero Section for All Cabs Page */}
      <section className="z_allcabs_hero">
        <div className="z_allcabs_hero_overlay"></div>
        <div className="container h-100">
          <div className="row h-100 align-items-center justify-content-center">
            <div className="col-lg-8">
              <div className="z_allcabs_hero_content">
                <h1>Choose Your Perfect Ride</h1>
                <p>From budget-friendly options to premium rides, find the ideal cab for your journey.</p>
                <a href="#book" className="z_allcabs_btn">Book Now</a>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Our Cab Let's Check Available Cars*/}
      <section className="z_avlbl_section pt-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="z_avlbl_title">
              Our Cab — <span className="z_default_txt"> Let's Check Available Cars</span>
            </h2>
            <p className="z_avlbl_subtitle">
              Choose your perfect ride from our fleet of clean, comfortable, and
              well-maintained cars.
            </p>
          </div>

          {/* Search Section */}
          <section className="z_search_section mb-4" style={{ backgroundColor: '#f8f9fa', padding: '20px 0', borderRadius: '10px' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-8 col-md-10">
                  <div className="z_search_container">
                    <h4 className="text-center mb-3">Find Your Perfect Cab</h4>
                    <form onSubmit={handleSearchSubmit}>
                      <div className="z_search_bar d-flex" style={{
                        border: '2px solid #ddd',
                        borderRadius: '25px',
                        overflow: 'hidden',
                        backgroundColor: 'white',
                        boxShadow: '0 2px 10px rgba(0,0,0,0.1)'
                      }}>
                        <input
                          type="text"
                          placeholder="Search by car name, model, brand..."
                          className="form-control border-0"
                          value={searchTerm}
                          onChange={handleSearchChange}
                          style={{
                            boxShadow: 'none',
                            fontSize: '16px',
                            padding: '15px 20px'
                          }}
                        />
                        {searchTerm && (
                          <button
                            type="button"
                            className="btn"
                            onClick={handleClearSearch}
                            style={{
                              backgroundColor: 'transparent',
                              border: 'none',
                              padding: '15px 10px',
                              color: '#999'
                            }}
                            title="Clear search"
                          >
                            <IoCloseSharp style={{ fontSize: "1.2rem" }} />
                          </button>
                        )}
                        <button
                          type="submit"
                          className="btn"
                          style={{
                            backgroundColor: '#0f6e55',
                            border: 'none',
                            padding: '15px 25px',
                            borderRadius: searchTerm ? '0' : '0 25px 25px 0'
                          }}
                        >
                          <IoSearch style={{ fontSize: "1.2rem", color: "#ffffff" }} />
                        </button>
                      </div>
                    </form>
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* No Results Message */}
          {filteredCars.length === 0 && searchTerm && (
            <div className="text-center py-5">
              <div className="mb-4">
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  width="64"
                  height="64"
                  viewBox="0 0 24 24"
                  fill="none"
                  stroke="#6c757d"
                  strokeWidth="2"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                >
                  <circle cx="11" cy="11" r="8"></circle>
                  <line x1="21" y1="21" x2="16.65" y2="16.65"></line>
                </svg>
              </div>



              <h4 className="text-muted">No cars found</h4>
              <p className="text-muted">
                We couldn't find any cars matching "<strong>{searchTerm}</strong>".<br />
                Try searching with different keywords or browse all available cars.
              </p>
            </div>
          )}

          {/* Car Cards */}
          {filteredCars.length > 0 && (
            <div className="z_cars_container my-4 container">
              <div className="row g-4">
                {filteredCars.map((car) => (
                  <div
                    key={car.id}
                    className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
                    onMouseEnter={() => setHoveredCard(car.id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div
                      className={`z_car_card ${hoveredCard === car.id ? "z_car_card_hover" : ""}`}
                      style={{ cursor: "pointer" }}
                      onClick={() => navigate('/CarDetails', { state: { car } })}
                    >
                      <div className="z_car_image_container" style={{ position: 'relative' }}>
                        <img
                          src={`http://localhost:5000${car.images}`}
                          alt={`${car.model || car.name} - Taxi`}
                          width="150"
                          style={{ borderRadius: '8px' }}
                        />
                        {/* Brand Badge */}
                        {car.make && (
                          <div
                            className="z_brand_badge"
                            style={{
                              position: 'absolute',
                              top: '8px',
                              right: '8px',
                              backgroundColor: '#0f6e55',
                              color: 'white',
                              padding: '4px 8px',
                              borderRadius: '12px',
                              fontSize: '11px',
                              fontWeight: '600',
                              textTransform: 'uppercase',
                              letterSpacing: '0.5px',
                              boxShadow: '0 2px 4px rgba(0,0,0,0.2)',
                              zIndex: '2'
                            }}
                          >
                            {car.make}
                          </div>
                        )}
                      </div>

                      <div className="z_car_card_body">
                        <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start', marginBottom: '8px' }}>
                          <h5 className="z_car_name" style={{ margin: 0, flex: 1 }}>
                            {car.model || car.name}
                          </h5>

                        </div>
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
                            <span className="z_car_feature_value">{car.taxiDoors || car.doors}</span>
                          </div>

                          <div className="z_car_feature">
                            <div className="z_car_feature_left">
                              <div className="z_car_feature_icon">
                                <FaUsers size={16} />
                              </div>
                              <span>Passengers:</span>
                            </div>
                            <span className="z_car_feature_value">{car.passengers}</span>
                          </div>

                          <div className="z_car_feature">
                            <div className="z_car_feature_left">
                              <div className="z_car_feature_icon">
                                <FaSuitcaseRolling size={16} />
                              </div>
                              <span>Luggage Carry:</span>
                            </div>
                            <span className="z_car_feature_value">{car.luggageCarry}</span>
                          </div>

                          <div className="z_car_feature">
                            <div className="z_car_feature_left">
                              <div className="z_car_feature_icon">
                                <FaSnowflake size={16} />
                              </div>
                              <span>Air Condition:</span>
                            </div>
                            <span className="z_car_feature_value">
                              {car.airCondition ? "Yes" : "No"}
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
                              {car.gpsNavigation ? "Yes" : "No"}
                            </span>
                          </div>
                        </div>

                        {/* Book Taxi Button */}
                        <button
                          className={`z_car_book_button ${hoveredButton === car.id ? "z_car_book_button_hover" : ""}`}
                          onMouseEnter={() => setHoveredButton(car.id)}
                          onMouseLeave={() => setHoveredButton(null)}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            handleShow();
                          }}
                        >
                          Book Taxi Now →
                        </button>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </section>

      {/* Booking Form Modal */}
      <Modal show={show} onHide={handleClose} centered size="lg">
        <Modal.Header closeButton>
          <Modal.Title>Make Your Booking Today</Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleSubmit}>
          <Modal.Body>
            <p className="text-muted">
              It is a long established fact that a reader will be distracted by the readable content of a page
              when looking at its layout. The point of using it is that it has distribution of letters to
              using content here making it look like readable.
            </p>
            <hr />

            <Row className="mb-3">
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Full Name</Form.Label>
                  <Form.Control type="text" placeholder="Your Name" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" placeholder="Your Phone" required />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" placeholder="Your Email" required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pick Up Location</Form.Label>
                  <Form.Control type="text" placeholder="Type Location" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Drop Off Location</Form.Label>
                  <Form.Control type="text" placeholder="Type Location" required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Passengers</Form.Label>
                  <Form.Control type="number" min="1" placeholder="Passengers" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cab Type</Form.Label>
                  <Form.Select required>
                    <option value="">Choose Cab</option>
                    <option>Sedan</option>
                    <option>SUV</option>
                    <option>Mini</option>
                    <option>Luxury</option>
                  </Form.Select>
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pick Up Date</Form.Label>
                  <Form.Control type="date" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pick Up Time</Form.Label>
                  <Form.Control type="time" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Your Message</Form.Label>
              <Form.Control as="textarea" rows={3} placeholder="Write Your Message" />
            </Form.Group>

            <Form.Group className="mb-3">
              <Form.Check
                type="checkbox"
                label="By using this form you agree to our terms & conditions."
                required
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button className='z_book_now' type="submit">
              Book Your Taxi →
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}