import React, { useState } from "react";
import { Modal, Button, Badge } from "react-bootstrap";
import { FaEye } from "react-icons/fa";

export default function SA_ManagePassengersContent() {
  const [db_selectedPassenger, db_setSelectedPassenger] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);

  // 🔹 Sample passengers (schema fields)
  const db_passengers = [
    {
      id: 1,
      name: "Alice Johnson",
      email: "alice.j@email.com",
      phone: "+1 555-1111",
      status: "ACTIVE",
      createdAt: "2025-08-05",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
    {
      id: 2,
      name: "Bob Williams",
      email: "bob.w@email.com",
      phone: "+1 555-2222",
      status: "BLOCKED",
      createdAt: "2025-07-20",
      profileImage: "/user.png",
    },
  ];

  const db_handleView = (passenger) => {
    db_setSelectedPassenger(passenger);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 border border-light shadow-sm w-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-3 fw-bold text-dark mb-1">Manage Passengers</h2>
          <p className="text-secondary">
            View, approve, block, or edit passenger accounts.
          </p>
        </div>
      </div>

      {/* Table Wrapper with Scroll */}
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
              <th>Status</th>
              <th>Joined</th>
              <th>Action</th>
            </tr>
          </thead>
          <tbody>
            {db_passengers.map((passenger, index) => (
              <tr key={index}>
                <td>{index + 1}</td>
                <td>
                  <div className="d-flex align-items-center gap-2">
                    <img
                      src={passenger.profileImage}
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
                <td>
                  <Badge
                    bg={
                      passenger.status === "ACTIVE"
                        ? "dark"
                        : passenger.status === "BLOCKED"
                        ? "secondary"
                        : "secondary"
                    }
                  >
                    {passenger.status}
                  </Badge>
                </td>
                <td>{passenger.createdAt}</td>
                <td>
                  <Button
                    style={{
                      backgroundColor: "rgb(21, 136, 109)",
                      border: "none",
                    }}
                    size="sm"
                    onClick={() => db_handleView(passenger)}
                  >
                    <FaEye className="mb-1" />
                  </Button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

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
                  src={db_selectedPassenger.profileImage}
                  alt={db_selectedPassenger.name}
                  className="d_profile_img"
                />
                <div>
                  <h4 className="d_profile_name">{db_selectedPassenger.name}</h4>
                  <span className="d_profile_status">
                    {db_selectedPassenger.status}
                  </span>
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
                    Joined {db_selectedPassenger.createdAt}
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
