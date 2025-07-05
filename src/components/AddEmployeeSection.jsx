import React, { useEffect, useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  User,
  KeyRound,
  Mail,
  Phone,
  MapPin,
  Calendar,
  CreditCard,
  ImageIcon,
  Users,
} from "lucide-react";
import axios from "axios";
import qs from "qs";

const API_BASE = "https://ramialzend.bsite.net";
const REGISTER_ENDPOINT = `${API_BASE}/User/register`;
const DEPARTMENTS_ENDPOINT = `${API_BASE}/Departments`;

export default function RegisterUser({ onRegister, showSnack, handleClose }) {
  const [departments, setDepartments] = useState([]);
  const [saving, setSaving] = useState(false);
  const [formData, setFormData] = useState({
    userName: "",
    password: "",
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    birthDate: "",
    hireDate: "",
    nationalIdentificationNumber: "",
    imagePath: "",
    departmentId: "",
  });

  useEffect(() => {
    const fetchDepartments = async () => {
      try {
        const res = await axios.get(DEPARTMENTS_ENDPOINT);
        setDepartments(res.data.data || []);
      } catch (error) {
        console.error("Error loading departments:", error);
        showSnack("Failed to load departments", "error");
      }
    };
    fetchDepartments();
  }, [showSnack]);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const {
      userName,
      password,
      firstName,
      lastName,
      email,
      phone,
      address,
      birthDate,
      hireDate,
      nationalIdentificationNumber,
      imagePath,
      departmentId,
    } = formData;

    if (!userName || !password || !firstName || !lastName || !departmentId) {
      showSnack("Please fill all required fields", "warning");
      return;
    }

    const payload = {
      UserName: userName,
      Password: password,
      FirstName: firstName,
      LastName: lastName,
      Email: email,
      Phone: phone,
      Address: address,
      BirthDate: birthDate,
      HireDate: hireDate,
      NationalIdentificationNumber: nationalIdentificationNumber,
      ImagePath: imagePath,
      DepartmentIds: departmentId,
    };

    try {
      setSaving(true);
      const token = localStorage.getItem("token");
      const headers = {
        Authorization: `Bearer ${token}`,
        "Content-Type": "application/x-www-form-urlencoded",
      };
      await axios.post(REGISTER_ENDPOINT, qs.stringify(payload), { headers });
      showSnack("User registered successfully", "success");
      onRegister();
      handleClose();
    } catch (error) {
      console.error("Registration failed:", error.response?.data || error.message);
      showSnack("Failed to register user", "error");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open onOpenChange={handleClose}>
      <DialogContent className="border-2 border-navy-900 rounded-4xl max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-white shadow-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6 text-center">
            Register New User
          </DialogTitle>
        </DialogHeader>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {/* Username */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <User size={18} /> Username
            </label>
            <Input name="userName" value={formData.userName} onChange={handleChange} placeholder="Username" />
          </div>

          {/* Password */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <KeyRound size={18} /> Password
            </label>
            <Input name="password" type="password" value={formData.password} onChange={handleChange} placeholder="Password" />
          </div>

          {/* First Name */}
          <div>
            <label className="text-navy-700 font-semibold mb-1 text-sm uppercase">First Name</label>
            <Input name="firstName" value={formData.firstName} onChange={handleChange} placeholder="firstName" />
          </div>

          {/* Last Name */}
          <div>
            <label className="text-navy-700 font-semibold mb-1 text-sm uppercase">Last Name</label>
            <Input name="lastName" value={formData.lastName} onChange={handleChange} placeholder="lastName" />
          </div>

          {/* Email */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <Mail size={18} /> Email
            </label>
            <Input name="email" type="email" value={formData.email} onChange={handleChange} placeholder="email" />
          </div>

          {/* Phone */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <Phone size={18} /> Phone
            </label>
            <Input name="phone" value={formData.phone} onChange={handleChange} placeholder="phone" />
          </div>

          {/* Address */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <MapPin size={18} /> Address
            </label>
            <Input name="address" value={formData.address} onChange={handleChange} placeholder="address" />
          </div>

          {/* Birth Date */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <Calendar size={18} /> Birth Date
            </label>
            <Input name="birthDate" type="date" value={formData.birthDate} onChange={handleChange}  />
          </div>

          {/* Hire Date */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <Calendar size={18} /> Hire Date
            </label>
            <Input name="hireDate" type="date" value={formData.hireDate} onChange={handleChange} />
          </div>

          {/* National ID */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <CreditCard size={18} /> National ID Number
            </label>
            <Input name="nationalIdentificationNumber" value={formData.nationalIdentificationNumber} onChange={handleChange} placeholder="nationalIdentificationNumber" />
          </div>

          {/* Image URL */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <ImageIcon size={18} /> Image URL (optional)
            </label>
            <Input name="imagePath" value={formData.imagePath} onChange={handleChange} placeholder="imagePath" />
          </div>

          {/* Department */}
          <div className="md:col-span-2">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 text-sm uppercase">
              <Users size={18} /> Department
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border border-navy-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={dep.id}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button
            onClick={handleSubmit}
            disabled={saving}
            className="bg-navy-700 text-white hover:bg-navy-800 px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            {saving ? "Saving..." : "Register"}
          </Button>
          <Button
            variant="ghost"
            onClick={handleClose}
            className="text-navy-700 hover:bg-navy-100 px-6 py-3 rounded-lg transition"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
