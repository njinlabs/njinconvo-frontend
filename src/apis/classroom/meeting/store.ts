import client from "../../client";

export type LinkType = {
  id?: number | string;
  rowId?: number | string;
  title: string;
  url: string;
};

export type MeetingParams = {
  id?: number | string;
  title: string;
  description: string;
  is_draft: boolean;
  classroom_id?: number | string;
  links?: LinkType[];
};

export default function store({
  classroom_id: classroomId,
  ...data
}: MeetingParams) {
  return client
    .post(`/classroom/${classroomId}/meeting`, data)
    .then((response) => response.data);
}
