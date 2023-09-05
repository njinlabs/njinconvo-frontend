import client from "../client";

export default function participants({ id }: { id: number | string }) {
  return client
    .get(`/classroom/${id}/participants`)
    .then((response) => response.data);
}
