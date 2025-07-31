'use client';

import React from 'react';
import dynamic from 'next/dynamic';
import 'react-dadata/dist/react-dadata.css';

const AddressSuggestions = dynamic(
  () => import('react-dadata').then(mod => ({ default: mod.AddressSuggestions })),
  { ssr: false }
);

interface Props {
  onChange?: (value?: string) => void;
}

export const AddressInput: React.FC<Props> = ({ onChange }) => {
  return (
    <AddressSuggestions
      token="1fed7dad2ed2faa825c548497e93a8bfb4cf838e"
      onChange={(data) => onChange?.(data?.value)}
    />
  );
};