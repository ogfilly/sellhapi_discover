import { cookies }  from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function ProtectedLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token       = cookieStore.get("c_token")?.value ?? null;

  if (!token) {
    redirect("/auth/login");
  }

  return <>{children}</>;
}
