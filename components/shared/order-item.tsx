import React from "react";
import { Order, OrderStatus } from "@prisma/client";
import { ChevronDown, ChevronUp } from "lucide-react";
import { cn } from "@/lib/utils";
import Image from "next/image";

interface Props {
  order: Order;
}

interface OrderItem {
  id: number;
  name: string;
  imageUrl: string;
  price: number;
  quantity: number;
  size?: number;
  pizzaType?: number;
  ingredients?: Array<{ name: string }>;
}

interface CartItemData {
  id: number;
  quantity: number;
  ingredients: Array<{ name: string; price: number }>;
  productItem: {
    price: number;
    size?: number;
    pizzaType?: number;
    product: {
      name: string;
      imageUrl: string;
    };
  };
}

const getStatusText = (status: OrderStatus) => {
  switch (status) {
    case "SUCCEEDED":
      return "Оплачено";
    case "CANCELLED":
      return "Отклонено";
    case "PENDING":
      return "В ожидании";
    default:
      return status;
  }
};

const getStatusColor = (status: OrderStatus) => {
  switch (status) {
    case "SUCCEEDED":
      return "bg-[#DCFCE7] text-[#16A34A]";
    case "CANCELLED":
      return "bg-[#FEE2E2] text-[#DC2626]";
    case "PENDING":
      return "bg-[#FEF3C7] text-[#CA8A04]";
    default:
      return "bg-gray-50 text-gray-600";
  }
};

const getPizzaTypeText = (type?: number) => {
  if (type === 1) return "традиционное тесто";
  if (type === 2) return "тонкое тесто";
  return "";
};

const getSizeText = (size?: number) => {
  if (size === 20) return "Маленькая";
  if (size === 30) return "Средняя";
  if (size === 40) return "Большая";
  return size ? `${size} см` : ""; // Fallback to raw size if not 20/30/40
};

export const OrderItem: React.FC<Props> = ({ order }) => {
  const [isExpanded, setIsExpanded] = React.useState(false);

  const items = React.useMemo(() => {
    if (!order.items) return [];

    let cartItems: CartItemData[] = [];

    if (typeof order.items === "string") {
      try {
        cartItems = JSON.parse(order.items);
      } catch (e) {
        console.error("Failed to parse items:", e);
        return [];
      }
    } else if (Array.isArray(order.items)) {
      cartItems = order.items as unknown as CartItemData[];
    }

    return cartItems.map((cartItem): OrderItem => {
      const totalPrice =
        cartItem.productItem.price +
        (cartItem.ingredients?.reduce((sum, ing) => sum + ing.price, 0) || 0);

      return {
        id: cartItem.id,
        name: cartItem.productItem.product.name,
        imageUrl: cartItem.productItem.product.imageUrl,
        price: totalPrice,
        quantity: cartItem.quantity,
        size: cartItem.productItem.size,
        pizzaType: cartItem.productItem.pizzaType,
        ingredients: cartItem.ingredients,
      };
    });
  }, [order.items]);

  const formatDate = (date: Date) => {
    return new Date(date).toLocaleString("ru-RU", {
      day: "numeric",
      month: "long",
      year: "numeric",
      hour: "2-digit",
      minute: "2-digit",
    });
  };

  return (
    <div className="bg-white rounded-[30px] overflow-hidden shadow-sm w-[752px]">
      <div
        className="flex items-center justify-between py-[28px] px-[32px] cursor-pointer"
        onClick={() => setIsExpanded(!isExpanded)}
      >
        <div className="flex flex-row gap-5">
          <h3 className="text-[24px] font-bold">Заказ #{order.id}</h3>
          <p className="text-[16px] pt-1.5 text-gray-400">
            {formatDate(order.createdAt)}
          </p>
        </div>

        <div className="flex items-center gap-4">
          <span
            className={cn(
              "px-4 py-2 rounded-lg text-[13px] font-medium",
              getStatusColor(order.status)
            )}
          >
            {getStatusText(order.status)}
          </span>

          {isExpanded ? (
            <ChevronUp className="w-5 h-5 text-gray-400" />
          ) : (
            <ChevronDown className="w-5 h-5 text-gray-400" />
          )}
        </div>
      </div>

      {isExpanded && (
        <div className="border-t border-gray-100 px-8 py-6">
          {items.length > 0 ? (
            <>
              <div className="space-y-6">
                {items.map((item, index) => (
                  <div key={index} className="flex items-start gap-5">
                    {item.imageUrl && (
                      <div className="flex-shrink-0">
                        <Image
                          src={item.imageUrl}
                          alt={item.name || "Товар"}
                          width={60}
                          height={60}
                          className="rounded-2xl"
                        />
                      </div>
                    )}
                    <div className="flex-1 min-w-0">
                      <h4 className="font-bold text-[16px]">{item.name}</h4>
                      <p className="text-[14px] text-gray-400 leading-relaxed">
                        {getSizeText(item.size)}
                        {item.size && item.pizzaType && ", "}
                        {item.pizzaType && getPizzaTypeText(item.pizzaType)}
                        {item.ingredients && item.ingredients.length > 0 && (
                          <>
                            <br />+{" "}
                            {item.ingredients.map((ing) => ing.name).join(", ")}
                          </>
                        )}
                      </p>
                    </div>
                    <div className="flex flex-col items-end flex-shrink-0 gap-1">
                      <p className="font-bold text-[16px]">{item.price} ₽</p>
                      <p className="text-[14px] text-gray-400">
                        {item.quantity} шт.
                      </p>
                    </div>
                  </div>
                ))}
              </div>

              <div className="mt-7 pt-6 border-t border-gray-100">
                <div className="flex items-center gap-2">
                  <span className="text-[20px] font-normal text-dark-600">
                    Итого:
                  </span>
                  <span className="text-2xl font-extrabold">
                    {order.totalAmount} ₽
                  </span>
                </div>
              </div>
            </>
          ) : (
            <p className="text-gray-400 text-center py-4">
              Информация о товарах недоступна
            </p>
          )}
        </div>
      )}
    </div>
  );
};
