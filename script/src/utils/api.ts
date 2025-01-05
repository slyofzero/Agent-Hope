import { errorHandler } from "./handlers";
import * as cheerio from "cheerio";

export async function apiFetcher<T>(url: string) {
  try {
    const response = await fetch(url);
    const data = (await response.json()) as T;
    return { response: response.status, data };
  } catch (error) {
    errorHandler(error);
    return null;
  }
}

export async function fetchAndExtract(url: string) {
  try {
    const response = await fetch(url);
    const html = await response.text();
    const $ = cheerio.load(html);
    const mainText = $("p, div, span, h1, h2, h3, h4, h5, h6").text(); // Extract text from all <p> elements
    return mainText;
  } catch (error) {
    errorHandler(error);
    return "";
  }
}
