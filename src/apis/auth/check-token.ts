import client from "../client";

export default function checkToken() {
  return client.get("/auth/check-token").then((response) => response.data);
}
