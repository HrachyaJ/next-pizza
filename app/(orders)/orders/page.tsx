"use client";

import React from "react";
import { useSession } from "next-auth/react";
import { Container, Title } from "@/components/shared";
import { OrderItem } from "@/components/shared/order-item";
import { Api } from "@/services/api-client";
import { Order } from "@prisma/client";
import { redirect } from "next/navigation";

export default function OrdersPage() {
  const { data: session } = useSession();
  const [orders, setOrders] = React.useState<Order[]>([]);
  const [loading, setLoading] = React.useState(true);

  React.useEffect(() => {
    async function fetchOrders() {
      try {
        const data = await Api.orders.getAll();
        setOrders(data);
      } catch (error) {
        console.error("Failed to fetch orders:", error);
      } finally {
        setLoading(false);
      }
    }

    if (session) {
      fetchOrders();
    } else {
      setLoading(false);
    }
  }, [session]);

  if (loading) {
    return (
      <Container className="my-10">
        <div className="flex justify-center items-center min-h-[400px]">
          Загрузка...
        </div>
      </Container>
    );
  }

  if (!session) {
    return redirect("/not-auth");
  }

  return (
    <Container className="mt-10 pb-10">
      <Title text="Мои заказы" size="lg" className="font-extrabold mb-8" />

      {orders.length === 0 ? (
        <p className="text-gray-500">У вас пока нет заказов</p>
      ) : (
        <div className="flex flex-col gap-6">
          {orders.map((order) => (
            <OrderItem key={order.id} order={order} />
          ))}
        </div>
      )}
    </Container>
  );
}
