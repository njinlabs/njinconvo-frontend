import client from "../client";

export default function leave({ id }: { id: string | number }) {
  return client.delete(`/group/${id}/leave`).then((response) => response.data);
}
