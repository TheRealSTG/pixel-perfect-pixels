interface WeatherData {
  city: string;
  temperature: number;
  condition: string;
  emoji: string;
}

const weatherCodeToCondition: Record<number, { condition: string; emoji: string }> = {
  0: { condition: "clear skies", emoji: "☀️" },
  1: { condition: "mostly clear skies", emoji: "🌤️" },
  2: { condition: "partly cloudy skies", emoji: "⛅" },
  3: { condition: "overcast skies", emoji: "☁️" },
  45: { condition: "foggy weather", emoji: "🌫️" },
  48: { condition: "foggy weather", emoji: "🌫️" },
  51: { condition: "light drizzle", emoji: "🌦️" },
  53: { condition: "drizzle", emoji: "🌦️" },
  55: { condition: "heavy drizzle", emoji: "🌧️" },
  61: { condition: "light rain", emoji: "🌧️" },
  63: { condition: "rain", emoji: "🌧️" },
  65: { condition: "heavy rain", emoji: "🌧️" },
  71: { condition: "light snow", emoji: "🌨️" },
  73: { condition: "snow", emoji: "❄️" },
  75: { condition: "heavy snow", emoji: "❄️" },
  80: { condition: "rain showers", emoji: "🌦️" },
  81: { condition: "rain showers", emoji: "🌧️" },
  82: { condition: "heavy rain showers", emoji: "⛈️" },
  95: { condition: "thunderstorms", emoji: "⛈️" },
};

function getDayOfWeek(): string {
  return new Intl.DateTimeFormat("en-US", { weekday: "long" }).format(new Date());
}

function getGreetingText(data: WeatherData): string {
  const day = getDayOfWeek();
  return `A little colour for a ${data.condition.split(" ")[0]} ${day} in ${data.city} ${data.emoji}`;
}

function getFallbackGreeting(): string {
  const day = getDayOfWeek();
  const greetings = [
    `A little colour for your ${day} ✨`,
    `Something beautiful for your ${day} 🌸`,
    `Brighten up this lovely ${day} 💐`,
  ];
  return greetings[Math.floor(Math.random() * greetings.length)];
}

async function reverseGeocode(lat: number, lon: number): Promise<string> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/reverse?lat=${lat}&lon=${lon}&format=json&zoom=10`
    );
    const data = await res.json();
    return data.address?.city || data.address?.town || data.address?.village || "your city";
  } catch {
    return "your city";
  }
}

export async function getWeatherGreeting(): Promise<string> {
  try {
    const position = await new Promise<GeolocationPosition>((resolve, reject) => {
      navigator.geolocation.getCurrentPosition(resolve, reject, { timeout: 5000 });
    });

    const { latitude, longitude } = position.coords;

    const [weatherRes, city] = await Promise.all([
      fetch(
        `https://api.open-meteo.com/v1/forecast?latitude=${latitude}&longitude=${longitude}&current_weather=true`
      ),
      reverseGeocode(latitude, longitude),
    ]);

    const weatherData = await weatherRes.json();
    const code = weatherData.current_weather?.weathercode ?? 0;
    const temp = Math.round(weatherData.current_weather?.temperature ?? 20);
    const info = weatherCodeToCondition[code] || { condition: "beautiful weather", emoji: "🌸" };

    return getGreetingText({ city, temperature: temp, ...info });
  } catch {
    return getFallbackGreeting();
  }
}
