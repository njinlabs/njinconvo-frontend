import Button from "../../components/Button";
import TextField from "../../components/form/TextField";
import getLang from "../../languages";
import { Link } from "react-router-dom";

export default function Login() {
  return (
    <div className="w-full min-h-screen bg-gray-200 flex flex-col items-center justify-center p-5">
      <div className="w-2/3 lg:w-[360px] bg-white py-8 rounded mb-5 text-center">
        Logo
      </div>
      <div className="w-full lg:w-[460px] bg-white rounded border border-gray-400 p-5 lg:p-8">
        <div className="font-bold text-xl text-gray-800 font-nunito-sans">
          {getLang().loginGreeting}
        </div>
        <form className="mt-5">
          <TextField
            label={getLang().email}
            containerClassName="mb-5"
            type="text"
          />
          <TextField label={getLang().password} type="password" />
          <Link to="/auth/forgot-password" className="text-sm">
            {getLang().forgotPassword}
          </Link>
          <Button
            type="button"
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
