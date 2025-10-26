"use client"

import { useState, useEffect, useMemo } from "react"
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Badge } from "@/components/ui/badge"
import { Textarea } from "@/components/ui/textarea"
import { Checkbox } from "@/components/ui/checkbox"
import { Trash2, Plus, Copy, Filter, ChevronUp, ChevronDown, Edit3, Info, Database } from "lucide-react"
import { ThemeToggle } from "@/components/theme-toggle"
import { Confetti } from "@/components/confetti"
import { AddDataModal } from "@/components/add-data-modal"
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import { cn } from "@/lib/utils"
import type { Id } from "@/convex/_generated/dataModel"

// Types based on Convex schema
interface Promotion {
  _id: Id<"promotions">
  name: string
  country_code: string
  country_emoji: string
  primary_color: string
  secondary_color: string
  accent_color: string
}

interface Brand {
  _id: Id<"brands">
  promotion_id: Id<"promotions">
  name: string
  color: string
}

interface Wrestler {
  _id: Id<"wrestlers">
  name: string
  brand_id: Id<"brands">
  status: "Active" | "Part-Time" | "Legend" | "Inactive"
  gender: "Male" | "Female"
  brand_name?: string
}

interface Event {
  _id: Id<"events">
  promotion_id: Id<"promotions">
  name: string
  is_ppv: boolean
}

interface MatchType {
  _id: Id<"match_types">
  promotion_id: Id<"promotions">
  name: string
  default_participants: number
  is_single_winner: boolean
  is_team_based: boolean
  teams_count?: number
  players_per_team?: number
  gender_filter?: "Male" | "Female"
}

interface Championship {
  _id: Id<"championships">
  promotion_id: Id<"promotions">
  name: string
  is_active: boolean
}

interface Match {
  id: string
  matchType: string
  matchTypeId?: Id<"match_types">
  isChampionship: boolean
  championshipId?: string
  winner: string | null
  participantCount?: number
  wrestler1?: string
  wrestler2?: string
  team1?: string[]
  team2?: string[]
  allParticipants?: string[]
}

export default function RingsideOracle() {
  const [selectedPromotion, setSelectedPromotion] = useState<Promotion | null>(null)
  const [eventName, setEventName] = useState<string>("")
  const [customEventName, setCustomEventName] = useState<string>("")
  const [useCustomEvent, setUseCustomEvent] = useState<boolean>(false)
  const [editingEventName, setEditingEventName] = useState<boolean>(false)
  const [matches, setMatches] = useState<Match[]>([])
  const [selectedBrand, setSelectedBrand] = useState<string>("All")
  const [selectedStatus, setSelectedStatus] = useState<string>("All")
  const [generatedPredictions, setGeneratedPredictions] = useState<string>("")
  const [editingPredictions, setEditingPredictions] = useState<boolean>(false)
  const [isSeeding, setIsSeeding] = useState<boolean>(false)

  const [showConfetti, setShowConfetti] = useState<boolean>(true)
  const [showCopyPopup, setShowCopyPopup] = useState<boolean>(false)
  const [showWinnerPopup, setShowWinnerPopup] = useState<boolean>(false)
  const [winnerPopupText, setWinnerPopupText] = useState<string>("")
  const [currentCopyGif, setCurrentCopyGif] = useState<string>("")
  const [currentCopyMessage, setCopyMessage] = useState<string>("")
  const [confettiVisible, setConfettiVisible] = useState<boolean>(false)

  // Convex queries and mutations
  const promotions = useQuery(api.promotions.list) || []
  const brands =
    useQuery(api.brands.listByPromotion, selectedPromotion ? { promotionId: selectedPromotion._id } : "skip") || []
  const wrestlers =
    useQuery(api.wrestlers.listByPromotion, selectedPromotion ? { promotionId: selectedPromotion._id } : "skip") || []
  const events =
    useQuery(api.events.listByPromotion, selectedPromotion ? { promotionId: selectedPromotion._id } : "skip") || []
  const matchTypes =
    useQuery(api.matchTypes.listByPromotion, selectedPromotion ? { promotionId: selectedPromotion._id } : "skip") || []
  const championships =
    useQuery(api.championships.listByPromotion, selectedPromotion ? { promotionId: selectedPromotion._id } : "skip") ||
    []

  // Seed data mutation
  const seedData = useMutation(api.seedData.seedInitialData)

  // Handle seeding
  const handleSeedData = async () => {
    setIsSeeding(true)
    try {
      const result = await seedData({})
      console.log("Seed result:", result)
      alert("Database seeded successfully! 🎉")
    } catch (error) {
      console.error("Error seeding data:", error)
      alert("Error seeding data. Check console for details.")
    } finally {
      setIsSeeding(false)
    }
  }

  // Seed additional data mutation
  const seedAdditionalData = useMutation(api.seedData.seedAdditionalData)

  // Handle additional seeding
  const handleSeedAdditionalData = async () => {
    setIsSeeding(true)
    try {
      const result = await seedAdditionalData({})
      console.log("Additional seed result:", result)
      alert(`Additional data seeded successfully! 🚀\n\n${result.message}`)
    } catch (error) {
      console.error("Error seeding additional data:", error)
      alert("Error seeding additional data. Check console for details.")
    } finally {
      setIsSeeding(false)
    }
  }

  // Pro wrestling GIFs
  const wrestlingGifs = [
    "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
    "https://media.giphy.com/media/xT1XGESDlxj0GwoDRe/giphy.gif",
    "https://media.giphy.com/media/l2JhpjWPccQhsAMfu/giphy.gif",
    "https://media.giphy.com/media/3o6Zt6KHxJTbXCnSvu/giphy.gif",
    "https://media.giphy.com/media/xT1XGU1AHz9Fe8tmp2/giphy.gif",
    "https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif",
    "https://media.giphy.com/media/3o7TKF1fSIs1R19B8k/giphy.gif",
    "https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif",
    "https://media.giphy.com/media/xT1XGU1AHz9Fe8tmp2/giphy.gif",
    "https://media.giphy.com/media/l2JhpjWPccQhsAMfu/giphy.gif",
  ]

  const copyMessages = [
    "Hope you get your predictions right, otherwise you'll get speared! 🏈",
    "May your predictions be as accurate as Stone Cold's stunner! 🍺",
    "If you're wrong, you might catch an RKO outta nowhere! 💥",
    "Predicting wrestling is harder than escaping the Hell in a Cell! 🔥",
    "Your predictions better be money... or you'll get the People's Elbow! 💪",
    "Time to find out if you're the champion of predictions! 🏆",
    "Hope your crystal ball is clearer than WWE's booking! 🔮",
    "May the wrestling gods smile upon your predictions! 🙏",
    "Better call your predictions like a referee calls the match! 🥇",
    "Time to see if you're championship material! 🏆",
  ]

  const currentYear = new Date().getFullYear()

  // Memoize wrestlers with brand names to prevent infinite re-renders
  const wrestlersWithBrandNames = useMemo(() => {
    if (!wrestlers || !brands) return []
    return wrestlers.map((wrestler) => ({
      ...wrestler,
      brand_name: brands.find((b) => b._id === wrestler.brand_id)?.name || "Unknown",
    }))
  }, [wrestlers, brands])

  // Memoize filtered wrestlers
  const filteredWrestlers = useMemo(() => {
    if (!wrestlersWithBrandNames.length) return []

    let filtered = wrestlersWithBrandNames

    if (selectedBrand !== "All") {
      const brand = brands.find((b) => b.name === selectedBrand)
      if (brand) {
        filtered = filtered.filter((wrestler) => wrestler.brand_id === brand._id)
      }
    }

    if (selectedStatus !== "All") {
      filtered = filtered.filter((wrestler) => wrestler.status === selectedStatus)
    }

    return filtered
  }, [wrestlersWithBrandNames, selectedBrand, selectedStatus, brands])

  // Reset data when promotion changes
  useEffect(() => {
    if (selectedPromotion) {
      setSelectedBrand("All")
      setSelectedStatus("All")
      setEventName("")
      setCustomEventName("")
      setUseCustomEvent(false)
      setEditingEventName(false)
      setMatches([])
    }
  }, [selectedPromotion]) // Only depend on the ID to prevent infinite loops

  // Update predictions when matches change
  useEffect(() => {
    const predictions = generatePredictions()
    setGeneratedPredictions(predictions)
  }, [matches, eventName, customEventName, useCustomEvent, selectedPromotion?.name, matchTypes, championships])

  const generatePredictions = () => {
    const finalEventName = useCustomEvent ? customEventName : eventName
    if (!finalEventName || matches.length === 0) return ""

    let output = `My ${finalEventName} Predictions:\n\n`

    matches.forEach((match, index) => {
      if (match.winner) {
        const matchTypeData = matchTypes.find((mt) => mt._id === match.matchTypeId)
        const championship = championships.find((c) => c._id === match.championshipId)

        let matchTypeDisplay = match.matchType
        if (match.isChampionship && championship) {
          matchTypeDisplay = championship.name
        }

        if (matchTypeData?.is_single_winner) {
          output += `${index + 1}. ${match.winner} wins (${matchTypeDisplay})\n`
        } else if (matchTypeData?.is_team_based) {
          const winningTeam = match.team1?.includes(match.winner) ? "Team 1" : "Team 2"
          output += `${index + 1}. ${winningTeam} wins - ${match.winner} gets the victory (${matchTypeDisplay})\n`
        } else {
          const opponent = match.winner === match.wrestler1 ? match.wrestler2 : match.wrestler1
          output += `${index + 1}. ${match.winner} over ${opponent} (${matchTypeDisplay})\n`
        }
      }
    })

    output += `\nWhat do you think? #${selectedPromotion?.name} #Wrestling`
    return output
  }

  const addMatch = () => {
    const newMatch: Match = {
      id: Date.now().toString(),
      matchType: "Singles Match",
      isChampionship: false,
      winner: null,
      participantCount: 2,
      team1: [],
      team2: [],
      allParticipants: [],
    }
    setMatches([...matches, newMatch])
  }

  const deleteMatch = (id: string) => {
    setMatches(matches.filter((match) => match.id !== id))
  }

  const updateMatch = (id: string, field: keyof Match, value: any) => {
    setMatches(
      matches.map((match) => {
        if (match.id === id) {
          const updatedMatch = { ...match, [field]: value }

          // Auto-configure match based on type
          if (field === "matchType") {
            const matchTypeData = matchTypes.find((mt) => mt.name === value)
            if (matchTypeData) {
              updatedMatch.matchTypeId = matchTypeData._id
              updatedMatch.participantCount = matchTypeData.default_participants

              // Reset participants for new match type
              updatedMatch.wrestler1 = ""
              updatedMatch.wrestler2 = ""
              updatedMatch.winner = null
              updatedMatch.team1 = []
              updatedMatch.team2 = []
              updatedMatch.allParticipants = []

              // Initialize team arrays for team-based matches
              if (matchTypeData.is_team_based && matchTypeData.teams_count && matchTypeData.players_per_team) {
                updatedMatch.team1 = new Array(matchTypeData.players_per_team).fill("")
                updatedMatch.team2 = new Array(matchTypeData.players_per_team).fill("")
              }

              // Initialize participants array for multi-person matches
              if (matchTypeData.is_single_winner && matchTypeData.default_participants > 2) {
                updatedMatch.allParticipants = new Array(matchTypeData.default_participants).fill("")
              }
            }
          }

          return updatedMatch
        }
        return match
      }),
    )
  }

  const updateTeamMember = (matchId: string, team: "team1" | "team2", index: number, wrestler: string) => {
    setMatches(
      matches.map((match) => {
        if (match.id === matchId) {
          const updatedMatch = { ...match }
          if (updatedMatch[team]) {
            updatedMatch[team][index] = wrestler
          }
          return updatedMatch
        }
        return match
      }),
    )
  }

  const updateParticipant = (matchId: string, index: number, wrestler: string) => {
    setMatches(
      matches.map((match) => {
        if (match.id === matchId) {
          const updatedMatch = { ...match }
          if (!updatedMatch.allParticipants) {
            updatedMatch.allParticipants = new Array(updatedMatch.participantCount || 2).fill("")
          }
          updatedMatch.allParticipants[index] = wrestler
          return updatedMatch
        }
        return match
      }),
    )
  }

  const setWinner = (matchId: string, winner: string) => {
    setMatches(matches.map((match) => (match.id === matchId ? { ...match, winner } : match)))

    // Show winner popup with confetti
    if (showConfetti) {
      setWinnerPopupText(`🎉 ${winner} is the winner! 🎉`)
      setShowWinnerPopup(true)
      setConfettiVisible(true)
      setTimeout(() => setShowWinnerPopup(false), 3000)
    }
  }

  const moveMatch = (index: number, direction: "up" | "down") => {
    const newMatches = [...matches]
    const targetIndex = direction === "up" ? index - 1 : index + 1

    if (targetIndex >= 0 && targetIndex < matches.length) {
      ;[newMatches[index], newMatches[targetIndex]] = [newMatches[targetIndex], newMatches[index]]
      setMatches(newMatches)
    }
  }

  const getMatchPositionLabel = (index: number, total: number) => {
    if (total === 1) return "Main Event"
    if (index === 0) return "Opening Match"
    if (index === total - 1) return "Main Event"
    if (index === total - 2 && total > 2) return "Co-Main Event"
    return `Match ${index + 1}`
  }

  const copyToClipboard = () => {
    navigator.clipboard.writeText(generatedPredictions)

    // Show copy popup with random gif and message
    const randomGif = wrestlingGifs[Math.floor(Math.random() * wrestlingGifs.length)]
    const randomMessage = copyMessages[Math.floor(Math.random() * copyMessages.length)]

    setCurrentCopyGif(randomGif)
    setCopyMessage(randomMessage)
    setShowCopyPopup(true)

    setTimeout(() => setShowCopyPopup(false), 4000)
  }

  const getFilteredWrestlersForChampionship = (championshipId: string | undefined) => {
    if (!championshipId) return filteredWrestlers

    const championship = championships.find((c) => c._id === championshipId)
    if (!championship) return filteredWrestlers

    // Filter by gender based on championship name
    if (
      championship.name.toLowerCase().includes("women") ||
      championship.name.toLowerCase().includes("knockouts") ||
      championship.name.toLowerCase().includes("reina")
    ) {
      return filteredWrestlers.filter((wrestler) => wrestler.gender === "Female")
    }

    // Mixed championships (like some tag team titles) show all wrestlers
    if (championship.name.toLowerCase().includes("mixed") || championship.name.toLowerCase().includes("intergender")) {
      return filteredWrestlers
    }

    // Default to male wrestlers for other championships
    return filteredWrestlers.filter((wrestler) => wrestler.gender === "Male")
  }

  const getAvailableWrestlersForMatch = (match: Match, currentIndex?: number) => {
    const matchTypeData = matchTypes.find((mt) => mt._id === match.matchTypeId)
    let availableWrestlers = getFilteredWrestlersForMatch(match.matchType)

    // Filter by championship if it's a championship match
    if (match.isChampionship && match.championshipId) {
      availableWrestlers = getFilteredWrestlersForChampionship(match.championshipId)
    }

    // For multi-participant matches, exclude already selected wrestlers
    if (matchTypeData?.is_single_winner && match.allParticipants) {
      const selectedWrestlers = match.allParticipants.filter((name, index) => name && index !== currentIndex)
      availableWrestlers = availableWrestlers.filter((wrestler) => !selectedWrestlers.includes(wrestler.name))
    }

    return availableWrestlers
  }

  const getFilteredWrestlersForMatch = (matchType: string) => {
    const matchTypeData = matchTypes.find((mt) => mt.name === matchType)
    if (!matchTypeData?.gender_filter) return filteredWrestlers

    return filteredWrestlers.filter((wrestler) => {
      return wrestler.gender === matchTypeData.gender_filter
    })
  }

  const getMatchParticipants = (match: Match): string[] => {
    const matchTypeData = matchTypes.find((mt) => mt._id === match.matchTypeId)

    if (matchTypeData?.is_single_winner && match.allParticipants) {
      return match.allParticipants.filter(Boolean)
    }

    if (matchTypeData?.is_team_based && match.team1 && match.team2) {
      return [...match.team1, ...match.team2].filter(Boolean)
    }

    if (match.wrestler1 && match.wrestler2) {
      return [match.wrestler1, match.wrestler2]
    }

    return []
  }

  const getPromotionColors = (promotion: Promotion | null) => {
    if (!promotion) return ["#3b82f6", "#1d4ed8", "#1e40af"]

    // Extract colors from promotion color strings
    const extractColor = (colorString: string) => {
      if (colorString.includes("red")) return "#dc2626"
      if (colorString.includes("blue")) return "#2563eb"
      if (colorString.includes("yellow")) return "#eab308"
      if (colorString.includes("green")) return "#16a34a"
      if (colorString.includes("purple")) return "#9333ea"
      if (colorString.includes("pink")) return "#ec4899"
      if (colorString.includes("orange")) return "#ea580c"
      return "#3b82f6"
    }

    return [
      extractColor(promotion.primary_color),
      extractColor(promotion.secondary_color),
      extractColor(promotion.accent_color),
    ]
  }

  const renderMatchParticipants = (match: Match) => {
    const matchTypeData = matchTypes.find((mt) => mt._id === match.matchTypeId)
    const availableForMatch = getFilteredWrestlersForMatch(match.matchType)
    const matchParticipants = getMatchParticipants(match)

    if (matchTypeData?.is_single_winner) {
      // Single winner matches (Royal Rumble, Battle Royal, etc.)
      return (
        <div className="space-y-3">
          <div>
            <Label className="text-xs sm:text-sm mb-2 block">
              Participants ({match.participantCount || matchTypeData.default_participants})
            </Label>
            <div className="grid gap-2 max-h-40 overflow-y-auto">
              {Array.from({ length: match.participantCount || matchTypeData.default_participants }).map((_, index) => (
                <Select
                  key={index}
                  value={match.allParticipants?.[index] || ""}
                  onValueChange={(value) => updateParticipant(match.id, index, value)}
                >
                  <SelectTrigger className="bg-card border-border h-8 text-xs">
                    <SelectValue placeholder={`Participant ${index + 1}`} />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-60">
                    {getAvailableWrestlersForMatch(match, index).map((wrestler) => (
                      <SelectItem key={wrestler._id} value={wrestler.name} className="text-xs">
                        {wrestler.name} ({wrestler.brand_name})
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              ))}
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-xs sm:text-sm">Pick Winner</Label>
            <Select value={match.winner || ""} onValueChange={(value) => setWinner(match.id, value)}>
              <SelectTrigger className="bg-card border-border h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Select winner" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-60">
                {matchParticipants.map((participant) => (
                  <SelectItem key={participant} value={participant} className="text-xs sm:text-sm">
                    {participant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }

    if (matchTypeData?.is_team_based) {
      // Team-based matches (War Games, Tag Team, etc.)
      return (
        <div className="space-y-4">
          <div className="grid gap-4 sm:grid-cols-2">
            <div>
              <Label className="text-xs sm:text-sm mb-2 block">Team 1</Label>
              <div className="space-y-2">
                {match.team1?.map((wrestler, index) => (
                  <Select
                    key={`team1-${index}`}
                    value={wrestler}
                    onValueChange={(value) => updateTeamMember(match.id, "team1", index, value)}
                  >
                    <SelectTrigger className="bg-card border-border h-8 text-xs">
                      <SelectValue placeholder={`Team 1 Member ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {availableForMatch.map((w) => (
                        <SelectItem key={w._id} value={w.name} className="text-xs">
                          {w.name} ({w.brand_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </div>
            <div>
              <Label className="text-xs sm:text-sm mb-2 block">Team 2</Label>
              <div className="space-y-2">
                {match.team2?.map((wrestler, index) => (
                  <Select
                    key={`team2-${index}`}
                    value={wrestler}
                    onValueChange={(value) => updateTeamMember(match.id, "team2", index, value)}
                  >
                    <SelectTrigger className="bg-card border-border h-8 text-xs">
                      <SelectValue placeholder={`Team 2 Member ${index + 1}`} />
                    </SelectTrigger>
                    <SelectContent className="bg-card border-border max-h-60">
                      {availableForMatch.map((w) => (
                        <SelectItem key={w._id} value={w.name} className="text-xs">
                          {w.name} ({w.brand_name})
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                ))}
              </div>
            </div>
          </div>
          <div>
            <Label className="mb-2 block text-xs sm:text-sm">Pick Winner</Label>
            <Select value={match.winner || ""} onValueChange={(value) => setWinner(match.id, value)}>
              <SelectTrigger className="bg-card border-border h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Select winner" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-60">
                {matchParticipants.map((participant) => (
                  <SelectItem key={participant} value={participant} className="text-xs sm:text-sm">
                    {participant}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )
    }

    // Regular matches (Singles, Triple Threat, Fatal 4-Way)
    return (
      <div className="space-y-3">
        <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2">
          <div>
            <Label className="text-xs sm:text-sm">Wrestler 1</Label>
            <Select value={match.wrestler1 || ""} onValueChange={(value) => updateMatch(match.id, "wrestler1", value)}>
              <SelectTrigger className="bg-card border-border h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Select wrestler" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-60">
                {availableForMatch.map((wrestler) => (
                  <SelectItem key={wrestler._id} value={wrestler.name} className="text-xs sm:text-sm">
                    {wrestler.name} ({wrestler.brand_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div>
            <Label className="text-xs sm:text-sm">Wrestler 2</Label>
            <Select value={match.wrestler2 || ""} onValueChange={(value) => updateMatch(match.id, "wrestler2", value)}>
              <SelectTrigger className="bg-card border-border h-9 sm:h-10 text-xs sm:text-sm">
                <SelectValue placeholder="Select wrestler" />
              </SelectTrigger>
              <SelectContent className="bg-card border-border max-h-60">
                {availableForMatch.map((wrestler) => (
                  <SelectItem key={wrestler._id} value={wrestler.name} className="text-xs sm:text-sm">
                    {wrestler.name} ({wrestler.brand_name})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
        {match.wrestler1 && match.wrestler2 && (
          <div>
            <Label className="mb-2 block text-xs sm:text-sm">Pick Winner</Label>
            <div className="flex gap-2">
              <Button
                onClick={() => setWinner(match.id, match.wrestler1!)}
                variant={match.winner === match.wrestler1 ? "default" : "outline"}
                className={cn(
                  "flex-1 text-xs sm:text-sm h-9 sm:h-10",
                  match.winner === match.wrestler1
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-card border-border hover:bg-accent",
                )}
              >
                <span className="truncate">{match.wrestler1}</span>
              </Button>
              <Button
                onClick={() => setWinner(match.id, match.wrestler2!)}
                variant={match.winner === match.wrestler2 ? "default" : "outline"}
                className={cn(
                  "flex-1 text-xs sm:text-sm h-9 sm:h-10",
                  match.winner === match.wrestler2
                    ? "bg-primary hover:bg-primary/90"
                    : "bg-card border-border hover:bg-accent",
                )}
              >
                <span className="truncate">{match.wrestler2}</span>
              </Button>
            </div>
          </div>
        )}
      </div>
    )
  }

  // Show loading state while data is loading
  if (promotions === undefined) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-4">Loading Ringside Oracle...</h1>
          <p className="text-muted-foreground">Connecting to database...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background text-foreground transition-colors duration-300">
      <Confetti
        colors={getPromotionColors(selectedPromotion)}
        show={confettiVisible}
        onComplete={() => setConfettiVisible(false)}
      />

      <div className="container mx-auto px-2 sm:px-4 py-4 sm:py-8 max-w-7xl">
        <div className="text-center mb-6 sm:mb-8">
          <div className="flex items-center justify-center gap-4 mb-4">
            <h1 className="text-2xl sm:text-4xl font-bold bg-gradient-to-r from-blue-400 to-blue-600 bg-clip-text text-transparent">
              Ringside Oracle
            </h1>
            <div className="flex items-center gap-2">
              <ThemeToggle />
              <Button
                onClick={() => setShowConfetti(!showConfetti)}
                variant="outline"
                size="sm"
                className={cn(
                  "h-12 w-12 rounded-lg",
                  showConfetti ? "bg-primary text-primary-foreground" : "bg-card border-border",
                )}
                title={`${showConfetti ? "Disable" : "Enable"} celebration effects`}
              >
                🎉
              </Button>
            </div>
          </div>
          <p className="text-muted-foreground text-sm sm:text-base">
            Create and share your wrestling match predictions
          </p>
          <div className="flex items-center justify-center gap-2 mt-2 text-xs text-muted-foreground">
            <Info className="w-3 h-3" />
            <span>Help grow our database by adding new promotions, wrestlers, events, and more!</span>
          </div>
        </div>

        {/* Show seed buttons */}
        {promotions.length === 0 ? (
          <div className="text-center mb-8">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>No Data Found</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  No promotions found in the database. Click below to seed the database with comprehensive 2025
                  wrestling data including WWE, AEW, NJPW, TNA, STARDOM, and GCW!
                </p>
                <Button onClick={handleSeedData} disabled={isSeeding} className="w-full">
                  <Database className="w-4 h-4 mr-2" />
                  {isSeeding ? "Seeding Database..." : "Seed Wrestling Database 🎯"}
                </Button>
              </CardContent>
            </Card>
          </div>
        ) : (
          <div className="text-center mb-8">
            <Card className="max-w-md mx-auto">
              <CardHeader>
                <CardTitle>Add More Data</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-muted-foreground mb-4">
                  Want even more wrestling data? Add PWG, IMPACT, Dragon Gate, NOAH, RevPro plus additional WWE/AEW
                  wrestlers!
                </p>
                <Button
                  onClick={handleSeedAdditionalData}
                  disabled={isSeeding}
                  className="w-full bg-transparent"
                  variant="outline"
                >
                  <Database className="w-4 h-4 mr-2" />
                  {isSeeding ? "Adding Data..." : "Add More Wrestling Data 🚀"}
                </Button>
              </CardContent>
            </Card>
          </div>
        )}

        <div className="grid gap-4 sm:gap-6 lg:grid-cols-2 mb-6 sm:mb-8">
          <Card className={cn("bg-card border-border")}>
            <CardHeader>
              <CardTitle className="text-lg sm:text-xl text-primary">Event Setup</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div>
                <div className="flex items-center justify-between mb-2">
                  <Label htmlFor="promotion" className="text-sm sm:text-base">
                    Promotion
                  </Label>
                  <AddDataModal
                    type="promotion"
                    promotions={promotions}
                    brands={brands}
                    selectedPromotion={selectedPromotion}
                    onDataAdded={() => {}}
                  />
                </div>
                <Select
                  value={selectedPromotion?.name || ""}
                  onValueChange={(value) => {
                    const promotion = promotions.find((p) => p.name === value)
                    setSelectedPromotion(promotion || null)
                  }}
                >
                  <SelectTrigger className="bg-card border-border h-10 sm:h-11">
                    <SelectValue placeholder="Select promotion" />
                  </SelectTrigger>
                  <SelectContent className="bg-card border-border max-h-60">
                    {promotions.map((promotion) => (
                      <SelectItem key={promotion._id} value={promotion.name} className="text-sm sm:text-base">
                        {promotion.country_emoji} {promotion.name}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div>
                <div className="flex items-center gap-2 mb-2">
                  <Checkbox
                    id="customEvent"
                    checked={useCustomEvent}
                    onCheckedChange={(checked) => setUseCustomEvent(checked as boolean)}
                  />
                  <Label htmlFor="customEvent" className="text-sm sm:text-base">
                    Custom Event Name
                  </Label>
                </div>

                {useCustomEvent ? (
                  <Input
                    value={customEventName}
                    onChange={(e) => setCustomEventName(e.target.value)}
                    placeholder={`e.g., Custom Event ${currentYear}`}
                    className="bg-card border-border h-10 sm:h-11 text-sm sm:text-base"
                  />
                ) : (
                  <div className="space-y-2">
                    <div className="flex items-center justify-between">
                      <Label className="text-sm">Event</Label>
                      {selectedPromotion && (
                        <AddDataModal
                          type="event"
                          promotions={promotions}
                          brands={brands}
                          selectedPromotion={selectedPromotion}
                          onDataAdded={() => {}}
                        />
                      )}
                    </div>
                    <Select value={eventName} onValueChange={setEventName}>
                      <SelectTrigger className="bg-card border-border h-10 sm:h-11">
                        <SelectValue placeholder="Select event" />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border max-h-60">
                        {events.map((event) => (
                          <SelectItem
                            key={event._id}
                            value={`${event.name} ${currentYear}`}
                            className="text-sm sm:text-base"
                          >
                            {event.name} {currentYear}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                    {eventName && (
                      <div className="flex items-center gap-2">
                        {editingEventName ? (
                          <div className="flex gap-2 flex-1">
                            <Input
                              value={eventName}
                              onChange={(e) => setEventName(e.target.value)}
                              className="bg-card border-border h-8 text-sm flex-1"
                              onBlur={() => setEditingEventName(false)}
                              onKeyPress={(e) => e.key === "Enter" && setEditingEventName(false)}
                              autoFocus
                            />
                          </div>
                        ) : (
                          <>
                            <span className="text-sm text-muted-foreground flex-1">{eventName}</span>
                            <Button
                              onClick={() => setEditingEventName(true)}
                              variant="ghost"
                              size="sm"
                              className="h-6 px-2 text-xs text-primary hover:text-primary/80"
                            >
                              <Edit3 className="w-3 h-3" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-card border-border">
            <CardHeader>
              <CardTitle className="text-primary text-lg sm:text-xl flex items-center gap-2">
                <Filter className="w-4 h-4 sm:w-5 sm:h-5" />
                Active Roster
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {selectedPromotion && (
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 sm:gap-4">
                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs sm:text-sm">Brand</Label>
                      <AddDataModal
                        type="brand"
                        promotions={promotions}
                        brands={brands}
                        selectedPromotion={selectedPromotion}
                        onDataAdded={() => {}}
                      />
                    </div>
                    <Select value={selectedBrand} onValueChange={setSelectedBrand}>
                      <SelectTrigger className="bg-card border-border h-8 sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="All">All Brands</SelectItem>
                        {brands.map((brand) => (
                          <SelectItem key={brand._id} value={brand.name}>
                            {brand.name}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  </div>

                  <div>
                    <div className="flex items-center justify-between mb-1">
                      <Label className="text-xs sm:text-sm">Status</Label>
                      <AddDataModal
                        type="wrestler"
                        promotions={promotions}
                        brands={brands}
                        selectedPromotion={selectedPromotion}
                        onDataAdded={() => {}}
                      />
                    </div>
                    <Select value={selectedStatus} onValueChange={setSelectedStatus}>
                      <SelectTrigger className="bg-card border-border h-8 sm:h-10">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent className="bg-card border-border">
                        <SelectItem value="All">All Status</SelectItem>
                        <SelectItem value="Active">Active</SelectItem>
                        <SelectItem value="Part-Time">Part-Time</SelectItem>
                        <SelectItem value="Legend">Legend</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                </div>
              )}

              <div className="max-h-32 sm:max-h-48 overflow-y-auto">
                {filteredWrestlers.length > 0 ? (
                  <div className="grid grid-cols-1 gap-1">
                    {filteredWrestlers.map((wrestler) => {
                      const brand = brands.find((b) => b._id === wrestler.brand_id)
                      return (
                        <Badge
                          key={wrestler._id}
                          variant="secondary"
                          className={cn(
                            "text-xs justify-start p-1 sm:p-2",
                            brand?.color || "bg-secondary text-secondary-foreground",
                          )}
                        >
                          <span className="truncate">{wrestler.name}</span>
                          <span className="ml-1 opacity-75">({wrestler.brand_name})</span>
                        </Badge>
                      )
                    })}
                  </div>
                ) : (
                  <p className="text-muted-foreground text-sm sm:text-base">
                    {selectedPromotion ? "No wrestlers match the current filters" : "Select a promotion to view roster"}
                  </p>
                )}
              </div>
            </CardContent>
          </Card>
        </div>

        <Card className="bg-card border-border mb-6">
          <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
            <CardTitle className="text-primary text-lg sm:text-xl">Match Card</CardTitle>
            <Button
              onClick={addMatch}
              disabled={!selectedPromotion}
              className="bg-primary hover:bg-primary/90 w-full sm:w-auto h-10 sm:h-11 text-sm sm:text-base"
            >
              <Plus className="w-4 h-4 mr-2" />
              Add Match
            </Button>
          </CardHeader>
          <CardContent>
            {matches.length === 0 ? (
              <p className="text-muted-foreground text-center py-8 text-sm sm:text-base">No matches added yet</p>
            ) : (
              <div className="space-y-4 sm:space-y-6">
                {matches.map((match, index) => (
                  <div key={match.id} className="bg-card border border-border p-3 sm:p-4 rounded-lg">
                    <div className="flex items-center justify-between mb-4">
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-primary border-primary">
                          {getMatchPositionLabel(index, matches.length)}
                        </Badge>
                      </div>
                      <div className="flex items-center gap-1">
                        <Button
                          onClick={() => moveMatch(index, "up")}
                          disabled={index === 0}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <ChevronUp className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => moveMatch(index, "down")}
                          disabled={index === matches.length - 1}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-muted-foreground hover:text-foreground"
                        >
                          <ChevronDown className="w-4 h-4" />
                        </Button>
                        <Button
                          onClick={() => deleteMatch(match.id)}
                          variant="ghost"
                          size="sm"
                          className="h-8 w-8 p-0 text-destructive hover:text-destructive/80 hover:bg-destructive/10"
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>

                    <div className="grid gap-3 sm:gap-4 grid-cols-1 sm:grid-cols-2 mb-4">
                      <div>
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-xs sm:text-sm">Match Type</Label>
                          <AddDataModal
                            type="matchType"
                            promotions={promotions}
                            brands={brands}
                            selectedPromotion={selectedPromotion}
                            onDataAdded={() => {}}
                          />
                        </div>
                        <Select
                          value={match.matchType}
                          onValueChange={(value) => updateMatch(match.id, "matchType", value)}
                        >
                          <SelectTrigger className="bg-card border-border h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-60">
                            {matchTypes.map((type) => (
                              <SelectItem key={type._id} value={type.name} className="text-xs sm:text-sm">
                                {type.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Checkbox
                          id={`championship-${match.id}`}
                          checked={match.isChampionship}
                          onCheckedChange={(checked) => updateMatch(match.id, "isChampionship", checked)}
                        />
                        <Label htmlFor={`championship-${match.id}`} className="text-xs sm:text-sm">
                          Championship Match
                        </Label>
                      </div>
                    </div>

                    {match.isChampionship && (
                      <div className="mb-4">
                        <div className="flex items-center justify-between mb-1">
                          <Label className="text-xs sm:text-sm">Championship</Label>
                          <AddDataModal
                            type="championship"
                            promotions={promotions}
                            brands={brands}
                            selectedPromotion={selectedPromotion}
                            onDataAdded={() => {}}
                          />
                        </div>
                        <Select
                          value={match.championshipId || ""}
                          onValueChange={(value) => updateMatch(match.id, "championshipId", value)}
                        >
                          <SelectTrigger className="bg-card border-border h-9 sm:h-10 text-xs sm:text-sm">
                            <SelectValue placeholder="Select championship" />
                          </SelectTrigger>
                          <SelectContent className="bg-card border-border max-h-60">
                            {championships.map((title) => (
                              <SelectItem key={title._id} value={title._id} className="text-xs sm:text-sm">
                                {title.name}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      </div>
                    )}

                    {renderMatchParticipants(match)}
                  </div>
                ))}
              </div>
            )}
          </CardContent>
        </Card>

        {matches.length > 0 && (
          <Card className="bg-card border-border">
            <CardHeader className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <CardTitle className="text-primary text-lg sm:text-xl">Generated Predictions</CardTitle>
              <div className="flex gap-2 w-full sm:w-auto">
                <Button
                  onClick={() => setEditingPredictions(!editingPredictions)}
                  variant="outline"
                  className="bg-card border-border hover:bg-accent flex-1 sm:flex-none h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Edit3 className="w-4 h-4 mr-2" />
                  {editingPredictions ? "Preview" : "Edit"}
                </Button>
                <Button
                  onClick={copyToClipboard}
                  className="bg-primary hover:bg-primary/90 flex-1 sm:flex-none h-10 sm:h-11 text-sm sm:text-base"
                >
                  <Copy className="w-4 h-4 mr-2" />
                  Copy
                </Button>
              </div>
            </CardHeader>
            <CardContent>
              {editingPredictions ? (
                <Textarea
                  value={generatedPredictions}
                  onChange={(e) => setGeneratedPredictions(e.target.value)}
                  className="min-h-[200px] bg-card border-border text-foreground text-xs sm:text-sm font-mono"
                  placeholder="Edit your predictions here..."
                />
              ) : (
                <pre className="whitespace-pre-wrap text-xs sm:text-sm bg-card border border-border p-3 sm:p-4 rounded text-foreground overflow-x-auto min-h-[200px]">
                  {generatedPredictions || "Make your predictions to see the formatted output"}
                </pre>
              )}
            </CardContent>
          </Card>
        )}

        {/* Winner Popup with Confetti */}
        {showWinnerPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 text-center max-w-sm mx-4 relative overflow-hidden">
              <div className="relative z-10">
                <h3 className="text-lg font-bold text-primary mb-2">{winnerPopupText}</h3>
                <p className="text-muted-foreground text-sm">Match prediction updated!</p>
              </div>
            </div>
          </div>
        )}

        {/* Copy Popup with Wrestling GIF */}
        {showCopyPopup && (
          <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
            <div className="bg-card border border-border rounded-lg p-6 text-center max-w-md mx-4">
              <div className="mb-4">
                <img
                  src={currentCopyGif || "/placeholder.svg"}
                  alt="Wrestling GIF"
                  className="w-32 h-32 object-cover rounded-lg mx-auto"
                />
              </div>
              <h3 className="text-lg font-bold text-primary mb-2">Predictions Copied! 📋</h3>
              <p className="text-muted-foreground text-sm mb-4">{currentCopyMessage}</p>
              <Button onClick={() => setShowCopyPopup(false)} variant="outline" size="sm">
                Got it! 👍
              </Button>
            </div>
          </div>
        )}

        <div className="text-center py-8 border-t border-border mt-8">
          <p className="text-muted-foreground text-sm">Made with ❤️ from one wrestling fan to another</p>
          <p className="text-muted-foreground text-xs mt-1">
            May your predictions be as legendary as your favorite wrestlers! 🏆
          </p>
        </div>
      </div>
    </div>
  )
}
