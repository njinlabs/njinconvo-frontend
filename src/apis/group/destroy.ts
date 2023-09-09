import client from "../client";

export default function destroy({ id }: { id: string | number }) {
  return client.delete(`/group/${id}`).then((response) => response.data);
}
