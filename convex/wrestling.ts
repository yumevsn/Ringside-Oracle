import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Fetch all promotions
export const getPromotions = query({
  handler: async (ctx) => {
    return await ctx.db.query("promotions").order("asc").collect()
  },
})

// Fetch brands by promotion
export const getBrandsByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("brands")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .order("asc")
      .collect()
  },
})

// Fetch wrestlers by promotion (with brand info)
export const getWrestlersByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    // First get all brands for this promotion
    const brands = await ctx.db
      .query("brands")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()

    const brandIds = brands.map((b) => b._id)

    // Get wrestlers for these brands
    const wrestlers = []
    for (const brandId of brandIds) {
      const brandWrestlers = await ctx.db
        .query("wrestlers")
        .withIndex("by_brand", (q) => q.eq("brand_id", brandId))
        .collect()

      // Add brand name to each wrestler
      const brand = brands.find((b) => b._id === brandId)
      const wrestlersWithBrand = brandWrestlers.map((wrestler) => ({
        ...wrestler,
        brand_name: brand?.name || "Unknown",
      }))

      wrestlers.push(...wrestlersWithBrand)
    }

    return wrestlers.sort((a, b) => a.name.localeCompare(b.name))
  },
})

// Fetch events by promotion
export const getEventsByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .order("asc")
      .collect()
  },
})

// Fetch match types by promotion
export const getMatchTypesByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("match_types")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .order("asc")
      .collect()
  },
})

// Fetch championships by promotion
export const getChampionshipsByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("championships")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .filter((q) => q.eq(q.field("is_active"), true))
      .order("asc")
      .collect()
  },
})

// User contribution mutations
export const addPromotionMutation = mutation({
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

export const addEventMutation = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_ppv: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args)
  },
})

export const addWrestlerMutation = mutation({
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

export const addBrandMutation = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    color: v.string(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("brands", args)
  },
})

export const addMatchTypeMutation = mutation({
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

export const addChampionshipMutation = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_active: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("championships", args)
  },
})
