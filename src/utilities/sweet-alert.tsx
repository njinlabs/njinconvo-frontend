import Swal from "sweetalert2";
import withReactContent, {
  ReactSweetAlertOptions,
} from "sweetalert2-react-content";
import { CgCheckO, CgCloseO, CgDanger } from "react-icons/cg";

const MySwal = withReactContent(Swal);

export const successAlert = ({ ...options }: ReactSweetAlertOptions) => {
  return MySwal.fire({
    ...options,
    icon: "success",
    customClass: "alert",
    iconHtml: <CgCheckO />,
  });
};

export const errorAlert = ({ ...options }: ReactSweetAlertOptions) => {
  return MySwal.fire({
    ...options,
    icon: "error",
    customClass: "alert",
    iconHtml: <CgCloseO />,
  });
};

export const warningAlert = ({ ...options }: ReactSweetAlertOptions) => {
  return MySwal.fire({
    ...options,
    icon: "warning",
    customClass: "alert",
    iconHtml: <CgDanger />,
  });
};
