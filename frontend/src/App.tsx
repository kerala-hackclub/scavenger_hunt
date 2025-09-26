import { KeyRound, LogOut } from "lucide-react";
import Chest from "./Components/Chest/Chest";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Login from "./Login";
import { Flip, ToastContainer } from "react-toastify";

function App() {
  return (
    <BrowserRouter>
      <div className="fixed top-0 inset-0 bg-[url('/bg.webp')] bg-cover bg-center -z-10"></div>
      <ToastContainer
        position="top-center"
        autoClose={3000}
        hideProgressBar
        newestOnTop={false}
        closeOnClick={false}
        rtl={false}
        pauseOnFocusLoss
        draggable
        pauseOnHover
        theme="dark"
        transition={Flip}
      />
      <div className="w-full h-screen flex sm:flex-row flex-col justify-center items-center">
        <Routes>
          <Route path="/main" element={<MainPage />} />
          <Route path="/" element={<Login />} />
        </Routes>
      </div>
    </BrowserRouter>
  );
}

export default App;

const MainPage = () => {
  return (
    <>
      <div className="bg-black/50 w-screen h-screen overflow-scroll flex flex-col items-center">
        <div className="fixed top-0 bg-linear-to-b sm:from-transparent from-black z-1000 w-full flex justify-between px-3 py-2 sm:text-2xl text-xl text-white/75">
          <div className="flex justify-center items-center gap-2">
            <LogOut
              size={20}
              className="text-red-400 hover:mr-2 active:mr-1 transition-all duration-300 hover:scale-190 active:scale-140 hover:bg-[rgba(100,0,0,0.3)] rounded-full hover:p-[0.1em] border-1 border-[rgba(100,0,0,0.3)] backdrop-blur-2xl"
            />
            <p>rino</p>
          </div>
          <div className="flex gap-2 bg-[rgba(0,0,0,0.3)] backdrop-blur-2xl px-3 py-1 justify-center items-center rounded-full border-1 border-white/15">
            <img src="/coin.webp" className="w-6 h-6" />
            <p>000</p>
          </div>
        </div>
        <img src="/title.webp" className="h-150" />
        <div className="text-white w-full sm:px-0 px-5 flex flex-col sm:flex-row sm:justify-center justify-start sm:items-start items-center gap-5">
          <CodeInput />
          <div className="sm:w-40 w-[50%] h-15 text-xl">
            <Button>
              <KeyRound className="min-w-[30px]" />
              UNLOCK
            </Button>
          </div>
        </div>
        <div className="mx-5 grid sm:grid-cols-5 grid-cols-2 sm:w-[70%] mt-20 mb-50">
          {Array(15)
            .fill(1)
            .map((_, i) => (
              <Chest index={i + 1} />
            ))}
        </div>
      </div>
    </>
  );
};

const CodeInput = () => {
  return (
    <div className="sm:w-120 w-full backdrop-blur-2xl h-15 bg-[rgba(109,126,134,0.5)] overflow-hidden rounded-xl border-2 border-[rgba(255,255,255,0.3)]">
      <input
        type="text"
        placeholder="Enter the codes here."
        className="w-full h-full px-4 text-2xl focus:bg-[rgba(0,0,0,0.1)]"
      />
    </div>
  );
};

export const Input = ({
  placeholder,
  type,
}: {
  placeholder: string;
  type: string;
}) => {
  return (
    <div className="w-full backdrop-blur-2xl h-15 bg-[rgba(109,126,134,0.5)] overflow-hidden rounded-xl border-2 border-[rgba(255,255,255,0.3)]">
      <input
        type={type}
        placeholder={placeholder}
        className="w-full h-full px-4 text-2xl text-white focus:bg-[rgba(0,0,0,0.1)]"
      />
    </div>
  );
};

export const Button = ({ children }: any) => {
  return (
    <button
      className="flex justify-center items-center sm:gap-2 gap-3 w-full h-full px-6 py-2 rounded-xl bg-gradient-to-b from-yellow-300 to-yellow-600 text-black
      font-semibold shadow-md border border-yellow-700
         sm:hover:from-yellow-200 sm:hover:to-yellow-500 
 sm:active:from-yellow-400 sm:active:to-yellow-700
         active:from-yellow-400 active:to-yellow-700 active:scale-95 transition-all duration-100"
    >
      {children}
    </button>
  );
};
