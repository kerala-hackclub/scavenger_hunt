function Chest({ index }: { index: number }) {
  return (
    <div className="relative w-full h-full rounded-[4em] bg-radial from-black/50 via-transparent via-73% hover:scale-102 active:scale-100 transition-all duration-150">
      <div className="text-[rgba(255,255,255,0.7)] w-8 aspect-square bg-[rgba(255,255,255,0.3)] backdrop-blur-2xl flex justify-center items-center rounded-full text-xl font-bold absolute right-11 top-10">
        {index}
      </div>
      {index > 3 ? (
        <img src={"/closedchest.webp"} />
      ) : index < 3 ? (
        <img src={"/unlockedchest.webp"} />
      ) : (
        <img src={"/solvedchest.webp"} />
      )}
    </div>
  );
}

export default Chest;
