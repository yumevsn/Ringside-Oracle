// Script to import CSV data into Convex
import { ConvexHttpClient } from "convex/browser"

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

async function importCsvData() {
  const csvUrls = {
    promotions:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/promotions_rows-raKwx0w03cZvCkwhMkbWF5GCQbvTzW.csv",
    brands: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brands_rows-bJReSjJNG4nefQKfPSt7YuUq0Acb7b.csv",
    wrestlers:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wrestlers_rows-8KS7NRudfM6VgwJnKlXBc5w7f8pFh2.csv",
    events: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/events_rows-NK27LGHy4RhM9hdEeO44VHjEDf4VFl.csv",
    match_types:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/match_types_rows-SJwsPMX2m8aX8194oNENHFpSXAeDDq.csv",
    championships:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/championships_rows-h1YZClO5y3OXKmxhfjCb4TRMjkbLgB.csv",
  }

  function parseCSV(csvText) {
    const lines = csvText.trim().split("\n")
    const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""))
    const rows = []

    for (let i = 1; i < lines.length; i++) {
      const values = lines[i].split(",").map((v) => v.replace(/"/g, ""))
      const row = {}
      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })
      rows.push(row)
    }

    return { headers, rows }
  }

  // Store mapping of old IDs to new Convex IDs
  const idMappings = {
    promotions: new Map(),
    brands: new Map(),
  }

  try {
    // 1. Import Promotions first (no dependencies)
    console.log("Importing promotions...")
    const promotionsResponse = await fetch(csvUrls.promotions)
    const promotionsCSV = await promotionsResponse.text()
    const { rows: promotionsData } = parseCSV(promotionsCSV)

    for (const promotion of promotionsData) {
      const convexId = await client.mutation("importData:addPromotion", {
        name: promotion.name,
        country_code: promotion.country_code,
        country_emoji: promotion.country_emoji,
        primary_color: promotion.primary_color,
        secondary_color: promotion.secondary_color,
        accent_color: promotion.accent_color,
      })
      idMappings.promotions.set(promotion.id, convexId)
      console.log(`Added promotion: ${promotion.name}`)
    }

    // 2. Import Brands (depends on promotions)
    console.log("Importing brands...")
    const brandsResponse = await fetch(csvUrls.brands)
    const brandsCSV = await brandsResponse.text()
    const { rows: brandsData } = parseCSV(brandsCSV)

    for (const brand of brandsData) {
      const promotionId = idMappings.promotions.get(brand.promotion_id)
      if (promotionId) {
        const convexId = await client.mutation("importData:addBrand", {
          promotion_id: promotionId,
          name: brand.name,
          color: brand.color,
        })
        idMappings.brands.set(brand.id, convexId)
        console.log(`Added brand: ${brand.name}`)
      }
    }

    // 3. Import Wrestlers (depends on brands)
    console.log("Importing wrestlers...")
    const wrestlersResponse = await fetch(csvUrls.wrestlers)
    const wrestlersCSV = await wrestlersResponse.text()
    const { rows: wrestlersData } = parseCSV(wrestlersCSV)

    for (const wrestler of wrestlersData) {
      const brandId = idMappings.brands.get(wrestler.brand_id)
      if (brandId) {
        await client.mutation("importData:addWrestler", {
          name: wrestler.name,
          brand_id: brandId,
          status: wrestler.status,
          gender: wrestler.gender,
        })
        console.log(`Added wrestler: ${wrestler.name}`)
      }
    }

    // 4. Import Events (depends on promotions)
    console.log("Importing events...")
    const eventsResponse = await fetch(csvUrls.events)
    const eventsCSV = await eventsResponse.text()
    const { rows: eventsData } = parseCSV(eventsCSV)

    for (const event of eventsData) {
      const promotionId = idMappings.promotions.get(event.promotion_id)
      if (promotionId) {
        await client.mutation("importData:addEvent", {
          promotion_id: promotionId,
          name: event.name,
          is_ppv: event.is_ppv === "true",
        })
        console.log(`Added event: ${event.name}`)
      }
    }

    // 5. Import Match Types (depends on promotions)
    console.log("Importing match types...")
    const matchTypesResponse = await fetch(csvUrls.match_types)
    const matchTypesCSV = await matchTypesResponse.text()
    const { rows: matchTypesData } = parseCSV(matchTypesCSV)

    for (const matchType of matchTypesData) {
      const promotionId = idMappings.promotions.get(matchType.promotion_id)
      if (promotionId) {
        await client.mutation("importData:addMatchType", {
          promotion_id: promotionId,
          name: matchType.name,
          default_participants: Number.parseInt(matchType.default_participants) || 2,
          is_single_winner: matchType.is_single_winner === "true",
          is_team_based: matchType.is_team_based === "true",
          teams_count: matchType.teams_count ? Number.parseInt(matchType.teams_count) : undefined,
          players_per_team: matchType.players_per_team ? Number.parseInt(matchType.players_per_team) : undefined,
          gender_filter: matchType.gender_filter || undefined,
        })
        console.log(`Added match type: ${matchType.name}`)
      }
    }

    // 6. Import Championships (depends on promotions)
    console.log("Importing championships...")
    const championshipsResponse = await fetch(csvUrls.championships)
    const championshipsCSV = await championshipsResponse.text()
    const { rows: championshipsData } = parseCSV(championshipsCSV)

    for (const championship of championshipsData) {
      const promotionId = idMappings.promotions.get(championship.promotion_id)
      if (promotionId) {
        await client.mutation("importData:addChampionship", {
          promotion_id: promotionId,
          name: championship.name,
          is_active: championship.is_active === "true",
        })
        console.log(`Added championship: ${championship.name}`)
      }
    }

    console.log("Data import completed successfully!")
  } catch (error) {
    console.error("Error importing data:", error)
  }
}

importCsvData()
