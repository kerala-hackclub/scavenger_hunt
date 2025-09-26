import { Button, Input } from "./App";

function Login() {
  return (
    <div className="w-screen h-screen bg-radial to-black/50 sm:to-85% to-100% backdrop-blur-2xl gap-10 sm:flex justify-center items-center grid grid-rows-2  ">
      <img src="/title.webp" className="sm:h-120" />
      <div className="sm:w-[30vw] flex justify-start items-center flex-col gap-5 p-10 w-full sm:h-[40vh] h-full bg-[rgba(0,0,0,0.5)] rounded-4xl rounded-b-[0] sm:rounded-b-4xl sm:border-1 border-0 border-white/10 backdrop-blur-2xl">
        <div className="w-full h-full flex flex-col gap-5">
          <Input placeholder="username" type="text" />
          <Input placeholder="password" type="password" />
        </div>
        <div className="h-20 w-full text-2xl">
          <Button>Start the hunt!</Button>
        </div>
      </div>
    </div>
  );
}

export default Login;
