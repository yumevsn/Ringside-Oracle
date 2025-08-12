"use client"

import type React from "react"
import { useState } from "react"
import { Button } from "@/components/ui/button"
import { Input } from "@/components/ui/input"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog"
import { Checkbox } from "@/components/ui/checkbox"
import { Plus } from "lucide-react"
import {
  useAddPromotion,
  useAddEvent,
  useAddWrestler,
  useAddBrand,
  useAddMatchType,
  useAddChampionship,
  type Promotion,
  type Brand,
} from "@/lib/database"
import type { Id } from "@/convex/_generated/dataModel"

interface AddDataModalProps {
  type: "promotion" | "event" | "wrestler" | "brand" | "matchType" | "championship"
  promotions: Promotion[]
  brands: Brand[]
  selectedPromotion: Promotion | null
  onDataAdded: () => void
}

export function AddDataModal({ type, promotions, brands, selectedPromotion, onDataAdded }: AddDataModalProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState(false)
  const [formData, setFormData] = useState<any>({})

  // Convex mutation hooks
  const addPromotion = useAddPromotion()
  const addEvent = useAddEvent()
  const addWrestler = useAddWrestler()
  const addBrand = useAddBrand()
  const addMatchType = useAddMatchType()
  const addChampionship = useAddChampionship()

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    setLoading(true)

    try {
      let result = null

      switch (type) {
        case "promotion":
          result = await addPromotion({
            name: formData.name,
            country_code: formData.country_code || "US",
            country_emoji: formData.country_emoji || "🇺🇸",
            primary_color: formData.primary_color || "bg-gradient-to-r from-blue-500 to-blue-600",
            secondary_color: formData.secondary_color || "bg-blue-600/10 border-blue-500/20",
            accent_color: formData.accent_color || "text-blue-400 border-blue-500/30",
          })
          break

        case "event":
          if (!selectedPromotion) return
          result = await addEvent({
            promotion_id: selectedPromotion._id,
            name: formData.name,
            is_ppv: formData.is_ppv || false,
          })
          break

        case "wrestler":
          if (!formData.brand_id) return
          result = await addWrestler({
            name: formData.name,
            brand_id: formData.brand_id as Id<"brands">,
            status: formData.status || "Active",
            gender: formData.gender || "Male",
          })
          break

        case "brand":
          if (!selectedPromotion) return
          result = await addBrand({
            promotion_id: selectedPromotion._id,
            name: formData.name,
            color: formData.color || "bg-secondary text-secondary-foreground",
          })
          break

        case "matchType":
          if (!selectedPromotion) return
          result = await addMatchType({
            promotion_id: selectedPromotion._id,
            name: formData.name,
            default_participants: Number.parseInt(formData.default_participants) || 2,
            is_single_winner: formData.is_single_winner || false,
            is_team_based: formData.is_team_based || false,
            teams_count: formData.teams_count ? Number.parseInt(formData.teams_count) : undefined,
            players_per_team: formData.players_per_team ? Number.parseInt(formData.players_per_team) : undefined,
            gender_filter: formData.gender_filter || undefined,
          })
          break

        case "championship":
          if (!selectedPromotion) return
          result = await addChampionship({
            promotion_id: selectedPromotion._id,
            name: formData.name,
            is_active: true,
          })
          break
      }

      if (result) {
        setOpen(false)
        setFormData({})
        onDataAdded()
      }
    } catch (error) {
      console.error("Error adding data:", error)
    } finally {
      setLoading(false)
    }
  }

  // Rest of the component remains the same...
  const getTitle = () => {
    switch (type) {
      case "promotion":
        return "Add New Promotion"
      case "event":
        return "Add New Event"
      case "wrestler":
        return "Add New Wrestler"
      case "brand":
        return "Add New Brand"
      case "matchType":
        return "Add New Match Type"
      case "championship":
        return "Add New Championship"
      default:
        return "Add New Item"
    }
  }

  const renderForm = () => {
    switch (type) {
      case "promotion":
        return (
          <>
            <div>
              <Label htmlFor="name">Promotion Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., New Wrestling Federation"
                required
              />
            </div>
            <div>
              <Label htmlFor="country_emoji">Country Emoji</Label>
              <Input
                id="country_emoji"
                value={formData.country_emoji || ""}
                onChange={(e) => setFormData({ ...formData, country_emoji: e.target.value })}
                placeholder="🇺🇸"
              />
            </div>
          </>
        )

      case "event":
        return (
          <>
            <div>
              <Label htmlFor="name">Event Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Night of Champions"
                required
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_ppv"
                checked={formData.is_ppv || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_ppv: checked })}
              />
              <Label htmlFor="is_ppv">Pay-Per-View Event</Label>
            </div>
          </>
        )

      case "wrestler":
        return (
          <>
            <div>
              <Label htmlFor="name">Wrestler Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., John Doe"
                required
              />
            </div>
            <div>
              <Label htmlFor="brand_id">Brand</Label>
              <Select
                value={formData.brand_id || ""}
                onValueChange={(value) => setFormData({ ...formData, brand_id: value })}
              >
                <SelectTrigger>
                  <SelectValue placeholder="Select brand" />
                </SelectTrigger>
                <SelectContent>
                  {brands?.map((brand) => (
                    <SelectItem key={brand._id} value={brand._id}>
                      {brand.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="gender">Gender</Label>
              <Select
                value={formData.gender || "Male"}
                onValueChange={(value) => setFormData({ ...formData, gender: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Male">Male</SelectItem>
                  <SelectItem value="Female">Female</SelectItem>
                </SelectContent>
              </Select>
            </div>
            <div>
              <Label htmlFor="status">Status</Label>
              <Select
                value={formData.status || "Active"}
                onValueChange={(value) => setFormData({ ...formData, status: value })}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Active">Active</SelectItem>
                  <SelectItem value="Part-Time">Part-Time</SelectItem>
                  <SelectItem value="Legend">Legend</SelectItem>
                  <SelectItem value="Inactive">Inactive</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </>
        )

      case "brand":
        return (
          <div>
            <Label htmlFor="name">Brand Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., Monday Night Raw"
              required
            />
          </div>
        )

      case "matchType":
        return (
          <>
            <div>
              <Label htmlFor="name">Match Type Name</Label>
              <Input
                id="name"
                value={formData.name || ""}
                onChange={(e) => setFormData({ ...formData, name: e.target.value })}
                placeholder="e.g., Extreme Rules Match"
                required
              />
            </div>
            <div>
              <Label htmlFor="default_participants">Default Participants</Label>
              <Input
                id="default_participants"
                type="number"
                value={formData.default_participants || "2"}
                onChange={(e) => setFormData({ ...formData, default_participants: e.target.value })}
                min="1"
              />
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_single_winner"
                checked={formData.is_single_winner || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_single_winner: checked })}
              />
              <Label htmlFor="is_single_winner">Single Winner Match</Label>
            </div>
            <div className="flex items-center space-x-2">
              <Checkbox
                id="is_team_based"
                checked={formData.is_team_based || false}
                onCheckedChange={(checked) => setFormData({ ...formData, is_team_based: checked })}
              />
              <Label htmlFor="is_team_based">Team-Based Match</Label>
            </div>
          </>
        )

      case "championship":
        return (
          <div>
            <Label htmlFor="name">Championship Name</Label>
            <Input
              id="name"
              value={formData.name || ""}
              onChange={(e) => setFormData({ ...formData, name: e.target.value })}
              placeholder="e.g., World Heavyweight Championship"
              required
            />
          </div>
        )

      default:
        return null
    }
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogTrigger asChild>
        <Button variant="outline" size="sm" className="h-8 px-2 bg-transparent">
          <Plus className="w-3 h-3 mr-1" />
          Add New
        </Button>
      </DialogTrigger>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>{getTitle()}</DialogTitle>
        </DialogHeader>
        <form onSubmit={handleSubmit} className="space-y-4">
          {renderForm()}
          <div className="flex justify-end gap-2">
            <Button type="button" variant="outline" onClick={() => setOpen(false)}>
              Cancel
            </Button>
            <Button type="submit" disabled={loading}>
              {loading ? "Adding..." : "Add"}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}
