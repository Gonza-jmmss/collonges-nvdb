export default function ToggleButton({
  options,
  itemSelected,
  setItemSelected,
  disabled,
}: {
  options: {
    [key: string]: any;
  }[];
  itemSelected?: any;
  setItemSelected: any;
  disabled?: boolean;
}) {
  return (
    <div
      className={`flex w-full space-x-2 rounded-md p-1 ${disabled ? "bg-muted/70" : "bg-muted"}`}
    >
      {options.map((element, index) => (
        <div
          key={index}
          className={`w-full rounded-md p-1 text-center transition-all duration-300 ease-in-out ${Object.values(element)[0] === itemSelected ? "bg-background" : ""} ${disabled ? "cursor-default opacity-70" : "cursor-pointer"}`}
          onClick={() => !disabled && setItemSelected(element)}
        >
          {Object.values(element)}
        </div>
      ))}
    </div>
  );
}
