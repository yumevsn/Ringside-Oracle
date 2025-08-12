// Improved script to import CSV data into Convex with better error handling
import { ConvexHttpClient } from "convex/browser"

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

async function importCsvDataImproved() {
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
    if (lines.length === 0) return { headers: [], rows: [] }

    // Parse headers - handle quoted fields
    const headerLine = lines[0]
    const headers = parseCSVLine(headerLine)

    const rows = []
    for (let i = 1; i < lines.length; i++) {
      if (lines[i].trim() === "") continue // Skip empty lines

      const values = parseCSVLine(lines[i])
      const row = {}

      headers.forEach((header, index) => {
        row[header] = values[index] || ""
      })

      rows.push(row)
    }

    return { headers, rows }
  }

  function parseCSVLine(line) {
    const result = []
    let current = ""
    let inQuotes = false

    for (let i = 0; i < line.length; i++) {
      const char = line[i]

      if (char === '"') {
        inQuotes = !inQuotes
      } else if (char === "," && !inQuotes) {
        result.push(current.trim())
        current = ""
      } else {
        current += char
      }
    }

    result.push(current.trim())
    return result
  }

  // Store mapping of old IDs to new Convex IDs
  const idMappings = {
    promotions: new Map(),
    brands: new Map(),
  }

  try {
    console.log("🚀 Starting improved CSV data import...")

    // Check if data already exists
    const existingData = await client.query("wrestling:getDataCounts")
    if (existingData.promotions > 0) {
      console.log("⚠️ Data already exists in database!")
      console.log(`Current counts: ${JSON.stringify(existingData, null, 2)}`)

      const readline = await import("readline")
      const rl = readline.createInterface({
        input: process.stdin,
        output: process.stdout,
      })

      const answer = await new Promise((resolve) => {
        rl.question("Do you want to continue and potentially create duplicates? (y/N): ", resolve)
      })
      rl.close()

      if (answer.toLowerCase() !== "y") {
        console.log("Import cancelled.")
        return
      }
    }

    // 1. Import Promotions first (no dependencies)
    console.log("\n📊 Importing promotions...")
    try {
      const promotionsResponse = await fetch(csvUrls.promotions)
      if (!promotionsResponse.ok) throw new Error(`HTTP ${promotionsResponse.status}`)

      const promotionsCSV = await promotionsResponse.text()
      console.log(`Raw CSV length: ${promotionsCSV.length} characters`)

      const { rows: promotionsData } = parseCSV(promotionsCSV)
      console.log(`Parsed ${promotionsData.length} promotion records`)

      for (const [index, promotion] of promotionsData.entries()) {
        try {
          console.log(`Processing promotion ${index + 1}/${promotionsData.length}: ${promotion.name}`)

          const convexId = await client.mutation("importData:addPromotion", {
            name: promotion.name || `Unknown Promotion ${index}`,
            country_code: promotion.country_code || "US",
            country_emoji: promotion.country_emoji || "🇺🇸",
            primary_color: promotion.primary_color || "bg-blue-600",
            secondary_color: promotion.secondary_color || "bg-blue-600/10",
            accent_color: promotion.accent_color || "text-blue-400",
          })

          idMappings.promotions.set(promotion.id, convexId)
          console.log(`✅ Added promotion: ${promotion.name} (${convexId})`)
        } catch (error) {
          console.error(`❌ Failed to add promotion ${promotion.name}:`, error)
        }
      }
    } catch (error) {
      console.error("❌ Error importing promotions:", error)
      return
    }

    // 2. Import Brands (depends on promotions)
    console.log("\n🏷️ Importing brands...")
    try {
      const brandsResponse = await fetch(csvUrls.brands)
      const brandsCSV = await brandsResponse.text()
      const { rows: brandsData } = parseCSV(brandsCSV)
      console.log(`Parsed ${brandsData.length} brand records`)

      for (const [index, brand] of brandsData.entries()) {
        try {
          const promotionId = idMappings.promotions.get(brand.promotion_id)
          if (!promotionId) {
            console.log(`⚠️ Skipping brand ${brand.name} - promotion ID ${brand.promotion_id} not found`)
            continue
          }

          const convexId = await client.mutation("importData:addBrand", {
            promotion_id: promotionId,
            name: brand.name || `Unknown Brand ${index}`,
            color: brand.color || "bg-gray-600/20",
          })

          idMappings.brands.set(brand.id, convexId)
          console.log(`✅ Added brand: ${brand.name} (${convexId})`)
        } catch (error) {
          console.error(`❌ Failed to add brand ${brand.name}:`, error)
        }
      }
    } catch (error) {
      console.error("❌ Error importing brands:", error)
    }

    // 3. Import Wrestlers (depends on brands)
    console.log("\n🤼 Importing wrestlers...")
    try {
      const wrestlersResponse = await fetch(csvUrls.wrestlers)
      const wrestlersCSV = await wrestlersResponse.text()
      const { rows: wrestlersData } = parseCSV(wrestlersCSV)
      console.log(`Parsed ${wrestlersData.length} wrestler records`)

      for (const [index, wrestler] of wrestlersData.entries()) {
        try {
          const brandId = idMappings.brands.get(wrestler.brand_id)
          if (!brandId) {
            console.log(`⚠️ Skipping wrestler ${wrestler.name} - brand ID ${wrestler.brand_id} not found`)
            continue
          }

          // Validate status and gender
          const validStatuses = ["Active", "Part-Time", "Legend", "Inactive"]
          const validGenders = ["Male", "Female"]

          const status = validStatuses.includes(wrestler.status) ? wrestler.status : "Active"
          const gender = validGenders.includes(wrestler.gender) ? wrestler.gender : "Male"

          await client.mutation("importData:addWrestler", {
            name: wrestler.name || `Unknown Wrestler ${index}`,
            brand_id: brandId,
            status: status,
            gender: gender,
          })

          console.log(`✅ Added wrestler: ${wrestler.name}`)
        } catch (error) {
          console.error(`❌ Failed to add wrestler ${wrestler.name}:`, error)
        }
      }
    } catch (error) {
      console.error("❌ Error importing wrestlers:", error)
    }

    // 4. Import Events (depends on promotions)
    console.log("\n🎪 Importing events...")
    try {
      const eventsResponse = await fetch(csvUrls.events)
      const eventsCSV = await eventsResponse.text()
      const { rows: eventsData } = parseCSV(eventsCSV)
      console.log(`Parsed ${eventsData.length} event records`)

      for (const [index, event] of eventsData.entries()) {
        try {
          const promotionId = idMappings.promotions.get(event.promotion_id)
          if (!promotionId) {
            console.log(`⚠️ Skipping event ${event.name} - promotion ID ${event.promotion_id} not found`)
            continue
          }

          await client.mutation("importData:addEvent", {
            promotion_id: promotionId,
            name: event.name || `Unknown Event ${index}`,
            is_ppv: event.is_ppv === "true" || event.is_ppv === true,
          })

          console.log(`✅ Added event: ${event.name}`)
        } catch (error) {
          console.error(`❌ Failed to add event ${event.name}:`, error)
        }
      }
    } catch (error) {
      console.error("❌ Error importing events:", error)
    }

    // 5. Import Match Types (depends on promotions)
    console.log("\n⚔️ Importing match types...")
    try {
      const matchTypesResponse = await fetch(csvUrls.match_types)
      const matchTypesCSV = await matchTypesResponse.text()
      const { rows: matchTypesData } = parseCSV(matchTypesCSV)
      console.log(`Parsed ${matchTypesData.length} match type records`)

      for (const [index, matchType] of matchTypesData.entries()) {
        try {
          const promotionId = idMappings.promotions.get(matchType.promotion_id)
          if (!promotionId) {
            console.log(`⚠️ Skipping match type ${matchType.name} - promotion ID ${matchType.promotion_id} not found`)
            continue
          }

          await client.mutation("importData:addMatchType", {
            promotion_id: promotionId,
            name: matchType.name || `Unknown Match Type ${index}`,
            default_participants: Number.parseInt(matchType.default_participants) || 2,
            is_single_winner: matchType.is_single_winner === "true" || matchType.is_single_winner === true,
            is_team_based: matchType.is_team_based === "true" || matchType.is_team_based === true,
            teams_count: matchType.teams_count ? Number.parseInt(matchType.teams_count) : undefined,
            players_per_team: matchType.players_per_team ? Number.parseInt(matchType.players_per_team) : undefined,
            gender_filter: ["Male", "Female"].includes(matchType.gender_filter) ? matchType.gender_filter : undefined,
          })

          console.log(`✅ Added match type: ${matchType.name}`)
        } catch (error) {
          console.error(`❌ Failed to add match type ${matchType.name}:`, error)
        }
      }
    } catch (error) {
      console.error("❌ Error importing match types:", error)
    }

    // 6. Import Championships (depends on promotions)
    console.log("\n🏆 Importing championships...")
    try {
      const championshipsResponse = await fetch(csvUrls.championships)
      const championshipsCSV = await championshipsResponse.text()
      const { rows: championshipsData } = parseCSV(championshipsCSV)
      console.log(`Parsed ${championshipsData.length} championship records`)

      for (const [index, championship] of championshipsData.entries()) {
        try {
          const promotionId = idMappings.promotions.get(championship.promotion_id)
          if (!promotionId) {
            console.log(
              `⚠️ Skipping championship ${championship.name} - promotion ID ${championship.promotion_id} not found`,
            )
            continue
          }

          await client.mutation("importData:addChampionship", {
            promotion_id: promotionId,
            name: championship.name || `Unknown Championship ${index}`,
            is_active: championship.is_active === "true" || championship.is_active === true,
          })

          console.log(`✅ Added championship: ${championship.name}`)
        } catch (error) {
          console.error(`❌ Failed to add championship ${championship.name}:`, error)
        }
      }
    } catch (error) {
      console.error("❌ Error importing championships:", error)
    }

    console.log("\n🎉 Data import completed!")

    // Verify final counts
    const finalCounts = await client.query("wrestling:getDataCounts")
    console.log("\n📊 FINAL DATABASE COUNTS:")
    console.log("========================")
    console.log(`Promotions: ${finalCounts.promotions}`)
    console.log(`Brands: ${finalCounts.brands}`)
    console.log(`Wrestlers: ${finalCounts.wrestlers}`)
    console.log(`Events: ${finalCounts.events}`)
    console.log(`Match Types: ${finalCounts.matchTypes}`)
    console.log(`Championships: ${finalCounts.championships}`)
  } catch (error) {
    console.error("❌ Critical error during import:", error)
  }
}

importCsvDataImproved()
