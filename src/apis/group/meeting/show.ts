import client from "../../client";

export default function show({
  id,
  groupId,
}: {
  id: string | number;
  groupId: string | number;
}) {
  return client
    .get(`/group/${groupId}/meeting/${id}`)
    .then((response) => response.data);
}
