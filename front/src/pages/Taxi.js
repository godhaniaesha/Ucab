import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import '../style/z_app.css'
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';
import { IoSearch, IoCloseSharp } from 'react-icons/io5';
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../component/Footer';
import { getVehicles } from '../redux/slice/vehicles.slice';
import { createBooking, resetBookingStatus } from '../redux/slice/passengers.slice';
import { fetchUserProfile } from '../redux/slice/auth.slice'; // Import fetchUserProfile

export default function Taxi() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Form state
  const [formData, setFormData] = useState({
    fullName: '',
    phone: '',
    email: '',
    pickupLocation: '',
    dropoffLocation: '',
    passengers: '',
    cabModel: '',
    pickupDate: '',
    pickupTime: '',
    message: ''
  });

  // Redux state
  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const { profile } = useSelector((state) => state.auth); // Get profile from auth slice
  // const { error, success } = useSelector((state) => state.passengers);

  useEffect(() => {
    dispatch(getVehicles());
    // Fetch user profile to get bank details
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
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

  // Function to check if user has bank details
  const checkBankDetails = () => {
    console.log('Profile data:', profile);
    console.log('Bank details:', profile?.bankDetails);
    
    if (!profile || !profile.bankDetails) {
      return false;
    }

    const { bankDetails } = profile;
    
    // Check if essential bank details are present
    const hasAccountNumber = bankDetails.accountNumber && bankDetails.accountNumber.trim() !== '';
    const hasAccountHolderName = bankDetails.accountHolderName && bankDetails.accountHolderName.trim() !== '';
    const hasIfscCode = bankDetails.ifscCode && bankDetails.ifscCode.trim() !== '';
    const hasBankName = bankDetails.bankName && bankDetails.bankName.trim() !== '';

    return hasAccountNumber && hasAccountHolderName && hasIfscCode && hasBankName;
  };

  // Modal handlers
  const handleShow = (car = null) => {
    // Check bank details before showing modal
    if (!checkBankDetails()) {
      alert('Please add your bank details in Profile section before booking a taxi. Required: Account Number, Account Holder Name, IFSC Code, and Bank Name.');
      return;
    }

    if (car) {
      setSelectedCar(car);
      // Pre-fill form with car details
      setFormData(prev => ({
        ...prev,
        passengers: car.passengers || '',
        cabModel: car.model || car.name || ''
      }));
    }
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCar(null);
    // Reset form
    setFormData({
      fullName: '',
      phone: '',
      email: '',
      pickupLocation: '',
      dropoffLocation: '',
      passengers: '',
      cabModel: '',
      pickupDate: '',
      pickupTime: '',
      message: ''
    });
  };

  // Search handlers
  const handleSearchChange = (e) => {
    setSearchTerm(e.target.value);
  };

  const handleClearSearch = () => {
    setSearchTerm('');
  };

  const handleSearchSubmit = (e) => {
    e.preventDefault();
    console.log(`Searching for: ${searchTerm}`);
  };

  // Form handlers
  // Add these imports
 
  
  // Add state for coordinates
  const [pickupCoords, setPickupCoords] = useState([0, 0]);
  const [dropCoords, setDropCoords] = useState([0, 0]);
  
  // Add geocoding function
  const getCoordinates = async (address) => {
    try {
      const response = await fetch(
        `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
      );
      const data = await response.json();
      if (data && data.length > 0) {
        // [lng, lat] format
        return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
      }
      return null;
    } catch (error) {
      console.error("Geocoding error:", error);
      return null;
    }
  };
  
  // Update handleInputChange
  const handleInputChange = async (e) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value
    }));
  
    // Get coordinates when locations change
    if (name === 'pickupLocation') {
      const coords = await getCoordinates(value);
      if (coords) setPickupCoords(coords);
    } else if (name === 'dropoffLocation') {
      const coords = await getCoordinates(value);
      if (coords) setDropCoords(coords);
    }
  };
 
  // Helper to decode JWT and extract payload
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1]; // payload is 2nd part
      const base64 = base64Url.replace(/-/g, "+").replace(/_/g, "/");
      const jsonPayload = decodeURIComponent(
        atob(base64)
          .split("")
          .map(c => "%" + ("00" + c.charCodeAt(0).toString(16)).slice(-2))
          .join("")
      );
      const payload = JSON.parse(jsonPayload);
      return payload.id || payload._id || payload.userId || null; 
    } catch (e) {
      console.error("Invalid token:", e);
      return null;
    }
  };

  
 // Update handleSubmit function - replace the existing one
const handleSubmit = async (e) => {
  e.preventDefault();

  try {
    // Get logged in user id from token
    const userId = getUserIdFromToken();
    if (!userId) {
      console.error("No user ID found in token");
      return;
    }

    // Get coordinates for pickup/drop addresses
    const pickupCoords = await getCoordinates(formData.pickupLocation);
    const dropCoords = await getCoordinates(formData.dropoffLocation);

    const bookingData = {
      passenger: userId,
      pickup: {
        address: formData.pickupLocation,
        type: "Point",  // ✅ Add this required field
        coordinates: pickupCoords || [0, 0]  // ✅ Direct coordinates array
      },
      drop: {
        address: formData.dropoffLocation,
        type: "Point",  // ✅ Add this required field
        coordinates: dropCoords || [0, 0]  // ✅ Direct coordinates array
      },
      vehicleType: selectedCar?.type || "standard",
      preferredVehicleId: selectedCar?._id,
      preferredVehicleModel: selectedCar?.model || selectedCar?.name
    };

    console.log("🚖 Sending booking data:", bookingData);

    await dispatch(createBooking(bookingData)).unwrap();
    handleClose();
  } catch (err) {
    console.error("Booking failed:", err);
  }
};

  // Clean up booking status when modal closes
  useEffect(() => {
    if (!show) {
      dispatch(resetBookingStatus());
    }
  }, [show, dispatch]);

  // Add this near the form to show status
  // {error && <div className="alert alert-danger">{error}</div>}
  // {success && <div className="alert alert-success">Booking successful!</div>}

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
                {filteredCars.map((car, index) => (
                  <div
                    key={car.id}
                    className="col-12 col-md-6 col-lg-4 col-xl-3 d-flex justify-content-center"
                  >
                    <div
                      onMouseEnter={() => setHoveredCard(car._id)}
                      onMouseLeave={() => setHoveredCard(null)}
                      className={`z_car_card ${hoveredCard === car._id ? "z_car_card_hover" : ""}`}
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
                          onMouseEnter={() => setHoveredButton(`book-${car._id}`)}
                          onMouseLeave={() => setHoveredButton(null)}
                          className={`z_car_book_button ${hoveredButton === `book-${car._id}` ? "z_car_book_button_hover" : ""}`}
                          onClick={(e) => {
                            e.stopPropagation(); // Prevent card click
                            console.log("Selected car ID:", car._id);
                            console.log("Selected car details:", car);
                            handleShow(car); // This will now check bank details before showing modal
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
          <Modal.Title>
            Make Your Booking Today
            {selectedCar && (
              <small className="text-muted d-block" style={{ fontSize: '14px', fontWeight: 'normal' }}>
                Selected: {selectedCar.model || selectedCar.name} - {selectedCar.price}
              </small>
            )}
          </Modal.Title>
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
                  <Form.Label>Full Name *</Form.Label>
                  <Form.Control
                    type="text"
                    name="fullName"
                    placeholder="Your Name"
                    value={formData.fullName}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Phone Number *</Form.Label>
                  <Form.Control
                    type="tel"
                    name="phone"
                    placeholder="Your Phone"
                    value={formData.phone}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={4}>
                <Form.Group>
                  <Form.Label>Email *</Form.Label>
                  <Form.Control
                    type="email"
                    name="email"
                    placeholder="Your Email"
                    value={formData.email}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pick Up Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="pickupLocation"
                    placeholder="Type Location"
                    value={formData.pickupLocation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Drop Off Location *</Form.Label>
                  <Form.Control
                    type="text"
                    name="dropoffLocation"
                    placeholder="Type Location"
                    value={formData.dropoffLocation}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Passengers *</Form.Label>
                  <Form.Control
                    type="number"
                    name="passengers"
                    min="1"
                    max={selectedCar?.passengers || 10}
                    placeholder="Passengers"
                    value={formData.passengers}
                    onChange={handleInputChange}
                    disabled={!!selectedCar}
                    style={{
                      backgroundColor: selectedCar ? '#f8f9fa' : 'white',
                      cursor: selectedCar ? 'not-allowed' : 'text'
                    }}
                    required
                  />
                  {selectedCar && (
                    <small className="text-muted">Pre-filled based on selected car capacity</small>
                  )}
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Cab Model *</Form.Label>
                  <Form.Control
                    type="text"
                    name="cabModel"
                    placeholder="Car Model"
                    value={formData.cabModel}
                    onChange={handleInputChange}
                    disabled={!!selectedCar}
                    style={{
                      backgroundColor: selectedCar ? '#f8f9fa' : 'white',
                      cursor: selectedCar ? 'not-allowed' : 'text'
                    }}
                    required
                  />
                  {selectedCar && (
                    <small className="text-muted">Pre-filled based on selected car model</small>
                  )}
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pick Up Date *</Form.Label>
                  <Form.Control
                    type="date"
                    name="pickupDate"
                    value={formData.pickupDate}
                    onChange={handleInputChange}
                    min={new Date().toISOString().split('T')[0]}
                    required
                  />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group>
                  <Form.Label>Pick Up Time *</Form.Label>
                  <Form.Control
                    type="time"
                    name="pickupTime"
                    value={formData.pickupTime}
                    onChange={handleInputChange}
                    required
                  />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group className="mb-3">
              <Form.Label>Your Message</Form.Label>
              <Form.Control
                as="textarea"
                rows={3}
                name="message"
                placeholder="Write Your Message"
                value={formData.message}
                onChange={handleInputChange}
              />
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