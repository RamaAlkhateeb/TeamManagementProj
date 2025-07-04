import React, { useEffect, useState } from "react";
import ProjectCard from "../components/ProjectsCard";
import AddProjectDialog from "../components/AddProjectDialog";
import EditProjectDialog from "../components/EditProjectDialog";
import ProjectDetailsDialog from "../components/ProjectDetailsDialog";
import { Button } from "../components/ui/button";
import axios from "axios";
import { Plus } from "lucide-react";

export default function ProjectsPage() {
  const [projects, setProjects] = useState([]);
  const [loading, setLoading] = useState(true);
  const [addOpen, setAddOpen] = useState(false);
  const [editProject, setEditProject] = useState(null);
  const [selectedProject, setSelectedProject] = useState(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [detailsLoading, setDetailsLoading] = useState(false);

  const fetchProjects = () => {
    const token = localStorage.getItem("token");
    if (!token) return setLoading(false);

    setLoading(true);
    fetch("https://ramialzend.bsite.net/api/Projects", {
      headers: { Authorization: `Bearer ${token}` },
    })
      .then((r) => r.json())
      .then((d) => d.isSuccess && setProjects(d.data))
      .catch(console.error)
      .finally(() => setLoading(false));
  };

  const handleViewDetails = async (id) => {
    const token = localStorage.getItem("token");
    setDetailsOpen(true);
    setDetailsLoading(true);
    try {
      const res = await axios.get(`https://ramialzend.bsite.net/api/Projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      if (res.data.isSuccess) {
        setSelectedProject(res.data.data);
      } else {
        setSelectedProject(null);
      }
    } catch {
      setSelectedProject(null);
    } finally {
      setDetailsLoading(false);
    }
  };

  const handleDeleteProject = async (id) => {
    const confirmed = window.confirm("Are you sure you want to delete this project?");
    if (!confirmed) return;

    const token = localStorage.getItem("token");
    try {
      const res = await axios.delete(`https://ramialzend.bsite.net/api/Projects/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });

      if (res.data.isSuccess) {
        setProjects((prev) => prev.filter((p) => p.id !== id));
      } else {
        alert("Delete failed: " + res.data.message);
      }
    } catch (e) {
      console.error(e);
      alert("Error deleting project");
    }
  };

  useEffect(fetchProjects, []);

  return (
    <div className="min-h-screen bg-gray-100 p-6">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-3xl font-bold text-blue-800">Projects</h1>
        <Button
          onClick={() => setAddOpen(true)}
          className="flex items-center gap-2 bg-blue-700 text-white hover:bg-blue-800"
        >
          <Plus size={18} /> Add Project
        </Button>
      </div>

      {loading ? (
        <p className="text-gray-500">Loading projects...</p>
      ) : (
        <div className="flex flex-wrap gap-6">
          {projects.length > 0 ? (
            projects.map((project) => (
              <ProjectCard
                key={project.id}
                project={project}
                onView={() => handleViewDetails(project.id)}
                onEdit={() => setEditProject(project)}
                onDelete={handleDeleteProject}
              />
            ))
          ) : (
            <p className="text-gray-500">No projects available.</p>
          )}
        </div>
      )}

      {/* Dialogs */}
      <AddProjectDialog
        open={addOpen}
        onClose={() => setAddOpen(false)}
        onSaved={() => {
          setAddOpen(false);
          fetchProjects();
        }}
      />

      <EditProjectDialog
        open={!!editProject}
        onClose={() => setEditProject(null)}
        project={editProject}
        onSaved={() => {
          setEditProject(null);
          fetchProjects();
        }}
      />

      <ProjectDetailsDialog
        open={detailsOpen}
        onClose={() => setDetailsOpen(false)}
        projectDetails={selectedProject}
        loading={detailsLoading}
      />
    </div>
  );
}
