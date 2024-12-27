import { createPortal } from "react-dom";

const Drawer = ({
  children,
  visible,
  handleSetVisible,
}: {
  children: JSX.Element;
  visible: boolean;
  handleSetVisible: (visible: boolean) => void;
}) => {
  return createPortal(
    <>
      {/* <div className={`fixed top-0 right-0 w-1/3 bg-white h-full duration-200 z-[999] ${visible ? "translate-x-0 rounded-sm shadow-md":"translate-x-full"}`}> */}
      
        
         <div className={`fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2  w-96 rounded-sm shadow-md bg-white h-1/2 duration-200 z-[999] ${visible ? "scale-100 opacity-100" : "scale-0 opacity-0" }`}>
          {children}
        </div>
      

      {visible && (
        <div
          className="fixed top-0 left-0 bg-black opacity-30 w-full h-full z-[998] "
          onClick={() => handleSetVisible(false)}
        ></div>
      )}
    </>,
    document.body
  );
};

export default Drawer;
