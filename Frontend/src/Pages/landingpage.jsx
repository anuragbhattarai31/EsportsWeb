"use client"

import { useRef, useState, useEffect } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment, Stars } from "@react-three/drei"
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { ChevronLeft, ChevronRight, Trophy, Users, Calendar, ArrowRight } from "lucide-react"
import { useNavigate } from "react-router-dom"
import { Link } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function LandingPage() {
  const navigate = useNavigate()
  const [teams, setTeams] = useState([])
  const [upcomingEvents, setUpcomingEvents] = useState([
    {
      id: 1,
      title: "SEMO Valorant Tournament",
      date: "April 15, 2025",
      location: "Esports Arena",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      id: 2,
      title: "League of Legends Regional Qualifier",
      date: "April 22, 2025",
      location: "Online",
      image: "/placeholder.svg?height=250&width=400",
    },
    {
      id: 3,
      title: "Rocket League Championship",
      date: "May 5, 2025",
      location: "Main Campus",
      image: "/placeholder.svg?height=250&width=400",
    },
  ])

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
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <GamingSetup position={[0, -1, 0]} scale={[0.6, 0.6, 0.6]} rotation={[0, Math.PI / 4, 0]} />
              <Environment preset="night" />
              <Stars radius={100} depth={50} count={5000} factor={4} saturation={0} fade speed={1} />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={1.5}
                minPolarAngle={Math.PI / 2 - 0.5}
                maxPolarAngle={Math.PI / 2 + 0.5}
              />
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

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-12 bg-dark-200 p-2 rounded-lg">
                <TabsTrigger value="about">ABOUT</TabsTrigger>
                <TabsTrigger value="teams">OUR TEAMS</TabsTrigger>
                <TabsTrigger value="facilities">FACILITIES</TabsTrigger>
              </TabsList>

              <TabsContent value="about" className="text-white mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center p-4">
                  <div className="space-y-6">
                    <div className="inline-block bg-semored/20 text-semored text-xs font-bold px-3 py-1 rounded-full mb-2">
                      OUR MISSION
                    </div>
                    <h3 className="text-3xl font-bold mb-5 font-gaming">BUILDING CHAMPIONS</h3>
                    <p className="mb-6 text-gray-300 leading-relaxed">
                      Southeast Missouri State University's Esports program offers students the opportunity to compete
                      at the highest collegiate level across multiple game titles. Our program focuses on developing not
                      just gaming skills, but teamwork, communication, and leadership.
                    </p>
                    <p className="mb-6 text-gray-300 leading-relaxed">
                      Founded in 2019, SEMO Esports has quickly grown to become one of the premier collegiate esports
                      programs in the region, with dedicated coaching staff, state-of-the-art facilities, and a
                      supportive community.
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
                      src="/placeholder.svg?height=400&width=600"
                      alt="SEMO Esports Team"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="teams" className="text-white">
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
              </TabsContent>

              <TabsContent value="facilities" className="text-white">
                <div className="grid md:grid-cols-2 gap-12 items-center">
                  <div className="rounded-lg overflow-hidden shadow-xl shadow-semored/10 border border-gray-700/30 order-2 md:order-1">
                    <img
                      src="/placeholder.svg?height=400&width=600"
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
              </TabsContent>
            </Tabs>
          </div>
        </section>

        {/* Upcoming Events Section */}
        <section className="py-16 bg-dark-200">
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
                  className="text-white border-white/20 hover:bg-white/10"
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
              {upcomingEvents.map((event, index) => (
                <div key={index} className="min-w-[300px] md:min-w-[400px] snap-start">
                  <Card className="bg-dark-300 border-gray-700/30 overflow-hidden h-full hover:border-semored transition-colors">
                    <div className="h-48 overflow-hidden relative">
                      <img
                        src={event.image || "/placeholder.svg"}
                        alt={event.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                      <div className="absolute top-0 left-0 bg-semored text-white px-3 py-1 text-xs font-bold">
                        {event.date}
                      </div>
                    </div>
                    <CardContent className="p-6">
                      <h3 className="text-xl font-bold text-white mb-2">{event.title}</h3>
                      <div className="flex items-center text-gray-400 mb-4">
                        <svg
                          xmlns="http://www.w3.org/2000/svg"
                          className="h-4 w-4 mr-2"
                          fill="none"
                          viewBox="0 0 24 24"
                          stroke="currentColor"
                        >
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z"
                          />
                          <path
                            strokeLinecap="round"
                            strokeLinejoin="round"
                            strokeWidth={2}
                            d="M15 11a3 3 0 11-6 0 3 3 0 016 0z"
                          />
                        </svg>
                        <span className="text-sm">{event.location}</span>
                      </div>
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
        <section className="py-16 bg-semoblack">
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
              {[
                {
                  title: "SEMO Valorant Team Advances to Nationals",
                  date: "March 5, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                  excerpt:
                    "Our Valorant team has secured their spot in the national championship after an impressive regional performance.",
                },
                {
                  title: "New Gaming PCs Installed in Arena",
                  date: "February 28, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                  excerpt:
                    "The esports arena has been upgraded with state-of-the-art gaming PCs featuring the latest hardware.",
                },
                {
                  title: "Spring Tryouts Announced",
                  date: "February 15, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                  excerpt:
                    "Looking to join one of our competitive teams? Spring tryouts will be held next month for all game titles.",
                },
                {
                  title: "SEMO Hosts Regional Tournament",
                  date: "January 30, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                  excerpt:
                    "Southeast Missouri State University will host the Midwest Collegiate Esports Tournament this spring.",
                },
                {
                  title: "Rocket League Team Secures Sponsorship",
                  date: "January 22, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                  excerpt:
                    "Our Rocket League team has secured a major sponsorship deal with a leading gaming peripheral company.",
                },
              ].map((news, index) => (
                <div key={index} className="min-w-[300px] md:min-w-[400px] snap-start">
                  <Card className="bg-dark-300 border-gray-700/30 overflow-hidden h-full hover:border-semored transition-colors">
                    <div className="h-48 overflow-hidden">
                      <img
                        src={news.image || "/placeholder.svg"}
                        alt={news.title}
                        className="w-full h-full object-cover transition-transform hover:scale-105"
                      />
                    </div>
                    <CardContent className="p-6">
                      <p className="text-sm text-semored mb-2">{news.date}</p>
                      <h3 className="text-xl font-bold text-white mb-2">{news.title}</h3>
                      <p className="text-gray-400 mb-4 line-clamp-2">{news.excerpt}</p>
                      <a
                        href="#"
                        className="text-semored hover:text-semored/80 text-sm font-medium inline-flex items-center"
                      >
                        Read More <ArrowRight className="ml-1 h-4 w-4" />
                      </a>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* CTA Section */}
        <section className="py-20 bg-gradient-to-r from-semoblack to-dark-300 relative overflow-hidden">
          <div className="absolute inset-0 bg-[url('/hexagon-pattern.png')] bg-repeat opacity-5"></div>
          <div className="container mx-auto px-4 md:px-6 relative z-10">
            <div className="max-w-3xl mx-auto text-center">
              <h2 className="text-3xl md:text-5xl font-bold text-white font-gaming mb-6">
                JOIN THE <span className="text-semored">TEAM</span>
              </h2>
              <p className="text-xl text-gray-300 mb-8">
                Ready to take your gaming to the next level? Join SEMO Esports and become part of our growing community
                of competitive gamers.
              </p>
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Button
                  size="lg"
                  variant="premium"
                  className="text-lg py-6 px-8 font-gaming button-glow"
                  onClick={handleRegister}
                >
                  REGISTER NOW
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

function GamingSetup(props) {
  const [hovered, setHovered] = useState(false)
  const [rgbPhase, setRgbPhase] = useState(0)

  // RGB color cycling effect
  useEffect(() => {
    const interval = setInterval(() => {
      setRgbPhase((prev) => (prev + 0.01) % 1)
    }, 50)
    return () => clearInterval(interval)
  }, [])

  // Calculate RGB colors based on phase
  const getRgbColor = (offset = 0) => {
    const r = Math.sin(2 * Math.PI * (rgbPhase + offset)) * 0.5 + 0.5
    const g = Math.sin(2 * Math.PI * (rgbPhase + offset + 0.33)) * 0.5 + 0.5
    const b = Math.sin(2 * Math.PI * (rgbPhase + offset + 0.66)) * 0.5 + 0.5
    return `rgb(${Math.floor(r * 255)}, ${Math.floor(g * 255)}, ${Math.floor(b * 255)})`
  }

  return (
    <group
      {...props}
      onPointerOver={() => setHovered(true)}
      onPointerOut={() => setHovered(false)}
      scale={hovered ? props.scale.map((s) => s * 1.05) : props.scale}
    >
      {/* Gaming Desk */}
      <mesh castShadow receiveShadow position={[0, -0.5, 0]}>
        <boxGeometry args={[5, 0.1, 2.5]} />
        <meshStandardMaterial color="#222222" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Monitor Stand */}
      <mesh castShadow receiveShadow position={[0, -0.2, -0.8]}>
        <boxGeometry args={[0.6, 0.6, 0.3]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Main Monitor */}
      <mesh castShadow receiveShadow position={[0, 0.4, -0.9]}>
        <boxGeometry args={[3, 1.7, 0.1]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Monitor Screen */}
      <mesh castShadow receiveShadow position={[0, 0.4, -0.85]}>
        <boxGeometry args={[2.8, 1.5, 0.05]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#0066cc"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Secondary Monitor (Left) */}
      <mesh castShadow receiveShadow position={[-1.8, 0.2, -0.7]} rotation={[0, Math.PI / 8, 0]}>
        <boxGeometry args={[1.5, 1.3, 0.1]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Secondary Monitor Screen */}
      <mesh castShadow receiveShadow position={[-1.8, 0.2, -0.65]} rotation={[0, Math.PI / 8, 0]}>
        <boxGeometry args={[1.3, 1.1, 0.05]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#cc0066"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Secondary Monitor (Right) */}
      <mesh castShadow receiveShadow position={[1.8, 0.2, -0.7]} rotation={[0, -Math.PI / 8, 0]}>
        <boxGeometry args={[1.5, 1.3, 0.1]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Secondary Monitor Screen */}
      <mesh castShadow receiveShadow position={[1.8, 0.2, -0.65]} rotation={[0, -Math.PI / 8, 0]}>
        <boxGeometry args={[1.3, 1.1, 0.05]} />
        <meshStandardMaterial
          color="#000000"
          emissive="#00cc66"
          emissiveIntensity={0.5}
          metalness={0.9}
          roughness={0.1}
        />
      </mesh>

      {/* Keyboard */}
      <mesh castShadow receiveShadow position={[0, -0.4, 0.3]}>
        <boxGeometry args={[2, 0.1, 0.8]} />
        <meshStandardMaterial
          color="#222222"
          emissive={getRgbColor()}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Mouse */}
      <mesh castShadow receiveShadow position={[1.2, -0.4, 0.3]}>
        <capsuleGeometry args={[0.15, 0.3, 4, 8]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial
          color="#222222"
          emissive={getRgbColor(0.2)}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Mousepad */}
      <mesh castShadow receiveShadow position={[1.2, -0.44, 0.3]}>
        <cylinderGeometry args={[0.6, 0.6, 0.02, 32]} />
        <meshStandardMaterial color="#111111" metalness={0.3} roughness={0.8} />
      </mesh>

      {/* Headset */}
      <mesh castShadow receiveShadow position={[-1.2, -0.3, 0.3]}>
        <torusGeometry args={[0.3, 0.05, 16, 32, Math.PI]} />
        <meshStandardMaterial
          color="#222222"
          emissive={getRgbColor(0.4)}
          emissiveIntensity={0.5}
          metalness={0.7}
          roughness={0.3}
        />
      </mesh>

      {/* Headset Stand */}
      <mesh castShadow receiveShadow position={[-1.2, -0.4, 0.3]}>
        <cylinderGeometry args={[0.1, 0.15, 0.1, 16]} />
        <meshStandardMaterial color="#111111" metalness={0.5} roughness={0.5} />
      </mesh>

      {/* Gaming Chair (Back) */}
      <mesh castShadow receiveShadow position={[0, -0.2, 1.5]}>
        <boxGeometry args={[1.2, 1.4, 0.2]} />
        <meshStandardMaterial
          color="#111111"
          emissive="#E6323E"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Gaming Chair (Seat) */}
      <mesh castShadow receiveShadow position={[0, -0.7, 1.2]}>
        <boxGeometry args={[1.2, 0.1, 0.8]} />
        <meshStandardMaterial
          color="#111111"
          emissive="#E6323E"
          emissiveIntensity={0.2}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* RGB Light Strip (Behind Desk) */}
      <mesh castShadow receiveShadow position={[0, -0.45, -1.2]}>
        <boxGeometry args={[4.8, 0.05, 0.05]} />
        <meshStandardMaterial
          color="#111111"
          emissive={getRgbColor(0.6)}
          emissiveIntensity={1}
          metalness={0.5}
          roughness={0.5}
        />
      </mesh>

      {/* Trophy */}
      <group position={[-2, -0.3, 0.3]}>
        <mesh castShadow receiveShadow position={[0, 0, 0]}>
          <cylinderGeometry args={[0.1, 0.15, 0.05, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.15, 0]}>
          <cylinderGeometry args={[0.03, 0.03, 0.3, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
        <mesh castShadow receiveShadow position={[0, 0.3, 0]}>
          <sphereGeometry args={[0.15, 16, 16]} />
          <meshStandardMaterial color="#FFD700" metalness={0.8} roughness={0.2} />
        </mesh>
      </group>


    </group>
  )
}

