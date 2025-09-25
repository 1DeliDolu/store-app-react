import {
  Alert,
  AlertTitle,
  Box,
  Button,
  List,
  ListItem,
  ListItemText,
} from "@mui/material";
import requests from "../../api/apiClient";
import { useState } from "react";

export default function ErrorPage() {
  const [validationError, setValidationError] = useState({});

  function getValidationErrors() {
    requests.errors
      .get403Error()
      .then(() => {
        // no-op if backend unexpectedly returns 200
      })
      .catch((err) => {
        // err can be our normalized object { errors: string[], message }
        // or an axios error (with response.data). Normalize here.
        if (err && err.errors) {
          setValidationError(err);
        } else if (err && err.response && err.response.data) {
          const data = err.response.data;
          // try to flatten data.errors if present
          const errors = [];
          if (data.errors) {
            for (const key in data.errors) {
              const val = data.errors[key];
              if (Array.isArray(val)) errors.push(...val);
              else if (typeof val === "string") errors.push(val);
            }
          }
          setValidationError({
            errors,
            message: data.message || "Validation error",
          });
        } else {
          // fallback: show a toast and clear state
          setValidationError(null);
        }
      });
  }

  return (
    <Box>
      {validationError && validationError.errors && (
        <Alert severity="error" sx={{ mb: 2 }}>
          <AlertTitle>{validationError.message}</AlertTitle>
          <List>
            {validationError.errors.map((errorMsg, index) => (
              <ListItem key={index}>
                <ListItemText>{errorMsg}</ListItemText>
              </ListItem>
            ))}
          </List>
        </Alert>
      )}

      <Button
        sx={{ mr: 2 }}
        variant="outlined"
        color="error"
        onClick={() => requests.errors.get400Error()}
      >
        Bad Request
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="outlined"
        color="error"
        onClick={() => requests.errors.get401Error()}
      >
        UnAuthorized
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="outlined"
        color="error"
        onClick={getValidationErrors}
      >
        Validation Error
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="outlined"
        color="error"
        onClick={() => requests.errors.get404Error()}
      >
        Not Found
      </Button>
      <Button
        sx={{ mr: 2 }}
        variant="outlined"
        color="error"
        onClick={() => requests.errors.get500Error()}
      >
        Server Error
      </Button>
    </Box>
  );
}
