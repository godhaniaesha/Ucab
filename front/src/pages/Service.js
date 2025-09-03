import React, { useState } from 'react';
import '../style/x_app.css';
import '../style/z_app.css';
import '../style/Service.css'; // Assuming you have a CSS file for styling
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaStar, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';
import { FaLaptop, FaMoneyBillWave, FaShieldAlt, FaClock } from "react-icons/fa";

import Footer from '../component/Footer';
import { useNavigate } from 'react-router-dom';

export default function Service() {
  const navigate = useNavigate();

const cabBookingContent = [
  {
    id: 1,
    title: "Seamless Online Booking",
    desc: "Say goodbye to complicated cab reservations. With our smart and intuitive booking platform, you can reserve a cab in seconds—simply choose your pickup and drop locations, pick the cab type that fits your journey, and confirm instantly. Fast, effortless, and designed to make travel planning stress-free.",
    icon: <FaLaptop />,
  },
  {
    id: 2,
    title: "Transparent & Pocket-Friendly Fares",
    desc: "No surprises, no hidden costs—just honest pricing. Our pay-per-kilometer system ensures you know exactly what you’re paying for. With competitive rates and upfront fare details, you enjoy premium rides without stretching your budget. Every trip feels lighter on your wallet and higher in value.",
    icon: <FaMoneyBillWave />,
  },
  {
    id: 3,
    title: "Trusted Drivers, Safer Rides",
    desc: "Every journey matters. That’s why our fleet is regularly inspected, and our drivers are carefully verified and trained. From short city hops to long highway travels, we guarantee a safe, reliable, and comfortable ride. Travel with peace of mind knowing your safety is always in good hands.",
    icon: <FaShieldAlt />,
  },
  {
    id: 4,
    title: "Cabs Anytime, Anywhere",
    desc: "Whether it’s an early morning airport run, a late-night office drop, or a spontaneous weekend outing—our cabs are available round the clock. With 24/7 accessibility, you’ll never have to wait or worry about ride availability again. Wherever you are, whenever you need us—we’re just a tap away.",
    icon: <FaClock />,
  },
];


  const [activeCar, setActiveCar] = useState(cabBookingContent[0].id);

  const toggleCar = (id) => {
    setActiveCar((prev) => (prev === id ? null : id));
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
              <p class="z_service_card_description mb-0">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
              {/* */}
            </div>

            {/* <!-- Service Card 2 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Cleanliness & Comfort</h3>
              <p class="z_service_card_description mb-0">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
             
            </div>

            {/* <!-- Service Card 3 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Best Prices Garanteed</h3>
              <p class="z_service_card_description mb-0">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
             
            </div>

            {/* <!-- Service Card 4 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">24/7 Order Available</h3>
              <p class="z_service_card_description mb-0">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
             
            </div>

            {/* <!-- Service Card 5 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Professional Drivers</h3>
              <p class="z_service_card_description mb-0">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
             
            </div>

            {/* <!-- Service Card 6 --> */}
            <div class="z_service_card">
              <h3 class="z_service_card_title">Fast Car Delivery</h3>
              <p class="z_service_card_description mb-0">
                Corporis suscipit laboriosa, nisl ut aliquid ex commodi vel
                conset? Et harum quidem est.
              </p>
             
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
                <button
                  className="support-btn"
                  onClick={() => navigate("/contact")}
                >
                  REACH OUR SUPPORT TEAM
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* === Fleet Accordion Section === */}
     <section className="z_fleet_section container">
  <div className="text-center mb-5">
    <h2 className="z_service_title">
      Why Choose Our <span className="z_default_txt"> Cab Booking </span> Service
    </h2>
    <p className="z_service_subtitle">
      We make cab booking simple, fast, and affordable. Here’s why thousands of customers trust us for their daily rides and long journeys.
    </p>
  </div>

  <div className="z_fleet_list">
    {cabBookingContent.map((item) => (
      <div key={item.id} className="z_fleet_item">
        <div className="z_fleet_header" onClick={() => toggleCar(item.id)}>
          <h4 className="z_fleet_title d-flex align-items-center gap-1">
            {item.icon} <p className='mb-0 '>{item.title}</p>
          </h4>
          <span className="z_fleet_icon">
            {activeCar === item.id ? "−" : "+"}
          </span>
        </div>

        {activeCar === item.id && (
          <div className="z_fleet_body">
            <div className="z_fleet_details">
              <p className="z_fleet_desc">{item.desc}</p>
            </div>
          </div>
        )}
      </div>
    ))}
  </div>
</section>



    </>
  );
}
