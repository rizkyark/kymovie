import { Client, Account, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
export { client, account, databases };

console.log("Appwrite endpoint:", import.meta.env.VITE_APPWRITE_ENDPOINT);
console.log("Appwrite project:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
// Note: The following comment is for debugging purposes and can be removed in production
