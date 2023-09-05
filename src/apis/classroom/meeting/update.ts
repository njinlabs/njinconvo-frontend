import client from "../../client";
import { MeetingParams } from "./store";

export default function update({
  id,
  classroom_id: classroomId,
  ...data
}: MeetingParams) {
  return client
    .put(`/classroom/${classroomId}/meeting/${id}`, data)
    .then((response) => response.data);
}
