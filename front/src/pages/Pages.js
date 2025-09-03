import React, { useEffect, useRef, useState } from "react";
import "../style/x_app.css";
import { useDispatch, useSelector } from "react-redux";
import { fetchUserProfile, updateUserProfile } from "../redux/slice/auth.slice";
import { FaEdit } from "react-icons/fa";
import user from "../image/user.jpg";
export default function Pages() {
  const dispatch = useDispatch();
  const { profile, profileLoading, profileError } = useSelector(
    (state) => state.auth
  );
  const [editMode, setEditMode] = useState(false);
  const fileInputRef = useRef(null);
  const [formErrors, setFormErrors] = useState({});
  console.log(profile, "profile");
  const [profileData, setProfileData] = useState({
    name: "",
    email: "",
    password: "********",
    phone: "",
    role: "",
    documentsVerified: false,
    profileImage: "",
    bankDetails: {
      accountHolderName: "",
      accountNumber: "",
      ifscCode: "",
      bankName: "",
      branchName: "",
    },
    paymentMethods: [],
  });
  console.log(profileData, "profileData");
  useEffect(() => {
    const token = localStorage.getItem("token");
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
        paymentMethods: profile.paymentMethods || [],
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
          [name]: value,
        },
      }));
    } else if (dataset.type === "payment") {
      const id = dataset.id;
      setProfileData((prev) => ({
        ...prev,
        paymentMethods: prev.paymentMethods.map((pm) =>
          pm.paymentMethodId === id ? { ...pm, [name]: value } : pm
        ),
      }));
    } else {
      setProfileData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    if (file) {
      const imageUrl = URL.createObjectURL(file);
      setProfileData((prev) => ({ ...prev, profileImage: imageUrl }));
    }
  };

  const handleSave = async () => {
    // Validation
    const errors = {};
    // Name: required, letters/spaces, 2-50 chars
    if (!profileData.name) errors.name = "Name is required.";
    else if (!/^[A-Za-z\s]{2,50}$/.test(profileData.name))
      errors.name = "Name must be 2-50 letters only.";
    // Email: required, regex
    if (!profileData.email) errors.email = "Email is required.";
    else if (
      !/^([a-zA-Z0-9_\-.]+)@([a-zA-Z0-9_\-.]+)\.([a-zA-Z]{2,5})$/.test(
        profileData.email
      )
    )
      errors.email = "Invalid email format.";
    // Phone: required, Indian format with +91 or 10 digits
    if (!profileData.phone) errors.phone = "Phone is required.";
    else if (!/^(\+91[6-9]\d{9}|[6-9]\d{9})$/.test(profileData.phone))
      errors.phone = "Phone must be a valid Indian number (+91XXXXXXXXXX or XXXXXXXXXX).";
    // Bank Details
    if (!profileData.bankDetails.accountHolderName)
      errors.accountHolderName = "Account holder name required.";
    else if (
      !/^[A-Za-z\s]{2,50}$/.test(profileData.bankDetails.accountHolderName)
    )
      errors.accountHolderName = "Name must be 2-50 letters only.";
    if (!profileData.bankDetails.accountNumber)
      errors.accountNumber = "Account number required.";
    else if (!/^\d{9,18}$/.test(profileData.bankDetails.accountNumber))
      errors.accountNumber = "Account number must be 9-18 digits.";
    if (!profileData.bankDetails.ifscCode)
      errors.ifscCode = "IFSC code required.";
    else if (!/^[A-Z]{4}0[A-Z0-9]{6}$/.test(profileData.bankDetails.ifscCode))
      errors.ifscCode = "Invalid IFSC code.";
    if (!profileData.bankDetails.bankName)
      errors.bankName = "Bank name required.";
    else if (!/^[A-Za-z\s]{2,50}$/.test(profileData.bankDetails.bankName))
      errors.bankName = "Bank name must be 2-50 letters only.";
    if (!profileData.bankDetails.branchName)
      errors.branchName = "Branch name required.";
    else if (!/^[A-Za-z\s]{2,50}$/.test(profileData.bankDetails.branchName))
      errors.branchName = "Branch name must be 2-50 letters only.";
    // Payment Methods
    profileData.paymentMethods.forEach((pm, idx) => {
      if (!pm.provider) errors[`pm_provider_${idx}`] = "Provider required.";
      else if (!/^[A-Za-z\s]{2,50}$/.test(pm.provider))
        errors[`pm_provider_${idx}`] = "Provider must be 2-50 letters.";
      if (!pm.customerId)
        errors[`pm_customerId_${idx}`] = "Customer ID required.";
      else if (!/^[A-Za-z0-9\-_]{4,30}$/.test(pm.customerId))
        errors[`pm_customerId_${idx}`] = "Customer ID must be 4-30 alphanumeric characters, hyphens, or underscores.";
      if (!pm.paymentMethodId)
        errors[`pm_paymentMethodId_${idx}`] = "Payment Method ID required.";
      if (!pm.methodType)
        errors[`pm_methodType_${idx}`] = "Method type required.";
      if (!pm.last4) errors[`pm_last4_${idx}`] = "Last 4 digits required.";
      else if (!/^\d{4}$/.test(pm.last4))
        errors[`pm_last4_${idx}`] = "Last 4 digits must be 4 numbers.";
    });
    setFormErrors(errors);
    if (Object.keys(errors).length > 0) return;

    const token = localStorage.getItem("token");
    if (!token) return;
    const formData = new FormData();
    // Only append image if new file selected
    if (fileInputRef.current?.files[0]) {
      formData.append("profileImage", fileInputRef.current.files[0]);
    }
    // Basic fields
    formData.append("name", profileData.name || "");
    formData.append("email", profileData.email || "");
    formData.append("phone", profileData.phone || "");
    formData.append("role", profileData.role || "");
    formData.append(
      "documentsVerified",
      profileData.documentsVerified ? "true" : "false"
    );
    // Objects as JSON strings
    if (profileData.bankDetails) {
      formData.append("bankDetails", JSON.stringify(profileData.bankDetails));
    }
    if (profileData.paymentMethods) {
      formData.append(
        "paymentMethods",
        JSON.stringify(profileData.paymentMethods)
      );
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
      paymentMethods: prev.paymentMethods.filter(
        (pm) => pm.paymentMethodId !== id
      ),
    }));
  };

  return (
    <div className="x_profile_wrapper">
      {profileLoading && <div>Loading...</div>}
      {profileError && <div className="error">{profileError}</div>}

      <div className="x_profile_header">
        <div className="x_img_wrapper">
          <img
            src={profileData.profileImage ? profileData.profileImage : user}
            alt="profile"
            className="x_profile_img"
            onError={(e) => {
              e.target.src = user;
            }}
          />
          <div
            className="x_camera_icon"
            onClick={() => {
              setEditMode(true);
              fileInputRef.current.click();
            }}
          >
            📷
          </div>
          <input
            type="file"
            accept="image/*"
            ref={fileInputRef}
            style={{ display: "none" }}
            onChange={handleImageChange}
          />
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
            <input
              type="text"
              name="name"
              value={profileData.name}
              onChange={handleChange}
              disabled={!editMode}
            />
            {formErrors.name && (
              <p style={{ color: "red", margin: 0 }}>{formErrors.name}</p>
            )}
          </div>
          <div className="x_form_group">
            <label>Email</label>
            <input
              type="text"
              name="email"
              value={profileData.email}
              onChange={handleChange}
              disabled={!editMode}
            />
            {formErrors.email && (
              <p style={{ color: "red", margin: 0 }}>{formErrors.email}</p>
            )}
          </div>
        </div>

        <div className="x_grid">
          <div className="x_form_group">
            <label>Phone Number</label>
            <input
              type="text"
              name="phone"
              value={profileData.phone}
              onChange={handleChange}
              disabled={!editMode}
            />
            {formErrors.phone && (
              <p style={{ color: "red", margin: 0 }}>{formErrors.phone}</p>
            )}
          </div>
          <div className="x_form_group">
            <label>Role</label>
            <input
              type="text"
              name="role"
              value={profileData.role}
              disabled={true}
            />
          </div>
        </div>

        <div className="x_grid">
          <div className="x_form_group">
            <label>Documents Verified</label>
            <input
              type="text"
              value={profileData.documentsVerified ? "Yes" : "No"}
              disabled={true}
            />
          </div>
        </div>

        <h3 className="x_section_title">Bank Details</h3>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Account Holder Name</label>
            <input
              type="text"
              name="accountHolderName"
              value={profileData.bankDetails.accountHolderName}
              onChange={handleChange}
              data-type="bank"
              disabled={!editMode}
            />
            {formErrors.accountHolderName && (
              <p style={{ color: "red", margin: 0 }}>
                {formErrors.accountHolderName}
              </p>
            )}
          </div>
          <div className="x_form_group">
            <label>Account Number</label>
            <input
              type="text"
              name="accountNumber"
              value={profileData.bankDetails.accountNumber}
              onChange={handleChange}
              data-type="bank"
              disabled={!editMode}
            />
            {formErrors.accountNumber && (
              <p style={{ color: "red", margin: 0 }}>
                {formErrors.accountNumber}
              </p>
            )}
          </div>
        </div>
        <div className="x_grid">
          <div className="x_form_group">
            <label>IFSC Code</label>
            <input
              type="text"
              name="ifscCode"
              value={profileData.bankDetails.ifscCode}
              onChange={handleChange}
              data-type="bank"
              disabled={!editMode}
            />
            {formErrors.ifscCode && (
              <p style={{ color: "red", margin: 0 }}>{formErrors.ifscCode}</p>
            )}
          </div>
          <div className="x_form_group">
            <label>Bank Name</label>
            <input
              type="text"
              name="bankName"
              value={profileData.bankDetails.bankName}
              onChange={handleChange}
              data-type="bank"
              disabled={!editMode}
            />
            {formErrors.bankName && (
              <p style={{ color: "red", margin: 0 }}>{formErrors.bankName}</p>
            )}
          </div>
        </div>
        <div className="x_grid">
          <div className="x_form_group">
            <label>Branch Name</label>
            <input
              type="text"
              name="branchName"
              value={profileData.bankDetails.branchName}
              onChange={handleChange}
              data-type="bank"
              disabled={!editMode}
            />
            {formErrors.branchName && (
              <p style={{ color: "red", margin: 0 }}>{formErrors.branchName}</p>
            )}
          </div>
        </div>

        <h3 className="x_section_title mt-4">Payment Methods</h3>
        <div className="x_grid">
          {profileData.paymentMethods.map((pm, index) => (
            <div
              key={pm.paymentMethodId || index}
              className="x_card x_payment_card"
            >
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
                {formErrors[`pm_provider_${index}`] && (
                  <p style={{ color: "red", margin: 0 }}>
                    {formErrors[`pm_provider_${index}`]}
                  </p>
                )}
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
                {formErrors[`pm_customerId_${index}`] && (
                  <p style={{ color: "red", margin: 0 }}>
                    {formErrors[`pm_customerId_${index}`]}
                  </p>
                )}
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
                {formErrors[`pm_paymentMethodId_${index}`] && (
                  <p style={{ color: "red", margin: 0 }}>
                    {formErrors[`pm_paymentMethodId_${index}`]}
                  </p>
                )}
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
                {formErrors[`pm_methodType_${index}`] && (
                  <p style={{ color: "red", margin: 0 }}>
                    {formErrors[`pm_methodType_${index}`]}
                  </p>
                )}
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
                {formErrors[`pm_last4_${index}`] && (
                  <p style={{ color: "red", margin: 0 }}>
                    {formErrors[`pm_last4_${index}`]}
                  </p>
                )}
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
                      paymentMethodId: Date.now().toString(),
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

        {editMode && (
          <button className="x_btn mt-3" onClick={handleSave}>
            Save Changes
          </button>
        )}
      </div>
    </div>
  );
}
