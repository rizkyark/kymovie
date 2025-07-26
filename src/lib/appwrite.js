import { Client, Account, Databases } from "appwrite";

const client = new Client();
client
  .setEndpoint(import.meta.env.VITE_APPWRITE_ENDPOINT)
  .setProject(import.meta.env.VITE_APPWRITE_PROJECT_ID);

const account = new Account(client);
const databases = new Databases(client);
export { client, account, databases };

// Cek koneksi Appwrite (opsional, hapus di production)
// Error "User (role: guests) missing scope (account)" artinya Anda mencoba memanggil account.get() tanpa user login.
// Ini bukan error koneksi, tapi error permission (karena belum login).
// Untuk cek koneksi tanpa login, gunakan endpoint public, misal databases.list() pada database yang public, atau cukup log endpoint/project:

console.log("Appwrite endpoint:", import.meta.env.VITE_APPWRITE_ENDPOINT);
console.log("Appwrite project:", import.meta.env.VITE_APPWRITE_PROJECT_ID);
