import { Header } from "@/components/shared"
import { Metadata } from "next"

export const metadata: Metadata = {
  title: 'Next Pizza | Корзина',
  description: 'Корзина для заказа пиццы',
}

export default function CheckoutLayout({ children }: { children: React.ReactNode }) {
  return (
    <main className="min-h-screen bg-[#F4F1EE]">
      <Header hasSearch={false} hasCart={false} className="border-b-gray-200"/>
      {children}
    </main>
  )
} 