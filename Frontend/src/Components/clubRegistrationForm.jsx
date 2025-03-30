import { useState } from "react"
import { useNavigate } from "react-router-dom"

const ClubRegistrationForm = () => {
  const [formData, setFormData] = useState({
    fullName: "",
    semoId: "",
  })
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState("")
  const navigate = useNavigate()

  const handleSubmit = async (e) => {
    e.preventDefault()
    setLoading(true)
    try {
      const response = await fetch("/api/club-registrations", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${localStorage.getItem("token")}`,
        },
        body: JSON.stringify(formData),
      })

      if (!response.ok) {
        const errorData = await response.json()
        throw new Error(errorData.error)
      }

      navigate("/dashboard")
    } catch (err) {
      setError(err.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <div className="max-w-md mx-auto p-8 glassmorphism rounded-xl neo-brutalism">
      <div className="mb-6">
        <h2 className="text-3xl font-bold mb-1 text-white font-gaming">
          <span className="text-semored">ESPORTS</span> CLUB
        </h2>
        <h3 className="text-xl font-bold text-semored font-gaming">REGISTRATION</h3>
      </div>

      <form onSubmit={handleSubmit} className="space-y-6">
        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">FULL NAME</label>
          <input
            type="text"
            required
            className="w-full p-3 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-semored focus:border-transparent transition-all duration-200"
            value={formData.fullName}
            onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
          />
        </div>

        <div className="space-y-2">
          <label className="block text-sm font-medium text-gray-300">SEMO ID</label>
          <input
            type="text"
            required
            className="w-full p-3 bg-dark-300 border border-gray-700 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-semored focus:border-transparent transition-all duration-200"
            value={formData.semoId}
            onChange={(e) => setFormData({ ...formData, semoId: e.target.value })}
            pattern="S\d{8}"
            title="SEMO ID should start with S followed by 8 digits"
          />
          <p className="text-xs text-gray-400">Format: S followed by 8 digits (e.g. S00012345)</p>
        </div>

        {error && <p className="text-semored text-sm bg-red-900/30 p-3 rounded-md">{error}</p>}

        <button
          type="submit"
          disabled={loading}
          className="w-full py-3 px-4 bg-semored text-white rounded-md hover:bg-semored/90 disabled:opacity-50 transition-all duration-200 font-medium button-glow"
        >
          {loading ? (
            <span className="flex items-center justify-center">
              <svg
                className="animate-spin -ml-1 mr-3 h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                ></path>
              </svg>
              Submitting...
            </span>
          ) : (
            "SUBMIT APPLICATION"
          )}
        </button>
      </form>
    </div>
  )
}

export default ClubRegistrationForm

