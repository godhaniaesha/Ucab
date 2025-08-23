import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPendingPayments, payPendingPayment } from "../../redux/slice/passengers.slice";
import pay from "../../image/nopay.png";
import { Modal, Form } from "react-bootstrap";
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
        onHide={() => { }} // disable outside click close
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
                onClick={() => setMethod(item)}
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
              <Form id="razorpayForm">
                <Form.Group className="mb-3">
                  <Form.Label>Mobile Number</Form.Label>
                  <Form.Control type="text" id="razorpayMobile" placeholder="+91 XXXXX XXXXX" />
                </Form.Group>
                <Form.Group className="mb-3">
                  <Form.Label>UPI ID</Form.Label>
                  <Form.Control type="text" id="razorpayUpi" placeholder="example@upi" />
                </Form.Group>
              </Form>
            )}
          </div>
        </Modal.Body>

        <Modal.Footer>
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

              if (method === "razorpay") {
                const mobile = document.getElementById("razorpayMobile").value.trim();
                const upi = document.getElementById("razorpayUpi").value.trim();

                if (!/^[0-9]{10}$/.test(mobile)) return toast.error("Enter valid 10-digit mobile number");
                if (!upi.includes("@")) return toast.error("Enter valid UPI ID");
              }
              handlePayment(selectedRide);
              toast.success("Payment Processed Successfully!");
              handleClose();
            }}
          >
            Confirm Payment
          </button>
        </Modal.Footer>
      </Modal>

    </div>
  );
};

export default D_PaymentContent;
