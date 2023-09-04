import client from "../client";

export default function join(data: { code: string }) {
  return client.post("/classroom/join", data).then((response) => response.data);
}
