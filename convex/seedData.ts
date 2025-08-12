import { mutation } from "./_generated/server"

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingPromotions = await ctx.db.query("promotions").collect()
    if (existingPromotions.length > 0) {
      return { message: "Data already exists, skipping seed" }
    }

    // Create WWE
    const wweId = await ctx.db.insert("promotions", {
      name: "WWE",
      country_code: "US",
      country_emoji: "🇺🇸",
      primary_color: "bg-gradient-to-r from-yellow-500 to-yellow-600",
      secondary_color: "bg-red-600/10 border-red-500/20",
      accent_color: "text-yellow-400 border-yellow-500/30",
    })

    // Create WWE Brands
    const rawId = await ctx.db.insert("brands", {
      promotion_id: wweId,
      name: "Raw",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
    })

    const smackdownId = await ctx.db.insert("brands", {
      promotion_id: wweId,
      name: "SmackDown",
      color: "bg-blue-600/20 border-blue-500/30 text-blue-400",
    })

    const nxtId = await ctx.db.insert("brands", {
      promotion_id: wweId,
      name: "NXT",
      color: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
    })

    // Create some WWE wrestlers
    const wweWrestlers = [
      { name: "Cody Rhodes", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Seth Rollins", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Rhea Ripley", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Roman Reigns", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Bayley", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Trick Williams", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Roxanne Perez", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
    ]

    for (const wrestler of wweWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create WWE Events
    const wweEvents = [
      { name: "Royal Rumble", is_ppv: true },
      { name: "WrestleMania", is_ppv: true },
      { name: "SummerSlam", is_ppv: true },
      { name: "Survivor Series", is_ppv: true },
      { name: "Raw", is_ppv: false },
      { name: "SmackDown", is_ppv: false },
      { name: "NXT", is_ppv: false },
    ]

    for (const event of wweEvents) {
      await ctx.db.insert("events", {
        promotion_id: wweId,
        ...event,
      })
    }

    // Create WWE Match Types
    const wweMatchTypes = [
      {
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        name: "Men's Royal Rumble",
        default_participants: 30,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Male" as const,
      },
      {
        name: "Women's Royal Rumble",
        default_participants: 30,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Female" as const,
      },
    ]

    for (const matchType of wweMatchTypes) {
      await ctx.db.insert("match_types", {
        promotion_id: wweId,
        ...matchType,
      })
    }

    // Create WWE Championships
    const wweChampionships = [
      { name: "WWE Championship", is_active: true },
      { name: "World Heavyweight Championship", is_active: true },
      { name: "Women's World Championship", is_active: true },
      { name: "Women's Championship", is_active: true },
      { name: "Intercontinental Championship", is_active: true },
      { name: "United States Championship", is_active: true },
    ]

    for (const championship of wweChampionships) {
      await ctx.db.insert("championships", {
        promotion_id: wweId,
        ...championship,
      })
    }

    // Create AEW
    const aewId = await ctx.db.insert("promotions", {
      name: "AEW",
      country_code: "US",
      country_emoji: "🇺🇸",
      primary_color: "bg-gradient-to-r from-yellow-400 to-red-500",
      secondary_color: "bg-black/20 border-yellow-500/20",
      accent_color: "text-yellow-400 border-red-500/30",
    })

    // Create AEW Brand
    const dynamiteId = await ctx.db.insert("brands", {
      promotion_id: aewId,
      name: "Dynamite",
      color: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
    })

    // Create some AEW wrestlers
    const aewWrestlers = [
      { name: "Jon Moxley", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Orange Cassidy", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Toni Storm", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
      { name: "Mariah May", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
    ]

    for (const wrestler of aewWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create AEW Events
    const aewEvents = [
      { name: "Revolution", is_ppv: true },
      { name: "Double or Nothing", is_ppv: true },
      { name: "All Out", is_ppv: true },
      { name: "Full Gear", is_ppv: true },
      { name: "Dynamite", is_ppv: false },
    ]

    for (const event of aewEvents) {
      await ctx.db.insert("events", {
        promotion_id: aewId,
        ...event,
      })
    }

    // Create AEW Match Types
    for (const matchType of wweMatchTypes) {
      await ctx.db.insert("match_types", {
        promotion_id: aewId,
        ...matchType,
      })
    }

    // Create AEW Championships
    const aewChampionships = [
      { name: "AEW World Championship", is_active: true },
      { name: "AEW Women's World Championship", is_active: true },
      { name: "AEW International Championship", is_active: true },
      { name: "AEW Continental Championship", is_active: true },
    ]

    for (const championship of aewChampionships) {
      await ctx.db.insert("championships", {
        promotion_id: aewId,
        ...championship,
      })
    }

    return { message: "Initial data seeded successfully" }
  },
})
