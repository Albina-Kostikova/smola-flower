type ButtonProps = {
  text: string;
  className?: string
}
  export function PinkButton({ text, className }: ButtonProps) {
  return (
    <button className={`w-fit bg-(--color-primary) text-sm font-bold text-white px-5 uppercase py-2.5 border-2 border-white rounded-4xl hover:bg-(--color-secondary) transition-colors duration-200 ${className}`}>
      {text}
    </button>
  );
};

export function WhiteButton({ text, className }: ButtonProps) {
  return (
    <button className={`w-fit bg-white text-sm font-bold text-(--color-primary) px-5 uppercase py-2.5 border-2 border-(--color-primary) rounded-4xl ${className}`}>
      {text}
    </button>
  );
};

export function SquareButton({ text, className }: ButtonProps) {
  return (
    <button className={`w-fit bg-(--color-primary) text-sm font-bold text-white px-5 uppercase py-2.5 border-2 border-white rounded-4xl ${className}`}>
      {text}
    </button>
  );
}
export function InfoButton({ text, className }: ButtonProps) {
  return (
    <button className={`w-fit h-10 flex justify-center items-center px-5 py-2.5 text-sm text-gray-700 border-[1.5px] border-(--color-primary) rounded-4xl hover:bg-(--color-secondary) ${className}`}>
      {text} <img src="/images/arrow.svg" alt="Стрелка" className="ml-2" />
    </button>
  )
}