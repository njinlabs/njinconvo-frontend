import client from "../../client";
import { MeetingParams } from "./store";

export default function update({
  id,
  group_id: groupId,
  links,
  files,
  ...data
}: MeetingParams) {
  const formData = new FormData();
  for (const key in data) {
    formData.append(key, `${data[key as keyof typeof data]!}`);
  }

  let i = 0;
  for (const link of links || []) {
    if (link.id) {
      formData.append(`links[${i}][id]`, `${link.id}`);
    }
    formData.append(`links[${i}][title]`, `${link.title}`);
    formData.append(`links[${i}][url]`, `${link.url}`);
    i++;
  }

  i = 0;
  for (const file of files?.filter((el) => el.file instanceof File) || []) {
    formData.append(`files[${i}]`, file.file as File);
    i++;
  }

  i = 0;
  for (const file of files?.filter((el) => el.id) || []) {
    formData.append(`old_files[${i}]`, `${file.id}`);
    i++;
  }

  return client
    .put(`/group/${groupId}/meeting/${id}`, formData)
    .then((response) => response.data);
}
