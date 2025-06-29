// Database utility functions for Ringside Oracle
import { createClient } from "@supabase/supabase-js"

const supabase = createClient(process.env.NEXT_PUBLIC_SUPABASE_URL!, process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!)

export interface Promotion {
  id: number
  name: string
  country_code: string
  country_emoji: string
  primary_color: string
  secondary_color: string
  accent_color: string
}

export interface Brand {
  id: number
  promotion_id: number
  name: string
  color: string
}

export interface Wrestler {
  id: number
  name: string
  brand_id: number
  status: "Active" | "Part-Time" | "Legend" | "Inactive"
  gender: "Male" | "Female"
  brand_name?: string
}

export interface Event {
  id: number
  promotion_id: number
  name: string
  is_ppv: boolean
}

export interface MatchType {
  id: number
  promotion_id: number
  name: string
  default_participants: number
  is_single_winner: boolean
  is_team_based: boolean
  teams_count: number | null
  players_per_team: number | null
  gender_filter: "Male" | "Female" | null
}

export interface Championship {
  id: number
  promotion_id: number
  name: string
  is_active: boolean
}

// Real Supabase database functions
export const fetchPromotions = async (): Promise<Promotion[]> => {
  const { data, error } = await supabase.from("promotions").select("*").order("name")

  if (error) {
    console.error("Error fetching promotions:", error)
    return []
  }
  return data || []
}

export const fetchBrandsByPromotion = async (promotionId: number): Promise<Brand[]> => {
  const { data, error } = await supabase.from("brands").select("*").eq("promotion_id", promotionId).order("name")

  if (error) {
    console.error("Error fetching brands:", error)
    return []
  }
  return data || []
}

export const fetchWrestlersByPromotion = async (promotionId: number): Promise<Wrestler[]> => {
  const { data, error } = await supabase
    .from("wrestlers")
    .select(`
      *,
      brands!inner(name, promotion_id)
    `)
    .eq("brands.promotion_id", promotionId)
    .order("name")

  if (error) {
    console.error("Error fetching wrestlers:", error)
    return []
  }

  return (
    data?.map((wrestler: any) => ({
      ...wrestler,
      brand_name: wrestler.brands.name,
    })) || []
  )
}

export const fetchEventsByPromotion = async (promotionId: number): Promise<Event[]> => {
  const { data, error } = await supabase.from("events").select("*").eq("promotion_id", promotionId).order("name")

  if (error) {
    console.error("Error fetching events:", error)
    return []
  }
  return data || []
}

export const fetchMatchTypesByPromotion = async (promotionId: number): Promise<MatchType[]> => {
  const { data, error } = await supabase.from("match_types").select("*").eq("promotion_id", promotionId).order("name")

  if (error) {
    console.error("Error fetching match types:", error)
    return []
  }
  return data || []
}

export const fetchChampionshipsByPromotion = async (promotionId: number): Promise<Championship[]> => {
  const { data, error } = await supabase
    .from("championships")
    .select("*")
    .eq("promotion_id", promotionId)
    .eq("is_active", true)
    .order("name")

  if (error) {
    console.error("Error fetching championships:", error)
    return []
  }
  return data || []
}

// User contribution functions
export const addPromotion = async (promotion: Omit<Promotion, "id">): Promise<Promotion | null> => {
  const { data, error } = await supabase.from("promotions").insert([promotion]).select().single()

  if (error) {
    console.error("Error adding promotion:", error)
    return null
  }
  return data
}

export const addEvent = async (event: Omit<Event, "id">): Promise<Event | null> => {
  const { data, error } = await supabase.from("events").insert([event]).select().single()

  if (error) {
    console.error("Error adding event:", error)
    return null
  }
  return data
}

export const addWrestler = async (wrestler: Omit<Wrestler, "id" | "brand_name">): Promise<Wrestler | null> => {
  const { data, error } = await supabase.from("wrestlers").insert([wrestler]).select().single()

  if (error) {
    console.error("Error adding wrestler:", error)
    return null
  }
  return data
}

export const addBrand = async (brand: Omit<Brand, "id">): Promise<Brand | null> => {
  const { data, error } = await supabase.from("brands").insert([brand]).select().single()

  if (error) {
    console.error("Error adding brand:", error)
    return null
  }
  return data
}

export const addMatchType = async (matchType: Omit<MatchType, "id">): Promise<MatchType | null> => {
  const { data, error } = await supabase.from("match_types").insert([matchType]).select().single()

  if (error) {
    console.error("Error adding match type:", error)
    return null
  }
  return data
}

export const addChampionship = async (championship: Omit<Championship, "id">): Promise<Championship | null> => {
  const { data, error } = await supabase.from("championships").insert([championship]).select().single()

  if (error) {
    console.error("Error adding championship:", error)
    return null
  }
  return data
}
