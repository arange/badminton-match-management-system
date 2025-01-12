import { MouseEventHandler } from 'react';

export default function AddNewCard({
  title,
  onClick
}: {
  title: string;
  onClick?: MouseEventHandler<HTMLButtonElement>;
}) {
  return (
    <button
      onClick={onClick}
      className="flex align-middle justify-center items-center gap-2 border rounded border-black w-fit p-3 min-w-40 hover:scale-105 hover:bg-gray-200 hover:shadow-md"
    >
      {title}
    </button>
  );
}
