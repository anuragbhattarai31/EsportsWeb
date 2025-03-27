"use client"

import { useState, useEffect } from "react"
import { Link } from "react-router-dom"
import { Calendar, Gamepad2, ExternalLink, Clock } from "lucide-react"

const LandingPage = () => {
  const [availableStations, setAvailableStations] = useState(0)

  // Fetch available stations count
  useEffect(() => {
    const fetchAvailableStations = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/bookings/available-count")
        if (response.ok) {
          const data = await response.json()
          setAvailableStations(data.count || 0)
        }
      } catch (error) {
        console.error("Failed to fetch available stations:", error)
      }
    }

    fetchAvailableStations()
  }, [])

  const teams = [
    { name: "Overwatch 2", image: "https://th.bing.com/th/id/OIP.pIA-RUSH0FXbYjF0W4AAbQHaEK?rs=1&pid=ImgDetMain" },
    {
      name: "League of Legends",
      image:
        "https://static0.thegamerimages.com/wordpress/wp-content/uploads/2020/02/League-of-Legends-Wallpaper-Resized.jpg",
    },
    { name: "Counter-Strike 2", image: "https://www.gaming.net/wp-content/uploads/2023/03/Counter-Strike-2-1.jpg" },
    {
      name: "Rocket League",
      image: "https://cdn2.unrealengine.com/egs-rocketleague-psyonixllc-s3-2560x1440-56d55e752216.jpg",
    },
    {
      name: "Super Smash Bros",
      image: "https://gameluster.com/wp-content/uploads/2018/12/Super-Smash-Bros.-Ultimate-review-featured-image.jpg",
    },
    {
      name: "Valorant",
      image:
        "https://cdn1.epicgames.com/offer/cbd5b3d310a54b12bf3fe8c41994174f/EGS_VALORANT_RiotGames_S1_2560x1440-91dc9490f14942ad5eeef278eb3ef4a6",
    },
    {
      name: "Fortnite",
      image: "https://cdn2.unrealengine.com/fortnite-og-social-1920x1080-a5adda66fab9.jpg",
    },
    {
      name: "Apex Legends",
      image:
        "https://media.contentapi.ea.com/content/dam/apex-legends/images/2019/01/apex-featured-image-16x9.jpg.adapt.crop16x9.1023w.jpg",
    },
  ]

  const events = [
    {
      title: "CVAL Regional Conference - Championship Playoffs",
      date: "March 29, 2025 2:00 PM",
      game: "Valorant",
      streamLink: "https://www.twitch.tv/semoesports",
    },
    {
      title: "CLoL Regional Conference - Open Playoffs",
      date: "April 5, 2025 3:00 PM",
      game: "League of Legends",
      streamLink: "https://www.twitch.tv/semoesports",
    },
    {
      title: "Rocket League Tournament",
      date: "April 12, 2025 1:00 PM",
      game: "Rocket League",
      streamLink: "https://www.youtube.com/channel/UCsemoesports",
    },
    {
      title: "CS2 Showdown",
      date: "April 19, 2025 4:00 PM",
      game: "Counter-Strike 2",
      streamLink: "https://www.twitch.tv/semoesports",
    },
  ]

  return (
    <div className="bg-white text-black min-h-screen flex flex-col">
      {/* Hero Banner with Image */}
      <div className="relative w-full h-[80vh] overflow-hidden">
        <img
          src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&auto=format&fit=crop&w=2070&q=80"
          alt="Esports Banner"
          className="absolute top-0 left-0 w-full h-full object-cover object-center transform scale-105 transition-transform duration-10000 animate-slow-zoom"
        />

        {/* Enhanced gradient overlay with animation */}
        <div className="absolute inset-0 bg-gradient-to-r from-black/90 via-black/80 to-semored/40 animate-gradient"></div>

        {/* Content - Left aligned with animations */}
        <div className="absolute inset-0 flex flex-col justify-center z-10 px-8 md:px-16 lg:px-24">
          <div className="max-w-2xl animate-fade-in-up">
            <h1 className="text-4xl md:text-6xl font-bold mb-4 text-left text-white">
              WELCOME TO <span className="text-semored">SEMO ESPORTS</span>
            </h1>
            <p
              className="text-xl md:text-2xl text-left text-gray-100 mb-8 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.3s", animationFillMode: "forwards" }}
            >
              Compete. Connect. Conquer.
            </p>
            <div
              className="flex flex-wrap gap-4 opacity-0 animate-fade-in"
              style={{ animationDelay: "0.6s", animationFillMode: "forwards" }}
            >
              <Link
                to="/register"
                className="bg-semored hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Join Our Team
              </Link>
              <Link
                to="/club-registration"
                className="bg-transparent hover:bg-white/20 text-white border-2 border-white font-bold py-3 px-6 rounded-md transition-all transform hover:scale-105 hover:shadow-lg"
              >
                Register for Club
              </Link>
            </div>
          </div>
        </div>
      </div>

      <main className="flex-1">
        <section className="w-full max-w-7xl mx-auto px-4">
          {/* Featured Teams */}
          <div className="mt-10 text-center">
            <h2 className="text-3xl md:text-4xl font-bold mb-2">View our team roster</h2>
            <p className="text-gray-600 mb-8 max-w-2xl mx-auto">
              Representing SEMO in competitive gaming across multiple titles
            </p>
            <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
              {teams.map((team, index) => (
                <div
                  key={index}
                  className="bg-white border shadow-md rounded-lg overflow-hidden 
                            transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]"
                >
                  <div className="w-full h-48 overflow-hidden">
                    <img
                      src={team.image || "/placeholder.svg"}
                      alt={team.name}
                      className="w-full h-full object-cover"
                    />
                  </div>
                  <div className="p-4">
                    <h3 className="text-lg font-semibold">{team.name}</h3>
                    <Link
                      to={`/teams/${team.name.toLowerCase().replace(/\s+/g, "-")}`}
                      className="mt-2 inline-block text-semored hover:underline text-sm"
                    >
                      View Team →
                    </Link>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Book a Station */}
          <div className="mt-20 bg-gray-900 text-white rounded-xl overflow-hidden">
            <div className="grid md:grid-cols-2">
              <div className="p-8 md:p-12 flex flex-col justify-center">
                <h2 className="text-3xl md:text-4xl font-bold mb-4">Book a Gaming Station</h2>
                <p className="text-gray-300 mb-6">
                  Reserve your spot at our state-of-the-art gaming facility. Practice with your team or enjoy some solo
                  gaming time.
                </p>
                <div className="flex items-center mb-6">
                  <div className="w-16 h-16 rounded-full bg-semored flex items-center justify-center mr-4">
                    <span className="text-2xl font-bold">{availableStations}</span>
                  </div>
                  <p>Stations currently available</p>
                </div>
                <Link
                  to="/login"
                  className="bg-semored hover:bg-red-700 text-white font-bold py-3 px-6 rounded-md inline-block transition-all transform hover:scale-105 w-fit"
                >
                  Book Now
                </Link>
              </div>
              <div className="hidden md:block">
                <img
                  src="https://images.unsplash.com/photo-1542751371-adc38448a05e?ixlib=rb-4.0.3&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D&auto=format&fit=crop&w=2070&q=80"
                  alt="Gaming Station"
                  className="w-full h-full object-cover"
                />
              </div>
            </div>
          </div>

          {/* Upcoming Events */}
          <div className="mt-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Upcoming Events</h2>
              <Link to="/events" className="text-semored hover:underline text-sm">
                View All Events →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {events.map((event, index) => (
                <div
                  key={index}
                  className="bg-white border shadow-md rounded-lg p-6 flex flex-col
                            transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]"
                >
                  <div className="flex items-center text-semored mb-3">
                    <Calendar className="w-5 h-5 mr-2" />
                    <span className="text-sm font-medium">{event.date}</span>
                  </div>

                  <h3 className="text-lg font-semibold mb-3">{event.title}</h3>

                  <div className="flex items-center mb-4">
                    <Gamepad2 className="w-4 h-4 mr-2 text-gray-500" />
                    <span className="text-sm text-gray-600">{event.game}</span>
                  </div>

                  <div className="mt-auto pt-4 border-t border-gray-100">
                    <a
                      href={event.streamLink}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="flex items-center text-semored hover:underline"
                    >
                      <ExternalLink className="w-4 h-4 mr-2" />
                      <span className="text-sm">Watch Live</span>
                    </a>
                  </div>
                </div>
              ))}
            </div>
          </div>

          {/* Latest News */}
          <div className="mt-20 mb-20">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-3xl md:text-4xl font-bold">Latest News</h2>
              <Link to="/news" className="text-semored hover:underline text-sm">
                See All News →
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
              {/* News Card 1 */}
              <div
                className="bg-white border shadow-md rounded-lg overflow-hidden
                            transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]"
              >
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">March 15, 2025</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">NC State to host 2025 CLoL & CVAL Championship Finals!</h3>
                  <p className="text-gray-600 mb-4">
                    In collaboration with Visit Raleigh, NC State University, ExitLag, and Riot Games
                  </p>
                  <Link to="/news/1" className="text-semored hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>

              {/* News Card 2 */}
              <div
                className="bg-white border shadow-md rounded-lg overflow-hidden
                            transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]"
              >
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">March 10, 2025</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">2025 UENA Co-streaming & Broadcast Partner Program</h3>
                  <p className="text-gray-600 mb-4">
                    We are looking for partners to work with for broadcast coverage this season.
                  </p>
                  <Link to="/news/2" className="text-semored hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>

              {/* News Card 3 */}
              <div
                className="bg-white border shadow-md rounded-lg overflow-hidden
                            transition-transform duration-300 hover:scale-105 hover:shadow-[0_0_15px_rgba(200,16,46,0.3)]"
              >
                <div className="p-6">
                  <div className="flex items-center text-gray-500 mb-2">
                    <Clock className="w-4 h-4 mr-2" />
                    <span className="text-sm">March 5, 2025</span>
                  </div>
                  <h3 className="text-xl font-semibold mb-2">
                    2025 College League of Legends and Valorant Season Has Begun
                  </h3>
                  <p className="text-gray-600 mb-4">Get ready for the 2025 season of College LoL & College Valorant.</p>
                  <Link to="/news/3" className="text-semored hover:underline">
                    Read More →
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </section>
      </main>
    </div>
  )
}

export default LandingPage

export const style = `
  @keyframes slow-zoom {
    from { transform: scale(1); }
    to { transform: scale(1.05); }
  }
  
  @keyframes fade-in-up {
    from { opacity: 0; transform: translateY(20px); }
    to { opacity: 1; transform: translateY(0); }
  }
  
  @keyframes fade-in {
    from { opacity: 0; }
    to { opacity: 1; }
  }
  
  @keyframes gradient-shift {
    0% { opacity: 0.8; }
    50% { opacity: 0.9; }
    100% { opacity: 0.8; }
  }
  
  .animate-slow-zoom {
    animation: slow-zoom 15s ease-in-out infinite alternate;
  }
  
  .animate-fade-in-up {
    animation: fade-in-up 0.8s ease-out forwards;
  }
  
  .animate-fade-in {
    animation: fade-in 0.8s ease-out forwards;
  }
  
  .animate-gradient {
    animation: gradient-shift 5s ease-in-out infinite;
  }
`

