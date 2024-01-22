"use client";

import { NextStudio } from "next-sanity/studio";
//https://github.com/sanity-io/next-sanity -- LOOK DOCS
import config from "../../../../sanity.config";

export default function StudioPage() {
  return <NextStudio config={config} />;
}
