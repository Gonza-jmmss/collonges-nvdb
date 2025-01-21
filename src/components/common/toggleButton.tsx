export default function ToggleButton({
  options,
  itemSelected,
  setItemSelected,
}: {
  options: {
    [key: string]: any;
  }[];
  itemSelected?: any;
  setItemSelected: any;
  disabled?: boolean;
}) {
  return (
    <div className="flex w-full space-x-2 rounded-md bg-muted p-1">
      {options.map((element, index) => (
        <div
          key={index}
          className={`w-full cursor-pointer rounded-md p-1 text-center transition-all duration-300 ease-in-out ${Object.values(element)[0] === itemSelected ? "bg-background" : ""}`}
          onClick={() => setItemSelected(element)}
        >
          {Object.values(element)}
        </div>
      ))}
    </div>
  );
}
