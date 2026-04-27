const SearchBar = () => {
  return (
    <div className="relative flex items-center gap-2 ml-5">
      <input
        type="text"
        placeholder="Введите название"  
        className="w-90 border border-(--color-secondary) rounded-4xl text-(--color-secondary) px-3 py-1 focus:outline-none focus:ring-[1.5px] focus:ring-pink-400 focus:text-(--color-primary)"
      />
      <button className="absolute right-3 top-1.9 w-5 h-5 cursor-pointer">
        <img src='./images/search.svg' alt="Найти" className="w-5 h-5 contain" />
      </button>
    </div>
  )
}

export { SearchBar }