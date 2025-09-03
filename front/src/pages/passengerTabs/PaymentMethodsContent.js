import React, { useState, useEffect } from "react";
import { Card, Button, Modal, Form, Row, Col, Badge } from "react-bootstrap";

// Dummy user data (replace with API fetch)
const dummyUser = {
  paymentMethods: [
    { provider: "stripe", methodType: "card", last4: "4242", paymentMethodId: "pm_123" },
    { provider: "razorpay", methodType: "card", last4: "1111", paymentMethodId: "pm_456" },
  ],
  bankDetails: {
    accountHolderName: "John Doe", 
    accountNumber: "1234567890",
    ifscCode: "HDFC0001234",
    bankName: "HDFC Bank",
    branchName: "MG Road",
  },
};

// Razorpay script loader
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

export default function P_PaymentMethodsContent() {
  const [paymentMethods, setPaymentMethods] = useState([]);
  const [bankDetails, setBankDetails] = useState({});
  const [showBankModal, setShowBankModal] = useState(false);
  const [showPaymentModal, setShowPaymentModal] = useState(false);
  const [bankForm, setBankForm] = useState({});
  const [paymentForm, setPaymentForm] = useState({});
  const [selectedPaymentMethod, setSelectedPaymentMethod] = useState(null);
  const [paymentErrors, setPaymentErrors] = useState({});

  useEffect(() => {
    // Replace with API call
    setPaymentMethods(dummyUser.paymentMethods);
    setBankDetails(dummyUser.bankDetails);
    setBankForm(dummyUser.bankDetails);
  }, []);

  const handleBankChange = (e) => {
    const { name, value } = e.target;
    setBankForm((prev) => ({ ...prev, [name]: value }));
  };

  const handlePaymentChange = (e) => {
    const { name, value } = e.target;
    setPaymentForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleBankSave = () => {
    setBankDetails(bankForm);
    setShowBankModal(false);
    // Call API to save bank details
  };

  const validatePaymentForm = () => {
    const errors = {};
    if (!paymentForm.provider?.trim()) errors.provider = "Provider is required";
    if (!paymentForm.methodType?.trim()) errors.methodType = "Method type is required";
    if (!paymentForm.last4?.trim()) errors.last4 = "Last 4 digits are required";
    else if (!/^\d{4}$/.test(paymentForm.last4)) errors.last4 = "Enter exactly 4 digits";
    setPaymentErrors(errors);
    return Object.keys(errors).length === 0;
  };

  const handlePaymentSave = () => {
    if (!validatePaymentForm()) return;
    if (selectedPaymentMethod) {
      setPaymentMethods(prev => 
        prev.map(pm => pm.paymentMethodId === selectedPaymentMethod.paymentMethodId ? 
          {...pm, ...paymentForm} : pm
        )
      );
    } else {
      setPaymentMethods(prev => [...prev, {...paymentForm, paymentMethodId: `pm_${Date.now()}`}]);
    }
    setShowPaymentModal(false);
    setSelectedPaymentMethod(null);
    setPaymentForm({});
    setPaymentErrors({});
  };

  const handleEditPaymentMethod = (pm) => {
    setSelectedPaymentMethod(pm);
    setPaymentForm(pm);
    setShowPaymentModal(true);
  };

  const handleDeletePaymentMethod = (id) => {
    setPaymentMethods((prev) => prev.filter((pm) => pm.paymentMethodId !== id));
    // Call API to delete payment method
  };

  // Dummy order creation (replace with backend API)
  const createOrder = async (amount = 100) => {
    alert("Razorpay Payment Gateway is currently in test mode. Use test card 4111 1111 1111 1111 with any future expiry and CVC 12345678.");
    // In production, call your backend to create order and get order_id
    return {
      id: "order_" + Date.now(),
      amount: amount * 100, // Razorpay expects amount in paise
      currency: "INR"
    };
  };

  // Razorpay payment handler
  const handleRazorpayPay = async () => {
  alert("Razorpay Payment Gateway is currently in test mode. Use test card 4111 1111 1111 1111 with any future expiry and CVC.");
    const res = await loadRazorpayScript();
    if (!res) {
      alert("Razorpay SDK failed to load. Are you online?");
      return;
    }
    const order = await createOrder(100); // Amount can be dynamic
    const options = {
      key: "rzp_test_hN631gyZ1XbXvp", // Replace with your Razorpay Key ID
      amount: order.amount,
      currency: order.currency,
      name: "UCAB Taxi",
      description: "Cab Booking Payment",
      order_id: order.id,
      handler: function (response) {
        alert("Payment Successful! Payment ID: " + response.razorpay_payment_id);
        // You can save payment details to backend here
      },
      prefill: {
        name: "Passenger",
        email: "passenger@email.com",
        contact: "9123456789"
      },
      theme: {
        color: "#0f6e55"
      }
    };
    const rzp = new window.Razorpay(options);
    rzp.open();
  };

  return (
    <div className="p-3">
      <h2 className="mb-3">Payment Methods</h2>
      <p className="text-secondary mb-4">Manage your saved cards and bank accounts here.</p>

      <Row xs={1} md={2} lg={3} className="g-3">
        {/* Card Payment Methods */}
        {paymentMethods.map((pm) => (
          <Col key={pm.paymentMethodId}>
            <Card className="h-100 shadow-sm">
              <Card.Body>
                <Card.Title>
                  {pm.provider.toUpperCase()} <Badge bg="info">{pm.methodType}</Badge>
                </Card.Title>
                <Card.Text>•••• {pm.last4}</Card.Text>
                <div className="d-flex gap-2">
                  <Button variant="outline-primary" size="sm" onClick={() => handleEditPaymentMethod(pm)}>
                    Edit
                  </Button>
                  <Button variant="outline-danger" size="sm" onClick={() => handleDeletePaymentMethod(pm.paymentMethodId)}>
                    Delete
                  </Button>
                </div>
              </Card.Body>
            </Card>
          </Col>
        ))}

        {/* Add New Payment Method */}
        <Col>
          <Card className="h-100 shadow-sm border-success d-flex align-items-center justify-content-center">
            <Card.Body className="text-center">
              <Button variant="success" onClick={() => setShowPaymentModal(true)}>
                + Add Payment Method
              </Button>
            </Card.Body>
          </Card>
        </Col>

        {/* Bank Details */}
        <Col>
          <Card className="h-100 shadow-sm border-primary">
            <Card.Body>
              <Card.Title>Bank Details</Card.Title>
              {bankDetails.accountNumber ? (
                <>
                  <Card.Text>
                    <strong>Account Holder:</strong> {bankDetails.accountHolderName} <br />
                    <strong>Account No:</strong> ****{bankDetails.accountNumber.slice(-4)} <br />
                    <strong>Bank:</strong> {bankDetails.bankName} <br />
                    <strong>Branch:</strong> {bankDetails.branchName} <br />
                    <strong>IFSC:</strong> {bankDetails.ifscCode}
                  </Card.Text>
                  <Button variant="primary" size="sm" onClick={() => setShowBankModal(true)}>
                    Edit
                  </Button>
                </>
              ) : (
                <Button variant="success" size="sm" onClick={() => setShowBankModal(true)}>
                  Add Bank
                </Button>
              )}
            </Card.Body>
          </Card>
        </Col>

        {/* Razorpay Payment Option */}
        <Col>
          <Card className="h-100 shadow-sm border-warning d-flex align-items-center justify-content-center">
            <Card.Body className="text-center">
              <Button variant="warning" onClick={handleRazorpayPay}>
                Pay with Razorpay
              </Button>
            </Card.Body>
          </Card>
        </Col>
      </Row>

      {/* Bank Edit Modal */}
      <Modal show={showBankModal} onHide={() => setShowBankModal(false)}>
        <Modal.Header closeButton>
          <Modal.Title>{bankDetails.accountNumber ? "Edit Bank Details" : "Add Bank Details"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Account Holder Name</Form.Label>
              <Form.Control
                type="text"
                name="accountHolderName"
                value={bankForm.accountHolderName || ""}
                onChange={handleBankChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Account Number</Form.Label>
              <Form.Control
                type="text"
                name="accountNumber"
                value={bankForm.accountNumber || ""}
                onChange={handleBankChange}
              />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>IFSC Code</Form.Label>
              <Form.Control type="text" name="ifscCode" value={bankForm.ifscCode || ""} onChange={handleBankChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Bank Name</Form.Label>
              <Form.Control type="text" name="bankName" value={bankForm.bankName || ""} onChange={handleBankChange} />
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Branch Name</Form.Label>
              <Form.Control type="text" name="branchName" value={bankForm.branchName || ""} onChange={handleBankChange} />
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => setShowBankModal(false)}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handleBankSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>

      {/* Payment Method Modal */}
      <Modal show={showPaymentModal} onHide={() => {
        setShowPaymentModal(false);
        setSelectedPaymentMethod(null);
        setPaymentForm({});
        setPaymentErrors({});
      }}>
        <Modal.Header closeButton>
          <Modal.Title>{selectedPaymentMethod ? "Edit Payment Method" : "Add Payment Method"}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
          <Form>
            <Form.Group className="mb-2">
              <Form.Label>Provider</Form.Label>
              <Form.Control
                type="text"
                name="provider"
                value={paymentForm.provider || ""}
                onChange={handlePaymentChange}
                isInvalid={!!paymentErrors.provider}
              />
              {paymentErrors.provider && (
                <div className="text-danger" style={{ marginTop: "-8px", fontSize: "14px" }}>
                  {paymentErrors.provider}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Method Type</Form.Label>
              <Form.Control
                type="text"
                name="methodType"
                value={paymentForm.methodType || ""}
                onChange={handlePaymentChange}
                isInvalid={!!paymentErrors.methodType}
              />
              {paymentErrors.methodType && (
                <div className="text-danger" style={{ marginTop: "-8px", fontSize: "14px" }}>
                  {paymentErrors.methodType}
                </div>
              )}
            </Form.Group>
            <Form.Group className="mb-2">
              <Form.Label>Last 4 Digits</Form.Label>
              <Form.Control
                type="text"
                name="last4"
                value={paymentForm.last4 || ""}
                onChange={handlePaymentChange}
                maxLength={4}
                isInvalid={!!paymentErrors.last4}
              />
              {paymentErrors.last4 && (
                <div className="text-danger" style={{ marginTop: "-8px", fontSize: "14px" }}>
                  {paymentErrors.last4}
                </div>
              )}
            </Form.Group>
          </Form>
        </Modal.Body>
        <Modal.Footer>
          <Button variant="secondary" onClick={() => {
            setShowPaymentModal(false);
            setSelectedPaymentMethod(null);
            setPaymentForm({});
            setPaymentErrors({});
          }}>
            Cancel
          </Button>
          <Button variant="primary" onClick={handlePaymentSave}>
            Save
          </Button>
        </Modal.Footer>
      </Modal>
    </div>
  );
}
