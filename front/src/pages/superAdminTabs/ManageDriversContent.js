import React, { useEffect, useState } from "react";
import { Modal, Button, Badge, Spinner } from "react-bootstrap";
import { FaEye } from "react-icons/fa";
import { useDispatch, useSelector } from "react-redux";
import { fetchDrivers } from "../../redux/slice/admin.slice"; // ✅ adjust path if needed

export default function SA_ManageDriversContent() {
  const dispatch = useDispatch();

  // 🔹 Redux state
  const { drivers, loading, error } = useSelector((state) => state.admin.drivers);
  console.log(drivers,'dfg');
  
  const [db_selectedDriver, db_setSelectedDriver] = useState(null);
  const [db_showModal, db_setShowModal] = useState(false);

  // 🔹 Fetch drivers on mount
  useEffect(() => {
    dispatch(fetchDrivers());
  }, [dispatch]);

  const db_handleView = (driver) => {
    db_setSelectedDriver(driver);
    db_setShowModal(true);
  };

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 border border-light shadow-sm w-100">
      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-3 fw-bold text-dark mb-1">Manage Drivers</h2>
          <p className="text-secondary">
            View, approve, block, or edit driver accounts.
          </p>
        </div>
      </div>

      {/* Loader / Error */}
      {loading && (
        <div className="text-center py-4">
          <Spinner animation="border" />
        </div>
      )}
      {error && <p className="text-danger">{error}</p>}

      {/* Table */}
      {!loading && drivers?.length > 0 && (
        <div
          className="table"
          style={{ maxHeight: "400px", overflow: "auto", width: "95%" }}
        >
          <table className="table align-middle table-hover text-nowrap">
            <thead className="bg-dark text-white sticky-top">
              <tr>
                <th>#</th>
                <th>Driver</th>
                <th>Email</th>
                <th>Phone</th>
                <th>Status</th>
                <th>Joined</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {drivers.map((driver, index) => (
                <tr key={driver._id || index}>
                  <td>{index + 1}</td>
                  <td>
                    <div className="d-flex align-items-center gap-2">
                      <img
                        src={driver.profileImage || "/user.png"}
                        alt={driver.name}
                        className="rounded-circle border"
                        style={{ width: 40, height: 40, objectFit: "cover" }}
                      />
                      <div>
                        <div className="fw-semibold">{driver.name}</div>
                        <small className="text-muted">
                          {driver.vehicle?.make} {driver.vehicle?.model}
                        </small>
                      </div>
                    </div>
                  </td>
                  <td>{driver.email}</td>
                  <td>{driver.phone}</td>
                  <td>
                    <Badge
                      bg={
                        driver.status === "ONLINE"
                          ? "dark"
                          : driver.status === "OFFLINE"
                          ? "secondary"
                          : "secondary"
                      }
                    >
                      {driver.status}
                    </Badge>
                  </td>
                  <td>
                    {driver.createdAt
                      ? new Date(driver.createdAt).toLocaleDateString()
                      : "N/A"}
                  </td>
                  <td>
                    <Button
                      style={{
                        backgroundColor: "rgb(21, 136, 109)",
                        border: "none",
                      }}
                      size="sm"
                      onClick={() => db_handleView(driver)}
                    >
                      <FaEye className="mb-1" />
                    </Button>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      {/* Driver Details Modal */}
      <Modal
        show={db_showModal}
        onHide={() => db_setShowModal(false)}
        size="lg"
        centered
        contentClassName="d_modal_content"
      >
        <Modal.Header closeButton className="d_modal_header">
          <Modal.Title className="d_modal_title">Driver Profile</Modal.Title>
        </Modal.Header>
        <Modal.Body className="d_modal_body">
          {db_selectedDriver && (
            <div className="d_profile_wrapper">
              {/* Profile Header */}
              <div className="d_profile_header">
                <img
                  src={db_selectedDriver.profileImage || "/user.png"}
                  alt={db_selectedDriver.name}
                  className="d_profile_img"
                />
                <div>
                  <h4 className="d_profile_name">{db_selectedDriver.name}</h4>
                </div>
              </div>

              {/* Info Grid */}
              <div className="d_info_grid">
                {/* Contact Info */}
                <div className="d_card">
                  <h6 className="d_card_title">Contact Info</h6>
                  <p>
                    <i className="fa fa-envelope me-2 text-primary"></i>
                    {db_selectedDriver.email}
                  </p>
                  <p>
                    <i className="fa fa-phone me-2 text-success"></i>
                    {db_selectedDriver.phone}
                  </p>
                  <p>
                    <i className="fa fa-calendar me-2 text-secondary"></i>
                    Joined{" "}
                    {db_selectedDriver.createdAt
                      ? new Date(db_selectedDriver.createdAt).toLocaleDateString()
                      : "N/A"}
                  </p>
                </div>

                {/* Vehicle Info */}
                {db_selectedDriver.vehicle && (
                  <div className="d_card">
                    <h6 className="d_card_title">Vehicle Info</h6>
                    <p>
                      <i className="fa fa-car me-2 text-warning"></i>
                      {db_selectedDriver.vehicle.make}
                    </p>
                    <p>
                      <i className="fa fa-car-side me-2 text-info"></i>
                      {db_selectedDriver.vehicle.model}
                    </p>
                  </div>
                )}
              </div>

              {/* Bank + Payment */}
              <div className="d_info_grid">
                {db_selectedDriver.bankDetails && (
                  <div className="d_card">
                    <h6 className="d_card_title">Bank Details</h6>
                    <p>
                      <strong>Bank:</strong>{" "}
                      {db_selectedDriver.bankDetails.bankName}
                    </p>
                    <p>
                      <strong>Branch:</strong>{" "}
                      {db_selectedDriver.bankDetails.branchName}
                    </p>
                    <p>
                      <strong>Holder:</strong>{" "}
                      {db_selectedDriver.bankDetails.accountHolderName}
                    </p>
                    <p>
                      <strong>Acc No:</strong>{" "}
                      {db_selectedDriver.bankDetails.accountNumber}
                    </p>
                    <p>
                      <strong>IFSC:</strong>{" "}
                      {db_selectedDriver.bankDetails.ifscCode}
                    </p>
                  </div>
                )}

                {db_selectedDriver.paymentMethods?.length > 0 && (
                  <div className="d_card">
                    <h6 className="d_card_title">Payment Methods</h6>
                    {db_selectedDriver.paymentMethods.map((method, idx) => (
                      <div key={idx} className="d_payment_card">
                        <p>
                          <strong>{method.provider}</strong> ({method.methodType})
                        </p>
                        <p>Last 4: **** {method.last4}</p>
                        <small className="text-muted">
                          ID: {method.customerId}
                        </small>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            </div>
          )}
        </Modal.Body>
      </Modal>
    </div>
  );
}
