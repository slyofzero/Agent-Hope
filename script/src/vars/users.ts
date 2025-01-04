import { getDocument } from "@/firebase";
import { StoredUser } from "@/types/user";

export let users: StoredUser[] = [];

export async function syncUsers() {
  users = await getDocument<StoredUser>({ collectionName: "users" });
}
