import client from "../../client";

export type MeetingParams = {
  id?: number | string;
  title: string;
  description: string;
  is_draft: boolean;
  classroom_id?: number | string;
};

export default function store({
  classroom_id: classroomId,
  ...data
}: MeetingParams) {
  return client
    .post(`/classroom/${classroomId}/meeting`, data)
    .then((response) => response.data);
}
