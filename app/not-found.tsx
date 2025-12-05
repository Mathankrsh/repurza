import type { Metadata } from "next";
import Link from "next/link";

import { Button } from "@/components/ui/button";
import {
  Empty,
  EmptyContent,
  EmptyDescription,
  EmptyHeader,
  EmptyTitle,
} from "@/components/ui/empty";

export const metadata: Metadata = {
  title: "404 | Repurpuz",
};

export default function NotFound() {
  return (
    <Empty>
      <EmptyHeader />
      <EmptyTitle className="font-bold text-2xl tracking-tight sm:text-4xl">
        Uh-oh!
      </EmptyTitle>
      <EmptyDescription>Page not found.</EmptyDescription>
      <EmptyContent>
        <Button variant="outline">
          <Link href="/">Return to the home page</Link>
        </Button>
      </EmptyContent>
    </Empty>
  );
}
