// Database utility functions for Ringside Oracle - Convex Version
import { useQuery, useMutation } from "convex/react"
import { api } from "@/convex/_generated/api"
import type { Id } from "@/convex/_generated/dataModel"

export interface Promotion {
  _id: Id<"promotions">
  name: string
  country_code: string
  country_emoji: string
  primary_color: string
  secondary_color: string
  accent_color: string
}

export interface Brand {
  _id: Id<"brands">
  promotion_id: Id<"promotions">
  name: string
  color: string
}

export interface Wrestler {
  _id: Id<"wrestlers">
  name: string
  brand_id: Id<"brands">
  status: "Active" | "Part-Time" | "Legend" | "Inactive"
  gender: "Male" | "Female"
  brand_name?: string
}

export interface Event {
  _id: Id<"events">
  promotion_id: Id<"promotions">
  name: string
  is_ppv: boolean
}

export interface MatchType {
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

export interface Championship {
  _id: Id<"championships">
  promotion_id: Id<"promotions">
  name: string
  is_active: boolean
}

// Custom hooks for data fetching
export const usePromotions = () => {
  return useQuery(api.promotions.list) || []
}

export const useBrandsByPromotion = (promotionId: Id<"promotions"> | null) => {
  return useQuery(api.brands.listByPromotion, promotionId ? { promotionId } : "skip") || []
}

export const useWrestlersByPromotion = (promotionId: Id<"promotions"> | null) => {
  return useQuery(api.wrestlers.listByPromotion, promotionId ? { promotionId } : "skip") || []
}

export const useEventsByPromotion = (promotionId: Id<"promotions"> | null) => {
  return useQuery(api.events.listByPromotion, promotionId ? { promotionId } : "skip") || []
}

export const useMatchTypesByPromotion = (promotionId: Id<"promotions"> | null) => {
  return useQuery(api.matchTypes.listByPromotion, promotionId ? { promotionId } : "skip") || []
}

export const useChampionshipsByPromotion = (promotionId: Id<"promotions"> | null) => {
  return useQuery(api.championships.listByPromotion, promotionId ? { promotionId } : "skip") || []
}

// Mutation hooks for adding data
export const useAddPromotion = () => {
  return useMutation(api.promotions.create)
}

export const useAddBrand = () => {
  return useMutation(api.brands.create)
}

export const useAddWrestler = () => {
  return useMutation(api.wrestlers.create)
}

export const useAddEvent = () => {
  return useMutation(api.events.create)
}

export const useAddMatchType = () => {
  return useMutation(api.matchTypes.create)
}

export const useAddChampionship = () => {
  return useMutation(api.championships.create)
}

// Legacy functions for compatibility (these will be replaced with hooks in components)
export const fetchPromotions = async (): Promise<Promotion[]> => {
  // This is now handled by usePromotions hook
  return []
}

export const fetchBrandsByPromotion = async (promotionId: any): Promise<Brand[]> => {
  // This is now handled by useBrandsByPromotion hook
  return []
}

export const fetchWrestlersByPromotion = async (promotionId: any): Promise<Wrestler[]> => {
  // This is now handled by useWrestlersByPromotion hook
  return []
}

export const fetchEventsByPromotion = async (promotionId: any): Promise<Event[]> => {
  // This is now handled by useEventsByPromotion hook
  return []
}

export const fetchMatchTypesByPromotion = async (promotionId: any): Promise<MatchType[]> => {
  // This is now handled by useMatchTypesByPromotion hook
  return []
}

export const fetchChampionshipsByPromotion = async (promotionId: any): Promise<Championship[]> => {
  // This is now handled by useChampionshipsByPromotion hook
  return []
}

// User contribution functions (now return promises for mutations)
export const addPromotion = async (promotion: Omit<Promotion, "_id">): Promise<Promotion | null> => {
  // This is now handled by useAddPromotion hook
  return null
}

export const addEvent = async (event: Omit<Event, "_id">): Promise<Event | null> => {
  // This is now handled by useAddEvent hook
  return null
}

export const addWrestler = async (wrestler: Omit<Wrestler, "_id" | "brand_name">): Promise<Wrestler | null> => {
  // This is now handled by useAddWrestler hook
  return null
}

export const addBrand = async (brand: Omit<Brand, "_id">): Promise<Brand | null> => {
  // This is now handled by useAddBrand hook
  return null
}

export const addMatchType = async (matchType: Omit<MatchType, "_id">): Promise<MatchType | null> => {
  // This is now handled by useAddMatchType hook
  return null
}

export const addChampionship = async (championship: Omit<Championship, "_id">): Promise<Championship | null> => {
  // This is now handled by useAddChampionship hook
  return null
}
