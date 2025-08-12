import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const list = query({
  args: {},
  handler: async (ctx) => {
    return await ctx.db.query("promotions").order("asc").collect()
  },
})

export const create = mutation({
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
