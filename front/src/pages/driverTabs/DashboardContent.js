import React, { useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { getDriverStats } from "../../redux/slice/driver.slice";

const D_DashboardContent = ({ hasNewRequest, currentTrip, isTripActive }) => {
  const dispatch = useDispatch();
  const { stats, loading } = useSelector((state) => state.driver);

  useEffect(() => {
    dispatch(getDriverStats());
  }, [dispatch]);

  let statusIcon = "bi-person-circle";
  let statusText = "Online";
  let statusColorClass = "text-success";
  let cardBgClass = "bg-success-subtle";
  let cardTextColorClass = "text-success-emphasis";

  if (hasNewRequest) {
    statusIcon = "bi-bell-fill";
    statusText = "New Request";
    statusColorClass = "text-info";
    cardBgClass = "bg-info-subtle";
    cardTextColorClass = "text-info-emphasis";
  } else if (isTripActive && currentTrip) {
    statusIcon = "bi-geo-alt-fill";
    statusText = "Active Trip";
    statusColorClass = "text-primary";
    cardBgClass = "bg-primary-subtle";
    cardTextColorClass = "text-primary-emphasis";
  }

  return (
    <div className="d_tab_page w-100 h-100 p-lg-4 p-2 bg-white rounded-3 shadow-sm border border-light">
      <h2 className="fs-3 fw-bold text-dark mb-lg-4 mb-md-2 mb-1">
        Driver Dashboard
      </h2>
      <p className="text-secondary leading-normal mb-lg-4 mb-md-2 mb-1">
        Welcome to your driver hub! Here's a quick overview of your current
        status and daily stats.
      </p>

      <div className="row g-4 justify-content-center">
        <div className="col-12 mt-4">
          <div className="row g-4">
            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-car-front-fill fs-3 text-secondary mb-2"></i>
                <p className="text-muted mb-0">Rides Today</p>
                <h4 className="fs-4 fw-bold text-dark mt-1">
                  {loading ? "..." : stats?.todayRides || 0}
                </h4>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-cash-stack fs-3 text-success mb-2"></i>
                <p className="text-muted mb-0">Total Earnings</p>
                <h4 className="fs-4 fw-bold text-success mt-1">
                  {loading ? "..." : `$${(stats?.totalEarnings || 0).toFixed(2)}`}
                </h4>
              </div>
            </div>

            <div className="col-12 col-md-4">
              <div className="bg-light p-lg-4 p-2 rounded-4 shadow-sm border border-light text-center h-100 d-flex flex-column justify-content-center">
                <i className="bi bi-wallet2 fs-3 text-primary mb-2"></i>
                <p className="text-muted mb-0">Total Rides</p>
                <h4 className="fs-4 fw-bold text-primary mt-1">
                  {loading ? "..." : stats?.totalRides || 0}
                </h4>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default D_DashboardContent;
