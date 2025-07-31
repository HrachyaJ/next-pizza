"use client";

import { ClearButton, ErrorText, RequiredSymbol } from "@/components/shared";
import { useFormContext, Controller } from "react-hook-form";
import { IMaskInput } from 'react-imask';

interface Props {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  placeholder?: string;
}

export const PhoneInput: React.FC<Props> = ({ 
  name, 
  label, 
  required, 
  className,
  placeholder
}) => {
  const {
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true, shouldDirty: true });
  };

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Controller
          name={name}
          control={control}
          render={({ field }) => (
            <IMaskInput
              {...field}
              mask="+7 (000) 000-00-00"
              placeholder={placeholder}
              className="flex h-9 w-full rounded-md border border-input bg-transparent px-3 py-1 text-md shadow-sm transition-colors file:border-0 file:bg-transparent file:text-sm file:font-medium placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-1 focus-visible:ring-ring disabled:cursor-not-allowed disabled:opacity-50"
              onAccept={(value: string) => field.onChange(value)}
            />
          )}
        />

        {value && <ClearButton onClick={onClickClear} />}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};