import { NextRequest, NextResponse } from "next/server"

export async function POST(req: NextRequest) {
  const formData = await req.formData()
  const file = formData.get("file") as Blob
  const apiKey = req.headers.get("x-api-key")

  if (!file || !apiKey) {
    return NextResponse.json({ message: "File atau API key tidak ditemukan." }, { status: 400 })
  }

  const lunosForm = new FormData()
  lunosForm.append("file", file)

  const response = await fetch("https://api.lunos.tech/v1/extract", {
    method: "POST",
    headers: { Authorization: `Bearer ${apiKey}` },
    body: lunosForm,
  })

  const result = await response.json()
  return NextResponse.json(result)
}