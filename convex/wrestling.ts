import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

// Query functions
export const getPromotions = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("promotions").order("asc").collect()
  },
})

export const getBrandsByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("brands")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()
  },
})

export const getWrestlersByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    // Get all brands for this promotion
    const brands = await ctx.db
      .query("brands")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()

    const brandIds = brands.map((b) => b._id)

    // Get all wrestlers for these brands
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

export const getEventsByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()
  },
})

export const getMatchTypesByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("match_types")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()
  },
})

export const getChampionshipsByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("championships")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .withIndex("by_active", (q) => q.eq("is_active", true))
      .collect()
  },
})

export const getDataCounts = query({
  args: {},
  handler: async (ctx) => {
    const [promotions, brands, wrestlers, events, matchTypes, championships] = await Promise.all([
      ctx.db.query("promotions").collect(),
      ctx.db.query("brands").collect(),
      ctx.db.query("wrestlers").collect(),
      ctx.db.query("events").collect(),
      ctx.db.query("match_types").collect(),
      ctx.db.query("championships").collect(),
    ])

    return {
      promotions: promotions.length,
      brands: brands.length,
      wrestlers: wrestlers.length,
      events: events.length,
      matchTypes: matchTypes.length,
      championships: championships.length,
    }
  },
})

// Mutation functions
export const addPromotionMutation = mutation({
  args: {
    name: v.string(),
    country_code: v.string(),
    country_emoji: v.string(),
    primary_color: v.string(),
    secondary_color: v.string(),
    accent_color: v.string(),
    logo_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("promotions", args)
  },
})

export const addBrandMutation = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    color: v.string(),
    logo_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("brands", args)
  },
})

export const addWrestlerMutation = mutation({
  args: {
    name: v.string(),
    brand_id: v.id("brands"),
    status: v.union(v.literal("Active"), v.literal("Part-Time"), v.literal("Legend"), v.literal("Inactive")),
    gender: v.union(v.literal("Male"), v.literal("Female")),
    image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("wrestlers", args)
  },
})

export const addEventMutation = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_ppv: v.boolean(),
    logo_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args)
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
    belt_image_url: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("championships", args)
  },
})

// Bulk import mutations for seeding data
export const bulkImportPromotions = mutation({
  args: {
    promotions: v.array(
      v.object({
        name: v.string(),
        country_code: v.string(),
        country_emoji: v.string(),
        primary_color: v.string(),
        secondary_color: v.string(),
        accent_color: v.string(),
        logo_url: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = []
    for (const promotion of args.promotions) {
      const id = await ctx.db.insert("promotions", promotion)
      results.push(id)
    }
    return results
  },
})

export const bulkImportBrands = mutation({
  args: {
    brands: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        color: v.string(),
        logo_url: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = []
    for (const brand of args.brands) {
      const id = await ctx.db.insert("brands", brand)
      results.push(id)
    }
    return results
  },
})

export const bulkImportWrestlers = mutation({
  args: {
    wrestlers: v.array(
      v.object({
        name: v.string(),
        brand_id: v.id("brands"),
        status: v.union(v.literal("Active"), v.literal("Part-Time"), v.literal("Legend"), v.literal("Inactive")),
        gender: v.union(v.literal("Male"), v.literal("Female")),
        image_url: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = []
    for (const wrestler of args.wrestlers) {
      const id = await ctx.db.insert("wrestlers", wrestler)
      results.push(id)
    }
    return results
  },
})

export const bulkImportEvents = mutation({
  args: {
    events: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        is_ppv: v.boolean(),
        logo_url: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = []
    for (const event of args.events) {
      const id = await ctx.db.insert("events", event)
      results.push(id)
    }
    return results
  },
})

export const bulkImportMatchTypes = mutation({
  args: {
    matchTypes: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        default_participants: v.number(),
        is_single_winner: v.boolean(),
        is_team_based: v.boolean(),
        teams_count: v.optional(v.number()),
        players_per_team: v.optional(v.number()),
        gender_filter: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = []
    for (const matchType of args.matchTypes) {
      const id = await ctx.db.insert("match_types", matchType)
      results.push(id)
    }
    return results
  },
})

export const bulkImportChampionships = mutation({
  args: {
    championships: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        is_active: v.boolean(),
        belt_image_url: v.optional(v.string()),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const results = []
    for (const championship of args.championships) {
      const id = await ctx.db.insert("championships", championship)
      results.push(id)
    }
    return results
  },
})
