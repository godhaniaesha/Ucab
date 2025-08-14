import React from 'react';
import '../style/x_app.css';
import "../style/z_app.css";
import '../style/About.css'

export default function About() {
  return (
    <>
      {/* Hero Section for About Page */}
      <section
        className="z_about_hero"
        style={{
          backgroundImage:
            "url('https://www.wsupercars.com/wallpapers-regular/Nissan/2011-Nissan-GTR-Egoist-004-1440.jpg')",
        }}
      >
        <div className="z_about_hero_overlay">
          <div className="z_about_hero_content">
            <h1>About UCAB</h1>
            <p>Your trusted partner for safe, reliable, and premium cab services.</p>
            <a href="/booking" className="z_about_btn">
              Book Now
            </a>
          </div>
        </div>
      </section>

      {/* About section */}
      <section className="z_about_section mt-0 mt-sm-0">
        <div className="z_about_container mt-0 ">
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

      {/* Image Gallery */}
      <div className="about-page">
        <div className="about-container">
          {/* Header Section */}
          <div className="about-header">
            <h1>Image Gallery that we like to share</h1>
            <p>Who are in extremely love with eco friendly system</p>
          </div>

          <div className="row">
            <div className="col-lg-3 mx-auto single-gallery">
              <a href="img/g1.jpg" className="img-gal">
                <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g1.jpg" alt="" />
              </a>
              <a href="img/g4.jpg" className="img-gal">
                <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g4.jpg" alt="" />
              </a>
            </div>
            <div className="col-lg-3 mx-auto single-gallery">
              <a href="img/g2.jpg" className="img-gal">
                <img className="img-fluid x_img_com x_img_spe" src="https://themewagon.github.io/taxi/img/g2.jpg" alt="" />
              </a>
              <a href="img/g5.jpg" className="img-gal">
                <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g5.jpg" alt="" />
              </a>
            </div>
            <div className="col-lg-3 mx-auto single-gallery">
              <a href="img/g3.jpg" className="img-gal">
                <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g3.jpg" alt="" />
              </a>
              <a href="img/g6.jpg" className="img-gal">
                <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g6.jpg" alt="" />
              </a>
            </div>
            <div className="col-lg-3 mx-auto single-gallery">
              <a href="img/g2.jpg" className="img-gal">
                <img className="img-fluid x_img_com x_img_spe" src="https://themewagon.github.io/taxi/img/g2.jpg" alt="" />
              </a>
              <a href="img/g5.jpg" className="img-gal">
                <img className="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g5.jpg" alt="" />
              </a>
            </div>
          </div>
        </div>
      </div>
    </>
  );
}
