import { ModeSwitcher } from "./mode-switcher";
import { UserButton } from "./user-button";

export function Header() {
  return (
    <header className="absolute top-4 flex w-full items-center justify-end gap-2 px-4">
      <ModeSwitcher />
      <UserButton />
    </header>
  );
}
