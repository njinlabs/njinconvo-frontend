import client from "../client";

export default function index({
  page = 1,
  search,
  order,
  direction,
}: {
  page?: number;
  search?: string;
  order?: string;
  direction?: "asc" | "desc";
}) {
  return client
    .get("/group", {
      params: {
        page,
        search,
        order,
        direction,
      },
    })
    .then((response) => response.data);
}
