import React, { useEffect, useRef, useState } from 'react';
import '../style/x_app.css';
import profileImage from "../image/user_g.png"

export default function Pages() {
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);

  const [profile, setProfile] = useState({
    fullName: "Olivia Smith",
    email: "olivia.smith@gmail.com",
    password: "********",
    phoneCode: "+61",
    phoneNumber: "123 4567 890",
    profileImage: profileImage,
    bankDetails: {
      accountNumber: "1234 5678 9876 5432", 
      bsbCode: "062-000",
      bankName: "Commonwealth Bank of Australia",
      branchName: "Sydney CBD Branch",
    },
    paymentMethods: [
      { provider: "stripe", methodType: "card", last4: "4242", paymentMethodId: "pm_123" },
      { provider: "razorpay", methodType: "card", last4: "1111", paymentMethodId: "pm_456" },
    ]
  });

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.type === "bank") {
      setProfile((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [name]: value
        }
      }));
    } else if (dataset.type === "payment") {
      const id = dataset.id;
      setProfile((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map((pm) =>
          pm.paymentMethodId === id ? { ...pm, [name]: value } : pm
        )
      }));
    } else {
      setProfile((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfile({ ...profile, profileImage: imageUrl });
    }
  };

  const handleSave = () => {
    console.log("Updated Profile:", profile);
    setEditMode(false);
    // Call API to save profile & payment methods
  };

  const handleDeletePaymentMethod = (id) => {
    setProfile((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((pm) => pm.paymentMethodId !== id)
    }));
    // Call API to delete payment method
  };

  return (
    <div className="x_profile_wrapper">
      {/* Profile Header */}
      <div className="x_profile_header">
        <div className="x_img_wrapper">
          <img src={profile.profileImage} alt="" className="x_profile_img" />
          <div className="x_camera_icon" onClick={() => { setEditMode(true); fileInputRef.current.click(); }}>📷</div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
        </div>
      </div>

      {/* Contact Details */}
      <div className="x_card">
        <h3 className="x_section_title">Contact Details</h3>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Full Name</label>
            <input type="text" name="fullName" value={profile.fullName} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>Email</label>
            <input type="text" name="email" value={profile.email} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>

        <div className="x_grid">
          <div className="x_form_group x_phone_group">
            <label>Phone Number</label>
            <div className="x_phone_wrapper">
              <select name="phoneCode" value={profile.phoneCode} onChange={handleChange} disabled={!editMode}>
                <option value="+880">AU +61</option>
                <option value="+1">🇺🇸 +1</option>
              </select>
              <input type="text" name="phoneNumber" value={profile.phoneNumber} onChange={handleChange} disabled={!editMode} />
            </div>
          </div>
          <div className="x_form_group">
            <label>Password</label>
            <input type="text" name="password" value={profile.password} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>

        {/* Bank Details */}
        <h3 className="x_section_title">Bank Details</h3>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Account Number</label>
            <input type="text" name="accountNumber" value={profile.bankDetails.accountNumber} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>BSB Code</label>
            <input type="text" name="bsbCode" value={profile.bankDetails.bsbCode} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
        </div>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Bank Name</label>
            <input type="text" name="bankName" value={profile.bankDetails.bankName} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>Branch Name</label>
            <input type="text" name="branchName" value={profile.bankDetails.branchName} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
        </div>

        {/* Payment Methods */}
        <h3 className="x_section_title mt-4">Payment Methods</h3>
        <div className="x_grid">
          {profile.paymentMethods.map((pm) => (
            <div key={pm.paymentMethodId} className="x_card x_payment_card">
              <div className="x_form_group">
                <label>Provider</label>
                <input
                  type="text"
                  name="provider"
                  value={pm.provider}
                  onChange={handleChange}
                  data-type="payment"
                  data-id={pm.paymentMethodId}
                  disabled={!editMode}
                />
              </div>
              <div className="x_form_group">
                <label>Type</label>
                <input
                  type="text"
                  name="methodType"
                  value={pm.methodType}
                  onChange={handleChange}
                  data-type="payment"
                  data-id={pm.paymentMethodId}
                  disabled={!editMode}
                />
              </div>
              <div className="x_form_group">
                <label>Last 4 Digits</label>
                <input
                  type="text"
                  name="last4"
                  value={pm.last4}
                  onChange={handleChange}
                  data-type="payment"
                  data-id={pm.paymentMethodId}
                  disabled={!editMode}
                />
              </div>
              {editMode && (
                <button className="x_btn x_btn_danger" onClick={() => handleDeletePaymentMethod(pm.paymentMethodId)}>Delete</button>
              )}
            </div>
          ))}
        </div>

        {editMode && <button className="x_btn mt-3" onClick={handleSave}>Save Changes</button>}
      </div>
    </div>
  );
}
