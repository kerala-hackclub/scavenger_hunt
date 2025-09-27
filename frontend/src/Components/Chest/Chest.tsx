import { toast } from "react-toastify";
import { Button } from "../../App";

function Chest({ index, unlocked, collected, fetchUser }: { index: number, unlocked: boolean, collected: boolean, fetchUser: () => void }) {
  const playSound = () => {
    const audio = new Audio("/coinsound.mp3");
    audio.play();
  };

  const handleCollect = async () => {
    const token = localStorage.getItem("token");
    const res = await fetch("http://localhost:3000/collect", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ chestId: index }),
    });
    const data = await res.json();
    if (data.success) {
      playSound();
      toast(<ToastContent coins={data.collectedCoins} />, {
        closeButton: false,
        className: "w-30 border",
        ariaLabel: "Email received",
      });
      fetchUser();
    }
  };

  return (
    <div className="relative w-full h-full rounded-[4em] bg-radial from-black/50 via-transparent via-73% sm:hover:scale-102 sm:active:scale-100 transition-all duration-150">
      <div className="text-[rgba(255,255,255,0.7)] w-8 aspect-square bg-[rgba(255,255,255,0.1)] backdrop-blur-[6px] border-2 border-white/25 flex justify-center items-center rounded-full text-xl font-bold absolute right-11 top-10">
        {index}
      </div>
      {collected ? (
        <img src={"/solvedchest.webp"} />
      ) : unlocked ? (
        <img src={"/unlockedchest.webp"} />
      ) : (
        <img src={"/closedchest.webp"} />
      )}
      {unlocked && !collected ? (
        <div
          onClick={handleCollect}
          className="w-20 h-8 absolute bottom-3 left-1/4 text-[0.8em]"
        >
          <Button>COLLECT</Button>
        </div>
      ) : null}
    </div>
  );
}

const ToastContent = ({ coins = 0 }: { coins?: number }) => {
  return (
    <div className="w-full flex justify-start gap-5 text-2xl text-white/90 items-center">
      <img src="/coin.webp" className="w-8 aspect-square animate-bounce" />
      Collected {coins} coins!
    </div>
  );
};

export default Chest;
