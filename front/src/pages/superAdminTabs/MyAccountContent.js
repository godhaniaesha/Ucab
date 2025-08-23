import React, { useState, useEffect } from "react";
import Pages from "../Pages";

const SA_MyAccountContent = ({ userData, onSave }) => {
  // ...existing code...
  const [editMode, setEditMode] = useState(false);
  const [editedUserData, setEditedUserData] = useState(userData);

  useEffect(() => {
    setEditedUserData(userData);
  }, [userData]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    if (name.startsWith("bankDetails.")) {
      const field = name.split(".")[1];
      setEditedUserData((prevData) => ({
        ...prevData,
        bankDetails: {
          ...prevData.bankDetails,
          [field]: value,
        },
      }));
    } else {
      setEditedUserData((prevData) => ({
        ...prevData,
        [name]: value,
      }));
    }
  };

  const handleSave = () => {
    onSave(editedUserData);
    setEditMode(false);
  };

  const handleCancel = () => {
    setEditedUserData(userData);
    setEditMode(false);
  };

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1"> My Account</h2>
      <Pages></Pages>
    </div>
  );
};

export default SA_MyAccountContent;
