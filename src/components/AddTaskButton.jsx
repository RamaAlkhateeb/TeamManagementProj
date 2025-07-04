import React, { useEffect, useState } from "react";
import axios from "axios";
import { jwtDecode } from "jwt-decode";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import { Plus, X, Save, ClipboardList, Info, Flag, Calendar, Star, User } from "lucide-react";

const AddTaskButton = ({ onTaskAdded }) => {
  const [open, setOpen] = useState(false);
  const [form, setForm] = useState({
    title: "",
    description: "",
    priority: "",
    startDate: "",
    deadLine: "",
    pointsValue: 1,
    assignedToEmployeeId: "",
  });
  const [employeeId, setEmployeeId] = useState(null);
  const [employees, setEmployees] = useState([]);

  useEffect(() => {
    const token = localStorage.getItem("token");
    if (!token) return;

    const decoded = jwtDecode(token);
    setEmployeeId(Number(decoded.Employee_Id));

    axios
      .get("https://ramialzend.bsite.net/api/Employees", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => setEmployees(res.data.data))
      .catch((err) => console.error("❌ Error fetching employees:", err));
  }, []);

  const handleChange = (e) => {
    const { name, value } = e.target;
    setForm((prev) => ({ ...prev, [name]: value }));
  };

  const handleSubmit = async () => {
    const token = localStorage.getItem("token");
    if (!token || !employeeId) return;

    const payload = {
      ...form,
      endDate: form.deadLine, // Set endDate = deadLine
      status: "pending",
      accepted: true,
      createdByEmployeeId: employeeId,
    };

    try {
      await axios.post("https://ramialzend.bsite.net/api/Task", payload, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });
      alert("✅ Task added successfully");
      onTaskAdded?.();
      setOpen(false);
      setForm({
        title: "",
        description: "",
        priority: "",
        startDate: "",
        deadLine: "",
        pointsValue: 1,
        assignedToEmployeeId: "",
      });
    } catch (err) {
      console.error("❌ Error adding task:", err);
      alert("An error occurred while adding the task.");
    }
  };

  return (
    <div className="text-right mb-6">
      <Button
        onClick={() => setOpen(true)}
        className="flex items-center gap-2 bg-blue-700 text-white hover:bg-blue-800"
      >
        <Plus size={18} /> Add Task
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="border-2 border-navy-900 rounded-3xl max-w-2xl bg-white shadow-xl p-8">
         
 

          <div className="space-y-4 text-gray-800">
            {/* Title */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <ClipboardList className="text-navy-700" size={20} />
                <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Title</p>
              </div>
              <input
                name="title"
                value={form.title}
                onChange={handleChange}
                placeholder="Enter task title"
                className="w-full p-3 border border-navy-200 rounded-lg bg-navy-50"
              />
            </div>

            {/* Description */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Info className="text-navy-700" size={20} />
                <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Description</p>
              </div>
              <textarea
                name="description"
                value={form.description}
                onChange={handleChange}
                placeholder="Enter task description"
                className="w-full p-3 border border-navy-200 rounded-lg bg-navy-50 resize-none h-24"
              />
            </div>

            {/* Priority */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Flag className="text-navy-700" size={20} />
                <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Priority</p>
              </div>
              <input
                name="priority"
                value={form.priority}
                onChange={handleChange}
                placeholder="Enter task priority"
                className="w-full p-3 border border-navy-200 rounded-lg bg-navy-50"
              />
            </div>

            {/* Dates */}
            <div className="grid grid-cols-2 gap-4">
              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-navy-700" size={20} />
                  <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Start Date</p>
                </div>
                <input
                  type="date"
                  name="startDate"
                  value={form.startDate}
                  onChange={handleChange}
                  className="w-full p-3 border border-navy-200 rounded-lg bg-navy-50"
                />
              </div>

              <div>
                <div className="flex items-center gap-2 mb-1">
                  <Calendar className="text-navy-700" size={20} />
                  <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Deadline</p>
                </div>
                <input
                  type="date"
                  name="deadLine"
                  value={form.deadLine}
                  onChange={handleChange}
                  className="w-full p-3 border border-navy-200 rounded-lg bg-navy-50"
                />
              </div>
            </div>

            {/* Points */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <Star className="text-navy-700" size={20} />
                <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Points</p>
              </div>
              <input
                type="number"
                name="pointsValue"
                value={form.pointsValue}
                onChange={handleChange}
                placeholder="Points"
                className="w-full p-3 border border-navy-200 rounded-lg bg-navy-50"
              />
            </div>

            {/* Assignee */}
            <div>
              <div className="flex items-center gap-2 mb-1">
                <User className="text-navy-700" size={20} />
                <p className="text-sm uppercase font-semibold tracking-wide text-navy-700">Assign To</p>
              </div>
              <select
                name="assignedToEmployeeId"
                value={form.assignedToEmployeeId}
                onChange={handleChange}
                className="w-full p-3 border border-navy-200 rounded-lg text-black bg-navy-50"
              >
                <option value="">Select Employee</option>
                {employees.map((emp) => (
                  <option key={emp.id} value={emp.id} className="text-black">
                    {emp.fullName}
                  </option>
                ))}
              </select>
            </div>
          </div>

          <DialogFooter className="mt-6 flex justify-end gap-3">
            <Button
              variant="outline"
              onClick={() => setOpen(false)}
              className="text-gray-700 border-gray-400 hover:bg-gray-100 px-6 py-2 rounded-lg flex items-center gap-1"
            >
              <X size={16} /> Cancel
            </Button>
            <Button
              onClick={handleSubmit}
              className="bg-green-600 text-white hover:bg-green-700 px-6 py-2 rounded-lg flex items-center gap-1"
            >
              <Save size={16} /> Save Task
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </div>
  );
};

export default AddTaskButton;

