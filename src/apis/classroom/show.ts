import client from "../client";

export default function show({ id }: { id: number | string }) {
  return client.get("/classroom/" + id).then((response) => response.data);
}
