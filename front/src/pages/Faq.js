import React, { useState } from "react";
import "../style/x_app.css"; // custom css file

const Faq = () => {
  // States for each section
  const [openGeneralIndex, setOpenGeneralIndex] = useState(null);
  const [openBookingIndex, setOpenBookingIndex] = useState(null);
  const [openDealIndex, setOpenDealIndex] = useState(null);
  const [openPackageIndex, setOpenPackageIndex] = useState(null);

  const generalQuestions = [
    { q: "What types of cabs are available?", a: "We offer Sedans, SUVs, and Luxury cars depending on your budget and requirement." },
    { q: "How many people can they hold?", a: "Sedans seat 4, SUVs seat 6, and luxury cars vary depending on the model." },
    { q: "Can I book more than one cab at a time?", a: "Yes, you can book multiple cabs at once for groups or events." },
    { q: "Where can I travel using your cabs?", a: "Our service is available across all major cities in Australia." }
  ];

  const bookingQuestions = [
    { q: "How can I manage my booking?", a: "You can manage your booking from your profile dashboard or mobile app." },
    { q: "Can I cancel my booking?", a: "Yes, bookings can be cancelled up to 1 hour before pickup." },
    { q: "Is there a refund policy?", a: "Refunds are processed automatically if cancelled within the free cancellation period." },
    { q: "Can I reschedule my ride?", a: "Yes, rescheduling is allowed depending on cab availability." }
  ];

  const dealQuestions = [
    { q: "What types of deals are available?", a: "We provide seasonal discounts, referral bonuses, and special promo codes for loyal customers." },
    { q: "Can I combine multiple deals?", a: "Only one promotional deal can be applied per booking. However, loyalty points can be combined with active deals." },
    { q: "How do I know if a deal is valid?", a: "Valid deals will be visible on our website or mobile app. Expired deals are automatically removed." },
    { q: "Do deals apply to all cab types?", a: "Most deals are applicable to all rides, but some offers may be restricted to specific cab categories." }
  ];

  const packageQuestions = [
    { q: "What types of tour packages are available?", a: "We offer city tours, airport transfers, long-distance travel packages, and customizable holiday rides." },
    { q: "Can I customize my package?", a: "Yes, packages can be customized as per your schedule, destinations, and cab preferences." },
    { q: "Are drivers included in the package?", a: "Yes, all tour packages include experienced drivers with knowledge of local routes." },
    { q: "Do packages include fuel and toll charges?", a: "Yes, unless otherwise mentioned, all tour packages are inclusive of fuel and toll charges." }
  ];

  return (

    <>

      {/* Hero Section */}
      <section
        className="service-hero"
        style={{
          backgroundImage:
            "url('https://yandex-images.clstorage.net/9ICmJ6388/b977b6BiM/e4TSF6q-acMCzvaOdfzmpSV0vJnw6lFGGaGnqrcqp3IwOqLApqTqaVGirMUj91ZT3Y2cVu4Bi4vAtWLJRyB0_SaBgx6bo32-b5Pm7yXc6rEtAcmVtJs5V23IrtvjfpteHBqiOE9sf7G1DzRk7hK-Lr2llQPqeNbyvRD72KrBETxHVHZntk4cv9IeX_JdMJYlBTGc-fxrBWsxJfbb2_OXx0FTIoRnsB8B4Ss40PrSDgaJrT2Dn1B2JiFIElBmPTVgs0DqZ4LW9Jvq_vdSxUiOabUJqOkEg1mrYTEai5OTW8dxT9aM96D_2eGTSKDGCspa9Q3h21sgmkYdIJLoVgW9mGcAGucK-mB35sYjdklESoVxfdSZVAvVo11Vek8f81s3zT8O5B8MR2HVf1RUmtK6CoUNuXMTeE4KLXhSQI79sSSr4LKnEt64p_ZWK5ohmAZ9mQmwFWA_Zb_VOXoXc3fXr3W3-uBr1Mc90ffg4Jr6Vpbl2Qk3p3Ti6llMktDS4Y0oH5zGd4IegNN69q--8UiSVXHF2LW438XP7d32ax8nnzchO76YA8jj-emDrHTeloLeaTnVuxto0notNMaEmqFh9Lc4gt-apizLsnJ3Hvlggj2VPRS9jCP1Q1WlIj_j_1dDYU_-wNM4S5Fx7_gItqYaKiHFZcNThGLyPaRuYB7pOexfdL7PlpYAd9Ji--r1JO7pkQGMwUj3oUOxje7Dx--r9-3vooQX8Eud9ZdQVNYqgmbZXeGnKyAKnlG00oAiPYGIZwxeSyZuGGeSivdS2Ri6ieXFnJVQd7WnbR1-v4_7X7_JE1oAO9ATWQnv1MQWOlYK3blBm7_Uzh7FiKpMxj2N1PP4kt9K5pi3_rrTGl1sCv3RNZyBhHP5r_EZPuNfo28_uftOrI9gJ3VlL6zU-i6yAmUFjTurRP7qSfDW0JI1qajfCPIjvv50V4baa9IZbLp56V2sEeiTza8Bnf5TPx8c')" ,
          backgroundSize: "cover",
          backgroundPosition: "center",
        }}
      >
        <div className="service-hero-content">
  <h1>Frequently Asked Questions</h1>
  <p>
    Find quick answers to your queries about bookings, deals, cab services,
    and tour packages. We’re here to guide you every step of the way.
  </p>
</div>

      </section>


      <section>
        <div className="faq_section">
          <div className="x_container_f x_faq_grid">
            {/* General Questions */}
            <div className="x_faq_col">
              <h2 className="x_faq_title">General Questions</h2>
              {generalQuestions.map((item, index) => (
                <div key={index} className={`x_faq_item ${openGeneralIndex === index ? "active" : ""}`}>
                  <button
                    className="x_faq_question"
                    onClick={() => setOpenGeneralIndex(openGeneralIndex === index ? null : index)}
                  >
                    {index + 1}. {item.q}
                    <span>{openGeneralIndex === index ? "▲" : "▼"}</span>
                  </button>
                  {openGeneralIndex === index && <div className="x_faq_answer">{item.a}</div>}
                </div>
              ))}
            </div>

            {/* Booking Questions */}
            <div className="x_faq_col">
              <h2 className="x_faq_title">Managing Your Booking</h2>
              {bookingQuestions.map((item, index) => (
                <div key={index} className={`x_faq_item ${openBookingIndex === index ? "active" : ""}`}>
                  <button
                    className="x_faq_question"
                    onClick={() => setOpenBookingIndex(openBookingIndex === index ? null : index)}
                  >
                    {index + 1}. {item.q}
                    <span>{openBookingIndex === index ? "▲" : "▼"}</span>
                  </button>
                  {openBookingIndex === index && <div className="x_faq_answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>

        <div className="faq_section1">
          <div className="x_container_f x_faq_grid">
            {/* Deal Questions */}
            <div className="x_faq_col">
              <h2 className="x_faq_title">Managing Your Deals</h2>
              {dealQuestions.map((item, index) => (
                <div key={index} className={`x_faq_item ${openDealIndex === index ? "active" : ""}`}>
                  <button
                    className="x_faq_question"
                    onClick={() => setOpenDealIndex(openDealIndex === index ? null : index)}
                  >
                    {index + 1}. {item.q}
                    <span>{openDealIndex === index ? "▲" : "▼"}</span>
                  </button>
                  {openDealIndex === index && <div className="x_faq_answer">{item.a}</div>}
                </div>
              ))}
            </div>

            {/* Package Questions */}
            <div className="x_faq_col">
              <h2 className="x_faq_title">Managing Your Tour Packages</h2>
              {packageQuestions.map((item, index) => (
                <div key={index} className={`x_faq_item ${openPackageIndex === index ? "active" : ""}`}>
                  <button
                    className="x_faq_question"
                    onClick={() => setOpenPackageIndex(openPackageIndex === index ? null : index)}
                  >
                    {index + 1}. {item.q}
                    <span>{openPackageIndex === index ? "▲" : "▼"}</span>
                  </button>
                  {openPackageIndex === index && <div className="x_faq_answer">{item.a}</div>}
                </div>
              ))}
            </div>
          </div>
        </div>
      </section>
    </>
  );
};

export default Faq;
