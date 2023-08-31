import id from "./id.json";

const languages = {
  id,
};

export default function getLang(lang: keyof typeof languages = "id") {
  return languages[lang];
}
