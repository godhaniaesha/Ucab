import React, { useEffect } from "react";
import "../style/z_app.css";
import { FaClock, FaEnvelope, FaMapMarkerAlt, FaPhoneAlt } from "react-icons/fa";
import "../style/Contect.css";
import Footer from "../component/Footer";
import { useDispatch, useSelector } from "react-redux";
import {
  createContact,
  clearContactError,
  clearContactSuccess,
} from "../redux/slice/contact.slice";
import { useFormik } from "formik";
import * as Yup from "yup";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

// ✅ Validation Schema with Yup
const validationSchema = Yup.object({
  name: Yup.string().required("Name is required"),
  email: Yup.string().email("Invalid email").required("Email is required"),
  subject: Yup.string().required("Subject is required"),
  message: Yup.string().min(10, "Message must be at least 10 characters").required("Message is required"),
});

export default function Contact() {
  const dispatch = useDispatch();

  const { loading, error, success, message } = useSelector(
    (state) => state.contact
  );

  // ✅ Formik Setup
const formik = useFormik({
  initialValues: {
    name: "",
    email: "",
    subject: "",
    message: "",
  },
  validationSchema,
  onSubmit: (values) => {
    dispatch(createContact(values));
  },
});


  // ✅ Handle toast messages
useEffect(() => {
  if (success) {
    toast.success("Message sent successfully!");
    formik.resetForm();   // <-- clear form here after success
  }
  if (error) {
    toast.error(error);
  }

  if (success || error) {
    const timer = setTimeout(() => {
      dispatch(clearContactSuccess());
      dispatch(clearContactError());
    }, 4000);
    return () => clearTimeout(timer);
  }
}, [success, error, message, dispatch]);

  return (
    <>
      {/* Hero Section */}
      <section className="z_cntct_hero">
        <div className="z_cntct_hero_overlay">
          <div className="z_cntct_hero_content">
            <h1 className="z_cntct_hero_title">Contact Us</h1>
            <p className="z_cntct_hero_subtitle">
              We’re here to assist you — anytime, anywhere.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Us */}
      <section className="z_cntct_section">
        <div className="z_cntct_overlay">
          <div className="container">
            <div className="row g-4">
              {/* Left Side - Info */}
              <div className="col-md-6 mt-0 px-0">
                <div className="z_cntct_info h-100">
                  <div className="z_cntct_info_inner">
                    <h2 className="z_cntct_title">Get in Touch</h2>
                    <p className="z_cntct_subtitle">
                      Experience comfort, class, and safety. Book your premium
                      ride today.
                    </p>
                    <ul>
                      <li>
                        <FaPhoneAlt /> +91 98765 43210
                      </li>
                      <li>
                        <FaEnvelope /> info@cabbooking.com
                      </li>
                      <li>
                        <FaMapMarkerAlt /> 123 Green Street, Ahmedabad, India
                      </li>
                      <li>
                        <FaClock /> Mon - Sun: 24/7 Service
                      </li>
                    </ul>
                  </div>
                </div>
              </div>

              {/* Right Side - Form */}
              <div className="col-md-6 pb-4" style={{ padding: "0 20px" }}>
                <div className="z_cntct_form h-100 d-flex align-items-center">
                  <form className="w-100" onSubmit={formik.handleSubmit}>
                    <input
                      type="text"
                      name="name"
                      placeholder="Your Name"
                      value={formik.values.name}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.name && formik.errors.name && (
                      <p className="text-danger">{formik.errors.name}</p>
                    )}

                    <input
                      type="email"
                      name="email"
                      placeholder="Your Email"
                      value={formik.values.email}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.email && formik.errors.email && (
                      <p className="text-danger">{formik.errors.email}</p>
                    )}

                    <input
                      type="text"
                      name="subject"
                      placeholder="Subject"
                      value={formik.values.subject}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    />
                    {formik.touched.subject && formik.errors.subject && (
                      <p className="text-danger">{formik.errors.subject}</p>
                    )}

                    <textarea
                      name="message"
                      placeholder="Your Message"
                      rows="4"
                      value={formik.values.message}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                    ></textarea>
                    {formik.touched.message && formik.errors.message && (
                      <p className="text-danger">{formik.errors.message}</p>
                    )}

                    <button
                      type="submit"
                      className="z_cntct_btn"
                      disabled={loading}
                    >
                      {loading ? "Sending..." : "Send Message"}
                    </button>
                  </form>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Map Section */}
      <section className="container mb-5">
        <div className="z_cntct_map_section">
          <iframe
            className="z_cntct_map"
            src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3683.8914058748824!2d72.5713625749929!3d22.58904567948078!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x395e84f2be0a4f97%3A0x64b6ab7e9e8f4c25!2sAhmedabad%2C%20Gujarat%2C%20India!5e0!3m2!1sen!2sin!4v1690284576826!5m2!1sen!2sin"
            allowFullScreen=""
            loading="lazy"
            referrerPolicy="no-referrer-when-downgrade"
            title="Our Location"
          ></iframe>
        </div>
      </section>

    </>
  );
}
