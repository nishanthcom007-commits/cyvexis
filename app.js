function checkChoice(option) {
  const box = document.getElementById('feedbackBox');
  box.style.display = 'block';

  if (option === 3) {
    box.style.background = "rgba(16, 185, 129, 0.15)";
    box.style.border = "1px solid #10b981";
    box.style.color = "#a7f3d0";
    box.innerHTML = "<strong>CORRECT DEFENSE PROTOCOL:</strong> You spotted the artificial urgency and the subtly spoofed domain (<code>company-corp.co</code>). Always verify urgent financial requests via a pre-established voice or in-person channel!";
  } else if (option === 2) {
    box.style.background = "rgba(245, 158, 11, 0.15)";
    box.style.border = "1px solid #f59e0b";
    box.style.color = "#fde68a";
    box.innerHTML = "<strong>INCORRECT TRAP:</strong> Replying directly to a spoofed email sends your confirmation straight to the attacker's inbox. Out-of-band contact via a trusted channel is required.";
  } else {
    box.style.background = "rgba(239, 68, 68, 0.15)";
    box.style.border = "1px solid #ef4444";
    box.style.color = "#fecaca";
    box.innerHTML = "<strong>COMPROMISE DETECTED:</strong> Never wire funds based on email urgency alone. Attackers intentionally exploit executive authority and secrecy to bypass standard checks.";
  }
}

function generateCertificate() {
  const nameInput = document.getElementById('studentName');
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter a name for the certificate.");
    return;
  }

  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');

  // Load logo from root
  const logo = new Image();
  logo.src = '../1.jpg';

  logo.onload = function() {
    renderCanvas(ctx, canvas, name, logo);
  };

  logo.onerror = function() {
    renderCanvas(ctx, canvas, name, null);
  };
}

function renderCanvas(ctx, canvas, name, logo) {
  ctx.fillStyle = "#060913";
  ctx.fillRect(0, 0, 1200, 850);

  // Borders
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#1e293b";
  ctx.strokeRect(30, 30, 1140, 790);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00f2fe";
  ctx.strokeRect(42, 42, 1116, 766);

  // Logo
  let startY = 160;
  if (logo) {
    const logoSize = 85;
    ctx.drawImage(logo, (1200 - logoSize) / 2, 55, logoSize, logoSize);
    startY = 180;
  }

  // Header
  ctx.textAlign = "center";
  ctx.fillStyle = "#00f2fe";
  ctx.font = "bold 20px monospace";
  ctx.fillText("CYVEXIS // CYBERSECURITY DRILLS", 600, startY);

  ctx.fillStyle = "#ffffff";
  ctx.font = "bold 44px sans-serif";
  ctx.fillText("Certificate of Completion", 600, startY + 60);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "20px sans-serif";
  ctx.fillText("This certifies that", 600, startY + 120);

  // Student Name
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 46px sans-serif";
  ctx.fillText(name.toUpperCase(), 600, startY + 185);

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(350, startY + 210);
  ctx.lineTo(850, startY + 210);
  ctx.stroke();

  // Module Details
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "21px sans-serif";
  ctx.fillText("has successfully completed the practical awareness drill on", 600, startY + 260);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 24px sans-serif";
  ctx.fillText("Executive Impersonation & Business Email Compromise (BEC)", 600, startY + 310);

  // Date & Dynamic ID
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const certId = `CYV-MOD3-${randomSuffix}`;

  ctx.fillStyle = "#64748b";
  ctx.font = "15px monospace";
  ctx.fillText(`Issued: ${today}   |   Record ID: ${certId}`, 600, startY + 390);

  // Security Footer
  ctx.fillStyle = "#0a0f1d";
  ctx.fillRect(180, 725, 840, 48);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(180, 725, 840, 48);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px monospace";
  ctx.fillText("Client-Side Verified • Zero Credentials Stored • cyvexis", 600, 755);

  // Trigger Download
  const downloadLink = document.createElement('a');
  downloadLink.download = `Cyvexis_Module3_Certificate_${name.replace(/\s+/g, '_')}.png`;
  downloadLink.href = canvas.toDataURL('image/png');
  downloadLink.click();
}