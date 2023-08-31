import client from "../../client";

export default function signIn({
  email,
  password,
}: {
  email: string;
  password: string;
}) {
  return client
    .get("/auth/sign", {
      params: {
        email,
        password,
      },
    })
    .then((response) => response.data);
}
