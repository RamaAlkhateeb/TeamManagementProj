import React, { useEffect, useState } from "react";
import { FaEdit } from "react-icons/fa";
import { toast, ToastContainer } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

export default function UserProfilePage() {
  const [isEditing, setIsEditing] = useState(false);
  const [profileImage, setProfileImage] = useState("https://via.placeholder.com/150");
  const [fullName, setFullName] = useState("");
  const [nationalId, setNationalId] = useState("");
  const [birthDate, setBirthDate] = useState("");
  const [hireDate, setHireDate] = useState("");
  const [phone, setPhone] = useState("");
  const [email, setEmail] = useState("");
  const [address, setAddress] = useState("");
  const [roles, setRoles] = useState([]);
  const [departments, setDepartments] = useState([]);
  const [userData, setUserData] = useState(null);

  const getUsernameFromToken = () => {
    const token = localStorage.getItem("token");
    if (!token) return null;
    try {
      const payloadBase64 = token.split(".")[1];
      const decodedJson = atob(payloadBase64);
      const payload = JSON.parse(decodedJson);
      return (
        payload["http://schemas.xmlsoap.org/ws/2005/05/identity/claims/name"] ||
        null
      );
    } catch {
      return null;
    }
  };

  useEffect(() => {
    const username = getUsernameFromToken();
    if (!username) return;

    fetch("https://ramialzend.bsite.net/api/Employees", {
      headers: {
        Authorization: `Bearer ${localStorage.getItem("token")}`,
      },
    })
      .then((res) => res.json())
      .then((data) => {
        if (!data.isSuccess) {
          console.error("API returned error:", data.message);
          return;
        }

        const employee = data.data.find((emp) => {
          if (!emp.fullName) return false;
          const firstName = emp.fullName.split(" ")[0].toLowerCase();
          return firstName === username.toLowerCase();
        });

        if (employee) {
          setUserData(employee);
          setFullName(employee.fullName || "");
          setNationalId(employee.nationalIdentificationNumber || "");
          setBirthDate(employee.birthDate?.slice(0, 10) || "");
          setHireDate(employee.hireDate?.slice(0, 10) || "");
          setPhone(employee.phone || "");
          setEmail(employee.email || "");
          setAddress(employee.address || "");
          setRoles(employee.roles || []);
          setDepartments(employee.departments || []);
          setProfileImage(employee.imagePath || "https://via.placeholder.com/150");
        } else {
          console.error("Employee not found for username:", username);
        }
      })
      .catch((err) => console.error("Fetch error:", err));
  }, []);

  const handleSave = () => {
    // هنا ممكن تضيف طلب إرسال البيانات للسيرفر
    const payload = {
      fullName,
      nationalIdentificationNumber: nationalId,
      birthDate,
      hireDate,
      phone,
      email,
      address,
      imagePath: profileImage,
      roles,
      departments,
    };
    console.log("Submitting:", payload);
    toast.success("Changes saved successfully!");
    setIsEditing(false);
  };

  return (
    <div className="bg-gray-50 min-h-screen flex justify-center items-center px-4 py-10">
      <ToastContainer />
      <div
        className="w-full max-w-3xl border-4 rounded-3xl p-8 shadow-lg"
        style={{ borderImage: "linear-gradient(to right, #002855, #0353A4) 1" }}
      >
        <div className="flex flex-col items-center">
          <img
            src={profileImage || "https://via.placeholder.com/150"}
            alt="User"
            className="w-44 h-44 rounded-full object-cover border-4 border-blue-400 shadow-md"
          />
          <p className="mt-4 font-bold text-2xl text-gray-800">{fullName || getUsernameFromToken()}</p>

          {!isEditing && (
            <button
              onClick={() => setIsEditing(true)}
              className="mt-4 text-blue-700 hover:text-blue-900 text-2xl"
              title="Edit profile"
            >
              <FaEdit />
            </button>
          )}
        </div>

        {userData && (
          <div className="mt-8 space-y-6">
            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Full Name
              </label>
              <input
                type="text"
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                disabled={!isEditing}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                National ID
              </label>
              <input
                type="text"
                value={nationalId}
                onChange={(e) => setNationalId(e.target.value)}
                disabled={!isEditing}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Birth Date
              </label>
              <input
                type="date"
                value={birthDate}
                onChange={(e) => setBirthDate(e.target.value)}
                disabled={!isEditing}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Hire Date
              </label>
              <input
                type="date"
                value={hireDate}
                onChange={(e) => setHireDate(e.target.value)}
                disabled={!isEditing}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Phone
              </label>
              <input
                type="text"
                value={phone}
                onChange={(e) => setPhone(e.target.value)}
                disabled={!isEditing}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Email
              </label>
              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                disabled={!isEditing}
                className="mt-1 w-full p-2 border rounded-lg focus:ring-2 focus:ring-blue-300"
              />
            </div>
            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Roles
              </label>
              <input
                type="text"
                value={roles.join(", ")}
                disabled
                className="mt-1 w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            <div>
              <label className="text-sm text-gray-700 font-semibold flex items-center gap-2">
                Departments
              </label>
              <input
                type="text"
                value={departments.join(", ")}
                disabled
                className="mt-1 w-full p-2 border rounded-lg bg-gray-100 cursor-not-allowed"
              />
            </div>

            {isEditing && (
              <div className="mt-6 flex justify-center">
                <button
                  onClick={handleSave}
                  className="px-6 py-2 bg-blue-700 text-white rounded-lg hover:bg-blue-800 transition"
                >
                  Save Changes
                </button>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
