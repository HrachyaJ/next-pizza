'use client';

import { cn } from "@/lib/utils";
import React from "react";
import * as CartItem from './cart-item-details';
import { CartItemProps } from "./cart-item-details/cart-item-details.types";
import { CountButton } from "./count-button";
import { Trash2Icon } from "lucide-react";

interface Props extends CartItemProps {
  onClickCountButton?: (type: 'plus' | 'minus') => void;
  onClickRemove?: () => void;
  className?: string;
}

export const CartDrawerItem: React.FC<Props> = ({ 
  imageUrl,
  name,
  price,
  quantity,
  details,
  disabled,
  onClickRemove,
  onClickCountButton,
  className,
}) => {
  return (
    <div className={cn('flex bg-white p-4 gap-4 shadow-sm border border-gray-100 mb-2',
      {
      'opacity-50 pointer-events-none': disabled,
      }, 
      className,
    )}>
      <div className="flex-shrink-0">
        <CartItem.Image src={imageUrl} className="w-16 h-16 rounded-lg object-cover" />
      </div>

      <div className="flex-1 min-w-0">
        <div className="mb-3">
          <CartItem.Info name={name} details={details} />
        </div>

        <div className="h-px bg-gray-200 mb-2"></div>

        <div className="flex items-center justify-between">
          <CountButton
            onClick={onClickCountButton} 
            value={quantity} 
            className="scale-90" 
          />

          <div className="flex items-center gap-3">
            <CartItem.Price value={price} />
            <button className="p-1 rounded-full hover:bg-gray-100 transition-colors">
              <Trash2Icon onClick={onClickRemove} className="text-gray-400 hover:text-red-500 transition-colors" size={16} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};