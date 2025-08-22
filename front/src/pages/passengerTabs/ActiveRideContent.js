import React, { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { toast } from "react-toastify";
import { getPendingPayments, payPendingPayment } from "../../redux/slice/passengers.slice";

const D_PaymentContent = () => {
  const dispatch = useDispatch();
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [selectedRide, setSelectedRide] = useState(null);
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState("");

  // Add default empty values to prevent destructuring undefined
  const { pendingPayments = [], loading = false, error = null } = useSelector(
    (state) =>state.passenger || {}
  );
  
  useEffect(() => {
    dispatch(getPendingPayments());
  }, [dispatch]);

  useEffect(() => {
    if (error) toast.error(error);
  }, [error]);

  const handlePayment = (ride) => {
  if (!ride) return;

  const method = "cash"; // You can set default or dynamically choose
  dispatch(payPendingPayment({ paymentId: ride.bookingId}));
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
      <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
        <p className="text-primary">Loading pending payments...</p>
      </div>
    );
  }

  if (!pendingPayments || pendingPayments.length === 0) {
    return (
      <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light text-center">
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
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
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
            <button
              className="btn text-white px-4 py-2 rounded-2 fw-semibold"
              style={{ backgroundColor: "#0f6e55" }}
              onClick={() => handlePayment(ride)}
            >
              Process Payment
            </button>
          </div>
        </div>
      ))}

      {showPaymentModal && (
        <div className="modal show d-block" tabIndex="-1">
          <div className="modal-dialog">
            <div className="modal-content">
              <div className="modal-header">
                <h5 className="modal-title">Select Payment Method</h5>
                <button
                  type="button"
                  className="btn-close"
                  onClick={() => setShowPaymentModal(false)}
                ></button>
              </div>
              <div className="modal-body">
                {["cash", "card", "upi"].map((method) => (
                  <div className="form-check mb-3" key={method}>
                    <input
                      type="radio"
                      className="form-check-input"
                      name="paymentMethod"
                      id={method}
                      value={method}
                      onChange={(e) => setSelectedPaymentMethod(e.target.value)}
                    />
                    <label className="form-check-label" htmlFor={method}>
                      {method.charAt(0).toUpperCase() + method.slice(1)}
                    </label>
                  </div>
                ))}
              </div>
              <div className="modal-footer">
                <button
                  type="button"
                  className="btn btn-secondary"
                  onClick={() => setShowPaymentModal(false)}
                >
                  Cancel
                </button>
                <button
                  type="button"
                  className="btn btn-primary"
                  onClick={processPayment}
                >
                  Confirm Payment
                </button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default D_PaymentContent;
