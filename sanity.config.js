"use client";

import { defineConfig } from "sanity";
import { structureTool } from "sanity/structure";
import { visionTool } from "@sanity/vision";
import { schemaTypes } from "./sanity/schemas";

export default defineConfig({
  name: "default",
  title: "HI Tennis League - Sanity",
  basePath: "/studio",
  projectId: "drttmp48",
  dataset: "production",
  apiVersion: "2023-10-04",

  plugins: [structureTool(), visionTool()],

  schema: {
    types: schemaTypes,
  },
});

// import { defineConfig } from "sanity";
// import { deskTool } from "sanity/desk";
// import { visionTool } from "@sanity/vision";
// import schemas from "./sanity/schemas";
// import { structure } from "./sanity/structure";

// // Define the actions that should be available for singleton documents
// const singletonActions = new Set(["publish", "discardChanges", "restore"]);
// // Define the singleton document types
// const singletonTypes = new Set(["hello"]);

// const config = defineConfig({
//   projectId: "izfocs8g",
//   dataset: "production",
//   title: "kapehe-sanity",
//   apiVersion: "2023-10-04",
//   basePath: "/admin",
//   plugins: [deskTool({ structure }), visionTool()],
//   schema: {
//     types: schemas,
//     // Filter out singleton types from the global “New document” menu options
//     templates: (templates) =>
//       templates.filter(({ schemaType }) => !singletonTypes.has(schemaType)),
//   },
//   document: {
//     // For singleton types, filter out actions that are not explicitly included
//     // in the `singletonActions` list defined above
//     actions: (input, context) =>
//       singletonTypes.has(context.schemaType)
//         ? input.filter(({ action }) => action && singletonActions.has(action))
//         : input,
//   },
// });

// export default config;
