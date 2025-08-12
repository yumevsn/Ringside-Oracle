import { defineSchema, defineTable } from "convex/server"
import { v } from "convex/values"

export default defineSchema({
  promotions: defineTable({
    name: v.string(),
    country_code: v.string(),
    country_emoji: v.string(),
    primary_color: v.string(),
    secondary_color: v.string(),
    accent_color: v.string(),
  }).index("by_name", ["name"]),

  brands: defineTable({
    promotion_id: v.id("promotions"),
    name: v.string(),
    color: v.string(),
  }).index("by_promotion", ["promotion_id"]),

  wrestlers: defineTable({
    name: v.string(),
    brand_id: v.id("brands"),
    status: v.union(v.literal("Active"), v.literal("Part-Time"), v.literal("Legend"), v.literal("Inactive")),
    gender: v.union(v.literal("Male"), v.literal("Female")),
  })
    .index("by_brand", ["brand_id"])
    .index("by_name", ["name"]),

  events: defineTable({
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_ppv: v.boolean(),
  }).index("by_promotion", ["promotion_id"]),

  match_types: defineTable({
    promotion_id: v.id("promotions"),
    name: v.string(),
    default_participants: v.number(),
    is_single_winner: v.boolean(),
    is_team_based: v.boolean(),
    teams_count: v.optional(v.number()),
    players_per_team: v.optional(v.number()),
    gender_filter: v.optional(v.union(v.literal("Male"), v.literal("Female"))),
  }).index("by_promotion", ["promotion_id"]),

  championships: defineTable({
    promotion_id: v.id("promotions"),
    name: v.string(),
    is_active: v.boolean(),
  }).index("by_promotion", ["promotion_id"]),
})
