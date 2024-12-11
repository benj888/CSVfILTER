import { useState, useRef, useEffect } from "react";
import KeyboardArrowDownIcon from "@mui/icons-material/KeyboardArrowDown";
interface DropdownProps {
  options: string[];
  onSelect: (value: string) => void;
  defaultLabel?: string;
}

const Dropdown = ({
  options,
  onSelect,
  defaultLabel = "",
}: DropdownProps) => {
  const [open, setOpen] = useState(false);
  // const options = ["Male", "Female", "Other"];
  const [selectedOption, setSelectedOption] = useState(defaultLabel);

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

  return (
    <div ref={dropdownRef} className="inline-block w-40 z-20">
      <div
        className="border shadow-lg p-2 cursor-pointer bg-white h-10 rounded-md flex items-center justify-between"
        onClick={() => {
          setOpen(!open);
          // open && setOpen(false)
        }}
      >
        {selectedOption}

        <KeyboardArrowDownIcon sx={{ fontSize: 32 }} />
      </div>

      {open && (
        <div className="absolute bg-white border shadow-lg  w-40">
          {options.map((item, index) => (
            <div
              key={index}
              className="p-2 cursor-pointer hover:bg-gray-200 border bg-white"
              onClick={() => {
                setOpen(false);
                onSelect(item);
                setSelectedOption(item);
              }}
            >
              {item}
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default Dropdown;
