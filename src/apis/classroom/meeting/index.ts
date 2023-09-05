import client from "../../client";

export default function index({
  classroomId,
  page = 1,
}: {
  page?: string | number;
  classroomId: number | string;
}) {
  return client
    .get(`/classroom/${classroomId}/meeting`, {
      params: {
        page,
      },
    })
    .then((response) => response.data);
}
