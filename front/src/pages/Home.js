import React, { useState } from "react";
import { Swiper, SwiperSlide } from "swiper/react";
import { Navigation, Autoplay, Pagination } from "swiper/modules";
import { TbArrowMoveRightFilled } from "react-icons/tb";
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

import "swiper/css";
import "swiper/css/navigation";
import "../style/z_app.css";
import Footer from "../component/Footer";

export default function Home() {

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
                  <p className="z_slide_welcome">WELCOME TO UCAB!</p>
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
        <div className="z_slide_form">
          <div className="form_group">
            <FaMapMarkerAlt />
            <input type="text" placeholder="Pick Up Location" />
          </div>
          <div className="form_group">
            <FaMapMarkerAlt />
            <input type="text" placeholder="Drop Off Location" />
          </div>
          <div className="form_group">
            <input type="number" placeholder="Passengers" />
          </div>
          <div className="form_group">
            <select className="z_drpdwn_select">
              <option>Choose Cab</option>
              <option>Sedan</option>
              <option>SUV</option>
              <option>Mini</option>
            </select>
          </div>
          <div className="form_group">
            <FaCalendarAlt />
            <input type="date" className="date-input" />
          </div>
          <div className="form_group">
            <FaClock />
            <input type="time" className="time-input" />
          </div>
          <div className="form_group">
            <select className="z_drpdwn_select">
              <option>Choose Age</option>
              <option>18-25</option>
              <option>26-35</option>
              <option>36+</option>
            </select>
          </div>
          <div className="form_group">
            <select className="z_drpdwn_select">
              <option>Choose Model</option>
              <option>Model A</option>
              <option>Model B</option>
              <option>Model C</option>
            </select>
          </div>
          <div className="z_book_btn">
            <button className="book_btn">BOOK TAXI</button>
          </div>
        </div>
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
      {/* Our Cab Let's Check Available Cars*/}
      <section className="z_avlbl_section py-5">
        <div className="container">
          <div className="text-center mb-4">
            <h2 className="z_avlbl_title">
              Our Cab — Let's Check Available Cars
            </h2>
            <p className="z_avlbl_subtitle">
              Choose your perfect ride from our fleet of clean, comfortable, and
              well-maintained cars.
            </p>
          </div>

          {/* Car Cards */}
          <div className="z_cars_container">
            <div className="z_cars_row">
              {carData.map((car) => (
                <div
                  key={car.id}
                  className={`z_car_card ${hoveredCard === car.id ? "z_car_card_hover" : ""
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

                    <button
                      className={`z_car_book_button ${hoveredButton === car.id
                          ? "z_car_book_button_hover"
                          : ""
                        }`}
                      onMouseEnter={() => setHoveredButton(car.id)}
                      onMouseLeave={() => setHoveredButton(null)}
                      onClick={() => alert(`Booking ${car.name}...`)}
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
      {/* Testimonials */}
      <section className="z_testi_section">
        {/* Background Cars */}
        <div className="z_testi_bg_cars">
          <img
            src="https://luxedrive.qodeinteractive.com/wp-content/uploads/2023/02/Pricing-table-img-01.png"
            alt="Car 1"
            className="z_testi_car_1"
          />
          <img
            src="https://luxedrive.qodeinteractive.com/wp-content/uploads/2023/02/Pricing-table-img-02.png"
            alt="Car 2"
            className="z_testi_car_2"
          />
          <img
            src="https://luxedrive.qodeinteractive.com/wp-content/uploads/2023/02/Pricing-table-img-03.png"
            alt="Car 3"
            className="z_testi_car_3"
          />
        </div>

        <div className="container-fluid">
          <h2 className="z_testi_title">What Our Customers Say</h2>

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

      <Footer />
    </>
  );
}