/**
 * Cyvexis Cybersecurity Training Platform
 * Module 06: Cloud Security, Data Privacy & API Protection
 * Engine: Interactive Cloud & API Simulators, 6-Question Assessment HUD, & 2D Canvas Verified Certificate
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
    question: "Under the Cloud Shared Responsibility Model, which security layer is exclusively the customer's responsibility in Infrastructure-as-a-Service (IaaS)?",
    options: [
      "Physical perimeter security and cooling of the data center.",
      "Hardware hypervisor maintenance and server firmware patching.",
      "Customer data classification, OS configuration, and IAM role assignment.",
      "Global fiber network cabling and undersea cable redundancy."
    ],
    correctIndex: 2,
    explanation: "In IaaS, the cloud provider manages physical hardware and facilities, while the customer is strictly responsible for guest OS configuration, IAM policies, and data security."
  },
  {
    id: 2,
    question: "A developer accidentally pushes an AWS root access key to a public GitHub repository. Within minutes, the key is compromised. What is the root cause of this rapid exposure?",
    options: [
      "GitHub automatically revokes and deletes all public repositories with errors.",
      "Adversaries run automated bots that continuously scrape public commits for API token patterns.",
      "The cloud provider broadcasts secret pushes to all registered users.",
      "The local IDE automatically forwards credentials to open DNS resolvers."
    ],
    correctIndex: 1,
    explanation: "Threat actors operate automated scraping bots that monitor public GitHub and GitLab commit feeds in real time to capture exposed credentials within seconds."
  },
  {
    id: 3,
    question: "What is the most secure method for applications to access third-party API credentials in modern production environments?",
    options: [
      "Hardcode the token into client-side JavaScript source code.",
      "Retrieve short-lived secrets dynamically from a dedicated secrets manager or environment vault.",
      "Store plaintext API keys in a public `.env` file committed to version control.",
      "Send the API token in the URL query string parameter for every HTTP request."
    ],
    correctIndex: 1,
    explanation: "Dynamic retrieval from a dedicated secrets vault ensures tokens are rotated automatically, encrypted at rest, and never exposed in version control."
  },
  {
    id: 4,
    question: "Which scenario represents an unacceptable 'Shadow IT' risk under data protection frameworks like the DPDP Act or GDPR?",
    options: [
      "Using the company's approved, SSO-integrated cloud storage platform.",
      "Pasting unredacted customer databases into an unsanctioned, public third-party AI tool for analysis.",
      "Using multi-factor hardware keys to authenticate into the company code repository.",
      "Submitting weekly project time tracking logs via an approved internal portal."
    ],
    correctIndex: 1,
    explanation: "Uploading proprietary or regulated customer PII into unauthorized third-party apps creates uncontrolled data exfiltration and violates privacy compliance statutes."
  },
  {
    id: 5,
    question: "What principle should govern how cloud IAM (Identity and Access Management) permissions are granted to services and users?",
    options: [
      "Assign full wildcard administrative access (`*`) to eliminate deployment friction.",
      "Principle of Least Privilege: grant only the minimum permissions necessary to complete the task.",
      "Grant root account credentials to every team member during onboarding.",
      "Share a single administrative service account across all microservices."
    ],
    correctIndex: 1,
    explanation: "The Principle of Least Privilege limits damage in the event of credential compromise by restricting accounts strictly to essential access rights."
  },
  {
    id: 6,
    question: "An employee grants a free browser extension permission to 'Read and modify all data on all websites'. What specific danger does this introduce?",
    options: [
      "The browser will refuse to render encrypted TLS web pages.",
      "The extension can intercept session tokens, passwords, and form submissions in real time.",
      "The operating system will automatically disable firewall protections.",
      "The device's physical network adapter will be permanently throttled."
    ],
    correctIndex: 1,
    explanation: "Over-privileged extensions can read DOM contents, capture keystrokes, and steal authentication tokens directly out of the browser session."
  }
];

const PASSING_SCORE = 5; // Minimum 5 out of 6 (83.3% >= 80%)

let score = 0;
const answeredQuestions = new Set();
let quizCompleted = false;
let quizPassed = false;
window.module6QuizPassed = false;

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

// Tab 1: S3 / Cloud Storage Remediation
function remediateStorageBucket() {
  const bucketCard = document.getElementById('exposedBucketCard');
  const bucketStatus = document.getElementById('bucketStatusBadge');
  const bucketAcl = document.getElementById('bucketAclText');
  const bucketEnc = document.getElementById('bucketEncText');
  const alertBox = document.getElementById('bucketRemediateAlert');
  const btn = document.getElementById('btnRemediateBucket');

  if (bucketCard) {
    bucketCard.classList.remove('exposed');
    bucketCard.style.borderColor = 'var(--emerald-safe)';
    bucketCard.style.background = 'rgba(16, 185, 129, 0.05)';
  }
  if (bucketStatus) {
    bucketStatus.textContent = 'SECURE (BLOCK PUBLIC ACCESS)';
    bucketStatus.className = 'terminal-status-badge safe';
  }
  if (bucketAcl) bucketAcl.textContent = 'Private // Global BPA Enabled';
  if (bucketEnc) bucketEnc.textContent = 'AWS-KMS (AES-256) Enforced';

  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.innerHTML = '<strong>✓ Cloud Security Hardening Complete:</strong> S3 Block Public Access applied globally. Public ACLs purged, and server-side encryption (SSE-KMS AES-256) enforced for all backup objects.';
  }

  if (btn) {
    btn.textContent = '✓ Bucket Hardened & Access Blocked';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'default';
  }
}
window.remediateStorageBucket = remediateStorageBucket;

// Tab 2: Git Secret Scanner Remediation
function remediateGitSecrets() {
  const codeBlock = document.getElementById('gitCodeBlock');
  const scannerStatus = document.getElementById('gitScannerBadge');
  const alertBox = document.getElementById('gitRemediateAlert');
  const btn = document.getElementById('btnRemediateGit');

  if (codeBlock) {
    codeBlock.innerHTML = `// Hardened Source Code (Production CI/CD Clean)
import { SecretsManagerClient, GetSecretValueCommand } from "@aws-sdk/client-secrets-manager";

// Dynamic Vault Retrieval: Zero Plaintext in Source Control
const client = new SecretsManagerClient({ region: "us-east-1" });
const response = await client.send(
  new GetSecretValueCommand({ SecretId: "prod/api/payment_gateway" })
);
const <span class="highlight-vault">API_CREDENTIALS</span> = JSON.parse(response.SecretString);`;
  }

  if (scannerStatus) {
    scannerStatus.textContent = 'PASSED (0 LEAKS DETECTED)';
    scannerStatus.className = 'terminal-status-badge safe';
  }

  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.innerHTML = '<strong>✓ Automated Secret Elimination:</strong> Plaintext secret purged from Git history. Dynamic Secrets Manager integration verified. Pre-commit &amp; TruffleHog CI checks passing.';
  }

  if (btn) {
    btn.textContent = '✓ Secrets Vault Integrated';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'default';
  }
}
window.remediateGitSecrets = remediateGitSecrets;

// Tab 3: Data Classification Selector
const PRIVACY_MATRIX = {
  public: {
    title: 'Public Tier Data',
    controls: 'No encryption mandatory, but integrity verification (SHA-256) recommended. Freely sharable across public marketing and documentation.',
    compliance: 'Standard copyright; exempt from GDPR/DPDP confidentiality restrictions.'
  },
  internal: {
    title: 'Internal Operational Data',
    controls: 'Role-Based Access Control (RBAC) required. Encrypted in transit via TLS 1.3. Stored in internal enterprise directories.',
    compliance: 'Proprietary enterprise data. Disclose only to verified employees and contractors under NDA.'
  },
  restricted: {
    title: 'Confidential & Restricted Data',
    controls: 'Mandatory AES-256 encryption at rest, TLS 1.3 in transit. Least Privilege IAM policies, strict multi-factor authentication, and tamper-evident audit logging.',
    compliance: 'Breach notification mandatory under cyber disclosure laws. Direct legal exposure if exfiltrated.'
  },
  pii: {
    title: 'Regulated PII & Sensitive Personal Data',
    controls: 'Field-level tokenization, strict data minimization, dynamic masking, and AES-256 storage. Zero storage in unsanctioned public SaaS/AI tools.',
    compliance: 'Strict governance under GDPR (EU) and DPDP Act (India). Explicit consent required. Penalties up to 4% global turnover or ₹250 Crore for willful negligence.'
  }
};

function selectPrivacyTier(tierKey) {
  const cards = document.querySelectorAll('.privacy-tier-card');
  cards.forEach(card => {
    if (card.getAttribute('data-tier') === tierKey) {
      card.classList.add('selected');
    } else {
      card.classList.remove('selected');
    }
  });

  const displayTitle = document.getElementById('tierDisplayTitle');
  const displayControls = document.getElementById('tierDisplayControls');
  const displayCompliance = document.getElementById('tierDisplayCompliance');

  const data = PRIVACY_MATRIX[tierKey];
  if (data) {
    if (displayTitle) displayTitle.textContent = data.title;
    if (displayControls) displayControls.textContent = data.controls;
    if (displayCompliance) displayCompliance.textContent = data.compliance;
  }
}
window.selectPrivacyTier = selectPrivacyTier;

// Tab 4: OAuth Scope & Shadow IT Auditor
function revokeOAuthScope() {
  const scopeRow = document.getElementById('oauthRogueRow');
  const statusBadge = document.getElementById('oauthStatusBadge');
  const alertBox = document.getElementById('oauthRevokeAlert');
  const btn = document.getElementById('btnRevokeOAuth');

  if (scopeRow) {
    scopeRow.style.opacity = '0.5';
    scopeRow.style.pointerEvents = 'none';
  }
  if (statusBadge) {
    statusBadge.textContent = 'ACCESS REVOKED & BLOCKED';
    statusBadge.className = 'terminal-status-badge safe';
  }
  if (alertBox) {
    alertBox.style.display = 'block';
    alertBox.innerHTML = '<strong>✓ Shadow IT Contained:</strong> Over-privileged OAuth token revoked across all workspace users. Browser extension blocked via Google Workspace / Intune device management policy.';
  }
  if (btn) {
    btn.textContent = '✓ Third-Party Application Blocked';
    btn.disabled = true;
    btn.style.opacity = '0.7';
    btn.style.cursor = 'default';
  }
}
window.revokeOAuthScope = revokeOAuthScope;

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
    window.module6QuizPassed = quizPassed;
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
      <h3 class="result-title" style="color: #10b981;">Cloud Security Certified: ${score} / ${QUIZ_DATA.length} (${percentage}%)</h3>
      <p class="result-desc">
        Outstanding! You surpassed the <strong>80% passing threshold</strong> (minimum 5 of 6 correct) on Cloud Security, Data Privacy &amp; API Protection. Your verified Cyvexis defense certificate has been unlocked below.
      </p>
      <div style="display: flex; gap: 12px; justify-content: center; flex-wrap: wrap;">
        <a href="#certificateSection" class="btn-retake" style="background: linear-gradient(135deg, #10b981, #059669); border: none; text-decoration: none;">
          Claim Certificate Below ↓
        </a>
        <button type="button" class="btn-retake" onclick="resetQuiz()">
          ↻ Retake Assessment
        </button>
      </div>
    `;

    // Unlock Certificate Section
    const certBadge = document.getElementById('certBadge');
    const certDesc = document.getElementById('certDesc');
    const studentNameInput = document.getElementById('studentName');
    const generateBtn = document.getElementById('generateBtn');
    const certLockNotice = document.getElementById('certLockNotice');

    if (certBadge) {
      certBadge.textContent = '✓ CLOUD DEFENSE CERTIFIED - MINIMUM 80% ACHIEVED';
      certBadge.className = 'cert-badge unlocked';
    }

    if (certDesc) {
      certDesc.innerHTML = `<strong>Congratulations!</strong> You verified your understanding with <strong>${score} / ${QUIZ_DATA.length}</strong> correct answers. Verify your full name below and download your official credential.`;
    }

    if (studentNameInput) {
      studentNameInput.disabled = false;
      const currentVal = studentNameInput.value.trim();
      const authName = getAuthenticatedUserName();
      if (!currentVal && authName && authName !== 'Student') {
        studentNameInput.value = authName;
      }
    }

    if (generateBtn) {
      generateBtn.disabled = false;
      generateBtn.style.opacity = '1';
      generateBtn.style.cursor = 'pointer';
    }

    if (certLockNotice) {
      certLockNotice.style.display = 'block';
      certLockNotice.textContent = '✓ Access Unlocked: Click "Download Certificate" to generate your high-resolution credential.';
      certLockNotice.style.color = '#10b981';
    }

  } else {
    resultsCard.innerHTML = `
      <div class="result-trophy">⚠️</div>
      <h3 class="result-title" style="color: #ef4444;">Passing Score Not Met: ${score} / ${QUIZ_DATA.length} (${percentage}%)</h3>
      <p class="result-desc">
        You scored ${score} out of 6. A minimum score of <strong>80% (5 out of 6 correct)</strong> is strictly required by Cyvexis security policy to unlock the verified completion certificate. Review the curriculum lessons and interactive cloud terminal, then retake the drill.
      </p>
      <button type="button" class="btn-retake" onclick="resetQuiz()">
        ↻ Retake Cloud Security Assessment
      </button>
    `;

    const certBadge = document.getElementById('certBadge');
    const certLockNotice = document.getElementById('certLockNotice');

    if (certBadge) {
      certBadge.textContent = '🔒 CERTIFICATE LOCKED - MINIMUM 80% (5/6) REQUIRED';
      certBadge.className = 'cert-badge';
    }

    if (certLockNotice) {
      certLockNotice.style.display = 'block';
      certLockNotice.textContent = `🔒 Locked: Current score is ${score}/6 (${percentage}%). Minimum 5/6 (80%) required.`;
      certLockNotice.style.color = '#ef4444';
    }
  }

  resultsCard.style.display = 'block';
}

function resetQuiz() {
  score = 0;
  answeredQuestions.clear();
  quizCompleted = false;
  quizPassed = false;
  window.module6QuizPassed = false;

  updateScoreDisplay();

  const resultsCard = document.getElementById('triageResultsCard');
  if (resultsCard) {
    resultsCard.style.display = 'none';
    resultsCard.innerHTML = '';
  }

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
    certDesc.textContent = 'Complete all 6 cloud security questions above with at least 80% (5/6) correct to unlock your official verified certificate.';
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
const MODULE6_CONFIG = {
  code: 'M06',
  filePrefix: 'Module6',
  title: 'Module 6: Cloud Security, Data Privacy & API Protection',
  descLine1: 'An intensive cybersecurity training module covering the cloud shared responsibility model,',
  descLine2: 'secrets management, automated Git leak prevention, and privacy compliance architectures.'
};

function generateCertificate() {
  if (answeredQuestions.size < QUIZ_DATA.length) {
    alert('Please complete all 6 Cloud Security questions before generating your certificate.');
    const quizSec = document.getElementById('quizSection');
    if (quizSec) quizSec.scrollIntoView({ behavior: 'smooth' });
    return;
  }

  if (score < PASSING_SCORE) {
    alert(`Certificate Locked: You scored ${score} / 6. You must achieve at least 80% (minimum 5 out of 6 correct) to unlock and download your certificate. Please click 'Retake Cloud Security Assessment' to try again.`);
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
    ctx.font = 'bold 32px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE6_CONFIG.title, centerX, 684);

    // 3. Module Description (italic serif)
    ctx.fillStyle = descColor;
    ctx.font = 'italic 25px Georgia, "Times New Roman", serif';
    ctx.fillText(MODULE6_CONFIG.descLine1, centerX, 752);
    if (MODULE6_CONFIG.descLine2) {
      ctx.fillText(MODULE6_CONFIG.descLine2, centerX, 788);
    }

    // 4. Date & ID
    const today = new Date();
    const formattedDate = `Date: ${today.toLocaleDateString('en-US', { year: 'numeric', month: 'long', day: 'numeric' })}`;
    const randomSuffix = Math.floor(1000 + Math.random() * 9000);
    const certId = `ID: CYV-${today.getFullYear()}-${MODULE6_CONFIG.code}-${randomSuffix}`;

    ctx.font = '500 25px "Courier New", Consolas, monospace';
    ctx.fillStyle = '#334155';
    ctx.fillText(formattedDate, 760, 960);
    ctx.fillText(certId, 1220, 960);

    setTimeout(() => {
      const cleanName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Cyvexis_Module6_Certificate_${cleanName}.png`;
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
