import React, { useEffect, useState } from "react";
import {jwtDecode} from "jwt-decode";
import axios from "axios";
import MyProjectCard from '../components/MyProjectCard';
import ProjectDetailsDialog from "../components/ProjectDetailsDialog";
import { Button } from "../components/ui/button";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [userName, setUserName] = useState("");
  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  // جلب fullName من API حسب Employee_Id المأخوذ من التوكن
  const fetchUserName = async (token) => {
    try {
      const decoded = jwtDecode(token);
      const empId = decoded.Employee_Id || decoded.employee_Id;
      if (!empId) return "";

      const res = await axios.get(`https://ramialzend.bsite.net/api/Employees/${empId}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.isSuccess) return res.data.data.fullName;
    } catch (e) {
      console.error("خطأ في جلب بيانات الموظف:", e);
    }
    return "";
  };

  // جلب المشاريع وتصفية حسب الاسم
  const fetchProjects = async () => {
    setLoading(true);
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    const name = await fetchUserName(token);
    setUserName(name);

    try {
      const res = await axios.get("https://ramialzend.bsite.net/api/Projects", {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.isSuccess) {
        const filtered = name
          ? res.data.data.filter((prj) => prj.teamMembers?.includes(name))
          : [];
        setProjects(filtered);
      }
    } catch (e) {
      console.error("Eroor:", e);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProjects();
  }, []);

  // فتح تفاصيل المشروع
  const handleViewDetails = async (id) => {
    setDetailsOpen(true);
    setDetailsLoading(true);
    const token = localStorage.getItem("token");
    try {
      const res = await axios.get(`https://ramialzend.bsite.net/api/Projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setSelectedProject(res.data.isSuccess ? res.data.data : null);
    } catch {
      setSelectedProject(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <div>
          <h1 className="text-3xl font-bold text-blue-800">My Projects</h1>
        </div>
        
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : projects.length === 0 ? (
        <p className="text-gray-500">There are no projects specifically for you.</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {projects.map((project) => (
            <MyProjectCard
              key={project.id}
              project={project}
              onView={() => handleViewDetails(project.id)}
            />
          ))}
        </div>
      )}

      {/* النوافذ/Dialogs */}
      <ProjectDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        projectDetails={selectedProject}
        loading={detailsLoading}
      />
    </div>
  );
}
