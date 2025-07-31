import { CartItemDTO } from '@/services/dto/cart.dto';
import React from 'react';

interface Props {
  orderId: number;
  items: CartItemDTO[];
}

export const OrderFailureTemplate: React.FC<Props> = ({ orderId, items }) => (
  <div>
    <h1>Оплата не прошла ❌</h1>

    <p>К сожалению, оплата заказа #{orderId} не была выполнена. Детали заказа:</p>

    <hr />

    <ul>
      {items.map((item) => (
        <li key={item.id}>
          {item.productItem.product.name} | {item.productItem.price} ₽ x {item.quantity} шт. ={' '}
          {item.productItem.price * item.quantity} ₽
        </li>
      ))}
    </ul>

    <p>Пожалуйста, попробуйте оплатить заказ еще раз или свяжитесь с нашей службой поддержки.</p>
  </div>
);