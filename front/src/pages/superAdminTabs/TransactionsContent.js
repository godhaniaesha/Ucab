import React, { useEffect, useState } from "react";
import { Badge, Button, Modal, Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchTransactions } from "../../redux/slice/transaction.slice"; // ✅ slice import

export default function SA_TransactionsContent() {
  const dispatch = useDispatch();
  const { payouts, loading, error, totals, stats } = useSelector(
    (state) => state.transactions
  );

  console.log("Transactions State:", payouts, loading, error, totals, stats);
  
  const [db_selectedTransaction, db_setSelectedTransaction] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);

  // 🔹 Fetch from API on mount
  useEffect(() => {
    dispatch(fetchTransactions());
  }, [dispatch]);

  const db_handleView = (transaction) => {
    db_setSelectedTransaction(transaction);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page w-100 h-100 p-3 bg-white rounded-3 border border-light w-100">
      {/* Header */}
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">Transactions</h2>
          <p className="text-secondary mb-0">
            Monitor and review all payment transactions.
          </p>
        </div>
      </div>

      {/* Table */}
      <div
        className="table-responsive"
        style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
      >
        {loading ? (
          <div className="text-center py-4">
            {/* Spinner only, no table cell here */}
            <Spinner animation="border" variant="success" />
          </div>
        ) : error ? (
          <p className="text-danger text-center">{error}</p>
        ) : (
          <table className="table table-hover text-nowrap mb-0">
            <thead
              style={{
                position: "sticky",
                top: 0,
                background: "#343a40",
                color: "#fff",
              }}
            >
              <tr>
                <th>#</th>
                <th>Passenger</th>
                <th>Driver</th>
                <th>Pickup</th>
                <th>Drop</th>
                <th>Vehicle Type</th>
                <th>Fare</th>
                <th>Amount</th>
                <th>Status</th>
               
                <th>Transaction ID</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {payouts && payouts.length > 0 ? (
                payouts.map((txn, index) => (
                  <tr key={txn._id || index}>
                    <td>{index + 1}</td>
                    <td>{txn.booking?.passenger?.name}</td>
                    <td>{txn.booking?.assignedDriver?.name || "-"}</td>
                    <td>{txn.booking?.pickup?.address}</td>
                    <td>{txn.booking?.drop?.address}</td>
                    <td>
                      <Badge bg="secondary">
                        {txn.booking?.vehicleType?.toUpperCase() || "N/A"}
                      </Badge>
                    </td>
                    <td>${txn.booking?.fare}</td>
                    <td>${txn.amount ? txn.amount.toFixed(2) : "0.00"}</td>
                    <td>
                      <Badge
                        bg={txn.status === "completed" ? "success" : "warning"}
                      >
                        {txn.status?.toUpperCase()}
                      </Badge>
                    </td>
                    
                    <td>{txn.transactionId}</td>
                    <td>
                      <Button
                        size="sm"
                        style={{
                          backgroundColor: "rgb(21, 136, 109)",
                          border: "none",
                        }}
                        onClick={() => db_handleView(txn)}
                      >
                        <FaEye className="mb-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="11" className="text-center text-muted py-3">
                    No transactions found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Totals summary */}
      {totals && (
        <div className="mt-3 p-3 border rounded bg-light">
          <h6 className="fw-bold">Summary</h6>
          <p>Total Received: ${totals.totalReceived.toFixed(2)}</p>
          <p>Total Sent: ${totals.totalSent.toFixed(2)}</p>
          <p>
            Driver/Owner Earnings: ${totals.driverOwner.totalAmount.toFixed(2)} (
            {totals.driverOwner.totalBookings} bookings)
          </p>
          <p>Passengers Total Sent: ${totals.passenger.totalSent.toFixed(2)}</p>
          <p>Total Passengers: {stats?.totalPassengers}</p>
        </div>
      )}

      {/* Transaction Modal */}
      <Modal
        show={db_showModal}
        onHide={() => db_setShowModal(false)}
        size="lg"
        centered
        contentClassName="d_modal_content"
      >
        <Modal.Header closeButton className="d_modal_header">
          <Modal.Title className="d_modal_title">
            Transaction Details
          </Modal.Title>
        </Modal.Header>
      <Modal.Body className="d_modal_body">
  {db_selectedTransaction && (
    <div className="d_transaction_modal_wrapper">
      <div className="d-flex flex-column flex-lg-row gap-3">
        {/* Booking Info */}
        <div
          className="d_card p-3 border rounded w-100"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <h6 className="mb-3 text-dark fw-bold">Booking Info</h6>
          <p className="mb-0">
            <strong>Passenger:</strong>{" "}
            {db_selectedTransaction.booking?.passenger?.name || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Pickup:</strong>{" "}
            {db_selectedTransaction.booking?.pickup?.address || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Drop:</strong>{" "}
            {db_selectedTransaction.booking?.drop?.address || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Vehicle Type:</strong>{" "}
            {db_selectedTransaction.booking?.vehicleType || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Preferred Model:</strong>{" "}
            {db_selectedTransaction.booking?.preferredVehicleModel || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Distance:</strong>{" "}
            {(db_selectedTransaction.booking?.distanceKm).toFixed(2) || "0"} km
          </p>
          <p className="mb-0">
            <strong>Fare:</strong> ${db_selectedTransaction.booking?.fare || "0"}
          </p>
        </div>

        {/* Transaction Info */}
        <div
          className="d_card p-3 border rounded w-100"
          style={{ backgroundColor: "#f9f9f9" }}
        >
          <h6 className="mb-3 text-dark fw-bold">Transaction Info</h6>
          <p className="mb-0">
            <strong>Total Amount:</strong> ${(db_selectedTransaction.amount).toFixed(2) || "0"}
          </p>
          <p className="mb-0">
            <strong>Owner Commission (20%):</strong> ${(db_selectedTransaction.booking?.fare * 0.1).toFixed(2) || "0"}
          </p>
          <p className="mb-0">
            <strong>Driver Earnings (80%):</strong> ${(db_selectedTransaction.booking?.fare * 0.9).toFixed(2) || "0"}
          </p>
          <p className="mb-0">
            <strong>Status:</strong>{" "}
            {db_selectedTransaction.status?.toUpperCase() || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Payout To:</strong>{" "}

          
            {db_selectedTransaction.booking?.assignedDriver.name || "N/A"}
         
          </p>
          <p className="mb-0">
            <strong>Transaction ID:</strong>{" "}
            {db_selectedTransaction.transactionId || "N/A"}
          </p>
          <p className="mb-0">
            <strong>Completed At:</strong>{" "}
            {db_selectedTransaction.completedAt ? new Date(db_selectedTransaction.completedAt).toLocaleString() : "Not completed"}
          </p>
        </div>
      </div>
    </div>
  )}
</Modal.Body>
      </Modal>
    </div>
  );
}
