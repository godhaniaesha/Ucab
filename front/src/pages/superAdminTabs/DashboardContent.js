import React from "react";

export default function SA_DashboardContent({ platformStats }) {
  // Example stats, replace with real data as needed
  const stats = platformStats || {
    totalDrivers: 120,
    totalPassengers: 340,
    totalRidesToday: 58,
    totalRevenue: 2450.75,
    pendingVerifications: 7,
  };
  return (
    <div className="d_tab_page p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">Super Admin Dashboard</h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        Welcome to the admin hub! Here is a summary of platform activity and quick actions.
      </p>
      <div className="row g-4 justify-content-center">
        <div className="col-12 mt-4">
          <div className="d-flex flex-wrap gap-4 justify-content-center">
            {/* Drivers */}
            <div className="stat-card bg-white p-4 rounded-4 shadow border d-flex flex-column align-items-center" style={{minWidth:220}}>
              <div className="icon-circle bg-secondary-subtle mb-3 d-flex align-items-center justify-content-center" style={{width:56,height:56,borderRadius:'50%'}}>
                <i className="bi bi-person-badge-fill fs-2 text-secondary"></i>
              </div>
              <span className="text-muted">Drivers</span>
              <h2 className="fw-bold text-dark mt-2 mb-0">{stats.totalDrivers}</h2>
            </div>
            {/* Passengers */}
            <div className="stat-card bg-white p-4 rounded-4 shadow border d-flex flex-column align-items-center" style={{minWidth:220}}>
              <div className="icon-circle bg-success-subtle mb-3 d-flex align-items-center justify-content-center" style={{width:56,height:56,borderRadius:'50%'}}>
                <i className="bi bi-people-fill fs-2 text-success"></i>
              </div>
              <span className="text-muted">Passengers</span>
              <h2 className="fw-bold text-success mt-2 mb-0">{stats.totalPassengers}</h2>
            </div>
            {/* Rides Today */}
            <div className="stat-card bg-white p-4 rounded-4 shadow border d-flex flex-column align-items-center" style={{minWidth:220}}>
              <div className="icon-circle bg-primary-subtle mb-3 d-flex align-items-center justify-content-center" style={{width:56,height:56,borderRadius:'50%'}}>
                <i className="bi bi-car-front-fill fs-2 text-primary"></i>
              </div>
              <span className="text-muted">Rides Today</span>
              <h2 className="fw-bold text-primary mt-2 mb-0">{stats.totalRidesToday}</h2>
            </div>
            {/* Revenue Today */}
            <div className="stat-card bg-white p-4 rounded-4 shadow border d-flex flex-column align-items-center" style={{minWidth:220}}>
              <div className="icon-circle bg-warning-subtle mb-3 d-flex align-items-center justify-content-center" style={{width:56,height:56,borderRadius:'50%'}}>
                <i className="bi bi-cash-stack fs-2 text-warning"></i>
              </div>
              <span className="text-muted">Revenue Today</span>
              <h2 className="fw-bold text-warning mt-2 mb-0">${stats.totalRevenue.toFixed(2)}</h2>
            </div>
            {/* Pending Verifications */}
            <div className="stat-card bg-white p-4 rounded-4 shadow border d-flex flex-column align-items-center" style={{minWidth:220}}>
              <div className="icon-circle bg-info-subtle mb-3 d-flex align-items-center justify-content-center" style={{width:56,height:56,borderRadius:'50%'}}>
                <i className="bi bi-shield-exclamation fs-2 text-info"></i>
              </div>
              <span className="text-muted">Pending Verifications</span>
              <h2 className="fw-bold text-info mt-2 mb-0">{stats.pendingVerifications}</h2>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
