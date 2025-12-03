import { MainForm } from "@/components/forms/main-form";

export default function Generate() {
  return (
    <main className="flex min-h-screen items-start justify-center pt-16 p-4">
      <div className="w-full">
        <h1 className="sr-only font-bold text-2xl">YouTube to Blog</h1>
        <MainForm />
      </div>
    </main>
  );
}
