import React, { useEffect, useState } from "react";
import { useDispatch, useSelector } from "react-redux";
import {
  getVehicles,
  createVehicle,
  deleteVehicle,
  updateVehicle,
} from "../../redux/slice/vehicles.slice";

const D_MyVehiclesContent = () => {
  const dispatch = useDispatch();
  const { vehicles, loading, error, success } = useSelector(
    (state) => state.vehicle
  );

  // Driver ID from token
  const [driverId, setDriverId] = useState(null);
  useEffect(() => {
    const token = localStorage.getItem("token");
    if (token) {
      try {
        const payload = JSON.parse(atob(token.split(".")[1]));
        console.log(payload, "payload");

        setDriverId(payload.id || payload._id || payload.userId);
      } catch {
        setDriverId(null);
      }
    }
  }, []);

  (console.log(driverId, "driverId"));
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    make: "",
    model: "",
    year: "",
    plate: "",
    type: "standard",
    taxiDoors: "",
    passengers: "",
    luggageCarry: "",
    airCondition: "Yes",
    gpsNavigation: "Yes",
    perKmRate: "",
    extraKmRate: "",
    description: "",
    images: [],
  });

  // Fetch vehicles
  useEffect(() => {
    dispatch(getVehicles());
  }, [dispatch, success]);

  // Handle inputs
  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const allowedTypes = ["image/jpeg", "image/jpg", "image/png"];

    const validFiles = files.filter((f) => allowedTypes.includes(f.type));
    if (validFiles.length !== files.length) {
      e.target.setCustomValidity("Only JPEG, JPG, PNG images are allowed.");
      e.target.reportValidity();
      return;
    } else {
      e.target.setCustomValidity("");
    }

    setFormData((prev) => {
      // ✅ Keep old images (URLs) + add new images (Files)
      const existingImages = Array.isArray(prev.images) ? prev.images : [];
      const mergedImages = [...existingImages, ...validFiles];

      // ✅ Limit max 5
      if (mergedImages.length > 5) {
        e.target.setCustomValidity("Maximum 5 images allowed.");
        e.target.reportValidity();
        return prev;
      }

      return {
        ...prev,
        images: mergedImages, // 🟢 old + new together
      };
    });

    // reset file input (so same file can be re-selected if needed)
    e.target.value = "";
  };





  const handleRemoveImage = (index) => {
    setFormData((prev) => ({
      ...prev,
      images: prev.images.filter((_, i) => i !== index),
    }));
  };

  // Save vehicle
  const handleSave = (e) => {
    e.preventDefault();
  
    const form = e.target;
    let valid = true;
  
    const setError = (name, message) => {
      const input = form.querySelector(`[name="${name}"]`);
      if (input) {
        input.setCustomValidity(message);
        input.reportValidity();
        valid = false;
      }
    };
  
    Array.from(form.elements).forEach((el) => {
      if (el.setCustomValidity) el.setCustomValidity("");
    });
  
    // === Validations ===
    if (!formData.make.trim()) setError("make", "Please enter vehicle make.");
    if (!formData.model.trim()) setError("model", "Please enter vehicle model.");
    if (
      !formData.year ||
      isNaN(formData.year) ||
      formData.year < 1900 ||
      formData.year > new Date().getFullYear() + 1
    )
      setError("year", "Please enter a valid year.");
    if (!formData.plate.trim()) setError("plate", "Please enter license plate.");
    if (!formData.type) setError("type", "Please select vehicle type.");
    if (
      !formData.taxiDoors ||
      isNaN(formData.taxiDoors) ||
      formData.taxiDoors < 2 ||
      formData.taxiDoors > 6
    )
      setError("taxiDoors", "Please enter doors (2–6).");
    if (
      !formData.passengers ||
      isNaN(formData.passengers) ||
      formData.passengers < 1 ||
      formData.passengers > 8
    )
      setError("passengers", "Please enter passengers (1–8).");
    if (
      formData.luggageCarry === "" ||
      isNaN(formData.luggageCarry) ||
      formData.luggageCarry < 0 ||
      formData.luggageCarry > 10
    )
      setError("luggageCarry", "Please enter luggage capacity (0–10).");
    if (
      !formData.perKmRate ||
      isNaN(formData.perKmRate) ||
      Number(formData.perKmRate) < 1 ||
      Number(formData.perKmRate) > 9999
    )
      setError("perKmRate", "Please enter valid Per Km Rate.");
    if (
      formData.extraKmRate === "" ||
      isNaN(formData.extraKmRate) ||
      Number(formData.extraKmRate) < 0 ||
      Number(formData.extraKmRate) > 9999
    )
      setError("extraKmRate", "Please enter valid Extra Km Rate.");
    if (!formData.description.trim())
      setError("description", "Please enter vehicle description.");
  
    // Images validation
    if (formData.images.length === 0) {
      const imgInput = form.querySelector("#imageUploadInput");
      if (imgInput) {
        imgInput.setCustomValidity("Please upload at least one image.");
        imgInput.reportValidity();
      }
      valid = false;
    }
    if (formData.images.length > 5) {
      const imgInput = form.querySelector("#imageUploadInput");
      if (imgInput) {
        imgInput.setCustomValidity("Maximum 5 images allowed.");
        imgInput.reportValidity();
      }
      valid = false;
    }
  
    if (!valid || !form.checkValidity()) return;
  
    // === Build FormData ===
    const data = new FormData();
    data.append("make", formData.make);
    data.append("model", formData.model);
    data.append("year", formData.year);
    data.append("plate", formData.plate);
    data.append("type", formData.type);
    data.append("taxiDoors", formData.taxiDoors);
    data.append("passengers", formData.passengers);
    data.append("luggageCarry", formData.luggageCarry);
    data.append("airCondition", formData.airCondition === "Yes");
    data.append("gpsNavigation", formData.gpsNavigation === "Yes");
    data.append("perKmRate", formData.perKmRate);
    data.append("extraKmRate", formData.extraKmRate);
    data.append("description", formData.description);
  
    // ✅ Combine old + new images (everything visible in preview)
    const allImages = formData.images.map((img) => {
      if (img instanceof File) return img; // new image file
      return img; // existing image path (string)
    });
  
    allImages.forEach((img) => {
      // append both new files and string URLs
      data.append("images", img);
    });
  
    if (editingVehicleId) {
      dispatch(updateVehicle({ id: editingVehicleId, formData: data }));
    } else {
      dispatch(createVehicle(data));
    }
  
    resetForm();
  };
  
  

  const resetForm = () => {
    setEditingVehicleId(null);
    setIsAdding(false);
    setFormData({
      make: "",
      model: "",
      year: "",
      plate: "",
      type: "standard",
      taxiDoors: "",
      passengers: "",
      luggageCarry: "",
      airCondition: "Yes",
      gpsNavigation: "Yes",
      perKmRate: "",
      extraKmRate: "",
      description: "",
      images: [],
    });
  };

  const handleEditClick = (vehicle) => {
    setEditingVehicleId(vehicle._id);
    setIsAdding(false);
    setFormData({
      ...vehicle,
      airCondition: vehicle.airCondition ? "Yes" : "No",
      gpsNavigation: vehicle.gpsNavigation ? "Yes" : "No",
      images: vehicle.images || [], // ✅ Keep old images
    });
  };


  const handleDelete = (id) => {
    dispatch(deleteVehicle(id));
  };

  const handleAddClick = () => {
    console.log(isAdding, 'isAdding');

    setIsAdding(true);
    console.log(isAdding, 'isAdding');

    setEditingVehicleId(null);

  };

  const handleCancel = () => {
    resetForm();
  };

  // Vehicle card
  const renderVehicleCard = (vehicle) =>

    driverId && vehicle.provider && vehicle.provider._id === driverId
      ? (
        // console.log(vehicle),
        <div key={vehicle._id} className="p-3 rounded-3 border bg-light">
          <div className="d-flex flex-column flex-md-row gap-3">
            <div className="flex-grow-1">
              <h6 className="fw-bold text-dark mb-2">
                {vehicle.make} {vehicle.model}
              </h6>
              <div className="row g-1 small text-secondary">
                <div className="col-6">
                  <div>
                    <strong>Year:</strong> {vehicle.year}
                  </div>
                  <div>
                    <strong>Doors:</strong> {vehicle.taxiDoors}
                  </div>
                  <div>
                    <strong>Passengers:</strong> {vehicle.passengers}
                  </div>
                  <div>
                    <strong>Luggage:</strong> {vehicle.luggageCarry}
                  </div>
                </div>
                <div className="col-6">
                  <div>
                    <strong>Plate:</strong> {vehicle.plate}
                  </div>
                  <div>
                    <strong>Type:</strong> {vehicle.type}
                  </div>
                  <div>
                    <strong>AC:</strong> {vehicle.airCondition ? "Yes" : "No"}
                  </div>
                  <div>
                    <strong>GPS:</strong> {vehicle.gpsNavigation ? "Yes" : "No"}
                  </div>
                </div>
              </div>
              <div className="mt-2 small text-secondary">
                <strong>Per Km:</strong> {vehicle.perKmRate} |{" "}
                <strong>Extra Km:</strong> {vehicle.extraKmRate}
              </div>
              {vehicle.description && (
                <div className="mt-1 small text-muted">{vehicle.description}</div>
              )}
            </div>
            <div className="d-flex flex-wrap gap-2">
              {vehicle.images &&
                vehicle.images.map((src, i) => (
                  <img
                    key={i}
                    src={`http://localhost:5000${src}`
                    }
                    alt={`Vehicle ${i + 1}`}
                    className="rounded-2 border"
                    style={{ width: "120px", height: "80px", objectFit: "cover" }}
                  />
                ))}
            </div>
          </div>
          <div className="d-flex justify-content-end mt-3">
            <button
              className="btn btn-sm btn-outline-danger me-2 px-3"
              onClick={() => handleDelete(vehicle._id)}
            >
              Delete
            </button>
            <button
              className="btn btn-sm btn-warning px-3"
              onClick={() => handleEditClick(vehicle)}
            >
              Edit
            </button>
          </div>
        </div>
      ) : null;

  // Form
  const renderVehicleForm = () => (
    <div className="p-lg-4 p-2 rounded-3 border bg-light mt-2">
      <h5 className="fw-bold text-dark mb-lg-3 mb-1">
        {isAdding ? "Add New Vehicle" : "Edit Vehicle"}
      </h5>
      <form onSubmit={handleSave}>
        <div className="row g-3">
          <div className="col-md-6">
            <label className="form-label">Make</label>
            <input
              type="text"
              name="make"
              className="form-control"
              value={formData.make}
              onChange={handleFormChange}
              required
            />

            <label className="form-label mt-2">Model</label>
            <input
              type="text"
              name="model"
              className="form-control"
              value={formData.model}
              onChange={handleFormChange}
              required
            />

            <label className="form-label mt-2">Year</label>
            <input
              type="number"
              min={0}
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleFormChange}
              required
            />

            <label className="form-label mt-2">License Plate</label>
            <input
              type="text"
              name="plate"
              className="form-control"
              value={formData.plate}
              onChange={handleFormChange}
              required
            />


            <label className="form-label mt-2">Vehicle Type</label>
            <select
              name="type"
              className="form-select"
              value={formData.type}
              onChange={handleFormChange}
            >
              <option value="standard">Standard</option>
              <option value="premium">Premium</option>
              <option value="luxury">Luxury</option>
            </select>
          </div>

          <div className="col-md-6">
            <label className="form-label">Doors</label>
            <input
              type="number"
              min={0}
              name="taxiDoors"
              className="form-control"
              value={formData.taxiDoors}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Passengers</label>
            <input
              type="number"
              min={1}
              name="passengers"
              className="form-control"
              value={formData.passengers}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Luggage Capacity</label>
            <input
              type="number"
              min={0}
              max={10}
              name="luggageCarry"
              className="form-control"
              value={formData.luggageCarry}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Per Km Rate</label>
            <input
              type="number"
              min={0}
              name="perKmRate"
              className="form-control"
              value={formData.perKmRate}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Extra Km Rate</label>
            <input
              type="number"
              min={0}
              name="extraKmRate"
              className="form-control"
              value={formData.extraKmRate}
              onChange={handleFormChange}
            />
          </div>
        </div>

        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label">Air Condition</label>
            <select
              name="airCondition"
              className="form-select"
              value={formData.airCondition}
              onChange={handleFormChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
          <div className="col-md-6">
            <label className="form-label">GPS Navigation</label>
            <select
              name="gpsNavigation"
              className="form-select"
              value={formData.gpsNavigation}
              onChange={handleFormChange}
            >
              <option>Yes</option>
              <option>No</option>
            </select>
          </div>
        </div>

        <div className="mt-3">
          <label className="form-label fw-semibold">Description</label>
          <textarea
            name="description"
            className="form-control"
            value={formData.description}
            onChange={handleFormChange}
            rows="2"
          />
        </div>

        <div className="mt-3">
          <label className="form-label fw-semibold">Vehicle Images</label>
          <div
            className="border border-dashed rounded-3 p-lg-4 p-2 text-center bg-white"
            style={{ cursor: "pointer" }}
            onClick={() =>
              document.getElementById("imageUploadInput").click()
            }
          >
            <p className="mb-1 text-secondary small">
              Click or drag & drop to upload
            </p>
            <p className="fw-bold mb-0 text-dark">Max 5 Images</p>
            <input
              id="imageUploadInput"
              type="file"
              multiple
              accept="image/*"
              className="d-none"
              onChange={handleImageChange}
              disabled={formData.images.length >= 5}
            />
          </div>

          <div className="d-flex flex-wrap gap-3 mt-3">
            {formData.images.length === 0 && (
              <div className="text-secondary small">No images uploaded yet.</div>
            )}
            {formData.images.map((img, index) => (
              <div
                key={index}
                className="position-relative"
                style={{ width: "110px", height: "80px" }}
              >
                <img
                  src={img instanceof File ? URL.createObjectURL(img) : `http://localhost:5000${img}`}
                  alt={`Preview ${index}`}
                  style={{
                    height: "100px",
                    width: "100px",
                    objectFit: "cover",
                    borderRadius: "6px",
                    border: "1px solid #ddd",
                  }}
                />

                <button
                  type="button"
                  className="btn btn-sm btn-danger position-absolute top-0 end-0"
                  style={{ borderRadius: "50%", padding: "0px 6px" }}
                  onClick={() => handleRemoveImage(index)}
                >
                  ×
                </button>
              </div>
            ))}
          </div>

        </div>

        <div className="d-flex justify-content-end mt-4">
          <button
            type="button"
            className="btn btn-outline-secondary me-2 px-4"
            onClick={handleCancel}
          >
            Cancel
          </button>
          <button
            type="submit"
            className="btn text-white px-4"
            style={{ backgroundColor: "#0f6e55" }}
          >
            Save Vehicle
          </button>
        </div>
      </form>
    </div>
  );

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 border">
      <h2 className="fs-3 fw-bold text-dark mb-lg-3 mb-1">My Vehicles</h2>
      <p className="text-secondary mb-lg-4 mb-md-2 mb-1">
        View, add, and manage your registered vehicles.
      </p>
      {loading && <div>Loading...</div>}
      {error && <div className="text-danger">{error}</div>}
      <div className="d-flex flex-column gap-3">
        {editingVehicleId || isAdding
          ? renderVehicleForm()
          : vehicles.map(renderVehicleCard)}
        {!isAdding && !editingVehicleId && (
          (() => {
            // Get driverId from token
            let token = localStorage.getItem("token");
            let myId = null;
            if (token) {
              try {
                let payload = JSON.parse(atob(token.split(".")[1]));
                myId = payload.id || payload._id || payload.userId;
              } catch { }
            }
            // Check if any vehicle exists for this driver
            const hasVehicle = vehicles.some(v => v.provider === myId || (v.provider && v.provider._id === myId));
            if (!hasVehicle) {
              return (
                <div className="text-center mt-3">
                  <button
                    className="btn text-white px-4 py-2 fw-semibold"
                    style={{ backgroundColor: "#0f6e55" }}
                    onClick={handleAddClick}
                  >
                    + Add New Vehicle
                  </button>
                </div>
              );
            }
            return null;
          })()
        )}
      </div>
    </div>
  );
};

export default D_MyVehiclesContent;

