export default function getUrl(url: string) {
  if (url.match(/^(https?:\/\/)?([\da-z.-]+)\.([a-z.]{2,6})([\/\w.-]*)*\/?$/)) {
    return url;
  }
  return `${import.meta.env.VITE_BASE_URL}${url}`;
}
