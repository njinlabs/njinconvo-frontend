import client from "../client";

export default function join(data: { code: string }) {
  return client.post("/group/join", data).then((response) => response.data);
}
