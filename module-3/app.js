/**
 * CYVEXIS SECURITY TRAINING: MODULE 03
 * Executive Impersonation & BEC Defense
 * Interactive Triage Engine & Canvas Certificate Generator
 */

let score = 0;
const answeredQuestions = new Set();

const feedbackDetails = {
  1: {
    correct: "CORRECT IDENTIFICATION: The attacker registered a lookalike domain with a hyphenated prefix and a .co TLD ('corp-cyvexis.co') to impersonate authentic internal infrastructure ('cyvexis.internal'). Always inspect the root domain before trusting sender identities.",
    wrong: "INCORRECT ANALYSIS: Look closer at the domain syntax. Attackers exploit typosquatting and deceptive TLDs (.co instead of internal enterprise suffixes) to pass casual visual scrutiny."
  },
  2: {
    correct: "CORRECT TACTICAL RECOGNITION: The 'do not call' restriction is an artificial urgency and isolation tactic. Attackers intentionally claim they are unavailable via phone to prevent voice out-of-band verification, which would instantly collapse the scam.",
    wrong: "INCORRECT: Board confidentiality is a psychological pretext. Cybercriminals create artificial isolation so finance personnel hesitate to perform an out-of-band phone call."
  },
  3: {
    correct: "CORRECT VERIFICATION PROTOCOL: Mandatory dual-control policy requires that all wire coordinate changes be validated through an out-of-band phone callback using pre-existing, verified contact directories—never phone numbers or links provided in the suspicious email or invoice.",
    wrong: "INCORRECT: Replying directly to the email or relying on invoice contact details confirms instructions with the attacker who controls that communication channel. Strict out-of-band dual authentication is mandatory."
  },
  4: {
    correct: "CORRECT INCIDENT RESPONSE: Escalating raw RFC 822 email headers allows the Security Operations Center (SOC) to identify sending MTA IP addresses, update enterprise mail filters, block malicious domains at the firewall, and automatically quarantine matching inbound phishing lures.",
    wrong: "INCORRECT: Merely deleting or replying leaves other colleagues vulnerable and fails to initiate threat-hunting procedures across company mail servers."
  }
};

/**
 * Validates user choice for scenario questions, updates score, renders immediate feedback, and locks buttons.
 * @param {number} qNum - Scenario index (1 - 4)
 * @param {boolean} isCorrect - Whether selected choice is correct
 * @param {HTMLElement} clickedBtn - The button element that was clicked
 */
function checkAnswer(qNum, isCorrect, clickedBtn) {
  const card = document.getElementById(`qCard${qNum}`);
  if (!card) return;

  const buttons = card.querySelectorAll('.opt-btn');
  const fb = document.getElementById(`fb${qNum}`);
  const statusBadge = document.getElementById(`status${qNum}`);

  // Lock all buttons in this scenario to prevent multiple submissions
  buttons.forEach(btn => {
    btn.disabled = true;
    btn.classList.remove('correct', 'wrong');
  });

  if (isCorrect) {
    clickedBtn.classList.add('correct');
    card.classList.remove('answered-wrong');
    card.classList.add('answered-correct');

    if (statusBadge) {
      statusBadge.textContent = 'RESOLVED';
      statusBadge.className = 'status-indicator resolved';
    }

    if (fb) {
      fb.className = 'feedback-msg correct-fb';
      fb.innerHTML = `<strong>DEFENSE SUCCESS:</strong> ${feedbackDetails[qNum].correct}`;
      fb.style.display = 'block';
    }

    if (!answeredQuestions.has(qNum)) {
      answeredQuestions.add(qNum);
      score++;
      updateScoreDisplay();
    }
  } else {
    clickedBtn.classList.add('wrong');
    card.classList.remove('answered-correct');
    card.classList.add('answered-wrong');

    if (statusBadge) {
      statusBadge.textContent = 'FLAGGED';
      statusBadge.className = 'status-indicator triaged-wrong';
    }

    if (fb) {
      fb.className = 'feedback-msg wrong-fb';
      fb.innerHTML = `<strong>SECURITY GAP:</strong> ${feedbackDetails[qNum].wrong}`;
      fb.style.display = 'block';
    }

    // Mark as attempted even if incorrect so user can continue
    if (!answeredQuestions.has(qNum)) {
      answeredQuestions.add(qNum);
      updateScoreDisplay();
    }
  }
}

/**
 * Updates the tactical scoreboard HUD.
 */
function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay');
  if (!scoreDisplay) return;

  scoreDisplay.textContent = `Score: ${score} / 4 Completed`;

  if (score === 4) {
    scoreDisplay.classList.add('complete');
  } else {
    scoreDisplay.classList.remove('complete');
  }
}

/**
 * Generates and downloads the client-side verified dark-mode completion certificate.
 */
function generateCertificate() {
  const nameInput = document.getElementById('studentName');
  const name = (nameInput ? nameInput.value.trim() : '');

  if (!name) {
    alert('Please enter your full name to generate your verified Cyvexis defense record.');
    if (nameInput) nameInput.focus();
    return;
  }

  const canvas = document.getElementById('certCanvas');
  if (!canvas) {
    alert('Canvas element not found.');
    return;
  }

  const ctx = canvas.getContext('2d');

  // Attempt to load the Cyvexis shield logo if available in relative paths
  const logo = new Image();
  logo.crossOrigin = 'anonymous';
  let logoLoaded = false;

  const onLogoDone = (imgObj) => {
    if (logoLoaded) return;
    logoLoaded = true;
    renderCertificateCanvas(ctx, canvas, name, imgObj);
  };

  logo.onload = () => onLogoDone(logo);
  logo.onerror = () => {
    // Try fallback logo path
    const fallbackLogo = new Image();
    fallbackLogo.crossOrigin = 'anonymous';
    fallbackLogo.onload = () => onLogoDone(fallbackLogo);
    fallbackLogo.onerror = () => onLogoDone(null);
    fallbackLogo.src = '../logo.png';
  };

  logo.src = 'data:image/jpeg;base64,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';

  // Safety fallback if image loading hangs
  setTimeout(() => {
    if (!logoLoaded) {
      onLogoDone(null);
    }
  }, 350);
}

/**
 * Renders the high-resolution certificate on HTML5 Canvas.
 * @param {CanvasRenderingContext2D} ctx 
 * @param {HTMLCanvasElement} canvas 
 * @param {string} name 
 * @param {HTMLImageElement|null} logo 
 */
function renderCertificateCanvas(ctx, canvas, name, logo) {
  const width = canvas.width;   // 1200
  const height = canvas.height; // 850

  // 1. Deep Obsidian Background
  ctx.fillStyle = '#060913';
  ctx.fillRect(0, 0, width, height);

  // 2. Subtle Tech Grid Pattern
  ctx.strokeStyle = 'rgba(30, 41, 59, 0.45)';
  ctx.lineWidth = 1;
  const gridSize = 40;
  for (let x = 40; x < width - 40; x += gridSize) {
    ctx.beginPath();
    ctx.moveTo(x, 40);
    ctx.lineTo(x, height - 40);
    ctx.stroke();
  }
  for (let y = 40; y < height - 40; y += gridSize) {
    ctx.beginPath();
    ctx.moveTo(40, y);
    ctx.lineTo(width - 40, y);
    ctx.stroke();
  }

  // 3. Outer Slate Border (#1e293b)
  ctx.lineWidth = 4;
  ctx.strokeStyle = '#1e293b';
  ctx.strokeRect(30, 30, width - 60, height - 60);

  // 4. Inner Neon Cyan Border (#00f2fe)
  ctx.lineWidth = 2;
  ctx.strokeStyle = '#00f2fe';
  ctx.strokeRect(44, 44, width - 88, height - 88);

  // 5. Tactical Corner Brackets (Emerald #10b981)
  const bracketSize = 28;
  ctx.strokeStyle = '#10b981';
  ctx.lineWidth = 3.5;

  // Top-Left
  ctx.beginPath();
  ctx.moveTo(44, 44 + bracketSize);
  ctx.lineTo(44, 44);
  ctx.lineTo(44 + bracketSize, 44);
  ctx.stroke();

  // Top-Right
  ctx.beginPath();
  ctx.moveTo(width - 44 - bracketSize, 44);
  ctx.lineTo(width - 44, 44);
  ctx.lineTo(width - 44, 44 + bracketSize);
  ctx.stroke();

  // Bottom-Left
  ctx.beginPath();
  ctx.moveTo(44, height - 44 - bracketSize);
  ctx.lineTo(44, height - 44);
  ctx.lineTo(44 + bracketSize, height - 44);
  ctx.stroke();

  // Bottom-Right
  ctx.beginPath();
  ctx.moveTo(width - 44 - bracketSize, height - 44);
  ctx.lineTo(width - 44, height - 44);
  ctx.lineTo(width - 44, height - 44 - bracketSize);
  ctx.stroke();

  // 6. Brand Header / Logo
  let contentStartY = 160;
  if (logo && logo.naturalWidth > 0) {
    const logoSize = 85;
    ctx.drawImage(logo, (width - logoSize) / 2, 58, logoSize, logoSize);
    contentStartY = 180;
  }

  ctx.textAlign = 'center';

  // Header Monospace Banner
  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 18px "Fira Code", monospace';
  ctx.fillText('CYVEXIS // CYBERSECURITY DRILLS', 600, contentStartY);

  // Certificate Title
  ctx.fillStyle = '#ffffff';
  ctx.font = 'bold 42px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Certificate of Practical Completion', 600, contentStartY + 55);

  // Subtitle
  ctx.fillStyle = '#94a3b8';
  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('This official defense credential certifies that', 600, contentStartY + 115);

  // Recipient Name (Bold Uppercase Emerald #10b981)
  ctx.fillStyle = '#10b981';
  ctx.font = 'bold 46px "Plus Jakarta Sans", sans-serif';
  ctx.fillText(name.toUpperCase(), 600, contentStartY + 180);

  // Name Underline Accent
  ctx.strokeStyle = '#334155';
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(350, contentStartY + 204);
  ctx.lineTo(850, contentStartY + 204);
  ctx.stroke();

  // Completion Statement
  ctx.fillStyle = '#cbd5e1';
  ctx.font = '20px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('has successfully demonstrated operational readiness in', 600, contentStartY + 248);

  // Module Title
  ctx.fillStyle = '#f8fafc';
  ctx.font = 'bold 24px "Plus Jakarta Sans", sans-serif';
  ctx.fillText('Executive Impersonation & BEC Defense', 600, contentStartY + 292);

  // 7. Audit Score & Credential ID Metadata Box
  ctx.fillStyle = '#0a1020';
  ctx.fillRect(280, contentStartY + 338, 640, 78);
  ctx.strokeStyle = 'rgba(0, 242, 254, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(280, contentStartY + 338, 640, 78);

  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });

  // Randomized Credential ID: CYV-BEC-XXXXXX
  const chars = '0123456789ABCDEFGHJKLMNPQRSTUVWXYZ';
  let randomCode = '';
  for (let i = 0; i < 6; i++) {
    randomCode += chars.charAt(Math.floor(Math.random() * chars.length));
  }
  const certId = `CYV-BEC-${randomCode}`;

  ctx.fillStyle = '#00f2fe';
  ctx.font = 'bold 16px "Fira Code", monospace';
  ctx.fillText(`AUDIT SCORE: ${score}/4 TRIAGE SCENARIOS RESOLVED`, 600, contentStartY + 368);

  ctx.fillStyle = '#94a3b8';
  ctx.font = '14px "Fira Code", monospace';
  ctx.fillText(`Issued: ${today}   |   Credential ID: ${certId}`, 600, contentStartY + 396);

  // 8. Footer Security Banner
  ctx.fillStyle = '#070c18';
  ctx.fillRect(160, 742, 880, 44);
  ctx.strokeStyle = 'rgba(16, 185, 129, 0.35)';
  ctx.lineWidth = 1;
  ctx.strokeRect(160, 742, 880, 44);

  ctx.fillStyle = '#64748b';
  ctx.font = '13px "Fira Code", monospace';
  ctx.fillText('Client-Side Verified • Zero Credentials Stored • Cyvexis Hub', 600, 769);

  // 9. Automated PNG Download Trigger
  const safeFilename = name.trim().replace(/[^a-zA-Z0-9_-]/g, '_');
  const downloadLink = document.createElement('a');
  downloadLink.download = `Cyvexis_Module3_Certificate_${safeFilename}.png`;
  downloadLink.href = canvas.toDataURL('image/png');
  document.body.appendChild(downloadLink);
  downloadLink.click();
  document.body.removeChild(downloadLink);
}

// Ensure the score display is initialized on load
document.addEventListener('DOMContentLoaded', () => {
  updateScoreDisplay();
});

/* ==========================================================================
   STRICT LEARNING MODE SWITCHER (3-Min Video Track vs 2-Min Article Track)
   ========================================================================== */
window.currentLearningMode = 'video';

function setLearningMode(mode) {
  const cardVideo = document.getElementById('cardChoiceVideo');
  const cardArticle = document.getElementById('cardChoiceArticle');
  const btnVideo = document.getElementById('btnLabelVideo');
  const btnArticle = document.getElementById('btnLabelArticle');
  const videoTrack = document.getElementById('videoTrackContent');
  const articleTrack = document.getElementById('articleTrackContent');
  const videoEl = document.getElementById('becVideo');

  if (mode === 'video') {
    window.currentLearningMode = 'video';
    if (cardVideo) cardVideo.classList.add('active');
    if (cardArticle) cardArticle.classList.remove('active');
    if (btnVideo) {
      btnVideo.textContent = 'Selected Track ✓';
      btnVideo.className = 'btn-choice-select';
    }
    if (btnArticle) {
      btnArticle.textContent = 'Choose Reading Track ➔';
      btnArticle.className = 'btn-choice-select secondary';
    }
    // Show ONLY Video Track, Hide Article Track
    if (videoTrack) videoTrack.style.display = 'block';
    if (articleTrack) articleTrack.style.display = 'none';

    if (videoTrack) {
      videoTrack.scrollIntoView({ behavior: 'smooth', block: 'nearest' });
    }
  } else if (mode === 'article') {
    window.currentLearningMode = 'article';
    if (cardArticle) cardArticle.classList.add('active');
    if (cardVideo) cardVideo.classList.remove('active');
    if (btnArticle) {
      btnArticle.textContent = 'Selected Track ✓';
      btnArticle.className = 'btn-choice-select';
    }
    if (btnVideo) {
      btnVideo.textContent = 'Choose Video Track ➔';
      btnVideo.className = 'btn-choice-select secondary';
    }
    // Pause video if HTML5 video element is playing
    if (videoEl && typeof videoEl.pause === 'function' && !videoEl.paused) {
      videoEl.pause();
    }
    // Show ONLY Article Track, Hide Video Track
    if (videoTrack) videoTrack.style.display = 'none';
    if (articleTrack) articleTrack.style.display = 'block';

    if (articleTrack) {
      articleTrack.scrollIntoView({ behavior: 'smooth', block: 'start' });
    }
  }
}
window.setLearningMode = setLearningMode;

// Automatically detect when the video finishes playing in Module 3!
document.addEventListener('DOMContentLoaded', () => {
  const videoEl = document.getElementById('becVideo');
  const completionNotice = document.getElementById('videoCompletionNotice');
  const proceedBtn = document.getElementById('btnProceedQuiz');

  if (videoEl) {
    videoEl.addEventListener('ended', () => {
      if (completionNotice) {
        completionNotice.style.display = 'flex';
      }
      if (proceedBtn) {
        proceedBtn.classList.add('highlight-pulse');
      }
      const quizSection = document.getElementById('triageAssessments');
      if (quizSection) {
        setTimeout(() => {
          quizSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }, 1200);
      }
    });
  }
});


