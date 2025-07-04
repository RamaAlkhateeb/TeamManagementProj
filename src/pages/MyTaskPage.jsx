import React, { useEffect, useState } from 'react';
import axios from 'axios';
import { jwtDecode } from 'jwt-decode';
import { Card, CardContent } from '../components/ui/card';
import { Badge } from '../components/ui/badge';
import { Dialog, DialogContent, DialogHeader, DialogFooter, DialogTitle } from '../components/ui/dialog';
import { Separator } from '../components/ui/separator';
import AddTaskButton from '../components/AddTaskButton';

const MyTasksPage = () => {
  const [tasks, setTasks] = useState([]);
  const [employeeId, setEmployeeId] = useState(null);
  const [openDialogId, setOpenDialogId] = useState(null);
  const [submissionDescription, setSubmissionDescription] = useState('');
  const [submissionFiles, setSubmissionFiles] = useState({});

  useEffect(() => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const decodedToken = jwtDecode(token);
    const empId = Number(decodedToken.Employee_Id);
    setEmployeeId(empId);

    axios
      .get('https://ramialzend.bsite.net/api/Task', {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      })
      .then((res) => {
        const filtered = res.data.data.filter(
          (task) => task.assignedToEmployeeId === empId
        );
        setTasks(filtered);
      })
      .catch((err) => console.error("Error fetching tasks:", err));
  }, []);

  const pendingTasks = tasks.filter((task) => task.status === 'pending');
  const submittedTasks = tasks.filter((task) => task.status === 'Submitted');

  const handleSubmit = async (taskId) => {
    const token = localStorage.getItem('token');
    if (!token) return;

    const formData = new FormData();
    formData.append('Description', submissionDescription);

    if (submissionFiles[taskId]) {
      for (let i = 0; i < submissionFiles[taskId].length; i++) {
        formData.append('Files', submissionFiles[taskId][i]);
      }
    }

    try {
      await axios.post(
        `https://ramialzend.bsite.net/api/Task/submit-task/${taskId}`,
        formData,
        {
          headers: {
            Authorization: `Bearer ${token}`,
            'Content-Type': 'multipart/form-data',
          },
        }
      );
      alert('✅ Submission uploaded successfully');
      setSubmissionDescription('');
      setSubmissionFiles((prev) => ({ ...prev, [taskId]: null }));
      setOpenDialogId(null);
    } catch (error) {
      console.error('❌ Error submitting task:', error);
      alert('An error occurred while uploading the submission');
    }
  };

  const renderTaskCard = (task) => (
    <Card
      key={task.taskUniqueIdentifier}
      className="w-[350px] border-[2px] border-blue-900 shadow-md rounded-lg"
    >
      <CardContent className="p-4">
        <div className="flex justify-between items-center mb-2">
          <h3 className="text-lg font-bold">{task.title}</h3>
          <Badge
            className={`text-white ${
              task.status === 'pending' ? 'bg-green-600' : 'bg-red-600'
            }`}
          >
            {task.status}
          </Badge>
        </div>
        <p className="text-gray-600 text-sm mb-3">{task.description}</p>
        <div className="text-xs text-gray-500 space-y-1 mb-4">
          <p>🗓️ Start: {new Date(task.startDate).toLocaleDateString()}</p>
          {task.status === 'Submitted' && task.submissionDate && (
            <p>✅ End: {new Date(task.submissionDate).toLocaleDateString()}</p>
          )}
          <p>📅 Deadline: {new Date(task.deadLine).toLocaleDateString()}</p>
          <p>🔥 Priority: {task.priority}</p>
          <p>🎯 Points: {task.pointsValue}</p>
          <p>📁 Project: {Object.values(task.projectIdNames).join(', ')}</p>
          <p>👤 Created by: {task.createdByName}</p>
        </div>

        {/* Show Add Submission button only for pending tasks */}
        {task.status === 'pending' && (
          <>
            <button
              onClick={() => setOpenDialogId(task.taskUniqueIdentifier)}
              className="mt-2 w-full bg-blue-700 text-white py-2 rounded hover:bg-blue-800"
            >
              ➕ Add Submission
            </button>

            {/* Dialog for submission */}
            {openDialogId === task.taskUniqueIdentifier && (
              <Dialog open={true} onOpenChange={() => setOpenDialogId(null)}>
                <DialogContent className="max-w-md p-6 rounded-xl shadow-lg">
                  <DialogHeader className="text-left">
                    <DialogTitle className="text-2xl font-bold text-blue-900 flex items-center gap-2">
                      📤 Upload Submission
                    </DialogTitle>
                  </DialogHeader>

                  <div className="space-y-4 mt-4">
                    <textarea
                      placeholder="Enter submission description"
                      className="w-full p-3 border border-gray-300 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500"
                      value={submissionDescription}
                      onChange={(e) => setSubmissionDescription(e.target.value)}
                    />
                    <input
                      type="file"
                      multiple
                      className="w-full border border-gray-300 rounded px-3 py-2"
                      onChange={(e) =>
                        setSubmissionFiles((prev) => ({
                          ...prev,
                          [task.taskUniqueIdentifier]: e.target.files,
                        }))
                      }
                    />
                  </div>

                  <DialogFooter className="mt-6 flex justify-end gap-2">
                    <button
                      className="bg-gray-300 text-gray-800 px-4 py-2 rounded hover:bg-gray-400"
                      onClick={() => setOpenDialogId(null)}
                    >
                      Cancel
                    </button>
                    <button
                      className="bg-green-600 text-white px-4 py-2 rounded hover:bg-green-700"
                      onClick={() => handleSubmit(task.taskUniqueIdentifier)}
                    >
                      Submit
                    </button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            )}
          </>
        )}
      </CardContent>
    </Card>
  );

  return (
    <div className="max-w-7xl mx-auto py-8 px-4">
      <h1 className="text-3xl font-bold text-blue-800">📝 My Task</h1>
      <div className="flex justify-end">
        <AddTaskButton onTaskAdded={() => window.location.reload()} />
      </div>

      {/* Pending Tasks */}
      <div className="flex flex-wrap gap-6 mb-8">
        {pendingTasks.length > 0 ? (
          pendingTasks.map(renderTaskCard)
        ) : (
          <p className="text-gray-500">No pending tasks</p>
        )}
      </div>

      {/* Separator with label */}
      {submittedTasks.length > 0 && (
        <div className="flex items-center my-8">
          <div className="flex-grow h-[2px] bg-blue-800"></div>
          <span className="mx-4 text-blue-800 font-semibold text-xl">
            Completed Tasks
          </span>
          <div className="flex-grow h-[2px] bg-blue-800"></div>
        </div>
      )}

      {/* Submitted Tasks */}
      <div className="flex flex-wrap gap-6">
        {submittedTasks.length > 0 ? (
          submittedTasks.map(renderTaskCard)
        ) : (
          <p className="text-gray-500">No completed tasks</p>
        )}
      </div>
    </div>
  );
};

export default MyTasksPage;
