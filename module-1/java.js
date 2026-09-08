function generateCertificate() {
  const nameInput = document.getElementById('studentName');
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter a name for the certificate.");
    return;
  }

  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');

  // Background
  ctx.fillStyle = "#060913";
  ctx.fillRect(0, 0, 1200, 800);

  // Outer Border & Accents
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#3b4d6c";
  ctx.strokeRect(30, 30, 1140, 740);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00f2fe";
  ctx.strokeRect(40, 40, 1120, 720);

  // Brand Header
  ctx.textAlign = "center";
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 24px monospace";
  ctx.fillText("CYVEXIS // CYBERSECURITY DRILLS", 600, 120);

  // Main Title
  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("Certificate of Completion", 600, 190);

  // Statement
  ctx.fillStyle = "#94a3b8";
  ctx.font = "20px sans-serif";
  ctx.fillText("This certifies that", 600, 260);

  // Recipient Name
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 48px sans-serif";
  ctx.fillText(name, 600, 340);

  // Separator line
  ctx.strokeStyle = "#334155";
  ctx.lineWidth = 1;
  ctx.beginPath();
  ctx.moveTo(350, 365);
  ctx.lineTo(850, 365);
  ctx.stroke();

  // Accomplishment text
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "22px sans-serif";
  ctx.fillText("has successfully completed the practical awareness drill on", 600, 420);

  // Module Title
  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 26px sans-serif";
  ctx.fillText("Phishing Links: Spot Deceptive URLs Before You Click", 600, 470);

  // Meta details (Date & ID)
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const certId = "CYV-" + Math.floor(100000 + Math.random() * 900000);

  ctx.fillStyle = "#64748b";
  ctx.font = "16px monospace";
  ctx.fillText(`Issued: ${today}  |  Record: ${certId}`, 600, 560);

  // Security & Privacy Notice Box
  ctx.fillStyle = "#0a0f1d";
  ctx.fillRect(200, 640, 800, 50);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.35)";
  ctx.lineWidth = 1;
  ctx.strokeRect(200, 640, 800, 50);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px monospace";
  ctx.fillText("Client-Side Verified • Zero Credentials Stored • cyvexis", 600, 672);

  // Trigger Local Download
  const downloadLink = document.createElement('a');
  downloadLink.download = `Cyvexis_Certificate_${name.replace(/\s+/g, '_')}.png`;
  downloadLink.href = canvas.toDataURL('image/png');
  downloadLink.click();
}