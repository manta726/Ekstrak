import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  try {
    const formData = await req.formData()
    const file = formData.get("file") as Blob | null
    const apiKey = req.headers.get("x-api-key")

    if (!file || !apiKey) {
      return NextResponse.json({ message: "File atau API key tidak ditemukan." }, { status: 400 })
    }

    const lunosForm = new FormData()
    lunosForm.append("file", file)

    const response = await fetch("https://api.lunos.tech/v1/extract", {
      method: "POST",
      headers: {
        Authorization: `Bearer ${apiKey}`,
      },
      body: lunosForm,
    })

    const contentType = response.headers.get("content-type")
    const text = await response.text()

    if (!response.ok) {
      return NextResponse.json(
        { message: "Gagal memproses dari Lunos", detail: text },
        { status: response.status }
      )
    }

    // Pastikan format valid JSON
    const result = contentType?.includes("application/json") ? JSON.parse(text) : { raw: text }

    return NextResponse.json(result)
  } catch (error: any) {
    return NextResponse.json(
      { message: "Internal server error", error: error.message || error.toString() },
      { status: 500 }
    )
  }
}
