"use client"

import { format } from "date-fns"
import { useRef, useState, useEffect, Suspense } from "react"
import { Canvas } from "@react-three/fiber"
import { PerspectiveCamera, Environment, Stars, useGLTF } from "@react-three/drei"
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { ChevronLeft, ChevronRight, Trophy, Users, Calendar, ArrowRight, MapPin } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function LandingPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [news, setNews] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([])

  const newsSliderRef = useRef(null)
  const eventsSliderRef = useRef(null)

  const scrollLeft = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = (ref) => {
    if (ref.current) {
      ref.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  const handleRegister = () => {
    navigate("/register")
  }

  const handleLogin = () => {
    navigate("/login")
  }

  useEffect(() => {
    const fetchTeams = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/teams")
        const data = await response.json()
        setTeams(data)
      } catch (error) {
        console.error("Error fetching teams:", error)
      }
    }
    fetchTeams()
  }, [])

  useEffect(() => {
    const fetchNews = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/news")
        const data = await response.json()
        setNews(data)
      } catch (error) {
        console.error("Error fetching news:", error)
      }
    }
    fetchNews()
  }, [])

  useEffect(() => {
    const fetchEvents = async () => {
      try {
        const response = await fetch("http://localhost:5000/api/events")
        const data = await response.json()
        setUpcomingEvents(data)
      } catch (error) {
        console.error("Error fetching events:", error)
      }
    }
    fetchEvents()
  }, [])

  return (
    <div className="flex flex-col min-h-screen bg-gradient-to-b from-semoblack to-dark-200">
      <Header />
      <main className="flex-1 pt-16">
        {/* Hero Section with 3D */}
        <section className="relative w-full h-[90vh] overflow-hidden">
          {/* Background elements */}
          <div className="absolute inset-0 bg-gradient-to-b from-semoblack to-dark-300 z-0"></div>
          <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-10 z-0"></div>

          {/* Animated gradient overlay */}
          <div className="absolute inset-0 bg-gradient-radial from-semored/0 to-semoblack opacity-70 z-0 animate-pulse-slow"></div>

          {/* 3D Canvas */}
          <div className="absolute inset-0 z-10">
            <Canvas>
              <PerspectiveCamera makeDefault position={[-1, -0.5, 2]} />
              <ambientLight intensity={0.7} />
              <spotLight position={[11, 11, 11]} angle={0.4} penumbra={1} intensity={1} castShadow />
              <Suspense fallback={<LoadingModel />}>
                <GLBModel
                  path="/models/xbox controller.glb"
                  position={[-0.85, -0.75, -1.5]}
                  scale={[2, 2, 2]}
                  rotation={[0.3, 0.5, 0.5]}
                />
              </Suspense>
              <Environment preset="night" />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
            </Canvas>
          </div>

          {/* Content */}
          <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-start px-4 md:px-6">
            <div className="max-w-2xl">
              <div className="mb-4 inline-block">
                <span className="bg-semored/20 text-semored text-xs font-bold px-3 py-1 rounded-full">
                  SOUTHEAST MISSOURI STATE UNIVERSITY
                </span>
              </div>
              <h1 className="text-5xl md:text-7xl font-extrabold font-gaming text-white mb-4">
                SEMO{" "}
                <span className="text-semored glitch-effect" data-text="ESPORTS">
                  ESPORTS
                </span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8 font-medium">Compete. Connect. Conquer.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  variant="premium"
                  className="text-lg py-6 font-gaming button-glow"
                  onClick={handleRegister}
                >
                  JOIN THE TEAM
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white bg-gray-700 hover:bg-gray-500 py-6 px-8 font-gaming border-gray-700 hover:border-gray-500"
                  onClick={handleLogin}
                >
                  LOGIN
                </Button>
              </div>
            </div>
          </div>

          {/* Bottom decorative elements */}
          <div className="absolute bottom-0 left-0 right-0 h-24 bg-gradient-to-t from-dark-200 to-transparent z-10"></div>
          <div className="absolute bottom-10 left-1/2 transform -translate-x-1/2 z-20">
            <div className="animate-bounce">
              <svg
                xmlns="http://www.w3.org/2000/svg"
                width="24"
                height="24"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
                strokeLinejoin="round"
                className="text-white/50"
              >
                <path d="M12 5v14M19 12l-7 7-7-7" />
              </svg>
            </div>
          </div>
        </section>

        {/* About Esports at SEMO */}
        <section className="py-20 bg-dark-300">
          <div className="container mx-auto px-4 md:px-6">
            <div className="text-center mb-12">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-gaming mb-4">
                ESPORTS AT <span className="text-semored">SEMO</span>
              </h2>
              <div className="w-20 h-1 bg-semored mx-auto mt-4"></div>
              <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                Join Southeast Missouri State University's premier competitive gaming program
              </p>
            </div>

            {/* About Section */}
            <div className="text-white mb-20">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-4">
                <div className="space-y-6">
                  <div className="inline-block bg-semored/20 text-semored text-xs font-bold px-3 py-1 rounded-full mb-2">
                    OUR MISSION
                  </div>
                  <h3 className="text-3xl font-bold mb-5 font-gaming">BUILDING CHAMPIONS</h3>
                  <p className="mb-6 text-gray-300 leading-relaxed">
                    Southeast Missouri State University's Esports program offers students the opportunity to compete at
                    the highest collegiate level across multiple game titles. Our program focuses on developing not just
                    gaming skills, but teamwork, communication, and leadership.
                  </p>
                  <p className="mb-6 text-gray-300 leading-relaxed">
                    Founded in 2019, SEMO Esports has quickly grown to become one of the premier collegiate esports
                    programs in the region, with dedicated coaching staff, state-of-the-art facilities, and a supportive
                    community.
                  </p>
                  <div className="flex flex-wrap gap-4 mt-8">
                    <div className="flex items-center gap-2 bg-dark-200 px-4 py-2 rounded-lg">
                      <Trophy className="text-semored h-5 w-5" />
                      <span className="text-sm">12+ Championships</span>
                    </div>
                    <div className="flex items-center gap-2 bg-dark-200 px-4 py-2 rounded-lg">
                      <Users className="text-semored h-5 w-5" />
                      <span className="text-sm">150+ Active Members</span>
                    </div>
                    <div className="flex items-center gap-2 bg-dark-200 px-4 py-2 rounded-lg">
                      <Calendar className="text-semored h-5 w-5" />
                      <span className="text-sm">20+ Events Yearly</span>
                    </div>
                  </div>
                </div>
                <div className="rounded-lg overflow-hidden shadow-xl shadow-semored/10 border border-gray-700/30 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/public/images/esports-banner.jpg?height=400&width=600"
                    alt="SEMO Esports Team"
                    className="w-full h-auto object-cover"
                  />
                </div>
              </div>
            </div>

            {/* Teams Section */}
            <div id="teams-section" className="mb-20">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white font-gaming mb-4">
                  OUR <span className="text-semored">TEAMS</span>
                </h3>
                <div className="w-16 h-1 bg-semored mx-auto mt-4"></div>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  Competitive teams representing SEMO in various esports titles
                </p>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {teams.map((team) => (
                  <Link to={`/teams/${team.id}`} key={team.id}>
                    <Card className="bg-dark-200 border-gray-700/30 hover:border-semored transition-all duration-300 cursor-pointer h-full overflow-hidden group">
                      <div className="h-40 bg-gradient-to-br from-semored/20 to-dark-300 flex items-center justify-center">
                        <div className="text-4xl font-bold font-gaming text-white group-hover:text-semored transition-colors">
                          {team.game_name}
                        </div>
                      </div>
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2 text-white group-hover:text-semored transition-colors">
                          {team.game_name} Team
                        </h3>
                        <p className="text-gray-400 line-clamp-3 mb-4">
                          {team.description || "Competitive team representing SEMO in tournaments and leagues."}
                        </p>
                        <div className="flex justify-between items-center">
                          <span className="text-xs bg-semored/20 text-semored px-2 py-1 rounded-full">
                            {team.players?.length || 0} Players
                          </span>
                          <span className="text-semored group-hover:translate-x-1 transition-transform inline-flex items-center">
                            View Team <ArrowRight className="ml-1 h-4 w-4" />
                          </span>
                        </div>
                      </CardContent>
                    </Card>
                  </Link>
                ))}
              </div>
            </div>

            {/* Facilities Section */}
            <div className="text-white">
              <div className="text-center mb-12">
                <h3 className="text-3xl font-bold text-white font-gaming mb-4">
                  OUR <span className="text-semored">FACILITIES</span>
                </h3>
                <div className="w-16 h-1 bg-semored mx-auto mt-4"></div>
                <p className="mt-4 text-gray-400 max-w-2xl mx-auto">
                  State-of-the-art gaming arena designed for competitive play
                </p>
              </div>
              <div className="grid md:grid-cols-2 gap-12 items-center">
                <div className="rounded-lg overflow-hidden shadow-xl shadow-semored/10 border border-gray-700/30 transform hover:scale-105 transition-transform duration-300">
                  <img
                    src="/public/images/Esports2.jpg?height=400&width=600"
                    alt="SEMO Esports Facility"
                    className="w-full h-auto object-cover"
                  />
                </div>
                <div className="space-y-6 order-1 md:order-2">
                  <div className="inline-block bg-semored/20 text-semored text-xs font-bold px-3 py-1 rounded-full mb-2">
                    OUR FACILITIES
                  </div>
                  <h3 className="text-3xl font-bold mb-5 font-gaming">STATE-OF-THE-ART ARENA</h3>
                  <p className="mb-4 text-gray-300 leading-relaxed">
                    Our dedicated esports arena features high-performance gaming PCs, professional peripherals, and a
                    broadcast station for streaming matches and creating content.
                  </p>
                  <p className="text-gray-300 leading-relaxed">
                    The facility is designed to provide the optimal environment for practice, competition, and team
                    development, with dedicated spaces for each of our competitive teams.
                  </p>

                  <div className="grid grid-cols-2 gap-4 mt-8">
                    <div className="bg-dark-200 p-4 rounded-lg border border-gray-700/30">
                      <h4 className="font-bold text-semored mb-2">Equipment</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• High-end Gaming PCs</li>
                        <li>• 240Hz Monitors</li>
                        <li>• Pro Gaming Peripherals</li>
                        <li>• Custom Team Setups</li>
                      </ul>
                    </div>
                    <div className="bg-dark-200 p-4 rounded-lg border border-gray-700/30">
                      <h4 className="font-bold text-semored mb-2">Features</h4>
                      <ul className="text-sm text-gray-300 space-y-1">
                        <li>• Team Practice Rooms</li>
                        <li>• Broadcast Studio</li>
                        <li>• Viewing Area</li>
                        <li>• Coaching Stations</li>
                      </ul>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section id="events-section" className="py-16 bg-dark-200">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-gaming">
                  UPCOMING <span className="text-semored">EVENTS</span>
                </h2>
                <p className="text-gray-400 mt-2">Join us at these upcoming tournaments and gatherings</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollLeft(eventsSliderRef)}
                  className="text-gray border-white/20 hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollRight(eventsSliderRef)}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              ref={eventsSliderRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {upcomingEvents.map((event) => (
                <div key={event.id} className="min-w-[300px] md:min-w-[400px] snap-start">
                  <Card className="bg-dark-300 border-gray-700/30 overflow-hidden h-full hover:border-semored transition-colors">
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-400 mb-4">
                        <Calendar className="h-4 w-4 mr-2" />
                        <span className="text-sm">{format(new Date(event.date), "MMM d, yyyy HH:mm")}</span>
                      </div>
                      <div className="flex items-center text-gray-400 mb-4">
                        <MapPin className="h-4 w-4 mr-2" />
                        <span className="text-sm">{event.location}</span>
                      </div>
                      <p className="text-gray-400 mb-4 line-clamp-2">{event.description}</p>
                      <Button variant="outline" className="w-full border-semored/30 text-semored hover:bg-semored/10">
                        Register Now
                      </Button>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* News and Updates */}
        <section id="news-section" className="py-16 bg-semoblack">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <div>
                <h2 className="text-3xl md:text-4xl font-bold text-white font-gaming">
                  NEWS & <span className="text-semored">UPDATES</span>
                </h2>
                <p className="text-gray-400 mt-2">Stay up to date with the latest from SEMO Esports</p>
              </div>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollLeft(newsSliderRef)}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={() => scrollRight(newsSliderRef)}
                  className="text-white border-white/20 hover:bg-white/10"
                >
                  <ChevronRight className="h-4 w-4" />
                </Button>
              </div>
            </div>

            <div
              ref={newsSliderRef}
              className="flex gap-6 overflow-x-auto pb-6 snap-x scrollbar-hide"
              style={{ scrollbarWidth: "none", msOverflowStyle: "none" }}
            >
              {news.map((newsItem) => (
                <div key={newsItem.id} className="min-w-[300px] md:min-w-[400px] snap-start">
                  <Card className="bg-dark-300 border-gray-700/30 overflow-hidden h-full hover:border-semored transition-colors">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={newsItem.image_url || "/placeholder.svg"}
                        alt={newsItem.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                        onError={(e) => {
                          if (e.target.src !== "/placeholder.svg") {
                            e.target.src = "/placeholder.svg"
                            e.target.onerror = null
                          }
                        }}
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-semored mb-2">
                        {format(new Date(newsItem.created_at), "MMM d, yyyy")}
                      </p>
                      <h3 className="text-xl font-bold text-white mb-2">{newsItem.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{newsItem.excerpt}</p>

                      <Link
                        to={`/news/${newsItem.id}`}
                        className="text-semored hover:text-semored/80 text-sm font-medium inline-flex items-center"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </Link>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Game Booking Section */}
        <section className="py-20 bg-gradient-to-r from-semoblack to-dark-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hexagon-pattern.png')] bg-repeat opacity-5"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-gaming mb-6">
                BOOK YOUR <span className="text-semored">GAMING SESSION</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Reserve your spot at our state-of-the-art gaming facility. Access high-end equipment and join the SEMO
                Esports community.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="premium"
                  className="text-lg py-6 px-8 font-gaming button-glow"
                  onClick={handleRegister}
                >
                  BOOK NOW
                </Button>
                <Button
                  size="lg"
                  variant="outline"
                  className="text-white bg-gray-700 hover:bg-gray-500 py-6 px-8 font-gaming border-gray-700 hover:border-gray-500"
                  onClick={() => navigate("/club-registration")}
                >
                  LEARN MORE
                </Button>
              </div>
            </div>
          </div>
        </section>
      </main>
      <Footer />
    </div>
  )
}

// GLB Model Component
function GLBModel({ path, ...props }) {
  const [hovered, setHovered] = useState(false)
  const [floatY, setFloatY] = useState(0)
  const { scene } = useGLTF(path)
  const groupRef = useRef()

  // Gentle floating animation
  useEffect(() => {
    let animFrame
    const animate = () => {
      setFloatY((prev) => Math.sin(Date.now() * 0.0008) * 0.05)
      animFrame = requestAnimationFrame(animate)
    }
    animate()
    return () => cancelAnimationFrame(animFrame)
  }, [])

  const groupProps = {
    ...props,
    position: [props.position[0], props.position[1] + floatY, props.position[2]],
    onPointerOver: () => setHovered(true),
    onPointerOut: () => setHovered(false),
    scale: hovered ? props.scale.map((s) => s * 1.05) : props.scale,
    ref: groupRef,
  }

  return (
    <group {...groupProps}>
      <primitive object={scene.clone()} />
    </group>
  )
}

// Loading placeholder while the model loads
function LoadingModel() {
  return (
    <mesh position={[0, 0, 0]}>
      <boxGeometry args={[1, 1, 1]} />
      <meshStandardMaterial color="#E6323E" wireframe />
    </mesh>
  )
}
