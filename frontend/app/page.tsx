
"use client";

import * as React from "react";
import { AppBar, Box, Toolbar, Typography, Button, Container, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, IconButton, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { fetchTasks, createTask, updateTaskStatus } from "../utils/api";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';


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

  const onDragEnd = async (result: DropResult) => {
    const { source, destination, draggableId } = result;
    if (!destination || source.droppableId === destination.droppableId) return;
    const taskId = Number(draggableId);
    const newStatus = destination.droppableId as 'todo' | 'inprogress' | 'done';
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks => tasks.map(t => t.id === taskId ? { ...t, status: newStatus } : t));
    } catch {
      setError('No se pudo mover la tarea');
    }
  };

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
        <DragDropContext onDragEnd={onDragEnd}>
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
                  <Droppable droppableId={col.key}>
                    {(provided) => (
                      <List ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 80 }}>
                        {grouped[col.key].map((task: any, idx: number) => (
                          <Draggable key={task.id} draggableId={String(task.id)} index={idx}>
                            {(provided, snapshot) => (
                              <ListItem
                                ref={provided.innerRef}
                                {...provided.draggableProps}
                                {...provided.dragHandleProps}
                                disablePadding
                                sx={{
                                  mb: 1,
                                  bgcolor: snapshot.isDragging ? '#e3f2fd' : '#fff',
                                  borderRadius: 2,
                                  boxShadow: snapshot.isDragging ? 4 : 1,
                                  transition: 'background 0.2s',
                                }}
                              >
                                <ListItemIcon>
                                  <CheckCircleIcon color={task.status === "done" ? "success" : "disabled"} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={task.title}
                                  sx={{ textDecoration: task.status === "done" ? "line-through" : "none" }}
                                />
                              </ListItem>
                            )}
                          </Draggable>
                        ))}
                        {provided.placeholder}
                      </List>
                    )}
                  </Droppable>
                )}
              </Paper>
            ))}
          </Box>
        </DragDropContext>
      </Container>
    </Box>
  );
}
