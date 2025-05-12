/* eslint-disable @typescript-eslint/no-explicit-any */

"use client";

import { useState } from "react";

export default function Home() {
  const [url, setUrl] = useState("");
  const [summarize, setSummarize] = useState(false);
  const [data, setData] = useState<any>(null);
  const [loading, setLoading] = useState(false);

  const handleScrape = async () => {
    setLoading(true);
    setData(null);

    try {
      const res = await fetch(
        `/api/scrape?url=${encodeURIComponent(url)}&summarize=${summarize}`, // Fetch the content from the API
      );
      const json = await res.json(); // Parse the JSON response
      setData(json);
    } catch {
      setData({ error: "Failed to fetch content." });
    }

    setLoading(false);
  };

  return (
    <main className="min-h-screen p-10 bg-gray-50 flex flex-col items-center justify-center">
      <h1 className="text-3xl font-bold mb-6"> AI Scraper</h1>

      <div className="mb-4 w-full flex items-center justify-center">
        <input
          type="text"
          value={url}
          onChange={(e) => setUrl(e.target.value)}
          placeholder="Enter URL"
          className="border p-2 w-full max-w-xl rounded"
        />
      </div>

      <label className="block mb-4">
        <input
          type="checkbox"
          checked={summarize}
          onChange={(e) => setSummarize(e.target.checked)}
        />
        <span className="ml-2">Summarize with AI</span>
      </label>

      <button
        onClick={handleScrape}
        disabled={loading || !url}
        className="bg-blue-600 text-white px-4 py-2 rounded disabled:opacity-50"
      >
        {loading ? "Scraping..." : "Scrape"}
      </button>

      {data && (
        <div className="mt-8 bg-white p-6 rounded shadow-md max-w-2xl">
          {data.error && <p className="text-red-500">{data.error}</p>}
          {data.title && (
            <h2 className="text-2xl font-semibold">{data.title}</h2>
          )}

          {data.summary && (
            <>
              <h3 className="mt-6 text-xl font-bold">Summary:</h3>
              <p className="italic">{data.summary}</p>
            </>
          )}
          <h3 className="mt-6 text-xl font-bold">Paragraph:</h3>
          {data.content?.map((p: string, i: number) => (
            <p key={i} className="mt-2">
              {p}
            </p>
          ))}
        </div>
      )}
    </main>
  );
}
