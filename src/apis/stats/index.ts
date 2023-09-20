import client from "../client";

export default function index() {
  return client.get("/stats").then((response) => response.data);
}
