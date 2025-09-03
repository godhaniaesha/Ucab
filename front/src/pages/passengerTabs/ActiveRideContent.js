import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPendingPayments, payPendingPayment } from "../../redux/slice/passengers.slice";
import pay from "../../image/nopay.png";
import { Modal, Form, Button } from "react-bootstrap";
import { FaTimes } from "react-icons/fa";

const D_PaymentContent = () => {
  const dispatch = useDispatch();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");
  const [show, setShow] = useState(false);
  const [method, setMethod] = useState("visa");

  const handleClose = () => setShow(false);
  const handleShow = () => setShow(true);

  // Add default empty values to prevent destructuring undefined
  const { pendingPayments = [], loading = false, error = null } = useSelector(
    (state) => state.passenger || {}
  );

  useEffect(() => {
    dispatch(getPendingPayments());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePayment = (ride) => {
    if (!ride) return;
 
    dispatch(payPendingPayment({ paymentId: ride.bookingId }))
      .unwrap()
      .then(() => {
        toast.success("Payment successful!");
        dispatch(getPendingPayments()); // refresh pending list
      })
      .catch((err) => {
        toast.error(err || "Payment failed");
      });
  };

  const processPayment = () => {
    if (!selectedPaymentMethod) {
      toast.error("Please select a payment method");
      return;
    }

    // Here you can call API to process payment
    // For now simulate success
    toast.success(
      `Payment of $${selectedRide.fare.toFixed(
        2
      )} via ${selectedPaymentMethod} processed!`
    );
    setShowPaymentModal(false);
  };

  // Add Razorpay script loader
  const loadRazorpayScript = () => {
    return new Promise((resolve) => {
      if (document.getElementById("razorpay-script")) return resolve(true);
      const script = document.createElement("script");
      script.id = "razorpay-script";
      script.src = "https://checkout.razorpay.com/v1/checkout.js";
      script.onload = () => resolve(true);
      script.onerror = () => resolve(false);
      document.body.appendChild(script);
    });
  };

const handleRazorpayPayment = async (ride) => {
  const res = await loadRazorpayScript();
  if (!res) {
    toast.error("Razorpay SDK failed to load. Are you online?");
    return;
  }

  try {
    // ✅ Request backend to create order
    const response = await fetch("http://localhost:5000/api/payment/create-order", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ amount: Math.round((ride.fare || 100) * 100) }),
    });

    const order = await response.json();

    const options = {
      key: "rzp_test_hN631gyZ1XbXvp", // ✅ Only key_id
      amount: order.amount,
      currency: order.currency,
      name: "UCAB Taxi",
      description: "Cab Booking Payment",
      order_id: order.id, // ✅ Order ID from backend
      handler: function (response) {
        toast.success("Payment Successful! ID: " + response.razorpay_payment_id);
        handlePayment(ride); 
        handleClose();
      },
      prefill: {
        name: "Passenger",
        email: "passenger@email.com",
        contact: "9123456789",
      },
      theme: {
        color: "#0f6e55",
      },
    };

    const rzp = new window.Razorpay(options);
    rzp.open();
  } catch (err) {
    toast.error("Error creating order: " + err.message);
  }
};

  if (loading) {
    return (
      <div className="d_tab_page w-100  h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-primary">Loading pending payments...</p>
      </div>
    );
  }

  if (!pendingPayments || pendingPayments.length === 0) {
    return (
      <div className="d_tab_page w-100  h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center d-flex flex-column align-items-center justify-content-center">
        <img src={pay} style={{ width: "200px", marginBottom: "10px" }}></img>
        <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">
          No Pending Payments
        </h2>
        <p className="text-secondary leading-normal">
          All ride payments are completed.
        </p>
      </div>
    );
  }

  return (
    <div className="d_tab_page w-100  h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light ">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">
        Pending Payments
      </h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        Complete payments for your finished rides
      </p>

      {pendingPayments.map((ride) => (
        <div
          key={ride.payment.id}
          className="bg-success-subtle p-3 rounded-2 border border-success-subtle mb-3"
        >
          <p className="fw-semibold text-success-emphasis">
            Ride ID: {ride.bookingId}
          </p>
          <p className="text-success">Pickup: {ride.pickup?.address}</p>
          <p className="text-success">Drop-off: {ride.drop?.address}</p>
          <p className="text-success">
            Distance: {ride.fareDetails?.distance} km
          </p>
          <p className="text-success">
            Total Fare: ${ride.fare?.toFixed(2)}
          </p>
          <div className="d-flex justify-content-end gap-2 mt-3">
            {/* <button
              className="btn text-white px-4 py-2 rounded-2 fw-semibold"
              style={{ backgroundColor: "#0f6e55" }}
              onClick={() => handlePayment(ride)}
            >
              Process Payment
            </button> */}
            <button
              className="btn text-white px-4 py-2 rounded-2 fw-semibold"
              style={{ backgroundColor: "#0f6e55" }}
              onClick={() => {
                setSelectedRide(ride); // 👈 store ride data in state
                handleShow();
              }}
            >
              Process Payment
            </button>
          </div>
        </div>
      ))}

      <Modal
        show={show}
        onHide={() => { }}
        centered
        backdrop="static"
        keyboard={false}
      >
        <Modal.Header
          className="d-flex justify-content-between align-items-center"
          style={{ backgroundColor: "#0f6e55", color: "#fff" }}
        >
          <h5 className="m-0">Payment Method</h5>
          <FaTimes
            style={{ cursor: "pointer", fontSize: "18px" }}
            onClick={handleClose}
          />
        </Modal.Header>

        <Modal.Body className="d-flex">
          {/* Left Side Payment Options */}
          <div className="d-flex flex-column me-4" style={{ width: "150px" }}>
            {["visa", "paypal", "razorpay"].map((item) => (
              <button
                key={item}
                onClick={() => {
                  setMethod(item);
                  if (item === "razorpay" && selectedRide) {
                    handleRazorpayPayment(selectedRide);
                  }
                }}
                className="mb-2 text-start fw-semibold"
                style={{
                  border: "1px solid #0f6e55",
                  backgroundColor: method === item ? "#0f6e55" : "#fff",
                  color: method === item ? "#fff" : "#0f6e55",
                  padding: "8px 12px",
                  borderRadius: "6px",
                  transition: "0.3s",
                }}
              >
                {item.charAt(0).toUpperCase() + item.slice(1)}
              </button>
            ))}
          </div>

          {/* Right Side Fields */}
          <div className="flex-grow-1">
            {method === "visa" && (
              <Form id="visaForm">
                <Form.Group className="mb-3">
                  <Form.Label>Card Number</Form.Label>
                  <Form.Control type="text" id="cardNumber" placeholder="xxxx xxxx xxxx xxxx" />
                </Form.Group>
                <Form.Group className="mb-3 d-flex gap-2">
                  <div>
                    <Form.Label>Expiration Date</Form.Label>
                    <Form.Control type="text" id="expDate" placeholder="MM/YY" />
                  </div>
                  <div>
                    <Form.Label>CVV</Form.Label>
                    <Form.Control type="password" id="cvv" placeholder="***" />
                  </div>
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Card Holder Name</Form.Label>
                  <Form.Control type="text" id="cardHolder" placeholder="John Doe" />
                </Form.Group>
              </Form>
            )}

            {method === "paypal" && (
              <Form id="paypalForm">
                <Form.Group className="mb-3">
                  <Form.Label>Email</Form.Label>
                  <Form.Control type="email" id="paypalEmail" placeholder="example@paypal.com" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>Password</Form.Label>
                  <Form.Control type="password" id="paypalPassword" placeholder="********" />
                </Form.Group>
              </Form>
            )}

            {method === "razorpay" && (
              <div className="d-flex flex-column align-items-start">
                <p className="mb-2">Pay securely via Razorpay gateway.</p>
                {/* Razorpay opens directly on option click, no button shown */}
              </div>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
          {method !== "razorpay" && (
            <button
              style={{
                backgroundColor: "#0f6e55",
                border: "none",
                color: "#fff",
                padding: "8px 18px",
                borderRadius: "6px",
                fontWeight: "500",
              }}
              onClick={() => {
                if (method === "visa") {
                  const cardNumber = document.getElementById("cardNumber").value.trim();
                  const expDate = document.getElementById("expDate").value.trim();
                  const cvv = document.getElementById("cvv").value.trim();
                  const holder = document.getElementById("cardHolder").value.trim();

                  if (!cardNumber || cardNumber.length < 16) return toast.error("Enter valid card number");
                  if (!expDate) return toast.error("Enter expiration date");
                  if (!cvv || cvv.length < 3) return toast.error("Enter valid CVV");
                  if (!holder) return toast.error("Enter card holder name");
                }

                if (method === "paypal") {
                  const email = document.getElementById("paypalEmail").value.trim();
                  const pass = document.getElementById("paypalPassword").value.trim();

                  if (!email.includes("@")) return toast.error("Enter valid PayPal email");
                  if (!pass || pass.length < 6) return toast.error("Enter valid password");
                }

                handlePayment(selectedRide);
                toast.success("Payment Processed Successfully!");
                handleClose();
              }}
            >
              Confirm Payment
            </button>
          )}
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default D_PaymentContent;
