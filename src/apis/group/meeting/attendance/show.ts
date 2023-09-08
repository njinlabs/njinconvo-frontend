import client from "../../../client";

export default function show({
  groupId,
  id,
}: {
  groupId: string | number;
  id: string | number;
}) {
  return client
    .get(`/group/${groupId}/meeting/${id}/attendance`)
    .then((response) => response.data);
}
