import React from 'react'
import { Link } from 'react-router-dom'

const LandingPage = () => {
  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      <main className="flex-1 pt-16 pb-20">
        <section className="w-full max-w-7xl mx-auto mt-4 px-4">
          
          {/* Official Competitions */}
          <div className="mt-10 text-center">
            <h2 className="text-2xl md:text-3xl font-bold mb-6">
              OUR OFFICIAL COMPETITIONS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
              {/* Card 1 */}
              <div className="
                bg-white border rounded-lg p-5 transition-transform duration-300 
                hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://th.bing.com/th/id/R.22eccc3ce81b3aab9d555997784c6e82?rik=0DMdZOgo1oX10Q&pid=ImgRaw&r=0"
                  alt="Valorant"
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">VALORANT</h3>
              </div>

              {/* Card 2 */}
              <div className="
                bg-white border rounded-lg p-5 transition-transform duration-300 
                hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/400?text=College+LoL"
                  alt="College LoL"
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">
                  COLLEGE LEAGUE OF LEGENDS
                </h3>
              </div>

              {/* Card 3 */}
              <div className="
                bg-white border rounded-lg p-5 transition-transform duration-300 
                hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/400?text=Your+Other+Game"
                  alt="Your Other Game"
                  className="mx-auto mb-4"
                />
                <h3 className="text-lg font-semibold">
                  ANOTHER COMPETITION
                </h3>
              </div>
            </div>
          </div>

          {/* Latest News */}
          <div className="mt-16">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl md:text-2xl font-bold">LATEST NEWS</h2>
              <Link to="#" className="text-semored hover:underline text-sm">
                See more news
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              {/* News Card 1 */}
              <div className="
                bg-white border rounded-lg p-4 transition-transform duration-300
                hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=News+1"
                  alt="News 1"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  NC State to host 2025 CLoL & CVAL Championship Finals!
                </h3>
                <p className="text-sm text-gray-600">
                  In collaboration with Visit Raleigh, NC State University,
                  ExitLag, and Riot Games
                </p>
              </div>

              {/* News Card 2 */}
              <div className="
                bg-white border rounded-lg p-4 transition-transform duration-300 
                hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=News+2"
                  alt="News 2"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  2025 UENA Co-streaming & Broadcast Partner Program
                </h3>
                <p className="text-sm text-gray-600">
                  We are looking for partners to work with for broadcast coverage
                  this season.
                </p>
              </div>

              {/* News Card 3 */}
              <div className="
                bg-white border rounded-lg p-4 transition-transform duration-300 
                hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=News+3"
                  alt="News 3"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  2025 College League of Legends and Valorant Season Has Begun
                </h3>
                <p className="text-sm text-gray-600">
                  Get ready for the 2025 season of College LoL & College Valorant.
                </p>
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-16">
            <h2 className="text-xl md:text-2xl font-bold mb-6">
              UPCOMING EVENTS
            </h2>
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
              {/* Event Card 1 */}
              <div className="
                bg-white border rounded-lg p-4 flex flex-col 
                transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=Event+1"
                  alt="Event 1"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  CVAL Regional Conference - Championship Playoffs
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  29/03/2025 2:00 pm
                </p>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full self-start">
                  Valorant
                </span>
              </div>

              {/* Event Card 2 */}
              <div className="
                bg-white border rounded-lg p-4 flex flex-col 
                transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=Event+2"
                  alt="Event 2"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  CLoL Regional Conference - Open Playoffs
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  29/03/2025 2:00 pm
                </p>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full self-start">
                  League of Legends
                </span>
              </div>

              {/* Event Card 3 */}
              <div className="
                bg-white border rounded-lg p-4 flex flex-col 
                transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=Event+3"
                  alt="Event 3"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  CVAL Regional Conference - Open Playoffs
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  29/03/2025 2:00 pm
                </p>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full self-start">
                  Valorant
                </span>
              </div>

              {/* Event Card 4 */}
              <div className="
                bg-white border rounded-lg p-4 flex flex-col 
                transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]
              ">
                <img
                  src="https://via.placeholder.com/300x150?text=Event+4"
                  alt="Event 4"
                  className="w-full object-cover mb-3"
                />
                <h3 className="text-md font-semibold mb-2">
                  CLoL Regional Conference - Championship Playoffs
                </h3>
                <p className="text-sm text-gray-500 mb-4">
                  29/03/2025 2:00 pm
                </p>
                <span className="bg-gray-100 text-gray-800 text-xs px-2 py-1 rounded-full self-start">
                  League of Legends
                </span>
              </div>
            </div>
          </div>

        </section>
      </main>
    </div>
  )
}

export default LandingPage
