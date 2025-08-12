import { mutation } from "./_generated/server"
import { v } from "convex/values"

export const addPromotion = mutation({
  args: {
    name: v.string(),
    country_code: v.string(),
    country_emoji: v.string(),
    primary_color: v.string(),
    secondary_color: v.string(),
    accent_color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("promotions", args)
  },
})

export const addBrand = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("brands", args)
  },
})

export const addWrestler = mutation({
  args: {
    name: v.string(),
    brand_id: v.id("brands"),
    status: v.union(v.literal("Active"), v.literal("Part-Time"), v.literal("Legend"), v.literal("Inactive")),
    gender: v.union(v.literal("Male"), v.literal("Female")),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("wrestlers", args)
  },
})

export const addEvent = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_ppv: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args)
  },
})

export const addMatchType = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    default_participants: v.number(),
    is_single_winner: v.boolean(),
    is_team_based: v.boolean(),
    teams_count: v.optional(v.number()),
    players_per_team: v.optional(v.number()),
    gender_filter: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("match_types", args)
  },
})

export const addChampionship = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_active: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("championships", args)
  },
})
