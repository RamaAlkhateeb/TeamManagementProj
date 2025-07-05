import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import {
  Users,
  CalendarDays,
  ClipboardList,
  Building2,
} from "lucide-react";
import axios from "axios";

export default function EditProjectDialog({ open, onClose, project, onSaved }) {
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    startDate: "",
    endDate: "",
    departmentId: "",
    enrolledMembersIds: [],
    guidTasks: [],
  });

  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  useEffect(() => {
    const fetchData = async () => {
      try {
        const token = localStorage.getItem("token");

        const [depRes, empRes, taskRes] = await Promise.all([
          axios.get("https://ramialzend.bsite.net/Departments", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://ramialzend.bsite.net/api/Employees", {
            headers: { Authorization: `Bearer ${token}` },
          }),
          axios.get("https://ramialzend.bsite.net/api/Task", {
            headers: { Authorization: `Bearer ${token}` },
          }),
        ]);

        setDepartments(depRes.data?.data || []);
        setEmployees(empRes.data?.data || []);
        setTasks(taskRes.data?.data || []);
      } catch (error) {
        console.error("Error fetching auxiliary data:", error);
      }
    };

    fetchData();
  }, []);

  useEffect(() => {
    if (project) {
      setFormData({
        name: project.name || "",
        description: project.description || "",
        startDate: project.startDate?.substring(0, 10) || "",
        endDate: project.endDate?.substring(0, 10) || "",
        departmentId: String(project.departmentId || ""),
        enrolledMembersIds: (project.enrolledMembersIds || []).map(String),
        guidTasks: (project.guidTasks || []).map(String),
      });
    }
  }, [project]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    const val = String(value);

    if (type === "checkbox" && name === "enrolledMembersIds") {
      setFormData((prev) => ({
        ...prev,
        enrolledMembersIds: checked
          ? [...prev.enrolledMembersIds, val]
          : prev.enrolledMembersIds.filter((id) => id !== val),
      }));
    } else if (type === "checkbox" && name === "guidTasks") {
      setFormData((prev) => ({
        ...prev,
        guidTasks: checked
          ? [...prev.guidTasks, val]
          : prev.guidTasks.filter((id) => id !== val),
      }));
    } else {
      setFormData((prev) => ({ ...prev, [name]: val }));
    }
  };

  const handleSave = async () => {
    try {
      const token = localStorage.getItem("token");
      await axios.put(
        `https://ramialzend.bsite.net/api/Projects/${project.id}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
        }
      );
      onSaved();
      onClose();
    } catch (error) {
      alert("Error updating project.");
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-2 border-navy-900 rounded-4xl max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-white shadow-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6 text-center">
            Edit Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
              <ClipboardList size={20} /> Project Name
            </label>
            <Input
              name="name"
              value={formData.name}
              onChange={handleChange}
              placeholder="Enter project name"
              className="border border-navy-700 rounded-lg px-4 py-3 w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
              <ClipboardList size={15} /> Description
            </label>
            <textarea
              name="description"
              value={formData.description}
              onChange={handleChange}
              placeholder="Project description"
              rows={3}
              className="border border-navy-700 rounded-lg px-4 py-3 w-full resize-none"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
                <CalendarDays size={20} /> Start Date
              </label>
              <Input
                type="date"
                name="startDate"
                value={formData.startDate}
                onChange={handleChange}
                className="border border-navy-700 rounded-lg px-4 py-3 w-full"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
                <CalendarDays size={20} /> End Date
              </label>
              <Input
                type="date"
                name="endDate"
                value={formData.endDate}
                onChange={handleChange}
                className="border border-navy-700 rounded-lg px-4 py-3 w-full"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
              <Building2 size={20} /> Department
            </label>
            <select
              name="departmentId"
              value={formData.departmentId}
              onChange={handleChange}
              className="w-full border border-navy-700 rounded-lg px-4 py-3"
            >
              <option value="">Select Department</option>
              {departments.map((dep) => (
                <option key={dep.id} value={String(dep.id)}>
                  {dep.name}
                </option>
              ))}
            </select>
          </div>

          {/* Enrolled Members */}
          <div className="border border-navy-300 p-4 rounded-xl">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-3 uppercase tracking-wide text-sm">
              <Users size={20} /> Enrolled Members
            </label>
            <div className="max-h-20 overflow-y-auto space-y-2 pl-1">
              {employees.map((emp) => (
                <label
                  key={emp.id}
                  className="flex items-center gap-2 text-sm text-gray-800"
                >
                  <input
                    type="checkbox"
                    name="enrolledMembersIds"
                    value={String(emp.id)}
                    checked={formData.enrolledMembersIds.includes(String(emp.id))}
                    onChange={handleChange}
                    className="accent-navy-600 w-4 h-4"
                  />
                  {emp.fullName}
                </label>
              ))}
            </div>
          </div>

          {/* Tasks */}
          <div className="border border-navy-300 p-4 rounded-xl">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-3 uppercase tracking-wide text-sm">
              <ClipboardList size={20} /> Tasks
            </label>
            <div className="max-h-20 overflow-y-auto space-y-2 pl-1">
              {tasks.map((task) => (
  <label key={task.id} className="flex items-center gap-2 text-sm text-gray-800">
    <input
      type="checkbox"
      name="guidTasks"
      value={String(task.taskUniqueIdentifier)} 
      checked={formData.guidTasks.includes(String(task.taskUniqueIdentifier))}
      onChange={handleChange}
      className="accent-navy-600 w-4 h-4"
    />
    {task.title}
  </label>
))}

            </div>
          </div>
        </div>

        <DialogFooter className="mt-6 flex justify-end gap-4">
          <Button
            onClick={handleSave}
            className="bg-navy-700 text-white hover:bg-navy-800 px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            Save Changes
          </Button>
          <Button
            variant="ghost"
            onClick={onClose}
            className="text-navy-700 hover:bg-navy-100 px-6 py-3 rounded-lg transition"
          >
            Cancel
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
