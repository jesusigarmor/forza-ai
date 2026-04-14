import Image from "next/image";
import Link from "next/link";

export function Hero() {
  return (
    <section className="min-h-screen flex items-center px-8 lg:px-16 py-16">
      <div className="w-full grid grid-cols-1 lg:grid-cols-2 gap-14 lg:gap-20 items-center">

        {/* Left — headline + CTA */}
        <div className="flex flex-col gap-14">
          <h1 className="text-[clamp(3rem,12vw,9rem)] font-black leading-[0.88] tracking-[-0.04em]">
            be better.
          </h1>
          <Link
            href="/login"
            className="self-start bg-[#F5F7FA] text-[#0A0D0F] text-[13px] font-semibold px-7 py-3.5 rounded-[2px] hover:bg-white transition-colors duration-200"
          >
            Login
          </Link>
        </div>

        {/* Right — hero image */}
        <div className="order-last">
          <Image
            src="/mdvp.jpg"
            alt="Cyclist carrying bike through muddy terrain"
            width={800}
            height={1067}
            className="w-full h-auto rounded-md"
            priority
          />
        </div>

      </div>
    </section>
  );
}
