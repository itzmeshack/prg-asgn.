import { auth } from "../../auth";

export async function requireManager() {
  const session = await auth();
  const role = (session?.user as any)?.role;

  if (!session || role !== "MANAGER") {
    return false;
  }

  return true;
}
