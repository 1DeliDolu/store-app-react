import { Grid, TextField } from "@mui/material";
import { useFormContext } from "react-hook-form";

export default function AddressForm() {
  const {
    register,
    formState: { errors },
  } = useFormContext();

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          {...register("firstname", {
            required: "Vorname ist erforderlich",
          })}
          label="Vorname"
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
            required: "Nachname ist erforderlich",
          })}
          label="Nachname"
          size="small"
          fullWidth
          autoComplete="family-name"
          error={!!errors.lastname}
          helperText={errors.lastname?.message}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          {...register("street", {
            required: "Straße ist erforderlich",
          })}
          label="Straße"
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
            required: "Hausnummer ist erforderlich",
            pattern: {
              value: /^[0-9A-Za-z\-\/]{1,8}$/,
              message: "Ungültige Hausnummer",
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
            required: "PLZ ist erforderlich",
            pattern: {
              value: /^\d{5}$/, // German PLZ
              message: "PLZ muss 5-stellig sein",
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
            required: "Stadt ist erforderlich",
          })}
          label="Stadt"
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
            required: "Telefonnummer ist erforderlich",
            pattern: {
              value: /^[+0-9()\-\s]{6,25}$/,
              message: "Ungültige Telefonnummer",
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
          {...register("company")}
          label="Firma (optional)"
          size="small"
          fullWidth
          autoComplete="organization"
        />
      </Grid>
    </Grid>
  );
}
