export const structure = (S) =>
  S.list()
    .title("Website copy")
    .items([
      S.listItem()
        .title("Homepage and Footer")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.divider(),
      S.listItem()
        .title("Rules page")
        .id("rules")
        .child(S.document().schemaType("rules").documentId("rules")),
      //   ...S.documentTypeListItems().filter(
      //     (item) =>
      //       ["project"].includes(item.getId()) || ["page"].includes(item.getId())
      //   ),
    ]);
