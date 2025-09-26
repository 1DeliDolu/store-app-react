import { LogoutOutlined } from "@mui/icons-material";
import { useState } from "react";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";

export default function RegisterPage() {
  const [username, setUsername] = useState("");
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  return (
    <Container>
      <h1>Register Page</h1>
      <Paper sx={{ p: 2 }} elevation={3}>
        <Avatar sx={{ mx: "auto", mb: 2, bgcolor: "secondary.main" }}>
          <LogoutOutlined />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          align="center"
          mb={2}
          sx={{ color: "secondary.dark" }}
        >
          Giriş Yap
        </Typography>
        <Box
          component="form"
          sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField label="Username" type="text" fullWidth required />
          <TextField label="Email" type="email" fullWidth required />
          <TextField label="Password" type="password" fullWidth required />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Kayıt Ol
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
