import { mutation, action } from "./_generated/server";
import { internal } from "./_generated/api";
import { v } from "convex/values";
import { query } from "./_generated/server";

// Clear all data from the database
export const clearAllData = mutation({
  args: {},
  handler: async (ctx) => {
    console.log("Clearing all data from database...");

    // Delete in reverse order of dependencies
    const wrestlers = await ctx.db.query("wrestlers").collect();
    for (const wrestler of wrestlers) {
      await ctx.db.delete(wrestler._id);
    }

    const championships = await ctx.db.query("championships").collect();
    for (const championship of championships) {
      await ctx.db.delete(championship._id);
    }

    const matchTypes = await ctx.db.query("match_types").collect();
    for (const matchType of matchTypes) {
      await ctx.db.delete(matchType._id);
    }

    const events = await ctx.db.query("events").collect();
    for (const event of events) {
      await ctx.db.delete(event._id);
    }

    const brands = await ctx.db.query("brands").collect();
    for (const brand of brands) {
      await ctx.db.delete(brand._id);
    }

    const promotions = await ctx.db.query("promotions").collect();
    for (const promotion of promotions) {
      await ctx.db.delete(promotion._id);
    }

    console.log("All data cleared successfully!");
    return {
      message: "Database cleared",
      deleted: {
        wrestlers: wrestlers.length,
        championships: championships.length,
        matchTypes: matchTypes.length,
        events: events.length,
        brands: brands.length,
        promotions: promotions.length,
      },
    };
  },
});

// Helper query to check existing data
export const checkExistingData = query({
  args: {},
  handler: async (ctx) => {
    const promotions = await ctx.db.query("promotions").collect();
    return promotions.length;
  },
});

// Seed initial data
export const seedInitialData = action({
  args: {},
  handler: async (ctx) => {
    // Check if data already exists
    const existingPromotions = await ctx.runQuery(
      internal.seedData.checkExistingData,
    );
    if (existingPromotions > 0) {
      return {
        message:
          "Data already exists, skipping seed. Use clearAndReseed to force reseed.",
        promotions: existingPromotions,
      };
    }

    try {
      console.log("Starting data seeding...");

      // Create promotions
      const wweId = await ctx.runMutation(internal.seedData.insertInitialData, {
        promotions: [
          {
            name: "WWE",
            country_code: "US",
            country_emoji: "🇺🇸",
            primary_color: "#D4001F",
            secondary_color: "#000000",
            accent_color: "#FFFFFF",
          },
        ],
        brands: [],
        wrestlers: [],
        events: [],
        matchTypes: [],
        championships: [],
      });

      // Create brands for WWE
      const brandsData = [
        {
          promotion_id: wweId.promotionIds[0],
          name: "RAW",
          color: "#FF0000",
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "SmackDown",
          color: "#0000FF",
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "NXT",
          color: "#FFD700",
        },
      ];

      const brandResult = await ctx.runMutation(
        internal.seedData.insertInitialData,
        {
          promotions: [],
          brands: brandsData,
          wrestlers: [],
          events: [],
          matchTypes: [],
          championships: [],
        },
      );

      // Create wrestlers
      const wrestlersData = [
        {
          name: "Roman Reigns",
          brand_id: brandResult.brandIds[1], // SmackDown
          status: "Active",
          gender: "Male",
        },
        {
          name: "Seth Rollins",
          brand_id: brandResult.brandIds[0], // RAW
          status: "Active",
          gender: "Male",
        },
        {
          name: "Becky Lynch",
          brand_id: brandResult.brandIds[0], // RAW
          status: "Active",
          gender: "Female",
        },
        {
          name: "Charlotte Flair",
          brand_id: brandResult.brandIds[1], // SmackDown
          status: "Active",
          gender: "Female",
        },
      ];

      // Create events
      const eventsData = [
        {
          promotion_id: wweId.promotionIds[0],
          name: "WrestleMania",
          is_ppv: true,
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "Royal Rumble",
          is_ppv: true,
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "SummerSlam",
          is_ppv: true,
        },
      ];

      // Create match types
      const matchTypesData = [
        {
          promotion_id: wweId.promotionIds[0],
          name: "Singles Match",
          default_participants: 2,
          is_single_winner: true,
          is_team_based: false,
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "Tag Team Match",
          default_participants: 4,
          is_single_winner: false,
          is_team_based: true,
          teams_count: 2,
          players_per_team: 2,
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "Triple Threat",
          default_participants: 3,
          is_single_winner: true,
          is_team_based: false,
        },
      ];

      // Create championships
      const championshipsData = [
        {
          promotion_id: wweId.promotionIds[0],
          name: "WWE Universal Championship",
          is_active: true,
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "WWE Raw Women's Championship",
          is_active: true,
        },
        {
          promotion_id: wweId.promotionIds[0],
          name: "WWE Tag Team Championships",
          is_active: true,
        },
      ];

      // Insert remaining data
      await ctx.runMutation(internal.seedData.insertInitialData, {
        promotions: [],
        brands: [],
        wrestlers: wrestlersData,
        events: eventsData,
        matchTypes: matchTypesData,
        championships: championshipsData,
      });

      return {
        success: true,
        message: "Successfully seeded initial wrestling data!",
        counts: {
          promotions: 1,
          brands: brandsData.length,
          wrestlers: wrestlersData.length,
          events: eventsData.length,
          matchTypes: matchTypesData.length,
          championships: championshipsData.length,
        },
      };
    } catch (error) {
      console.error("Error seeding data:", error);
      return {
        success: false,
        message: "Error seeding data",
        error: error instanceof Error ? error.message : "Unknown error",
      };
    }
  },
});

// Internal mutation to insert data
export const insertInitialData = mutation({
  args: {
    promotions: v.array(
      v.object({
        name: v.string(),
        country_code: v.string(),
        country_emoji: v.string(),
        primary_color: v.string(),
        secondary_color: v.string(),
        accent_color: v.string(),
      }),
    ),
    brands: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        color: v.string(),
      }),
    ),
    wrestlers: v.array(
      v.object({
        name: v.string(),
        brand_id: v.id("brands"),
        status: v.union(
          v.literal("Active"),
          v.literal("Part-Time"),
          v.literal("Legend"),
          v.literal("Inactive"),
        ),
        gender: v.union(v.literal("Male"), v.literal("Female")),
      }),
    ),
    events: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        is_ppv: v.boolean(),
      }),
    ),
    matchTypes: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        default_participants: v.number(),
        is_single_winner: v.boolean(),
        is_team_based: v.boolean(),
        teams_count: v.optional(v.number()),
        players_per_team: v.optional(v.number()),
        gender_filter: v.optional(
          v.union(v.literal("Male"), v.literal("Female")),
        ),
      }),
    ),
    championships: v.array(
      v.object({
        promotion_id: v.id("promotions"),
        name: v.string(),
        is_active: v.boolean(),
      }),
    ),
  },
  handler: async (ctx, args) => {
    const promotionIds = [];
    const brandIds = [];

    // Insert promotions
    for (const promotion of args.promotions) {
      const id = await ctx.db.insert("promotions", promotion);
      promotionIds.push(id);
    }

    // Insert brands
    for (const brand of args.brands) {
      const id = await ctx.db.insert("brands", brand);
      brandIds.push(id);
    }

    // Insert wrestlers
    for (const wrestler of args.wrestlers) {
      await ctx.db.insert("wrestlers", wrestler);
    }

    // Insert events
    for (const event of args.events) {
      await ctx.db.insert("events", event);
    }

    // Insert match types
    for (const matchType of args.matchTypes) {
      await ctx.db.insert("match_types", matchType);
    }

    // Insert championships
    for (const championship of args.championships) {
      await ctx.db.insert("championships", championship);
    }

    return { promotionIds, brandIds };
  },
});

// Action to clear and reseed data
export const clearAndReseed = action({
  args: {},
  handler: async (ctx) => {
    // Clear all data
    await ctx.runMutation(internal.seedData.clearAllData);

    // Reseed
    return await ctx.runAction(internal.seedData.seedInitialData);
  },
});
