'use client';

import { useState, ReactNode } from 'react';
import Head from 'next/head';

interface FAQCardProps {
  question: string;
  children: ReactNode;
}

function FAQCard({ question, children }: FAQCardProps) {
  const [isOpen, setIsOpen] = useState(false);

  return (
    <div className="mb-4 rounded-lg bg-white shadow transition-transform hover:-translate-y-0.5 hover:shadow-lg">
      <div
        onClick={() => setIsOpen(prev => !prev)}
        className="flex w-full justify-between px-4 py-3 cursor-pointer font-semibold text-gray-900"
      >
        <span>{question}</span>
        <span className={`text-xl transform transition-transform duration-300 ${isOpen ? 'rotate-45' : ''}`}>
          +
        </span>
      </div>
      <div
        className={`overflow-hidden transition-all duration-300 ${isOpen ? 'max-h-[1000px] py-2 px-4' : 'max-h-0 py-0 px-4'} text-gray-700 text-sm`}
      >
        {children}
      </div>
    </div>
  );
}

export default function FAQPage() {
  return (
    <>
      <Head>
        <title>FAQ - Travel Spoken</title>
        <link rel="icon" type="image/png" href="/favicon/Favicon-Travel-2.png" />
      </Head>

      <main className="mx-auto max-w-3xl px-4 py-8">
        <h1 className="mb-6 text-3xl font-bold text-center">Frequently Asked Questions</h1>

        <div className="mb-8 rounded-lg bg-white p-6 shadow text-gray-700 text-lg leading-relaxed">
          We envision a world where travel feels human again—where planning is effortless, personal, and joyful.
          Travel Spoken will be the trusted companion that brings back the magic of discovery, so travelers can focus
          on what truly matters: the experience.
        </div>

        <div className="max-h-[70vh] overflow-y-auto pr-2">
          {/* General Questions */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              General Questions
            </h2>
            <div>
              <FAQCard question="What is Travel Spoken?">
                Travel Spoken is an advanced AI-driven chatbot that addresses the complexity and wide-spread
                frustration of travel planning by streamlining the entire process.
              </FAQCard>

              <FAQCard question="How can Travel Spoken help you?">
                Travel planning can quickly become overwhelming—choosing the right destination, comparing endless
                flight options, finding the best place to stay, and organizing a smooth itinerary. That&apos;s where
                our AI-driven platform steps in.
                <br />
                <br />
                Our platform not only simplifies these steps but also personalizes the experience, allowing users
                to focus on the joy of traveling rather than the stress of planning.
                <br />
                <br />
                We tackle the initial problem of destination selection by offering tailored recommendations based
                on user preferences and travel history. Next, we simplify the flight booking process by aggregating
                options from multiple airlines, making it easy for users to compare and choose the best flight for
                their needs. When it comes to accommodation, our platform filters choices based on budget and
                location, eliminating the need for tedious research.
                <br />
                <br />
                Additionally, our AI capabilities help in crafting and organizing itineraries, ensuring that all
                aspects of the trip, from check-in times to activity scheduling, align seamlessly. This
                comprehensive approach not only saves time but also enhances the overall travel experience, making
                planning enjoyable and hassle-free.
              </FAQCard>

              <FAQCard question="How do we use AI to curate travel itineraries?">
                Our technology transforms the entire process by making it simpler, faster, and fully personalized.
                Here&apos;s how:
                <ul className="mt-4 list-disc pl-6">
                  <li>
                    <strong>Smart Destination Suggestions:</strong> Based on your preferences and travel history,
                    our AI recommends destinations tailored to your style—whether you&apos;re looking for adventure,
                    relaxation, culture, or a mix of everything.
                  </li>
                  <li>
                    <strong>Optimized Flight Search:</strong> We pull data from multiple airlines and analyze
                    thousands of flight combinations, helping you easily compare routes, prices, and travel times—all
                    in one place.
                  </li>
                  <li>
                    <strong>Accommodation Filtering:</strong> Skip the hours of research. Our system narrows down
                    lodging options based on your budget, location preferences, and quality standards, saving you
                    time and effort.
                  </li>
                  <li>
                    <strong>Itinerary Automation:</strong> From booking confirmations to activity scheduling,
                    our AI builds a smart, organized itinerary that aligns seamlessly with your flights and
                    accommodations—down to check-in times and local time zones.
                  </li>
                  <li>
                    <strong>Multiple Calendar Syncing:</strong> By providing access to your personal calendars, we
                    are able to match and adapt any current or future itineraries to events that cannot be missed or
                    that were forgotten. We can also add confirmed itineraries to your calendars—keeping everything
                    all logged in one place.
                  </li>
                </ul>
                By using advanced algorithms and real-time data, we take the stress out of planning so you can focus
                on what really matters: enjoying your journey.
              </FAQCard>

              <FAQCard question="Can I customize the itinerary generated by the AI myself?">
                Yes! After the AI curates your personalized itinerary, you have full flexibility to edit, add,
                remove, or rearrange activities, accommodations, and transportation options. We believe in combining
                the power of automation with your personal touch to create a truly customized travel experience.
              </FAQCard>

              <FAQCard question="Is this service free to use?">
                Our core itinerary planning and booking features are free to use. However, certain booking services
                or premium features (such as calendar syncing) may involve fees, which will be clearly outlined
                before any purchase is made.
              </FAQCard>

              <FAQCard question="How is Travel Spoken different from other travel booking websites?">
                Unlike typical travel sites that focus solely on bookings, Travel Spoken doesn’t just show you
                options—we curate and compare them for you. Our AI learns your travel style and delivers smart,
                tailored suggestions through a conversational experience, saving you time and stress. Travel Spoken
                uses AI to personalize and streamline every step of your travel experience—from destination
                discovery to complete itinerary creation—saving you time, reducing stress, and improving your
                overall trip.
              </FAQCard>
            </div>
          </section>

          {/* Itinerary Planning */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Itinerary Planning
            </h2>
            <div>
              <FAQCard question="What kind of information do I need to provide for itinerary planning?">
                You&apos;ll be asked to share basic details on a simple intake questionnaire—such as your intended
                travel dates, budget, preferred destinations or activities, and travel style (e.g: relaxed,
                adventurous, cultural, etc.). The more we know, the better we can personalize your trip!
              </FAQCard>

              <FAQCard question="Can I include specific activities or destinations I want to visit?">
                Yes! Our platform lets you customize and prioritize specific activities or locations you want
                included in your itinerary.
              </FAQCard>

              <FAQCard question="Does the AI consider weather, events, or seasons in planning?">
                Yes. Our AI accounts for seasonality and destination-specific factors to suggest travel dates and
                activities that align with the best times to visit.
              </FAQCard>

              <FAQCard question="Does the AI consider safety and possible crime at the chosen destinations?">
                While our AI primarily focuses on personal preferences, travel logistics, and overall trip quality,
                it also factors in general safety data and travel advisories when recommending destinations. We aim
                to suggest places that are not only enjoyable but also reliable and safe for travelers. However, we
                always recommend that users consult official government travel advisories for the most up-to-date and
                detailed safety information.
              </FAQCard>

              <FAQCard question="Can I plan multi-city or multi-country trips?">
                Absolutely! Our system is designed to handle complex itineraries and can efficiently plan multi-city
                or multi-country adventures.
              </FAQCard>

              <FAQCard question="How far in advance should I use the platform to plan a trip?">
                You can start planning as early as you like, but we recommend using the platform at least 4–6 weeks
                in advance to get the best selection of flights and accommodations.
              </FAQCard>
            </div>
          </section>

          {/* Personalization & Experience */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Personalization & Experience
            </h2>
            <div>
              <FAQCard question="Can I set travel preferences for future trips (e.g., no layovers, only boutique hotels, etc.)?">
                Yes. You can save detailed preferences in your profile—our AI uses these to optimize recommendations
                and bookings for future trips.
              </FAQCard>

              <FAQCard question="How do I update my travel profile or preferences?">
                You can update your travel profile at any time from your account settings, where you can adjust
                preferences like flight class, hotel type, dietary needs, and more.
              </FAQCard>

              <FAQCard question="Can the AI suggest travel options based on my interests (e.g., food, nature, culture)?">
                Yes! Our AI considers your interests, travel style, and past behavior to recommend experiences,
                destinations, and activities tailored just for you.
              </FAQCard>
            </div>
          </section>

          {/* Flight & Hotel Booking */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Flight & Hotel Booking
            </h2>
            <div>
              <FAQCard question="Does your platform book flights and hotels directly?">
                Yes. We aggregate and present options from multiple providers, and you can book flights and
                accommodations directly through our platform or through trusted third-party partners.
              </FAQCard>

              <FAQCard question="Are the flight and hotel options based on my preferences or budget?">
                Yes. Our AI filters options based on your budget, location preferences, and travel style to ensure
                the best possible match.
              </FAQCard>

              <FAQCard question="Can I earn travel points or rewards through bookings?">
                This depends on the airline or hotel provider. If they support rewards programs, you can usually
                enter your loyalty number during checkout and still earn points.
              </FAQCard>

              <FAQCard question="Is it possible to change or cancel bookings through your site?">
                Booking changes or cancellations are subject to provider policies. We help facilitate the process and
                provide support if any issues arise.
              </FAQCard>

              <FAQCard question="Do you offer last-minute travel deals or recommendations?">
                Yes! Our AI continuously monitors availability and can surface last-minute deals and recommendations
                based on your current location and preferences.
              </FAQCard>
            </div>
          </section>

          {/* Trip Changes & Emergencies */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Trip Changes & Emergencies
            </h2>
            <div>
              <FAQCard question="What happens if my flight is delayed or canceled?">
                If your flight is affected, we provide real-time notifications and support through our platform.
                You can also reach out to the airline or booking partner for rebooking options.
              </FAQCard>

              <FAQCard question="Can I make changes to the itinerary after it&apos;s finalized?">
                Yes. You can easily edit or update your itinerary, including adding new activities or changing
                plans, right from your dashboard.
              </FAQCard>

              <FAQCard question="Do you offer travel insurance or partner with insurance providers?">
                We&apos;re currently partnering with select travel insurance providers to offer optional coverage
                during the booking process, depending on your location and trip type.
              </FAQCard>
            </div>
          </section>

          {/* Booking & Payments */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Booking & Payments
            </h2>
            <div>
              <FAQCard question="What payment methods do you accept?">
                We accept all major credit and debit cards. Depending on the provider, you may also be able to use
                digital wallets like Apple Pay or Google Pay.
              </FAQCard>

              <FAQCard question="Is payment processed through your site or via third-party providers?">
                Flights and accommodations are often processed through trusted third-party booking partners, but
                you complete the checkout seamlessly through our platform.
              </FAQCard>

              <FAQCard question="Are there any hidden fees or service charges?">
                No. We&apos;re transparent with pricing—any fees are clearly displayed before checkout, and there
                are no hidden charges.
              </FAQCard>
            </div>
          </section>

          {/* Technology & Data */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Technology & Data
            </h2>
            <div>
              <FAQCard question="Is my personal and travel data safe on your platform?">
                Yes. We take privacy and security seriously and use industry-standard encryption and data
                protection measures to safeguard your information.
              </FAQCard>

              <FAQCard question="How accurate and up-to-date is the AI&apos;s travel information?">
                Our AI pulls real-time data from reliable sources, ensuring that flight options, accommodation
                listings, and itinerary suggestions are accurate and current. We partner with reputable travel data
                providers and use secure APIs to deliver the most relevant and up-to-date options for flights and
                hotels.
              </FAQCard>

              <FAQCard question="Does the AI learn from my previous trips or preferences?">
                Yes. This is our mission at Travel Spoken. Over time, our system learns your preferences (as early on
                as the intake form) to provide smarter, more personalized recommendations for future trips. You can
                also safely store all of your travel information for faster future use.
              </FAQCard>
            </div>
          </section>

          {/* Support & Policies */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Support & Policies
            </h2>
            <div>
              <FAQCard question="What should I do if I encounter an issue with my itinerary or booking?">
                You can contact our customer support team directly through the platform. We&apos;re here to help
                resolve booking or itinerary issues as quickly as possible.
              </FAQCard>

              <FAQCard question="Do you offer customer support or travel assistance during my trip?">
                Definitely! Our platform includes ongoing support, so you can reach out if you encounter any issues
                while traveling. If you decide to enroll in our premium services, you will have 24/7 access to our
                support team during your travels, with instant response times.
              </FAQCard>

              <FAQCard question="What if I am traveling with other people? Can I share my itinerary with friends or family?">
                No problem! Our platform is designed to support group travel planning and makes it easy to share your
                travel itinerary with friends, family, or fellow travelers—whether you&apos;re planning a group trip
                or just want input from someone else.
              </FAQCard>
            </div>
          </section>

          {/* Group & Family Travel */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Group & Family Travel
            </h2>
            <div>
              <FAQCard question="Can I add different traveler preferences within one trip?">
                Yes. Whether you&apos;re planning for a group with mixed interests or different budgets, our AI
                balances those variables to design a trip everyone will enjoy.
              </FAQCard>

              <FAQCard question="Can I plan a trip for my family or a group of friends?">
                Absolutely. You can enter details for multiple travelers, and our AI will take those preferences
                into account when planning. Plus, you can share the itinerary and collaborate with others directly
                on the platform.
                <br />
                <br />
                You can indicate the number of travelers and their preferences—such as budgets, interests, or
                desired activities—and our AI will take that into account when building your itinerary. Once your
                AI-generated itinerary is ready, you can:
                <ul className="mt-4 list-disc pl-6">
                  <li>
                    Send a shareable link digitally so others can view the full itinerary on any device—no login
                    required—making it easy for loved ones to stay informed.
                  </li>
                  <li>
                    Invite collaborators to join in on your travel plans and make edits or suggest changes directly
                    within the platform; such as swapping activities, adjusting budgets, or proposing new
                    destinations. Multiple calendars can be synced to ensure everyone&apos;s needs are considered
                    for a smooth and enjoyable group trip.
                  </li>
                  <li>
                    Comment and vote on options (for example, if you&apos;re deciding between two hotels or
                    multiple activities).
                  </li>
                  <li>
                    Group payment plans that allow each other to delegate payment responsibilities and pay
                    separately.
                  </li>
                  <li>
                    Keep everything organized in one place, with real-time updates, so everyone stays on the same
                    page—no more endless message threads or confusing spreadsheets.
                  </li>
                </ul>
                This makes group travel planning not only easier, but also more interactive and fun. Everyone
                involved gets a say, and the AI helps balance preferences to build a trip everyone will enjoy.
              </FAQCard>
            </div>
          </section>

          {/* Travel Documents & Requirements */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Travel Documents & Requirements
            </h2>
            <div>
              <FAQCard question="Does your platform help with visa requirements or travel restrictions?">
                Yes. When available, our platform provides basic guidance and links to official resources on visa
                requirements and travel restrictions based on your citizenship and destination. However, always
                verify directly with official government sites.
              </FAQCard>

              <FAQCard question="Will I receive digital confirmations and travel documents?">
                Absolutely. Once bookings are completed, you&apos;ll receive digital confirmations, e-tickets, and
                accommodation vouchers via email and within your account dashboard.
              </FAQCard>

              <FAQCard question="Can I store or access my travel documents on the platform?">
                Yes. You can access and manage all essential documents directly from your itinerary dashboard—perfect
                for organizing your trip in one place.
              </FAQCard>
            </div>
          </section>

          {/* Mobile Experience */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Mobile Experience
            </h2>
            <div>
              <FAQCard question="Is there a mobile app or mobile-friendly version of the platform?">
                Yes. Our platform is fully mobile-optimized, and we&apos;re actively developing a dedicated app
                for even easier access on the go.
              </FAQCard>

              <FAQCard question="Can I access my itinerary offline while traveling?">
                We&apos;re working on features that allow you to download your full itinerary for offline access,
                including confirmation numbers, addresses, and maps.
              </FAQCard>
            </div>
          </section>

          {/* Loyalty & Accounts */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Loyalty & Accounts
            </h2>
            <div>
              <FAQCard question="Do I need an account to use the platform?">
                You can explore the platform without an account, but to save itineraries, receive recommendations,
                and make bookings, you&apos;ll need to create a free user profile.
              </FAQCard>

              <FAQCard question="Will I receive recommendations or offers for future trips?">
                Yes. Our AI learns your preferences over time and will send you personalized travel suggestions,
                deals, and seasonal offers.
              </FAQCard>

              <FAQCard question="Can I save favorite destinations or past itineraries?">
                Yes. You can bookmark places, save past trips, and reuse or modify itineraries for future travel.
              </FAQCard>
            </div>
          </section>

          {/* Sustainability & Ethics */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Sustainability & Ethics
            </h2>
            <div>
              <FAQCard question="Do you offer eco-friendly or sustainable travel options?">
                Yes. When available, we highlight eco-certified accommodations, green transportation options, and
                activities that support local communities, so you can make more sustainable travel choices.
              </FAQCard>

              <FAQCard question="Does the platform promote local or responsible tourism?">
                Absolutely. We aim to recommend authentic, locally-rooted experiences and small businesses where
                possible, helping you travel more ethically and meaningfully.
              </FAQCard>
            </div>
          </section>

          {/* Language & Accessibility */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              Language & Accessibility
            </h2>
            <div>
              <FAQCard question="Is the platform available in multiple languages?">
                We are currently available in English, with plans to support additional languages to better serve
                international travelers.
              </FAQCard>

              <FAQCard question="Do you offer accessibility-friendly travel options?">
                We&apos;re working on integrating filters for wheelchair-accessible accommodations and experiences.
                In the meantime, users can request help from our support team to tailor plans for specific needs.
              </FAQCard>
            </div>
          </section>

          {/* General */}
          <section className="mb-10">
            <h2 className="mb-4 border-l-4 border-gray-900 bg-gray-200 px-2 py-1 text-xl font-bold text-gray-900 rounded">
              General
            </h2>
            <div>
              <FAQCard question="Do you have a refund policy?">
                Refund policies depend on the airline, hotel, or activity provider you book with. We&apos;ll clearly
                show cancellation and refund terms during the booking process, and support you in contacting
                providers if needed.
              </FAQCard>

              <FAQCard question="Can I give feedback or request new features?">
                Yes! We value your input and regularly improve the platform based on user feedback. You can send
                suggestions through your account dashboard or our contact form.
              </FAQCard>
            </div>
          </section>
        </div>
      </main>
    </>
  );
}