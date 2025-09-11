import React, { useState, useRef, useEffect } from "react";
import { FaChevronDown } from "react-icons/fa";
import "./CustomDropdown.css"; // styling niche apu chu

export default function CustomDropdown({ options, value, onChange, placeholder, disabled }) {
  const [open, setOpen] = useState(false);
  const dropdownRef = useRef();

  // click outside close
  useEffect(() => {
    const handleClickOutside = (e) => {
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const handleSelect = (val) => {
    onChange(val);
    setOpen(false);
  };

  return (
    <div
      className={`custom-dropdown ${disabled ? "disabled" : ""}`}
      ref={dropdownRef}
    >
      <div className="dropdown-header d-flex justify-content-between" onClick={() => !disabled && setOpen(!open)}>
        <div><span>{value || placeholder}</span></div>
        <div><FaChevronDown className={`icon ${open ? "rotate" : ""}`} /></div>
      </div>
      {open && (
        <ul className="dropdown-list p-0">
          {options.map((opt, index) => (
            <li
              key={index}
              className={`dropdown-item ${value === opt ? "selected" : ""}`}
              onClick={() => handleSelect(opt)}
            >
              {opt}
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
