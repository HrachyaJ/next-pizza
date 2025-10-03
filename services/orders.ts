import { axiosInstance } from "./instance";
import { Order } from "@prisma/client";

export const getAll = async (): Promise<Order[]> => {
  const { data } = await axiosInstance.get<Order[]>("/orders");
  return data;
};
