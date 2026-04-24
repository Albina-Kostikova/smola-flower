export function PinkButton({ text }) {
  return (
    <button className="w-fit bg-(--color-primary) text-sm font-bold text-white px-5 uppercase py-2.5 border-2 border-white rounded-4xl hover:bg-(--color-secondary) transition-colors duration-200">
      {text}
    </button>
  );
};

export function WhiteButton({ text }) {
  return (
    <button className="w-fit bg-white text-sm font-bold text-(--color-primary) px-5 uppercase py-2.5 border-2 border-(--color-primary) rounded-4xl">
      {text}
    </button>
  );
};

export function SquareButton({ text }) {
  return (
    <button className="w-fit bg-(--color-primary) text-sm font-bold text-white px-5 uppercase py-2.5 border-2 border-white rounded-4xl">
      {text}
    </button>
  );
}
export function InfoButton({ text }) {
  return (
    <button className="w-fit h-4 px-5 py-2.5 border-1.5 border-(--color-primary) rounded-4xl hover:bg-(--color-secondary) hover:text-grey">
      {text}
    </button>
  )
}