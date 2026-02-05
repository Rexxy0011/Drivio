import React from "react";
import Navbar from "./components/Navbar";

const App = () => {
  return (
    <div className="absolute inset-0 -z-10 h-full w-full bg-white bg-[linear-gradient(to_right,#8080800a_1px,transparent_1px),linear-gradient(to_bottom,#8080800a_1px,transparent_1px)] bg-[size:14px_24px]">
      <div>
        <Navbar />
      </div>
    </div>
  );
};
export default App;
