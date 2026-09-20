import vehiclesRaw from "./vehiclesData.json";
import { Vehicle, allVehicles } from "./clientSimulation";

// Detect language: Sinhala script, Singlish, or English
export function detectLanguage(text: string): "sinhala" | "singlish" | "english" {
  if (/[\u0D80-\u0DFF]/.test(text)) {
    return "sinhala";
  }
  const singlishWords = [
    "mata", "wahana", "hodama", "kiyanna", "mila", "thela", "puluwanda",
    "ganna", "meka", "eka", "lankawe", "keeyada", "thiyenawada", "mokakda",
    "kamathi", "kohomada", "danna", "nadda", "hoda", "wadi", "aduma"
  ];
  const words = text.toLowerCase().split(/\W+/);
  if (words.some((w) => singlishWords.includes(w))) {
    return "singlish";
  }
  return "english";
}

// Parse natural language profile
export function parseProfileFromText(text: string) {
  const result = {
    budget: 18000000,
    family_size: 4,
    daily_km: 35,
    preferred_body_type: "all",
    want_hybrid: false,
    want_ev: false,
  };

  const textLower = text.toLowerCase();

  // 1. Budget extraction
  const millionsMatch = text.match(/(\d+(?:\.\d+)?)\s*(?:m|million|mn)\b/i);
  const lakhsPrefix = text.match(/(?:ලක්ෂ|ලැක්|lakhs?|lac|lacs)\s*(\d+(?:\.\d+)?)/i);
  const lakhsSuffix = text.match(/(\d+(?:\.\d+)?)\s*(?:ක|ක්)?\s*(?:ලක්ෂ|ලැක්|lakhs?|lac|lacs)/i);
  const rsMatch = text.match(/(?:rs\.?|lkr)\s*(\d{1,3}(?:,\d{3})*|\d+)/i);

  if (millionsMatch) {
    result.budget = parseFloat(millionsMatch[1]) * 1000000;
  } else if (lakhsPrefix) {
    result.budget = parseFloat(lakhsPrefix[1]) * 100000;
  } else if (lakhsSuffix) {
    result.budget = parseFloat(lakhsSuffix[1]) * 100000;
  } else if (rsMatch) {
    result.budget = parseFloat(rsMatch[1].replace(/,/g, ""));
  }

  // 2. Family / seats
  const famMatch = text.match(/(\d+)\s*(?:family|people|members|passengers|kids|seats?|දෙනෙක්|දෙනෙකු|සාමාජික)/i);
  if (famMatch) {
    result.family_size = Math.max(2, Math.min(7, parseInt(famMatch[1])));
  }

  // 3. Daily distance
  const kmMatch = text.match(/(\d+)\s*(?:km|kms|kilometers?|කිලෝමීටර්)/i);
  if (kmMatch) {
    result.daily_km = parseFloat(kmMatch[1]);
  }

  // 4. Body type & fuel preference
  if (textLower.includes("suv") || textLower.includes("එස්යූවී")) {
    result.preferred_body_type = "SUV";
  } else if (textLower.includes("sedan") || textLower.includes("සෙඩාන්")) {
    result.preferred_body_type = "Sedan";
  } else if (textLower.includes("hatchback") || textLower.includes("wagon") || textLower.includes("vitz")) {
    result.preferred_body_type = "Hatchback";
  }

  if (textLower.includes("hybrid") || textLower.includes("හයිබ්‍රිඩ්")) {
    result.want_hybrid = true;
  }
  if (textLower.includes("electric") || textLower.includes("ev") || textLower.includes("ඉලෙක්ට්‍රික්")) {
    result.want_ev = true;
  }

  return result;
}

// Client-side AI Automotive Consultant
export async function chatWithClientAI(
  question: string,
  currentVehicle: any = null,
  geminiApiKey: string = ""
): Promise<string> {
  const lang = detectLanguage(question);

  // 1. If user provided a Gemini API Key, call Gemini directly from browser!
  if (geminiApiKey && geminiApiKey.trim().length > 15) {
    try {
      const prompt = `
You are LuxAI, an expert automotive consultant specializing in Sri Lankan vehicle market intelligence.
Language instruction: ${
        lang === "sinhala"
          ? "Respond fluently in natural Sinhala (සිංහල)."
          : lang === "singlish"
          ? "Respond in helpful, friendly Singlish or clear Sinhala."
          : "Respond in polished, fluent English."
      }
Provide specific figures: price in LKR millions/lakhs, fuel economy in km/L, 5-year running costs, ground clearance, and Sri Lankan resale tiers.
${
  currentVehicle
    ? `The user is discussing: ${currentVehicle.brand} ${currentVehicle.model} (${currentVehicle.year}), ${currentVehicle.fuel_type}, ${currentVehicle.seating_capacity} seats, Price: Rs. ${(
        (currentVehicle.base_price_lkr || currentVehicle.base_price_usd * 305) / 1000000
      ).toFixed(1)}M.`
    : ""
}

User Question: ${question}
      `.trim();

      const res = await fetch(
        `https://generativelanguage.googleapis.com/v1beta/models/gemini-1.5-flash:generateContent?key=${geminiApiKey.trim()}`,
        {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            contents: [{ parts: [{ text: prompt }] }],
          }),
        }
      );

      if (res.ok) {
        const data = await res.json();
        const text = data?.candidates?.[0]?.content?.parts?.[0]?.text;
        if (text) return text.trim();
      }
    } catch (e) {
      console.warn("Direct Gemini call fallback to offline engine:", e);
    }
  }

  // 2. Intelligent Offline Knowledge Engine (Runs locally with 0ms delay)
  const qLower = question.toLowerCase();

  // Search / Recommendation query
  const isSearch = [
    "budget", "travel", "family", "need", "looking", "recommend", "suggest",
    "hybrid", "electric", "suv", "sedan", "hatchback", "buy", "hodama", "ganna", "wahana", "car"
  ].some((k) => qLower.includes(k));

  if (isSearch && !currentVehicle) {
    return handleRecommendation(question, lang);
  }

  // Maintenance query
  if (["maintenance", "service", "repair", "cost", "viyadama"].some((k) => qLower.includes(k))) {
    return handleMaintenance(currentVehicle, lang);
  }

  // Child seat query
  if (["seat", "baby", "child", "kids", "isofix", "lamai"].some((k) => qLower.includes(k))) {
    return handleChildSeats(currentVehicle, lang);
  }

  // Resale query
  if (["resale", "depreciation", "watinakama", "second hand"].some((k) => qLower.includes(k))) {
    return handleResale(currentVehicle, lang);
  }

  // Road clearance query
  if (["ground clearance", "flood", "road", "parawal", "colombo", "bad roads", "rain"].some((k) => qLower.includes(k))) {
    return handleRoads(currentVehicle, lang);
  }

  // Battery query
  if (["battery", "hybrid", "ev", "charge", "ceb", "range"].some((k) => qLower.includes(k))) {
    return handleBattery(currentVehicle, lang);
  }

  // Vehicle overview
  if (currentVehicle) {
    return handleVehicleOverview(currentVehicle, lang);
  }

  // General default response
  if (lang === "sinhala") {
    return `ආයුබෝවන්! මම LuxAI වාහන උපදේශක සහයකයා. 
ඔබගේ බජට් එකට (ලක්ෂ ගණන), පවුලේ සාමාජිකයින් ගණනට, සහ දිනපතා ධාවනයට ගැළපෙන හොඳම වාහන, ඉන්ධන පිරිමැස්ම (km/L), හෝ ලංකාවේ නඩත්තු වියදම් ගැන ඕනෑම දෙයක් මාගෙන් විමසන්න!`;
  } else if (lang === "singlish") {
    return `Hello! Mama LuxAI car consultant. 
Oyage budget ekata, family members ganata, daily km travel ekata match wena best cars, fuel economy (km/L) and maintenance costs gana onama deyak mata kiyanna, mama recommend karannam!`;
  } else {
    return `Hello! I am LuxAI, your automotive intelligence consultant. 
Tell me your budget (e.g. 18M LKR), passenger requirements, and daily travel distance, and I will recommend the mathematically optimal vehicles from our verified 40-model database!`;
  }
}

function handleRecommendation(question: string, lang: "sinhala" | "singlish" | "english"): string {
  const profile = parseProfileFromText(question);
  const budget = profile.budget;
  const family = profile.family_size;
  const dailyKm = profile.daily_km;
  const bodyPref = profile.preferred_body_type;

  // Filter and score candidates
  const scored = allVehicles.map((v) => {
    const price = v.base_price_lkr || v.base_price_usd * 305;
    let score = 100;

    if (price <= budget) {
      score += 20;
    } else if (price <= budget * 1.15) {
      score += 5;
    } else {
      score -= ((price - budget) / budget) * 60;
    }

    if (v.seating_capacity >= family) {
      score += 20;
    } else {
      score -= 40;
    }

    if (bodyPref !== "all" && v.body_type.toLowerCase().includes(bodyPref.toLowerCase())) {
      score += 25;
    }
    if (profile.want_hybrid && v.fuel_type.toLowerCase().includes("hybrid")) {
      score += 25;
    }
    if (profile.want_ev && v.fuel_type.toLowerCase().includes("electric")) {
      score += 25;
    }

    return { vehicle: v, price, score };
  });

  scored.sort((a, b) => b.score - a.score);
  const topMatches = scored.slice(0, 3);

  if (lang === "sinhala") {
    const lines = [
      `ඔබගේ **රුපියල් මිලියන ${(budget / 1000000).toFixed(1)} (ලක්ෂ ${(budget / 100000).toFixed(0)})** බජට් එකට, පවුලේ **${family} දෙනාට**, සහ දිනපතා **${dailyKm} km** ධාවනයට අපේ දත්ත ගබඩාවේ ඇති වඩාත්ම ගැළපෙන හොඳම වාහන 3 මෙන්න:\n`,
    ];
    topMatches.forEach((m, idx) => {
      const v = m.vehicle;
      const fEff = v.km_per_liter ? `${v.km_per_liter} km/L` : `${(100 / v.fuel_consumption_l100km).toFixed(1)} km/L`;
      lines.push(
        `${idx + 1}. 🏆 **${v.brand} ${v.model} (${v.year})** — **Rs. ${(m.price / 1000000).toFixed(1)}M (ලක්ෂ ${(m.price / 100000).toFixed(0)})**\n` +
        `   • **වර්ගය:** ${v.body_type} | ${v.fuel_type} | ${v.seating_capacity} Seats | ඩිකිය ${v.boot_space_liters}L\n` +
        `   • **තෙල් කාර්යක්ෂමතාව:** **${fEff}** (දිනපතා ${dailyKm} km ගමනට ඉතාම ලාභදායී වේ).\n` +
        `   • **ලංකාවේ Resale අගය:** ${v.sl_resale_tier || "High"} Retention Tier.\n`
      );
    });
    lines.push("මේ වාහන වල 5-Year True Cost හෝ නඩත්තු වියදම් ගැන වැඩිදුර විස්තර දැනගැනීමට අවශ්‍යද?");
    return lines.join("\n");
  } else if (lang === "singlish") {
    const lines = [
      `Oyage **Rs. ${(budget / 1000000).toFixed(1)}M (Lakhs ${(budget / 100000).toFixed(0)})** budget ekata, **${family} members family** ekata, and daily **${dailyKm} km** travel ekata match wena top 3 vehicles mehemai:\n`,
    ];
    topMatches.forEach((m, idx) => {
      const v = m.vehicle;
      const fEff = v.km_per_liter ? `${v.km_per_liter} km/L` : `${(100 / v.fuel_consumption_l100km).toFixed(1)} km/L`;
      lines.push(
        `${idx + 1}. 🏆 **${v.brand} ${v.model} (${v.year})** — **Rs. ${(m.price / 1000000).toFixed(1)}M (Lakhs ${(m.price / 100000).toFixed(0)})**\n` +
        `   • **Specs:** ${v.body_type} | ${v.fuel_type} | ${v.seating_capacity} Seats | Boot ${v.boot_space_liters}L\n` +
        `   • **Fuel Economy:** **${fEff}** (Daily ${dailyKm} km commute ekata superb efficiency).\n` +
        `   • **Resale Tier:** ${v.sl_resale_tier || "High"} Tier.\n`
      );
    });
    lines.push("Me model ekaka running cost or service cost gana danaganna kamathida?");
    return lines.join("\n");
  } else {
    const lines = [
      `Based on your target budget of **Rs. ${(budget / 1000000).toFixed(1)} Million (LKR ${(budget / 100000).toFixed(0)} Lakhs)**, passenger requirement of **${family} people**, and daily **${dailyKm} km commute**, here are the top 3 recommended vehicles from our database:\n`,
    ];
    topMatches.forEach((m, idx) => {
      const v = m.vehicle;
      const fEff = v.km_per_liter ? `${v.km_per_liter} km/L` : `${(100 / v.fuel_consumption_l100km).toFixed(1)} km/L`;
      lines.push(
        `${idx + 1}. 🏆 **${v.brand} ${v.model} (${v.year})** — **Rs. ${(m.price / 1000000).toFixed(1)}M (${formatUSD(v.base_price_usd)})**\n` +
        `   • **Profile:** ${v.body_type} • ${v.fuel_type} • ${v.seating_capacity} Passenger Seats • ${v.boot_space_liters}L Luggage Boot\n` +
        `   • **Efficiency:** ~**${fEff}** (Outstanding fuel economy for ${dailyKm} km daily runs).\n` +
        `   • **Sri Lankan Liquidity:** ${v.sl_resale_tier || "High"} Resale Retention Tier.\n`
      );
    });
    lines.push("Would you like to explore 5-year running costs or check child-seat compatibility for any of these?");
    return lines.join("\n");
  }
}

function handleMaintenance(v: any, lang: "sinhala" | "singlish" | "english"): string {
  if (v) {
    const isLkr = v.base_price_lkr > 0;
    const maint = isLkr ? v.annual_maintenance_lkr || 150000 : (v.annual_maintenance_usd || 500) * 305;
    const name = `${v.brand} ${v.model}`;
    const rel = v.reliability_score || 90;

    if (lang === "sinhala") {
      return `**${name}** වාහනයේ සාමාන්‍ය වාර්ෂික නඩත්තු (Routine Service) වියදම දළ වශයෙන් **රුපියල් ${maint.toLocaleString()} (අවුරුද්දකට)** පමණ වේ.\n\n• **විශ්වසනීයත්ව ලකුණු:** ${rel}/100\n• සාමාන්‍යයෙන් සෑම 8,000 km - 10,000 km කට වරක් Engine Oil සහ Filters මාරු කිරීමෙන් එන්ජිමේ සහ Hybrid පද්ධතියේ ආයුකාලය උපරිමව තබාගත හැක.`;
    } else if (lang === "singlish") {
      return `**${name}** eke annual maintenance cost eka average **Rs. ${maint.toLocaleString()} per year** wage wenawa.\n\n• **Reliability Rating:** ${rel}/100\n• Every 10,000 km regular oil & filter service ekak kaloth long-term trouble-free use karanna puluwan.`;
    } else {
      return `For the **${name}**, routine preventative maintenance is estimated at approximately **Rs. ${maint.toLocaleString()} LKR / year**.\n\n• **Reliability Rating:** ${rel}/100\n• Standard 10,000 km servicing intervals ensure dependable mechanical durability under Sri Lankan conditions.`;
    }
  }
  return "Routine maintenance for Japanese hybrids in Sri Lanka averages Rs. 140,000 - 190,000 annually, while European luxury platforms range from Rs. 380,000 - 550,000 annually.";
}

function handleChildSeats(v: any, lang: "sinhala" | "singlish" | "english"): string {
  if (v) {
    const name = `${v.brand} ${v.model}`;
    const boot = v.boot_space_liters || 450;
    const seats = v.seating_capacity || 5;

    if (lang === "sinhala") {
      return `ඔව්, **${name}** හි පිටුපස ආසන වල ප්‍රමිතිගත **ISOFIX ළමා ආසන (Child Car Seats) 2ක්** ඉතාම පහසුවෙන් සහ ආරක්ෂිතව සවිකළ හැක.\n\n• **ආසන ගණන:** ${seats} Seats\n• **ඩිකියේ ඉඩ (Boot Space):** ${boot} Liters — බබාගේ Stroller (කරත්තය) එකක් සහ ගමන් මලු පහසුවෙන් තැබිය හැක.`;
    } else if (lang === "singlish") {
      return `Ow, **${name}** eke rear seats wala **ISOFIX baby car seats 2k** fit karanna standard anchor points thiyenawa.\n\n• **Boot Space:** ${boot} Liters thiyena nisa baby stroller ekak and suitcases hodata daganna puluwan.`;
    } else {
      return `Yes, the **${name}** includes dual **ISOFIX child safety anchors** in the rear outboard seats.\n\n• **Cabin Capacity:** ${seats} Passengers\n• **Cargo Volume:** ${boot} Liters — ample room for a folded full-size baby stroller alongside family luggage.`;
    }
  }
  return "Most modern 5-seat SUVs and Sedans in our database feature dual ISOFIX anchors and 450L+ boot space to easily fit baby strollers.";
}

function handleResale(v: any, lang: "sinhala" | "singlish" | "english"): string {
  if (v) {
    const name = `${v.brand} ${v.model}`;
    const tier = v.sl_resale_tier || "High";
    if (lang === "sinhala") {
      return `ලංකාවේ වෙළඳපොළේ **${name}** හි Resale Value වර්ගීකරණය: **${tier} Retention Tier**.\n\n• Toyota, Suzuki සහ Honda වාහන ලංකාවේ අවුරුදු 3 සිට 5 දක්වා කාලයකදී 65% - 72% දක්වා ඉහළම වටිනාකමක් රඳවා ගනී.\n• යුරෝපීය Luxury වාහන අවුරුදු 5කින් 55% - 60% පමණ රඳවා ගනී.`;
    } else {
      return `In the Sri Lankan secondary market, the **${name}** is positioned in the **${tier} Resale Retention Tier**.\n\nJapanese models (Toyota, Honda, Suzuki) retain 65-72% of their real market value after 5 years, while European luxury platforms stabilize at 55-60%.`;
    }
  }
  return "Japanese hybrids (Toyota Aqua, Vezel, Premio, Raize) exhibit the highest liquidity and value retention in Sri Lanka.";
}

function handleRoads(v: any, lang: "sinhala" | "singlish" | "english"): string {
  if (v) {
    const name = `${v.brand} ${v.model}`;
    const isSuv = (v.body_type || "").toLowerCase().includes("suv");
    if (lang === "sinhala") {
      return `**${name} (${v.body_type})** ලංකාවේ මාර්ග තත්ත්වයන්ට:\n\n• ${
        isSuv
          ? "SUV එකක් බැවින් ඉහළ Ground Clearance (185mm+) සහිතයි. වැසි දිනවල කොළඹ ජල ගැලීම් සහ අබලන් පාරවල් වලට ඉතාම සුදුසුයි."
          : "Sedan රථයක් බැවින් අධිවේගී මාර්ග වල සුපිරි සුවපහසුවක් ලබාදෙයි. නගරයේ සාමාන්‍ය පාරවල් වල ධාවනයට විශිෂ්ටයි."
      }`;
    } else {
      return `Regarding Sri Lankan road conditions for the **${name}**:\n\n• ${
        isSuv
          ? "As an SUV, it features generous ground clearance (185mm+), making it ideal for flash-flooded Colombo roads and rough provincial surfaces."
          : "As a sedan/hatchback, it provides whisper-quiet suspension and supreme ride comfort on paved highways and expressways."
      }`;
    }
  }
  return "SUVs like the Toyota Raize, Honda Vezel, and Toyota RAV4 are well-suited for Sri Lankan road variations.";
}

function handleBattery(v: any, lang: "sinhala" | "singlish" | "english"): string {
  if (v) {
    const name = `${v.brand} ${v.model}`;
    if (lang === "sinhala") {
      return `**${name} (${v.fuel_type})** බැටරි සහ විදුලි පද්ධතිය:\n\n• නවීන Lithium-ion/Blade බැටරි ලංකාවේ උණුසුම් පරිසරයට ඔරොත්තු දෙන Liquid Cooling පද්ධතියකින් සමන්විතයි.\n• සාමාන්‍යයෙන් අවුරුදු 8ක් හෝ 160,000 km දක්වා බැටරි විශ්වසනීයත්වය ආරක්ෂා වේ.\n• ලංකාවේ CEB විදුලි ගාස්තු අනුව EV එකක් ධාවනය කිරීම පෙට්‍රල් වලට වඩා 60%කින් ලාභදායී වේ.`;
    } else {
      return `Battery telemetry for the **${name} (${v.fuel_type})**:\n\n• Modern liquid-thermal management protects cells from Sri Lanka's tropical ambient heat.\n• Expected battery longevity spans 8-10 years (160,000+ km) with minimal degradation.\n• Electricity running costs equate to ~Rs. 11 per kilometer compared to ~Rs. 32/km on standard petrol.`;
    }
  }
  return "Modern hybrid and EV batteries feature active thermal cooling and provide substantial long-term fuel savings.";
}

function handleVehicleOverview(v: any, lang: "sinhala" | "singlish" | "english"): string {
  const name = `${v.brand} ${v.model} (${v.year})`;
  const pLkr = v.base_price_lkr || v.base_price_usd * 305;
  const fEff = v.km_per_liter ? `${v.km_per_liter} km/L` : `${(100 / v.fuel_consumption_l100km).toFixed(1)} km/L`;

  if (lang === "sinhala") {
    return `**${name} පිළිබඳ සම්පූර්ණ විස්තරය:**\n\n• **මිල:** Rs. ${(pLkr / 1000000).toFixed(1)}M (ලක්ෂ ${(pLkr / 100000).toFixed(0)})\n• **එන්ජිම හා බලය:** ${v.horsepower} Horsepower (${v.fuel_type})\n• **ඉන්ධන කාර්යක්ෂමතාව:** ${fEff}\n• **ආසන හා ඉඩකඩ:** ${v.seating_capacity} Seats, ${v.boot_space_liters}L Boot Space\n• **විශ්වසනීයත්වය:** ${v.reliability_score}/100\n\nමේ වාහනය පිළිබඳ නඩත්තු වියදම්, ළමා ආසන හෝ Resale Value ගැන ඕනෑම ප්‍රශ්නයක් මගෙන් විමසන්න!`;
  } else if (lang === "singlish") {
    return `**${name} Overview:**\n\n• **Price:** Rs. ${(pLkr / 1000000).toFixed(1)}M (Lakhs ${(pLkr / 100000).toFixed(0)})\n• **Power:** ${v.horsepower} HP (${v.fuel_type})\n• **Fuel Economy:** ${fEff}\n• **Capacity:** ${v.seating_capacity} Seats, ${v.boot_space_liters}L Boot\n• **Reliability Rating:** ${v.reliability_score}/100\n\nMe wahane maintenance, service or road conditions gana onama deyak ahanna!`;
  } else {
    return `**Comprehensive Profile: ${name}**\n\n• **Estimated Price:** Rs. ${(pLkr / 1000000).toFixed(1)} Million (${formatUSD(v.base_price_usd)})\n• **Powertrain:** ${v.horsepower} Horsepower • ${v.fuel_type}\n• **Fuel Efficiency:** ~${fEff}\n• **Practicality:** ${v.seating_capacity} Passenger Seats with ${v.boot_space_liters} Liters Luggage Space\n• **Reliability Score:** ${v.reliability_score}/100\n\nFeel free to ask about financing, long-term servicing schedules, or child safety latch points.`;
  }
}

function formatUSD(amount: number): string {
  return `$${amount.toLocaleString()}`;
}
