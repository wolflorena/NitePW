import Swal from "sweetalert2";

export const confirmAlert = (text: string) => {
  return Swal.fire({
    title: "Are you sure?",
    text,
    icon: "warning",
    showCancelButton: true,
    confirmButtonColor: "#ffd369",
    cancelButtonColor: "#222831",
    confirmButtonText: "Yes",
  });
};

export const errorAlert = (text: string) => {
  return Swal.fire({
    icon: "error",
    title: "Error",
    text,
  });
};

export const successAlert = (text: string) => {
  return Swal.fire({
    icon: "success",
    title: "Success",
    text,
  });
};
