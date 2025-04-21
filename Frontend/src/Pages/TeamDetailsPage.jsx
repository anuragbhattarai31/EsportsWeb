"use client"

import { useEffect, useState } from "react"
import { useParams, Link } from "react-router-dom"
import { Card } from "@/Components/ui/card"
import { Button } from "@/Components/ui/button"
import { ArrowLeft } from "lucide-react"
import Header from "../Components/Header"
import Footer from "../Components/Footer"

export default function TeamDetailsPage() {
  const { id } = useParams()
  const [teamData, setTeamData] = useState(null)
  const [loading, setLoading] = useState(true)

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

      <div className="container mx-auto px-4 py-12 mt-16">
        <div className="mb-6">
          <Link to="/" className="text-gray-400 hover:text-white transition-colors inline-flex items-center">
            <ArrowLeft className="h-4 w-4 mr-2" /> Back to Teams
          </Link>
        </div>

        <div className="glassmorphism rounded-xl shadow-xl overflow-hidden mb-8">
          <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
            <h1 className="text-3xl font-bold text-white font-gaming">
              {teamData.team.game_name} <span className="text-semored">TEAM</span>
            </h1>
          </div>
        </div>

        <div className="glassmorphism rounded-xl shadow-xl overflow-hidden">
          <div className="bg-gradient-to-r from-semored/20 to-transparent p-6 border-b border-gray-700/30">
            <h2 className="text-2xl font-bold font-gaming text-white">
              TEAM <span className="text-semored">ROSTER</span>
            </h2>
          </div>
          <div className="p-6">
            {teamData.players.length > 0 ? (
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
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
                        <h3 className="text-lg font-bold text-white truncate">{player.player_name || player.name}</h3>
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
          </div>
        </div>
      </div>
      <Footer />
    </div>
  )
}
