import { Button } from "@/components/ui/button";
import Link from "next/link";
export default async function Home() {
  return (
    <main className="flex justify-center items-center flex-col h-dvh">
      <h1 className="py-5 text-3xl font-semibold">The Dexes Company</h1>
      <div className="flex gap-3">
        <Link href={"/login"}>
          <Button className="w-80">Login</Button>
        </Link>
      </div>
    </main>
  );
}
