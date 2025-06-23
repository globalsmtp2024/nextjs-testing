'use client';

import Image from 'next/image';

export default function AboutUs() {
  return (
    <>
      {/* Hero Section with Background Video */}
      <div className="relative min-h-screen overflow-hidden flex items-center justify-center bg-gray-50">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover"
          autoPlay
          loop
          muted
          playsInline
        >
          <source
            src="/video/20250515_1208_Bali Ocean Haven_simple_compose_01jvab8cp0fx28g2xybzwbjf7f.mp4"
            type="video/mp4"
          />
          Your browser does not support the video tag.
        </video>
        <div className="relative z-10 max-w-2xl p-8 bg-black bg-opacity-50 rounded-lg overflow-y-auto max-h-[80vh] text-center">
          <Image
            src="/images/Favicon-Travel-Logo.png"
            alt="TravelSpoken Logo"
            width={150}
            height={150}
            className="w-36 h-36 rounded-full object-cover mb-4 mx-auto border-[3px] border-white"
          />
          <h1
            className="text-white text-4xl md:text-[3.2rem] font-bold mb-4 font-montserrat tracking-wide"
            style={{ textShadow: '0 2px 12px rgba(31,199,122,0.1)' }}
          >
            TravelSpoken
          </h1>
          <p
            className="text-white text-base md:text-[1.35rem] leading-relaxed md:leading-[2.1rem] font-medium mb-2"
            style={{ textShadow: '0 2px 8px rgba(31,199,122,0.1)' }}
          >
            From the beginning of time, travel has been woven into the fabric of who we are.
            Long before borders were drawn and maps were made, our ancestors journeyed across vast,
            untamed lands in search of food, warmth, and safety. Travel was not a luxury &mdash; it was
            survival. It was instinct. It was our first conversation with the Earth, our original
            dialogue with change.
            <br />
            <br />
            But even then, it was more than just movement. It was discovery. It was story. Every
            journey carved the path for evolution, for connection, for understanding. We crossed
            rivers and scaled mountains not only to live &mdash; but to learn, to become.
            <br />
            <br />
            As centuries unfolded, travel transformed from survival into exploration &mdash; driven by
            curiosity, wonder, and the need to feel something beyond what we already knew.
            Pilgrimages, voyages, migrations… Each step across land or sea deepened our sense of
            humanity. We became artists of experience. Seekers of meaning.
            <br />
            <br />
            Travel is how humans have always made sense of the world and their place within it.
          </p>
        </div>
      </div>

      {/* Founding Mission Section */}
      <section className="bg-black text-white py-12 px-6 flex flex-col md:flex-row items-center">
        <Image
          src="/images/founder-headshot.JPEG"
          alt="Founder Headshot"
          width={200}
          height={200}
          className="rounded-lg mb-6 md:mb-0 md:mr-8 object-cover"
        />
        <div>
          <h2 className="text-3xl md:text-[2.5rem] font-bold mb-4 font-serif">
            Founding Mission
          </h2>
          <p className="text-base md:text-[1.125rem] leading-relaxed mb-4">
            Travel Spoken was founded by Eni Maj, a talented and driven founder with the goal
            to make the experience of travel planning modern, accommodating, and seamless for
            everyone. The company mission statement is &quot;You Travel, We do the work.&quot; Eni knows
            that the stress of travel planning can make it overwhelming when it should be
            relaxing and rewarding. Travel is a time to make memories that last a lifetime and
            not a time to stress over plans. We feel the clarity and organization of Travel
            Spoken will help revolutionize consumer travel booking and make travel a stress-free
            and seamless experience.
            <br />
            <br />
            Building on this vision, Travel Spoken combines cutting-edge technology with a human
            touch. Our intuitive platform learns each traveler&apos;s unique preferences—budget,
            pace, and personal interests—and dynamically curates every aspect of the trip,
            from flights and transfers to accommodations and day-by-day recommendations. Behind
            the scenes, our team of seasoned travel experts vet every option, negotiate the best
            rates, and coordinate logistics so that our clients can simply choose their
            destination and hit &quot;go.&quot;
            <br />
            <br />
            At Travel Spoken, inclusivity is at the heart of everything we do. Whether you&apos;re a
            solo adventurer seeking off-the-beaten-path experiences, a family looking for
            stress-free excursions, or a group of friends chasing bucket-list dreams, our
            service adapts to your needs. We believe that planning should inspire excitement,
            not anxiety—and that every journey deserves the freedom to unfold without the
            weight of logistics.
            <br />
            <br />
            From the moment you envision your next getaway to the final day of your return,
            &quot;You Travel, We do the work.&quot; isn&apos;t just a slogan—it&apos;s our promise.
            Travel Spoken exists to transform the planning process into an effortless extension of the travel
            experience itself, so you can focus on what truly matters: discovering new
            horizons, sharing moments with loved ones, and creating stories that last a lifetime.
          </p>
        </div>
      </section>
    </>
  );
}
