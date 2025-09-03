import React, { useState, useMemo, useEffect } from 'react';
import { useDispatch, useSelector } from "react-redux";
import '../style/z_app.css'
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';
import { IoSearch, IoCloseSharp, IoChevronBack, IoChevronForward } from 'react-icons/io5';
import { Modal, Button, Form, Row, Col, Pagination } from "react-bootstrap";
import { Navigate, useNavigate } from 'react-router-dom';
import Footer from '../component/Footer';
import { getVehicles } from '../redux/slice/vehicles.slice';
import { createBooking, resetBookingStatus } from '../redux/slice/passengers.slice';
import { fetchUserProfile } from '../redux/slice/auth.slice';
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";


export default function Taxi() {
  const navigate = useNavigate();
  const dispatch = useDispatch();

  // Search state
  const [searchTerm, setSearchTerm] = useState('');
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);
  const [show, setShow] = useState(false);
  const [selectedCar, setSelectedCar] = useState(null);

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 4;

  // Redux state
  const vehicles = useSelector((state) => state.vehicle.vehicles);
  const { profile } = useSelector((state) => state.auth);
  const { loading, error, success } = useSelector((state) => state.passenger || {});

  useEffect(() => {
    dispatch(getVehicles());
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  // Show success/error messages - Same as Home.js
  useEffect(() => {
    if (success) {
      toast.success("🎉 Booking successful!");
      handleClose(); // Close modal on success
      dispatch(resetBookingStatus());
    }
    if (error) {
      toast.error(`❌ Booking failed: ${error}`);
      dispatch(resetBookingStatus());
    }
  }, [success, error, dispatch]);

  // Helper to decode JWT and extract userId - Same as Home.js
  const getUserIdFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;

    try {
      const base64Url = token.split(".")[1];
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

  // Convert address → coordinates using Nominatim API - Same as Home.js
  const getCoordinates = async (address) => {
    // console.log(`🔍 Geocoding address: "${address}"`);

    // Validate input
    if (!address || address.trim().length === 0) {
      console.error("❌ Empty address provided");
      return null;
    }

    try {
      // Clean and prepare the address
      const cleanAddress = address.trim();
      const encodedAddress = encodeURIComponent(cleanAddress);

      // Add a small delay to respect API rate limits
      await new Promise(resolve => setTimeout(resolve, 100));

      const url = `https://nominatim.openstreetmap.org/search?format=json&q=${encodedAddress}&limit=1`;

      const response = await fetch(url, {
        headers: {
          'User-Agent': 'YourTaxiApp/1.0' // Nominatim requires a user agent
        }
      });

      if (!response.ok) {
        console.error(`❌ HTTP Error: ${response.status} - ${response.statusText}`);
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }

      const data = await response.json();

      if (!data || !Array.isArray(data) || data.length === 0) {
        console.error(`❌ No results found for address: "${address}"`);
        return null;
      }

      const result = data[0];

      // Validate that we have valid coordinates
      if (!result.lon || !result.lat) {
        console.error(`❌ Invalid coordinates in response for "${address}":`, result);
        return null;
      }

      const coordinates = [parseFloat(result.lon), parseFloat(result.lat)];

      // Validate coordinate values
      if (isNaN(coordinates[0]) || isNaN(coordinates[1])) {
        console.error(`❌ Invalid coordinate values for "${address}":`, coordinates);
        return null;
      }

      console.log(`✅ Successfully geocoded "${address}" to:`, coordinates);
      return coordinates;

    } catch (error) {
      console.error(`❌ Geocoding error for "${address}":`, error);

      // Check for specific error types
      if (error.name === 'TypeError' && error.message.includes('fetch')) {
        console.error('Network error - check your internet connection');
      } else if (error.name === 'SyntaxError') {
        console.error('Invalid JSON response from geocoding service');
      }

      return null;
    }
  };

  // Enhanced filter function for better search
  const filteredCars = useMemo(() => {
    if (!searchTerm.trim()) {
      return vehicles || [];
    }

    const searchLower = searchTerm.toLowerCase().trim();

    return (vehicles || []).filter(car => {
      const searchInField = (value) => {
        if (value === null || value === undefined) return false;
        return String(value).toLowerCase().includes(searchLower);
      };

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
        (car.airCondition && searchLower.includes('ac')) ||
        (car.airCondition && searchLower.includes('air')) ||
        (car.gpsNavigation && searchLower.includes('gps')) ||
        (car.gpsNavigation && searchLower.includes('navigation'))
      );
    });
  }, [searchTerm, vehicles]);

  // Pagination calculations
  const totalPages = Math.ceil(filteredCars.length / itemsPerPage);
  const startIndex = (currentPage - 1) * itemsPerPage;
  const endIndex = startIndex + itemsPerPage;
  const currentCars = filteredCars.slice(startIndex, endIndex);

  // Reset pagination when search changes
  useEffect(() => {
    setCurrentPage(1);
  }, [searchTerm]);

  // Pagination handlers
  const handlePageChange = (pageNumber) => {
    setCurrentPage(pageNumber);
    // Scroll to top of cards section
    document.querySelector('.z_cars_container')?.scrollIntoView({
      behavior: 'smooth',
      block: 'start'
    });
  };

  const handlePrevious = () => {
    if (currentPage > 1) {
      handlePageChange(currentPage - 1);
    }
  };

  const handleNext = () => {
    if (currentPage < totalPages) {
      handlePageChange(currentPage + 1);
    }
  };

  // Function to check if user has bank details
  const checkBankDetails = () => {
    console.log('Profile data:', profile);
    console.log('Bank details:', profile?.bankDetails);

    if (!profile || !profile.bankDetails) {
      return false;
    }

    const { bankDetails } = profile;

    const hasAccountNumber = bankDetails.accountNumber && bankDetails.accountNumber.trim() !== '';
    const hasAccountHolderName = bankDetails.accountHolderName && bankDetails.accountHolderName.trim() !== '';
    const hasIfscCode = bankDetails.ifscCode && bankDetails.ifscCode.trim() !== '';
    const hasBankName = bankDetails.bankName && bankDetails.bankName.trim() !== '';

    return hasAccountNumber && hasAccountHolderName && hasIfscCode && hasBankName;
  };

  // Modal handlers
  const handleShow = (car = null) => {
    if (!checkBankDetails()) {
      toast.error('Please add your bank details in Profile section before booking a taxi. Required: Account Number, Account Holder Name, IFSC Code, and Bank Name.');
      return;
    }

    console.log("Selected Vehicle ID:", car._id);
    console.log("Selected Vehicle Data:", car);
    setSelectedCar(car);
    setShow(true);
  };

  const handleClose = () => {
    setShow(false);
    setSelectedCar(null);
    dispatch(resetBookingStatus()); // Reset booking status when modal closes
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

  const handleModalSubmit = async (e) => {
    e.preventDefault();

    try {
      const userId = getUserIdFromToken();
      if (!userId) {
        toast.error("You must be logged in to book.");
        return;
      }

      // Get form data from modal
      const formData = new FormData(e.target);
      const pickupLocation = formData.get('pickup')?.trim();
      const dropLocation = formData.get('drop')?.trim();
      const pickupDate = formData.get('date');
      const pickupTime = formData.get('time');
      const ratePerKm = formData.get('ratePerKm');

      // Validate required fields
      if (!pickupLocation || !dropLocation || !pickupDate || !pickupTime) {
        toast.error("Please fill all required fields.");
        return;
      }
      const pickupCoords = await getCoordinates(pickupLocation);

      if (!pickupCoords) {
        toast.error(`Could not find location: "${pickupLocation}". Please check the spelling or try a more specific address (include city, state).`);
        return;
      }

      console.log("📍 Getting coordinates for drop location...");
      const dropCoords = await getCoordinates(dropLocation);

      if (!dropCoords) {
        toast.error(`Could not find location: "${dropLocation}". Please check the spelling or try a more specific address (include city, state).`);
        return;
      }

      console.log("✅ Both locations geocoded successfully!");

      // Check if coordinates are within expected ranges
      const isValidCoordinate = (coord) => {
        return Array.isArray(coord) &&
          coord.length === 2 &&
          typeof coord[0] === 'number' &&
          typeof coord[1] === 'number' &&
          coord[0] >= -180 && coord[0] <= 180 && // Longitude
          coord[1] >= -90 && coord[1] <= 90;    // Latitude
      };

      if (!isValidCoordinate(pickupCoords) || !isValidCoordinate(dropCoords)) {
        console.error("❌ Invalid coordinate format detected");
        toast.error("Invalid coordinates received. Please try different locations.");
        return;
      }

      const bookingData = {
        passenger: userId,
        pickup: {
          address: pickupLocation,
          type: "Point",
          coordinates: pickupCoords,
        },
        drop: {
          address: dropLocation,
          type: "Point",
          coordinates: dropCoords,
        },
        vehicleType: selectedCar?.type || "standard",
        preferredVehicleId: selectedCar?._id,
        preferredVehicleModel: selectedCar?.model || selectedCar?.name,
        pickupDate: pickupDate,
        pickupTime: pickupTime,
        ratePerKm: selectedCar?.perKmRate || ratePerKm,
      };

      const result = await dispatch(createBooking(bookingData)).unwrap();
      console.log("✅ Booking successful:", result);

    } catch (err) {
      console.error("❌ Modal Booking failed:", err);
      console.error("📄 Full Error Object:", JSON.stringify(err, null, 2));

      // Log the error details
      if (err.response) {
        console.error("🌐 Server Response:", err.response);
        console.error("📊 Response Data:", err.response.data);
        console.error("📈 Response Status:", err.response.status);
      }

      // Provide more specific error messages
      if (err.message) {
        if (err.message.includes('No cab available')) {
          toast.error(`❌ ${err.message}\n\nThis might be because:\n• No drivers are currently active in your area\n• Service not available in this location\n• Try a different pickup location or time`);
        } else if (err.message.includes('coordinates')) {
          toast.error("Failed to get location coordinates. Please try again with more specific addresses.");
        } else if (err.message.includes('network')) {
          toast.error("Network error. Please check your internet connection and try again.");
        } else {
          toast.error(`Booking failed: ${err.message}`);
        }
      } else {
        toast.error(`Booking failed: ${err}`);
      }
    }
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
                {/* <a href="#book" className="z_allcabs_btn">Book Now</a> */}
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
          {currentCars.length > 0 && (
            <div className="z_cars_container my-4 container">
              <div className="row g-4">
                {currentCars.map((car, index) => (
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
                            e.stopPropagation();
                            console.log("Button clicked for vehicle:", car._id);
                            handleShow(car);
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <div className="d-flex justify-content-center mt-5 pb-4">
              <div className="d-flex align-items-center gap-3">
                {/* Previous Button */}
                <Button
                  variant="outline-secondary"
                  onClick={handlePrevious}
                  disabled={currentPage === 1}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #dee2e6",
                    width: "38px",
                    height: "38px",
                    backgroundColor: "white",
                    color: currentPage === 1 ? "#a0aec0" : "#1a202c",
                  }}
                >
                  <IoChevronBack size={16} />
                </Button>

                {/* Page Info */}
                <span
                  style={{
                    fontSize: "16px",
                    fontWeight: "500",
                    color: "#1a202c",
                  }}
                >
                  {currentPage} of {totalPages}
                </span>

                {/* Next Button */}
                <Button
                  variant="outline-secondary"
                  onClick={handleNext}
                  disabled={currentPage === totalPages}
                  className="d-flex align-items-center justify-content-center"
                  style={{
                    borderRadius: "8px",
                    border: "2px solid #dee2e6",
                    width: "38px",
                    height: "38px",
                    backgroundColor: "white",
                    color: currentPage === totalPages ? "#a0aec0" : "#1a202c",
                  }}
                >
                  <IoChevronForward size={16} />
                </Button>
              </div>
            </div>
          )}
          {/* Results Summary */}
          {/* {filteredCars.length > 0 && totalPages > 1 && (
            <div className="text-center text-muted mb-4">
              <small>
                Showing {startIndex + 1} to {Math.min(endIndex, filteredCars.length)} of {filteredCars.length} results
                {searchTerm && <span> for "{searchTerm}"</span>}
              </small>
            </div>
          )} */}
        </div>
      </section>

      {/* Updated Modal Booking Form - Same structure as Home.js */}
      <Modal show={show} onHide={handleClose} centered>
        <Modal.Header closeButton>
          <Modal.Title>
            Book Your Cab - {selectedCar?.model || selectedCar?.name}
          </Modal.Title>
        </Modal.Header>
        <Form onSubmit={handleModalSubmit}>
          <Modal.Body>
            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="pickup">
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Control
                    name="pickup"
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
                    name="drop"
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
                  <Form.Control name="date" type="date" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="time">
                  <Form.Label>Pickup Time</Form.Label>
                  <Form.Control name="time" type="time" required />
                </Form.Group>
              </Col>
            </Row>

            <Form.Group controlId="ratePerKm" className="mb-3">
              <Form.Label>Rate/km</Form.Label>
              <Form.Control
                name="ratePerKm"
                type="number"
                min="1"
                placeholder="Rate per km"
                defaultValue={selectedCar?.perKmRate || selectedCar?.price || ''}
                readOnly
                disabled
              />
            </Form.Group>
          </Modal.Body>
          <Modal.Footer>
            <Button variant="secondary" onClick={handleClose}>
              Cancel
            </Button>
            <Button variant="success" type="submit" disabled={loading}>
              {loading ? "Booking..." : "Confirm Booking"}
            </Button>
          </Modal.Footer>
        </Form>
      </Modal>
    </>
  );
}