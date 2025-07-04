import React, { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogFooter,
  DialogTitle,
} from "./ui/dialog";
import { Button } from "./ui/button";
import {
  Folder,
  Info,
  Calendar,
  ListChecks,
  Users,
  User,
  Download,  // إضافة أيقونة التحميل
} from "lucide-react";
import dayjs from "dayjs";
import axios from "axios";

export default function ProjectDetailsDialog({ open, onClose, projectDetails, loading }) {
  const [taskDetailsMap, setTaskDetailsMap] = useState({});

  useEffect(() => {
    const fetchTaskDetails = async () => {
      if (projectDetails && projectDetails.tasks && typeof projectDetails.tasks === "object") {
        try {
          const taskIds = Object.keys(projectDetails.tasks);
          const token = localStorage.getItem("token");

          const res = await axios.get("https://ramialzend.bsite.net/api/Task", {
            headers: { Authorization: `Bearer ${token}` },
          });

          const detailsMap = {};
          res.data?.data?.forEach((task) => {
            const id = String(task.taskUniqueIdentifier);  // استخدام taskUniqueIdentifier هنا
            if (taskIds.includes(id)) {
              detailsMap[id] = {
                title: task.title.trim(),
                status: task.status,
                taskUniqueIdentifier: task.taskUniqueIdentifier, // إضافة taskUniqueIdentifier
              };
            }
          });

          setTaskDetailsMap(detailsMap);
        } catch (err) {
          console.error("❌ Error fetching task details:", err.response?.data || err.message);
        }
      } else {
        console.warn("⚠️ projectDetails.tasks is not an object:", projectDetails?.tasks);
      }
    };

    fetchTaskDetails();
  }, [projectDetails]);

  const handleDownload = async (taskUniqueIdentifier) => {
    const token = localStorage.getItem("token");
    const url = `https://ramialzend.bsite.net/api/Task/download-all-files/${taskUniqueIdentifier}/download`;

    try {
      const response = await axios.get(url, {
        headers: {
          Authorization: `Bearer ${token}`,
        },
        responseType: 'blob',
      });

      const downloadUrl = window.URL.createObjectURL(new Blob([response.data]));
      const link = document.createElement("a");
      link.href = downloadUrl;
      link.setAttribute("download", `files-${taskUniqueIdentifier}.zip`);
      document.body.appendChild(link);
      link.click();
      link.remove();
    } catch (error) {
      console.error("❌ Error downloading files:", error.response?.data || error.message);
    }
  };

  if (loading) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="border-2 border-navy-900 rounded-3xl max-w-4xl bg-white shadow-xl p-8">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6">
              Project Details
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 italic">Loading project details...</p>
        </DialogContent>
      </Dialog>
    );
  }

  if (!projectDetails) {
    return (
      <Dialog open={open} onOpenChange={onClose}>
        <DialogContent className="border-2 border-navy-900 rounded-3xl max-w-4xl bg-white shadow-xl p-4">
          <DialogHeader>
            <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6">
              Project Details
            </DialogTitle>
          </DialogHeader>
          <p className="text-gray-500 italic">No project selected.</p>
        </DialogContent>
      </Dialog>
    );
  }

  const {
    name,
    description,
    startDate,
    endDate,
    status,
    departmentName,
    teamMembers,
    tasks,
  } = projectDetails;

  return (
    <Dialog open={open} onOpenChange={onClose}>
      <DialogContent className="border-2 border-navy-900 rounded-4xl max-w-4xl w-full max-h-[80vh] overflow-y-auto bg-white shadow-xl p-8">
        <DialogHeader>
          <DialogTitle className="text-3xl font-extrabold text-navy-900 mb-6">
            Project Details
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-6 text-gray-900">
          {/* Name */}
          <div className="flex items-center gap-4">
            <Folder className="text-navy-700" size={24} />
            <div>
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Name</p>
              <p className="text-lg font-medium">{name}</p>
            </div>
          </div>

          {/* Description */}
          <div className="flex items-center gap-4">
            <Info className="text-navy-700" size={24} />
            <div>
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Description</p>
              <p className="text-lg font-medium">{description || "-"}</p>
            </div>
          </div>

          {/* Dates */}
          <div className="flex items-center gap-4">
            <Calendar className="text-navy-700" size={24} />
            <div>
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Dates</p>
              <p className="text-base font-medium">Start: {dayjs(startDate).format("DD MMM YYYY")}</p>
              <p className="text-base font-medium">End: {dayjs(endDate).format("DD MMM YYYY")}</p>
            </div>
          </div>

          {/* Status */}
          <div className="flex items-center gap-4">
            <ListChecks className="text-navy-700" size={24} />
            <div>
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Status</p>
              <p className="text-lg font-medium">{status}</p>
            </div>
          </div>

          {/* Department */}
          <div className="flex items-center gap-4">
            <Users className="text-navy-700" size={24} />
            <div>
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Department</p>
              <p className="text-lg font-medium">{departmentName || "-"}</p>
            </div>
          </div>

          {/* Team Members */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <User className="text-navy-700" size={24} />
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Team Members</p>
            </div>
            {teamMembers && teamMembers.length > 0 ? (
              <ul className="list-disc list-inside max-h-44 overflow-auto text-gray-800 rounded-md border border-navy-700 p-3 bg-navy-50">
                {teamMembers.map((member, idx) => (
                  <li key={idx} className="hover:text-navy-900 cursor-pointer transition-colors">
                    {member}
                  </li>
                ))}
              </ul>
            ) : (
              <p className="italic text-gray-500 ml-1">No team members assigned</p>
            )}
          </div>

          {/* Tasks */}
          <div>
            <div className="flex items-center gap-4 mb-2">
              <ListChecks className="text-navy-700" size={24} />
              <p className="text-sm uppercase text-navy-700 font-semibold tracking-wide">Tasks</p>
            </div>
            {tasks && typeof tasks === "object" ? (
              <ul className="list-inside max-h-44 overflow-auto text-gray-800 rounded-md border border-navy-700 p-3 bg-navy-50 space-y-2">
                {Object.keys(tasks).map((taskId) => {
                  const task = taskDetailsMap[taskId];
                  const isSubmitted = task?.status === "Submitted";
                  const taskUniqueIdentifier = task?.taskUniqueIdentifier;

                  return (
                    <li
                      key={taskId}
                      className="flex items-center gap-3 bg-white p-2 rounded-md border border-navy-200 shadow-sm"
                    >
                      <div className="w-5 h-5 border border-navy-700 rounded flex items-center justify-center">
                        {isSubmitted && <span className="text-green-600 text-sm">✅</span>}
                      </div>
                      <span
                        className={`text-sm ${isSubmitted ? "text-red-600 line-through" : "text-gray-700"}`}
                      >
                        {task?.title || "Loading..."}
                      </span>

                      {isSubmitted && taskUniqueIdentifier && (
                        <Button
                          variant="link"
                          className="ml-4"
                          onClick={() => handleDownload(taskUniqueIdentifier)}
                        >
                          <Download className="text-navy-700" size={20} />
                        </Button>
                      )}
                    </li>
                  );
                })}
              </ul>
            ) : (
              <p className="italic text-gray-500 ml-1">No tasks available</p>
            )}
          </div>
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={onClose}>Close</Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
