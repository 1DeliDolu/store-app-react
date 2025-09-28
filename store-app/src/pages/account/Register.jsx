import { LockOutlined } from "@mui/icons-material";
import {
  Avatar,
  Box,
  Button,
  CircularProgress,
  Container,
  Grid,
  Paper,
  TextField,
  Typography,
} from "@mui/material";
import { useForm } from "react-hook-form";
import { useDispatch, useSelector } from "react-redux";
import { registerUser } from "./accountSlice";

export default function RegisterPage() {
  const dispatch = useDispatch();
  const { status } = useSelector((state) => state.account);
  const {
    register,
    handleSubmit,
    formState: { errors, isValid },
  } = useForm({
    mode: "onChange",
    defaultValues: {
      username: "",
      email: "",
      password: "",
      firstname: "",
      lastname: "",
      street: "",
      houseNumber: "",
      postalCode: "",
      city: "",
      phone: "",
    },
  });

  function handleForm(data) {
    dispatch(registerUser(data));
  }

  return (
    <Container maxWidth="xs">
      <Paper sx={{ padding: 2 }} elevation={3}>
        <Avatar sx={{ mx: "auto", mb: 2, color: "secondary.main" }}>
          <LockOutlined />
        </Avatar>
        <Typography
          component="h1"
          variant="h5"
          sx={{ textAlign: "center", mb: 2 }}
        >
          Register
        </Typography>
        <Box
          component="form"
          onSubmit={handleSubmit(handleForm)}
          noValidate
          sx={{ mb: 2 }}
        >
          <Grid container spacing={2}>
            <Grid item xs={12} md={6}>
              <TextField
                {...register("firstname", {
                  required: "Ad gerekli",
                })}
                label="Ad"
                size="small"
                fullWidth
                autoFocus
                autoComplete="given-name"
                error={!!errors.firstname}
                helperText={errors.firstname?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register("lastname", {
                  required: "Soyad gerekli",
                })}
                label="Soyad"
                size="small"
                fullWidth
                autoComplete="family-name"
                error={!!errors.lastname}
                helperText={errors.lastname?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("street", {
                  required: "Cadde/Sokak gerekli",
                })}
                label="Cadde / Sokak (Straße)"
                size="small"
                fullWidth
                autoComplete="address-line1"
                error={!!errors.street}
                helperText={errors.street?.message}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                {...register("houseNumber", {
                  required: "Hausnummer gerekli",
                  pattern: {
                    value: /^[0-9A-Za-z\-\/]{1,8}$/,
                    message: "Geçersiz Hausnummer",
                  },
                })}
                label="Hausnr."
                size="small"
                fullWidth
                autoComplete="address-line2"
                error={!!errors.houseNumber}
                helperText={errors.houseNumber?.message}
              />
            </Grid>

            <Grid item xs={6} md={3}>
              <TextField
                {...register("postalCode", {
                  required: "PLZ gerekli",
                  pattern: {
                    value: /^\d{5}$/, // German PLZ
                    message: "PLZ 5 haneli olmalı",
                  },
                })}
                label="PLZ"
                size="small"
                fullWidth
                autoComplete="postal-code"
                error={!!errors.postalCode}
                helperText={errors.postalCode?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register("city", {
                  required: "Şehir gerekli",
                })}
                label="Şehir"
                size="small"
                fullWidth
                autoComplete="address-level2"
                error={!!errors.city}
                helperText={errors.city?.message}
              />
            </Grid>

            <Grid item xs={12} md={6}>
              <TextField
                {...register("phone", {
                  required: "Telefon gerekli",
                  pattern: {
                    value: /^[+0-9()\-\s]{6,25}$/,
                    message: "Geçersiz telefon numarası",
                  },
                })}
                label="Telefon"
                size="small"
                fullWidth
                autoComplete="tel"
                error={!!errors.phone}
                helperText={errors.phone?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("username", {
                  required: "Kullanıcı adı gerekli",
                  minLength: {
                    value: 3,
                    message: "username min. 3 karakter olmalıdır.",
                  },
                })}
                label="Kullanıcı Adı"
                size="small"
                fullWidth
                sx={{ mt: 1 }}
                error={!!errors.username}
                helperText={errors.username?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("email", {
                  required: "Email gerekli",
                  pattern: {
                    value: /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
                    message: "Geçerli bir email girin",
                  },
                })}
                label="Email"
                size="small"
                fullWidth
                error={!!errors.email}
                helperText={errors.email?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <TextField
                {...register("password", {
                  required: "Parola gerekli",
                  minLength: {
                    value: 6,
                    message: "Parola en az 6 karakter olmalı",
                  },
                })}
                type="password"
                label="Parola"
                size="small"
                fullWidth
                error={!!errors.password}
                helperText={errors.password?.message}
              />
            </Grid>

            <Grid item xs={12}>
              <Button
                type="submit"
                variant="contained"
                fullWidth
                sx={{ mt: 1 }}
                disabled={!isValid || status === "pending"}
                color="secondary"
              >
                {status === "pending" ? (
                  <CircularProgress size="25px" />
                ) : (
                  "Kayıt Ol"
                )}
              </Button>
            </Grid>
          </Grid>
        </Box>
      </Paper>
    </Container>
  );
}
