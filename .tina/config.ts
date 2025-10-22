import { defineConfig } from 'tinacms';

export default defineConfig({
  branch: 'main', // or your default branch
  clientId: process.env.TINA_PUBLIC_CLIENT_ID,
  token: process.env.TINA_TOKEN,
  build: {
    publicFolder: "public",
    outputFolder: "admin",
  },
  media: {
    tina: {
      mediaRoot: "",
      publicFolder: "public",
    },
  },
  schema: {
    collections: [
      {
        name: "post",
        label: "Posts",
        path: "content/posts",
        fields: [
          { name: "title", label: "Title", type: "string" },
          { name: "body", label: "Body", type: "rich-text" },
        ],
      },
    ],
  },
});