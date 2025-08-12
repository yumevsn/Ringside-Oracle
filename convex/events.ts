import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const listByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    return await ctx.db
      .query("events")
      .withIndex("by_promotion", (q) => q.eq("promotion_id", args.promotionId))
      .collect()
  },
})

export const create = mutation({
  args: {
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_ppv: v.boolean(),
  },
  handler: async (ctx, args) => {
    return await ctx.db.insert("events", args)
  },
})
