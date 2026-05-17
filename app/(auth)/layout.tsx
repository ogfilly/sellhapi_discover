import { cookies }  from "next/headers";
import { redirect } from "next/navigation";

export const runtime = "edge";

export default async function AuthLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const cookieStore = await cookies();
  const token       = cookieStore.get("c_token")?.value ?? null;

  if (token) {
    redirect("/");
  }

  return <>{children}</>;
}
