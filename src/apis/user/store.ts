import { UserData } from "../../redux/slices/user";
import client from "../client";

export default function store(data: UserData) {
  return client.post("/user", data).then((response) => response.data);
}
