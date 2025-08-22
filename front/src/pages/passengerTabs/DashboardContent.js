import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getTodayStats } from "../../redux/slice/passengers.slice";

export default function P_DashboardContent() {
  const dispatch = useDispatch();
  const passengersState = useSelector((state) => state.passenger) || {};
  const { todayStats, loading } = passengersState;

  console.log(todayStats,'todayStats');
  
  useEffect(() => {
    dispatch(getTodayStats());
  }, [dispatch]);

  const stats = todayStats || {
    totalRides: 0,
    totalSpent: 0,
    totalCompletedRides: 0
  };

  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Passenger Dashboard</h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        Welcome to your passenger hub! Here's a quick overview of your ride activity and account summary.
      </p>

      <div className="row g-4 justify-content-center">
        <div className="col-12 mt-4">
          <div className="row g-4">
            {/* Rides Today */}
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-geo-alt-fill fs-3 text-secondary mb-2"></i>
                <p className="text-muted mb-0">Rides Today</p>
                <h4 className="fs-4 fw-bold text-dark mt-1">{loading ? "..." : stats.totalRides}</h4>
              </div>
            </div>

            {/* Total Spent */}
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-cash-stack fs-3 text-success mb-2"></i>
                <p className="text-muted mb-0">Total Spent</p>
                <h4 className="fs-4 fw-bold text-success mt-1">${loading ? "..." : (stats.totalSpent || 0).toFixed(2)}</h4>
              </div>
            </div>

           
            {/* Completed Rides */}
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-check-circle-fill fs-3 text-success mb-2"></i>
                <p className="text-muted mb-0">Completed Rides</p>
                <h4 className="fs-4 fw-bold text-dark mt-1">{loading ? "..." : stats.totalCompletedRides}</h4>
              </div>
            </div>

           
          </div>
        </div>
      </div>
    </div>
  );
}
