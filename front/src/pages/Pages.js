import React, { useEffect, useRef, useState } from 'react';
import '../style/x_app.css';
import profileImage from "../image/user_g.png"
import { IoClose } from 'react-icons/io5';

export default function Pages() {
	const [editMode, setEditMode] = useState(false);
	const fileInputRef = useRef(null);

	const [profile, setProfile] = useState({
		fullName: "Olivia Smith",
		email: "olivia.smith@gmail.com",
		password: "********",
		phoneCode: "+61",
		phoneNumber: "123 4567 890",
		profileImage: profileImage,
		bankDetails: {
			accountNumber: "1234 5678 9876 5432", 
			bsbCode: "062-000",
			bankName: "Commonwealth Bank of Australia",
			branchName: "Sydney CBD Branch",
		  },
	});

	const handleChange = (e) => {
		const { name, value } = e.target;

		if (
			name === "accountNumber" ||
			name === "bsbCode" ||
			name === "bankName" ||
			name === "branchName"
		) {
			setProfile((prev) => ({
				...prev,
				bankDetails: {
					...prev.bankDetails,
					[name]: value,
				},
			}));
		} else {
			setProfile((prev) => ({
				...prev,
				[name]: value,
			}));
		}
	};
	// Handle Image Upload
	const handleImageChange = (e) => {
		const file = e.target.files[0];
		if (file) {
			const imageUrl = URL.createObjectURL(file);
			setProfile({ ...profile, profileImage: imageUrl });
		}
	};

	const handleSave = () => {
		console.log("Updated Profile:", profile);
		setEditMode(false);
	};
	// const [profile, setProfile] = useState({
	// 	name: "John Doe",
	// 	email: "john.doe@example.com",
	// 	password: "********",
	// 	phone: "1234567890",
	// 	profileImage: "https://via.placeholder.com/150",
	// 	bankDetails: {
	// 		accountHolderName: "John Doe",
	// accountNumber: "1234 5678 9876 5432",
	// ifscCode: "HDFC0001234",
	// bankName: "HDFC Bank",
	// branchName: "Mumbai Branch",
	// 	},
	// });
	return (
		<div className="x_profile_wrapper">
			{/* Profile Header */}
			<div className="x_profile_header">
				<div className="x_img_wrapper">
					<img
						src={profile.profileImage}
						alt=""
						className="x_profile_img"
					/>
					{/* Camera Icon */}
					<div
						className="x_camera_icon"
						onClick={() => {
							setEditMode(true);
							fileInputRef.current.click(); // open file dialog
						}}
					>
						📷
					</div>
					<input
						type="file"
						accept="image/*"
						ref={fileInputRef}
						style={{ display: "none" }}
						onChange={handleImageChange}
					/>
				</div>
			</div>

			{/* Contact Details */}
			<div className="x_card">
				<h3 className="x_section_title">Contact Details</h3>

				<div className="x_grid">
					<div className="x_form_group">
						<label>Full Name</label>
						<input
							type="text"
							name="fullName"
							value={profile.fullName}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>

					<div className="x_form_group">
						<label>Email</label>
						<input
							type="text"
							name="email"
							value={profile.email}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>
				</div>

				<div className="x_grid">
					<div className="x_form_group x_phone_group">
						<label>Phone Number</label>
						<div className="x_phone_wrapper">
							<select
								name="phoneCode"
								value={profile.phoneCode}
								onChange={handleChange}
								disabled={!editMode}
							>
								<option value="+880">AU +61</option>
								<option value="+1">🇺🇸 +1</option>
							</select>
							<input
								type="text"
								name="phoneNumber"
								value={profile.phoneNumber}
								onChange={handleChange}
								disabled={!editMode}
							/>
						</div>
					</div>

					<div className="x_form_group">
						<label>Password</label>
						<input
							type="text"
							name="password"
							value={profile.password}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>
				</div>

				<h3 className="x_section_title">Bank Details</h3>

				<div className="x_grid">
					<div className="x_form_group">
						<label>Account Number</label>
						<input
							type="text"
							name="accountNumber"
							value={profile.bankDetails.accountNumber}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>

					<div className="x_form_group">
						<label>BSB Code</label>
						<input
							type="text"
							name="bsbCode"
							value={profile.bankDetails.bsbCode}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>
				</div>

				<div className="x_grid">
					<div className="x_form_group">
						<label>Bank Name</label>
						<input
							type="text"
							name="bankName"
							value={profile.bankDetails.bankName}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>

					<div className="x_form_group">
						<label>Branch Name</label>
						<input
							type="text"
							name="branchName"
							value={profile.bankDetails.branchName}
							onChange={handleChange}
							disabled={!editMode}
						/>
					</div>
				</div>

				{editMode && (
					<button className="x_btn" onClick={handleSave}>
						Save Changes
					</button>
				)}
			</div>
		</div>
	);
}