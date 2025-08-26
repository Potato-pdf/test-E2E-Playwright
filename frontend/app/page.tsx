
"use client";

import * as React from "react";
import { AppBar, Box, Toolbar, Typography, Button, Container, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, IconButton, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { fetchTasks, createTask } from "../utils/api";


export default function Home() {
  const [tasks, setTasks] = React.useState<any[]>([]);
  const [input, setInput] = React.useState("");
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState("");

  React.useEffect(() => {
    fetchTasks()
      .then(data => {
        setTasks(data);
        setLoading(false);
      })
      .catch(() => {
        setError("No se pudo cargar las tareas");
        setLoading(false);
      });
  }, []);

  const handleAdd = async () => {
    if (input.trim()) {
      try {
        const newTask = await createTask(input);
        setTasks([...tasks, newTask]);
        setInput("");
      } catch {
        setError("No se pudo crear la tarea");
      }
    }
  };

  // Agrupar tareas por estado
  const columns = [
    { key: 'todo', title: 'Por hacer' },
    { key: 'inprogress', title: 'En progreso' },
    { key: 'done', title: 'Hecho' },
  ];
  const grouped = columns.reduce((acc, col) => {
    acc[col.key] = tasks.filter((t) => t.status === col.key);
    return acc;
  }, {} as Record<string, any[]>);

  return (
    <Box sx={{ flexGrow: 1, bgcolor: "#f5f6fa", minHeight: "100vh" }}>
      <AppBar position="static" color="primary" elevation={2}>
        <Toolbar>
          <Typography variant="h6" component="div" sx={{ flexGrow: 1 }}>
            Demo E2E Playwright
          </Typography>
          <Button color="inherit">Login</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <Box sx={{ display: 'flex', gap: 3, justifyContent: 'center' }}>
          {columns.map((col) => (
            <Paper key={col.key} elevation={3} sx={{ p: 2, borderRadius: 3, minWidth: 320, bgcolor: '#fff', flex: 1 }}>
              <Typography variant="h6" fontWeight={700} gutterBottom>{col.title}</Typography>
              {col.key === 'todo' && (
                <Box sx={{ display: "flex", gap: 2, mb: 2 }}>
                  <TextField
                    label="Nueva tarea"
                    variant="outlined"
                    size="small"
                    value={input}
                    onChange={e => setInput(e.target.value)}
                    fullWidth
                  />
                  <IconButton color="primary" onClick={handleAdd} aria-label="Agregar tarea">
                    <AddCircleOutlineIcon />
                  </IconButton>
                </Box>
              )}
              <Divider sx={{ mb: 2 }} />
              {loading ? (
                <Box sx={{ display: 'flex', justifyContent: 'center', my: 4 }}>
                  <CircularProgress />
                </Box>
              ) : error ? (
                <Typography color="error">{error}</Typography>
              ) : (
                <List>
                  {grouped[col.key].map((task: any) => (
                    <ListItem key={task.id} disablePadding>
                      <ListItemIcon>
                        <CheckCircleIcon color={task.status === "done" ? "success" : "disabled"} />
                      </ListItemIcon>
                      <ListItemText
                        primary={task.title}
                        sx={{ textDecoration: task.status === "done" ? "line-through" : "none" }}
                      />
                    </ListItem>
                  ))}
                </List>
              )}
            </Paper>
          ))}
        </Box>
      </Container>
    </Box>
  );
}
