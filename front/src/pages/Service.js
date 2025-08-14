import React, { useState } from 'react';
import '../style/x_app.css';
import '../style/z_app.css';
import '../style/Service.css'; // Assuming you have a CSS file for styling
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';

export default function Service() {
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

  return (
    <>
      {/* Hero Section */}
      <section
        className="service-hero"
        style={{
          backgroundImage:
            "url('https://carservice.by/upload/iblock/53b/e4r3crhqg93ftqxbf3qaqlq2400snty6.jpeg')",
        }}
      >
        <div className="service-hero-content">
          <h1>Our Premium Cab Services</h1>
          <p>
            From luxury sedans to budget-friendly rides, find the perfect car
            for every journey.
          </p>
        </div>
      </section>


      {/* Our Best Services For You */}
      <section class="z_service_section">
        <div class="container  mt-5">
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

      <div className="service-page">
        <div className="">
          {/* Service Banner Section */}
          <div className="service-banner">
            <div className="service-content service-container">
              <div className="service-text">
                <h1>Experience Great Support</h1>
                <p>
                  Lorem ipsum dolor sit amet, consectetur adipisicing elit, sed
                  do eiusmod tempor incididunt ut labore et dolore magna aliqua.
                  Ut enim ad minim veniam, quis nostrud exercitation.
                </p>
              </div>
              <div className="service-action">
                <button className="support-btn">
                  REACH OUR SUPPORT TEAM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
