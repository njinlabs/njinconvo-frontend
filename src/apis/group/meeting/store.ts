import client from "../../client";

export type LinkType = {
  id?: number | string;
  rowId?: number | string;
  title: string;
  url: string;
};

export type FileObject = {
  name: string;
  size: number;
  url?: string;
};

export type FileType = {
  id?: number | string;
  rowId?: number | string;
  file: File | FileObject | null;
};

export type MeetingParams = {
  id?: number | string;
  title: string;
  description: string;
  is_draft: boolean;
  group_id?: number | string;
  started_at?: string | null;
  finished_at: string | null;
  links?: LinkType[];
  files?: FileType[];
};

export default function store({
  group_id: groupId,
  files,
  links,
  ...data
}: MeetingParams) {
  const formData = new FormData();
  for (const key in data) {
    if (data[key as keyof typeof data] !== undefined) {
      formData.append(key, `${data[key as keyof typeof data]!}`);
    }
  }

  let i = 0;
  for (const link of links || []) {
    formData.append(`links[${i}][title]`, `${link.title}`);
    formData.append(`links[${i}][url]`, `${link.url}`);
    i++;
  }

  i = 0;
  for (const file of files || []) {
    if (file.file instanceof File) {
      formData.append(`files[${i}]`, file.file);
    }
    i++;
  }

  return client
    .post(`/group/${groupId}/meeting`, formData)
    .then((response) => response.data);
}
