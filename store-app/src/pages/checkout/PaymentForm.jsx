import {
  Grid,
  TextField,
  MenuItem,
  InputLabel,
  FormControl,
  Select,
} from "@mui/material";
import { useFormContext } from "react-hook-form";
import {
  luhnCheck,
  monthsOptions,
  yearsOptions,
  validateExpiryMonthYear,
} from "../../utils/cartCheck";

export default function PaymentForm() {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
  } = useFormContext();

  const months = monthsOptions();
  const years = yearsOptions(15);

  // watch month/year to validate together if needed
  const expiryMonth = watch("expiryMonth");
  const expiryYear = watch("expiryYear");

  return (
    <Grid container spacing={2}>
      <Grid item xs={12} md={6}>
        <TextField
          {...register("cardname", {
            required: "Kart sahibinin adı gerekli",
          })}
          label="Kart Üzerindeki İsim"
          size="small"
          fullWidth
          autoFocus
          autoComplete="cc-name"
          error={!!errors.cardname}
          helperText={errors.cardname?.message}
        />
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          {...register("cardnumber", {
            required: "Kart numarası gerekli",
            validate: (v) => luhnCheck(v) || "Geçersiz kart numarası",
          })}
          label="Kart Numarası"
          size="small"
          fullWidth
          autoComplete="cc-number"
          inputProps={{ inputMode: "numeric" }}
          error={!!errors.cardnumber}
          helperText={errors.cardnumber?.message}
        />
      </Grid>

      <Grid item xs={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="expiry-month-label">Ay</InputLabel>
          <Select
            labelId="expiry-month-label"
            label="Ay"
            defaultValue=""
            {...register("expiryMonth", { required: "Ay seçiniz" })}
          >
            {months.map((m) => (
              <MenuItem key={m.value} value={m.value}>
                {m.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={6} md={3}>
        <FormControl fullWidth size="small">
          <InputLabel id="expiry-year-label">Yıl</InputLabel>
          <Select
            labelId="expiry-year-label"
            label="Yıl"
            defaultValue=""
            {...register("expiryYear", { required: "Yıl seçiniz" })}
          >
            {years.map((y) => (
              <MenuItem key={y.value} value={y.value}>
                {y.label}
              </MenuItem>
            ))}
          </Select>
        </FormControl>
      </Grid>

      <Grid item xs={12} md={6}>
        <TextField
          {...register("cvv", {
            required: "CVV gerekli",
            pattern: {
              value: /^\d{3,4}$/,
              message: "CVV 3 veya 4 rakam olmalı",
            },
          })}
          label="CVV / CVC"
          size="small"
          fullWidth
          autoComplete="cc-csc"
          inputProps={{ inputMode: "numeric", maxLength: 4 }}
          error={!!errors.cvv}
          helperText={errors.cvv?.message}
        />
      </Grid>

      {/* hidden field for combined expiry validation */}
      <input
        type="hidden"
        {...register("expiryValidation", {
          validate: () => validateExpiryMonthYear(expiryMonth, expiryYear),
        })}
      />
    </Grid>
  );
}
