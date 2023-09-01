import client from "../client";

export default function index({ page = 1 }: { page?: number }) {
  return client
    .get("/user", {
      params: {
        page,
      },
    })
    .then((response) => response.data);
}
