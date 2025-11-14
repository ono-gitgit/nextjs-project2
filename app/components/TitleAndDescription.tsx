"use client";

type TitleAndDescriptionProp = {
  title: string;
  description: string;
  children: React.ReactNode;
};

export default function TitleAndDescription({
  title,
  description,
  children,
}: TitleAndDescriptionProp) {
  return (
    <>
      <h1 className="max-w-xs text-3xl font-semibold leading-10 tracking-tight text-black dark:text-zinc-50">
        {title}
      </h1>
      <p>{description}</p>
      {children}
    </>
  );
}
