import { redirect } from "next/navigation";

export default function Home() {
  // Redirect root to dashboard (protected by middleware)
  redirect("/dashboard");
}
