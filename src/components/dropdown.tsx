import { useState, useRef, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
interface DropdownProps {
  options: string[];
  onSelect: (value: string[]) => void;
  defaultLabel?: string[];
}

const Dropdown = ({
  options,
  onSelect,
  defaultLabel = [],
}: DropdownProps) => {
  const [open, setOpen] = useState(false);

  const [selectedOption, setSelectedOption] = useState<string[]>([]);

  // useEffect(() => {
  //   onSelect(defaultLabel);
  // }, [defaultLabel, onSelect]);

  const dropdownRef = useRef<HTMLDivElement>(null);
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        !dropdownRef.current.contains(event.target as Node)
      ) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  const multipleOption = (option: string) => {
    setSelectedOption((prev) => {
      const isSelected = prev.includes(option);
      const newOptions = isSelected
        ? prev.filter((item) => item !== option)
        : [...prev, option];
      onSelect(newOptions);
      return newOptions;
    });
  };

  return (
    <div ref={dropdownRef} className="inline-block w-full">
      <div
        className="border shadow-lg p-2 cursor-pointer bg-white h-10 rounded-md flex items-center justify-between"
        onClick={() => {
          setOpen(!open);
          
        }}
      >
        {selectedOption.length > 0 ? selectedOption.join(", ") : defaultLabel} 

        <KeyboardArrowDownIcon sx={{ fontSize: 32 }} className="absolute ml-56"/>
      </div>

      {open && (
        <div className="absolute bg-white border shadow-lg w-full">
          {options.map((item, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 border bg-white"
              onClick={() => {
                setOpen(false);
                multipleOption(item);
              }}
            >
              <input
                type="checkbox"
                checked={selectedOption.includes(item)}
                onChange={() => multipleOption(item)}
                className="m-2"
              />
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
