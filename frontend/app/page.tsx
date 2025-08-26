
"use client";

import * as React from "react";
import { Box, Typography, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, IconButton, CircularProgress } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';
import { fetchTasks, createTask, updateTaskStatus } from "../utils/api";
import { DragDropContext, Droppable, Draggable, DropResult } from 'react-beautiful-dnd';

const columns = [
  { key: "todo", title: "Por hacer" },
  { key: "inprogress", title: "En progreso" },
  { key: "done", title: "Hecho" },
];

type ColumnKey = "todo" | "inprogress" | "done";
interface GroupedTasks {
  [key: string]: any[];
  todo: any[];
  inprogress: any[];
  done: any[];
}
function groupTasks(tasks: any[]): GroupedTasks {
  return {
    todo: tasks.filter(t => t.status === "todo"),
    inprogress: tasks.filter(t => t.status === "inprogress"),
    done: tasks.filter(t => t.status === "done"),
  };
}

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
          details,
        });
        setTasks(tasks => [...tasks, newTask]);
        setInput("");
        setDesc("");
        setAssignedTo("");
        setDetails("");
      } catch {
        setError("No se pudo crear la tarea");
      }
    }
  };

  const onDragEnd = async (result: DropResult) => {
    if (!result.destination) return;
    const { source, destination, draggableId } = result;
    if (source.droppableId === destination.droppableId) return;
    const taskId = draggableId;
    const newStatus = destination.droppableId;
    try {
      await updateTaskStatus(taskId, newStatus);
      setTasks(tasks => tasks.map(t => t.id === Number(taskId) ? { ...t, status: newStatus } : t));
    } catch {
      setError("No se pudo actualizar el estado");
    }
  };

  const grouped = groupTasks(tasks);

  if (loading) return <Box sx={{ color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#111' }}><CircularProgress color="inherit" /></Box>;
  if (error) return <Box sx={{ color: '#fff', minHeight: '100vh', display: 'flex', alignItems: 'center', justifyContent: 'center', bgcolor: '#111' }}>{error}</Box>;

  return (
    <Box sx={{ bgcolor: "#111", minHeight: "100vh", color: '#fff', display: 'flex' }}>
      {/* Sidebar */}
      <Box sx={{ width: 340, minWidth: 320, maxWidth: 360, bgcolor: '#181818', p: 4, display: 'flex', flexDirection: 'column', gap: 2, borderRight: '2px solid #fff', minHeight: '100vh' }}>
        <Typography variant="h6" fontWeight={700} sx={{ color: '#fff', mb: 2, letterSpacing: 1 }}>Nueva tarea</Typography>
        <TextField
          label="Título"
          variant="standard"
          value={input}
          onChange={e => setInput(e.target.value)}
          fullWidth
          InputProps={{ style: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#fff' } }}
        />
        <TextField
          label="Descripción"
          variant="standard"
          value={desc}
          onChange={e => setDesc(e.target.value)}
          fullWidth
          InputProps={{ style: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#fff' } }}
        />
        <TextField
          label="Asignado a"
          variant="standard"
          value={assignedTo}
          onChange={e => setAssignedTo(e.target.value)}
          fullWidth
          InputProps={{ style: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#fff' } }}
        />
        <TextField
          label="Detalles"
          variant="standard"
          value={details}
          onChange={e => setDetails(e.target.value)}
          fullWidth
          InputProps={{ style: { color: '#fff' } }}
          InputLabelProps={{ style: { color: '#fff' } }}
        />
        <Box sx={{ display: 'flex', justifyContent: 'flex-end', mt: 2 }}>
          <IconButton sx={{ bgcolor: '#fff', color: '#111', '&:hover': { bgcolor: '#eee' } }} onClick={handleAdd} aria-label="Agregar tarea">
            <AddCircleOutlineIcon />
          </IconButton>
        </Box>
      </Box>
      {/* Tablero principal */}
      <Box sx={{ flex: 1, display: 'flex', alignItems: 'flex-start', justifyContent: 'center', p: 4, minHeight: '90vh' }}>
        <DragDropContext onDragEnd={onDragEnd}>
          <Box sx={{ display: 'flex', gap: 0, justifyContent: 'center', alignItems: 'flex-start', border: '1px solid #fff', borderRadius: 3, overflow: 'hidden', width: '100%', minHeight: '80vh' }}>
            {columns.map((col, idx) => (
              <Paper key={col.key} elevation={0} sx={{
                p: 3,
                borderRadius: 0,
                width: 400,
                minWidth: 400,
                maxWidth: 400,
                bgcolor: '#222',
                borderRight: idx < columns.length - 1 ? '2px solid #fff' : 'none',
                borderLeft: idx === 0 ? 'none' : undefined,
                boxShadow: 'none',
                flex: 'none',
                minHeight: 900,
                color: '#fff',
                display: 'flex',
                flexDirection: 'column',
                alignItems: 'stretch',
              }}>
                <Typography variant="h6" fontWeight={700} gutterBottom sx={{ color: '#fff', letterSpacing: 1 }}>{col.title}</Typography>
                <Divider sx={{ mb: 2, bgcolor: '#fff' }} />
                <Droppable droppableId={col.key}>
                  {(provided) => (
                    <List ref={provided.innerRef} {...provided.droppableProps} sx={{ minHeight: 500 }}>
                      {grouped[col.key].length === 0 && (
                        <ListItem sx={{ color: '#888', fontStyle: 'italic', justifyContent: 'center', minHeight: 80 }}>
                          Sin tareas
                        </ListItem>
                      )}
                      {grouped[col.key].map((task: any, idx: number) => (
                        <Draggable key={task.id} draggableId={String(task.id)} index={idx}>
                          {(provided, snapshot) => (
                            <ListItem
                              ref={provided.innerRef}
                              {...provided.draggableProps}
                              {...provided.dragHandleProps}
                              disablePadding
                              sx={{
                                mb: 3,
                                bgcolor: snapshot.isDragging ? '#333' : '#181818',
                                borderRadius: 3,
                                boxShadow: snapshot.isDragging ? 6 : 2,
                                borderLeft: '4px solid #fff',
                                transition: 'background 0.2s',
                                px: 3,
                                py: 2.5,
                                display: 'flex',
                                flexDirection: 'column',
                                alignItems: 'flex-start',
                                minHeight: 120,
                                color: '#fff',
                                fontSize: 18,
                              }}
                            >
                              <Box sx={{ width: '100%', display: 'flex', alignItems: 'center' }}>
                                <ListItemIcon sx={{ minWidth: 36, color: '#fff' }}>
                                  <CheckCircleIcon color={task.status === "done" ? "success" : "disabled"} />
                                </ListItemIcon>
                                <ListItemText
                                  primary={task.title}
                                  sx={{
                                    textDecoration: task.status === "done" ? "line-through" : "none",
                                    fontWeight: 600,
                                    color: '#fff',
                                    fontSize: 20
                                  }}
                                />
                              </Box>
                              {task.description && (
                                <Typography variant="body2" sx={{ color: '#eee', mt: 1, mb: 1 }}>
                                  {task.description}
                                </Typography>
                              )}
                              {task.assignedTo && (
                                <Typography variant="caption" sx={{ color: '#bbb', mb: 1 }}>
                                  Asignado a: {task.assignedTo}
                                </Typography>
                              )}
                              {task.details && (
                                <Typography variant="caption" sx={{ color: '#bbb', mb: 1 }}>
                                  {task.details}
                                </Typography>
                              )}
                              <IconButton size="small" sx={{ ml: 'auto', color: '#f55' }} onClick={async () => {
                                await import('../utils/api').then(mod => mod.deleteTask(task.id));
                                setTasks(tasks => tasks.filter(t => t.id !== task.id));
                              }}>
                                <span style={{ fontWeight: 700, fontSize: 22 }}>×</span>
                              </IconButton>
                            </ListItem>
                          )}
                        </Draggable>
                      ))}
                      {provided.placeholder}
                    </List>
                  )}
                </Droppable>
              </Paper>
            ))}
          </Box>
        </DragDropContext>
      </Box>
    </Box>
  );
}
