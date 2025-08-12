import { query, mutation } from "./_generated/server"
import { v } from "convex/values"

export const listByPromotion = query({
  args: { promotionId: v.id("promotions") },
  handler: async (ctx, args) => {
    // Get all brands for this promotion
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
        brand_name: brand?.name || "",
      }))

      wrestlers.push(...wrestlersWithBrand)
    }

    return wrestlers.sort((a, b) => a.name.localeCompare(b.name))
  },
})

export const create = mutation({
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
