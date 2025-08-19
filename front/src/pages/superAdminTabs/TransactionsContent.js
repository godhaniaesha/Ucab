import React, { useState } from "react";
import { Badge, Button, Modal } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

export default function SA_TransactionsContent() {
  const [db_selectedTransaction, db_setSelectedTransaction] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);

  // 🔹 Sample static transactions
  const db_transactions = [
    {
      id: 1,
      booking: {
        passengerName: "Alice Johnson",
        pickup: "123 Main St, City",
        drop: "456 Park Ave, City",
        vehicleType: "standard",
        preferredVehicleModel: "Toyota Camry",
        fare: 25,
        distanceKm: 12,
      },
      amount: 25,
      status: "completed",
      payoutTo: "John Doe",
      payoutType: "driver",
      transactionId: "TXN123456",
      completedAt: "2025-08-01 10:30 AM",
    },
    {
      id: 2,
      booking: {
        passengerName: "Bob Smith",
        pickup: "789 Elm St, City",
        drop: "321 Oak St, City",
        vehicleType: "premium",
        preferredVehicleModel: "Honda Civic",
        fare: 40,
        distanceKm: 20,
      },
      amount: 40,
      status: "pending",
      payoutTo: "Jane Smith",
      payoutType: "owner",
      transactionId: "TXN789012",
      completedAt: null,
    },
  ];

  const db_handleView = (transaction) => {
    db_setSelectedTransaction(transaction);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page p-3 bg-white rounded-3 border border-light w-100">
      {/* Header */}
      <div className="d-flex flex-column flex-md-row justify-content-between align-items-start mb-3">
        <div>
          <h2 className="fs-4 fw-bold text-dark mb-1">Transactions</h2>
          <p className="text-secondary mb-0">Monitor and review all payment transactions.</p>
        </div>
      </div>

      {/* Responsive Table */}
      <div
        className="table-responsive"
        style={{ maxHeight: "400px", overflowY: "auto", overflowX: "auto" }}
      >
        <table className="table table-hover text-nowrap mb-0">
          <thead style={{ position: "sticky", top: 0, background: "#343a40", color: "#fff" }}>
            <tr>
              <th>#</th>
              <th>Passenger</th>
              <th>Pickup</th>
              <th>Drop</th>
              <th>Vehicle Type</th>
              <th>Fare</th>
              <th>Amount</th>
              <th>Status</th>
              <th>Payout To</th>
              <th>Transaction ID</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {db_transactions.map((txn, index) => (
              <tr key={txn.id}>
                <td>{index + 1}</td>
                <td>{txn.booking.passengerName}</td>
                <td>{txn.booking.pickup}</td>
                <td>{txn.booking.drop}</td>
                <td>
                  <Badge bg="secondary">{txn.booking.vehicleType.toUpperCase()}</Badge>
                </td>
                <td>${txn.booking.fare}</td>
                <td>${txn.amount}</td>
                <td>
                  <Badge bg={txn.status === "completed" ? "success" : "warning"}>
                    {txn.status.toUpperCase()}
                  </Badge>
                </td>
                <td>{txn.payoutTo}</td>
                <td>{txn.transactionId}</td>
                <td>
                  <Button
                    size="sm"
                    style={{ backgroundColor: "rgb(21, 136, 109)", border: "none" }}
                    onClick={() => db_handleView(txn)}
                  >
                    <FaEye className="mb-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {/* Transaction Modal */}
    {/* Transaction Modal */}
<Modal
  show={db_showModal}
  onHide={() => db_setShowModal(false)}
  size="lg"
  centered
  contentClassName="d_modal_content"
>
  <Modal.Header closeButton className="d_modal_header">
    <Modal.Title className="d_modal_title">Transaction Details</Modal.Title>
  </Modal.Header>
  <Modal.Body className="d_modal_body">
    {db_selectedTransaction && (
      <div className="d_transaction_modal_wrapper">
        {/* Two-column layout for Booking & Transaction Info on large screens */}
        <div className="d-flex flex-column flex-lg-row gap-3">
          {/* Booking Info Card */}
          <div className="d_card p-3 border rounded w-100" style={{ backgroundColor: "#f9f9f9" }}>
            <h6 className="mb-3 text-dark fw-bold">Booking Info</h6>
            <div className="d-flex flex-column gap-1">
              <p className="mb-0"><strong>Passenger:</strong> {db_selectedTransaction.booking.passengerName}</p>
              <p className="mb-0"><strong>Pickup:</strong> {db_selectedTransaction.booking.pickup}</p>
              <p className="mb-0"><strong>Drop:</strong> {db_selectedTransaction.booking.drop}</p>
              <p className="mb-0"><strong>Vehicle Type:</strong> {db_selectedTransaction.booking.vehicleType}</p>
              <p className="mb-0"><strong>Preferred Model:</strong> {db_selectedTransaction.booking.preferredVehicleModel}</p>
              <p className="mb-0"><strong>Distance:</strong> {db_selectedTransaction.booking.distanceKm} km</p>
              <p className="mb-0"><strong>Fare:</strong> ${db_selectedTransaction.booking.fare}</p>
            </div>
          </div>

          {/* Transaction Info Card */}
          <div className="d_card p-3 border rounded w-100" style={{ backgroundColor: "#f9f9f9" }}>
            <h6 className="mb-3 text-dark fw-bold">Transaction Info</h6>
            <div className="d-flex flex-column gap-1">
              <p className="mb-0"><strong>Amount:</strong> ${db_selectedTransaction.amount}</p>
              <p className="mb-0"><strong>Status:</strong> {db_selectedTransaction.status.toUpperCase()}</p>
              <p className="mb-0"><strong>Payout To:</strong> {db_selectedTransaction.payoutTo} ({db_selectedTransaction.payoutType})</p>
              <p className="mb-0"><strong>Transaction ID:</strong> {db_selectedTransaction.transactionId}</p>
              <p className="mb-0"><strong>Completed At:</strong> {db_selectedTransaction.completedAt || "Not completed"}</p>
            </div>
          </div>
        </div>
      </div>
    )}
  </Modal.Body>
</Modal>

    </div>
  );
}
