"use client";

import { useForm } from "react-hook-form";
import { InputField } from "../type/types";
import { useMemo } from "react";

type FormProp = {
  message?: string;
  inputFields: Array<InputField>;
  onSubmit: ({ values }: Record<string, string | number>) => void;
  buttonTitle: string;
  children?: React.ReactNode;
};

export default function Form({
  message,
  inputFields,
  onSubmit,
  buttonTitle,
  children,
}: FormProp) {
  const defaultValues = useMemo(() => {
    return inputFields.reduce(
      (acc, field) => ({
        ...acc,
        [field.name]: field.value,
      }),
      {} as Record<string, string | number>
    );
  }, [inputFields]);

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm({ defaultValues });

  return (
    <>
      {message && <div className="text-red-500">{message}</div>}
      <form className="w-full" onSubmit={handleSubmit(onSubmit)}>
        {inputFields.map((inputfield, index) => (
          <div key={index} className="flex flex-col my-3">
            {inputfield.title}
            <input
              className="border"
              id={inputfield.id}
              type={inputfield.type}
              {...register(inputfield.name, inputfield.validation)}
            />
            <div className="text-red-500">
              {errors?.[inputfield.name]?.message}
            </div>
          </div>
        ))}
        <input
          className="rounded-[10px] border border-solid dark:border-white/[.145] transition-colors flex items-center justify-center bg-[#F85F6A] hover:bg-[#f3a4a9] dark:hover:bg-[#1a1a1a] hover:border-transparent font-medium text-sm text-amber-50 sm:text-base h-10 w-full sm:h-12 px-4 sm:px-5"
          type="submit"
          value={buttonTitle}
        />
      </form>
      {children}
    </>
  );
}
