async function analyzeCsvData() {
  console.log("📊 Analyzing CSV data structure...")

  const csvFiles = [
    {
      name: "promotions",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/promotions_rows-raKwx0w03cZvCkwhMkbWF5GCQbvTzW.csv",
    },
    {
      name: "brands",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brands_rows-bJReSjJNG4nefQKfPSt7YuUq0Acb7b.csv",
    },
    {
      name: "wrestlers",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wrestlers_rows-8KS7NRudfM6VgwJnKlXBc5w7f8pFh2.csv",
    },
    {
      name: "events",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/events_rows-NK27LGHy4RhM9hdEeO44VHjEDf4VFl.csv",
    },
    {
      name: "match_types",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/match_types_rows-SJwsPMX2m8aX8194oNENHFpSXAeDDq.csv",
    },
    {
      name: "championships",
      url: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/championships_rows-h1YZClO5y3OXKmxhfjCb4TRMjkbLgB.csv",
    },
  ]

  for (const file of csvFiles) {
    try {
      console.log(`\n🔍 Analyzing ${file.name}...`)
      const response = await fetch(file.url)
      const csvText = await response.text()

      const lines = csvText.trim().split("\n")
      const headers = lines[0].split(",").map((h) => h.replace(/"/g, ""))
      const dataRows = lines.slice(1)

      console.log(`📋 Headers: ${headers.join(", ")}`)
      console.log(`📊 Total rows: ${dataRows.length}`)

      if (dataRows.length > 0) {
        console.log(`📝 Sample row: ${dataRows[0]}`)

        // Parse first few rows to check data quality
        const sampleData = dataRows.slice(0, 3).map((row) => {
          const values = []
          let current = ""
          let inQuotes = false

          for (let i = 0; i < row.length; i++) {
            const char = row[i]
            if (char === '"') {
              inQuotes = !inQuotes
            } else if (char === "," && !inQuotes) {
              values.push(current.trim())
              current = ""
            } else {
              current += char
            }
          }
          values.push(current.trim())

          return values
        })

        console.log(`🔬 Sample parsed data:`)
        sampleData.forEach((row, i) => {
          console.log(`   Row ${i + 1}: ${row.slice(0, 3).join(" | ")}...`)
        })
      }
    } catch (error) {
      console.error(`❌ Error analyzing ${file.name}:`, error.message)
    }
  }

  console.log("\n✅ CSV analysis completed!")
}

analyzeCsvData()
