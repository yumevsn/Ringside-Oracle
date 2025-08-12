// Database utility functions for Ringside Oracle using Convex
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

// Custom hooks for fetching data
export const usePromotions = () => {
  return useQuery(api.wrestling.getPromotions)
}

export const useBrandsByPromotion = (promotionId: Id<"promotions"> | undefined) => {
  return useQuery(api.wrestling.getBrandsByPromotion, promotionId ? { promotionId } : "skip")
}

export const useWrestlersByPromotion = (promotionId: Id<"promotions"> | undefined) => {
  return useQuery(api.wrestling.getWrestlersByPromotion, promotionId ? { promotionId } : "skip")
}

export const useEventsByPromotion = (promotionId: Id<"promotions"> | undefined) => {
  return useQuery(api.wrestling.getEventsByPromotion, promotionId ? { promotionId } : "skip")
}

export const useMatchTypesByPromotion = (promotionId: Id<"promotions"> | undefined) => {
  return useQuery(api.wrestling.getMatchTypesByPromotion, promotionId ? { promotionId } : "skip")
}

export const useChampionshipsByPromotion = (promotionId: Id<"promotions"> | undefined) => {
  return useQuery(api.wrestling.getChampionshipsByPromotion, promotionId ? { promotionId } : "skip")
}

// Mutation hooks for user contributions
export const useAddPromotion = () => {
  return useMutation(api.wrestling.addPromotionMutation)
}

export const useAddEvent = () => {
  return useMutation(api.wrestling.addEventMutation)
}

export const useAddWrestler = () => {
  return useMutation(api.wrestling.addWrestlerMutation)
}

export const useAddBrand = () => {
  return useMutation(api.wrestling.addBrandMutation)
}

export const useAddMatchType = () => {
  return useMutation(api.wrestling.addMatchTypeMutation)
}

export const useAddChampionship = () => {
  return useMutation(api.wrestling.addChampionshipMutation)
}

// Legacy function wrappers for compatibility (these will return promises)
export const fetchPromotions = async (): Promise<Promotion[]> => {
  // This is a compatibility wrapper - in practice you should use the hooks above
  throw new Error("Use usePromotions hook instead")
}

export const fetchBrandsByPromotion = async (promotionId: string): Promise<Brand[]> => {
  throw new Error("Use useBrandsByPromotion hook instead")
}

export const fetchWrestlersByPromotion = async (promotionId: string): Promise<Wrestler[]> => {
  throw new Error("Use useWrestlersByPromotion hook instead")
}

export const fetchEventsByPromotion = async (promotionId: string): Promise<Event[]> => {
  throw new Error("Use useEventsByPromotion hook instead")
}

export const fetchMatchTypesByPromotion = async (promotionId: string): Promise<MatchType[]> => {
  throw new Error("Use useMatchTypesByPromotion hook instead")
}

export const fetchChampionshipsByPromotion = async (promotionId: string): Promise<Championship[]> => {
  throw new Error("Use useChampionshipsByPromotion hook instead")
}

// User contribution functions (legacy wrappers)
export const addPromotion = async (promotion: Omit<Promotion, "_id">): Promise<Promotion | null> => {
  throw new Error("Use useAddPromotion hook instead")
}

export const addEvent = async (event: Omit<Event, "_id">): Promise<Event | null> => {
  throw new Error("Use useAddEvent hook instead")
}

export const addWrestler = async (wrestler: Omit<Wrestler, "_id" | "brand_name">): Promise<Wrestler | null> => {
  throw new Error("Use useAddWrestler hook instead")
}

export const addBrand = async (brand: Omit<Brand, "_id">): Promise<Brand | null> => {
  throw new Error("Use useAddBrand hook instead")
}

export const addMatchType = async (matchType: Omit<MatchType, "_id">): Promise<MatchType | null> => {
  throw new Error("Use useAddMatchType hook instead")
}

export const addChampionship = async (championship: Omit<Championship, "_id">): Promise<Championship | null> => {
  throw new Error("Use useAddChampionship hook instead")
}
