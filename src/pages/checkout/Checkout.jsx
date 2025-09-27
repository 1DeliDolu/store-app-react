import {
  Box,
  Button,
  Paper,
  Step,
  StepLabel,
  Stepper,
  Typography,
} from "@mui/material";
import Grid from "@mui/material/Grid";
import Info from "./Info";
import AddressForm from "./AddressForm";
import PaymentForm from "./PaymentForm";
import Review from "./Review";
import { useState } from "react";
import { ChevronLeftRounded, ChevronRightRounded } from "@mui/icons-material";

const steps = ["Teslimat Bilgileri", "Ödeme", "Sipariş Özeti"];

function getStepContent(step) {
  switch (step) {
    case 0:
      return <AddressForm />;
    case 1:
      return <PaymentForm />;
    case 2:
      return <Review />;
  }
}

export default function CheckoutPage() {
  const [activeStep, setActiveStep] = useState(0);

  function handlePrevious() {
    setActiveStep(activeStep - 1);
  }

  function handleNext() {
    setActiveStep(activeStep + 1);
  }
  return (
    <Paper>
      <Grid container spacing={3}>
        <Grid
          item
          md={4}
          xs={12}
          sx={{ p: 3, borderRight: "1px solid", borderColor: "divider" }}
        >
          <Info />
        </Grid>
        <Grid item md={8} xs={12} sx={{ p: 3 }}>
          <Stepper activeStep={activeStep} sx={{ height: 40, mb: 4 }}>
            {steps.map((label) => (
              <Step key={label} sx={{ color: "secondary" }}>
                <StepLabel>{label}</StepLabel>
              </Step>
            ))}
          </Stepper>
          {activeStep === steps.length ? (
            <Typography variant="h5">Siparişinizi aldık.</Typography>
          ) : (
            <>
              {getStepContent(activeStep)}

              <Box
                sx={[
                  { display: "flex" },
                  activeStep !== 0
                    ? { justifyContent: "space-between" }
                    : { justifyContent: "flex-end" },
                ]}
              >
                {activeStep !== 0 && (
                  <Button
                    onClick={handlePrevious}
                    startIcon={<ChevronLeftRounded />}
                    variant="contained"
                    color="secondary"
                  >
                    Geri
                  </Button>
                )}

                <Button
                  onClick={handleNext}
                  startIcon={<ChevronRightRounded />}
                  variant="contained"
                  color="secondary"
                >
                  İleri
                </Button>
              </Box>
            </>
          )}
        </Grid>
      </Grid>
    </Paper>
  );
}
