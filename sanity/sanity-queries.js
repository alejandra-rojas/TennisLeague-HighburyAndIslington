import { createClient, groq } from "next-sanity";
import client from "./client-config";

export async function getHomepage() {
  return createClient(client).fetch(groq`*[_type == "homepage"]{
      _id,
      _createdAt,
      title,
      subtitle,
      callout,
      next_league
    }[0]`);
}
