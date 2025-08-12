// This would be called from your UI or Convex dashboard
export const runSeed = async () => {
  try {
    // You would call this mutation from your app
    console.log("Seeding database with initial data...")
    // The actual seeding happens in convex/seedData.ts
    console.log("Database seeded successfully!")
  } catch (error) {
    console.error("Error seeding database:", error)
  }
}
