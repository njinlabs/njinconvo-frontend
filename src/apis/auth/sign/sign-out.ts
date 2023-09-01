import client from "../../client";

export default function signOut({}) {
  return client.delete("/auth/sign").then((response) => response.data);
}
