import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import { fetchPassengers } from "../../redux/slice/admin.slice"; // adjust path as needed
import { Modal, Button, Spinner, Alert } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

export default function SA_ManagePassengersContent() {
  const dispatch = useDispatch();
  const { passengers, loading, error } = useSelector(
    (state) => state.admin.passengers
  );
  console.log(passengers,'dfgrf');
  
  const [db_selectedPassenger, db_setSelectedPassenger] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);
  
  // 🔹 Fetch passengers on mount
  useEffect(() => {
    dispatch(fetchPassengers());
  }, [dispatch]);

  const db_handleView = (passenger) => {
    db_setSelectedPassenger(passenger);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 border border-light shadow-sm w-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-3 fw-bold text-dark mb-1">Manage Passengers</h2>
          <p className="text-secondary">
            View, approve, block, or edit passenger accounts.
          </p>
        </div>
      </div>

      {/* Loader / Error */}
      {loading && (
        <div className="text-center my-4">
          <Spinner animation="border" variant="dark" />
        </div>
      )}
      {error && <Alert variant="danger">{error}</Alert>}

      {/* Table Wrapper */}
      {!loading && !error && passengers?.length > 0 && (
        <div
          className="table"
          style={{ maxHeight: "400px", overflow: "auto", width: "95%" }}
        >
          <table className="table align-middle table-hover text-nowrap">
            <thead className="bg-dark text-white sticky-top">
              <tr>
                <th>#</th>
                <th>Passenger</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Joined</th>
             
              </tr>
            </thead>
            <tbody>
              {passengers.map((passenger, index) => (
                <tr key={passenger._id}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={passenger.profileImage || "/user.png"}
                        alt={passenger.name}
                        className="rounded-circle border"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-semibold">{passenger.name}</div>
                      </div>
                    </div>
                  </td>
                  <td>{passenger.email}</td>
                  <td>{passenger.phone}</td>
                  <td>{new Date(passenger.createdAt).toLocaleDateString()}</td>
                
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Passenger Details Modal */}
      <Modal
        show={db_showModal}
        onHide={() => db_setShowModal(false)}
        size="md"
        centered
        contentClassName="d_modal_content"
      >
        <Modal.Header closeButton className="d_modal_header">
          <Modal.Title className="d_modal_title">Passenger Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d_modal_body">
          {db_selectedPassenger && (
            <div className="d_profile_wrapper">
              {/* Profile Header */}
              <div className="d_profile_header">
                <img
                  src={db_selectedPassenger.profileImage || "/user.png"}
                  alt={db_selectedPassenger.name}
                  className="d_profile_img"
                />
                <div>
                  <h4 className="d_profile_name">
                    {db_selectedPassenger.name}
                  </h4>
                </div>
              </div>

              {/* Info */}
              <div className="d_info_grid">
                <div className="d_card">
                  <h6 className="d_card_title">Contact Info</h6>
                  <p>
                    <i className="fa fa-envelope me-2 text-primary"></i>
                    {db_selectedPassenger.email}
                  </p>
                  <p>
                    <i className="fa fa-phone me-2 text-success"></i>
                    {db_selectedPassenger.phone}
                  </p>
                  <p>
                    <i className="fa fa-calendar me-2 text-secondary"></i>
                    Joined{" "}
                    {new Date(
                      db_selectedPassenger.createdAt
                    ).toLocaleDateString()}
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
