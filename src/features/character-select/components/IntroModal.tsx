export default function IntroModal({
    open,
    onStart,
  }: {
    open: boolean;
    onStart: () => void;
  }) {
    if (!open) return null;
  
    return (
      <div className="absolute inset-0 z-[999] flex items-center justify-center bg-black/70 backdrop-blur-sm">
        <div className="w-[min(520px,92vw)] rounded-2xl border border-white/15 bg-zinc-950/90 p-6 shadow-2xl">
          <h2 className="text-2xl font-extrabold tracking-wide text-white">
            Character Selection
          </h2>
  
          <p className="mt-3 text-sm leading-relaxed text-white/80">
            Character Selection based on{" "}
            <span className="font-semibold text-white">
              The King Of Fighters EX2: Howling Blood
            </span>
            , developed by{" "}
            <span className="font-semibold text-white">Sergio Alva</span>.
          </p>

            {/* KOF Game Image */}
            <div className="mb-4 flex justify-center">
            <img
                src="/intro/kofgb.jpg"
                alt="The King of Fighters EX2 Howling Blood"
                className="max-w-[200px] w-full object-contain"
                draggable={false}
            />
            </div>
  
          <div className="mt-6 flex justify-end">
            <button
              onClick={onStart}
              className="rounded-lg border border-cyan-300/50 bg-cyan-500/10 px-4 py-2 font-bold text-cyan-200 hover:bg-cyan-500/20"
            >
              START
            </button>
          </div>
  
          <p className="mt-3 text-xs text-white/40">
            Audio starts after you press START.
          </p>
        </div>
      </div>
    );
  }
  