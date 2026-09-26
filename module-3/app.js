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

  // Check if all 4 scenarios have been completed
  if (answeredQuestions.size === 4) {
    checkCompletion();
  }
}

let quizCompleted = false;
let quizPassed = false;
window.module3QuizPassed = false;

function checkCompletion() {
  quizCompleted = true;
  quizPassed = (score >= 2);
  window.module3QuizPassed = quizPassed;

  const resultsCard = document.getElementById('triageResultsCard');
  const certBadge = document.getElementById('certBadge');
  const certDesc = document.getElementById('certDesc');
  const studentNameInput = document.getElementById('studentName');
  const generateBtn = document.getElementById('generateBtn');
  const certLockNotice = document.getElementById('certLockNotice');

  if (resultsCard) {
    resultsCard.style.display = 'block';
    if (quizPassed) {
      resultsCard.className = 'triage-result-card passed';
      resultsCard.innerHTML = `
        <div class="result-header" style="display: flex; gap: 14px; align-items: center;">
          <span class="result-icon" style="font-size: 2.2rem;">🎉</span>
          <div>
            <h3 style="color: #10b981; margin: 0 0 6px; font-size: 1.25rem;">Threat Assessments Passed: ${score} / 4 Correct!</h3>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">Outstanding triage analysis! You met the 50% passing threshold and successfully unlocked your official Cyvexis completion certificate.</p>
          </div>
        </div>
        <div style="margin-top: 18px; display: flex; gap: 12px; flex-wrap: wrap;">
          <a href="#certificateSection" class="btn-direct-quiz" style="background: linear-gradient(135deg, #10b981, #059669); padding: 10px 20px; border-radius: 8px; text-decoration: none; color: #000 !important; font-weight: 700;">
            <span>Claim Unlocked Certificate ↓</span>
          </a>
          <button type="button" class="btn-direct-quiz" onclick="resetAssessments()" style="background: rgba(255,255,255,0.08); color: #fff !important; border: 1px solid var(--border-subtle); padding: 10px 20px; border-radius: 8px; cursor: pointer;">
            <span>🔄 Retake Assessments</span>
          </button>
        </div>
      `;
    } else {
      resultsCard.className = 'triage-result-card failed';
      resultsCard.innerHTML = `
        <div class="result-header" style="display: flex; gap: 14px; align-items: center;">
          <span class="result-icon" style="font-size: 2.2rem;">⚠️</span>
          <div>
            <h3 style="color: #ef4444; margin: 0 0 6px; font-size: 1.25rem;">Assessments Not Passed (Score: ${score} / 4)</h3>
            <p style="margin: 0; color: #cbd5e1; font-size: 0.95rem; line-height: 1.5;">You scored less than 50% (Passing requirement: minimum 2 out of 4 scenarios correct). Your certificate remains locked until you achieve at least 50%.</p>
          </div>
        </div>
        <div style="margin-top: 18px;">
          <button type="button" class="btn-direct-quiz" onclick="resetAssessments()" style="background: linear-gradient(135deg, #ef4444, #dc2626); padding: 10px 20px; border-radius: 8px; border: none; cursor: pointer; color: #fff !important; font-weight: 700;">
            <span>🔄 Retake Threat Assessments Now</span>
          </button>
        </div>
      `;
    }
  }

  if (quizPassed) {
    if (certBadge) {
      certBadge.textContent = '🛡️ VERIFIED COMPLETION RECORD';
      certBadge.style.color = '#00f2fe';
      certBadge.style.borderColor = 'rgba(0, 242, 254, 0.4)';
      certBadge.style.background = 'rgba(0, 242, 254, 0.1)';
    }
    if (certDesc) {
      certDesc.textContent = 'Complete the triage assessments above to generate your downloadable, client-side cryptographic awareness certificate.';
    }
    if (studentNameInput) studentNameInput.disabled = false;
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
      generateBtn.style.cursor = 'pointer';
    }
    if (certLockNotice) certLockNotice.style.display = 'none';
  } else {
    if (certBadge) {
      certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 2/4 REQUIRED';
      certBadge.style.color = '#ef4444';
      certBadge.style.borderColor = 'rgba(239, 68, 68, 0.4)';
      certBadge.style.background = 'rgba(239, 68, 68, 0.1)';
    }
    if (certDesc) {
      certDesc.innerHTML = `<span style="color: #f87171;">You scored ${score}/4. You must score at least 2/4 (50%) to unlock the certificate.</span>`;
    }
    if (studentNameInput) studentNameInput.disabled = true;
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.5';
      generateBtn.style.cursor = 'not-allowed';
    }
    if (certLockNotice) {
      certLockNotice.style.display = 'block';
      certLockNotice.innerHTML = `❌ Certificate locked. Click <strong>Retake Threat Assessments</strong> above and score at least 2/4 to unlock.`;
      certLockNotice.style.color = '#ef4444';
    }
  }
}

function resetAssessments() {
  score = 0;
  answeredQuestions.clear();
  quizCompleted = false;
  quizPassed = false;
  window.module3QuizPassed = false;
  updateScoreDisplay();

  const resultsCard = document.getElementById('triageResultsCard');
  if (resultsCard) resultsCard.style.display = 'none';

  for (let i = 1; i <= 4; i++) {
    const card = document.getElementById(`qCard${i}`);
    if (card) {
      card.classList.remove('answered-correct', 'answered-wrong');
      const buttons = card.querySelectorAll('.opt-btn');
      buttons.forEach(btn => {
        btn.disabled = false;
        btn.classList.remove('correct', 'wrong');
      });
      const fb = document.getElementById(`fb${i}`);
      if (fb) {
        fb.style.display = 'none';
        fb.innerHTML = '';
      }
      const statusBadge = document.getElementById(`status${i}`);
      if (statusBadge) {
        statusBadge.textContent = 'PENDING';
        statusBadge.className = 'status-indicator';
      }
    }
  }

  const certBadge = document.getElementById('certBadge');
  const certDesc = document.getElementById('certDesc');
  const studentNameInput = document.getElementById('studentName');
  const generateBtn = document.getElementById('generateBtn');
  const certLockNotice = document.getElementById('certLockNotice');

  if (certBadge) {
    certBadge.textContent = '🔒 CERTIFICATE LOCKED';
    certBadge.style.color = '';
    certBadge.style.borderColor = '';
    certBadge.style.background = '';
  }
  if (certDesc) {
    certDesc.textContent = 'Complete all 4 threat evaluation assessments above with at least 50% (2/4) correct to unlock your official verified certificate.';
  }
  if (studentNameInput) studentNameInput.disabled = true;
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.6';
    generateBtn.style.cursor = 'not-allowed';
  }
  if (certLockNotice) {
    certLockNotice.style.display = 'block';
    certLockNotice.textContent = '⚠️ Complete all 4 threat evaluations above to unlock download access.';
    certLockNotice.style.color = '#f59e0b';
  }

  const firstCard = document.getElementById('triageAssessments');
  if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });
}
window.resetAssessments = resetAssessments;

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

const MODULE3_CONFIG = {
  code: 'M03',
  filePrefix: 'Module3',
  title: 'MODULE 03: EXECUTIVE IMPERSONATION & BEC DEFENSE',
  descLine1: 'An intensive cybersecurity training module covering Business Email Compromise triage,',
  descLine2: 'executive spoofing detection, and out-of-band verification.'
};

/**
 * Generates and downloads the verified completion certificate using the unified cream parchment template.
 */
function generateCertificate() {
  if (answeredQuestions.size < 4) {
    alert('Please complete all 4 Threat Evaluation Assessments before generating your certificate.');
    const assessSec = document.getElementById('triageAssessments');
    if (assessSec) assessSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (score < 2) {
    alert(`Certificate Locked: You scored ${score} / 4. You must achieve at least 50% (minimum 2 out of 4 correct) to unlock and download your certificate. Please click 'Retake Threat Assessments' to try again.`);
    const assessSec = document.getElementById('triageAssessments');
    if (assessSec) assessSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const nameInput = document.getElementById('studentName');
  const studentName = (nameInput ? nameInput.value.trim() : '');

  if (!studentName) {
    alert('Please enter your full name to generate your verified Cyvexis certificate.');
    if (nameInput) nameInput.focus();
    return;
  }

  const canvas = document.getElementById('certCanvas');
  if (!canvas) {
    console.error('Certificate canvas element #certCanvas not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) return;

  const btn = document.getElementById('generateBtn') || document.querySelector('.btn-download-cert') || document.querySelector('button[onclick*="generateCertificate"]');
  const originalBtnText = btn ? btn.innerHTML : 'Download Certificate';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⏳ Rendering Certificate...</span>';
  }

  const templateImg = new Image();
  templateImg.crossOrigin = 'anonymous';

  templateImg.onload = function() {
    canvas.width = 2048;
    canvas.height = 1142;

    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.drawImage(templateImg, 0, 0, 2048, 1142);

    const centerX = 1024;
    const navyColor = '#0c1b33';
    const descColor = '#1e293b';

    // 1. Recipient Full Name (bold serif in deep navy)
    ctx.textAlign = 'center';
    ctx.textBaseline = 'middle';
    ctx.fillStyle = navyColor;
    let nameFontSize = 50;
    ctx.font = `bold ${nameFontSize}px Georgia, "Times New Roman", serif`;
    while (ctx.measureText(studentName.toUpperCase()).width > 1200 && nameFontSize > 28) {
      nameFontSize -= 2;
      ctx.font = `bold ${nameFontSize}px Georgia, "Times New Roman", serif`;
    }
    ctx.fillText(studentName.toUpperCase(), centerX, 542);

    // 2. Module Title (bold serif)
    ctx.fillStyle = navyColor;
    ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE3_CONFIG.title, centerX, 684);

    // 3. Module Description (italic serif)
    ctx.fillStyle = descColor;
    ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE3_CONFIG.descLine1, centerX, 752);
    if (MODULE3_CONFIG.descLine2) {
      ctx.fillText(MODULE3_CONFIG.descLine2, centerX, 788);
    }

    // 4. Date & ID
    const today = new Date();
    const formattedDate = `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `ID: CYV-${today.getFullYear()}-${MODULE3_CONFIG.code}-${randomSuffix}`;

    ctx.font = '500 25px "Courier New", Consolas, monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText(formattedDate, 760, 960);
    ctx.fillText(certId, 1220, 960);

    setTimeout(() => {
      const cleanName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Cyvexis_Module3_Certificate_${cleanName}.png`;
      const dataUrl = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);

      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }, 200);
  };

  templateImg.onerror = function() {
    alert("Could not load certificate template. Please refresh and try again.");
    if (btn) {
      btn.disabled = false;
      btn.innerHTML = originalBtnText;
    }
  };

  templateImg.src = 'certificate-template.png';
}

window.generateCertificate = generateCertificate;

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


