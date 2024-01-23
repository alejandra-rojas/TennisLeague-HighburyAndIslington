export const structure = (S) =>
  S.list()
    .title("Manage your website copy")
    .items([
      S.listItem()
        .title("Homepage and Footer")
        .id("homepage")
        .child(S.document().schemaType("homepage").documentId("homepage")),
      S.divider(),
      //   ...S.documentTypeListItems().filter(
      //     (item) =>
      //       ["project"].includes(item.getId()) || ["page"].includes(item.getId())
      //   ),
    ]);
