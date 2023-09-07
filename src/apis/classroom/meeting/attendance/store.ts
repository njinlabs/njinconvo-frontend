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
