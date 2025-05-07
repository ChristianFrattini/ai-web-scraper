/* eslint-disable @typescript-eslint/no-unused-vars */
import { NextRequest, NextResponse } from "next/server";
import axios from "axios";
import * as cheerio from "cheerio";
import { summarizeContent } from "@/lib/analyze";

export async function GET(req: NextRequest) {
  const { searchParams } = new URL(req.url); // Get the search parameters from the request URL
  const url = searchParams.get("url"); // Extract the URL parameter
  const summarize = searchParams.get("summarize") === "true"; // Check if summarize is true

  if (!url) {
    return NextResponse.json({ error: "Missing URL" }, { status: 400 }); // Return an error if URL is missing
  }

  try {
    const { data } = await axios.get(url, {
      // Fetch the content from the URL
      headers: { "User-Agent": "Mozilla/5.0" }, // Set a user agent to avoid being blocked
    });
    const $ = cheerio.load(data); // Load the HTML data into cheerio
    const title = $("title").text(); // Extract the title of the page

    const paragraphs = $("p") // Select all paragraph elements
      .map((_, el) => $(el).text())
      .get()
      .filter(Boolean) // Filter out empty paragraphs
      .slice(0, 50); // Limit to 50 paragraphs

    const summary = summarize ? await summarizeContent(paragraphs) : null; // Summarize the content if requested

    return NextResponse.json({ title, content: paragraphs, summary });
  } catch (e) {
    return NextResponse.json(
      { error: "Failed to scrape content" },
      { status: 500 },
    );
  }
}
