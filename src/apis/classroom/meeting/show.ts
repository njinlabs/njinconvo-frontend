import client from "../../client";

export default function show({
  id,
  classroomId,
}: {
  id: string | number;
  classroomId: string | number;
}) {
  return client
    .get(`/classroom/${classroomId}/meeting/${id}`)
    .then((response) => response.data);
}
