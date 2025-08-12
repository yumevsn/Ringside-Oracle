import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const listByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("match_types")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()
  },
})

export const create = mutation({
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
