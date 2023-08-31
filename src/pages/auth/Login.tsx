import Button from "../../components/Button";
import TextField from "../../components/form/TextField";
import getLang from "../../languages";
import { Link } from "react-router-dom";
import { useFetcher } from "../../utilities/fetcher";
import signIn from "../../apis/auth/sign/sign-in";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";

export default function Login() {
  const setCookies = useCookies(["token"])[1];
  const {
    register,
    formState: { errors },
    handleSubmit,
  } = useForm({
    defaultValues: {
      email: "",
      password: "",
    },
  });

  const loginFetcher = useFetcher({
    api: signIn,
    onSuccess: (data) => {
      setCookies(
        "token",
        {
          token: data.token,
        },
        {
          path: "/",
          maxAge: 60 * 60 * 24 * 365,
        }
      );
    },
  });

  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center justify-center p-5">
      <div className="w-2/3 lg:w-[360px] bg-white py-8 rounded mb-5 text-center">
        Logo
      </div>
      <div className="w-full lg:w-[460px] bg-white rounded border border-gray-400 p-5 lg:p-8">
        <div className="font-bold text-xl text-gray-800 font-nunito-sans">
          {getLang().loginGreeting}
        </div>
        <form
          className="mt-5"
          onSubmit={handleSubmit((data) =>
            toast.promise(loginFetcher.process(data), {
              pending: getLang().waitAMinute,
              success: getLang().succeed,
              error: getLang().failed,
            })
          )}
        >
          <TextField
            label={getLang().email}
            containerClassName="mb-5"
            type="email"
            message={Boolean(errors.email)}
            {...register("email", {
              required: true,
            })}
          />
          <TextField
            label={getLang().password}
            type="password"
            message={Boolean(errors.password)}
            {...register("password", {
              required: true,
            })}
          />
          <Link to="/auth/forgot-password" className="text-sm">
            {getLang().forgotPassword}
          </Link>
          <Button
            type="submit"
            element={"button"}
            className="w-full mt-5 uppercase"
          >
            {getLang().signIn}
          </Button>
        </form>
      </div>
    </div>
  );
}
