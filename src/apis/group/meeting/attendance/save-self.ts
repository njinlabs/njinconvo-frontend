import client from "../../../client";

export default function saveSelf({
  groupId,
  id,
  status,
}: {
  groupId: number | string;
  id: number | string;
  status: "present" | "sick" | "permission" | "absent";
}) {
  return client
    .put(`/group/${groupId}/meeting/${id}/attendance/self`, { status })
    .then((response) => response.data);
}
