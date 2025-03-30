import { useEffect, useState } from "react"
import { useParams } from "react-router-dom"
import { Card } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { Trophy, Users, Calendar, ArrowLeft, Twitter, Twitch, Youtube } from "lucide-react"
import { Link } from "react-router-dom"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function TeamDetailsPage() {
  const { id } = useParams()
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)
  const [achievements, setAchievements] = useState([
    { title: "Regional Champions", year: "2024", description: "Midwest Collegiate Tournament" },
    { title: "National Semi-Finalists", year: "2023", description: "Collegiate Esports Championship" },
    { title: "Conference Champions", year: "2023", description: "Missouri Valley Conference" },
  ])

  useEffect(() => {
    const fetchTeamData = async () => {
      try {
        const response = await fetch(`http://localhost:5000/api/teams/${id}`)
        const data = await response.json()
        setTeamData(data)
      } catch (error) {
        console.error("Error fetching team data:", error)
      } finally {
        setLoading(false)
      }
    }

    fetchTeamData()
  }, [id])

  if (loading) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200 flex items-center justify-center">
        <div className="w-16 h-16 border-4 border-semored/30 border-t-semored rounded-full animate-spin"></div>
      </div>
    )
  }

  if (!teamData) {
    return (
      <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200 flex flex-col items-center justify-center p-4">
        <h1 className="text-3xl font-bold text-white mb-4">Team not found</h1>
        <p className="text-gray-400 mb-8">The team you're looking for doesn't exist or has been removed.</p>
        <Link to="/">
          <Button variant="outline" className="flex items-center gap-2">
            <ArrowLeft className="h-4 w-4" /> Return to Home
          </Button>
        </Link>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-semoblack to-dark-200">
      <Header />

      {/* Hero Section */}
      <div className="relative h-[40vh] md:h-[50vh] bg-dark-300 overflow-hidden">
        <div className="absolute inset-0 bg-[url('/grid-pattern.png')] bg-repeat opacity-10"></div>
        <div className="absolute inset-0 bg-gradient-to-t from-dark-200 to-transparent"></div>
        <div className="container mx-auto px-4 h-full flex items-end pb-12 relative z-10">
          <div className="max-w-4xl">
            <div className="mb-4">
              <Link to="/" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
                <ArrowLeft className="h-4 w-4 mr-2" /> Back to Teams
              </Link>
            </div>
            <h1 className="text-5xl md:text-6xl font-bold text-white font-gaming mb-2">
              {teamData.team.game_name} <span className="text-semored">TEAM</span>
            </h1>
            <div className="flex flex-wrap gap-4 mt-6">
              <div className="flex items-center gap-2 bg-dark-300/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Trophy className="text-semored h-5 w-5" />
                <span className="text-sm text-gray-300">Competitive Team</span>
              </div>
              <div className="flex items-center gap-2 bg-dark-300/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Users className="text-semored h-5 w-5" />
                <span className="text-sm text-gray-300">{teamData.players.length} Players</span>
              </div>
              <div className="flex items-center gap-2 bg-dark-300/80 backdrop-blur-sm px-4 py-2 rounded-lg">
                <Calendar className="text-semored h-5 w-5" />
                <span className="text-sm text-gray-300">Est. 2022</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-12">
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Main Content - Team Info */}
          <div className="lg:col-span-2 space-y-8">
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  TEAM <span className="text-semored">OVERVIEW</span>
                </h2>
              </div>
              <div className="p-6">
                <p className="text-gray-300 leading-relaxed mb-6">
                  {teamData.team.description ||
                    `The ${teamData.team.game_name} team represents SEMO in collegiate competitions across the region and nation. 
                    Our players are dedicated to excellence both in-game and academically, with a focus on teamwork, 
                    strategy, and competitive spirit.`}
                </p>

                <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mt-8">
                  <div className="bg-dark-300/50 p-5 rounded-lg border border-gray-700/30">
                    <h3 className="text-xl font-bold text-white mb-3">Training Schedule</h3>
                    <ul className="space-y-2 text-gray-300">
                      <li className="flex justify-between">
                        <span>Monday</span>
                        <span className="text-semored">6:00 PM - 9:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Wednesday</span>
                        <span className="text-semored">6:00 PM - 9:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Friday</span>
                        <span className="text-semored">4:00 PM - 7:00 PM</span>
                      </li>
                      <li className="flex justify-between">
                        <span>Saturday (Scrims)</span>
                        <span className="text-semored">1:00 PM - 5:00 PM</span>
                      </li>
                    </ul>
                  </div>

                  <div className="bg-dark-300/50 p-5 rounded-lg border border-gray-700/30">
                    <h3 className="text-xl font-bold text-white mb-3">Team Achievements</h3>
                    <ul className="space-y-3 text-gray-300">
                      {achievements.map((achievement, index) => (
                        <li key={index} className="flex items-start">
                          <Trophy className="text-semored h-5 w-5 mt-0.5 mr-2 flex-shrink-0" />
                          <div>
                            <span className="font-medium text-white">{achievement.title}</span>
                            <div className="text-sm text-gray-400">
                              {achievement.description} ({achievement.year})
                            </div>
                          </div>
                        </li>
                      ))}
                    </ul>
                  </div>
                </div>

                <div className="mt-8">
                  <h3 className="text-xl font-bold text-white mb-4">Follow the Team</h3>
                  <div className="flex gap-4">
                    <a href="#" className="bg-dark-300 hover:bg-dark-200 transition-colors p-3 rounded-lg">
                      <Twitter className="h-5 w-5 text-[#1DA1F2]" />
                    </a>
                    <a href="#" className="bg-dark-300 hover:bg-dark-200 transition-colors p-3 rounded-lg">
                      <Twitch className="h-5 w-5 text-[#9146FF]" />
                    </a>
                    <a href="#" className="bg-dark-300 hover:bg-dark-200 transition-colors p-3 rounded-lg">
                      <Youtube className="h-5 w-5 text-[#FF0000]" />
                    </a>
                  </div>
                </div>
              </div>
            </div>

            {/* Team Achievements */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  UPCOMING <span className="text-semored">MATCHES</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30 hover:border-semored/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">Midwest Collegiate Tournament</h4>
                        <p className="text-gray-400 text-sm">Quarterfinals vs. University of Illinois</p>
                      </div>
                      <div className="text-right">
                        <p className="text-semored font-medium">April 15, 2025</p>
                        <p className="text-gray-400 text-sm">7:00 PM CST</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30 hover:border-semored/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">SEMO Invitational</h4>
                        <p className="text-gray-400 text-sm">Group Stage vs. Multiple Teams</p>
                      </div>
                      <div className="text-right">
                        <p className="text-semored font-medium">April 22-23, 2025</p>
                        <p className="text-gray-400 text-sm">All Day</p>
                      </div>
                    </div>
                  </div>

                  <div className="bg-dark-300/50 p-4 rounded-lg border border-gray-700/30 hover:border-semored/50 transition-colors">
                    <div className="flex justify-between items-center">
                      <div>
                        <h4 className="font-bold text-white">National Championship Qualifier</h4>
                        <p className="text-gray-400 text-sm">Regional Finals</p>
                      </div>
                      <div className="text-right">
                        <p className="text-semored font-medium">May 10, 2025</p>
                        <p className="text-gray-400 text-sm">5:00 PM CST</p>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>

          {/* Sidebar - Team Roster */}
          <div className="space-y-8">
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-2xl font-bold font-gaming text-white">
                  TEAM <span className="text-semored">ROSTER</span>
                </h2>
              </div>
              <div className="p-6">
                {teamData.players.length > 0 ? (
                  <div className="space-y-4">
                    {teamData.players.map((player, index) => (
                      <Card
                        key={index}
                        className="bg-dark-300 border-gray-700/30 hover:border-semored/50 transition-colors overflow-hidden"
                      >
                        <div className="flex items-center p-4">
                          <div className="w-12 h-12 bg-semored/20 rounded-full flex items-center justify-center mr-4 flex-shrink-0">
                            <span className="font-bold text-semored text-xl">
                              {(player.player_name || player.name).charAt(0).toUpperCase()}
                            </span>
                          </div>
                          <div className="flex-1 min-w-0">
                            <h3 className="text-lg font-bold text-white truncate">
                              {player.player_name || player.name}
                            </h3>
                            <div className="flex items-center">
                              <span className="text-semored font-medium mr-3">{player.role || "Player"}</span>
                              <span className="text-gray-500 text-sm">#{player.student_id}</span>
                            </div>
                          </div>
                        </div>
                      </Card>
                    ))}
                  </div>
                ) : (
                  <div className="text-center py-8 text-gray-400">
                    <p>No players currently on this team</p>
                  </div>
                )}

                <div className="mt-6">
                  <Button variant="outline" className="w-full border-semored/30 text-semored hover:bg-semored/10">
                    Apply to Join Team
                  </Button>
                </div>
              </div>
            </div>

            {/* Team Staff */}
            <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
              <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
                <h2 className="text-xl font-bold font-gaming text-white">
                  TEAM <span className="text-semored">STAFF</span>
                </h2>
              </div>
              <div className="p-6">
                <div className="space-y-4">
                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-semored/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-semored">C</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Coach Williams</h3>
                      <p className="text-gray-400 text-sm">Head Coach</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-semored/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-semored">A</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Alex Johnson</h3>
                      <p className="text-gray-400 text-sm">Assistant Coach</p>
                    </div>
                  </div>

                  <div className="flex items-center">
                    <div className="w-10 h-10 bg-semored/20 rounded-full flex items-center justify-center mr-3 flex-shrink-0">
                      <span className="font-bold text-semored">M</span>
                    </div>
                    <div>
                      <h3 className="font-bold text-white">Maria Rodriguez</h3>
                      <p className="text-gray-400 text-sm">Team Manager</p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <Footer />
    </div>
  )
}

