/**
 * Cyvexis Cybersecurity Training Platform
 * Module 05: Incident Response, Account Compromise & Containment Triage
 * Engine: Interactive Threat Simulators, 6-Question Assessment HUD, & 2D Canvas Verified Certificate
 */

// Global User Fallback Helpers
const getAuthenticatedUserName = () => {
  if (typeof window.userName !== 'undefined' && window.userName) {
    return window.userName;
  }
  if (typeof window.currentUser !== 'undefined' && window.currentUser && window.currentUser.fullName) {
    return window.currentUser.fullName;
  }
  return 'Student';
};

/* ==========================================================================
   1. QUIZ DATA SPECIFICATION (6 Questions - Minimum 5/6 or 80% to Pass)
   ========================================================================== */
const QUIZ_DATA = [
  {
    id: 1,
    question: "An employee notices that client emails containing invoices are automatically bypassing their inbox and moving directly into the RSS Feeds folder. What is the most likely cause?",
    options: [
      "An automated spam filter update by the email provider.",
      "An unauthorized inbox forwarding or redirection rule created by an adversary.",
      "A corrupted local email client cache that needs re-indexing.",
      "The client's mail server configured an invalid SPF record."
    ],
    correctIndex: 1,
    explanation: "Adversaries frequently configure stealthy inbox rules to divert incoming payment and security notices into obscure folders like RSS Feeds or Trash."
  },
  {
    id: 2,
    question: "What is the very first action an administrator should take upon confirming an active account compromise?",
    options: [
      "Power off the user's workstation immediately to prevent disk writes.",
      "Revoke all active sessions and refresh tokens across identity providers.",
      "Send a company-wide email warning everyone about the breach.",
      "Change the user's password while leaving active sessions open for monitoring."
    ],
    correctIndex: 1,
    explanation: "Changing a password without revoking active sessions and tokens allows attackers with existing session cookies to maintain persistent unauthorized access."
  },
  {
    id: 3,
    question: "When isolating a suspected malware-infected workstation during an incident, why should you disconnect network cables rather than powering down the computer?",
    options: [
      "Powering down permanently corrupts the operating system registry.",
      "Volatile memory (RAM) containing active forensic artifacts is lost upon power-off.",
      "Network isolation automatically deletes malware from the hard drive.",
      "Shutting down alerts the attacker via hardware sensor telemetry."
    ],
    correctIndex: 1,
    explanation: "Powering down erases volatile memory (RAM), which holds crucial forensic evidence such as running malicious processes, injected memory keys, and active network sockets."
  },
  {
    id: 4,
    question: "A finance manager receives an email from an established supplier requesting urgent payment updates to a new bank account due to an 'audit freeze'. What is the mandatory verification protocol?",
    options: [
      "Reply directly to the email requesting written signed confirmation from the vendor.",
      "Inspect the email headers to confirm SPF passes, then process payment immediately.",
      "Call the vendor using the pre-established contact number from your internal procurement records.",
      "Ask the vendor to send a high-resolution scanned voided check via WhatsApp."
    ],
    correctIndex: 2,
    explanation: "Out-of-band verification using a previously vetted phone number from internal master records is the only reliable way to detect BEC and vendor invoice interception."
  },
  {
    id: 5,
    question: "What does an 'Impossible Travel' alert in cloud identity logs indicate?",
    options: [
      "A user authenticated from two distant geographical locations within a timeframe physically impossible to travel between.",
      "A user attempted to access internal resources using public transportation Wi-Fi.",
      "A VPN server failed to route traffic across international boundaries.",
      "An employee traveled abroad without registering their itinerary with IT security."
    ],
    correctIndex: 0,
    explanation: "Impossible travel alerts trigger when logins occur from disparate physical locations (e.g., London and Singapore) within minutes or hours, indicating credential compromise or session hijacking."
  },
  {
    id: 6,
    question: "Why is it dangerous to coordinate incident response activities using the compromised organization's primary corporate email?",
    options: [
      "Email protocols are restricted by law during active cyber incidents.",
      "The attacker may possess persistent mailbox access and monitor response strategies in real time.",
      "Incident response communications require encrypted PGP keys by default.",
      "Email logs automatically overwrite previous audit history during an active alert."
    ],
    correctIndex: 1,
    explanation: "If an attacker holds mailbox access or global tenant observation privileges, coordinating response efforts on that channel tips them off and allows them to erase tracks or deploy ransomware."
  }
];

const PASSING_SCORE = 5; // Minimum 5 out of 6 (83.3% >= 80%)

let score = 0;
const answeredQuestions = new Set();
let quizCompleted = false;
let quizPassed = false;
window.module5QuizPassed = false;

/* ==========================================================================
   2. SIMULATOR TAB SWITCHING & INTERACTIVE TOOLS
   ========================================================================== */
function switchSimTab(tabId) {
  const tabs = document.querySelectorAll('.sim-tab-btn');
  const panels = document.querySelectorAll('.sim-tab-panel');

  tabs.forEach(btn => {
    if (btn.getAttribute('data-tab') === tabId) {
      btn.classList.add('active');
    } else {
      btn.classList.remove('active');
    }
  });

  panels.forEach(panel => {
    if (panel.id === `tab-${tabId}`) {
      panel.classList.add('active');
    } else {
      panel.classList.remove('active');
    }
  });
}
window.switchSimTab = switchSimTab;

function purgeMaliciousRule() {
  const row = document.getElementById('maliciousRuleRow');
  const alertBox = document.getElementById('rulePurgeAlert');
  if (row) {
    row.style.opacity = '0.5';
    row.style.pointerEvents = 'none';
  }
  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.innerHTML = '<strong>✓ Incident Containment Action:</strong> Rule Purged &amp; Forensic Trace Logged. Adversary redirect chain severed.';
  }
}
window.purgeMaliciousRule = purgeMaliciousRule;

function triggerGlobalRevocation() {
  const statusEl = document.getElementById('revocationStatus');
  if (statusEl) {
    statusEl.style.display = 'block';
    statusEl.innerHTML = '<strong>⚡ Global Invalidation Broadcasted:</strong> Terminated all active browser cookies, revoked OAuth grants, and refreshed token lifetimes across Microsoft 365 &amp; Google Workspace.';
  }
}
window.triggerGlobalRevocation = triggerGlobalRevocation;

/* ==========================================================================
   3. INTERACTIVE QUIZ ENGINE
   ========================================================================== */
function checkAnswer(qId, selectedIndex, buttonEl) {
  if (answeredQuestions.has(qId)) return;

  answeredQuestions.add(qId);
  const qData = QUIZ_DATA.find(q => q.id === qId);
  if (!qData) return;

  const card = document.getElementById(`qCard${qId}`);
  const fb = document.getElementById(`fb${qId}`);
  const statusBadge = document.getElementById(`status${qId}`);
  const allButtons = card ? card.querySelectorAll('.opt-btn') : [];

  const isCorrect = (selectedIndex === qData.correctIndex);

  // Disable all buttons in this question card
  allButtons.forEach(btn => {
    btn.disabled = true;
  });

  if (isCorrect) {
    score++;
    buttonEl.classList.add('correct');
    if (card) {
      card.classList.add('answered-correct');
    }
    if (statusBadge) {
      statusBadge.textContent = 'VERIFIED';
      statusBadge.className = 'status-indicator correct';
    }
    if (fb) {
      fb.className = 'feedback-msg correct';
      fb.innerHTML = `<strong>✓ Correct:</strong> ${qData.explanation}`;
      fb.style.display = 'block';
    }
  } else {
    buttonEl.classList.add('wrong');
    // Highlight the correct answer
    if (allButtons[qData.correctIndex]) {
      allButtons[qData.correctIndex].classList.add('correct');
    }
    if (card) {
      card.classList.add('answered-wrong');
    }
    if (statusBadge) {
      statusBadge.textContent = 'DEFICIENT';
      statusBadge.className = 'status-indicator wrong';
    }
    if (fb) {
      fb.className = 'feedback-msg wrong';
      fb.innerHTML = `<strong>✗ Incorrect:</strong> ${qData.explanation}`;
      fb.style.display = 'block';
    }
  }

  updateScoreDisplay();

  // If all 6 questions have been answered, evaluate completion
  if (answeredQuestions.size === QUIZ_DATA.length) {
    quizCompleted = true;
    quizPassed = (score >= PASSING_SCORE);
    window.module5QuizPassed = quizPassed;
    showTriageResults();
  }
}
window.checkAnswer = checkAnswer;

function updateScoreDisplay() {
  const scoreDisplay = document.getElementById('scoreDisplay');
  if (!scoreDisplay) return;

  scoreDisplay.textContent = `Score: ${score} / ${QUIZ_DATA.length} Resolved`;

  if (score >= PASSING_SCORE) {
    scoreDisplay.classList.add('complete');
  } else {
    scoreDisplay.classList.remove('complete');
  }
}

function showTriageResults() {
  const resultsCard = document.getElementById('triageResultsCard');
  if (!resultsCard) return;

  const percentage = Math.round((score / QUIZ_DATA.length) * 100);

  if (quizPassed) {
    resultsCard.innerHTML = `
      <div class="result-trophy">🏆</div>
      <h3 class="result-title" style="color: #10b981;">Triage Certified: ${score} / ${QUIZ_DATA.length} (${percentage}%)</h3>
      <p class="result-desc">
        Outstanding! You surpassed the <strong>80% passing threshold</strong> (minimum 5 of 6 correct) on Incident Response, Session Revocation & Containment Triage. Your verified Cyvexis defense certificate has been unlocked below.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="#certificateSection" class="btn-retake" style="background: linear-gradient(135deg, #10b981, #059669); border: none; text-decoration: none;">
          Claim Certificate Below ↓
        </a>
        <button type="button" class="btn-retake" onclick="resetQuiz()">
          🔄 Retake Triage Assessment
        </button>
      </div>
    `;
  } else {
    resultsCard.innerHTML = `
      <div class="result-trophy">⚠️</div>
      <h3 class="result-title" style="color: #ef4444;">Threshold Not Met: ${score} / ${QUIZ_DATA.length} (${percentage}%)</h3>
      <p class="result-desc">
        You scored <strong>${score} out of 6</strong> (${percentage}%). Cyvexis requires at least <strong>80% (5 out of 6 correct)</strong> to qualify for your official verified certificate. Review the First 60 Minutes Triage SOP above and retake the assessment.
      </p>
      <button type="button" class="btn-retake" onclick="resetQuiz()" style="background: linear-gradient(135deg, #ef4444, #b91c1c); border: none;">
        🔄 Retake Triage Assessment
      </button>
    `;
  }

  resultsCard.style.display = 'block';
  resultsCard.scrollIntoView({ behavior: 'smooth', block: 'nearest' });

  updateCertificateCardState();
}

function updateCertificateCardState() {
  const certBadge = document.getElementById('certBadge');
  const certDesc = document.getElementById('certDesc');
  const studentNameInput = document.getElementById('studentName');
  const generateBtn = document.getElementById('generateBtn');
  const certLockNotice = document.getElementById('certLockNotice');

  if (quizPassed) {
    if (certBadge) {
      certBadge.textContent = `🎉 CERTIFICATE UNLOCKED (Passed: ${score}/${QUIZ_DATA.length})`;
      certBadge.className = 'cert-badge unlocked';
    }
    if (certDesc) {
      certDesc.textContent = 'Enter the name you would like displayed on your official Cyvexis verified defense record:';
    }
    if (studentNameInput) {
      studentNameInput.disabled = false;
      // Pre-fill with authenticated user name if field is empty
      if (!studentNameInput.value.trim()) {
        studentNameInput.value = getAuthenticatedUserName();
      }
    }
    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
      generateBtn.style.cursor = 'pointer';
    }
    if (certLockNotice) {
      certLockNotice.style.display = 'none';
    }
  } else {
    if (certBadge) {
      certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 80% (5/6) REQUIRED';
      certBadge.className = 'cert-badge';
    }
    if (certDesc) {
      certDesc.innerHTML = `<span style="color: #f87171;">Complete all 6 threat evaluation questions above with at least 80% (5/6) correct to unlock your official verified certificate.</span>`;
    }
    if (studentNameInput) {
      studentNameInput.disabled = true;
    }
    if (generateBtn) {
      generateBtn.disabled = true;
      generateBtn.style.opacity = '0.5';
      generateBtn.style.cursor = 'not-allowed';
    }
    if (certLockNotice) {
      certLockNotice.style.display = 'block';
      certLockNotice.innerHTML = `❌ Certificate locked. Score at least 5 out of 6 (80%) on the assessment to unlock.`;
      certLockNotice.style.color = '#ef4444';
    }
  }
}

function resetQuiz() {
  score = 0;
  answeredQuestions.clear();
  quizCompleted = false;
  quizPassed = false;
  window.module5QuizPassed = false;
  updateScoreDisplay();

  const resultsCard = document.getElementById('triageResultsCard');
  if (resultsCard) resultsCard.style.display = 'none';

  for (let i = 1; i <= QUIZ_DATA.length; i++) {
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
    certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 80% (5/6) REQUIRED';
    certBadge.className = 'cert-badge';
  }
  if (certDesc) {
    certDesc.textContent = 'Complete all 6 threat evaluation questions above with at least 80% (5/6) correct to unlock your official verified certificate.';
  }
  if (studentNameInput) studentNameInput.disabled = true;
  if (generateBtn) {
    generateBtn.disabled = true;
    generateBtn.style.opacity = '0.5';
    generateBtn.style.cursor = 'not-allowed';
  }
  if (certLockNotice) {
    certLockNotice.style.display = 'block';
    certLockNotice.textContent = '⚠️ Complete all 6 threat evaluation questions above to unlock download access.';
    certLockNotice.style.color = '#f59e0b';
  }

  const firstCard = document.getElementById('quizSection');
  if (firstCard) firstCard.scrollIntoView({ behavior: 'smooth' });
}
window.resetQuiz = resetQuiz;

/* ==========================================================================
   4. VERIFIED CERTIFICATE GENERATOR (2048 x 1142 HTML5 Canvas)
   ========================================================================== */
const MODULE5_CONFIG = {
  code: 'M05',
  filePrefix: 'Module5',
  title: 'Module 5: Incident Response, Account Compromise & Containment Triage',
  descLine1: 'An intensive cybersecurity training module covering account compromise indicators, session revocation,',
  descLine2: 'volatile RAM forensic preservation, and emergency out-of-band containment triage.'
};

function generateCertificate() {
  if (answeredQuestions.size < QUIZ_DATA.length) {
    alert('Please complete all 6 Threat Evaluation questions before generating your certificate.');
    const quizSec = document.getElementById('quizSection');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (score < PASSING_SCORE) {
    alert(`Certificate Locked: You scored ${score} / 6. You must achieve at least 80% (minimum 5 out of 6 correct) to unlock and download your certificate. Please click 'Retake Triage Assessment' to try again.`);
    const quizSec = document.getElementById('quizSection');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  const nameInput = document.getElementById('studentName');
  const enteredName = nameInput ? nameInput.value.trim() : '';
  const authName = getAuthenticatedUserName();
  const studentName = enteredName || authName || 'Student';

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

  const btn = document.getElementById('generateBtn');
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

    // 2. Course Title (bold serif)
    ctx.fillStyle = navyColor;
    ctx.font = 'bold 34px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE5_CONFIG.title, centerX, 684);

    // 3. Module Description (italic serif)
    ctx.fillStyle = descColor;
    ctx.font = 'italic 26px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE5_CONFIG.descLine1, centerX, 752);
    if (MODULE5_CONFIG.descLine2) {
      ctx.fillText(MODULE5_CONFIG.descLine2, centerX, 788);
    }

    // 4. Date & ID
    const today = new Date();
    const formattedDate = `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `ID: CYV-${today.getFullYear()}-${MODULE5_CONFIG.code}-${randomSuffix}`;

    ctx.font = '500 25px "Courier New", Consolas, monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText(formattedDate, 760, 960);
    ctx.fillText(certId, 1220, 960);

    setTimeout(() => {
      const cleanName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Cyvexis_Module5_Certificate_${cleanName}.png`;
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

/* ==========================================================================
   INITIALIZATION
   ========================================================================== */
document.addEventListener('DOMContentLoaded', () => {
  updateScoreDisplay();

  const studentNameInput = document.getElementById('studentName');
  if (studentNameInput) {
    const authName = getAuthenticatedUserName();
    if (authName && authName !== 'Student') {
      studentNameInput.value = authName;
    }

    studentNameInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && !studentNameInput.disabled) {
        e.preventDefault();
        generateCertificate();
      }
    });
  }
});
