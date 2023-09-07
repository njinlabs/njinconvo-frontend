import client from "../../../client";

export type AttendaceDetailType = {
  user_id: number;
  status: "present" | "sick" | "permission" | "absent";
};

export type AttendanceParams = {
  allow_self_attendance: boolean;
  self_attendance_due?: string;
  show_it_to_participants: boolean;
  details: AttendaceDetailType[];
};

export default function store({
  classroomId,
  id,
  ...data
}: AttendanceParams & {
  classroomId: string | number;
  id: string | number;
}) {
  return client
    .put(`/classroom/${classroomId}/meeting/${id}/attendance`, data)
    .then((response) => response.data);
}
