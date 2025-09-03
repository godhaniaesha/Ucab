import React, { useState } from 'react';
import '../style/x_app.css';
import "../style/z_app.css";
import '../style/About.css'
import { FaTaxi, FaMoneyBillWave, FaShieldAlt, FaMapMarkedAlt, FaHeadset, FaClock } from "react-icons/fa";

export default function About() {


  const [previewImg, setPreviewImg] = useState(null);

  // Detect mobile
  const isMobile = window.innerWidth <= 768; const openPreview = (imgUrl) => {
    if (!isMobile) {
      setPreviewImg(imgUrl);
    }
  };

  const closePreview = () => {
    setPreviewImg(null);
  };

  return (
    <>
      {/* Hero Section for About Page */}
      <section className="z_about_hero" style={{
        backgroundImage: "url('https://www.wsupercars.com/wallpapers-regular/Nissan/2011-Nissan-GTR-Egoist-004-1440.jpg')"
        ,
      }}>
        <div className="z_about_hero_overlay">
          <div className="z_about_hero_content">
            <h1>About <span className="z_default_txt"> UCAB </span></h1>
            <p>Your trusted partner for safe, reliable, and premium cab services.</p>
            {/* <a href="/booking" className="z_about_btn">
            Book Now
          </a> */}
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="z_about_section mt-0 mt-sm-0">
        <div className="z_about_container mt-0 ">
          <div className="z_about_image">
            <img src="https://carconnectivity.org/wp-content/uploads/2023/02/CCC_Coverage_Vehicles-of-The-Future-1.jpg"
              alt="Book your cab" />
            <img src="https://images.unsplash.com/photo-1503376780353-7e6692767b70?auto=format&fit=crop&w=800&q=80"
              alt="Taxi service" />
            <img src="https://images.unsplash.com/photo-1556761175-4b46a572b786?auto=format&fit=crop&w=800&q=80"
              alt="Professional drivers" />
            <img src="https://images.unsplash.com/photo-1533473359331-0135ef1b58bf?auto=format&fit=crop&w=800&q=80"
              alt="Luxury cabs" />
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
            <button className="z_about_btn" onClick={() => window.location.href = '/taxi'}>Explore More</button>
          </div>
        </div>
      </section>



      {/* Image Gallery */}
      <div className="about-page">
        <div className="about-container">
          {/* Header Section */}
          <div className="about-header">
            <h2> <span className="z_default_txt">Image Gallery </span> that we like to share</h2>
            <p>Who are in extremely love with eco friendly system</p>
          </div>

          <div className="row">
            <div className="col-lg-3 mx-auto single-gallery">
              <img className="img-fluid x_img_com" src="https://media.istockphoto.com/id/520615130/photo/parking-taxi-in-city-on-sunny-day.jpg?s=612x612&w=0&k=20&c=MiON_XwSlrC31oD9bBX0xaCV0x7RygxtwTs2Q4v7QXU=" alt="" onClick={() =>
                openPreview("https://media.istockphoto.com/id/520615130/photo/parking-taxi-in-city-on-sunny-day.jpg?s=612x612&w=0&k=20&c=MiON_XwSlrC31oD9bBX0xaCV0x7RygxtwTs2Q4v7QXU=")
              }
              />
              <img className="img-fluid x_img_com" src="https://media.istockphoto.com/id/864965636/photo/traffic-jam-on-main-street-with-row-of-cars.jpg?s=612x612&w=0&k=20&c=WbzjDW8JNrKZue2tdw7I1q0TZ7Jfznr0LLt4FuR6cls=" alt="" onClick={() =>
                openPreview("https://media.istockphoto.com/id/864965636/photo/traffic-jam-on-main-street-with-row-of-cars.jpg?s=612x612&w=0&k=20&c=WbzjDW8JNrKZue2tdw7I1q0TZ7Jfznr0LLt4FuR6cls=")
              }
              />
            </div>
            <div className="col-lg-3 mx-auto single-gallery">
              <img className="img-fluid x_img_com x_img_spe" src="https://media.istockphoto.com/id/821110722/photo/car-image.jpg?s=612x612&w=0&k=20&c=euIbmJuvO_Ikl4Q9PdUCE6qocM5pXbxE5PCYerLf4mM=" alt=""
                onClick={() =>
                  openPreview("https://media.istockphoto.com/id/821110722/photo/car-image.jpg?s=612x612&w=0&k=20&c=euIbmJuvO_Ikl4Q9PdUCE6qocM5pXbxE5PCYerLf4mM=")
                }
              />
              <img className="img-fluid x_img_com" src="http://media.istockphoto.com/id/1771033912/photo/madrid-taxi.jpg?s=612x612&w=0&k=20&c=qtuZy4w79p46EYmFgstGVcvB365aatrN2RaFn3yn4ok=" alt="" onClick={() =>
                openPreview("http://media.istockphoto.com/id/1771033912/photo/madrid-taxi.jpg?s=612x612&w=0&k=20&c=qtuZy4w79p46EYmFgstGVcvB365aatrN2RaFn3yn4ok=")
              }
              />
            </div>
            <div className="col-lg-3 mx-auto single-gallery">
              <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g3.jpg" alt="" onClick={() =>
                openPreview("https://themewagon.github.io/taxi/img/g3.jpg")
              }
              />
              <img className="img-fluid x_img_com" src="https://media.istockphoto.com/id/2158937921/photo/waymo-jaguar-driverless-car-drives-on-urban-street-in-san-francisco.jpg?s=612x612&w=0&k=20&c=N_5enRPgVSH2WWfmWZatsAOoSDB64aHYCQX4SBtpUSM=" alt="" onClick={() =>
                openPreview("https://media.istockphoto.com/id/2158937921/photo/waymo-jaguar-driverless-car-drives-on-urban-street-in-san-francisco.jpg?s=612x612&w=0&k=20&c=N_5enRPgVSH2WWfmWZatsAOoSDB64aHYCQX4SBtpUSM=")
              }
              />
            </div>
            <div className="col-lg-3 mx-auto single-gallery">

              <img className="img-fluid x_img_com x_img_spe" src="https://themewagon.github.io/taxi/img/g2.jpg" alt="" onClick={() =>
                openPreview("https://themewagon.github.io/taxi/img/g2.jpg")
              }
              />

              <img className="img-fluid x_img_com" src="https://media.istockphoto.com/id/1372563065/photo/paris-taxi-at-night.jpg?s=612x612&w=0&k=20&c=s45Q2b2WH1XulWdFdgCyHtXWR3N1wDkOvHT0HuXfawY=" alt="" onClick={() =>
                openPreview("https://media.istockphoto.com/id/1372563065/photo/paris-taxi-at-night.jpg?s=612x612&w=0&k=20&c=s45Q2b2WH1XulWdFdgCyHtXWR3N1wDkOvHT0HuXfawY=")
              }
              />

            </div>
          </div>

          {/* Preview Modal */}
          {!isMobile && previewImg && (
            <div className="x_img_preview_overlay" onClick={closePreview}>
              <div className="x_img_preview_modal" onClick={(e) => e.stopPropagation()}
              >
                <button className="x_img_preview_close" onClick={closePreview}>
                  ×
                </button>
                <img src={previewImg} alt="Preview" className="x_img_preview_img" />
              </div>
            </div>
          )}
        </div>

        <div className="x_con my-5">
          <div className="x_section_header">
            <p className="x_section_subtitle">Why Us</p>
            <h3 className="x_section_title mb-sm-0">Why Choose Our Cab Service?</h3>
          </div>


          <div className="x_cards_grid">
            {/* <!-- Card 01 - Easy Booking --> */}
            <div className="x_card ">
              <div className="x_card_background"></div>
              <div className="x_card_content">
                <div className="x_card_number">01</div>
                <h3 className="x_card_title">Easy Online Booking</h3>
                <p className="x_card_description">
                  Book your cab in just a few clicks with our user-friendly app or website.
                  No waiting, no hassle – ride when you need it.
                </p>
              </div>
              <div className="x_card_icon">
                <FaTaxi />
              </div>
            </div>

            {/* <!-- Card 02 - Affordable Rides --> */}
            <div className="x_card">
              <div className="x_card_background"></div>
              <div className="x_card_content">
                <div className="x_card_number">02</div>
                <h3 className="x_card_title">Affordable Rides</h3>
                <p className="x_card_description">
                  Enjoy transparent pricing with no hidden charges. Choose from budget,
                  premium, or luxury cabs as per your needs.
                </p>
              </div>
              <div className="x_card_icon">
                <FaMoneyBillWave />
              </div>
            </div>

            {/* <!-- Card 03 - Safety --> */}
            <div className="x_card">
              <div className="x_card_background"></div>
              <div className="x_card_content">
                <div className="x_card_number">03</div>
                <h3 className="x_card_title">Safety & Comfort</h3>
                <p className="x_card_description">
                  All our cabs are sanitized regularly, equipped with safety features, and
                  driven by trained, verified drivers.
                </p>
              </div>
              <div className="x_card_icon">
                <FaShieldAlt />
              </div>
            </div>

            {/* <!-- Card 04 - Live Tracking --> */}
            <div className="x_card">
              <div className="x_card_background"></div>
              <div className="x_card_content">
                <div className="x_card_number">04</div>
                <h3 className="x_card_title">Live Tracking</h3>
                <p className="x_card_description">
                  Track your ride in real-time and share your trip details with friends
                  and family for extra security.
                </p>
              </div>
              <div className="x_card_icon">
                <FaMapMarkedAlt />
              </div>
            </div>

            {/* <!-- Card 05 - 24/7 Support --> */}
            <div className="x_card">
              <div className="x_card_background"></div>
              <div className="x_card_content">
                <div className="x_card_number">05</div>
                <h3 className="x_card_title">24/7 Support</h3>
                <p className="x_card_description">
                  Our customer support team is available round the clock to assist you
                  with any query during your trip.
                </p>
              </div>
              <div className="x_card_icon">
                <FaHeadset />
              </div>
            </div>

            {/* <!-- Card 06 - Faster Pickup --> */}
            <div className="x_card">
              <div className="x_card_background"></div>
              <div className="x_card_content">
                <div className="x_card_number">06</div>
                <h3 className="x_card_title">Faster Pickup</h3>
                <p className="x_card_description">
                  Get a cab at your doorstep within minutes. Our smart allocation system
                  ensures the nearest cab reaches you quickly.
                </p>
              </div>
              <div className="x_card_icon">
                <FaClock />
              </div>
            </div>
          </div>


        </div>
      </div>
    </>
  );
}