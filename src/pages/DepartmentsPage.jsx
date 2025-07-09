import React, { useEffect, useState } from "react";
import axios from "axios";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Button } from "../components/ui/button";
import { Card, CardContent } from "../components/ui/card";
import { Input } from "../components/ui/input";
import { Plus, X } from "lucide-react";
import { toast } from "react-hot-toast";
import { Trash } from "lucide-react";
import { User, Mail, Phone, Users } from "lucide-react";

export default function DepartmentsPage() {
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const [viewDialogOpen, setViewDialogOpen] = useState(false);
  const [editDialogOpen, setEditDialogOpen] = useState(false);
  const [addDialogOpen, setAddDialogOpen] = useState(false);
  const [confirmDeleteDialogOpen, setConfirmDeleteDialogOpen] = useState(false);
  const [departmentToDelete, setDepartmentToDelete] = useState(null);


  const [selectedDepartment, setSelectedDepartment] = useState(null);

  // Edit form data
  const [formData, setFormData] = useState({
    id: null,
    name: "",
    email: "",
    phoneNumber: "",
    teamLeaderId: null,
    enrolledEmployeeIds: [],
  });
  const [originalFormData, setOriginalFormData] = useState(null);

  // Add form data
  const [addFormData, setAddFormData] = useState({
    name: "",
    email: "",
    phoneNumber: "",
    teamLeaderId: null,
  });
  const [addEmployeeSelectors, setAddEmployeeSelectors] = useState([null]);

  useEffect(() => {
    fetchDepartments();
    fetchEmployees();
  }, []);

  const fetchDepartments = () => {
    const token = localStorage.getItem("token");
    setLoading(true);
    axios
      .get("https://ramialzend.bsite.net/Departments", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.isSuccess) {
          const transformed = res.data.data.map((dept) => ({
            id: dept.id,
            name: dept.name,
            email: dept.email,
            phoneNumber: dept.phoneNumber,
            teamLeaderId: dept.teamLeaderId,
            teamLeaderName: dept.teamLeaderName,
            employeesNames: Object.values(dept.employeesNamesAsDictionary || {}),
            enrolledEmployeeIds: dept.enrolledEmployeeIds || [],
          }));
          setDepartments(transformed);
          setError("");
        } else {
          setError(res.data.message || "Unknown API error");
        }
      })
      .catch((err) => {
        console.error("Authorization or network error:", err);
        setError(err.message);
      })
      .finally(() => setLoading(false));
  };

  const fetchEmployees = () => {
    const token = localStorage.getItem("token");
    axios
      .get("https://ramialzend.bsite.net/api/Employees", {
        headers: { Authorization: `Bearer ${token}` },
      })
      .then((res) => {
        if (res.data.isSuccess) {
          setEmployees(res.data.data);
        }
      })
      .catch((err) => console.error("Employee fetch error:", err));
  };

  // Edit handlers
  const handleEdit = (dept) => {
    const data = {
      id: dept.id,
      name: dept.name || "",
      email: dept.email || "",
      phoneNumber: dept.phoneNumber || "",
      teamLeaderId: dept.teamLeaderId || null,
      enrolledEmployeeIds: dept.enrolledEmployeeIds || [],
    };
    setFormData(data);
    setOriginalFormData(data);
    setEditDialogOpen(true);
  };

  const handleFormChange = (e) => {
    const { name, value, type, checked } = e.target;

    if (name === "enrolledEmployeeIds") {
      let newArray = [...formData.enrolledEmployeeIds];
      const val = parseInt(value);
      if (checked) {
        if (!newArray.includes(val)) newArray.push(val);
      } else {
        newArray = newArray.filter((id) => id !== val);
      }
      setFormData((prev) => ({ ...prev, enrolledEmployeeIds: newArray }));
    } else if (type === "number") {
      setFormData((prev) => ({ ...prev, [name]: Number(value) }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: value }));
    }
  };

  const getChangedFields = (original, updated) => {
    const changed = {};
    for (const key in updated) {
      if (key === "enrolledEmployeeIds") {
        const origArr = original[key] || [];
        const updArr = updated[key] || [];
        if (
          origArr.length !== updArr.length ||
          origArr.some((v, i) => v !== updArr[i])
        ) {
          changed[key] = updated[key];
        }
      } else {
        if (original[key] !== updated[key]) {
          changed[key] = updated[key];
        }
      }
    }
    return changed;
  };

  const handleUpdate = async () => {
    const token = localStorage.getItem("token");

    if (!formData.name) {
      toast.error("Please enter department name");
      return;
    }

    if (!originalFormData) {
      toast.error("Internal error, please try again");
      return;
    }

    const changedFields = getChangedFields(originalFormData, formData);

    if (Object.keys(changedFields).length === 0) {
      toast("No data changed");
      return;
    }

    changedFields.id = formData.id;

    try {
      const res = await axios.put(
        `https://ramialzend.bsite.net/Departments/${formData.id}`,
        changedFields,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );

      if (res.data.isSuccess) {
        toast.success("Department updated successfully");
        setEditDialogOpen(false);
        fetchDepartments();
      } else {
        toast.error(res.data.message || "Update failed");
      }
    } catch (error) {
      console.error("Update error:", error);
      toast.error("Server connection failed");
    }
  };

  // Add handlers
  const handleAddFormChange = (e) => {
    const { name, value } = e.target;
    setAddFormData((prev) => ({ ...prev, [name]: value }));
  };

  const handleAddEmployeeSelectorChange = (index, value) => {
    const newSelectors = [...addEmployeeSelectors];
    newSelectors[index] = value ? Number(value) : null;
    setAddEmployeeSelectors(newSelectors);
  };

  const addAddEmployeeSelector = () => {
    setAddEmployeeSelectors((prev) => [...prev, null]);
  };

  const removeAddEmployeeSelector = (index) => {
    setAddEmployeeSelectors((prev) => prev.filter((_, i) => i !== index));
  };

  const handleAddDepartment = async () => {
    const token = localStorage.getItem("token");

    if (!addFormData.name) {
      toast.error("Please enter department name");
      return;
    }

    const enrolledEmployeeIds = addEmployeeSelectors
      .filter((id) => id !== null)
      .filter((id, idx, arr) => arr.indexOf(id) === idx); 

    const newDept = {
      name: addFormData.name,
      email: addFormData.email,
      phoneNumber: addFormData.phoneNumber,
      teamLeaderId: addFormData.teamLeaderId ? Number(addFormData.teamLeaderId) : null,
      enrolledEmployeeIds,
    };

    try {
      const res = await axios.post(
        "https://ramialzend.bsite.net/Departments/create-department",
        newDept,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
           
          },
        }

      );
    
      if (res.data.isSuccess) {
        toast.success("Department added successfully");
        setAddDialogOpen(false);
        setAddFormData({
          name: "",
          email: "",
          phoneNumber: "",
          teamLeaderId: null,
        });
        setAddEmployeeSelectors([null]);
        fetchDepartments();
      } else {
        console.log("Add response:", res.data);
        toast.error(res.data.message || "Add failed");
      }
    } catch (error) {
      console.error("Add error:", error);
      toast.error("Server connection failed");
    }
  };

  // Delete handler
  const handleDelete = async (departmentId) => {
    setDepartmentToDelete(departmentId);
    setConfirmDeleteDialogOpen(true);
  };
    const confirmDeleteDepartment = async () => {
  if (!departmentToDelete) return;
  const token = localStorage.getItem("token");

  try {
    const res = await axios.delete(
      `https://ramialzend.bsite.net/Departments/${departmentToDelete}`,
      {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      }
    );

    if (res.data.isSuccess) {
      toast.success("Department deleted successfully");
      fetchDepartments();
    } else {
      toast.error(res.data.message || "Delete failed");
    }
  } catch (error) {
    console.error("Delete error:", error);
    toast.error("Server connection failed");
  } finally {
    setConfirmDeleteDialogOpen(false);
    setDepartmentToDelete(null);
  }
};

  return (
    <div className="p-6 bg-gray-100 min-h-screen text-black">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Departments</h1>
        <Button
          onClick={() => setAddDialogOpen(true)}
          className="flex items-center gap-2 bg-blue-700 text-white hover:bg-blue-800"
        >
          <Plus size={18} /> Add Department
        </Button>
      </div>

      {loading ? (
        <p className="text-center text-gray-600">Loading departments...</p>
      ) : error ? (
        <p className="text-center text-red-600">Error: {error}</p>
      ) : (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {departments.map((dept) => (
            <Card className="bg-white border-2 border-blue-900 rounded-2xl shadow-md hover:shadow-lg transition-shadow duration-300 relative">
 
  <button
    onClick={() => handleDelete(dept.id)}
    className="absolute top-2 right-2 text-red-600 hover:text-red-800"
    title="Delete Department"
  >
    <Trash size={20} />
  </button>

  <CardContent className="p-5 space-y-3">
    <h2 className="text-xl font-semibold text-blue-800">{dept.name}</h2>
    <p><strong>Team Leader:</strong> {dept.teamLeaderName || "-"}</p>
    <p><strong>Employees:</strong> {dept.employeesNames.length > 0 ? dept.employeesNames.join(", ") : "-"}</p>

    <div className="flex justify-between">
      <Button
        onClick={() => {
          setSelectedDepartment(dept);
          setViewDialogOpen(true);
        }}
        className="bg-blue-600 hover:bg-blue-700 text-white"
      >
        View
      </Button>

      <Button
        onClick={() => handleEdit(dept)}
        className="bg-green-600 hover:bg-green-700 text-white"
      >
        Edit
      </Button>
    </div>
  </CardContent>
</Card>

          
          ))}
        </div>
      )}
      
{/* Edit Dialog */}
<Dialog open={editDialogOpen} onOpenChange={setEditDialogOpen}>
  <DialogContent className="max-w-md border-2 border-navy-900 rounded-3xl bg-white shadow-lg p-8">
    <DialogHeader>
      <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6 text-center">
        Edit Department
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-6">
      {/* Department Name */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <User size={20} /> Department Name
        </label>
        <Input
          name="name"
          placeholder="Enter department name"
          value={formData.name}
          onChange={handleFormChange}
          className="border border-navy-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <Mail size={20} /> Email
        </label>
        <Input
          name="email"
          placeholder="Enter email"
          value={formData.email}
          onChange={handleFormChange}
          className="border border-navy-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <Phone size={20} /> Phone Number
        </label>
        <Input
          name="phoneNumber"
          placeholder="Enter phone number"
          value={formData.phoneNumber}
          onChange={handleFormChange}
          className="border border-navy-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      {/* Team Leader */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <User size={20} /> Team Leader
        </label>
        <select
          name="teamLeaderId"
          value={formData.teamLeaderId || ""}
          onChange={handleFormChange}
          className="w-full border border-navy-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="">Select Team Leader</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Enrolled Employees */}
      <div className="border border-navy-300 p-4 rounded-xl">
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-3 uppercase tracking-wide text-sm">
          <Users size={20} /> Enrolled Employees
        </label>
        <div className="max-h-40 overflow-y-auto space-y-2 pl-1">
          {employees.map((emp) => (
            <label key={emp.id} className="flex items-center gap-2 text-sm text-gray-800">
              <input
                type="checkbox"
                name="enrolledEmployeeIds"
                value={emp.id}
                checked={formData.enrolledEmployeeIds.includes(emp.id)}
                onChange={handleFormChange}
                className="accent-navy-600 w-4 h-4"
              />
              {emp.fullName}
            </label>
          ))}
        </div>
      </div>
    </div>

    <DialogFooter className="mt-6 flex justify-end gap-4">
      <Button
        onClick={handleUpdate}
        className="bg-navy-700 text-white hover:bg-navy-800 px-8 py-3 rounded-lg shadow-lg transition-colors"
      >
        Save Changes
      </Button>
      <Button
        variant="ghost"
        onClick={() => setEditDialogOpen(false)}
        className="text-navy-700 hover:bg-navy-100 px-6 py-3 rounded-lg transition"
      >
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* Add Dialog */}
<Dialog open={addDialogOpen} onOpenChange={setAddDialogOpen}>
  <DialogContent className="max-w-md border-2 border-navy-900 rounded-3xl bg-white shadow-lg p-8">
    <DialogHeader>
      <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6 text-center">
        Add Department
      </DialogTitle>
    </DialogHeader>

    <div className="space-y-6">
      {/* Department Name */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <User size={20} /> Department Name
        </label>
        <Input
          name="name"
          placeholder="Enter department name"
          value={addFormData.name}
          onChange={handleAddFormChange}
          className="border border-navy-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      {/* Email */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <Mail size={20} /> Email
        </label>
        <Input
          name="email"
          placeholder="Enter email"
          value={addFormData.email}
          onChange={handleAddFormChange}
          className="border border-navy-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      {/* Phone Number */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <Phone size={20} /> Phone Number
        </label>
        <Input
          name="phoneNumber"
          placeholder="Enter phone number"
          value={addFormData.phoneNumber}
          onChange={handleAddFormChange}
          className="border border-navy-700 rounded-lg px-4 py-3 w-full focus:outline-none focus:ring-2 focus:ring-navy-500"
        />
      </div>

      {/* Team Leader */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
          <User size={20} /> Team Leader
        </label>
        <select
          name="teamLeaderId"
          value={addFormData.teamLeaderId || ""}
          onChange={handleAddFormChange}
          className="w-full border border-navy-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
        >
          <option value="">Select Team Leader</option>
          {employees.map((emp) => (
            <option key={emp.id} value={emp.id}>
              {emp.fullName}
            </option>
          ))}
        </select>
      </div>

      {/* Enrolled Employees */}
      <div>
        <label className="flex items-center gap-2 text-navy-700 font-semibold mb-3 uppercase tracking-wide text-sm">
          <Users size={20} /> Enrolled Employees
        </label>

        {addEmployeeSelectors.map((selectedId, index) => (
          <div
            key={index}
            className="flex items-center mb-3 gap-3"
          >
            <select
              value={selectedId || ""}
              onChange={(e) => handleAddEmployeeSelectorChange(index, e.target.value)}
              className="flex-grow border border-navy-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="">Select Employee</option>
              {employees.map((emp) => (
                <option key={emp.id} value={emp.id}>
                  {emp.fullName}
                </option>
              ))}
            </select>

            {/* Remove button */}
            {addEmployeeSelectors.length > 1 && (
              <button
                type="button"
                onClick={() => removeAddEmployeeSelector(index)}
                className="text-red-600 hover:text-red-800 p-1 rounded-full transition"
                title="Remove"
                aria-label="Remove employee"
              >
                <X size={20} />
              </button>
            )}

            {/* Add button only on last item */}
            {index === addEmployeeSelectors.length - 1 && (
              <button
                type="button"
                onClick={addAddEmployeeSelector}
                className="text-green-600 hover:text-green-800 p-1 rounded-full transition"
                title="Add Employee"
                aria-label="Add employee"
              >
                <Plus size={20} />
              </button>
            )}
          </div>
        ))}
      </div>
    </div>

    <DialogFooter className="mt-6 flex justify-end gap-4">
      <Button
        onClick={handleAddDepartment}
        className="bg-navy-700 text-white hover:bg-navy-800 px-8 py-3 rounded-lg shadow-lg transition-colors"
      >
        Add Department
      </Button>
      <Button
        variant="ghost"
        onClick={() => setAddDialogOpen(false)}
        className="text-navy-700 hover:bg-navy-100 px-6 py-3 rounded-lg transition"
      >
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

      {/* Delete Dialog*/}
      <Dialog open={confirmDeleteDialogOpen} onOpenChange={setConfirmDeleteDialogOpen}>
  <DialogContent className="border-2 border-red-600 rounded-xl">
    <DialogHeader>
      <DialogTitle className="text-red-700">Confirm Deletion</DialogTitle>
    </DialogHeader>
    <div className="text-gray-700">
      Are you sure you want to delete this department? This action cannot be undone.
    </div>
    <DialogFooter>
      <Button
        onClick={confirmDeleteDepartment}
        className="bg-red-600 hover:bg-red-700 text-white"
      >
        Yes, Delete
      </Button>
      <Button
        variant="ghost"
        onClick={() => {
          setConfirmDeleteDialogOpen(false);
          setDepartmentToDelete(null);
        }}
      >
        Cancel
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

{/* View Dialog */}
<Dialog open={viewDialogOpen} onOpenChange={setViewDialogOpen}>
  <DialogContent className="border-2 border-navy-900 rounded-3xl max-w-md bg-white shadow-xl p-8">
    <DialogHeader>
      <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6">
        Department Details
      </DialogTitle>
    </DialogHeader>

    {selectedDepartment ? (
      <div className="space-y-6 text-gray-900">
        {/* Name */}
        <div className="flex items-center gap-4">
          <User className="text-navy-700" size={24} />
          <div>
            <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Name</p>
            <p className="text-lg font-medium">{selectedDepartment.name}</p>
          </div>
        </div>

        {/* Email */}
        <div className="flex items-center gap-4">
          <Mail className="text-navy-700" size={24} />
          <div>
            <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Email</p>
            <p className="text-lg font-medium">{selectedDepartment.email || "-"}</p>
          </div>
        </div>

        {/* Phone Number */}
        <div className="flex items-center gap-4">
          <Phone className="text-navy-700" size={24} />
          <div>
            <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Phone Number</p>
            <p className="text-lg font-medium">{selectedDepartment.phoneNumber || "-"}</p>
          </div>
        </div>

        {/* Team Leader */}
        <div className="flex items-center gap-4">
          <User className="text-navy-700" size={24} />
          <div>
            <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Team Leader</p>
            <p className="text-lg font-medium">{selectedDepartment.teamLeaderName || "-"}</p>
          </div>
        </div>

        {/* Employees */}
        <div>
          <div className="flex items-center gap-4 mb-2">
            <Users className="text-navy-700" size={24} />
            <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Employees</p>
          </div>
          {selectedDepartment.employeesNames && selectedDepartment.employeesNames.length > 0 ? (
            <ul className="list-disc list-inside max-h-44 overflow-auto text-gray-800 rounded-md border border-navy-700 p-3 bg-navy-50">
              {selectedDepartment.employeesNames.map((empName, idx) => (
                <li
                  key={idx}
                  className="hover:text-navy-900 cursor-pointer transition-colors"
                  title={empName}
                >
                  {empName}
                </li>
              ))}
            </ul>
          ) : (
            <p className="italic text-gray-500 ml-1">No employees assigned</p>
          )}
        </div>
      </div>
    ) : (
      <p className="text-gray-500 italic">No department selected.</p>
    )}

    <DialogFooter>
      <Button
        onClick={() => setViewDialogOpen(false)}
        className="bg-navy-700 text-white hover:bg-navy-800 transition-colors duration-300 rounded-lg px-8 py-3 mt-8"
      >
        Close
      </Button>
    </DialogFooter>
  </DialogContent>
</Dialog>

    </div>
  );
}
