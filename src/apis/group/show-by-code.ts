import client from "../client";

export default function showByCode({ code }: { code: string }): Promise<any> {
  return client
    .get("/group/code", {
      params: { code },
    })
    .then((response) => response.data);
}
