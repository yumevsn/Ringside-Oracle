// Script to analyze the CSV data structure
async function analyzeCsvData() {
  const csvUrls = {
    wrestlers:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/wrestlers_rows-8KS7NRudfM6VgwJnKlXBc5w7f8pFh2.csv",
    promotions:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/promotions_rows-raKwx0w03cZvCkwhMkbWF5GCQbvTzW.csv",
    match_types:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/match_types_rows-SJwsPMX2m8aX8194oNENHFpSXAeDDq.csv",
    brands: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/brands_rows-bJReSjJNG4nefQKfPSt7YuUq0Acb7b.csv",
    championships:
      "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/championships_rows-h1YZClO5y3OXKmxhfjCb4TRMjkbLgB.csv",
    events: "https://hebbkx1anhila5yf.public.blob.vercel-storage.com/events_rows-NK27LGHy4RhM9hdEeO44VHjEDf4VFl.csv",
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

  for (const [tableName, url] of Object.entries(csvUrls)) {
    try {
      console.log(`\n=== Analyzing ${tableName.toUpperCase()} ===`)
      const response = await fetch(url)
      const csvText = await response.text()
      const { headers, rows } = parseCSV(csvText)

      console.log(`Headers: ${headers.join(", ")}`)
      console.log(`Total rows: ${rows.length}`)

      if (rows.length > 0) {
        console.log("Sample row:", JSON.stringify(rows[0], null, 2))
      }

      // Analyze data types and unique values for key fields
      if (tableName === "promotions") {
        const uniqueCountries = [...new Set(rows.map((r) => r.country_code))]
        console.log("Unique countries:", uniqueCountries)
      }

      if (tableName === "wrestlers") {
        const uniqueStatuses = [...new Set(rows.map((r) => r.status))]
        const uniqueGenders = [...new Set(rows.map((r) => r.gender))]
        console.log("Unique statuses:", uniqueStatuses)
        console.log("Unique genders:", uniqueGenders)
      }
    } catch (error) {
      console.error(`Error analyzing ${tableName}:`, error)
    }
  }
}

analyzeCsvData()
