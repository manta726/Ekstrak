"use client"

import { useState, useRef } from "react"

export default function LunosExtractor() {
  const [apiKey, setApiKey] = useState("")
  const [structuredData, setStructuredData] = useState<any>(null)
  const [rawJson, setRawJson] = useState("")
  const [error, setError] = useState("")
  const fileInputRef = useRef<HTMLInputElement>(null)

  const handleFileUpload = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    if (!apiKey) {
      setError("Masukkan API Key Lunos terlebih dahulu.")
      return
    }

    setError("")
    const formData = new FormData()
    formData.append("file", file)

    try {
      const response = await fetch("https://api.lunos.tech/v1/extract", {
        method: "POST",
        headers: {
          "x-api-key": apiKey,,
        },
        body: formData,
      })

      if (!response.ok) {
        const errData = await response.json()
        throw new Error(errData.message || "Gagal memproses file.")
      }

      const result = await response.json()
      setRawJson(JSON.stringify(result, null, 2))
      setStructuredData({
        passportNo: result.passport_number || "-",
        fullName: result.full_name || "-",
        dateOfBirth: result.date_of_birth || "-",
        placeOfBirth: result.place_of_birth || "-",
        dateOfIssue: result.date_of_issue || "-",
        dateOfExpiry: result.date_of_expiry || "-",
      })
    } catch (err: any) {
      setError(err.message)
    }
  }

  return (
    <div className="min-h-screen bg-gray-900 text-white p-8 font-sans">
      <h1 className="text-3xl font-bold mb-4">Demo Ekstraksi Paspor - Lunos.tech</h1>

      <div className="mb-4">
        <label className="block text-sm mb-1">API Key Lunos</label>
        <input
          type="password"
          value={apiKey}
          onChange={(e) => setApiKey(e.target.value)}
          placeholder="Masukkan API Key Anda"
          className="w-full p-2 rounded bg-gray-800 border border-gray-700 text-white"
        />
      </div>

      <div className="mb-6">
        <input
          ref={fileInputRef}
          type="file"
          accept="image/png, image/jpeg, application/pdf"
          onChange={handleFileUpload}
          className="text-white"
        />
      </div>

      {error && <div className="text-red-400 mb-4">⚠️ {error}</div>}

      {structuredData && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700 mb-6">
          <h2 className="text-xl font-bold mb-3">Hasil Ekstraksi Terstruktur:</h2>
          <table className="table-auto text-sm">
            <tbody>
              <tr><td className="pr-4">Nomor Paspor:</td><td>{structuredData.passportNo}</td></tr>
              <tr><td>Nama Lengkap:</td><td>{structuredData.fullName}</td></tr>
              <tr><td>Tanggal Lahir:</td><td>{structuredData.dateOfBirth}</td></tr>
              <tr><td>Tempat Lahir:</td><td>{structuredData.placeOfBirth}</td></tr>
              <tr><td>Tanggal Terbit:</td><td>{structuredData.dateOfIssue}</td></tr>
              <tr><td>Tanggal Kedaluwarsa:</td><td>{structuredData.dateOfExpiry}</td></tr>
            </tbody>
          </table>
        </div>
      )}

      {rawJson && (
        <div className="bg-gray-800 p-4 rounded-lg border border-gray-700">
          <h2 className="text-lg font-semibold mb-2">Raw JSON Output:</h2>
          <pre className="text-sm overflow-auto whitespace-pre-wrap">{rawJson}</pre>
        </div>
      )}
    </div>
  )
}
