
// Enhanced Confidence Logic with Breakdown + Adaptive AI Mode

function calculateConfidence(entropy, score, oddTarget, hash) {
  let confidence = 50;
  let log = [];

  if (entropy > 4.2) { confidence += 10; log.push("Entropy > 4.2 ➤ +10%"); }
  if (entropy > 4.5) { confidence += 15; log.push("Entropy > 4.5 ➤ +15%"); }

  if (score % 7 === 0) { confidence += 8; log.push("Score divisible by 7 ➤ +8%"); }
  if (score % 5 === 0) { confidence += 5; log.push("Score divisible by 5 ➤ +5%"); }

  if (/(\w)\1{2,}/.test(hash)) { confidence += 15; log.push("Triple repetition ➤ +15%"); }
  if (/(\w{2,4})\1{1,}/.test(hash)) { confidence += 10; log.push("Repeating chunks ➤ +10%"); }

  const tail = hash.slice(-4);
  if (/^(aaaa|ffff|0000|1111)$/.test(tail)) { confidence += 20; log.push("Tail pattern matched ➤ +20%"); }

  if (oddTarget === '2') { confidence += 5; log.push("Low risk 2x ➤ +5%"); }
  if (oddTarget === '3') { confidence += 5; log.push("Balanced 3x ➤ +5%"); }
  if (oddTarget === '4') {
    if (entropy > 3.91 && entropy < 3.97) { confidence += 10; log.push("4x entropy range ➤ +10%"); }
    if (score >= 45 && score <= 80) { confidence += 8; log.push("4x score range ➤ +8%"); }
  }
  if (oddTarget === '7') {
    if (entropy > 4.1 && entropy < 4.4) { confidence += 12; log.push("7x entropy sweet spot ➤ +12%"); }
    if (score >= 55 && score <= 90) { confidence += 6; log.push("7x score range ➤ +6%"); }
  }
  if (oddTarget === '10') {
    confidence += 10; log.push("10x base bonus ➤ +10%");
    if (entropy > 4.25 && entropy < 4.5) { confidence += 15; log.push("10x entropy peak ➤ +15%"); }
    if (score >= 60 && score <= 100) { confidence += 10; log.push("10x score peak ➤ +10%"); }
  }
  if (oddTarget === '100') { confidence += 15; log.push("Extreme risk 100x ➤ +15%"); }

  // Adaptive penalty for repeated failures
  confidence = adjustBasedOnHistory(oddTarget, confidence, log);

  return { confidence: Math.min(98, confidence), breakdown: log };
}

function adjustBasedOnHistory(oddTarget, baseConfidence, log) {
  const history = JSON.parse(localStorage.getItem('aviatorHistory')) || [];
  const recent = history.slice(0, 10).filter(h => h.odd === oddTarget);
  const failed = recent.filter(x => x.wasSuccessful === false).length;

  if (failed >= 3) {
    baseConfidence -= 10;
    log.push("Recent failures ➤ -10%");
  }

  return Math.max(5, baseConfidence);
}

function updateConfidenceBreakdown(breakdown) {
  const list = breakdown.map(item => `<li>${item}</li>`).join('');
  document.getElementById("confidence-breakdown").innerHTML = `<h4>Confidence Breakdown</h4><ul>${list}</ul>`;
}

// Sinhala Template Generator
function generateSinhalaSignalTemplate(time, odd, confidence) {
  return `🛑 Xtreme Aviator ක්‍රැෂ් අනාවැකිය\n🕒 වේලාව: ${time}\n🎯 ඉලක්කය: ${odd}x\n✅ විශ්වාසය: ${confidence}%\n\nමෙය SHA512 Hash අල්ගොරිතමයක් මත පදනම් වූ AI-powered system එකකින් නිපදවූ අනාවැකියකි.`;
}
