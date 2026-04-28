type ButtonProps = {
  text: string;
  onClick?: () => void; 
  className?: string
}
  export function PinkButton({ text, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`w-fit bg-(--color-primary) text-sm font-bold cursor-pointer text-white px-5 uppercase py-2.5 border-2 border-white rounded-4xl hover:bg-(--color-secondary) transition-colors duration-200 ${className}`}>
      {text}
    </button>
  );
};

export function WhiteButton({ text, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`w-fit bg-white text-sm font-bold cursor-pointer text-(--color-primary) px-5 uppercase py-2.5 border-2 border-(--color-primary) rounded-4xl ${className}`}>
      {text}
    </button>
  );
};

export function SquareButton({ text, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`w-fit bg-(--color-primary) cursor-pointer text-sm font-bold text-white px-5 uppercase py-2.5 border-2 border-white ${className}`}>
      {text}
    </button>
  );
}
export function InfoButton({ text, onClick, className }: ButtonProps) {
  return (
    <button onClick={onClick} className={`w-fit h-10 flex justify-center cursor-pointer items-center px-5 py-2.5 text-sm text-gray-700 border-[1.5px] border-(--color-primary) rounded-4xl hover:bg-(--color-secondary) ${className}`}>
      {text} <img src="/images/arrow.svg" alt="Стрелка" className="ml-2" />
    </button>
  )
}