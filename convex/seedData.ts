import { mutation } from "./_generated/server"

// Helper function to parse CSV
function parseCSV(csv: string) {
  const lines = csv.trim().split("\n")
  const headers = lines[0].split(",").map((h) => h.trim().replace(/^"|"$/g, ""))

  return lines.slice(1).map((line) => {
    const values = line.split(",").map((v) => v.trim().replace(/^"|"$/g, ""))
    const obj: any = {}
    headers.forEach((header, index) => {
      obj[header] = values[index]
    })
    return obj
  })
}

export const seedInitialData = mutation({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingPromotions = await ctx.db.query("promotions").collect()
    if (existingPromotions.length > 0) {
      return {
        message: "Data already exists, skipping seed",
        promotions: existingPromotions.length,
      }
    }

    try {
      console.log("Starting CSV import...")

      // Fetch all CSV files
      const [promotionsCSV, brandsCSV, wrestlersCSV, eventsCSV, matchTypesCSV, championshipsCSV] = await Promise.all([
        fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/promotions_rows%20%281%29-qABqBSW02kSuI4XTSQt3Y32FwUgKZa.csv",
        ).then((r) => r.text()),
        fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brands_rows%20%281%29-HoyK9S7MPCrE7zIn2qTOMioPNIH4p9.csv",
        ).then((r) => r.text()),
        fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wrestlers_rows%20%281%29-7eQ7P4XQZ0isf2a8BOzJL7wdmr9yDE.csv",
        ).then((r) => r.text()),
        fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/events_rows%20%281%29-YELe8viVJwD6dnVfZHK4sxe5FLr4ud.csv",
        ).then((r) => r.text()),
        fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/match_types_rows%20%281%29-dMrbe9COyvZCRnhs8kFzRMma5HPAPt.csv",
        ).then((r) => r.text()),
        fetch(
          "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/championships_rows%20%281%29-B6YJ89422OTdXoCOw7FHdXs7xxBpWQ.csv",
        ).then((r) => r.text()),
      ])

      console.log("CSV files fetched, parsing data...")

      // Parse CSV data
      const promotionsData = parseCSV(promotionsCSV)
      const brandsData = parseCSV(brandsCSV)
      const wrestlersData = parseCSV(wrestlersCSV)
      const eventsData = parseCSV(eventsCSV)
      const matchTypesData = parseCSV(matchTypesCSV)
      const championshipsData = parseCSV(championshipsCSV)

      console.log(
        `Parsed: ${promotionsData.length} promotions, ${brandsData.length} brands, ${wrestlersData.length} wrestlers`,
      )

      // Create ID mapping for relationships
      const promotionIdMap = new Map<string, any>()
      const brandIdMap = new Map<string, any>()

      // Insert promotions
      console.log("Inserting promotions...")
      for (const promo of promotionsData) {
        const convexId = await ctx.db.insert("promotions", {
          name: promo.name,
          country_code: promo.country_code,
          country_emoji: promo.country_emoji,
          primary_color: promo.primary_color,
          secondary_color: promo.secondary_color,
          accent_color: promo.accent_color,
        })
        promotionIdMap.set(promo.id, convexId)
      }

      // Insert brands
      console.log("Inserting brands...")
      for (const brand of brandsData) {
        const promotionId = promotionIdMap.get(brand.promotion_id)
        if (promotionId) {
          const convexId = await ctx.db.insert("brands", {
            promotion_id: promotionId,
            name: brand.name,
            color: brand.color,
          })
          brandIdMap.set(brand.id, convexId)
        }
      }

      // Insert wrestlers
      console.log("Inserting wrestlers...")
      for (const wrestler of wrestlersData) {
        const brandId = brandIdMap.get(wrestler.brand_id)
        if (brandId) {
          await ctx.db.insert("wrestlers", {
            name: wrestler.name,
            brand_id: brandId,
            status: wrestler.status as "Active" | "Part-Time" | "Legend" | "Inactive",
            gender: wrestler.gender as "Male" | "Female",
          })
        }
      }

      // Insert events
      console.log("Inserting events...")
      for (const event of eventsData) {
        const promotionId = promotionIdMap.get(event.promotion_id)
        if (promotionId) {
          await ctx.db.insert("events", {
            promotion_id: promotionId,
            name: event.name,
            is_ppv: event.is_ppv === "true" || event.is_ppv === "1",
          })
        }
      }

      // Insert match types
      console.log("Inserting match types...")
      for (const matchType of matchTypesData) {
        const promotionId = promotionIdMap.get(matchType.promotion_id)
        if (promotionId) {
          const matchTypeData: any = {
            promotion_id: promotionId,
            name: matchType.name,
            default_participants: Number.parseInt(matchType.default_participants) || 2,
            is_single_winner: matchType.is_single_winner === "true" || matchType.is_single_winner === "1",
            is_team_based: matchType.is_team_based === "true" || matchType.is_team_based === "1",
          }

          // Add optional fields
          if (matchType.teams_count && matchType.teams_count !== "") {
            matchTypeData.teams_count = Number.parseInt(matchType.teams_count)
          }
          if (matchType.players_per_team && matchType.players_per_team !== "") {
            matchTypeData.players_per_team = Number.parseInt(matchType.players_per_team)
          }
          if (matchType.gender_filter && (matchType.gender_filter === "Male" || matchType.gender_filter === "Female")) {
            matchTypeData.gender_filter = matchType.gender_filter
          }

          await ctx.db.insert("match_types", matchTypeData)
        }
      }

      // Insert championships
      console.log("Inserting championships...")
      for (const championship of championshipsData) {
        const promotionId = promotionIdMap.get(championship.promotion_id)
        if (promotionId) {
          await ctx.db.insert("championships", {
            promotion_id: promotionId,
            name: championship.name,
            is_active: championship.is_active === "true" || championship.is_active === "1",
          })
        }
      }

      const finalCounts = {
        promotions: promotionsData.length,
        brands: brandsData.length,
        wrestlers: wrestlersData.length,
        events: eventsData.length,
        matchTypes: matchTypesData.length,
        championships: championshipsData.length,
      }

      console.log("Import complete!", finalCounts)

      return {
        success: true,
        message: `Successfully imported all wrestling data from CSV files!`,
        counts: finalCounts,
        total: Object.values(finalCounts).reduce((a, b) => a + b, 0),
      }
    } catch (error) {
      console.error("Error seeding from CSV:", error)
      return {
        success: false,
        message: "Error importing CSV data",
        error: error instanceof Error ? error.message : "Unknown error",
      }
    }
  },
})

// Remove the old seedAdditionalData function entirely
