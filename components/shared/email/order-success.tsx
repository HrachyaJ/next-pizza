import { CartItemDTO } from "@/services/dto/cart.dto";
import React from "react";
import { DELIVERY_PRICE, TAX_RATE } from "@/constants/pricing";

interface Props {
  orderId: number;
  items: CartItemDTO[];
  totalAmount: number;
}

export const OrderSuccessTemplate: React.FC<Props> = ({
  orderId,
  items,
  totalAmount,
}) => {
  // Считаем стоимость товаров
  const itemsTotal = items.reduce(
    (acc, item) => acc + item.productItem.price * item.quantity,
    0
  );

  // Рассчитываем налоги и доставку
  const taxAmount = Math.round(itemsTotal * TAX_RATE);
  const deliveryAmount = itemsTotal > 0 ? DELIVERY_PRICE : 0;

  return (
    <div>
      <h1>Спасибо за покупку! 🎉</h1>

      <p>Ваш заказ #{orderId} оплачен. Список товаров:</p>

      <hr />

      <ul>
        {items.map((item) => (
          <li key={item.id}>
            {item.productItem.product.name} | {item.productItem.price} ₽ x{" "}
            {item.quantity} шт. = {item.productItem.price * item.quantity} ₽
          </li>
        ))}
      </ul>

      <hr />

      <table style={{ width: "100%", marginTop: "20px" }}>
        <tbody>
          <tr>
            <td>Стоимость товаров:</td>
            <td style={{ textAlign: "right" }}>{itemsTotal} ₽</td>
          </tr>
          <tr>
            <td>Налог (15%):</td>
            <td style={{ textAlign: "right" }}>{taxAmount} ₽</td>
          </tr>
          <tr>
            <td>Доставка:</td>
            <td style={{ textAlign: "right" }}>{deliveryAmount} ₽</td>
          </tr>
          <tr style={{ borderTop: "2px solid #000", fontWeight: "bold" }}>
            <td>Итого:</td>
            <td style={{ textAlign: "right" }}>{totalAmount} ₽</td>
          </tr>
        </tbody>
      </table>
    </div>
  );
};
