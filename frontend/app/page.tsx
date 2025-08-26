
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
  const [desc, setDesc] = React.useState("");
  const [assignedTo, setAssignedTo] = React.useState("");
  const [details, setDetails] = React.useState("");
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
        const newTask = await createTask({
          title: input,
          description: desc,
          assignedTo,
          details
        });
        setTasks([...tasks, newTask]);
        setInput("");
        setDesc("");
        setAssignedTo("");
        setDetails("");
      } catch {
        setError("No se pudo crear la tarea");
      }
    }
  };

  // Agrupar tareas por estado
  const columns = [
    { key: 'todo', title: 'Por hacer', color: '#222' },
    { key: 'inprogress', title: 'En progreso', color: '#555' },
    { key: 'done', title: 'Hecho', color: '#aaa' },
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
      bgcolor: "#fff",
      minHeight: "100vh",
      pb: 6
    }}>
      <AppBar position="static" sx={{ bgcolor: '#111', color: '#fff' }} elevation={0}>
        <Toolbar>
          <Typography variant="h5" component="div" sx={{ flexGrow: 1, fontWeight: 700, letterSpacing: 1, color: '#fff' }}>
            Trello Minimal
          </Typography>
        </Toolbar>
      </AppBar>
      <Container maxWidth="lg" sx={{ mt: 6 }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'flex-start', border: '1px solid #111', borderRadius: 3, overflow: 'hidden' }}>
            {columns.map((col, idx) => (
              <Paper key={col.key} elevation={0} sx={{
                p: 3,
                borderRadius: 0,
                width: 350,
                minWidth: 350,
                maxWidth: 350,
                bgcolor: '#fff',
                borderRight: idx < columns.length - 1 ? '2px solid #111' : 'none',
                borderLeft: idx === 0 ? 'none' : undefined,
                boxShadow: 'none',
                flex: 'none',
                height: '100%'
              }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#111', letterSpacing: 1 }}>{col.title}</Typography>
                {col.key === 'todo' && (
                  <Box sx={{ display: "flex", flexDirection: 'column', gap: 1.5, mb: 2 }}>
                    <TextField
                      label="Título"
                      variant="outlined"
                      size="small"
                      value={input}
                      onChange={e => setInput(e.target.value)}
                      fullWidth
                      sx={{ bgcolor: '#fafafa', borderRadius: 1 }}
                    />
                    <TextField
                      label="Descripción"
                      variant="outlined"
                      size="small"
                      value={desc}
                      onChange={e => setDesc(e.target.value)}
                      fullWidth
                      sx={{ bgcolor: '#fafafa', borderRadius: 1 }}
                    />
                    <TextField
                      label="Asignado a"
                      variant="outlined"
                      size="small"
                      value={assignedTo}
                      onChange={e => setAssignedTo(e.target.value)}
                      fullWidth
                      sx={{ bgcolor: '#fafafa', borderRadius: 1 }}
                    />
                    <TextField
                      label="Detalles"
                      variant="outlined"
                      size="small"
                      value={details}
                      onChange={e => setDetails(e.target.value)}
                      fullWidth
                      sx={{ bgcolor: '#fafafa', borderRadius: 1 }}
                    />
                    <Box sx={{ display: 'flex', justifyContent: 'flex-end' }}>
                      <IconButton sx={{ bgcolor: '#111', color: '#fff', '&:hover': { bgcolor: '#333' } }} onClick={handleAdd} aria-label="Agregar tarea">
                        <AddCircleOutlineIcon />
                      </IconButton>
                    </Box>
                  </Box>
                )}
                <Divider sx={{ mb: 2, bgcolor: '#eee' }} />
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
                                  bgcolor: snapshot.isDragging ? '#f5f5f5' : '#fff',
                                  borderRadius: 2,
                                  boxShadow: snapshot.isDragging ? 3 : 0,
                                  borderLeft: '3px solid #111',
                                  transition: 'background 0.2s',
                                  px: 2,
                                  py: 1.5,
                                }}
                              >
                                <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                  <ListItemIcon sx={{ minWidth: 36 }}>
                                    <CheckCircleIcon color={task.status === "done" ? "success" : "disabled"} />
                                  </ListItemIcon>
                                  <ListItemText
                                    primary={task.title}
                                    sx={{
                                      textDecoration: task.status === "done" ? "line-through" : "none",
                                      fontWeight: 500,
                                      color: '#111',
                                      fontSize: 17
                                    }}
                                  />
                                </Box>
                                {task.description && (
                                  <Typography variant="body2" sx={{ color: '#444', mt: 0.5, mb: 0.5 }}>
                                    {task.description}
                                  </Typography>
                                )}
                                {task.assignedTo && (
                                  <Typography variant="caption" sx={{ color: '#888', mb: 0.5 }}>
                                    Asignado a: {task.assignedTo}
                                  </Typography>
                                )}
                                {task.details && (
                                  <Typography variant="caption" sx={{ color: '#aaa', mb: 0.5 }}>
                                    {task.details}
                                  </Typography>
                                )}
                                <IconButton size="small" sx={{ ml: 'auto', color: '#c00' }} onClick={async () => {
                                  await import('../utils/api').then(mod => mod.deleteTask(task.id));
                                  setTasks(tasks => tasks.filter(t => t.id !== task.id));
                                }}>
                                  {/* Eliminar */}
                                  <span style={{ fontWeight: 700, fontSize: 18 }}>×</span>
                                </IconButton>
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
