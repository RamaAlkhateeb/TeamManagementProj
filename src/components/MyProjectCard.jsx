import React, { useEffect, useState } from "react";
import {
  Code as CodeIcon,
  DesignServices as DesignServicesIcon,
  Storage as StorageIcon,
  BugReport as BugReportIcon,
  HelpOutline as HelpOutlineIcon,
  Visibility as VisibilityIcon,
  Edit as EditIcon,
  DeleteOutline as DeleteOutlineIcon,
  CheckCircle as CheckCircleIcon,
  Language as LanguageIcon,
  Wifi as WifiIcon,
  SupportAgent as SupportAgentIcon,
} from '@mui/icons-material';
import { Box, Button, IconButton, LinearProgress, Typography } from "@mui/material";
import axios from 'axios';

// Theme constants
const ICON_STYLE = { color: '#1e40af', fontSize: 40 };
const PRIMARY_COLOR = '#1e40af';
const TITLE_COLOR = '#1e3a8a';

// Icon selector based on project name
const getProjectIcon = (name = '') => {
  const lowerName = name.toLowerCase();

  if (lowerName.includes('api') || lowerName.includes('backend')) return <StorageIcon sx={ICON_STYLE} />;
  if (lowerName.includes('ui') || lowerName.includes('design')) return <DesignServicesIcon sx={ICON_STYLE} />;
  if (lowerName.includes('bug') || lowerName.includes('qa')) return <BugReportIcon sx={ICON_STYLE} />;
  if (lowerName.includes('app') || lowerName.includes('mobile')) return <CodeIcon sx={ICON_STYLE} />;
  if (lowerName.includes('task')) return <CheckCircleIcon sx={ICON_STYLE} />;
  if (lowerName.includes('wifi')) return <WifiIcon sx={ICON_STYLE} />;
  if (lowerName.includes('website') || lowerName.includes('web')) return <LanguageIcon sx={ICON_STYLE} />;
  if (lowerName.includes('support') || lowerName.includes('help') || lowerName.includes('issue') || lowerName.includes('ticket')) {
    return <SupportAgentIcon sx={ICON_STYLE} />;
  }

  return <CodeIcon sx={ICON_STYLE} />; // default icon
};

const getShortDescription = (text) => {
  if (!text) return 'No description';
  const words = text.split(' ');
  return words.length > 10 ? `${words.slice(0, 10).join(' ')}...` : text;
};

// Function to calculate the progress percentage
const getProgressPercentage = (Submitted = 0, pending = 0) => {
  const total = Submitted + pending;
  return total > 0 ? (Submitted / total) * 100 : 0;
};

export default function MyProjectCard({ project, onView, onEdit, onDelete }) {
  const { name, description, id } = project;
  const [tasks, setTasks] = useState([]);
  const [progress, setProgress] = useState(0);

  // Fetch tasks from the API when the project is loaded
  useEffect(() => {
    const fetchTasks = async () => {
      try {
        const token = localStorage.getItem('token'); // Get the token from localStorage

        // Make the request with the token
        const response = await axios.get('https://ramialzend.bsite.net/api/Task', {
          headers: {
            Authorization: `Bearer ${token}`, // Add token in the header
          },
        });

        const taskData = response.data.data;

        // Filter tasks related to the project using project.id
        const filteredTasks = taskData.filter(task => task.projectIdNames[id]);

        // Log the filtered tasks to ensure we are getting the correct data
        console.log("Filtered Tasks:", filteredTasks);

        // Calculate the number of submitted and pending tasks
        const submittedTasks = filteredTasks.filter(task => task.status === 'Submitted').length;
        const pendingTasks = filteredTasks.filter(task => task.status === 'pending').length;

        // Log the count of tasks for debugging purposes
        console.log(`Submitted Tasks: ${submittedTasks}, Pending Tasks: ${pendingTasks}`);

        // Calculate progress
        const taskProgress = getProgressPercentage(submittedTasks, pendingTasks);

        // Log the calculated progress
        console.log(`Task Progress: ${taskProgress}`);

        setTasks(filteredTasks);
        setProgress(taskProgress);
      } catch (error) {
        console.error("Error fetching tasks:", error);
      }
    };

    fetchTasks();
  }, [id]); // Re-fetch when the project ID changes

  const shortDesc = getShortDescription(description);

  return (
    <Box
      sx={{
        position: 'relative',
        border: `2px solid ${PRIMARY_COLOR}`,
        borderRadius: 3,
        boxShadow: '0 4px 10px rgba(30, 64, 175, 0.15)',
        p: 3,
        width: 320,
        height: 250,
        display: 'flex',
        flexDirection: 'column',
        justifyContent: 'space-between',
        backgroundColor: '#fff',
      }}
    >
    

      {/* Header with Icon and Title */}
      <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
        {getProjectIcon(name)}
        <Typography
          variant="h6"
          sx={{
            ml: 2,
            fontWeight: 'bold',
            color: TITLE_COLOR,
            flex: 1,
            overflow: 'hidden',
            textOverflow: 'ellipsis',
            whiteSpace: 'nowrap',
          }}
        >
          {name}
        </Typography>
      </Box>

      {/* Description and Progress */}
      <Box>
        <Typography variant="body2" color="text.secondary" sx={{ mb: 1, minHeight: 40 }}>
          {shortDesc}
        </Typography>

        <LinearProgress
          variant="determinate"
          value={progress}
          sx={{ height: 10, borderRadius: 5, mb: 0.5 }}
          color="primary"
        />
        <Typography variant="caption" color="text.secondary">
          {`Completion: ${progress.toFixed(0)}%`}
        </Typography>
      </Box>

      {/* Action Buttons */}
      <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2, gap: 1 }}>
        <Button
          variant="outlined"
          startIcon={<VisibilityIcon />}
          onClick={onView}
          size="small"
          color="primary"
        >
          View
        </Button>
      </Box>
    </Box>
  );
}
