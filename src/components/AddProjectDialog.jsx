import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "../components/ui/dialog";
import { Input } from "../components/ui/input";
import { Button } from "../components/ui/button";
import { Users, User, CalendarDays, ClipboardList } from "lucide-react";
import axios from "axios";

export default function AddProjectDialog({ open, onClose, onSaved }) {
  const [loading, setLoading] = useState(false);
  const [departments, setDepartments] = useState([]);
  const [employees, setEmployees] = useState([]);
  const [tasks, setTasks] = useState([]);

  const [form, setForm] = useState({
    projectName: "",
    description: "",
    startDate: "",
    endDate: "",
    departmentId: "",
    enrolledMembersIds: [],
    guidTasks: [],
  });

  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!open) return;
    const token = localStorage.getItem("token");
    if (!token) return;

    setLoading(true);
    Promise.all([
      axios.get("https://ramialzend.bsite.net/Departments", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("https://ramialzend.bsite.net/api/Employees", {
        headers: { Authorization: `Bearer ${token}` },
      }),
      axios.get("https://ramialzend.bsite.net/api/Task", {
        headers: { Authorization: `Bearer ${token}` },
      }),
    ])
      .then(([depRes, empRes, taskRes]) => {
        setDepartments(depRes.data.data || []);
        setEmployees(empRes.data.data || []);
        setTasks(taskRes.data.data || []);
      })
      .catch(console.error)
      .finally(() => setLoading(false));
  }, [open]);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    if (type === "checkbox") {
      setForm((prev) => {
        const arr = prev[name];
        return {
          ...prev,
          [name]: checked ? [...arr, value] : arr.filter((id) => id !== value),
        };
      });
    } else {
      setForm((prev) => ({ ...prev, [name]: value }));
    }
  };

  const handleSave = async () => {
    const token = localStorage.getItem("token");
    setSaving(true);
    try {
      const payload = {
        projectName: form.projectName,
        description: form.description,
        startDate: form.startDate,
        endDate: form.endDate,
        departmentId: form.departmentId,
        enrolledMembersIds: form.enrolledMembersIds,
        guidTasks: form.guidTasks,
      };

      const res = await axios.post("https://ramialzend.bsite.net/api/Projects", payload, {
        headers: { Authorization: `Bearer ${token}`, "Content-Type": "application/json" },
      });

      if (res.data.isSuccess) {
        onSaved();
        onClose();
      } else {
        alert("Failed: " + res.data.message);
      }
    } catch (e) {
      alert("Error saving project");
    } finally {
      setSaving(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent  className="border-2 border-navy-900 rounded-4xl max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-white shadow-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6 text-center">
            Add New Project
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6">
          {/* Project Name */}
          <div>
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
              <ClipboardList size={20} /> Project Name
            </label>
            <Input
              name="projectName"
              placeholder="Enter project name"
              value={form.projectName}
              onChange={handleChange}
              className="border border-navy-700 rounded-lg px-4 py-3 w-full"
            />
          </div>

          {/* Description */}
          <div>
            <label className="text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm block">
              Description
            </label>
            <textarea
              name="description"
              placeholder="Enter description"
              value={form.description}
              onChange={handleChange}
              rows={3}
              className="w-full border border-navy-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
            />
          </div>

          {/* Dates */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
                <CalendarDays size={20} /> Start Date
              </label>
              <Input
                name="startDate"
                type="date"
                value={form.startDate}
                onChange={handleChange}
                className="border border-navy-700 rounded-lg px-4 py-3 w-full"
              />
            </div>
            <div>
              <label className="flex items-center gap-2 text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm">
                <CalendarDays size={20} /> End Date
              </label>
              <Input
                name="endDate"
                type="date"
                value={form.endDate}
                onChange={handleChange}
                className="border border-navy-700 rounded-lg px-4 py-3 w-full"
              />
            </div>
          </div>

          {/* Department */}
          <div>
            <label className="text-navy-700 font-semibold mb-1 uppercase tracking-wide text-sm block">
              Department
            </label>
            <select
              name="departmentId"
              value={form.departmentId}
              onChange={handleChange}
              className="w-full border border-navy-700 rounded-lg px-4 py-3 focus:outline-none focus:ring-2 focus:ring-navy-500"
            >
              <option value="">Select Department</option>
              {departments.map((d) => (
                <option key={d.id} value={d.id}>
                  {d.name}
                </option>
              ))}
            </select>
          </div>

          {/* Enrolled Employees */}
          <div className="border border-navy-300 p-4 rounded-xl">
            <label className="flex items-center gap-2 text-navy-700 font-semibold mb-3 uppercase tracking-wide text-sm">
              <Users size={20} /> Team Members
            </label>
            <div className="max-h-40 overflow-y-auto space-y-2 pl-1">
              {employees.map((emp) => (
                <label key={emp.id} className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    name="enrolledMembersIds"
                    value={emp.id}
                    checked={form.enrolledMembersIds.includes(emp.id)}
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
            <div className="max-h-40 overflow-y-auto space-y-2 pl-1">
              {tasks.map((task) => (
                <label key={task.taskUniqueIdentifier} className="flex items-center gap-2 text-sm text-gray-800">
                  <input
                    type="checkbox"
                    name="guidTasks"
                    value={task.taskUniqueIdentifier}
                    checked={form.guidTasks.includes(task.taskUniqueIdentifier)}
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
            disabled={saving}
            className="bg-navy-700 text-white hover:bg-navy-800 px-8 py-3 rounded-lg shadow-lg transition-colors"
          >
            {saving ? "Saving..." : "Save Project"}
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
