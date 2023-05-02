import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");

  const updateSockCompanyName = () => {
    axios.get("/api/hello").then((res) => console.log(setName(res.data.r)));
  };
  useEffect(() => {
    setName("");
    updateSockCompanyName();
  }, []);

  return (
    <>
      <h1>Random sock company name:</h1>
      <p>{name}</p>
      <button onClick={updateSockCompanyName}>Update</button>
    </>
  );
}
