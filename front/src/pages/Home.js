import React, { useEffect, useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { TbArrowMoveRightFilled } from "react-icons/tb";
import { Modal, Button, Form, Row, Col } from "react-bootstrap";
import {
  FaCalendarAlt,
  FaClock,
  FaEnvelope,
  FaMapMarkerAlt,
  FaPhoneAlt,
  FaQuoteLeft,
} from "react-icons/fa";
import {
  FaDoorClosed,
  FaUsers,
  FaSuitcaseRolling,
  FaSnowflake,
} from "react-icons/fa";
import testi1 from '../image/Testimonial1.png';
import testi2 from '../image/Testimonial2.png';
import testi3 from '../image/Testimonial3.png';

import "swiper/css";
import "swiper/css/navigation";
import "../style/z_app.css";
import Footer from "../component/Footer";

import { useDispatch, useSelector } from 'react-redux';
import { getVehicles } from '../redux/slice/vehicles.slice';
import { createBooking, resetBookingStatus } from "../redux/slice/passengers.slice";


// Helper to decode JWT and extract userId
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

// Convert address → coordinates
const getCoordinates = async (address) => {
  try {
    const response = await fetch(
      `https://nominatim.openstreetmap.org/search?format=json&q=${encodeURIComponent(address)}`
    );
    const data = await response.json();
    if (data && data.length > 0) {
      return [parseFloat(data[0].lon), parseFloat(data[0].lat)];
    }
    return [0, 0];
  } catch (error) {
    console.error("Geocoding error:", error);
    return [0, 0];
  }
};

export default function Home({ car }) {
  const [show, setShow] = useState(false);

  const handleShow = () => setShow(true);
  const handleClose = () => setShow(false);


  const handleSubmit = (e) => {
    e.preventDefault();
    alert("Cab booked successfully!");
    handleClose();
  };

  const dispatch = useDispatch();
  const { vehicles, loading } = useSelector((state) => state.vehicle);


  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch]);

  useEffect(() => {
    if (vehicles && vehicles.length > 0) {
      console.log("Fetched Vehicles:", vehicles);
    }
  }, [vehicles]);


  const slides = [
    {
      img: "https://cdn1.ozone.ru/s3/multimedia-k/6460812584.jpg",
      title: "BOOK TAXI FOR YOUR RIDE",
      subtitle:
        "There are many variations of passages available, but the majority have suffered alteration in some form.",
    },
    {
      img: "https://cdn.pixabay.com/photo/2019/03/22/15/35/car-4073514_1280.jpg",
      title: "TRAVEL IN LUXURY & COMFORT",
      subtitle:
        "Experience a premium ride with our well-maintained, stylish, and comfortable vehicles.",
    },
    {
      img: "https://i.pinimg.com/originals/11/1b/c2/111bc27f5046d67c4bbf2c090051a232.jpg",
      title: "EXECUTIVE SEDAN EXPERIENCE",
      subtitle:
        "Perfect choice for corporate trips, airport transfers, and special occasions.",
    },
  ];
  const [hoveredCard, setHoveredCard] = useState(null);
  const [hoveredButton, setHoveredButton] = useState(null);

  const testimonials = [
    {
      id: 1,
      name: "Reid Butt",
      role: "Customer",
      img: "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&h=150&fit=crop&crop=face",
      feedback:
        "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
      rating: 5,
    },
    {
      id: 2,
      name: "Parker Jime",
      role: "Customer",
      img: "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&h=150&fit=crop&crop=face",
      feedback:
        "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
      rating: 5,
    },
    {
      id: 3,
      name: "Heruli Nez",
      role: "Customer",
      img: "https://images.unsplash.com/photo-1519085360753-af0119f7cbe7?w=150&h=150&fit=crop&crop=face",
      feedback:
        "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
      rating: 5,
    },
    {
      id: 4,
      name: "Sylvia Green",
      role: "Customer",
      img: "https://images.unsplash.com/photo-1494790108755-2616b612b786?w=150&h=150&fit=crop&crop=face",
      feedback:
        "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
      rating: 5,
    },
    {
      id: 5,
      name: "John Smith",
      role: "Customer",
      img: "https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&h=150&fit=crop&crop=face",
      feedback:
        "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
      rating: 5,
    },
    {
      id: 6,
      name: "Emma Wilson",
      role: "Customer",
      img: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?w=150&h=150&fit=crop&crop=face",
      feedback:
        "There are many variations of words suffered available to the have majority but the majority suffer to alteration injected hidden the middle text.",
      rating: 5,
    },
  ];

  const renderStars = (rating) => {
    return Array.from({ length: 5 }, (_, index) => (
      <span
        key={index}
        style={{
          color: index < rating ? "#ffa500" : "#ddd",
          fontSize: "18px",
        }}
      >
        ★
      </span>
    ));
  };

  // inside Home component
  const [selectedMake, setSelectedMake] = useState("");
  const [selectedModel, setSelectedModel] = useState("");
  const [passengers, setPassengers] = useState("");
  const [selectedRate, setSelectedRate] = useState("");
  // extract unique makes
  const makes = [...new Set(vehicles.map(v => v.make))];

  // filter models based on make
  const models = vehicles
    .filter(v => v.make === selectedMake)
    .map(v => v.model);

  // when model changes, update passengers
  useEffect(() => {
    if (selectedModel) {
      const vehicle = vehicles.find(
        (v) => v.model === selectedModel && v.make === selectedMake
      );
      setPassengers(vehicle ? vehicle.passengers : "");
      setSelectedRate(vehicle ? vehicle.perKmRate : "");
    }
  }, [selectedModel, selectedMake, vehicles]);


  // form states
  const [pickup, setPickup] = useState("");
  const [dropoff, setDropoff] = useState("");
  // const [selectedMake, setSelectedMake] = useState("");
  // const [selectedModel, setSelectedModel] = useState("");
  // const [passengers, setPassengers] = useState("");
  // const [selectedRate, setSelectedRate] = useState("");
  const [date, setDate] = useState("");
  const [time, setTime] = useState("");


  const { bookings, error, success } = useSelector((state) => state.passenger || {});

  console.log(bookings, "success");


  // Submit booking
  const handleBooking = async (e) => {
    e.preventDefault();

    try {
      const userId = getUserIdFromToken(); // 👈 function to decode token
      if (!userId) {
        alert("You must be logged in to book.");
        return;
      }

      const pickupCoords = await getCoordinates(pickup);
      const dropCoords = await getCoordinates(dropoff);

      // 🚖 Find vehicle info from your vehicles slice (Redux state)
      const selectedVehicle = vehicles.find(v => v.model === selectedModel);

      const bookingData = {
        passenger: userId,
        pickup: {
          address: pickup,
          type: "Point",
          coordinates: pickupCoords,
        },
        drop: {
          address: dropoff,
          type: "Point",
          coordinates: dropCoords,
        },
        vehicleType: selectedVehicle?.type || "standard",        // ✅ enum valid
        preferredVehicleId: selectedVehicle?._id,                // ✅ actual ObjectId
        preferredVehicleModel: selectedVehicle?.model || "",
      };

      console.log("🚕 Sending bookingData:", bookingData);

      await dispatch(createBooking(bookingData)).unwrap();
    } catch (err) {
      console.error("Booking failed:", err);
    }
  };




  return (
    <>
      <section className="z_slide_section">
        <Swiper
          modules={[Navigation, Autoplay]}
          navigation
          autoplay={{ delay: 4000, disableOnInteraction: false }}
          loop={true}
          className="z_slide_wrapper"
        >
          {slides.map((slide, index) => (
            <SwiperSlide key={index}>
              <div className="z_slide_item">
                <img
                  src={slide.img}
                  alt={slide.title}
                  className="z_slide_image"
                />
                <div className="z_slide_overlay">
                  <p className="z_slide_welcome">WELCOME TO UCAB! </p>
                  <h2 className="z_slide_title">
                    {slide.title.split(" ").map((word, i) =>
                      word.toLowerCase() === "taxi" ? (
                        <span key={i} className="highlight">
                          {word}{" "}
                        </span>
                      ) : (
                        word + " "
                      )
                    )}
                  </h2>
                  <p className="z_slide_subtitle">{slide.subtitle}</p>
                </div>
              </div>
            </SwiperSlide>
          ))}
        </Swiper>

        {/* Booking Form outside SwiperSlide so it stays fixed */}
        <form className="z_slide_form" onSubmit={handleBooking}>
          <div className="form_group">
            <FaMapMarkerAlt />
            <input
              type="text"
              placeholder="Pick Up Location"
              value={pickup}
              onChange={(e) => setPickup(e.target.value)}
            />
          </div>

          <div className="form_group">
            <FaMapMarkerAlt />
            <input
              type="text"
              placeholder="Drop Off Location"
              value={dropoff}
              onChange={(e) => setDropoff(e.target.value)}
            />
          </div>

          {/* Makes */}
          <div className="form_group">
            <select
              className="z_drpdwn_select"
              value={selectedMake}
              onChange={(e) => {
                setSelectedMake(e.target.value);
                setSelectedModel("");
                setPassengers("");
              }}
            >
              <option value="">Choose Cab</option>
              {makes.map((make, index) => (
                <option key={index} value={make}>
                  {make}
                </option>
              ))}
            </select>
          </div>

          {/* Models */}
          <div className="form_group">
            <select
              className="z_drpdwn_select"
              value={selectedModel}
              onChange={(e) => {
                setSelectedModel(e.target.value);
                setPassengers(e.target.value === "SUV" ? 6 : 4); // demo logic
                setSelectedRate(e.target.value === "Luxury" ? 50 : 20); // demo logic
              }}
              disabled={!selectedMake}
            >
              <option value="">Choose Model</option>
              {models.map((model, index) => (
                <option key={index} value={model}>
                  {model}
                </option>
              ))}
            </select>
          </div>

          {/* Passengers */}
          <div className="form_group">
            <input
              type="number"
              placeholder="Passengers"
              value={passengers}
              readOnly
            />
          </div>

          {/* Rate */}
          <div className="form_group">
            <input
              type="text"
              className="z_drpdwn_select"
              value={selectedRate ? `₹${selectedRate}/km` : ""}
              placeholder="Rate/km"
              readOnly
            />
          </div>

          <div className="form_group">
            <FaCalendarAlt />
            <input
              type="date"
              className="date-input"
              value={date}
              onChange={(e) => setDate(e.target.value)}
            />
          </div>

          <div className="form_group">
            <FaClock />
            <input
              type="time"
              className="time-input"
              value={time}
              onChange={(e) => setTime(e.target.value)}
            />
          </div>

          <div className="z_book_btn">
            <button className="book_btn" type="submit" disabled={loading}>
              {loading ? "Booking..." : "BOOK TAXI"}
            </button>
          </div>

          {success && <p style={{ color: "green" }}>✅ Booking successful!</p>}
          {error && <p style={{ color: "red" }}>❌ {error}</p>}
        </form>

      </section>
      {/* About section */}
      <section className="z_about_section">
        <div className="z_about_container">
          <div className="z_about_image">
            <img
              src="https://carconnectivity.org/wp-content/uploads/2023/02/CCC_Coverage_Vehicles-of-The-Future-1.jpg"
              alt="Book your cab"
            />
            <img
              src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
              alt="Taxi service"
            />
            <img
              src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80"
              alt="Professional drivers"
            />
            <img
              src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
              alt="Luxury cabs"
            />
          </div>

          <div className="z_about_content">
            <h2>
              About <span>UCAB</span>
            </h2>
            <p>
              UCAB is your trusted ride partner, offering safe, reliable, and
              affordable taxi services 24/7. Whether you’re heading to the
              airport, attending a meeting, or exploring the city, our modern
              fleet and professional drivers ensure a comfortable journey every
              time.
            </p>
            <ul>
              <li>✔ Easy online booking & instant confirmation</li>
              <li>✔ Wide range of cabs – Sedan, SUV, Mini</li>
              <li>✔ Affordable pricing with no hidden charges</li>
              <li>✔ Experienced & verified drivers</li>
            </ul>
            <button className="z_about_btn">Book Now</button>
          </div>
        </div>
      </section>

      {/* Our Cab Let's Check Available Cars*/}
      <section className="z_avlbl_section py-5">
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

          {/* Car Cards */}
          <div className="z_cars_container">
            <div className="z_cars_row">
              {loading ? (
                <div className="text-center">Loading...</div>
              ) : vehicles && vehicles.length > 0 ? (
                vehicles.map((car) => (
                  <div
                    key={car._id}
                    className={`z_car_card ${hoveredCard === car._id ? "z_car_card_hover" : ""}`}
                    onMouseEnter={() => setHoveredCard(car._id)}
                    onMouseLeave={() => setHoveredCard(null)}
                  >
                    <div className="z_car_image_container">
                      <img
                        src={`http://localhost:5000${car.images}`}
                        alt={car.name}
                        className="z_car_image"
                      />
                    </div>

                    <div className="z_car_card_body">
                      <h5 className="z_car_name">{car.model || car.name}</h5>
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
                            {car.airCondition ? 'Yes' : 'No'}
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
                            {car.gpsNavigation ? 'Yes' : 'No'}
                          </span>
                        </div>
                      </div>

                      {/* Book Taxi Button */}
                      <button
                        className={`z_car_book_button ${hoveredButton === car._id ? "z_car_book_button_hover" : ""}`}
                        onMouseEnter={() => setHoveredButton(car._id)}
                        onMouseLeave={() => setHoveredButton(null)}
                        onClick={() => handleShow(car)}
                      >
                        Book Taxi Now →
                      </button>
                    </div>
                  </div>
                ))
              ) : (
                <>
                  <div className="text-center">No vehicles available</div>
                </>

              )}
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
                  <Form.Control type="text" placeholder="Enter your name" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="phone">
                  <Form.Label>Phone Number</Form.Label>
                  <Form.Control type="tel" placeholder="Enter phone number" required />
                </Form.Group>
              </Col>
            </Row>

            <Row className="mb-3">
              <Col md={6}>
                <Form.Group controlId="pickup">
                  <Form.Label>Pickup Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter pickup location" required />
                </Form.Group>
              </Col>
              <Col md={6}>
                <Form.Group controlId="drop">
                  <Form.Label>Drop Location</Form.Label>
                  <Form.Control type="text" placeholder="Enter drop location" required />
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
              <Form.Control type="number" min="1" placeholder="Enter passengers" required />
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

      {/* Video */}
      <section className="x_hero_section">
        <div className="x_video_background">
          <video autoPlay muted loop playsInline>
            <source src="https://max-themes.net/demos/limoking/upload/service-video-bg-n.webm" type="video/webm" />
            Your browser does not support the video tag.
          </video>
          <div className="x_video_overlay"></div>
        </div>

        <div className="x_hero_content">
          <div className="x_hero_text">
            <h1 className="x_hero_title">OR ANYWHERE YOU NEED US TO TAKE</h1>
            <p className="x_hero_subtitle">
              Not only taking to night parties, weddings, casinos, birthdays but we also take you to anywhere you want to go.
            </p>
            <div className="x_hero_phone">
              CALL NOW (1)-212-333-4343
            </div>
            <div className="x_hero_separator">
              <span className="x_separator_line"></span>
              <span className="x_or_text">OR</span>
              <span className="x_separator_line"></span>
            </div>
            <button className="x_book_online_btn">Book Online</button>
          </div>
        </div>
      </section>
      {/* Our Best Services For You */}
      <section class="z_service_section">
        <div class="container">
          <div class="z_service_heading">
            <h2 class="z_service_title">
              Our Best <span className="z_default_txt">Services</span> For You
            </h2>
            <p class="z_service_subtitle">
              We provide comprehensive car rental services with the best quality
              and competitive prices for all your transportation needs.
            </p>
          </div>

          <div class="z_service_grid">
            {/* <!-- Service Card 1 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Deals For Every Budget</h3>
              <p class="z_service_card_description">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              <a href="#" class="z_service_view_more">
                View More
              </a>
            </div>

            {/* <!-- Service Card 2 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Cleanliness & Comfort</h3>
              <p class="z_service_card_description">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              <a href="#" class="z_service_view_more">
                View More
              </a>
            </div>

            {/* <!-- Service Card 3 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Best Prices Garanteed</h3>
              <p class="z_service_card_description">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              <a href="#" class="z_service_view_more">
                View More
              </a>
            </div>

            {/* <!-- Service Card 4 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">24/7 Order Available</h3>
              <p class="z_service_card_description">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              <a href="#" class="z_service_view_more">
                View More
              </a>
            </div>

            {/* <!-- Service Card 5 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Professional Drivers</h3>
              <p class="z_service_card_description">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              <a href="#" class="z_service_view_more">
                View More
              </a>
            </div>

            {/* <!-- Service Card 6 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Fast Car Delivery</h3>
              <p class="z_service_card_description">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              <a href="#" class="z_service_view_more">
                View More
              </a>
            </div>
          </div>
        </div>
      </section>

      {/* Testimonials */}
      <section className="z_testi_section">
        {/* Background Cars */}
        <div className="z_testi_bg_cars">
          <img
            src={testi1}
            alt="Car 1"
            className="z_testi_car_1"
          />
          <img
            src={testi2}
            alt="Car 2"
            className="z_testi_car_2"
          />
          <img
            src={testi3}
            alt="Car 3"
            className="z_testi_car_3"
          />
        </div>

        <div className="container-fluid">
          <h2 className="z_testi_title">What <span className="z_default_txt"> Our Customers</span> Say</h2>

          <Swiper
            modules={[Pagination, Autoplay]}
            spaceBetween={25}
            slidesPerView={4}
            pagination={{ clickable: true }}
            autoplay={{ delay: 3500, disableOnInteraction: false }}
            loop={true}
            className="z_testi_slider"
            breakpoints={{
              320: { slidesPerView: 1, spaceBetween: 20 },
              768: { slidesPerView: 2, spaceBetween: 20 },
              1024: { slidesPerView: 3, spaceBetween: 25 },
              1400: { slidesPerView: 4, spaceBetween: 25 },
            }}
          >
            {testimonials.map((testimonial, index) => (
              <SwiperSlide key={index}>
                <div className="z_testi_card">
                  <div className="z_testi_user_header">
                    <img
                      src={testimonial.img}
                      alt={testimonial.name}
                      className="z_testi_img"
                    />
                    <div className="z_testi_user_info">
                      <h4>{testimonial.name}</h4>
                      <p className="z_testi_role">{testimonial.role}</p>
                    </div>
                  </div>
                  <p className="z_testi_feedback">{testimonial.feedback}</p>
                </div>
              </SwiperSlide>
            ))}
          </Swiper>
        </div>
      </section>

    </>
  );
}