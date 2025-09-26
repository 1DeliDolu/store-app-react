import { LogoutOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Container,
  Paper,
  Typography,
  TextField,
  Button,
} from "@mui/material";
import { useState } from "react";

export default function LoginPage() {
  const [email, setEmail] = useState("info@pehlione.com");
  const [password, setPassword] = useState("12345");

  //
  const handleSubmit = (e) => {
    e.preventDefault();
    console.log({ email, password });
  };
  const handleSubmitEmail = (e) => {
    if (e.key === "Enter") {
      console.log("Enter'a basıldı email: ", email);
    }
  };
  const handleSubmitPassword = (e) => {
    if (e.key === "Enter") {
      console.log("Enter'a basıldı password: ", password);
    }
  };
  return (
    <Container>
      <h1>Login Page</h1>
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
          onSubmit={handleSubmit}
          sx={{ mb: 2, display: "flex", flexDirection: "column", gap: 2 }}
        >
          <TextField
            value={email}
            onSubmit={handleSubmitEmail}
            onChange={(e) => setEmail(e.target.value)}
            label="Email"
            type="email"
            fullWidth
            required
          />
          <TextField
            value={password}
            onChange={(e) => setPassword(e.target.value)}
            onSubmit={handleSubmitPassword}
            label="Password"
            type="password"
            fullWidth
            required
          />
          <Button type="submit" variant="contained" color="secondary" fullWidth>
            Giriş Yap
          </Button>
        </Box>
      </Paper>
    </Container>
  );
}
