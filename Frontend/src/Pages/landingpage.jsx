
import { useRef } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, PerspectiveCamera, Environment } from "@react-three/drei"
import { Button } from "@/Components/ui/button"
import { Card, CardContent } from "@/Components/ui/card"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/Components/ui/tabs"
import { ChevronLeft, ChevronRight } from "lucide-react"
import { useNavigate } from "react-router-dom"




export default function LandingPage() {
  const navigate = useNavigate()

  const handleRegister = () => {
    navigate("/register");
  }

  const handleLogin = () => {
    navigate("/login");
  } 

  const newsSliderRef = useRef(null)

  const scrollLeft = () => {
    if (newsSliderRef.current) {
      newsSliderRef.current.scrollBy({ left: -300, behavior: "smooth" })
    }
  }

  const scrollRight = () => {
    if (newsSliderRef.current) {
      newsSliderRef.current.scrollBy({ left: 300, behavior: "smooth" })
    }
  }

  return (
    <div className="flex flex-col min-h-screen">
      

      <main className="flex-1 pt-16">
        {/* Hero Section with 3D */}
        <section className="relative w-full h-[80vh] bg-gradient-to-b from-red-900 to-black overflow-hidden">
          <div className="absolute inset-0 z-10">
            <Canvas>
              <PerspectiveCamera makeDefault position={[0, 0, 5]} />
              <ambientLight intensity={0.5} />
              <spotLight position={[10, 10, 10]} angle={0.15} penumbra={1} intensity={1} castShadow />
              <GameController position={[0, 0, 0]} scale={[0.5, 0.5, 0.5]} rotation={[0.2, Math.PI / 4, 0]} />
              <Environment preset="city" />
              <OrbitControls
                enableZoom={false}
                enablePan={false}
                autoRotate
                autoRotateSpeed={3}
                minPolarAngle={Math.PI / 2 - 0.5}
                maxPolarAngle={Math.PI / 2 + 0.5}
              />
            </Canvas>
          </div>
          <div className="relative z-20 container mx-auto h-full flex flex-col justify-center items-start px-4 md:px-6">
            <div className="max-w-2xl">
              <h1 className="text-4xl md:text-6xl font-extrabold text-white mb-4">
                SEMO <span className="text-semored">Esports</span>
              </h1>
              <p className="text-xl md:text-2xl text-white/90 mb-8">Compete. Connect. Conquer.</p>
              <div className="flex flex-col sm:flex-row gap-4">
                <Button size="lg" 
                className="bg-semored hover:bg-red-700 text-white" 
                onClick={handleRegister}>
                  Register
                </Button>
                <Button size="lg" variant="outline" 
                className="bg-white text-black border-white hover:bg-gray-100" 
                onClick={handleLogin}>
                  Login
                </Button>
              </div>
            </div>
          </div>
        </section>
        {/* About Esports at SEMO */}
        <section className="py-20 bg-semoblack">
          <div className="container mx-auto px-4 md:px-4">
            <div className="text-center mb-5">
              <h2 className="text-3xl md:text-4xl font-bold text-white">Esports at SEMO</h2>
              <div className="w-20 h-1 bg-semored mx-auto mt-4"></div>
            </div>

            <Tabs defaultValue="about" className="w-full">
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-800 p-2 rounded-lg">
                <TabsTrigger value="about">About</TabsTrigger>
                <TabsTrigger value="teams">Our Teams</TabsTrigger>
                <TabsTrigger value="facilities">Facilities</TabsTrigger>
              </TabsList>
              <TabsContent value="about" className="text-white mt-8">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-8 items-center p-4">
                  <div className="space-y-6">
                    <h3 className="text-2xl font-bold mb-5 gap-4 ">Building Champions</h3>
                    <p className="mb-6">
                      Southeast Missouri State University's Esports program offers
                      students the opportunity to compete at the highest collegiate 
                      level across multiple game titles. Our program focuses on developing not
                      just gaming skills, but teamwork, communication, and leadership.
                    </p>
                    <p className= "mb-0">
                      Founded in 2019, SEMO Esports has quickly grown to become one of the premier collegiate esports
                      programs in the region, with dedicated coaching staff, state-of-the-art facilities, and a
                      supportive community.
                    </p>
                  </div>
                  <div className="rounded-lg overflow-hidden">
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
                  {[
                    "League of Legends",
                    "Valorant",
                    "Rocket League",
                    "Overwatch",
                    "Call of Duty",
                    "Super Smash Bros",
                  ].map((game) => (
                    <Card key={game} className="bg-gray-900 border-semored hover:border-red-800 transition-colors">
                      <CardContent className="p-6">
                        <h3 className="text-xl font-bold mb-2">{game}</h3>
                        <p className="text-zinc-300">
                          Our {game} team competes in collegiate tournaments and leagues throughout the academic year.
                        </p>
                      </CardContent>
                    </Card>
                  ))}
                </div>
              </TabsContent>
              <TabsContent value="facilities" className="text-white">
                <div className="grid md:grid-cols-2 gap-8 items-center">
                  <div className="rounded-lg overflow-hidden">
                    <img
                      src="/placeholder.svg?height=400&width=600"
                      alt="SEMO Esports Facility"
                      className="w-full h-auto object-cover"
                    />
                  </div>
                  <div>
                    <h3 className="text-2xl font-bold mb-4">State-of-the-Art Arena</h3>
                    <p className="mb-4">
                      Our dedicated esports arena features high-performance gaming PCs, professional peripherals, and a
                      broadcast station for streaming matches and creating content.
                    </p>
                    <p>
                      The facility is designed to provide the optimal environment for practice, competition, and team
                      development, with dedicated spaces for each of our competitive teams.
                    </p>
                  </div>
                </div>
              </TabsContent>
            </Tabs>
          </div>
        </section>
        {/* News and Updates */}
        <section className="py-16 bg-black">
          <div className="container mx-auto px-4 md:px-6">
            <div className="flex justify-between items-center mb-8">
              <h2 className="text-3xl md:text-4xl font-bold text-white">News & Updates</h2>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollLeft}
                  className="text-white border-white hover:bg-white/10"
                >
                  <ChevronLeft className="h-4 w-4" />
                </Button>
                <Button
                  variant="outline"
                  size="icon"
                  onClick={scrollRight}
                  className="text-white border-white hover:bg-white/10"
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
                },
                {
                  title: "New Gaming PCs Installed in Arena",
                  date: "February 28, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                },
                {
                  title: "Spring Tryouts Announced",
                  date: "February 15, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                },
                {
                  title: "SEMO Hosts Regional Tournament",
                  date: "January 30, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                },
                {
                  title: "Rocket League Team Secures Sponsorship",
                  date: "January 22, 2025",
                  image: "/placeholder.svg?height=250&width=400",
                },
              ].map((news, index) => (
                <div key={index} className="min-w-[300px] md:min-w-[400px] snap-start">
                  <Card className="bg-gray-900 border-semored overflow-hidden h-full hover:border-red-700 transition-colors">
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
                      <a href="#" className="text-semored hover:text-red-300 text-sm font-medium">
                        Read More →
                      </a>
                    </CardContent>
                  </Card>
                </div>
              ))}
            </div>
           
          </div>
         
        </section>
        
      </main>

      
    </div>
  )
}

function GameController(props) {
  return (  
    <group {...props} rotation={[-Math.PI / 6, 0, 0]}>
      {/* Main controller body */}
      <mesh castShadow receiveShadow position={[0, 0, 0]}>
        <boxGeometry args={[3.2, 0.6, 2.2]} />
        <meshStandardMaterial color="#111111" metalness={0.4} roughness={0.6} />
      </mesh>

      {/* Left grip */}
      <mesh castShadow receiveShadow position={[-1.3, -0.2, 0.5]} rotation={[0, 0, 0.2]}>
        <cylinderGeometry args={[0.6, 0.8, 1.6, 32]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* Right grip */}
      <mesh castShadow receiveShadow position={[1.3, -0.2, 0.5]} rotation={[0, 0, -0.2]}>
        <cylinderGeometry args={[0.6, 0.8, 1.6, 32]} />
        <meshStandardMaterial color="#222222" />
      </mesh>

      {/* D-pad */}
      <mesh castShadow receiveShadow position={[-1, 0.4, -0.7]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#333333" />
      </mesh>

      {/* Left analog stick */}
      <mesh castShadow receiveShadow position={[-0.6, 0.4, 0.4]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh castShadow receiveShadow position={[-0.6, 0.5, 0.4]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>

      {/* Right analog stick */}
      <mesh castShadow receiveShadow position={[0.6, 0.4, -0.4]}>
        <cylinderGeometry args={[0.3, 0.3, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#444444" />
      </mesh>
      <mesh castShadow receiveShadow position={[0.6, 0.5, -0.4]}>
        <sphereGeometry args={[0.22, 32, 32]} />
        <meshStandardMaterial color="#cc0000" />
      </mesh>

      {/* Action buttons */}
      {[{ x: 1.2, y: -0.6 }, { x: 1.5, y: -0.4 }, { x: 1.2, y: -0.2 }, { x: 0.9, y: -0.4 }].map(
        (pos, index) => (
          <mesh key={index} castShadow receiveShadow position={[pos.x, 0.4, pos.y]}>
            <cylinderGeometry args={[0.18, 0.18, 0.1, 32]} rotation={[Math.PI / 2, 0, 0]} />
            <meshStandardMaterial color={["#cc0000", "#aa0000", "#880000", "#dd0000"][index]} />
          </mesh>
        )
      )}

      {/* Center logo button */}
      <mesh castShadow receiveShadow position={[0, 0.45, 0]}>
        <cylinderGeometry args={[0.5, 0.5, 0.12, 32]} rotation={[Math.PI / 2, 0, 0]} />
        <meshStandardMaterial color="#cc0000" metalness={0.6} roughness={0.3} />
      </mesh>
    </group>
  );
}

 

