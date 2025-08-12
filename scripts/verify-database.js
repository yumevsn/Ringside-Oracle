import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api.js"

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

async function verifyDatabase() {
  console.log("🔍 Verifying database contents...")

  try {
    // Get data counts
    const counts = await client.query(api.wrestling.getDataCounts)
    console.log("📊 Database Counts:")
    console.log(`- Promotions: ${counts.promotions}`)
    console.log(`- Brands: ${counts.brands}`)
    console.log(`- Wrestlers: ${counts.wrestlers}`)
    console.log(`- Events: ${counts.events}`)
    console.log(`- Match Types: ${counts.matchTypes}`)
    console.log(`- Championships: ${counts.championships}`)

    // Get sample data
    const promotions = await client.query(api.wrestling.getPromotions)
    console.log("\n🏢 Sample Promotions:")
    promotions.slice(0, 3).forEach((p) => {
      console.log(`- ${p.country_emoji} ${p.name} ${p.logo_url ? "(with logo)" : "(no logo)"}`)
    })

    if (promotions.length > 0) {
      const firstPromotion = promotions[0]
      const brands = await client.query(api.wrestling.getBrandsByPromotion, {
        promotionId: firstPromotion._id,
      })
      console.log(`\n🏷️ Brands for ${firstPromotion.name}:`)
      brands.forEach((b) => {
        console.log(`- ${b.name} ${b.logo_url ? "(with logo)" : "(no logo)"}`)
      })

      if (brands.length > 0) {
        const wrestlers = await client.query(api.wrestling.getWrestlersByPromotion, {
          promotionId: firstPromotion._id,
        })
        console.log(`\n🤼 Sample Wrestlers for ${firstPromotion.name}:`)
        wrestlers.slice(0, 5).forEach((w) => {
          console.log(`- ${w.name} (${w.brand_name}) ${w.image_url ? "(with image)" : "(no image)"}`)
        })
      }

      const events = await client.query(api.wrestling.getEventsByPromotion, {
        promotionId: firstPromotion._id,
      })
      console.log(`\n🎪 Events for ${firstPromotion.name}:`)
      events.forEach((e) => {
        console.log(`- ${e.name} ${e.is_ppv ? "(PPV)" : "(TV)"} ${e.logo_url ? "(with logo)" : "(no logo)"}`)
      })

      const championships = await client.query(api.wrestling.getChampionshipsByPromotion, {
        promotionId: firstPromotion._id,
      })
      console.log(`\n🏆 Championships for ${firstPromotion.name}:`)
      championships.forEach((c) => {
        console.log(`- ${c.name} ${c.belt_image_url ? "(with belt image)" : "(no belt image)"}`)
      })
    }

    console.log("\n✅ Database verification completed!")
  } catch (error) {
    console.error("❌ Error verifying database:", error)
  }
}

verifyDatabase()
