import { useState } from "react";

const Test = () => {
  const data = ["1", "2", "3"];
  const [open, setOpen] = useState(false);
  const [selectVal, setSelectVal] = useState<string[]>([]);

  const multipleselect = (option: string) => {
    setSelectVal((val) => {
        const seleting = val.includes(option)? val.filter((item)=>item!==option) : [...val,option]
        return seleting
        
    });
  };

  return (
    <div className="flex justify-center">
      <div
        className="border  shadow-lg  cursor-pointer  w-40"
        onClick={() => {
          setOpen(!open);
        }}
      >
        <div className="p-2">
          {selectVal.length > 0 ? selectVal.join(", ") : []}
        </div>
        {open && (
          <div className="">
            {data.map((item, index) => (
              <div
                key={index}
                className="hover:bg-gray-200 p-2 border"
                onClick={() => {
                  multipleselect(item);
                  setOpen(!open);
                }}
              >
                <input
                  type="checkbox"
                  checked={selectVal.includes(item)}
                  onChange={() => multipleselect(item)}
                  className="m-2"
                />
                {item}
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  );
};
export default Test;
