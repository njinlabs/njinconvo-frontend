import client from "../../client";

export default function index({
  groupId,
  page = 1,
}: {
  page?: string | number;
  groupId: number | string;
}) {
  return client
    .get(`/group/${groupId}/meeting`, {
      params: {
        page,
      },
    })
    .then((response) => response.data);
}
