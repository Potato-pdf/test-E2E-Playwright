
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
    { key: 'todo', title: 'Por hacer', color: '#f7b731' },
    { key: 'inprogress', title: 'En progreso', color: '#3867d6' },
    { key: 'done', title: 'Hecho', color: '#20bf6b' },
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
    <Box sx={{
      flexGrow: 1,
      bgcolor: "linear-gradient(120deg, #f5f6fa 0%, #e0eafc 100%)",
      minHeight: "100vh",
      pb: 6
    }}>
      <AppBar position="static" sx={{ bgcolor: '#222f3e' }} elevation={3}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1 }}>
            Trello E2E Demo
          </Typography>
          <Button color="inherit" sx={{ fontWeight: 600 }}>Login</Button>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'flex', gap: 4, justifyContent: 'center', alignItems: 'flex-start' }}>
            {columns.map((col) => (
              <Paper key={col.key} elevation={6} sx={{
                p: 3,
                borderRadius: 4,
                minWidth: 340,
                bgcolor: '#f8fafc',
                borderTop: `6px solid ${col.color}`,
                boxShadow: '0 4px 24px 0 rgba(30,30,60,0.08)',
                flex: 1,
                maxWidth: 400
              }}>
                <Typography variant="h6" fontWeight={800} gutterBottom sx={{ color: col.color, letterSpacing: 1 }}>{col.title}</Typography>
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
                    <IconButton sx={{ bgcolor: col.color, color: '#fff', '&:hover': { bgcolor: '#222f3e' } }} onClick={handleAdd} aria-label="Agregar tarea">
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
                                  mb: 2,
                                  bgcolor: snapshot.isDragging ? col.color + '22' : '#fff',
                                  borderRadius: 3,
                                  boxShadow: snapshot.isDragging ? 6 : 2,
                                  borderLeft: `4px solid ${col.color}`,
                                  transition: 'background 0.2s',
                                  px: 2,
                                  py: 1.5,
                                }}
                              >
                                <ListItemIcon sx={{ minWidth: 36 }}>
                                  <CheckCircleIcon color={task.status === "done" ? "success" : "disabled"} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={task.title}
                                  sx={{
                                    textDecoration: task.status === "done" ? "line-through" : "none",
                                    fontWeight: 600,
                                    color: '#222f3e',
                                    fontSize: 18
                                  }}
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
