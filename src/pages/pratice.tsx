import React, { useState } from "react";

interface ChildProps {
  propValue: number;
}

const Child = React.memo(({ propValue }: ChildProps) => {
  console.log("Child rendered");
  return <div>{propValue}</div>;
});

// const Child = ({ propValue }: ChildProps) => {
//     console.log("Child rendered");
//     return <div>{propValue}</div>;
//   };

function Parent() {
  const [value, setValue] = useState(0);

  return (
    <>
      <Child propValue={value} />
      <button onClick={() => setValue(value + 1)}>Update Parent</button>
    </>
  );
}

export default Parent;
