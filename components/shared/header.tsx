"use client";

import { cn } from "@/lib/utils";
import React, { Suspense } from "react";
import { Container } from "./container";
import Image from "next/image";
import Link from "next/link";
import { SearchInput } from "./search-input";
import { CartButton } from "./cart-button";
import { useRouter, useSearchParams } from "next/navigation";
import toast from "react-hot-toast";
import { ProfileButton } from "./profile-button";
import { AuthModal } from "./modals/auth/auth-modal";

interface Props {
  hasSearch?: boolean;
  hasCart?: boolean;
  className?: string;
}

function HeaderContent({ hasSearch = true, hasCart = true, className }: Props) {
  const [openAuthModal, setOpenAuthModal] = React.useState(false);
  const router = useRouter();
  const searchParams = useSearchParams();

  React.useEffect(() => {
    let toastMessage = "";

    if (searchParams.has("paid")) {
      toastMessage =
        "Заказ успешно оплачен! 🎉 Информация отправлена на почту.";
    }

    if (searchParams.has("verified")) {
      toastMessage = "Почта успешно подтверждена!";
    }

    if (toastMessage) {
      setTimeout(() => {
        router.replace("/");
        toast.success(toastMessage, {
          duration: 3000,
        });
      }, 1000);
    }
  }, [searchParams, router]);

  return (
    <header className={cn("border-b", className)}>
      <Container className="flex items-center justify-between py-8">
        {/* Левая часть */}
        <Link href="/">
          <div className="flex items-center gap-4">
            <Image src="/logo.png" alt="Logo" width={35} height={35} />
            <div>
              <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
              <p className="text-sm text-gray-400 leading-3">
                вкусней уже некуда
              </p>
            </div>
          </div>
        </Link>

        {hasSearch && (
          <div className="mx-10 flex-1">
            <SearchInput />
          </div>
        )}

        {/* Правая часть */}
        <div className="flex items-center gap-3">
          <AuthModal
            open={openAuthModal}
            onClose={() => setOpenAuthModal(false)}
          />
          <ProfileButton onClickSignIn={() => setOpenAuthModal(true)} />

          {hasCart && <CartButton />}
        </div>
      </Container>
    </header>
  );
}

export const Header: React.FC<Props> = (props) => {
  return (
    <Suspense
      fallback={
        <header className={cn("border-b", props.className)}>
          <Container className="flex items-center justify-between py-8">
            <Link href="/">
              <div className="flex items-center gap-4">
                <Image src="/logo.png" alt="Logo" width={35} height={35} />
                <div>
                  <h1 className="text-2xl uppercase font-black">Next Pizza</h1>
                  <p className="text-sm text-gray-400 leading-3">
                    вкусней уже некуда
                  </p>
                </div>
              </div>
            </Link>
            {props.hasSearch && (
              <div className="mx-10 flex-1">
                <SearchInput />
              </div>
            )}
            <div className="flex items-center gap-3">
              <ProfileButton onClickSignIn={() => {}} />
              {props.hasCart && <CartButton />}
            </div>
          </Container>
        </header>
      }
    >
      <HeaderContent {...props} />
    </Suspense>
  );
};
