"use client";

import { ClearButton, ErrorText, RequiredSymbol } from "@/components/shared";
import { Input } from "@/components/ui";
import { useFormContext, Controller } from "react-hook-form";
import { IMaskInput } from "react-imask";

interface Props extends React.InputHTMLAttributes<HTMLInputElement> {
  name: string;
  label?: string;
  required?: boolean;
  className?: string;
  mask?: string;
}

export const FormInput: React.FC<Props> = ({
  name,
  label,
  required,
  className,
  mask,
  ...props
}) => {
  const {
    register,
    formState: { errors },
    watch,
    setValue,
    control,
  } = useFormContext();

  const value = watch(name);
  const errorText = errors[name]?.message as string;

  const onClickClear = () => {
    setValue(name, "", { shouldValidate: true });
  };

  if (mask) {
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
                mask={mask}
                placeholder={props.placeholder}
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
  }

  return (
    <div className={className}>
      {label && (
        <p className="font-medium mb-2">
          {label} {required && <RequiredSymbol />}
        </p>
      )}

      <div className="relative">
        <Input {...register(name)} {...props} className="h-9 text-md" />

        {value && <ClearButton onClick={onClickClear} />}
      </div>

      {errorText && <ErrorText text={errorText} className="mt-2" />}
    </div>
  );
};
