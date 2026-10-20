import HeroContent from "./HeroContent.jsx";
import HeroPortrait from "./HeroPortrait.jsx";

function Hero() {
  return (
    <section id="hero" className="relative isolate overflow-hidden bg-[#080707]">
      <div className="absolute inset-0">
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_78%_58%,rgba(255,102,0,0.24),transparent_28%),radial-gradient(circle_at_88%_70%,rgba(190,30,20,0.2),transparent_34%),linear-gradient(115deg,#080707_0%,#100b09_42%,#1f0d09_72%,#2b1008_100%)]" />
        <div className="absolute inset-0 bg-[radial-gradient(circle_at_center,transparent_35%,rgba(0,0,0,0.35)_100%)]" />
      </div>
      <div className="relative z-10 mx-auto max-w-7xl px-5 pb-4 pt-28 sm:px-8 lg:px-10 lg:pb-8 lg:pt-32">
        <div className="grid w-full grid-cols-1 items-end gap-8 lg:grid-cols-2 lg:gap-8">
          <div className="order-2 lg:order-1">
            <HeroContent />
          </div>
          <div className="order-1 flex justify-center lg:order-2 lg:justify-end">
            <HeroPortrait />
          </div>
        </div>
      </div>
    </section>
  );
}

export default Hero;