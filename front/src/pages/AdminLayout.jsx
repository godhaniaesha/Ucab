import React, { useState, useEffect } from 'react';
import { Navbar, Nav, Container, Offcanvas, Button, Dropdown, Form, Card, Alert, InputGroup } from 'react-bootstrap';


// IMPORTANT: Bootstrap CSS and JS, should be loaded via CDN links
// in your main HTML file (e.g., public/index.html) like this:
//
// <!-- Bootstrap CSS -->
// <link href="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/css/bootstrap.min.css" rel="stylesheet">
// <!-- Bootstrap Bundle JS (includes Popper) -->
// <script src="https://cdn.jsdelivr.net/npm/bootstrap@5.3.0/dist/js/bootstrap.bundle.min.js"></script>


// Inline styles for custom colors and layout
// Using d_ prefix for custom classes as requested
const customStyles = `
  :root {
    --d_primary-color: #0f6e55;
    --d_dark-color: #000000;
    --d_light-bg: #f8f9fa;
  }

  body {
    font-family: 'Inter', sans-serif;
    background-color: var(--d_light-bg);
  }

  .d_navbar {
    background-color: var(--d_dark-color) !important;
    padding: 0.75rem 1rem;
    box-shadow: 0 2px 4px rgba(0,0,0,.1);
    border-bottom: 1px solid var(--d_primary-color);
  }

  .d_navbar .navbar-brand,
  .d_navbar .nav-link,
  .d_navbar .btn-close {
    color: #fff !important;
  }

  .d_navbar .btn-close {
    filter: invert(1); /* Ensure close button is visible on dark background */
  }

  .d_navbar .nav-link:hover,
  .d_navbar .nav-link.active {
    color: var(--d_primary-color) !important;
  }

  /* Custom Navbar Dropdown styles */
  .d_navbar .dropdown-toggle {
    background-color: transparent !important;
    border: none !important;
    color: #fff !important;
    padding: 0.5rem 1rem;
  }

  .d_navbar .dropdown-toggle:hover {
    color: var(--d_primary-color) !important;
  }

  .d_navbar .dropdown-menu {
    background-color: var(--d_dark-color);
    border: 1px solid var(--d_primary-color);
    border-radius: 0.5rem;
    z-index: 1060; /* Ensure it appears above other elements like Offcanvas backdrop */
    min-width: 10rem; /* Give it a decent minimum width */
  }

  .d_navbar .dropdown-item {
    color: #fff !important;
  }

  .d_navbar .dropdown-item:hover {
    background-color: var(--d_primary-color);
    color: #fff !important;
  }

  .d_sidebar_fixed {
    width: 250px;
    background-color: var(--d_dark-color);
    color: #fff;
    position: fixed; /* Make the sidebar fixed */
    top: 0; /* Position it at the top of the viewport */
    height: 100vh; /* Make it take the full viewport height */
    padding-top: 60px; /* Adjust based on navbar height to prevent overlap */
    box-shadow: 2px 0 5px rgba(0,0,0,.1);
    border-right: 1px solid var(--d_primary-color);
    overflow-y: auto; /* Enable vertical scrolling for sidebar content if it exceeds height */
    z-index: 1040; /* Ensure it's above main content but below navbar dropdowns */
  }

  /* Offcanvas styles for mobile sidebar */
  .offcanvas.offcanvas-lg {
    background-color: var(--d_dark-color);
    color: #fff;
    width: 250px;
  }

  .offcanvas.offcanvas-lg .offcanvas-header {
    background-color: var(--d_dark-color);
    border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  }

  .offcanvas.offcanvas-lg .offcanvas-title {
    color: var(--d_primary-color);
    font-weight: bold;
  }

  /* Adjust Offcanvas body to start below the header */
  .offcanvas-body {
    padding-top: 0; /* Remove default padding-top */
  }


  .d_sidebar_link {
    display: flex;
    align-items: center;
    padding: 0.75rem 1rem;
    color: #fff;
    text-decoration: none;
    border-radius: 0.25rem;
    margin: 0.25rem 0.5rem;
    transition: background-color 0.2s ease;
  }

  .d_sidebar_link:hover,
  .d_sidebar_link.active {
    background-color: var(--d_primary-color);
    color: #fff;
  }

  /* Custom Sidebar Dropdowns */
  .d_sidebar_dropdown {
    margin: 0.25rem 0.5rem;
  }

  .d_sidebar_dropdown .d_sidebar_btn {
    display: flex;
    align-items: center;
    width: 100%;
    padding: 0.75rem 1rem;
    background-color: transparent;
    border: none;
    color: #fff;
    text-align: left;
    border-radius: 0.25rem;
    transition: background-color 0.2s ease;
  }

  .d_sidebar_dropdown .d_sidebar_btn:hover {
    background-color: var(--d_primary-color);
    color: #fff;
  }

  .d_sidebar_dropdown_content {
    background-color: rgba(0, 0, 0, 0.2);
    border-radius: 0.25rem;
    overflow: hidden;
    max-height: 0;
    transition: max-height 0.3s ease-out;
    padding-left: 1rem; /* Indent dropdown items */
  }

  .d_sidebar_dropdown_content.show {
    max-height: 200px; /* Adjust as needed to fit content */
    transition: max-height 0.3s ease-in;
  }

  .d_sidebar_dropdown_content a {
    display: block;
    padding: 0.5rem 1rem;
    color: #fff;
    text-decoration: none;
    transition: background-color 0.2s ease;
  }

  .d_sidebar_dropdown_content a:hover {
    background-color: var(--d_primary-color);
    color: #fff;
  }

  .d_main_content {
    flex-grow: 1;
    padding: 1.5rem;
    background-color: var(--d_light-bg); /* Use light background for content area */
    min-height: calc(100vh - 60px); /* Adjust for fixed navbar height */
    margin-top: 60px; /* Push content down from fixed navbar */
    border-radius: 0.5rem;
    box-shadow: 0 0 10px rgba(0,0,0,.05);
    margin-left: 0; /* Default for small screens */
  }

  @media (min-width: 992px) { /* lg breakpoint */
    .d_main_content {
      margin-left: 250px; /* Space for fixed sidebar */
    }
  }

  .d_spinner {
    width: 3rem;
    height: 3rem;
    color: var(--d_primary-color);
  }

  /* Auth Forms Specific Styles */
  .d_auth-container {
    display: flex;
    justify-content: center;
    align-items: center;
    min-height: calc(100vh - 60px); /* Adjust for fixed navbar */
    background-color: var(--d_light-bg);
    padding-top: 60px; /* Push content down from fixed navbar */
  }

  .d_auth-card {
    max-width: 450px;
    width: 90%;
    padding: 2rem;
    border-radius: 0.75rem;
    box-shadow: 0 4px 15px rgba(0,0,0,0.1);
    background-color: #fff;
    border: 1px solid var(--d_primary-color);
  }

  .d_auth-title {
    color: var(--d_dark-color);
    margin-bottom: 1.5rem;
    font-weight: bold;
    text-align: center;
  }

  .d_auth-form-label {
    color: var(--d_dark-color);
    font-weight: 500;
  }

  .d_auth-form-control {
    border-radius: 0.5rem;
    border: 1px solid #ced4da; /* Explicitly set border */
    padding: 0.75rem 1rem;
    box-shadow: none !important; /* Remove all box shadows */
    outline: none !important; /* Remove blue outline on focus */
    transition: border-color 0.15s ease-in-out, box-shadow 0.15s ease-in-out;
  }

  .d_auth-form-control:focus {
    border-color: var(--d_primary-color); /* Highlight border on focus */
    box-shadow: none !important; /* Ensure no shadow on focus */
  }

  .d_auth-btn {
    background-color: var(--d_primary-color);
    border-color: var(--d_primary-color);
    color: #fff;
    font-weight: bold;
    padding: 0.75rem 1.25rem;
    border-radius: 0.5rem;
    width: 100%;
    transition: background-color 0.2s ease, border-color 0.2s ease;
  }

  .d_auth-btn:hover {
    background-color: #0c5b46; /* Slightly darker primary */
    border-color: #0c5b46;
  }

  .d_auth-link {
    color: var(--d_primary-color);
    text-decoration: none;
    font-weight: 500;
  }

  .d_auth-link:hover {
    text-decoration: underline;
  }

  .input-group-text.d_password-toggle {
    background-color: transparent;
    border: 1px solid #ced4da;
    border-left: none; /* No border on left side for toggle button */
    border-radius: 0 0.5rem 0.5rem 0; /* Rounded only on right side */
    cursor: pointer;
    color: var(--d_dark-color);
  }
  .input-group.focus-within .input-group-text.d_password-toggle {
    border-color: var(--d_primary-color);
  }

`;

// Inline SVG Icons (equivalent to react-icons/fa)
const IconEye = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 576 512" height="1em" width="1em" {...props}>
    <path d="M573.23 234.33C523.65 144 429.54 64 288 64S52.35 144 2.77 234.33A32 32 0 0 0 2 256.03c-.02 91.56 94.62 171.74 286 171.97 141.48-.22 235.53-80.2 285.83-170.21a32 32 0 0 0 .6-21.46zM288 384c-88.37 0-160-71.63-160-160s71.63-160 160-160 160 71.63 160 160-71.63 160-160 160zm0-256a96 96 0 1 0 0 192 96 96 0 0 0 0-192z"></path>
  </svg>
);

const IconEyeSlash = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" {...props}>
    <path d="M320 400c-75.85 0-137.25-54.22-159.49-124.8L32.49 144.1c-14.7-25.21-8.43-57.17 16.78-71.87s57.17-8.43 71.87 16.78l105.15 180.37c3.96 6.81 9.94 11.2 16.89 13.06 6.95 1.86 14.19.04 19.95-4.88 5.76-4.92 9.35-12.27 9.35-20.18V80c0-17.67 14.33-32 32-32s32 14.33 32 32v128h.04l.05-.05 77.26-132.61c14.7-25.21 46.66-31.48 71.87-16.78s31.48 46.66 16.78 71.87L500.51 291.2C522.75 361.78 461.35 416 385.5 416c-17.67 0-32 14.33-32 32s14.33 32 32 32c109.93 0 200.5-63.57 241.62-149.25C671.37 257.65 596.53 176 320 176c-17.67 0-32 14.33-32 32s14.33 32 32 32zm-.04 64c-35.35 0-64 28.65-64 64s28.65 64 64 64 64-28.65 64-64-28.65-64-64-64z"></path>
  </svg>
);

const IconBars = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" {...props}>
    <path d="M16 132h416c8.837 0 16-7.163 16-16V76c0-8.837-7.163-16-16-16H16C7.163 60 0 67.163 0 76v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16zm0 160h416c8.837 0 16-7.163 16-16v-40c0-8.837-7.163-16-16-16H16c-8.837 0-16 7.163-16 16v40c0 8.837 7.163 16 16 16z"></path>
  </svg>
);

const IconUserCircle = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 496 512" height="1em" width="1em" {...props}>
    <path d="M248 8C111 8 0 119 0 256s111 248 248 248 248-111 248-248S385 8 248 8zm0 110c37.5 0 68 30.5 68 68s-30.5 68-68 68-68-30.5-68-68 30.5-68 68-68zm120 256h-240c-15.5 0-28-12.5-28-28v-10c0-50 71.6-92.4 175.3-92.4s175.7 42.4 175.7 92.4v10c0 15.5-12.5 28-28 28z"></path>
  </svg>
);

const IconUser = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" {...props}>
    <path d="M224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-179.2c-50.1 0-91.7 40.7-91.7 90.9v86.1c0 23.4 19.1 42.5 42.5 42.5h278.4c23.4 0 42.5-19.1 42.5-42.5v-86.1c0-50.1-41.6-90.9-91.7-90.9z"></path>
  </svg>
);

const IconCog = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
    <path d="M444.6 310.2L500 280c10.8-5.6 10.8-20.4 0-26l-55.4-30.2c-1.3-3.1-2.9-6.1-4.9-8.9l19.8-54.8c4.6-12.8-5.3-26.6-18.1-22L361 140.2c-2.8-2-5.8-3.6-8.9-4.9L321.8 8c-5.6-10.8-20.4-10.8-26 0L265.6 63.4c-3.1 1.3-6.1 2.9-8.9 4.9L202 48.5c-12.8-4.6-26.6 5.3-22 18.1l19.8 54.8c-2 2.8-3.6 5.8-4.9 8.9L8 190.2c-10.8 5.6-10.8 20.4 0 26l55.4 30.2c1.3 3.1 2.9 6.1 4.9 8.9L48.5 310c-4.6 12.8 5.3 26.6 18.1 22l54.8-19.8c2.8 2 5.8 3.6 8.9 4.9L190.2 504c5.6 10.8 20.4 10.8 26 0l30.2-55.4c3.1-1.3 6.1-2.9 8.9-4.9l54.8 19.8c12.8 4.6 26.6-5.3 22-18.1l-19.8-54.8c2-2.8 3.6-5.8 4.9-8.9L504 321.8c10.8-5.6 10.8-20.4 0-26zM256 368c-61.9 0-112-50.1-112-112S194.1 144 256 144s112 50.1 112 112-50.1 112-112 112z"></path>
  </svg>
);

const IconSignOutAlt = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
    <path d="M497.6 192l-51.2-51.2C439.4 135.4 432 128 416 128h-96c-17.67 0-32 14.33-32 32s14.33 32 32 32h58.75L309.8 264.4c-8.996 8.996-14.16 21.05-14.16 33.95V448c0 17.67 14.33 32 32 32h96c17.67 0 32-14.33 32-32V352h32c17.67 0 32-14.33 32-32V224c0-17.67-14.33-32-32-32zm-288.7-64l-96 96L102.4 224h150.3c17.67 0 32-14.33 32-32s-14.33-32-32-32H102.4L188.9 64.9C197.9 55.9 203.1 43.85 203.1 30.95c0-26.6-21.5-48.1-48.1-48.1H32C14.33 0 0 14.33 0 32v448c0 17.67 14.33 32 32 32h123.08c17.67 0 32-14.33 32-32s-14.33-32-32-32H64V256.6h.001L155.6 160H203.1c17.67 0 32-14.33 32-32S220.7 96 203.1 96h-150.3z"></path>
  </svg>
);

const IconTachometerAlt = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
    <path d="M384 192h-85.33c-35.34 0-64 28.66-64 64V384h213.33v-128c0-35.34-28.66-64-64-64zM256 0C114.6 0 0 114.6 0 256s114.6 256 256 256 256-114.6 256-256S397.4 0 256 0zm0 448c-106.1 0-192-85.9-192-192S149.9 64 256 64s192 85.9 192 192-85.9 192-192 192zm-32-192c0-8.84-7.16-16-16-16H160c-8.84 0-16 7.16-16 16v160c0 8.84 7.16 16 16 16h48c8.84 0 16-7.16 16-16V256z"></path>
  </svg>
);

const IconTaxi = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" {...props}>
    <path d="M624 352h-80v-96c0-17.67-14.33-32-32-32H128c-17.67 0-32 14.33-32 32v96H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h32l20.48 40.96C75.24 461.53 90.76 480 112 480h416c21.24 0 36.76-18.47 43.52-32.96L592 400h32c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM160 128h320V64H160v64zm352 224H128v-96h384v96zM464 432c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zm-288 0c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32zM576 64c-17.67 0-32 14.33-32 32s14.33 32 32 32 32-14.33 32-32-14.33-32-32-32z"></path>
  </svg>
);

const IconChevronDown = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" {...props}>
    <path d="M207.029 381.476L12.686 182.022c-5.468-9.284-3.324-21.054 5.378-27.464 8.702-6.411 21.072-4.19 27.464 4.19L224 345.247l180.124-186.5c6.392-8.381 18.762-10.592 27.464-4.187 8.702 6.411 10.846 18.181 5.378 27.464L240.971 381.476c-6.198 10.589-20.354 10.589-26.552.001z"></path>
  </svg>
);

const IconUsers = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" {...props}>
    <path d="M96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zm448 0c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zM0 416c0 35.3 28.7 64 64 64h512c35.3 0 64-28.7 64-64v-32c0-60.6-42.5-117.8-109.2-132.8C448.5 252.6 400 224 352 224h-64c-48.5 0-96.5 28.6-142.8 39.2C42.5 266.2 0 323.4 0 384v32z"></path>
  </svg>
);

const IconUserPlus = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" {...props}>
    <path d="M624 208h-64v-64c0-17.67-14.33-32-32-32h-32c-17.67 0-32 14.33-32 32v64h-64c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h64v64c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-64h64c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zM224 256c70.7 0 128-57.3 128-128S294.7 0 224 0 96 57.3 96 128s57.3 128 128 128zm89.6 32h-179.2c-50.1 0-91.7 40.7-91.7 90.9v86.1c0 23.4 19.1 42.5 42.5 42.5h278.4c23.4 0 42.5-19.1 42.5-42.5v-86.1c0-50.1-41.6-90.9-91.7-90.9z"></path>
  </svg>
);

const IconBook = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" {...props}>
    <path d="M448 360V144c0-26.51-21.49-48-48-48H48C21.49 96 0 117.49 0 144v216c0 26.51 21.49 48 48 48h352c26.51 0 48-21.49 48-48zM240 200V128h-32v72c-17.67 0-32 14.33-32 32s14.33 32 32 32h32v72h32v-72c17.67 0 32-14.33 32-32s-14.33-32-32-32z"></path>
  </svg>
);

const IconClipboardList = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
    <path d="M368 40H144C64.47 40 0 104.5 0 184v224c0 49.63 40.37 90 90 90h332c49.63 0 90-40.37 90-90V184c0-79.5-64.47-144-144-144zM160 208h192c8.84 0 16 7.16 16 16v32c0 8.84-7.16 16-16 16H160c-8.84 0-16-7.16-16-16v-32c0-8.84 7.16-16 16-16zm192 96H160c-8.84 0-16-7.16-16-16v32c0-8.84 7.16-16 16-16zm-192-96zm192-96zm-96-96c-17.67 0-32-14.33-32-32s14.33-32 32-32 32 14.33 32 32-14.33 32-32 32z"></path>
  </svg>
);

const IconHourglassHalf = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 448 512" height="1em" width="1em" {...props}>
    <path d="M0 160V64c0-17.67 14.33-32 32-32h384c17.67 0 32 14.33 32 32v96H0zm416 192H32v96c0 17.67 14.33 32 32 32h352c17.67 0 32-14.33 32-32v-96zM224 272c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32s32-14.33 32-32v-32c0-17.67-14.33-32-32-32zm32-128c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32s32-14.33 32-32v-32c0-17.67-14.33-32-32-32z"></path>
  </svg>
);

const IconUsersCog = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 640 512" height="1em" width="1em" {...props}>
    <path d="M624 416c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zm-64-320c-17.67 0-32 14.33-32 32v32c0 17.67 14.33 32 32 32h32c17.67 0 32-14.33 32-32v-32c0-17.67-14.33-32-32-32zM96 224c35.3 0 64-28.7 64-64s-28.7-64-64-64-64 28.7-64 64 28.7 64 64 64zM0 416c0 35.3 28.7 64 64 64h512c35.3 0 64-28.7 64-64v-32c0-60.6-42.5-117.8-109.2-132.8C448.5 252.6 400 224 352 224h-64c-48.5 0-96.5 28.6-142.8 39.2C42.5 266.2 0 323.4 0 384v32z"></path>
  </svg>
);

const IconChartBar = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
    <path d="M496 400H16c-8.84 0-16 7.16-16 16v32c0 8.84 7.16 16 16 16h480c8.84 0 16-7.16 16-16v-32c0-8.84-7.16-16-16-16zM64 96v256c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V96c0-8.84-7.16-16-16-16H80c-8.84 0-16 7.16-16 16zm128 0v256c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V96c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16zm128 0v256c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V96c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16zm128 0v256c0 8.84 7.16 16 16 16h32c8.84 0 16-7.16 16-16V96c0-8.84-7.16-16-16-16h-32c-8.84 0-16 7.16-16 16z"></path>
  </svg>
);

const IconFolderPlus = (props) => (
  <svg stroke="currentColor" fill="currentColor" strokeWidth="0" viewBox="0 0 512 512" height="1em" width="1em" {...props}>
    <path d="M464 128H272l-64-64H48C21.49 64 0 85.49 0 112v288c0 26.51 21.49 48 48 48h416c26.51 0 48-21.49 48-48V176c0-26.51-21.49-48-48-48zm-80 176h-64v64c0 17.67-14.33 32-32 32h-32c-17.67 0-32-14.33-32-32v-64h-64c-17.67 0-32-14.33-32-32v-32c0-17.67 14.33-32 32-32h64v-64c0-17.67 14.33-32 32-32h32c17.67 0 32 14.33 32 32v64h64c17.67 0 32 14.33 32 32v32c0 17.67-14.33 32-32 32z"></path>
  </svg>
);


// Login Screen Component
function LoginScreen({ onLoginSuccess, onSwitchToRegister }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    // Simulate API call for login
    setTimeout(() => {
      if (username === 'admin' && password === 'password') {
        onLoginSuccess();
      } else {
        setError('Invalid username or password.');
      }
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="d_auth-container">
      <Card className="d_auth-card">
        <h3 className="d_auth-title">Admin Login</h3>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label className="d_auth-form-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Enter username"
              className="d_auth-form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="d_auth-form-label">Password</Form.Label>
            <InputGroup className={showPassword ? 'focus-within' : ''}> {/* Add class for styling on focus */}
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Password"
                className="d_auth-form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text className="d_password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <IconEyeSlash /> : <IconEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="d_auth-btn" disabled={loading}>
            {loading ? 'Logging in...' : 'Login'}
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0">
          Don't have an account?{' '}
          <a href="#" className="d_auth-link" onClick={onSwitchToRegister}>
            Register here
          </a>
        </p>
      </Card>
    </div>
  );
}

// Register Screen Component
function RegisterScreen({ onRegisterSuccess, onSwitchToLogin }) {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [error, setError] = useState('');
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false); // State for password visibility
  const [showConfirmPassword, setShowConfirmPassword] = useState(false); // State for confirm password visibility

  const togglePasswordVisibility = () => {
    setShowPassword(!showPassword);
  };

  const toggleConfirmPasswordVisibility = () => {
    setShowConfirmPassword(!showConfirmPassword);
  };

  const handleSubmit = (event) => {
    event.preventDefault();
    setLoading(true);
    setError('');

    if (password !== confirmPassword) {
      setError('Passwords do not match.');
      setLoading(false);
      return;
    }

    // Simulate API call for registration
    setTimeout(() => {
      // In a real app, you'd send this to a backend
      console.log('Registering:', { username, password });
      onRegisterSuccess();
      setLoading(false);
    }, 1000);
  };

  return (
    <div className="d_auth-container">
      <Card className="d_auth-card">
        <h3 className="d_auth-title">Admin Register</h3>
        <Form onSubmit={handleSubmit}>
          {error && <Alert variant="danger">{error}</Alert>}
          <Form.Group className="mb-3" controlId="formBasicUsername">
            <Form.Label className="d_auth-form-label">Username</Form.Label>
            <Form.Control
              type="text"
              placeholder="Choose a username"
              className="d_auth-form-control"
              value={username}
              onChange={(e) => setUsername(e.target.value)}
              required
            />
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label className="d_auth-form-label">Password</Form.Label>
            <InputGroup className={showPassword ? 'focus-within' : ''}> {/* Add class for styling on focus */}
              <Form.Control
                type={showPassword ? 'text' : 'password'}
                placeholder="Choose a password"
                className="d_auth-form-control"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <InputGroup.Text className="d_password-toggle" onClick={togglePasswordVisibility}>
                {showPassword ? <IconEyeSlash /> : <IconEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Form.Group className="mb-4" controlId="formBasicConfirmPassword">
            <Form.Label className="d_auth-form-label">Confirm Password</Form.Label>
            <InputGroup className={showConfirmPassword ? 'focus-within' : ''}> {/* Add class for styling on focus */}
              <Form.Control
                type={showConfirmPassword ? 'text' : 'password'}
                placeholder="Confirm password"
                className="d_auth-form-control"
                value={confirmPassword}
                onChange={(e) => setConfirmPassword(e.target.value)}
                required
              />
              <InputGroup.Text className="d_password-toggle" onClick={toggleConfirmPasswordVisibility}>
                {showConfirmPassword ? <IconEyeSlash /> : <IconEye />}
              </InputGroup.Text>
            </InputGroup>
          </Form.Group>

          <Button variant="primary" type="submit" className="d_auth-btn" disabled={loading}>
            {loading ? 'Registering...' : 'Register'}
          </Button>
        </Form>
        <p className="text-center mt-3 mb-0">
          Already have an account?{' '}
          <a href="#" className="d_auth-link" onClick={onSwitchToLogin}>
            Login here
          </a>
        </p>
      </Card>
    </div>
  );
}


// Main AdminLayout Component
function AdminLayout() {
  const [showSidebar, setShowSidebar] = useState(false);
  const [openSidebarDropdown, setOpenSidebarDropdown] = useState("");
  const [loading, setLoading] = useState(true); // Added loading state for initial app load
  const [isLoggedIn, setIsLoggedIn] = useState(false); // Authentication state
  const [currentAuthView, setCurrentAuthView] = useState('login'); // 'login' or 'register'
  const [totalUsers, setTotalUsers] = useState(0);
  const [newOrders, setNewOrders] = useState(0);
  const [revenue, setRevenue] = useState(0);
  const [recentActivity, setRecentActivity] = useState([]);


  const toggleSidebar = () => setShowSidebar(!showSidebar);

  // Close sidebar if it's open on smaller screens when a dropdown item is clicked
  const handleLinkClick = () => {
    if (window.innerWidth < 992) { // Less than lg breakpoint
      setShowSidebar(false);
    }
  };

  const toggleDropdown = (name) => {
    setOpenSidebarDropdown(openSidebarDropdown === name ? "" : name);
  };

  // Simulate initial app loading before showing any content (including auth forms)
  useEffect(() => {
    setTimeout(() => {
      setLoading(false);
    }, 1000); // Simulate 1 second app loading
  }, []);

  // Simulate data fetching for MainContent after login
  useEffect(() => {
    if (isLoggedIn) {
      // Simulate data fetching for MainContent after login
      setTimeout(() => {
        setTotalUsers(1234);
        setNewOrders(56);
        setRevenue(12345);
        setRecentActivity([
            { id: 1, text: 'User John Doe logged in.', time: '2 mins ago' },
            { id: 2, text: 'New product \'Laptop Pro\' added.', time: '1 hour ago' },
            { id: 3, text: 'Order #1001 processed.', time: '3 hours ago' },
            { id: 4, text: 'Report generated for Q3.', time: '5 hours ago' },
            { id: 5, text: 'User Jane Smith updated profile.', time: 'yesterday' },
        ]);
      }, 500); // Small delay to populate dashboard data
    }
  }, [isLoggedIn]);


  // Inject custom styles into the document head
  useEffect(() => {
    const styleTag = document.createElement('style');
    styleTag.textContent = customStyles;
    document.head.appendChild(styleTag);

    // Clean up the style tag on component unmount
    return () => {
      document.head.removeChild(styleTag);
    };
  }, []); // Empty dependency array means this runs once on mount

  const handleLoginSuccess = () => {
    setIsLoggedIn(true);
  };

  const handleRegisterSuccess = () => {
    // After successful registration, usually redirect to login or directly log in
    setIsLoggedIn(true);
    setCurrentAuthView('login'); // Go to login after successful registration
  };

  const handleLogout = () => {
    setIsLoggedIn(false);
    setCurrentAuthView('login');
    // Clear any user data or tokens here in a real app
  };

  // Render logic based on loading and authentication state
  if (loading) {
    return (
      <div className="d_auth-container">
        <div className="spinner-border d_spinner" role="status">
          <span className="visually-hidden">Loading App...</span>
        </div>
      </div>
    );
  }

  if (!isLoggedIn) {
    return (
      <>
        {/* Navbar for auth screens - only show brand and maybe a simple title */}
        <Navbar expand="lg" variant="dark" fixed="top" className="d_navbar">
          <Container fluid>
            <Navbar.Brand href="#" className="d_navbar-brand">Admin Panel</Navbar.Brand>
          </Container>
        </Navbar>
        {currentAuthView === 'login' ? (
          <LoginScreen
            onLoginSuccess={handleLoginSuccess}
            onSwitchToRegister={() => setCurrentAuthView('register')}
          />
        ) : (
          <RegisterScreen
            onRegisterSuccess={handleRegisterSuccess}
            onSwitchToLogin={() => setCurrentAuthView('login')}
          />
        )}
      </>
    );
  }

  return (
    <div className="d-flex flex-column min-vh-100">
      {/* Top Navbar */}
      <Navbar expand="lg" variant="dark" fixed="top" className="d_navbar">
        <Container fluid>
          {/* Toggle button for off-canvas sidebar on small screens */}
          <Button variant="dark" className="d-lg-none me-2" onClick={toggleSidebar}>
            <IconBars style={{ color: 'white' }} /> {/* React Icon */}
          </Button>
          <Navbar.Brand href="#" className="d_navbar-brand">Cab Admin</Navbar.Brand>

          <Nav className="ms-auto">
            <Dropdown align="end"> {/* Use align="end" to align dropdown to the right */}
              <Dropdown.Toggle as={Nav.Link} className="d_navbar_dropdown_toggle d_nav-link">
                <IconUserCircle className="me-2" />Admin {/* React Icon */}
              </Dropdown.Toggle>
              <Dropdown.Menu className="d_navbar_dropdown_menu">
                <Dropdown.Item href="#" className="d_dropdown-item"><IconUser className="me-2" />Profile</Dropdown.Item> {/* React Icon */}
                <Dropdown.Item href="#" className="d_dropdown-item"><IconCog className="me-2" />Settings</Dropdown.Item> {/* React Icon */}
                <Dropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <Dropdown.Item href="#" className="d_dropdown-item" onClick={handleLogout}><IconSignOutAlt className="me-2" />Logout</Dropdown.Item> {/* React Icon */}
              </Dropdown.Menu>
            </Dropdown>
          </Nav>
        </Container>
      </Navbar>

      {/* Main layout container */}
      <div className="d-flex flex-grow-1" style={{ paddingTop: '60px' }}> {/* Space for fixed navbar */}
        {/* Offcanvas Sidebar for mobile/tablet */}
        <Offcanvas show={showSidebar} onHide={toggleSidebar} responsive="lg" placement="start">
          <Offcanvas.Header closeButton closeVariant="white"> {/* Added closeVariant for white 'X' */}
            <Offcanvas.Title>Menu</Offcanvas.Title> {/* Changed to Menu */}
          </Offcanvas.Header>
          <Offcanvas.Body className="p-0">
            {/* The d_sidebar_fixed styles are applied here for consistent styling
                and to manage the scrollbar when sidebar content is long. */}
            <div className="d_sidebar_fixed d-flex flex-column" style={{ minHeight: '100vh', paddingTop: '0px', position: 'relative' }}>
              <a href="#" className="d_sidebar_link active" onClick={handleLinkClick}>
                <IconTachometerAlt className="me-2" />Dashboard {/* React Icon */}
              </a>

              <div className="d_sidebar_dropdown">
                <button onClick={() => toggleDropdown("drivers")} className="d_sidebar_btn">
                  <IconTaxi className="me-2" />Drivers <IconChevronDown className="ms-auto" /> {/* React Icons */}
                </button>
                <div className={`d_sidebar_dropdown_content ${openSidebarDropdown === "drivers" ? "show" : ""}`}>
                  <a href="#" onClick={handleLinkClick}><IconUsers className="me-2" />All Drivers</a> {/* React Icon */}
                  <a href="#" onClick={handleLinkClick}><IconUserPlus className="me-2" />Add Driver</a> {/* React Icon */}
                </div>
              </div>

              <div className="d_sidebar_dropdown">
                <button onClick={() => toggleDropdown("bookings")} className="d_sidebar_btn">
                  <IconBook className="me-2" />Bookings <IconChevronDown className="ms-auto" /> {/* React Icons */}
                </button>
                <div className={`d_sidebar_dropdown_content ${openSidebarDropdown === "bookings" ? "show" : ""}`}>
                  <a href="#" onClick={handleLinkClick}><IconClipboardList className="me-2" />All Bookings</a> {/* React Icon */}
                  <a href="#" onClick={handleLinkClick}><IconHourglassHalf className="me-2" />Pending Bookings</a> {/* React Icon */}
                </div>
              </div>

              <a href="#" className="d_sidebar_link" onClick={handleLinkClick}>
                <IconUsersCog className="me-2" />Customers {/* React Icon */}
              </a>
              <a href="#" className="d_sidebar_link" onClick={handleLinkClick}>
                <IconChartBar className="me-2" />Reports {/* React Icon */}
              </a>

            </div>
          </Offcanvas.Body>
        </Offcanvas>

        {/* Static Sidebar for large screens */}
        <div className="d-none d-lg-block d_sidebar_fixed">
          <a href="#" className="d_sidebar_link active">
            <IconTachometerAlt className="me-2" />Dashboard {/* React Icon */}
          </a>

          <div className="d_sidebar_dropdown">
            <button onClick={() => toggleDropdown("drivers-lg")} className="d_sidebar_btn">
              <IconTaxi className="me-2" />Drivers <IconChevronDown className="ms-auto" /> {/* React Icons */}
            </button>
            <div className={`d_sidebar_dropdown_content ${openSidebarDropdown === "drivers-lg" ? "show" : ""}`}>
              <a href="#"><IconUsers className="me-2" />All Drivers</a> {/* React Icon */}
              <a href="#"><IconUserPlus className="me-2" />Add Driver</a> {/* React Icon */}
            </div>
          </div>

          <div className="d_sidebar_dropdown">
            <button onClick={() => toggleDropdown("bookings-lg")} className="d_sidebar_btn">
              <IconBook className="me-2" />Bookings <IconChevronDown className="ms-auto" /> {/* React Icons */}
            </button>
            <div className={`d_sidebar_dropdown_content ${openSidebarDropdown === "bookings-lg" ? "show" : ""}`}>
              <a href="#"><IconClipboardList className="me-2" />All Bookings</a> {/* React Icon */}
              <a href="#"><IconHourglassHalf className="me-2" />Pending Bookings</a> {/* React Icon */}
            </div>
          </div>

          <a href="#" className="d_sidebar_link">
            <IconUsersCog className="me-2" />Customers {/* React Icon */}
          </a>
          <a href="#" className="d_sidebar_link">
            <IconChartBar className="me-2" />Reports {/* React Icon */}
          </a>

          {/* User dropdown at the bottom of the sidebar */}
          <div className="mt-auto dropdown" style={{ width: 'calc(100% - 1rem)' }}>
            <Dropdown>
              <Dropdown.Toggle as="a" className="d-flex align-items-center text-white text-decoration-none dropdown-toggle d_sidebar_link" style={{ cursor: 'pointer' }}>
                <img src="https://placehold.co/32x32/0f6e55/ffffff?text=U" alt="User avatar" width="32" height="32" className="rounded-circle me-2" />
                <strong>User Name</strong>
              </Dropdown.Toggle>
              <Dropdown.Menu variant="dark" className="d_dropdown-menu" style={{ position: 'absolute', bottom: '100%', left: '0', width: '100%' }}>
                <Dropdown.Item href="#" className="d_dropdown-item"><IconFolderPlus className="me-2" />New project...</Dropdown.Item> {/* React Icon */}
                <Dropdown.Item href="#" className="d_dropdown-item"><IconCog className="me-2" />Settings</Dropdown.Item> {/* React Icon */}
                <Dropdown.Item href="#" className="d_dropdown-item"><IconUserCircle className="me-2" />Profile</Dropdown.Item> {/* React Icon */}
                <Dropdown.Divider style={{ borderColor: 'rgba(255,255,255,0.2)' }} />
                <Dropdown.Item href="#" className="d_dropdown-item"><IconSignOutAlt className="me-2" />Sign out</Dropdown.Item> {/* React Icon */}
              </Dropdown.Menu>
            </Dropdown>
          </div>
        </div>

        {/* Main Content Area */}
        <div className="d_main_content">
            <h2 className="mb-4" style={{ color: 'var(--d_primary-color)' }}>Welcome to Cab Booking Admin Panel!</h2>
            <p>
              This is your main dashboard content. Here you can find various metrics and recent activities
              related to your cab booking system.
            </p>
            <div className="row g-4 mt-4">
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 rounded-3 shadow-sm" style={{ borderColor: 'var(--d_primary-color)' }}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--d_dark-color)' }}>Total Users</h5>
                    <p className="card-text fs-2 fw-bold" style={{ color: 'var(--d_primary-color)' }}>{totalUsers.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 rounded-3 shadow-sm" style={{ borderColor: 'var(--d_primary-color)' }}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--d_dark-color)' }}>New Orders</h5>
                    <p className="card-text fs-2 fw-bold" style={{ color: 'var(--d_primary-color)' }}>{newOrders}</p>
                  </div>
                </div>
              </div>
              <div className="col-md-6 col-lg-4">
                <div className="card h-100 rounded-3 shadow-sm" style={{ borderColor: 'var(--d_primary-color)' }}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--d_dark-color)' }}>Revenue</h5>
                    <p className="card-text fs-2 fw-bold" style={{ color: 'var(--d_primary-color)' }}>${revenue.toLocaleString()}</p>
                  </div>
                </div>
              </div>
              <div className="col-12">
                <div className="card h-100 rounded-3 shadow-sm" style={{ borderColor: 'var(--d_primary-color)' }}>
                  <div className="card-body">
                    <h5 className="card-title" style={{ color: 'var(--d_dark-color)' }}>Recent Activity</h5>
                    <ul className="list-group list-group-flush">
                      {recentActivity.map(activity => (
                        <li key={activity.id} className="list-group-item d_dropdown-item" style={{ backgroundColor: '#fff' }}>
                          {activity.text} <span className="float-end text-muted">{activity.time}</span>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
    </div>
  );
}

export default AdminLayout;
