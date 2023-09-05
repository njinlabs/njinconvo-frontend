import client from "../../client";

export default function destroy({
  classroomId,
  id,
}: {
  classroomId: string | number;
  id: string | number;
}) {
  return client
    .delete(`/classroom/${classroomId}/meeting/${id}`)
    .then((response) => response.data);
}
