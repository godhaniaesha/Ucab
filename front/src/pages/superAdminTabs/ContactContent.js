import React, { useEffect, useState } from "react";
import { Modal, Button, Spinner } from "react-bootstrap";
import { FaEye, FaRemoveFormat } from "react-icons/fa";
import axiosInstance from "../../util/axiosInstance";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import { RiDeleteBin6Line } from "react-icons/ri";

export default function ContactContent() {
  const [contacts, setContacts] = useState([]);
  const [contact, setContact] = useState(null);
  const [loading, setLoading] = useState(false);

  const [showModal, setShowModal] = useState(false); // view modal
  const [showDeleteModal, setShowDeleteModal] = useState(false); // delete modal
  const [selectedContactId, setSelectedContactId] = useState(null);

  // 🔹 Fetch all contacts on mount
  useEffect(() => {
    fetchContacts();
  }, []);

  const fetchContacts = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.get("http://localhost:5000/api/contact");
      setContacts(res.data || []);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch contacts");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Get single contact
  const handleView = async (id) => {
    try {
      setLoading(true);
      const res = await axiosInstance.get(
        `http://localhost:5000/api/contact/${id}`
      );
      setContact(res.data.data || res.data);
      setShowModal(true);
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to fetch details");
    } finally {
      setLoading(false);
    }
  };

  // 🔹 Open delete confirmation modal
  const handleDeleteClick = (id) => {
    setSelectedContactId(id);
    setShowDeleteModal(true);
  };

  // 🔹 Confirm delete
  const handleDeleteConfirm = async () => {
    try {
      setLoading(true);
      const res = await axiosInstance.delete(
        `http://localhost:5000/api/contact/${selectedContactId}`
      );
      toast.success(res.data.message || "Deleted successfully");
      setContacts((prev) => prev.filter((c) => c._id !== selectedContactId));
    } catch (err) {
      toast.error(err.response?.data?.message || "Failed to delete");
    } finally {
      setLoading(false);
      setShowDeleteModal(false);
      setSelectedContactId(null);
    }
  };

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 border border-light shadow-sm w-100">
      <ToastContainer position="top-right" autoClose={4000} />

      {/* Header */}
      <div className="d-flex justify-content-between align-items-center mb-4">
        <div>
          <h2 className="fs-3 fw-bold text-dark mb-1">Manage Contacts</h2>
          <p className="text-secondary">View all contact form submissions.</p>
        </div>
      </div>

      {/* Table */}
      <div
        className="table"
        style={{ maxHeight: "400px", overflow: "auto", width: "95%" }}
      >
        {loading ? (
          <div className="text-center py-4">
            <Spinner animation="border" variant="success" />
          </div>
        ) : (
          <table className="table align-middle table-hover text-nowrap">
            <thead className="bg-dark text-white sticky-top">
              <tr>
                <th>#</th>
                <th>Name</th>
                <th>Email</th>
                <th>Subject</th>
                <th>Date</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {contacts && contacts.length > 0 ? (
                contacts.map((c, index) => (
                  <tr key={c._id}>
                    <td>{index + 1}</td>
                    <td>{c.name}</td>
                    <td>{c.email}</td>
                    <td>{c.subject}</td>
                    <td>
                      {new Date(c.createdAt).toLocaleDateString("en-GB")}
                    </td>
                    <td className="d-flex gap-2">
                      <Button
                        style={{
                          backgroundColor: "rgb(21, 136, 109)",
                          border: "none",
                        }}
                        size="sm"
                        onClick={() => handleView(c._id)}
                      >
                        <FaEye className="mb-1" />
                      </Button>
                      <Button
                        variant="danger"
                        size="sm"
                        onClick={() => handleDeleteClick(c._id)}
                      >
                         <RiDeleteBin6Line className="mb-1" />
                      </Button>
                    </td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan="6" className="text-center text-muted py-3">
                    No contacts found
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        )}
      </div>

      {/* Contact Details Modal */}
      <Modal
        show={showModal}
        onHide={() => setShowModal(false)}
        size="md"
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Contact Details</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          {loading && !contact ? (
            <p>Loading...</p>
          ) : contact ? (
            <div>
              <p>
                <strong>Name:</strong> {contact.name}
              </p>
              <p>
                <strong>Email:</strong> {contact.email}
              </p>
              <p>
                <strong>Subject:</strong> {contact.subject}
              </p>
              <p>
                <strong>Message:</strong> {contact.message}
              </p>
              <p>
                <small className="text-muted">
                  Submitted on {new Date(contact.createdAt).toLocaleString()}
                </small>
              </p>
            </div>
          ) : (
            <p>No contact details found</p>
          )}
        </Modal.Body>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal
        show={showDeleteModal}
        onHide={() => setShowDeleteModal(false)}
        centered
      >
        <Modal.Header closeButton>
          <Modal.Title>Confirm Delete</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          Are you sure you want to delete this contact?
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowDeleteModal(false)}>
            Cancel
          </Button>
          <Button variant="danger" onClick={handleDeleteConfirm}>
            {loading ? <Spinner size="sm" animation="border" /> : "Delete"}
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
