
"use client";
import * as React from "react";
import { AppBar, Box, Toolbar, Typography, Button, Container, Paper, List, ListItem, ListItemIcon, ListItemText, Divider, TextField, IconButton } from "@mui/material";
import CheckCircleIcon from '@mui/icons-material/CheckCircle';
import AddCircleOutlineIcon from '@mui/icons-material/AddCircleOutline';

export default function Home() {
  const [tasks, setTasks] = React.useState([
    { id: 1, text: "Probar login", done: true },
    { id: 2, text: "Probar registro", done: false },
    { id: 3, text: "Probar dashboard", done: false },
  ]);
  const [input, setInput] = React.useState("");

  const handleAdd = () => {
    if (input.trim()) {
      setTasks([...tasks, { id: Date.now(), text: input, done: false }]);
      setInput("");
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
      <Container maxWidth="sm" sx={{ mt: 6 }}>
        <Paper elevation={3} sx={{ p: 4, borderRadius: 3 }}>
          <Typography variant="h5" gutterBottom fontWeight={700}>
            Lista de tareas para pruebas E2E
          </Typography>
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
          <Divider sx={{ mb: 2 }} />
          <List>
            {tasks.map(task => (
              <ListItem key={task.id} disablePadding>
                <ListItemIcon>
                  <CheckCircleIcon color={task.done ? "success" : "disabled"} />
                </ListItemIcon>
                <ListItemText
                  primary={task.text}
                  sx={{ textDecoration: task.done ? "line-through" : "none" }}
                />
              </ListItem>
            ))}
          </List>
        </Paper>
      </Container>
    </Box>
  );
}
