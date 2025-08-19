import React, { useState, useMemo } from 'react';
import '../style/z_app.css'
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';
import { IoSearch, IoCloseSharp } from 'react-icons/io5';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../component/Footer';

export default function Taxi() {
  const navigate = useNavigate();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [isSearching, setIsSearching] = useState(false);

  // Grid
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
      category: "luxury",
      brand: "BMW"
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
      category: "suv",
      brand: "Premium"
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
      category: "compact",
      brand: "MINI"
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
      category: "luxury",
      brand: "Cadillac"
    },
    {
      id: 5,
      name: "TOYOTA INNOVA CRYSTA",
      image:
        "https://cdn.wheel-size.com/automobile/body/toyota-innova-crysta-2015-2021-1602848743.9643602.jpg",
      price: "$1.80/km",
      doors: 4,
      passengers: 7,
      luggage: 4,
      airCondition: "Yes",
      gps: "Yes",
      category: "mpv",
      brand: "Toyota"
    },
    {
      id: 6,
      name: "TESLA MODEL X",
      image:
        "https://avatars.mds.yandex.net/i?id=647dcbec59b61f670f5b655bd3952cfe66794f21-4599039-images-thumbs&n=13",
      price: "$4.50/km",
      doors: 4,
      passengers: 6,
      luggage: 3,
      airCondition: "Yes",
      gps: "Yes",
      category: "electric",
      brand: "Tesla"
    },
    {
      id: 7,
      name: "MERCEDES-BENZ E-CLASS",
      image:
        "https://avatars.mds.yandex.net/i?id=9a888d6456cac34b8da2016b907f20c5cc36f651-4258580-images-thumbs&n=13",
      price: "$3.20/km",
      doors: 4,
      passengers: 4,
      luggage: 3,
      airCondition: "Yes",
      gps: "Yes",
      category: "luxury",
      brand: "Mercedes"
    },
    {
      id: 8,
      name: "HONDA CITY ZX",
      image:
        "https://delen.s3.ap-southeast-1.amazonaws.com/Honda_city_hybrid_ehev_main_image_7b9e60fff9.jpg",
      price: "$1.10/km",
      doors: 4,
      passengers: 5,
      luggage: 3,
      airCondition: "Yes",
      gps: "Yes",
      category: "sedan",
      brand: "Honda"
    },
  ];


  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);

  // Search functionality
  const handleSearch = () => {
    if (searchTerm.trim()) {
      setIsSearching(true);
    }
  };

  const handleClear = () => {
    setSearchTerm('');
    setIsSearching(false);
  };

  // Filter cars based on search term
  const filteredCars = useMemo(() => {
    if (!searchTerm.trim()) {
      return carData;
    }

    const searchLower = searchTerm.toLowerCase();
    return carData.filter(car =>
      car.name.toLowerCase().includes(searchLower) ||
      car.brand.toLowerCase().includes(searchLower) ||
      car.category.toLowerCase().includes(searchLower) ||
      car.price.toLowerCase().includes(searchLower) ||
      car.passengers.toString().includes(searchLower) ||
      car.doors.toString().includes(searchLower)
    );
  }, [searchTerm]);

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

          {/* No Results Message */}
          {filteredCars.length === 0 && searchTerm && (
            <div className="text-center py-5">
              <h4 className="text-muted">No cars found</h4>
              <p className="text-muted">Try searching with different keywords or clear the search.</p>
              <button
                className="btn btn-warning"
                onClick={handleClear}
              >
                Clear Search
              </button>
            </div>
          )}

          {/* Search Section */}
          <section className="z_search_section" style={{ backgroundColor: '#f8f9fa' }}>
            <div className="container">
              <div className="row justify-content-center">
                <div className="col-lg-6 col-md-8">
                  <div className="z_search_container">
                    {/* <h4 className="text-center mb-3">Find Your Perfect Cab</h4> */}
                    <div className="z_search_bar d-flex" style={{
                      border: '2px solid #ddd',
                      borderRadius: '25px',
                      overflow: 'hidden',
                      backgroundColor: 'white'
                    }}>
                      <input
                        type="text"
                        placeholder="Search by car name, brand, category, price..."
                        className="form-control border-0"
                        value={searchTerm}
                        onChange={(e) => setSearchTerm(e.target.value)}
                        onKeyDown={(e) => {
                          if (e.key === "Enter") {
                            e.preventDefault();
                            handleSearch();
                          }
                        }}
                        style={{
                          boxShadow: 'none',
                          fontSize: '16px',
                          padding: '12px 20px'
                        }}
                      />
                      <button
                        type="button"
                        className="btn"
                        onClick={isSearching ? handleClear : handleSearch}
                        style={{
                          backgroundColor: '#0f6e55',
                          border: 'none',
                          padding: '12px 20px',
                          borderRadius: '0 25px 25px 0'
                        }}
                        onMouseDown={(e) => e.preventDefault()}
                      >
                        {isSearching ? (
                          <IoCloseSharp style={{ fontSize: "1.2rem", color: "#000" }} />
                        ) : (
                          <IoSearch style={{ fontSize: "1.2rem", color: "#ffffffff" }} />
                        )}
                      </button>
                    </div>
                    {searchTerm && (
                      <div className="text-center mt-2">
                        <small className="text-muted">
                          {filteredCars.length} car{filteredCars.length !== 1 ? 's' : ''} found
                          {searchTerm && ` for "${searchTerm}"`}
                        </small>
                      </div>
                    )}
                  </div>
                </div>
              </div>
            </div>
          </section>

          {/* Car Cards */}
          {filteredCars.length > 0 && (
            <div className="z_cars_container container">
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
                      onClick={() => navigate('/CarDetails')}
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
                          className={`z_car_book_button ${hoveredButton === car.id ? "z_car_book_button_hover" : ""
                            }`}
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

      <Footer />
    </>
  );
}