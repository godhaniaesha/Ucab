import React from "react";

const D_TripHistoryContent = () => (
   <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light d-flex flex-column h-100">
    <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Trip History</h2>
    <p className="text-secondary leading-normal mb-lg-3 mb-1">
      Review details of all your past completed rides. You can filter by date or
      passenger.
    </p>
    <div className="overflow-auto pe-2" style={{ maxHeight: "24rem" }}>
      {" "}
      {/* max-height instead of max-h-96 */}
      <div className="d-flex flex-column gap-3">
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12350</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 4:00 PM | Fare: $22.00
          </p>
          <p className="text-secondary">
            Passenger: David King | Rating: 5 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12349</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 2:30 PM | Fare: $18.50
          </p>
          <p className="text-secondary">
            Passenger: Emily White | Rating: 4 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12348</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 1:45 PM | Fare: $15.00
          </p>
          <p className="text-secondary">
            Passenger: Alex Green | Rating: 5 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12347</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 11:20 AM | Fare: $28.50
          </p>
          <p className="text-secondary">
            Passenger: Sarah Lee | Rating: 4 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12346</p>
          <p className="text-secondary">
            Date: 2024-08-19 | Time: 9:00 AM | Fare: $10.00
          </p>
          <p className="text-secondary">
            Passenger: Mike Brown | Rating: 5 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12345</p>
          <p className="text-secondary">
            Date: 2024-08-18 | Time: 5:00 PM | Fare: $30.00
          </p>
          <p className="text-secondary">
            Passenger: Chris Blue | Rating: 5 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12344</p>
          <p className="text-secondary">
            Date: 2024-08-18 | Time: 3:15 PM | Fare: $12.00
          </p>
          <p className="text-secondary">
            Passenger: Laura Green | Rating: 4 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12343</p>
          <p className="text-secondary">
            Date: 2024-08-18 | Time: 1:00 PM | Fare: $45.00
          </p>
          <p className="text-secondary">
            Passenger: Peter Red | Rating: 5 stars
          </p>
        </div>
        <div className="bg-light p-3 rounded-2 border border-light">
          <p className="fw-semibold text-dark">Ride ID: #R12342</p>
          <p className="text-secondary">
            Date: 2024-08-18 | Time: 10:30 AM | Fare: $25.00
          </p>
          <p className="text-secondary">
            Passenger: Nina Grey | Rating: 4 stars
          </p>
        </div>
      </div>
    </div>
  </div>
);

export default D_TripHistoryContent;
