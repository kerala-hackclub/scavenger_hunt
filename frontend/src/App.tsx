import { KeyRound } from "lucide-react";
import Chest from "./Components/Chest/Chest";

function App() {
  return (
    <>
      <div className="bg-black/50 w-screen h-screen overflow-scroll flex flex-col items-center">
        <div className="fixed top-0 inset-0 bg-[url('/bg.webp')] bg-cover bg-center -z-10"></div>
        <div className="fixed top-0 bg-linear-to-b sm:from-transparent from-black z-1000 w-full flex justify-between px-3 py-2 sm:text-2xl text-xl text-white/75">
          <p>Logged in as Rino</p>
          <div className="flex gap-2 bg-[rgba(0,0,0,0.3)] px-3 py-1 justify-center items-center rounded-full border-1 border-white/15">
            <img src="/coin.webp" className="w-6 h-6" />
            <p>5</p>
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
          {Array(10)
            .fill(1)
            .map((_, i) => (
              <Chest index={i + 1} />
            ))}
        </div>
      </div>
    </>
  );
}

export default App;

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
