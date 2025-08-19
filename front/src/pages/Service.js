import React, { useState } from 'react';
import '../style/x_app.css';
import '../style/z_app.css';
import '../style/Service.css'; // Assuming you have a CSS file for styling
import { FaDoorClosed, FaMapMarkerAlt, FaSnowflake, FaStar, FaSuitcaseRolling, FaUsers } from 'react-icons/fa';
import Footer from '../component/Footer';

export default function Service() {

  const carFleet = [
    {
      id: 1,
      name: "Sedan",
      desc: "The Sedan offers a perfect balance of affordability, comfort, and style. With spacious interiors and a smooth driving experience, it is ideal for small families, professionals, and business travelers who need reliable and comfortable city rides. Whether it’s your daily office commute, airport transfers, or a quick city tour, the Sedan ensures a stress-free journey. Equipped with air conditioning, plush seating, and a spacious boot for moderate luggage, it provides an economical yet classy way to travel.",
      price: "₹12 / km",
      baseFare: "₹150",
      capacity: "4 Passengers + Driver",
      image: "https://avatars.mds.yandex.net/i?id=b22105d99f033c964842cd402ebce15107d4fbfa-5241566-images-thumbs&n=13",
    },
    {
      id: 2,
      name: "SUV",
      desc: "Our SUVs are designed for power, space, and comfort, making them the perfect choice for long-distance travel and group outings. With extra legroom, high ground clearance, and large boot space, they are excellent for family vacations, road trips, and hill station drives. SUVs can easily handle rough terrains and highways while ensuring passenger comfort. Ideal for up to 6 passengers, these vehicles come with advanced safety features, luxurious interiors, and strong performance that makes every journey memorable.",
      price: "₹16 / km",
      baseFare: "₹250",
      capacity: "6 Passengers + Driver",
      image: "https://avatars.mds.yandex.net/i?id=efd3fb74bbf75561b7e953ba2045b613077f3d12-12486332-images-thumbs&n=13",
    },
    {
      id: 3,
      name: "Mini",
      desc: "The Mini is a compact, budget-friendly cab that offers a quick and convenient travel solution within the city. It is best suited for solo riders or small groups who need short-distance rides such as daily commutes, shopping trips, or quick meetings. Despite its compact size, the Mini is fuel-efficient, easy to maneuver in traffic, and comes with all the basic facilities needed for a comfortable ride. Perfect for navigating narrow lanes and crowded city roads while keeping the cost low.",
      price: "₹10 / km",
      baseFare: "₹100",
      capacity: "3 Passengers + Driver",
      image: "https://yandex-images.clstorage.net/SI4Bz7233/0c4bb1HZqJu/IwOmiC30oPwUVKBHtnIJAtqzW7oLWhDjx1icuOuLhiJngHH7bBeyv1skjvKPqSRBS6xcKpKkO_9VnuXw1aH0f7cG9Zn8MTZrRVO1RbazSYWN45_9HdsHpVfPnn29yMQgZ1vqp3IL6fQCL0dukfvxVop4Gy8Sp3nlDxj7Yth_KyEpRG-Jre-n8ZSKpY92vktEij5etZHbA28HTxe1KkEWen5Q7uM-TqC8Bm8Dph-4vx2OdF9w0Snwb8GNtybZtuAmKoukSW9tqbzZhiwGuP6DTYRwlnTVEU0vjoYbO6eI0by5mabmdkYtfA9gTinbfPiYwjTYvBssfqaBBLNuVT0paSDE6s_j7KN9XcWlhna_A4HDNtizmFxG64DKl_8gRVD_dt0j4XNCp7sHawenU3D8l409WfmeaHvmxMW5Ltn0K-ggiqSMLazguxDBIIn5vkIAC7VXuZIQwiJEhxc_K4FYfnsYpy78Sua9j2AEIRz_u9YHMh90EK9xa0BLe6yX9O4jKEDtAaWlqzmTReIPtnpAgUzynrTc2gUlRsIfe6AHF797EiCtdk-sd0JpCKaRPLpbA_wcuJhtPuxKTrDs3P_pYeOHKw3tpqK11I6vAb22y0LPcp_z291JbAYEW7knA512v1hsLf9IpTSFI0Ppm338X48znj6SLruihElwKNC06OMiA2WJbe5ptlpM6gwxcUqAA7ZX9VmVCaBFDBaw4EdZdXKcbSKyx-_2xmlHot69eFBBOJy_mSZ54gqJsurZdeEj74osx-1j6HxWzWCKeHHLjAvx1rMVGwxiDM6U-WBHljb-3eEpMwDsdcQjjKiTePhcgL0WeROnuGyOzTlvlbjvYKYDLw4vYiq4mUygQvg-ikeLMVyyHtnMakUEGXktBl4yd1cgqXtJIDcPrsPpWXS3n4q83nEX7PMszUP3Lh80I6koACWHKOXjNJqNbA13sYKBRbHRt1pQBuWHj15940",
    },
    {
      id: 4,
      name: "Luxury",
      desc: "Luxury cars are designed to provide the ultimate travel experience for those who seek comfort, elegance, and exclusivity. Perfect for weddings, VIP guests, business events, and special occasions, these cars feature high-end interiors, premium leather seating, advanced climate control, and cutting-edge technology. With superior suspension and unmatched style, luxury cars ensure that you travel in comfort and make a lasting impression. They are the preferred choice for clients who value prestige and sophistication during their journeys.",
      price: "₹30 / km",
      baseFare: "₹500",
      capacity: "4 Passengers + Driver",
      image: "https://avatars.mds.yandex.net/i?id=9b0d952ae1f29fb37a4500679ed263a5520f2c7a-5351090-images-thumbs&n=13",
    },
  ];

  const [activeCar, setActiveCar] = useState(carFleet[0].id);

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

      {/* === Fleet Accordion Section === */}
      <section className="z_fleet_section container">
        <div className="text-center mb-5">
          <h2 className="z_service_title">
            Broad Selection Of <span className="z_default_txt"> Vehicles</span>
          </h2>
          <p className="z_service_subtitle">
            Enjoy the ride with our diverse fleet of vehicles tailored to your
            needs. Whether you’re planning a short city trip, a family vacation,
            or a luxury travel experience, we have the perfect option for you.
            Comfort, safety, and affordability—every time you ride with us.
          </p>
        </div>

        <div className="z_fleet_list">
          {carFleet.map((car) => (
            <div key={car.id} className="z_fleet_item">
              <div className="z_fleet_header" onClick={() => toggleCar(car.id)}>
                <h4 className="z_fleet_title">{car.name}</h4>
                <span className="z_fleet_icon">
                  {activeCar === car.id ? "−" : "+"}
                </span>
              </div>

              {activeCar === car.id && (
                <div className="z_fleet_body">
                  <div className="z_fleet_details">
                    {/* Rating */}
                    <div className="z_fleet_rating">
                      {Array.from({ length: car.rating }).map((_, i) => (
                        <FaStar key={i} color="#c5a46d" />
                      ))}
                    </div>
                    {/* Description */}
                    <p className="z_fleet_desc">{car.desc}</p>
                    {/* Price */}
                    <p className="z_fleet_price">{car.price}</p>
                  </div>

                  <div className="z_fleet_image d-none d-md-block">
                    <img src={car.image} alt={car.name} />
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
