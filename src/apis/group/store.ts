import client from "../client";

export default function store(data: { name: string }) {
  return client.post("/group", data).then((response) => response.data);
}
