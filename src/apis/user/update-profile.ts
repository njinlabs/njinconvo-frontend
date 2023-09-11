import { UserData } from "../../redux/slices/user";
import client from "../client";

export default function updateProfile(data: Partial<UserData>) {
  const formData = new FormData();
  for (const key in data) {
    const value = data[key as keyof typeof data];
    if (typeof value === "string" || value instanceof File) {
      formData.append(key, value);
    }
  }
  return client
    .put("/user/profile", formData)
    .then((response) => response.data);
}
