import React, { useState } from "react";

const initialVehicles = [
  {
    id: 1,
    make: "Toyota",
    model: "Camry",
    year: "2020",
    color: "White",
    licensePlate: "ABC 123",
    type: "Standard",
    doors: "4",
    passengers: "4",
    luggage: "2",
    airCondition: "Yes",
    gpsNavigation: "Yes",
    perKmRate: "$10",
    extraKm: "$2",
    images: [
      "https://via.placeholder.com/140x90?text=Car1",
      "https://via.placeholder.com/140x90?text=Car2",
    ],
  },
];

const D_MyVehiclesContent = () => {
  const [vehicles, setVehicles] = useState(initialVehicles);
  const [editingVehicleId, setEditingVehicleId] = useState(null);
  const [isAdding, setIsAdding] = useState(false);
  const [formData, setFormData] = useState({
    id: null,
    make: "",
    model: "",
    year: "",
    color: "",
    licensePlate: "",
    type: "",
    doors: "",
    passengers: "",
    luggage: "",
    airCondition: "Yes",
    gpsNavigation: "Yes",
    perKmRate: "",
    extraKm: "",
    images: ["https://via.placeholder.com/140x90?text=New Car"],
  });

  const handleEditClick = (vehicle) => {
    setEditingVehicleId(vehicle.id);
    setFormData(vehicle);
    setIsAdding(false);
  };

  const handleDelete = (id) => {
    setVehicles(vehicles.filter((vehicle) => vehicle.id !== id));
  };

  const handleAddClick = () => {
    setIsAdding(true);
    setEditingVehicleId(null);
    setFormData({
      id: Date.now(),
      make: "",
      model: "",
      year: "",
      color: "",
      licensePlate: "",
      type: "",
      doors: "",
      passengers: "",
      luggage: "",
      airCondition: "Yes",
      gpsNavigation: "Yes",
      perKmRate: "",
      extraKm: "",
      images: [],
    });
  };

  const handleFormChange = (e) => {
    const { name, value } = e.target;
    setFormData({ ...formData, [name]: value });
  };

  // Handle image upload & preview
  const handleImageChange = (e) => {
    const files = Array.from(e.target.files);
    const newImages = files.map((file) => URL.createObjectURL(file));
    setFormData({ ...formData, images: [...formData.images, ...newImages] });
  };

  const handleRemoveImage = (index) => {
    setFormData({
      ...formData,
      images: formData.images.filter((_, i) => i !== index),
    });
  };

  const handleSave = (e) => {
    e.preventDefault();
    if (editingVehicleId) {
      setVehicles(
        vehicles.map((v) => (v.id === editingVehicleId ? formData : v))
      );
    } else {
      setVehicles([...vehicles, formData]);
    }
    setEditingVehicleId(null);
    setIsAdding(false);
  };

  const handleCancel = () => {
    setEditingVehicleId(null);
    setIsAdding(false);
  };

  const renderVehicleCard = (vehicle) => (
    <div key={vehicle.id} className="p-3 rounded-3 border bg-light">
      <div className="d-flex flex-column flex-md-row gap-3">
        {/* Vehicle Info */}
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
                <strong>Color:</strong> {vehicle.color}
              </div>
              <div>
                <strong>Doors:</strong> {vehicle.doors}
              </div>
              <div>
                <strong>Passengers:</strong> {vehicle.passengers}
              </div>
            </div>
            <div className="col-6">
              <div>
                <strong>Plate:</strong> {vehicle.licensePlate}
              </div>
              <div>
                <strong>Type:</strong> {vehicle.type}
              </div>
              <div>
                <strong>Luggage:</strong> {vehicle.luggage}
              </div>
              <div>
                <strong>AC:</strong> {vehicle.airCondition}
              </div>
            </div>
          </div>
          <div className="mt-2 small text-secondary">
            <strong>GPS:</strong> {vehicle.gpsNavigation} | 
            <strong> Per Km:</strong> {vehicle.perKmRate} | 
            <strong> Extra Km:</strong> {vehicle.extraKm}
          </div>
        </div>

        {/* Images */}
        <div className="d-flex flex-wrap gap-2">
          {vehicle.images.map((src, i) => (
            <img
              key={i}
              src={src}
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
          onClick={() => handleDelete(vehicle.id)}
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
  );

  const renderVehicleForm = () => (
    <div className="p-lg-4 p-2 rounded-3 border bg-light mt-2">
      <h5 className="fw-bold text-dark mb-lg-3 mb-1">
        {isAdding ? "Add New Vehicle" : "Edit Vehicle"}
      </h5>
      <form onSubmit={handleSave}>
        <div className="row g-3">
          {/* First Column */}
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
              type="text"
              name="year"
              className="form-control"
              value={formData.year}
              onChange={handleFormChange}
              required
            />

            <label className="form-label mt-2">Color</label>
            <input
              type="text"
              name="color"
              className="form-control"
              value={formData.color}
              onChange={handleFormChange}
              required
            />

            <label className="form-label mt-2">License Plate</label>
            <input
              type="text"
              name="licensePlate"
              className="form-control"
              value={formData.licensePlate}
              onChange={handleFormChange}
              required
            />
          </div>

          {/* Second Column */}
          <div className="col-md-6">
            <label className="form-label">Type</label>
            <input
              type="text"
              name="type"
              className="form-control"
              value={formData.type}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Doors</label>
            <input
              type="number"
              name="doors"
              className="form-control"
              value={formData.doors}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Passengers</label>
            <input
              type="number"
              name="passengers"
              className="form-control"
              value={formData.passengers}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Luggage</label>
            <input
              type="number"
              name="luggage"
              className="form-control"
              value={formData.luggage}
              onChange={handleFormChange}
            />

            <label className="form-label mt-2">Per Km Rate</label>
            <input
              type="text"
              name="perKmRate"
              className="form-control"
              value={formData.perKmRate}
              onChange={handleFormChange}
            />
          </div>
        </div>

        {/* Full Width Fields */}
        <div className="row g-3 mt-2">
          <div className="col-md-6">
            <label className="form-label">Extra Km Rate</label>
            <input
              type="text"
              name="extraKm"
              className="form-control"
              value={formData.extraKm}
              onChange={handleFormChange}
            />
          </div>
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
{/* Image Upload */}
<div className="mt-3">
  <label className="form-label fw-semibold">Vehicle Images</label>

  {/* Upload Box */}
  <div
    className="border border-dashed rounded-3 p-lg-4 p-2 text-center bg-white"
    style={{ cursor: "pointer" }}
    onClick={() => document.getElementById("imageUploadInput").click()}
  >
    <p className="mb-1 text-secondary small">Click or drag & drop to upload</p>
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

  {/* Preview Thumbnails */}
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
          src={img}
          alt={`Preview ${index}`}
          className="rounded border"
          style={{
            width: "100%",
            height: "100%",
            objectFit: "cover",
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

        {/* Actions */}
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
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 border">
      <h2 className="fs-3 fw-bold text-dark mb-lg-3 mb-1">My Vehicles</h2>
      <p className="text-secondary mb-lg-4 mb-md-2 mb-1">
        View, add, and manage your registered vehicles.
      </p>

      <div className="d-flex flex-column gap-3">
        {editingVehicleId || isAdding
          ? renderVehicleForm()
          : vehicles.map(renderVehicleCard)}

        {!isAdding && !editingVehicleId && (
          <div className="text-center mt-3">
            <button
              className="btn text-white px-4 py-2 fw-semibold"
              style={{ backgroundColor: "#0f6e55" }}
              onClick={handleAddClick}
            >
              + Add New Vehicle
            </button>
          </div>
        )}
      </div>
    </div>
  );
};

export default D_MyVehiclesContent;
