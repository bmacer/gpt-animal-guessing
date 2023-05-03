import { useState } from "react";

// A component that has a button that changes the text on the page.
// It says "hi Daphne" and then when you press the button it says "Daphne is the best!
const Daphne = () => {
  const [text, setText] = useState("hi Daphne");

  return (
    <div>
      <h2>Hello... press the button</h2>
      <h1>{text}</h1>
      <button
        style={{ border: "1px solid blue" }}
        onClick={() => setText("Daphne is the best!")}
      >
        Click me!
      </button>
    </div>
  );
};

export default Daphne;
