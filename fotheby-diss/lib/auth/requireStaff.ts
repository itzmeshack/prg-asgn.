import { auth } from "../../auth";


export async function requireStaff() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session || role !== "STAFF") {
    return false;
  }
  return true;
}
