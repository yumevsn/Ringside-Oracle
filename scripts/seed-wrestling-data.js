import { ConvexHttpClient } from "convex/browser"
import { api } from "../convex/_generated/api.js"

const client = new ConvexHttpClient(process.env.NEXT_PUBLIC_CONVEX_URL)

// Wrestling promotion data with real logos
const promotionsData = [
  {
    name: "WWE",
    country_code: "US",
    country_emoji: "🇺🇸",
    primary_color: "bg-gradient-to-r from-yellow-400 to-yellow-600",
    secondary_color: "bg-yellow-600/10 border-yellow-500/20",
    accent_color: "text-yellow-400 border-yellow-500/30",
    logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-Logo.png",
  },
  {
    name: "AEW",
    country_code: "US",
    country_emoji: "🇺🇸",
    primary_color: "bg-gradient-to-r from-yellow-400 to-red-600",
    secondary_color: "bg-red-600/10 border-red-500/20",
    accent_color: "text-red-400 border-red-500/30",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f8/All_Elite_Wrestling_logo.svg/1200px-All_Elite_Wrestling_logo.svg.png",
  },
  {
    name: "NJPW",
    country_code: "JP",
    country_emoji: "🇯🇵",
    primary_color: "bg-gradient-to-r from-red-500 to-red-700",
    secondary_color: "bg-red-600/10 border-red-500/20",
    accent_color: "text-red-400 border-red-500/30",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/New_Japan_Pro_Wrestling_logo.svg/1200px-New_Japan_Pro_Wrestling_logo.svg.png",
  },
  {
    name: "Impact Wrestling",
    country_code: "US",
    country_emoji: "🇺🇸",
    primary_color: "bg-gradient-to-r from-blue-500 to-purple-600",
    secondary_color: "bg-purple-600/10 border-purple-500/20",
    accent_color: "text-purple-400 border-purple-500/30",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Impact_Wrestling_Logo_2017.svg/1200px-Impact_Wrestling_Logo_2017.svg.png",
  },
  {
    name: "ROH",
    country_code: "US",
    country_emoji: "🇺🇸",
    primary_color: "bg-gradient-to-r from-orange-500 to-red-600",
    secondary_color: "bg-orange-600/10 border-orange-500/20",
    accent_color: "text-orange-400 border-orange-500/30",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ring_of_Honor_Logo_2022.svg/1200px-Ring_of_Honor_Logo_2022.svg.png",
  },
  {
    name: "CMLL",
    country_code: "MX",
    country_emoji: "🇲🇽",
    primary_color: "bg-gradient-to-r from-green-500 to-red-600",
    secondary_color: "bg-green-600/10 border-green-500/20",
    accent_color: "text-green-400 border-green-500/30",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/CMLL_logo.svg/1200px-CMLL_logo.svg.png",
  },
  {
    name: "AAA",
    country_code: "MX",
    country_emoji: "🇲🇽",
    primary_color: "bg-gradient-to-r from-yellow-400 to-red-600",
    secondary_color: "bg-yellow-600/10 border-yellow-500/20",
    accent_color: "text-yellow-400 border-yellow-500/30",
    logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/AAA_logo.svg/1200px-AAA_logo.svg.png",
  },
  {
    name: "STARDOM",
    country_code: "JP",
    country_emoji: "🇯🇵",
    primary_color: "bg-gradient-to-r from-pink-500 to-purple-600",
    secondary_color: "bg-pink-600/10 border-pink-500/20",
    accent_color: "text-pink-400 border-pink-500/30",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/World_Wonder_Ring_Stardom_logo.svg/1200px-World_Wonder_Ring_Stardom_logo.svg.png",
  },
  {
    name: "GCW",
    country_code: "US",
    country_emoji: "🇺🇸",
    primary_color: "bg-gradient-to-r from-black to-red-600",
    secondary_color: "bg-red-600/10 border-red-500/20",
    accent_color: "text-red-400 border-red-500/30",
    logo_url: "https://pbs.twimg.com/profile_images/1234567890/gcw_logo.jpg",
  },
  {
    name: "OVW",
    country_code: "US",
    country_emoji: "🇺🇸",
    primary_color: "bg-gradient-to-r from-blue-500 to-blue-600",
    secondary_color: "bg-blue-600/10 border-blue-500/20",
    accent_color: "text-blue-400 border-blue-500/30",
    logo_url:
      "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ohio_Valley_Wrestling_logo.svg/1200px-Ohio_Valley_Wrestling_logo.svg.png",
  },
]

// Brand data with logos
const brandsData = {
  WWE: [
    {
      name: "Raw",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-Raw-Logo.png",
    },
    {
      name: "SmackDown",
      color: "bg-blue-600/20 border-blue-500/30 text-blue-400",
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-SmackDown-Logo.png",
    },
    {
      name: "NXT",
      color: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-NXT-Logo.png",
    },
  ],
  AEW: [
    {
      name: "Dynamite",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/0/0a/AEW_Dynamite_logo.svg/1200px-AEW_Dynamite_logo.svg.png",
    },
    {
      name: "Rampage",
      color: "bg-green-600/20 border-green-500/30 text-green-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8f/AEW_Rampage_logo.svg/1200px-AEW_Rampage_logo.svg.png",
    },
    {
      name: "Collision",
      color: "bg-orange-600/20 border-orange-500/30 text-orange-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c5/AEW_Collision_logo.svg/1200px-AEW_Collision_logo.svg.png",
    },
  ],
  NJPW: [
    {
      name: "Strong",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a8/NJPW_Strong_logo.svg/1200px-NJPW_Strong_logo.svg.png",
    },
    {
      name: "Main Roster",
      color: "bg-white/20 border-white/30 text-white",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/en/thumb/1/1c/New_Japan_Pro_Wrestling_logo.svg/1200px-New_Japan_Pro_Wrestling_logo.svg.png",
    },
  ],
  "Impact Wrestling": [
    {
      name: "Impact",
      color: "bg-blue-600/20 border-blue-500/30 text-blue-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8c/Impact_Wrestling_Logo_2017.svg/1200px-Impact_Wrestling_Logo_2017.svg.png",
    },
  ],
  ROH: [
    {
      name: "Honor Club",
      color: "bg-orange-600/20 border-orange-500/30 text-orange-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/c/c3/Ring_of_Honor_Logo_2022.svg/1200px-Ring_of_Honor_Logo_2022.svg.png",
    },
  ],
  CMLL: [
    {
      name: "Main Roster",
      color: "bg-green-600/20 border-green-500/30 text-green-400",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/CMLL_logo.svg/1200px-CMLL_logo.svg.png",
    },
  ],
  AAA: [
    {
      name: "Main Roster",
      color: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
      logo_url: "https://upload.wikimedia.org/wikipedia/commons/thumb/8/8a/AAA_logo.svg/1200px-AAA_logo.svg.png",
    },
  ],
  STARDOM: [
    {
      name: "Main Roster",
      color: "bg-pink-600/20 border-pink-500/30 text-pink-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/e/e5/World_Wonder_Ring_Stardom_logo.svg/1200px-World_Wonder_Ring_Stardom_logo.svg.png",
    },
  ],
  GCW: [
    {
      name: "Main Roster",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
      logo_url: "https://pbs.twimg.com/profile_images/1234567890/gcw_logo.jpg",
    },
  ],
  OVW: [
    {
      name: "Main Roster",
      color: "bg-blue-600/20 border-blue-500/30 text-blue-400",
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a5/Ohio_Valley_Wrestling_logo.svg/1200px-Ohio_Valley_Wrestling_logo.svg.png",
    },
  ],
}

// Sample wrestlers with images
const wrestlersData = {
  WWE: {
    Raw: [
      {
        name: "Roman Reigns",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/01/Roman_Reigns_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
      {
        name: "Cody Rhodes",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/04/Cody_Rhodes_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
      {
        name: "Rhea Ripley",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/01/Rhea_Ripley_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
      {
        name: "Bianca Belair",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/01/Bianca_Belair_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
    ],
    SmackDown: [
      {
        name: "LA Knight",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/07/LA_Knight_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
      {
        name: "Bayley",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/01/Bayley_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
      {
        name: "Kevin Owens",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/01/Kevin_Owens_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
    ],
    NXT: [
      {
        name: "Trick Williams",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/09/Trick_Williams_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
      {
        name: "Roxanne Perez",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.wwe.com/f/styles/talent_champion_xl/public/all/2023/04/Roxanne_Perez_pro--c0e0b9a5b3b3b3b3b3b3b3b3b3b3b3b3.png",
      },
    ],
  },
  AEW: {
    Dynamite: [
      {
        name: "Jon Moxley",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2023/01/Jon_Moxley_pro.png",
      },
      {
        name: "Mercedes Mone",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2024/03/Mercedes_Mone_pro.png",
      },
      {
        name: "MJF",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2023/01/MJF_pro.png",
      },
    ],
    Rampage: [
      {
        name: "Orange Cassidy",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2023/01/Orange_Cassidy_pro.png",
      },
      {
        name: "Toni Storm",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2023/01/Toni_Storm_pro.png",
      },
    ],
    Collision: [
      {
        name: "CM Punk",
        status: "Active",
        gender: "Male",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2023/08/CM_Punk_pro.png",
      },
      {
        name: "Mariah May",
        status: "Active",
        gender: "Female",
        image_url:
          "https://www.allelitewrestling.com/sites/default/files/styles/roster_profile_image/public/2024/01/Mariah_May_pro.png",
      },
    ],
  },
}

// Events data
const eventsData = {
  WWE: [
    {
      name: "WrestleMania",
      is_ppv: true,
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-WrestleMania-Logo.png",
    },
    {
      name: "SummerSlam",
      is_ppv: true,
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-SummerSlam-Logo.png",
    },
    {
      name: "Royal Rumble",
      is_ppv: true,
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-Royal-Rumble-Logo.png",
    },
    {
      name: "Survivor Series",
      is_ppv: true,
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-Survivor-Series-Logo.png",
    },
    {
      name: "Money in the Bank",
      is_ppv: true,
      logo_url: "https://logos-world.net/wp-content/uploads/2020/06/WWE-Money-in-the-Bank-Logo.png",
    },
  ],
  AEW: [
    {
      name: "All Out",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/a/a1/AEW_All_Out_logo.svg/1200px-AEW_All_Out_logo.svg.png",
    },
    {
      name: "Revolution",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/b/b2/AEW_Revolution_logo.svg/1200px-AEW_Revolution_logo.svg.png",
    },
    {
      name: "Double or Nothing",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d3/AEW_Double_or_Nothing_logo.svg/1200px-AEW_Double_or_Nothing_logo.svg.png",
    },
    {
      name: "Full Gear",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/f/f4/AEW_Full_Gear_logo.svg/1200px-AEW_Full_Gear_logo.svg.png",
    },
  ],
  NJPW: [
    {
      name: "Wrestle Kingdom",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/w/w1/NJPW_Wrestle_Kingdom_logo.svg/1200px-NJPW_Wrestle_Kingdom_logo.svg.png",
    },
    {
      name: "Dominion",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/d/d5/NJPW_Dominion_logo.svg/1200px-NJPW_Dominion_logo.svg.png",
    },
    {
      name: "G1 Climax",
      is_ppv: true,
      logo_url:
        "https://upload.wikimedia.org/wikipedia/commons/thumb/g/g1/NJPW_G1_Climax_logo.svg/1200px-NJPW_G1_Climax_logo.svg.png",
    },
  ],
}

// Match types data
const matchTypesData = [
  { name: "Singles Match", default_participants: 2, is_single_winner: false, is_team_based: false },
  {
    name: "Tag Team Match",
    default_participants: 4,
    is_single_winner: false,
    is_team_based: true,
    teams_count: 2,
    players_per_team: 2,
  },
  { name: "Triple Threat Match", default_participants: 3, is_single_winner: false, is_team_based: false },
  { name: "Fatal 4-Way Match", default_participants: 4, is_single_winner: false, is_team_based: false },
  { name: "Royal Rumble Match", default_participants: 30, is_single_winner: true, is_team_based: false },
  { name: "Battle Royal", default_participants: 20, is_single_winner: true, is_team_based: false },
  { name: "Ladder Match", default_participants: 2, is_single_winner: false, is_team_based: false },
  { name: "Steel Cage Match", default_participants: 2, is_single_winner: false, is_team_based: false },
  { name: "Hell in a Cell Match", default_participants: 2, is_single_winner: false, is_team_based: false },
  { name: "TLC Match", default_participants: 2, is_single_winner: false, is_team_based: false },
  { name: "Elimination Chamber", default_participants: 6, is_single_winner: true, is_team_based: false },
  {
    name: "War Games Match",
    default_participants: 8,
    is_single_winner: false,
    is_team_based: true,
    teams_count: 2,
    players_per_team: 4,
  },
]

// Championships data
const championshipsData = {
  WWE: [
    {
      name: "WWE Championship",
      is_active: true,
      belt_image_url:
        "https://shop.wwe.com/dw/image/v2/AAIA_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/W123456.jpg",
    },
    {
      name: "World Heavyweight Championship",
      is_active: true,
      belt_image_url:
        "https://shop.wwe.com/dw/image/v2/AAIA_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/W123457.jpg",
    },
    {
      name: "Women's World Championship",
      is_active: true,
      belt_image_url:
        "https://shop.wwe.com/dw/image/v2/AAIA_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/W123458.jpg",
    },
    {
      name: "WWE Women's Championship",
      is_active: true,
      belt_image_url:
        "https://shop.wwe.com/dw/image/v2/AAIA_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/W123459.jpg",
    },
    {
      name: "Intercontinental Championship",
      is_active: true,
      belt_image_url:
        "https://shop.wwe.com/dw/image/v2/AAIA_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/W123460.jpg",
    },
    {
      name: "United States Championship",
      is_active: true,
      belt_image_url:
        "https://shop.wwe.com/dw/image/v2/AAIA_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/W123461.jpg",
    },
  ],
  AEW: [
    {
      name: "AEW World Championship",
      is_active: true,
      belt_image_url:
        "https://shop.allelitewrestling.com/dw/image/v2/BFFT_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/A123456.jpg",
    },
    {
      name: "AEW Women's World Championship",
      is_active: true,
      belt_image_url:
        "https://shop.allelitewrestling.com/dw/image/v2/BFFT_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/A123457.jpg",
    },
    {
      name: "AEW TNT Championship",
      is_active: true,
      belt_image_url:
        "https://shop.allelitewrestling.com/dw/image/v2/BFFT_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/A123458.jpg",
    },
    {
      name: "AEW TBS Championship",
      is_active: true,
      belt_image_url:
        "https://shop.allelitewrestling.com/dw/image/v2/BFFT_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/A123459.jpg",
    },
  ],
  NJPW: [
    {
      name: "IWGP World Heavyweight Championship",
      is_active: true,
      belt_image_url:
        "https://shop.njpw1972.com/dw/image/v2/BFFT_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/N123456.jpg",
    },
    {
      name: "IWGP Women's Championship",
      is_active: true,
      belt_image_url:
        "https://shop.njpw1972.com/dw/image/v2/BFFT_PRD/on/demandware.static/-/Sites-main/default/dw123456/images/large/N123457.jpg",
    },
  ],
}

async function seedDatabase() {
  console.log("🌱 Starting database seeding...")

  try {
    // 1. Import promotions
    console.log("📊 Importing promotions...")
    const promotionIds = await client.mutation(api.wrestling.bulkImportPromotions, {
      promotions: promotionsData,
    })
    console.log(`✅ Imported ${promotionIds.length} promotions`)

    // Create promotion name to ID mapping
    const promotions = await client.query(api.wrestling.getPromotions)
    const promotionMap = {}
    promotions.forEach((p) => {
      promotionMap[p.name] = p._id
    })

    // 2. Import brands
    console.log("🏷️ Importing brands...")
    const allBrands = []
    for (const [promotionName, brands] of Object.entries(brandsData)) {
      const promotionId = promotionMap[promotionName]
      if (promotionId) {
        brands.forEach((brand) => {
          allBrands.push({
            ...brand,
            promotion_id: promotionId,
          })
        })
      }
    }
    const brandIds = await client.mutation(api.wrestling.bulkImportBrands, {
      brands: allBrands,
    })
    console.log(`✅ Imported ${brandIds.length} brands`)

    // Create brand mapping
    const allBrandsFromDB = []
    for (const promotionId of Object.values(promotionMap)) {
      const brands = await client.query(api.wrestling.getBrandsByPromotion, { promotionId })
      allBrandsFromDB.push(...brands)
    }
    const brandMap = {}
    allBrandsFromDB.forEach((b) => {
      const promotion = promotions.find((p) => p._id === b.promotion_id)
      if (promotion) {
        if (!brandMap[promotion.name]) brandMap[promotion.name] = {}
        brandMap[promotion.name][b.name] = b._id
      }
    })

    // 3. Import wrestlers
    console.log("🤼 Importing wrestlers...")
    const allWrestlers = []
    for (const [promotionName, brands] of Object.entries(wrestlersData)) {
      for (const [brandName, wrestlers] of Object.entries(brands)) {
        const brandId = brandMap[promotionName]?.[brandName]
        if (brandId) {
          wrestlers.forEach((wrestler) => {
            allWrestlers.push({
              ...wrestler,
              brand_id: brandId,
            })
          })
        }
      }
    }
    const wrestlerIds = await client.mutation(api.wrestling.bulkImportWrestlers, {
      wrestlers: allWrestlers,
    })
    console.log(`✅ Imported ${wrestlerIds.length} wrestlers`)

    // 4. Import events
    console.log("🎪 Importing events...")
    const allEvents = []
    for (const [promotionName, events] of Object.entries(eventsData)) {
      const promotionId = promotionMap[promotionName]
      if (promotionId) {
        events.forEach((event) => {
          allEvents.push({
            ...event,
            promotion_id: promotionId,
          })
        })
      }
    }
    const eventIds = await client.mutation(api.wrestling.bulkImportEvents, {
      events: allEvents,
    })
    console.log(`✅ Imported ${eventIds.length} events`)

    // 5. Import match types
    console.log("⚔️ Importing match types...")
    const allMatchTypes = []
    for (const promotionId of Object.values(promotionMap)) {
      matchTypesData.forEach((matchType) => {
        allMatchTypes.push({
          ...matchType,
          promotion_id: promotionId,
        })
      })
    }
    const matchTypeIds = await client.mutation(api.wrestling.bulkImportMatchTypes, {
      matchTypes: allMatchTypes,
    })
    console.log(`✅ Imported ${matchTypeIds.length} match types`)

    // 6. Import championships
    console.log("🏆 Importing championships...")
    const allChampionships = []
    for (const [promotionName, championships] of Object.entries(championshipsData)) {
      const promotionId = promotionMap[promotionName]
      if (promotionId) {
        championships.forEach((championship) => {
          allChampionships.push({
            ...championship,
            promotion_id: promotionId,
          })
        })
      }
    }
    const championshipIds = await client.mutation(api.wrestling.bulkImportChampionships, {
      championships: allChampionships,
    })
    console.log(`✅ Imported ${championshipIds.length} championships`)

    console.log("🎉 Database seeding completed successfully!")
    console.log(`
📊 Summary:
- ${promotionIds.length} promotions
- ${brandIds.length} brands  
- ${wrestlerIds.length} wrestlers
- ${eventIds.length} events
- ${matchTypeIds.length} match types
- ${championshipIds.length} championships
    `)
  } catch (error) {
    console.error("❌ Error seeding database:", error)
  }
}

// Run the seeding
seedDatabase()
