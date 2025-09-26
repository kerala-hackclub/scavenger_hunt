import { Button } from "../../App";

function Chest({ index }: { index: number }) {
  const playSound = () => {
    const audio = new Audio("/coinsound.mp3");
    audio.play();
  };
  return (
    <div className="relative w-full h-full rounded-[4em] bg-radial from-black/50 via-transparent via-73% sm:hover:scale-102 sm:active:scale-100 transition-all duration-150">
      <div className="text-[rgba(255,255,255,0.7)] w-8 aspect-square bg-[rgba(255,255,255,0.1)] backdrop-blur-[6px] border-2 border-white/25 flex justify-center items-center rounded-full text-xl font-bold absolute right-11 top-10">
        {index}
      </div>
      {index > 3 ? (
        <img src={"/closedchest.webp"} />
      ) : index < 3 ? (
        <img src={"/unlockedchest.webp"} />
      ) : (
        <img src={"/solvedchest.webp"} />
      )}
      {index < 3 ? (
        <div
          onClick={playSound}
          className="w-20 h-8 absolute bottom-3 left-1/4 text-[0.8em]"
        >
          <Button>COLLECT</Button>
        </div>
      ) : null}
    </div>
  );
}

export default Chest;
