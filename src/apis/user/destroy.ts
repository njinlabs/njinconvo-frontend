import client from "../client";

export default function destroy({ id }: { id: number }) {
  return client.delete("/user/" + id).then((response) => response.data);
}
