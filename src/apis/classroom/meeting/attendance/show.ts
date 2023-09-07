import client from "../../../client";

export default function show({
  classroomId,
  id,
}: {
  classroomId: string | number;
  id: string | number;
}) {
  return client
    .get(`/classroom/${classroomId}/meeting/${id}/attendance`)
    .then((response) => response.data);
}
