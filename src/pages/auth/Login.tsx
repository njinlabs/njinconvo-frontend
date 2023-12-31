import Button from "../../components/Button";
import TextField from "../../components/form/TextField";
import getLang from "../../languages";
import { Link } from "react-router-dom";
import { useFetcher } from "../../utilities/fetcher";
import signIn from "../../apis/auth/sign/sign-in";
import { useCookies } from "react-cookie";
import { toast } from "react-toastify";
import { useForm } from "react-hook-form";
import { Fragment } from "react";
import { Helmet } from "react-helmet-async";
import logo from "../../assets/logo.svg";

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
      setCookies("token", data.token, {
        path: "/",
        maxAge: 60 * 60 * 24 * 365,
      });
    },
  });

  return (
    <Fragment>
      <Helmet>
        <title>{getLang().signIn}</title>
      </Helmet>
      <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center justify-start lg:justify-center p-5">
        <div className="mb-8">
          <img src={logo} className="w-auto h-16" />
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
    </Fragment>
  );
}
