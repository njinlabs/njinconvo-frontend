import client from "../../client";

export default function destroy({
  groupId,
  id,
}: {
  groupId: string | number;
  id: string | number;
}) {
  return client
    .delete(`/group/${groupId}/meeting/${id}`)
    .then((response) => response.data);
}
