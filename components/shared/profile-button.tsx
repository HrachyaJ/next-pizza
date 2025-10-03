import { useSession, signOut } from "next-auth/react";
import React from "react";
import { Button } from "../ui/button";
import { CircleUser, User, Settings, Package, LogOut } from "lucide-react";
import Link from "next/link";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

interface Props {
  onClickSignIn?: () => void;
  className?: string;
}

export const ProfileButton: React.FC<Props> = ({
  className,
  onClickSignIn,
}) => {
  const { data: session } = useSession();

  const handleSignOut = () => {
    signOut({
      callbackUrl: "/",
    });
  };

  return (
    <div className={className}>
      {!session ? (
        <Button
          onClick={onClickSignIn}
          variant="outline"
          className="flex items-center gap-1"
        >
          <User size={16} />
          Войти
        </Button>
      ) : (
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="secondary" className="flex items-center gap-2">
              <CircleUser size={18} />
              Профиль
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-20">
            <DropdownMenuItem asChild>
              <Link
                href="/profile"
                className="flex items-center gap-2 cursor-pointer font-medium"
              >
                <Settings size={16} />
                Настройки
              </Link>
            </DropdownMenuItem>
            <DropdownMenuItem asChild>
              <Link
                href="/orders"
                className="flex items-center gap-2 cursor-pointer font-medium"
              >
                <Package size={16} />
                Заказы
              </Link>
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem
              onClick={handleSignOut}
              className="flex items-center gap-2 cursor-pointer font-medium"
            >
              <LogOut size={16} />
              Выйти
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      )}
    </div>
  );
};
