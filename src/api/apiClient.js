import axios from "axios";
import { toast } from "react-toastify";
import { router } from "../App";

axios.defaults.baseURL = "http://localhost:5001/";

axios.interceptors.response.use(
  (response) => response,
  (error) => {
    // Network / CORS errors may not have a response
    if (!error.response) {
      toast.error("Network error");
      return Promise.reject(error);
    }

    const { data, status } = error.response;

    // Handle known status codes with normalized responses
    if (status === 400) {
      toast.error(data?.message || "Bad request");
      return Promise.reject(data || error);
    }

    if (status === 401) {
      toast.error(data?.message || "Unauthorized");
      return Promise.reject(data || error);
    }

    if (status === 403) {
      // Normalize validation errors into a flat string array
      if (data?.errors) {
        const errors = [];
        for (const key in data.errors) {
          const val = data.errors[key];
          if (Array.isArray(val)) {
            errors.push(...val);
          } else if (typeof val === "string") {
            errors.push(val);
          } else if (Array.isArray(val) && val.length === 0) {
            // skip
          } else {
            errors.push(String(val));
          }
        }

        const result = { errors, message: data?.message || "Validation error" };
        return Promise.reject(result);
      }

      toast.error(data?.message || "Forbidden");
      return Promise.reject(data || error);
    }

    if (status === 404) {
      router.navigate("/errors/not-found");
      return Promise.reject(data || error);
    }

    if (status === 500) {
      router.navigate("/errors/server-error", {
        state: { error: data, status },
      });
      return Promise.reject(data || error);
    }

    return Promise.reject(error);
  }
);

const methods = {
  get: (url) => axios.get(url).then((response) => response.data),
  post: (url, body) => axios.post(url, body).then((response) => response.data),
  put: (url, body) => axios.put(url, body).then((response) => response.data),
  delete: (url) => axios.delete(url).then((response) => response.data),
};

const products = {
  list: () => methods.get("products"),
  details: (id) => methods.get(`products/${id}`),
};

const errors = {
  get400Error: () =>
    methods.get("errors/bad-request").catch((error) => console.log(error)),
  get401Error: () =>
    methods.get("errors/unauthorized").catch((error) => console.log(error)),
  get403Error: () => methods.get("errors/validation-error"),
  get404Error: () =>
    methods.get("errors/not-found").catch((error) => console.log(error)),
  get500Error: () =>
    methods.get("errors/server-error").catch((error) => console.log(error)),
};

const requests = {
  products,
  errors,
};

export default requests;
