// Weather-aware greeting for the landing page.
// Gracefully falls back at every step — no greeting is better than a broken one.

interface WeatherData {
  description: string;
  temp: number;
  city: string;
}

async function fetchWeather(lat: number, lon: number): Promise<WeatherData | null> {
  try {
    // Open-Meteo is free, no API key required
    const url = new URL("https://api.open-meteo.com/v1/forecast");
    url.searchParams.set("latitude",  String(lat));
    url.searchParams.set("longitude", String(lon));
    url.searchParams.set("current_weather", "true");

    const res = await fetch(url.toString(), { signal: AbortSignal.timeout(4000) });
    if (!res.ok) return null;
    const data = await res.json();
    const wmo  = data?.current_weather?.weathercode ?? -1;
    const temp = Math.round(data?.current_weather?.temperature ?? 0);

    // Reverse-geocode city name from coordinates (nominatim, no key)
    const geo  = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json`,
      { headers: { "Accept-Language": "en" }, signal: AbortSignal.timeout(3000) }
    );
    const geoData = geo.ok ? await geo.json() : null;
    const city = geoData?.address?.city
      || geoData?.address?.town
      || geoData?.address?.village
      || geoData?.address?.county
      || "";

    return { description: wmoToDescription(wmo), temp, city };
  } catch {
    return null;
  }
}

function wmoToDescription(code: number): string {
  if (code <= 1)  return "clear skies";
  if (code <= 3)  return "a cloudy day";
  if (code <= 49) return "foggy weather";
  if (code <= 59) return "drizzly weather";
  if (code <= 69) return "rainy weather";
  if (code <= 79) return "snowy weather";
  if (code <= 84) return "rain showers";
  if (code <= 99) return "stormy weather";
  return "interesting weather";
}

function getGreeting(weather: WeatherData): string {
  const { description, temp, city } = weather;
  const cityStr = city ? ` in ${city}` : "";
  const hour = new Date().getHours();
  const timeStr = hour < 12 ? "morning" : hour < 17 ? "afternoon" : "evening";

  const templates = [
    `A little colour for ${description}${cityStr} 🌸`,
    `Good ${timeStr}${cityStr} — ${temp}° and bouquet weather ✨`,
    `Brighten someone's ${description}${cityStr} today 💐`,
  ];
  return templates[Math.floor(Math.random() * templates.length)];
}

export async function getWeatherGreeting(): Promise<string | null> {
  return new Promise((resolve) => {
    if (!navigator.geolocation) { resolve(null); return; }

    const timeout = setTimeout(() => resolve(null), 6000);

    navigator.geolocation.getCurrentPosition(
      async (pos) => {
        clearTimeout(timeout);
        const weather = await fetchWeather(pos.coords.latitude, pos.coords.longitude);
        resolve(weather ? getGreeting(weather) : null);
      },
      () => { clearTimeout(timeout); resolve(null); }
    );
  });
}
