import client from "../client";

export default function changePassword({
  oldPassword,
  newPassword,
}: {
  oldPassword: string;
  newPassword: string;
}) {
  return client
    .put("/user/change-password", {
      oldPassword,
      newPassword,
    })
    .then((response) => response.data);
}
