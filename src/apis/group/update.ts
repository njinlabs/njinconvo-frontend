import client from "../client";

export default function update({
  name,
  id,
}: {
  id: number | string;
  name: string;
}) {
  return client.put(`/group/${id}`, { name }).then((response) => response.data);
}
