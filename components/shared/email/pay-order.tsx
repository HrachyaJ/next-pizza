import React from "react";
import { DELIVERY_PRICE, TAX_RATE } from "@/constants/pricing";

interface PayOrderProps {
  orderId: number;
  totalAmount: number;
  paymentUrl: string;
  itemsTotal?: number; // Опционально, если хотите показать разбивку
}

// Pricing constants moved to `@/constants/pricing`

export const PayOrderTemplate: React.FC<PayOrderProps> = ({
  orderId,
  totalAmount,
  paymentUrl,
  itemsTotal,
}) => {
  // Если передана стоимость товаров, показываем разбивку
  const showBreakdown = itemsTotal !== undefined;
  const taxAmount = showBreakdown ? Math.round(itemsTotal * TAX_RATE) : 0;
  const deliveryAmount = showBreakdown && itemsTotal > 0 ? DELIVERY_PRICE : 0;

  return (
    <div>
      <h1>Заказ #{orderId}</h1>

      {showBreakdown ? (
        <>
          <p>Детали заказа:</p>
          <table style={{ width: "100%", marginBottom: "20px" }}>
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
                <td>Итого к оплате:</td>
                <td style={{ textAlign: "right" }}>{totalAmount} ₽</td>
              </tr>
            </tbody>
          </table>
        </>
      ) : (
        <p>
          Сумма к оплате: <b>{totalAmount} ₽</b>
        </p>
      )}

      <p>
        Перейдите <a href={paymentUrl}>по этой ссылке</a> для оплаты заказа.
      </p>
    </div>
  );
};
