import { createClient, groq } from "next-sanity";
import client from "./client-config";

export async function getHomepage() {
  return createClient(client).fetch(groq`*[_type == "homepage"]{
      _id,
      _createdAt,
      title,
      subtitle,
      "image": {
        "url": image.asset->url,
        "alt": image.alt
      },
      callout,
      next_league
    }[0]`);
}

export async function getRules() {
  return createClient(client).fetch(groq`*[_type == "rules"]{
      _id,
      _createdAt,
      Current,
      Midway
    }[0]`);
}
