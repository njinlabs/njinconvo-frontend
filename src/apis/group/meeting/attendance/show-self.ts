import client from "../../../client";

export default function showSelf({
  groupId,
  id,
}: {
  groupId: number | string;
  id: number | string;
}) {
  return client
    .get(`/group/${groupId}/meeting/${id}/attendance/self`)
    .then((response) => response.data);
}
