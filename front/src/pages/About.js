import React from 'react';
import '../style/x_app.css';

export default function About() {
  return (
    <div className="about-page">
      <div className="about-container">
        {/* Header Section */}
        <div className="about-header">
          <h1>Image Gallery that we like to share</h1>
          <p>Who are in extremely love with eco friendly system</p>
        </div>

        <div class="row">
          <div class="col-lg-3 mx-auto single-gallery">
            <a href="img/g1.jpg" class="img-gal"><img class="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g1.jpg" alt="" /></a>
            <a href="img/g4.jpg" class="img-gal"><img class="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g4.jpg" alt="" /></a>
          </div>
          <div class="col-lg-3 mx-auto single-gallery">
            <a href="img/g2.jpg" class="img-gal"><img class="img-fluid x_img_com x_img_spe" src="https://themewagon.github.io/taxi/img/g2.jpg" alt="" /></a>
            <a href="img/g5.jpg" class="img-gal"><img class="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g5.jpg" alt="" /></a>
          </div>
          <div class="col-lg-3 mx-auto single-gallery">
            <a href="img/g3.jpg" class="img-gal"><img class="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g3.jpg" alt="" /></a>
            <a href="img/g6.jpg" class="img-gal"><img class="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g6.jpg" alt="" /></a>
          </div>
          <div class="col-lg-3 mx-auto single-gallery">
            <a href="img/g2.jpg" class="img-gal"><img class="img-fluid x_img_com x_img_spe" src="https://themewagon.github.io/taxi/img/g2.jpg" alt="" /></a>
            <a href="img/g5.jpg" class="img-gal"><img class="img-fluid x_img_com" src="https://themewagon.github.io/taxi/img/g5.jpg" alt="" /></a>
          </div>
        </div>
       
      </div>
    </div>
  );
}