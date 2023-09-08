import client from "../client";

export default function show({ id }: { id: number | string }) {
  return client.get("/group/" + id).then((response) => response.data);
}
