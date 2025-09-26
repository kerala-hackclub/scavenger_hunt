import { useState } from "react";
import { Button, Input } from "./App";
import { useNavigate } from "react-router-dom";

function Login() {
  const [username, setUsername] = useState("");
  const [password, setPassword] = useState("");
  const navigate = useNavigate();

  const handleLogin = async () => {
    const res = await fetch("http://localhost:3000/login", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ username, password }),
    });
    const data = await res.json();
    if (data.token) {
      localStorage.setItem("token", data.token);
      navigate("/main");
    } else {
      alert("Invalid credentials");
    }
  };

  return (
    <div className="w-screen h-screen bg-radial to-black/50 sm:to-85% to-100% backdrop-blur-2xl gap-10 sm:flex justify-center items-center grid grid-rows-2  ">
      <img src="/title.webp" className="sm:h-120" />
      <div className="sm:w-[30vw] flex justify-start items-center flex-col gap-5 p-10 w-full sm:h-[40vh] h-full bg-[rgba(0,0,0,0.5)] rounded-4xl rounded-b-[0] sm:rounded-b-4xl sm:border-1 border-0 border-white/10 backdrop-blur-2xl">
        <div className="w-full h-full flex flex-col gap-5">
          <Input
            placeholder="username"
            type="text"
            onChange={(e: any) => setUsername(e.target.value)}
          />
          <Input
            placeholder="password"
            type="password"
            onChange={(e: any) => setPassword(e.target.value)}
          />
        </div>
        <div className="h-20 w-full text-2xl">
          <Button onClick={handleLogin}>Start the hunt!</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
