import React from "react";

const P_TripHistoryContent = () => (
  <div className="p_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light d-flex flex-column h-100">
    <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Trip History</h2>
    <p className="text-secondary leading-normal mb-lg-3 mb-1">
      Review details of all your past completed rides. You can filter by date or driver.
    </p>

    <div className="overflow-auto pe-2" style={{ maxHeight: "24rem" }}>
      <div className="d-flex flex-column gap-3">
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R54321</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 4:00 PM | Fare: $22.00
          </p>
          <p className="text-secondary">
            Driver: John Doe | Vehicle: Sedan | Rating: 5 stars
          </p>
          <p className="text-secondary">
            Pickup: 123 Main St | Dropoff: 456 Park Ave
          </p>
        </div>

        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R54320</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 2:30 PM | Fare: $18.50
          </p>
          <p className="text-secondary">
            Driver: Jane Smith | Vehicle: SUV | Rating: 4 stars
          </p>
          <p className="text-secondary">
            Pickup: 789 Elm St | Dropoff: 321 Oak St
          </p>
        </div>

        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R54319</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 1:45 PM | Fare: $15.00
          </p>
          <p className="text-secondary">
            Driver: Mike Lee | Vehicle: Hatchback | Rating: 5 stars
          </p>
          <p className="text-secondary">
            Pickup: 555 Pine St | Dropoff: 888 Maple St
          </p>
        </div>

        {/* Add more rides as needed */}
      </div>
    </div>
  </div>
);

export default P_TripHistoryContent;
