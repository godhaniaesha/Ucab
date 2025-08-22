import React, { useEffect, useRef, useState } from 'react';
import '../style/x_app.css';
import { useDispatch, useSelector } from 'react-redux';
import { fetchUserProfile, updateUserProfile } from '../redux/slice/auth.slice';
import { FaEdit } from 'react-icons/fa';

export default function Pages() {
  const dispatch = useDispatch();
  const { profile, profileLoading, profileError } = useSelector((state) => state.auth);
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);
  console.log(profile,'profile');
  
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "********",
    phone: "",
    role: "",
    status: "",
    documentsVerified: false,
    profileImage: "",
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    },
    paymentMethods: []
  });
  
  console.log(profileData,'profileData');
  useEffect(() => {
    const token = localStorage.getItem('token');
    if (token) {
      dispatch(fetchUserProfile());
    }
  }, [dispatch]);

  useEffect(() => {
    if (profile) {
      setProfileData({
        name: profile.name || "",
        email: profile.email || "",
        phone: profile.phone || "",
        role: profile.role || "",
        status: profile.status || "",
        documentsVerified: profile.documentsVerified || false,
        profileImage: profile.profileImage || "",
        password: "********",
        bankDetails: profile.bankDetails || {
          accountHolderName: "",
          accountNumber: "",
          ifscCode: "",
          bankName: "",
          branchName: "",
        },
        paymentMethods: profile.paymentMethods || []
      });
    }
  }, [profile]);

  const handleChange = (e) => {
    const { name, value, dataset } = e.target;
    if (dataset.type === "bank") {
      setProfileData((prev) => ({
        ...prev,
        bankDetails: {
          ...prev.bankDetails,
          [name]: value
        }
      }));
    } else if (dataset.type === "payment") {
      const id = dataset.id;
      setProfileData((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map((pm) =>
          pm.paymentMethodId === id ? { ...pm, [name]: value } : pm
        )
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData(prev => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem('token');
    if (!token) return;
  
    const formData = new FormData();
  
    // Only append image if new file selected
    if (fileInputRef.current?.files[0]) {
      formData.append('profileImage', fileInputRef.current.files[0]);
    }
  
    // Basic fields
    formData.append('name', profileData.name || '');
    formData.append('email', profileData.email || '');
    formData.append('phone', profileData.phone || '');
    formData.append('role', profileData.role || '');
    formData.append('status', profileData.status || '');
    formData.append('documentsVerified', profileData.documentsVerified ? "true" : "false");
  
    // Objects as JSON strings
    if (profileData.bankDetails) {
      formData.append('bankDetails', JSON.stringify(profileData.bankDetails));
    }
    if (profileData.paymentMethods) {
      formData.append('paymentMethods', JSON.stringify(profileData.paymentMethods));
    }
  
    try {
      const result = await dispatch(updateUserProfile(formData));
      await dispatch(fetchUserProfile());
  
      if (!result.error) {
        setEditMode(false);
      }
    } catch (err) {
      console.error("Update failed", err);
    }
  };
  
  const handleDeletePaymentMethod = (id) => {
    setProfileData((prev) => ({
      ...prev,
      paymentMethods: prev.paymentMethods.filter((pm) => pm.paymentMethodId !== id)
    }));
  };

  return (
    <div className="x_profile_wrapper">
      {profileLoading && <div>Loading...</div>}
      {profileError && <div className="error">{profileError}</div>}


      <div className="x_profile_header">
        <div className="x_img_wrapper">
          <img
            src={`${profileData.profileImage}`}
            alt="profile"
            className="x_profile_img"
          />
          <div className="x_camera_icon" onClick={() => { setEditMode(true); fileInputRef.current.click(); }}>📷</div>
          <input type="file" accept="image/*" ref={fileInputRef} style={{ display: "none" }} onChange={handleImageChange} />
        </div>
      </div>

      <div className="x_card">
        <div className="x_profile_header_title mb-3">
  <h2 className="x_section_title mb-0">Contact Details</h2>
  <FaEdit 
    className="x_edit_icon" 
    onClick={() => setEditMode((prev) => !prev)} 
    style={{ cursor: "pointer", marginLeft: "10px" }} 
  />
</div>

        <div className="x_grid">
          <div className="x_form_group">
            <label>Full Name</label>
            <input type="text" name="name" value={profileData.name} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>Email</label>
            <input type="text" name="email" value={profileData.email} onChange={handleChange} disabled={!editMode} />
          </div>
        </div>

        <div className="x_grid">
          <div className="x_form_group">
            <label>Phone Number</label>
            <input type="text" name="phone" value={profileData.phone} onChange={handleChange} disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>Role</label>
            <input type="text" name="role" value={profileData.role} disabled={true} />
          </div>
        </div>

        <div className="x_grid">
          <div className="x_form_group">
            <label>Status</label>
            <input type="text" name="status" value={profileData.status} disabled={true} />
          </div>
          <div className="x_form_group">
            <label>Documents Verified</label>
            <input type="text" value={profileData.documentsVerified ? "Yes" : "No"} disabled={true} />
          </div>
        </div>

        <h3 className="x_section_title">Bank Details</h3>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Account Holder Name</label>
            <input type="text" name="accountHolderName" value={profileData.bankDetails.accountHolderName} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>Account Number</label>
            <input type="text" name="accountNumber" value={profileData.bankDetails.accountNumber} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
        </div>
        <div className="x_grid">
          <div className="x_form_group">
            <label>IFSC Code</label>
            <input type="text" name="ifscCode" value={profileData.bankDetails.ifscCode} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
          <div className="x_form_group">
            <label>Bank Name</label>
            <input type="text" name="bankName" value={profileData.bankDetails.bankName} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
        </div>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Branch Name</label>
            <input type="text" name="branchName" value={profileData.bankDetails.branchName} onChange={handleChange} data-type="bank" disabled={!editMode} />
          </div>
        </div>

        <h3 className="x_section_title mt-4">Payment Methods</h3>
<div className="x_grid">
  {profileData.paymentMethods.map((pm, index) => (
    <div key={pm.paymentMethodId || index} className="x_card x_payment_card">
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
        <label>Customer ID</label>
        <input
          type="text"
          name="customerId"
          value={pm.customerId}
          onChange={handleChange}
          data-type="payment"
          data-id={pm.paymentMethodId}
          disabled={!editMode}
        />
      </div>
      <div className="x_form_group">
        <label>Payment Method ID</label>
        <input
          type="text"
          name="paymentMethodId"
          value={pm.paymentMethodId}
          onChange={handleChange}
          data-type="payment"
          data-id={pm.paymentMethodId}
          disabled={!editMode}
        />
      </div>
      <div className="x_form_group">
        <label>Method Type</label>
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
        <button
          type="button"
          className="x_btn x_btn_danger"
          onClick={() => handleDeletePaymentMethod(pm.paymentMethodId)}
        >
          Delete
        </button>
      )}
    </div>
  ))}

  {/* Add new payment method */}
  {editMode && (
    <button
      type="button"
      className="x_btn mt-3"
      onClick={() =>
        setProfileData((prev) => ({
          ...prev,
          paymentMethods: [
            ...prev.paymentMethods,
            {
              provider: "",
              customerId: "",
              paymentMethodId: Date.now().toString(), // temporary unique ID
              methodType: "",
              last4: "",
            },
          ],
        }))
      }
    >
      ➕ Add Payment Method
    </button>
  )}
</div>

        {editMode && <button className="x_btn mt-3" onClick={handleSave}>Save Changes</button>}
      </div>
    </div>
  );
}
