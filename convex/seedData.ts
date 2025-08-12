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

    // Create comprehensive WWE wrestlers (2025 roster)
    const wweWrestlers = [
      // Raw Men
      { name: "Cody Rhodes", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Seth Rollins", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Drew McIntyre", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "CM Punk", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Damian Priest", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Jey Uso", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Jimmy Uso", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Finn Balor", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "JD McDonagh", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Dominik Mysterio", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Rey Mysterio", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Chad Gable", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Otis", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Braun Strowman", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Bronson Reed", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Ilja Dragunov", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Pete Dunne", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Tyler Bate", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Kofi Kingston", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Xavier Woods", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "R-Truth", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "The Miz", brand_id: rawId, status: "Active" as const, gender: "Male" as const },
      { name: "Carlito", brand_id: rawId, status: "Active" as const, gender: "Male" as const },

      // Raw Women
      { name: "Rhea Ripley", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Liv Morgan", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Bianca Belair", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Shayna Baszler", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Zoey Stark", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Natalya", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Lyra Valkyria", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Zelina Vega", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Ivy Nile", brand_id: rawId, status: "Active" as const, gender: "Female" as const },
      { name: "Maxxine Dupri", brand_id: rawId, status: "Active" as const, gender: "Female" as const },

      // SmackDown Men
      { name: "Roman Reigns", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Solo Sikoa", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Jacob Fatu", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Tama Tonga", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Tonga Loa", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "LA Knight", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Kevin Owens", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Randy Orton", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Gunther", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Ludwig Kaiser", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Sheamus", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Apollo Crews", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Santos Escobar", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Andrade", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Shinsuke Nakamura", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },
      { name: "Carmelo Hayes", brand_id: smackdownId, status: "Active" as const, gender: "Male" as const },

      // SmackDown Women
      { name: "Bayley", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "IYO SKY", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Nia Jax", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Tiffany Stratton", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Jade Cargill", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Naomi", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Michin", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Chelsea Green", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },
      { name: "Piper Niven", brand_id: smackdownId, status: "Active" as const, gender: "Female" as const },

      // NXT Men
      { name: "Trick Williams", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Oba Femi", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Ethan Page", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Je'Von Evans", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Wes Lee", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Nathan Frazer", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Axiom", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Tony D'Angelo", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },
      { name: "Lexis King", brand_id: nxtId, status: "Active" as const, gender: "Male" as const },

      // NXT Women
      { name: "Roxanne Perez", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Giulia", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Stephanie Vaquer", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Cora Jade", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Kelani Jordan", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Sol Ruca", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Lash Legend", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },
      { name: "Jakara Jackson", brand_id: nxtId, status: "Active" as const, gender: "Female" as const },

      // Part-Time/Legends
      { name: "John Cena", brand_id: rawId, status: "Part-Time" as const, gender: "Male" as const },
      { name: "The Rock", brand_id: smackdownId, status: "Part-Time" as const, gender: "Male" as const },
      { name: "Brock Lesnar", brand_id: smackdownId, status: "Part-Time" as const, gender: "Male" as const },
      { name: "The Undertaker", brand_id: rawId, status: "Legend" as const, gender: "Male" as const },
      { name: "Triple H", brand_id: rawId, status: "Legend" as const, gender: "Male" as const },
      { name: "Shawn Michaels", brand_id: nxtId, status: "Legend" as const, gender: "Male" as const },
    ]

    for (const wrestler of wweWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
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

    // Create AEW Brands
    const dynamiteId = await ctx.db.insert("brands", {
      promotion_id: aewId,
      name: "Dynamite",
      color: "bg-yellow-600/20 border-yellow-500/30 text-yellow-400",
    })

    const rampageId = await ctx.db.insert("brands", {
      promotion_id: aewId,
      name: "Rampage",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
    })

    const collisionId = await ctx.db.insert("brands", {
      promotion_id: aewId,
      name: "Collision",
      color: "bg-blue-600/20 border-blue-500/30 text-blue-400",
    })

    // Create AEW wrestlers (2025 roster)
    const aewWrestlers = [
      // Main Event Stars
      { name: "Jon Moxley", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Will Ospreay", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Orange Cassidy", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "MJF", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Adam Cole", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Hangman Page", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Swerve Strickland", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Kazuchika Okada", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Kenny Omega", brand_id: dynamiteId, status: "Part-Time" as const, gender: "Male" as const },
      { name: "Chris Jericho", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Darby Allin", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "Konosuke Takeshita", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "The Young Bucks Matt", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },
      { name: "The Young Bucks Nick", brand_id: dynamiteId, status: "Active" as const, gender: "Male" as const },

      // Collision Stars
      { name: "Eddie Kingston", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Claudio Castagnoli", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Wheeler Yuta", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Daniel Garcia", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Kyle Fletcher", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Mark Briscoe", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "FTR Cash", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "FTR Dax", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Powerhouse Hobbs", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
      { name: "Ricky Starks", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },

      // Rampage Stars
      { name: "Jungle Boy", brand_id: rampageId, status: "Active" as const, gender: "Male" as const },
      { name: "Sammy Guevara", brand_id: rampageId, status: "Active" as const, gender: "Male" as const },
      { name: "Wardlow", brand_id: rampageId, status: "Active" as const, gender: "Male" as const },

      // Women's Division
      { name: "Toni Storm", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
      { name: "Mariah May", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
      { name: "Mercedes Mone", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
      { name: "Britt Baker", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
      { name: "Jamie Hayter", brand_id: dynamiteId, status: "Active" as const, gender: "Female" as const },
      { name: "Willow Nightingale", brand_id: collisionId, status: "Active" as const, gender: "Female" as const },
      { name: "Kris Statlander", brand_id: collisionId, status: "Active" as const, gender: "Female" as const },
      { name: "Thunder Rosa", brand_id: collisionId, status: "Active" as const, gender: "Female" as const },
      { name: "Hikaru Shida", brand_id: rampageId, status: "Active" as const, gender: "Female" as const },
      { name: "Ruby Soho", brand_id: rampageId, status: "Active" as const, gender: "Female" as const },
      { name: "Anna Jay", brand_id: collisionId, status: "Active" as const, gender: "Female" as const },
      { name: "Skye Blue", brand_id: rampageId, status: "Active" as const, gender: "Female" as const },

      // Legends
      { name: "Sting", brand_id: dynamiteId, status: "Legend" as const, gender: "Male" as const },
      { name: "Jeff Hardy", brand_id: dynamiteId, status: "Part-Time" as const, gender: "Male" as const },
      { name: "Matt Hardy", brand_id: dynamiteId, status: "Part-Time" as const, gender: "Male" as const },
      { name: "Christian Cage", brand_id: collisionId, status: "Active" as const, gender: "Male" as const },
    ]

    for (const wrestler of aewWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create NJPW
    const njpwId = await ctx.db.insert("promotions", {
      name: "NJPW",
      country_code: "JP",
      country_emoji: "🇯🇵",
      primary_color: "bg-gradient-to-r from-red-600 to-white",
      secondary_color: "bg-red-600/10 border-red-500/20",
      accent_color: "text-red-400 border-white/30",
    })

    const njpwStrongId = await ctx.db.insert("brands", {
      promotion_id: njpwId,
      name: "Strong",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
    })

    const njpwWorldId = await ctx.db.insert("brands", {
      promotion_id: njpwId,
      name: "World",
      color: "bg-white/20 border-white/30 text-white",
    })

    // Create NJPW wrestlers
    const njpwWrestlers = [
      { name: "Hiroshi Tanahashi", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Tetsuya Naito", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Shingo Takagi", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Sanada", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Evil", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Hiromu Takahashi", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Zack Sabre Jr", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Taichi", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Tomohiro Ishii", brand_id: njpwStrongId, status: "Active" as const, gender: "Male" as const },
      { name: "Juice Robinson", brand_id: njpwStrongId, status: "Active" as const, gender: "Male" as const },
      { name: "David Finlay", brand_id: njpwStrongId, status: "Active" as const, gender: "Male" as const },
      { name: "Taiji Ishimori", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "El Desperado", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Master Wato", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
      { name: "Toru Yano", brand_id: njpwWorldId, status: "Active" as const, gender: "Male" as const },
    ]

    for (const wrestler of njpwWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create TNA
    const tnaId = await ctx.db.insert("promotions", {
      name: "TNA",
      country_code: "US",
      country_emoji: "🇺🇸",
      primary_color: "bg-gradient-to-r from-blue-600 to-red-500",
      secondary_color: "bg-blue-600/10 border-blue-500/20",
      accent_color: "text-blue-400 border-red-500/30",
    })

    const impactId = await ctx.db.insert("brands", {
      promotion_id: tnaId,
      name: "Impact",
      color: "bg-blue-600/20 border-blue-500/30 text-blue-400",
    })

    // Create TNA wrestlers
    const tnaWrestlers = [
      { name: "Moose", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Nic Nemeth", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Joe Hendry", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Eddie Edwards", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Rich Swann", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Sami Callihan", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Jake Something", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Chris Sabin", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Alex Shelley", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Ace Austin", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "PCO", brand_id: impactId, status: "Active" as const, gender: "Male" as const },
      { name: "Jordynne Grace", brand_id: impactId, status: "Active" as const, gender: "Female" as const },
      { name: "Masha Slamovich", brand_id: impactId, status: "Active" as const, gender: "Female" as const },
      { name: "Rosemary", brand_id: impactId, status: "Active" as const, gender: "Female" as const },
      { name: "Alisha Edwards", brand_id: impactId, status: "Active" as const, gender: "Female" as const },
      { name: "Steph De Lander", brand_id: impactId, status: "Active" as const, gender: "Female" as const },
    ]

    for (const wrestler of tnaWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create STARDOM
    const stardomId = await ctx.db.insert("promotions", {
      name: "STARDOM",
      country_code: "JP",
      country_emoji: "🇯🇵",
      primary_color: "bg-gradient-to-r from-pink-500 to-purple-600",
      secondary_color: "bg-pink-600/10 border-pink-500/20",
      accent_color: "text-pink-400 border-purple-500/30",
    })

    const stardomMainId = await ctx.db.insert("brands", {
      promotion_id: stardomId,
      name: "Main Roster",
      color: "bg-pink-600/20 border-pink-500/30 text-pink-400",
    })

    // Create STARDOM wrestlers
    const stardomWrestlers = [
      { name: "Mayu Iwatani", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "Tam Nakano", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "Utami Hayashishita", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "Momo Watanabe", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "AZM", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "Starlight Kid", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "Hazuki", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
      { name: "Koguma", brand_id: stardomMainId, status: "Active" as const, gender: "Female" as const },
    ]

    for (const wrestler of stardomWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create GCW
    const gcwId = await ctx.db.insert("promotions", {
      name: "GCW",
      country_code: "US",
      country_emoji: "🇺🇸",
      primary_color: "bg-gradient-to-r from-black to-red-600",
      secondary_color: "bg-black/20 border-red-500/20",
      accent_color: "text-red-400 border-black/30",
    })

    const gcwMainId = await ctx.db.insert("brands", {
      promotion_id: gcwId,
      name: "Main Roster",
      color: "bg-red-600/20 border-red-500/30 text-red-400",
    })

    // Create GCW wrestlers
    const gcwWrestlers = [
      { name: "Matt Cardona", brand_id: gcwMainId, status: "Active" as const, gender: "Male" as const },
      { name: "Effy", brand_id: gcwMainId, status: "Active" as const, gender: "Male" as const },
      { name: "Josh Bishop", brand_id: gcwMainId, status: "Active" as const, gender: "Male" as const },
      { name: "Nick Gage", brand_id: gcwMainId, status: "Active" as const, gender: "Male" as const },
      { name: "Mance Warner", brand_id: gcwMainId, status: "Active" as const, gender: "Male" as const },
      { name: "Tony Deppen", brand_id: gcwMainId, status: "Active" as const, gender: "Male" as const },
    ]

    for (const wrestler of gcwWrestlers) {
      await ctx.db.insert("wrestlers", wrestler)
    }

    // Create comprehensive events for all promotions
    const allEvents = [
      // WWE Events
      { promotion_id: wweId, name: "Royal Rumble", is_ppv: true },
      { promotion_id: wweId, name: "Elimination Chamber", is_ppv: true },
      { promotion_id: wweId, name: "WrestleMania", is_ppv: true },
      { promotion_id: wweId, name: "Backlash", is_ppv: true },
      { promotion_id: wweId, name: "King of the Ring", is_ppv: true },
      { promotion_id: wweId, name: "Money in the Bank", is_ppv: true },
      { promotion_id: wweId, name: "SummerSlam", is_ppv: true },
      { promotion_id: wweId, name: "Clash at the Castle", is_ppv: true },
      { promotion_id: wweId, name: "Bad Blood", is_ppv: true },
      { promotion_id: wweId, name: "Crown Jewel", is_ppv: true },
      { promotion_id: wweId, name: "Survivor Series", is_ppv: true },
      { promotion_id: wweId, name: "Saturday Night's Main Event", is_ppv: true },
      { promotion_id: wweId, name: "Raw", is_ppv: false },
      { promotion_id: wweId, name: "SmackDown", is_ppv: false },
      { promotion_id: wweId, name: "NXT", is_ppv: false },

      // AEW Events
      { promotion_id: aewId, name: "Revolution", is_ppv: true },
      { promotion_id: aewId, name: "Double or Nothing", is_ppv: true },
      { promotion_id: aewId, name: "Forbidden Door", is_ppv: true },
      { promotion_id: aewId, name: "All Out", is_ppv: true },
      { promotion_id: aewId, name: "Full Gear", is_ppv: true },
      { promotion_id: aewId, name: "All In", is_ppv: true },
      { promotion_id: aewId, name: "Grand Slam", is_ppv: true },
      { promotion_id: aewId, name: "Winter is Coming", is_ppv: true },
      { promotion_id: aewId, name: "Dynamite", is_ppv: false },
      { promotion_id: aewId, name: "Rampage", is_ppv: false },
      { promotion_id: aewId, name: "Collision", is_ppv: false },

      // NJPW Events
      { promotion_id: njpwId, name: "Wrestle Kingdom", is_ppv: true },
      { promotion_id: njpwId, name: "New Beginning", is_ppv: true },
      { promotion_id: njpwId, name: "Sakura Genesis", is_ppv: true },
      { promotion_id: njpwId, name: "Wrestling Dontaku", is_ppv: true },
      { promotion_id: njpwId, name: "Best of the Super Juniors", is_ppv: true },
      { promotion_id: njpwId, name: "Dominion", is_ppv: true },
      { promotion_id: njpwId, name: "G1 Climax", is_ppv: true },
      { promotion_id: njpwId, name: "Royal Quest", is_ppv: true },
      { promotion_id: njpwId, name: "Destruction", is_ppv: true },
      { promotion_id: njpwId, name: "King of Pro Wrestling", is_ppv: true },
      { promotion_id: njpwId, name: "Power Struggle", is_ppv: true },
      { promotion_id: njpwId, name: "World Tag League", is_ppv: true },

      // TNA Events
      { promotion_id: tnaId, name: "Genesis", is_ppv: true },
      { promotion_id: tnaId, name: "No Surrender", is_ppv: true },
      { promotion_id: tnaId, name: "Rebellion", is_ppv: true },
      { promotion_id: tnaId, name: "Under Siege", is_ppv: true },
      { promotion_id: tnaId, name: "Slammiversary", is_ppv: true },
      { promotion_id: tnaId, name: "Emergence", is_ppv: true },
      { promotion_id: tnaId, name: "Victory Road", is_ppv: true },
      { promotion_id: tnaId, name: "Bound for Glory", is_ppv: true },
      { promotion_id: tnaId, name: "Turning Point", is_ppv: true },
      { promotion_id: tnaId, name: "Final Resolution", is_ppv: true },
      { promotion_id: tnaId, name: "Impact Wrestling", is_ppv: false },

      // STARDOM Events
      { promotion_id: stardomId, name: "New Year Stars", is_ppv: true },
      { promotion_id: stardomId, name: "Stardom Dream Queendom", is_ppv: true },
      { promotion_id: stardomId, name: "Golden Week", is_ppv: true },
      { promotion_id: stardomId, name: "5STAR Grand Prix", is_ppv: true },
      { promotion_id: stardomId, name: "Historic X-Over", is_ppv: true },

      // GCW Events
      { promotion_id: gcwId, name: "Tournament of Survival", is_ppv: true },
      { promotion_id: gcwId, name: "Collective", is_ppv: true },
      { promotion_id: gcwId, name: "Homecoming", is_ppv: true },
      { promotion_id: gcwId, name: "The Wrld on GCW", is_ppv: true },
    ]

    for (const event of allEvents) {
      await ctx.db.insert("events", event)
    }

    // Create comprehensive match types for all promotions
    const allMatchTypes = [
      // WWE Match Types
      {
        promotion_id: wweId,
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        promotion_id: wweId,
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "Fatal 4-Way",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "Men's Royal Rumble",
        default_participants: 30,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Male" as const,
      },
      {
        promotion_id: wweId,
        name: "Women's Royal Rumble",
        default_participants: 30,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Female" as const,
      },
      {
        promotion_id: wweId,
        name: "Men's Elimination Chamber",
        default_participants: 6,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Male" as const,
      },
      {
        promotion_id: wweId,
        name: "Women's Elimination Chamber",
        default_participants: 6,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Female" as const,
      },
      {
        promotion_id: wweId,
        name: "War Games",
        default_participants: 8,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 4,
      },
      {
        promotion_id: wweId,
        name: "Men's Money in the Bank Ladder Match",
        default_participants: 8,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Male" as const,
      },
      {
        promotion_id: wweId,
        name: "Women's Money in the Bank Ladder Match",
        default_participants: 8,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Female" as const,
      },
      {
        promotion_id: wweId,
        name: "Hell in a Cell",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "Steel Cage",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "Ladder Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "TLC Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "Last Man Standing",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: wweId,
        name: "I Quit Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },

      // AEW Match Types
      {
        promotion_id: aewId,
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        promotion_id: aewId,
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "Fatal 4-Way",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "Men's Casino Battle Royal",
        default_participants: 21,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Male" as const,
      },
      {
        promotion_id: aewId,
        name: "Women's Casino Battle Royal",
        default_participants: 21,
        is_single_winner: true,
        is_team_based: false,
        gender_filter: "Female" as const,
      },
      {
        promotion_id: aewId,
        name: "Stadium Stampede",
        default_participants: 8,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 4,
      },
      {
        promotion_id: aewId,
        name: "Lights Out Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "Steel Cage",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "Ladder Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "No Disqualification",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: aewId,
        name: "Barbed Wire Deathmatch",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },

      // NJPW Match Types
      {
        promotion_id: njpwId,
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: njpwId,
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        promotion_id: njpwId,
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: njpwId,
        name: "Fatal 4-Way",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: njpwId,
        name: "Battle Royal",
        default_participants: 20,
        is_single_winner: true,
        is_team_based: false,
      },
      {
        promotion_id: njpwId,
        name: "Lumberjack Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: njpwId,
        name: "No Disqualification",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },

      // TNA Match Types
      {
        promotion_id: tnaId,
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: tnaId,
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        promotion_id: tnaId,
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: tnaId,
        name: "Ultimate X Match",
        default_participants: 6,
        is_single_winner: true,
        is_team_based: false,
      },
      {
        promotion_id: tnaId,
        name: "King of the Mountain",
        default_participants: 5,
        is_single_winner: true,
        is_team_based: false,
      },
      {
        promotion_id: tnaId,
        name: "Monster's Ball",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: tnaId,
        name: "Six Sides of Steel",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },

      // STARDOM Match Types
      {
        promotion_id: stardomId,
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: stardomId,
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        promotion_id: stardomId,
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: stardomId,
        name: "Fatal 4-Way",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: stardomId,
        name: "Battle Royal",
        default_participants: 20,
        is_single_winner: true,
        is_team_based: false,
      },

      // GCW Match Types
      {
        promotion_id: gcwId,
        name: "Singles Match",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: gcwId,
        name: "Tag Team Match",
        default_participants: 4,
        is_single_winner: false,
        is_team_based: true,
        teams_count: 2,
        players_per_team: 2,
      },
      {
        promotion_id: gcwId,
        name: "Triple Threat",
        default_participants: 3,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: gcwId,
        name: "Deathmatch",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
      {
        promotion_id: gcwId,
        name: "No Disqualification",
        default_participants: 2,
        is_single_winner: false,
        is_team_based: false,
      },
    ]

    for (const matchType of allMatchTypes) {
      await ctx.db.insert("match_types", matchType)
    }

    // Create comprehensive championships for all promotions
    const allChampionships = [
      // WWE Championships
      { promotion_id: wweId, name: "WWE Championship", is_active: true },
      { promotion_id: wweId, name: "World Heavyweight Championship", is_active: true },
      { promotion_id: wweId, name: "Women's World Championship", is_active: true },
      { promotion_id: wweId, name: "WWE Women's Championship", is_active: true },
      { promotion_id: wweId, name: "Intercontinental Championship", is_active: true },
      { promotion_id: wweId, name: "United States Championship", is_active: true },
      { promotion_id: wweId, name: "WWE Tag Team Championship", is_active: true },
      { promotion_id: wweId, name: "World Tag Team Championship", is_active: true },
      { promotion_id: wweId, name: "Women's Tag Team Championship", is_active: true },
      { promotion_id: wweId, name: "NXT Championship", is_active: true },
      { promotion_id: wweId, name: "NXT Women's Championship", is_active: true },
      { promotion_id: wweId, name: "NXT North American Championship", is_active: true },
      { promotion_id: wweId, name: "NXT Tag Team Championship", is_active: true },

      // AEW Championships
      { promotion_id: aewId, name: "AEW World Championship", is_active: true },
      { promotion_id: aewId, name: "AEW Women's World Championship", is_active: true },
      { promotion_id: aewId, name: "AEW International Championship", is_active: true },
      { promotion_id: aewId, name: "AEW Continental Championship", is_active: true },
      { promotion_id: aewId, name: "AEW TNT Championship", is_active: true },
      { promotion_id: aewId, name: "AEW TBS Championship", is_active: true },
      { promotion_id: aewId, name: "AEW World Tag Team Championship", is_active: true },
      { promotion_id: aewId, name: "ROH World Championship", is_active: true },
      { promotion_id: aewId, name: "ROH Women's World Championship", is_active: true },

      // NJPW Championships
      { promotion_id: njpwId, name: "IWGP World Heavyweight Championship", is_active: true },
      { promotion_id: njpwId, name: "IWGP United States Heavyweight Championship", is_active: true },
      { promotion_id: njpwId, name: "IWGP Junior Heavyweight Championship", is_active: true },
      { promotion_id: njpwId, name: "IWGP Tag Team Championship", is_active: true },
      { promotion_id: njpwId, name: "IWGP Junior Heavyweight Tag Team Championship", is_active: true },
      { promotion_id: njpwId, name: "NEVER Openweight Championship", is_active: true },
      { promotion_id: njpwId, name: "NEVER Openweight 6-Man Tag Team Championship", is_active: true },

      // TNA Championships
      { promotion_id: tnaId, name: "TNA World Championship", is_active: true },
      { promotion_id: tnaId, name: "TNA Knockouts World Championship", is_active: true },
      { promotion_id: tnaId, name: "TNA X-Division Championship", is_active: true },
      { promotion_id: tnaId, name: "TNA World Tag Team Championship", is_active: true },
      { promotion_id: tnaId, name: "TNA Knockouts Tag Team Championship", is_active: true },

      // STARDOM Championships
      { promotion_id: stardomId, name: "World of Stardom Championship", is_active: true },
      { promotion_id: stardomId, name: "Wonder of Stardom Championship", is_active: true },
      { promotion_id: stardomId, name: "SWA World Championship", is_active: true },
      { promotion_id: stardomId, name: "Goddess of Stardom Championship", is_active: true },
      { promotion_id: stardomId, name: "Artist of Stardom Championship", is_active: true },

      // GCW Championships
      { promotion_id: gcwId, name: "GCW World Championship", is_active: true },
      { promotion_id: gcwId, name: "GCW Ultraviolent Championship", is_active: true },
      { promotion_id: gcwId, name: "GCW Tag Team Championship", is_active: true },
    ]

    for (const championship of allChampionships) {
      await ctx.db.insert("championships", championship)
    }

    return {
      message:
        "Comprehensive 2025 wrestling data seeded successfully with 6 promotions, multiple brands, hundreds of wrestlers, events, match types, and championships!",
    }
  },
})
