import { UserData } from "../../redux/slices/user";
import client from "../client";

export default function update({ id, ...data }: UserData) {
  return client.put("/user/" + id, data).then((response) => response.data);
}
