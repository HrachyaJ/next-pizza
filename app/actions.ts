"use server";

import { prisma } from "@/prisma/prisma-client";
import { CheckoutFormValues } from "@/constants";
import { sendEmail } from "@/lib";
import { OrderStatus, Prisma } from "@prisma/client";
import { hashSync } from "bcrypt";
import { cookies } from "next/headers";
import { createPayment } from "@/lib/create-payment";
import { PayOrderTemplate } from "@/components/shared/email/pay-order";
import { getUserSession } from "@/lib/get-user-session";
import { VerificationUserTemplate } from "@/components/shared/email/verification-user";

// Константы для расчета
const DELIVERY_PRICE = 250; // Стоимость доставки в рублях
const TAX_RATE = 0.15; // Налог 15%

export async function createOrder(data: CheckoutFormValues) {
  try {
    const cookieStore = await cookies();
    const cartToken = cookieStore.get("cartToken")?.value;

    if (!cartToken) {
      throw new Error("Cart token not found");
    }

    /* Находим корзину по токену */
    const userCart = await prisma.cart.findFirst({
      include: {
        user: true,
        items: {
          include: {
            ingredients: true,
            productItem: {
              include: {
                product: true,
              },
            },
          },
        },
      },
      where: {
        token: cartToken,
      },
    });

    /* Если корзина не найдена возвращаем ошибку */
    if (!userCart) {
      throw new Error("Cart not found");
    }

    /* Если корзина пустая возвращаем ошибку */
    if (userCart?.totalAmount === 0) {
      throw new Error("Cart is empty");
    }

    // Рассчитываем итоговую сумму с налогами и доставкой
    const cartTotal = userCart.totalAmount;
    const taxAmount = Math.round(cartTotal * TAX_RATE);
    const deliveryAmount = cartTotal > 0 ? DELIVERY_PRICE : 0;
    const finalAmount = cartTotal + taxAmount + deliveryAmount;

    /* Создаем заказ */
    const order = await prisma.order.create({
      data: {
        token: cartToken,
        fullName: data.firstName + " " + data.lastName,
        email: data.email,
        phone: data.phone,
        address: data.address,
        comment: data.comment,
        totalAmount: finalAmount, // Сохраняем итоговую сумму с налогами и доставкой
        status: OrderStatus.PENDING,
        items: JSON.stringify(userCart.items),
      },
    });

    /* Очищаем корзину */
    await prisma.cart.update({
      where: {
        id: userCart.id,
      },
      data: {
        totalAmount: 0,
      },
    });

    await prisma.cartItem.deleteMany({
      where: {
        cartId: userCart.id,
      },
    });

    const paymentData = await createPayment({
      amount: order.totalAmount, // Отправляем полную сумму в YooKassa
      orderId: order.id,
      description: "Оплата заказа #" + order.id,
    });

    if (!paymentData) {
      throw new Error("Payment data not found");
    }

    await prisma.order.update({
      where: {
        id: order.id,
      },
      data: {
        paymentId: paymentData.id,
      },
    });

    const paymentUrl = paymentData.confirmation.confirmation_url;

    await sendEmail(
      data.email,
      "Next Pizza / Оплатите заказ #" + order.id,
      await PayOrderTemplate({
        orderId: order.id,
        totalAmount: order.totalAmount,
        paymentUrl,
      })
    );

    return paymentUrl;
  } catch (err) {
    console.log("[CreateOrder] Server error", err);
  }
}

export async function updateUserInfo(body: Prisma.UserUpdateInput) {
  try {
    const currentUser = await getUserSession();

    if (!currentUser) {
      throw new Error("Пользователь не найден");
    }

    const findUser = await prisma.user.findFirst({
      where: {
        id: Number(currentUser.id),
      },
    });

    await prisma.user.update({
      where: {
        id: Number(currentUser.id),
      },
      data: {
        fullName: body.fullName,
        email: body.email,
        password: body.password
          ? hashSync(body.password as string, 10)
          : findUser?.password,
      },
    });
  } catch (err) {
    console.log("Error [UPDATE_USER]", err);
    throw err;
  }
}

export async function registerUser(body: Prisma.UserCreateInput) {
  try {
    const user = await prisma.user.findFirst({
      where: {
        email: body.email,
      },
    });

    if (user) {
      if (!user.verified) {
        throw new Error("Почта не подтверждена");
      }

      throw new Error("Пользователь уже существует");
    }

    const createdUser = await prisma.user.create({
      data: {
        fullName: body.fullName,
        email: body.email,
        password: hashSync(body.password, 10),
      },
    });

    const code = Math.floor(100000 + Math.random() * 900000).toString();

    await prisma.verificationCode.create({
      data: {
        code,
        userId: createdUser.id,
      },
    });

    await sendEmail(
      createdUser.email,
      "Next Pizza / 📝 Подтверждение регистрации",
      await VerificationUserTemplate({
        code,
      })
    );
  } catch (err) {
    console.log("Error [CREATE_USER]", err);
    throw err;
  }
}
