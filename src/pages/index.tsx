import axios from "axios";
import { useEffect, useState } from "react";

export default function Home() {
  const [name, setName] = useState("");
  const [isNew, setIsNew] = useState(false);
  const updateSockCompanyName = () => {
    axios.get("/api/hello").then((res) => {
      setName(res.data.r);
      setIsNew(res.data.isNew);
    });
  };
  useEffect(() => {
    setName("");
    updateSockCompanyName();
  }, []);

  return (
    <>
      <h1>Random sock company name:</h1>
      <p>{name}</p>
      <p>{isNew ? "new" : "cached"}</p>
      <button onClick={updateSockCompanyName}>Update</button>
    </>
  );
}
