import React, { useEffect, useState, useContext, useRef } from "react";
import "../styles/profile.scss";
import { AuthContext } from "../context/AuthContext";
import { updateProfile } from "../services/api";
import { toast } from "react-toastify";
import { Link } from "react-router-dom";


function ProfileSettings() {

const { user, setUser } = useContext(AuthContext);

const defaultAvatar = "/default-avatar.png";

const fileInputRef = useRef(null);

const [selectedImage, setSelectedImage] = useState(null);
const [preview, setPreview] = useState(defaultAvatar);
const [loading, setLoading] = useState(false);

const [profile, setProfile] = useState({
name: "",
email: "",
phone: "",
role: "",
currentPassword: "",
newPassword: "",
confirmPassword: ""
});

useEffect(() => {


if (user) {

  setProfile({
    name: user.name || "",
    email: user.email || "",
    phone: user.phone || "",
    role: user.role || "",
    currentPassword: "",
    newPassword: "",
    confirmPassword: ""
  });

  setPreview(user.profilePicture || defaultAvatar);

}

}, [user]);

const handleImageChange = (e) => {


const file = e.target.files[0];

if (file) {

  setSelectedImage(file);

  const imageUrl = URL.createObjectURL(file);

  setPreview(imageUrl);

}

};

const handleRemoveImage = () => {


setSelectedImage(null);

setPreview(defaultAvatar);

if (fileInputRef.current) {
  fileInputRef.current.value = "";
}


};

const handleChange = (e) => {


const { name, value } = e.target;

setProfile((prev) => ({
  ...prev,
  [name]: value
}));


};

// const handleSubmit = async (e) => {


// e.preventDefault();

// if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
//   alert("Passwords do not match");
//   return;
// }

// try {

//   const formData = new FormData();

//   formData.append("name", profile.name);

//   if (profile.currentPassword) {
//     formData.append("currentPassword", profile.currentPassword);
//   }

//   if (profile.newPassword) {
//     formData.append("newPassword", profile.newPassword);
//   }

//   if (selectedImage) {
//     formData.append("profilePicture", selectedImage);
//   }

//   const res = await fetch("/api/user/update-profile", {
//     method: "PUT",
//     body: formData,
//     credentials: "include"
//   });

//   const data = await res.json();

//   if (data.user) {
//     setUser(data.user);
//   }

//   alert("Profile updated successfully");

// } catch (error) {
//   console.error(error);
// }


// };


const handleSubmit = async (e) => {

  e.preventDefault();

  if (profile.newPassword && profile.newPassword !== profile.confirmPassword) {
   toast.error("Passwords do not match");
    return;
  }

  try {
       setLoading(true);

    const formData = new FormData();

    formData.append("name", profile.name);

    if (profile.currentPassword) {
      formData.append("currentPassword", profile.currentPassword);
    }

    if (profile.newPassword) {
      formData.append("newPassword", profile.newPassword);
    }

    if (selectedImage) {
      formData.append("profilePicture", selectedImage);
    }

    // 👇 API call
    const data = await updateProfile(formData);

    // 🔴 check backend message
    if (data.user) {

      setUser(data.user);
      toast.success("Profile updated successfully");

    } else {

      toast.error(data.message || "Profile update failed");

    }


  } catch (error) {
  toast.error("Server error");
    console.log(error);

  }
  finally {

    setLoading(false);  

  }

};
return (


<div className="profile-container">

  <h2>Profile Settings</h2>

  <p className="subtitle">
    Manage your account settings and profile information
  </p>

  <form onSubmit={handleSubmit}>

    {/* Profile Picture */}

    <div className="card">

      <h3>Profile Picture</h3>

      <div className="profile-picture">

        <img
          src={preview}
          alt="profile"
          style={{
            width: "120px",
            height: "120px",
            borderRadius: "50%",
            objectFit: "cover",
            marginBottom: "10px"
          }}
        />

        <input
          type="file"
          accept="image/*"
          onChange={handleImageChange}
          ref={fileInputRef}
        />

        <div className="buttons">

          <button
            type="button"
            className="remove"
            onClick={handleRemoveImage}
          >
            Remove
          </button>

        </div>

      </div>

    </div>

    {/* Personal Information */}

    <div className="card">

      <h3>Personal Information</h3>

      <div className="grid">

        <div>

          <label>Full Name</label>

          <input
            name="name"
            value={profile.name}
            onChange={handleChange}
          />

        </div>

        <div>

          <label>Email Address</label>

          <input
            value={profile.email}
            disabled
          />

        </div>

        <div>

          <label>Phone Number</label>

          <input
            value={profile.phone}
            disabled
          />

        </div>

        <div>

          <label>Role</label>

          <input
            value={profile.role}
            disabled
          />

        </div>

      </div>

    </div>

    {/* Change Password */}

    <div className="card">

      <h3>Change Password</h3>

      <label>Current Password</label>

      <input
        type="password"
        name="currentPassword"
        value={profile.currentPassword}
        onChange={handleChange}
      />

      <div className="grid">

        <div>

          <label>New Password</label>

          <input
            type="password"
            name="newPassword"
            value={profile.newPassword}
            onChange={handleChange}
          />

        </div>

        <div>

          <label>Confirm Password</label>

          <input
            type="password"
            name="confirmPassword"
            value={profile.confirmPassword}
            onChange={handleChange}
          />

        </div>

      </div>

      <p className="password-note">
        Password must be at least 8 characters long and include uppercase,
        lowercase, and numbers.
      </p>

    </div>

    <div className="actions">

      <button
        type="button"
        className="cancel"

      >
        <Link to="/dashboard">
          Cancel
        </Link>
      </button>

      <button
        type="submit"
        className="save"
      >
         {loading ? "Saving..." : "Save Changes"}
      </button>

    </div>

  </form>

</div>


);

}

export default ProfileSettings;
