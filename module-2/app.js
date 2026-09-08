/**
 * CYVEXIS SECURITY TRAINING: MODULE 02
 * Password Hygiene & MFA Fatigue: Defending Against Credential Attacks
 * Interactive Controller & Simulation Engine
 */

document.addEventListener('DOMContentLoaded', () => {
  initMfaFatigueSimulation();
  initEntropyLab();
  initScenarioQuiz();
  initEmbedModal();
  initTakeawayChecklist();
  initCertificateGenerator();
});

/* ==========================================================================
   1. INTERACTIVE MFA FATIGUE SIMULATION ENGINE
   ========================================================================== */
function initMfaFatigueSimulation() {
  const phoneFrame = document.querySelector('.sim-phone-frame');
  const notifStack = document.getElementById('sim-notification-stack');
  const counterBadge = document.getElementById('prompt-counter-badge');
  const telemCount = document.getElementById('telem-count');
  const telemHaptic = document.getElementById('telem-haptic');
  const btnDeny = document.getElementById('sim-btn-deny');
  const btnApprove = document.getElementById('sim-btn-approve');
  const btnRestart = document.getElementById('btn-restart-sim');
  const btnToggleSound = document.getElementById('btn-toggle-sound');
  const soundBtnText = document.getElementById('sound-btn-text');

  const feedbackBox = document.getElementById('sim-feedback-box');
  const feedbackDot = document.getElementById('feedback-dot');
  const feedbackTitle = document.getElementById('feedback-title');
  const feedbackBody = document.getElementById('feedback-body');
  const feedbackTip = document.getElementById('feedback-tip');

  let soundEnabled = true;
  let attackInterval = null;
  let vibrateInterval = null;
  let currentPromptCount = 1;
  const maxPrompts = 12;

  // Web Audio Context for notification chimes & haptic clicks
  let audioCtx = null;
  function playBeep(freq = 520, duration = 0.12, type = 'sine') {
    if (!soundEnabled) return;
    try {
      if (!audioCtx) {
        const AudioContext = window.AudioContext || window.webkitAudioContext;
        if (AudioContext) audioCtx = new AudioContext();
      }
      if (audioCtx && audioCtx.state === 'suspended') {
        audioCtx.resume();
      }
      if (!audioCtx) return;

      const osc = audioCtx.createOscillator();
      const gain = audioCtx.createGain();
      osc.type = type;
      osc.frequency.setValueAtTime(freq, audioCtx.currentTime);
      gain.gain.setValueAtTime(0.08, audioCtx.currentTime);
      gain.gain.exponentialRampToValueAtTime(0.001, audioCtx.currentTime + duration);

      osc.connect(gain);
      gain.connect(audioCtx.destination);
      osc.start();
      osc.stop(audioCtx.currentTime + duration);
    } catch (e) {
      // Audio not permitted or supported in iframe
    }
  }

  function playAlertChime() {
    playBeep(680, 0.08, 'triangle');
    setTimeout(() => playBeep(880, 0.12, 'sine'), 90);
  }

  // Trigger one barrage round
  function triggerIncomingPush() {
    if (currentPromptCount < maxPrompts) {
      currentPromptCount++;
      counterBadge.textContent = `${currentPromptCount} of ${maxPrompts}`;
      telemCount.textContent = `${currentPromptCount} Requests`;

      // Append mini notification item in background stack
      const mini = document.createElement('div');
      mini.className = 'sim-push-mini-card';
      mini.innerHTML = `
        <span>🔑 Sign-in request #${currentPromptCount}</span>
        <span class="mini-time">02:${14 + Math.floor(currentPromptCount / 2)} AM</span>
      `;
      if (notifStack.firstChild) {
        notifStack.insertBefore(mini, notifStack.firstChild);
      } else {
        notifStack.appendChild(mini);
      }

      // Keep max 3 visible in mini stack
      while (notifStack.children.length > 3) {
        notifStack.removeChild(notifStack.lastChild);
      }

      // Trigger phone vibration pulse
      triggerPhoneVibrate();
      playAlertChime();
    }
  }

  function triggerPhoneVibrate() {
    if (!phoneFrame) return;
    phoneFrame.classList.add('vibrating');
    telemHaptic.textContent = 'Active (Vibrating)';
    setTimeout(() => {
      phoneFrame.classList.remove('vibrating');
      telemHaptic.textContent = 'Idle (Awaiting next)';
    }, 450);
  }

  function startAttack() {
    stopAttack();
    currentPromptCount = 1;
    counterBadge.textContent = `1 of ${maxPrompts}`;
    telemCount.textContent = `1 Request`;
    notifStack.innerHTML = '';

    feedbackDot.className = 'status-indicator-dot pulse-amber';
    feedbackTitle.textContent = 'Attack In Progress (2:14 AM)...';
    feedbackBody.innerHTML = `
      The attacker already acquired your password from a previous data breach and is bombarding your phone with continuous authentication pushes. Notice the psychological urge to tap "Approve" just to silence the device.
    `;
    feedbackTip.innerHTML = `💡 <strong>Remember:</strong> Tapping "Approve" does not make the attacker go away; it grants them full access to your account.`;

    btnDeny.disabled = false;
    btnApprove.disabled = false;

    // Push barrage every 4 seconds
    attackInterval = setInterval(triggerIncomingPush, 4200);
  }

  function stopAttack() {
    if (attackInterval) clearInterval(attackInterval);
    if (vibrateInterval) clearInterval(vibrateInterval);
    if (phoneFrame) phoneFrame.classList.remove('vibrating');
    if (telemHaptic) telemHaptic.textContent = 'Stopped';
  }

  // Handle User Clicks on Deny
  btnDeny.addEventListener('click', () => {
    stopAttack();
    playBeep(440, 0.15, 'sine');
    btnDeny.disabled = true;
    btnApprove.disabled = true;

    feedbackDot.className = 'status-indicator-dot pulse-emerald';
    feedbackTitle.textContent = '✅ Threat Successfully Deflected!';
    feedbackBody.innerHTML = `
      <strong>Flawless Reaction:</strong> You refused the unauthorized prompt and protected your account from immediate compromise.
      <br><br>
      <strong>Crucial Next Step:</strong> Because the attacker was able to trigger this prompt, <em>they already know your password</em>. You must immediately change your password and terminate any existing sessions (Follow Step 4 below).
    `;
    feedbackTip.innerHTML = `🛡️ <strong>Golden Rule:</strong> An unsolicited MFA prompt always means your password is known to an unauthorized party.`;
  });

  // Handle User Clicks on Approve (Simulated Accident)
  btnApprove.addEventListener('click', () => {
    stopAttack();
    playBeep(260, 0.25, 'sawtooth');
    btnDeny.disabled = true;
    btnApprove.disabled = true;

    feedbackDot.className = 'status-indicator-dot pulse-rose';
    feedbackTitle.textContent = '⚠️ Simulated Breach: Prompt Approved';
    feedbackBody.innerHTML = `
      <strong>Zero-Shaming Analysis:</strong> You just experienced why MFA fatigue is so dangerous. Under genuine sleep interruption and persistent device buzzing, hundreds of security professionals and employees have tapped "Approve" simply to silence their phones.
      <br><br>
      <strong>How to React Now:</strong> Don't panic! Head directly down to <strong>Section 04: Containment Protocol</strong>. Immediate password reset and session termination will cut off the intruder in seconds.
    `;
    feedbackTip.innerHTML = `💚 <strong>Support Over Blame:</strong> Security teams never punish accidental clicks when reported promptly. Immediate disclosure protects the entire company.`;
  });

  // Restart Button
  btnRestart.addEventListener('click', () => {
    startAttack();
  });

  // Sound Toggle
  btnToggleSound.addEventListener('click', () => {
    soundEnabled = !soundEnabled;
    soundBtnText.textContent = soundEnabled ? '🔊 Sound / Vibration FX: On' : '🔇 Sound / Vibration FX: Off';
  });

  // Start initial attack simulation
  startAttack();
}

/* ==========================================================================
   2. INTERACTIVE ENTROPY & PASSPHRASE LAB
   ========================================================================== */
function initEntropyLab() {
  const buttons = document.querySelectorAll('.btn-preset');
  const displayContainer = document.getElementById('entropy-display');

  const entropyData = {
    weak: {
      password: 'Tr0ub4dor&',
      length: '10 characters',
      entropy: '42 bits',
      crackTime: '3 Hours',
      statusClass: 'danger',
      desc: 'Common formula: Root word + leetspeak substitution (0 for o, 4 for a). Modern hashcat GPU clusters test this pattern in billions of variations per second.'
    },
    sprayed: {
      password: 'Summer2024!',
      length: '11 characters',
      entropy: '18 bits (Effective)',
      crackTime: '0.001 Seconds',
      statusClass: 'danger',
      desc: 'The #1 corporate password spray target. Attackers script seasonal words + current year + exclamation point across tens of thousands of corporate email inboxes simultaneously.'
    },
    passphrase: {
      password: 'correct-horse-battery-staple',
      length: '28 characters',
      entropy: '78 bits',
      crackTime: '2.8 Million Years',
      statusClass: 'cyan',
      desc: 'High-Entropy Passphrase. 4 completely unrelated dictionary words. Immensely difficult for brute-force algorithms to search through the combinatorial space, yet very easy for humans to remember.'
    },
    vault: {
      password: 'xK9#mQ2$vL8!zP4@rT7*wE5&',
      length: '24 characters',
      entropy: '144 bits',
      crackTime: 'Trillions of Centuries',
      statusClass: 'emerald',
      desc: 'Cryptographically Secure Random Vault Password. Zero recognizable patterns. Generated and autofilled by 1Password or Bitwarden, completely uncrackable and immune to credential reuse.'
    }
  };

  function renderEntropy(type) {
    const data = entropyData[type];
    if (!data) return;

    displayContainer.innerHTML = `
      <div class="demo-password-visual">${escapeHtml(data.password)}</div>
      <div class="demo-metrics-row">
        <div class="demo-metric-item">
          <span class="demo-metric-label">Length</span>
          <span class="demo-metric-val">${data.length}</span>
        </div>
        <div class="demo-metric-item">
          <span class="demo-metric-label">Cryptographic Entropy</span>
          <span class="demo-metric-val text-cyan">${data.entropy}</span>
        </div>
        <div class="demo-metric-item">
          <span class="demo-metric-label">Brute-Force Offline Cracking</span>
          <span class="demo-metric-val text-${data.statusClass}">${data.crackTime}</span>
        </div>
      </div>
      <p class="demo-explanation">${data.desc}</p>
    `;
  }

  buttons.forEach(btn => {
    btn.addEventListener('click', () => {
      buttons.forEach(b => b.classList.remove('active'));
      btn.classList.add('active');
      renderEntropy(btn.getAttribute('data-type'));
    });
  });

  // Render default
  renderEntropy('weak');
}

/* ==========================================================================
   3. PRACTICE: 3-SCENARIO INTERACTIVE QUIZ (Zero-Shaming)
   ========================================================================== */
function initScenarioQuiz() {
  const quizQuestions = [
    {
      category: '// SCENARIO 01 • MIDNIGHT NOTIFICATION BARRAGE',
      title: 'Defending Against Middle-of-the-Night Push Bombing',
      context: 'It is 2:15 AM on a Wednesday. Your phone suddenly buzzes with 10 consecutive push notifications from your company authentication app asking to approve a sign-in from an unknown IP address. You are exhausted and half-asleep.',
      options: [
        {
          text: 'Tap "Approve" so the notifications stop vibrating, planning to tell IT tomorrow morning.',
          correct: false,
          rationale: 'Understandable impulse due to sleep disruption, but tapping Approve immediately gives the intruder full access to your corporate accounts. Never approve an unprompted request.'
        },
        {
          text: 'Tap "Deny / Block", and recognize that because the prompt appeared, the attacker already has your password and it must be changed immediately.',
          correct: true,
          rationale: 'Spot on! Denying prevents the immediate breach. Recognizing that an unprompted MFA prompt means your primary password has leaked allows you to reset credentials before they try another method.'
        },
        {
          text: 'Turn your phone off and assume your company firewall will block the attacker automatically.',
          correct: false,
          rationale: 'Turning off your phone leaves the attacker in possession of your valid password. They can continue testing other avenues until you actively reset credentials.'
        }
      ]
    },
    {
      category: '// SCENARIO 02 • ACCIDENTAL APPROVAL CONTAINMENT',
      title: 'Zero-Shaming Incident Response When Mistakes Occur',
      context: 'An employee, Jordan, is rushing between meetings and accidentally taps "Approve" on an unexpected login prompt on their smartwatch. Jordan realizes the mistake 10 seconds later and feels intense anxiety about getting in trouble.',
      options: [
        {
          text: 'Immediately report the incident to IT/SOC and reset the password, knowing modern security teams celebrate rapid reporting.',
          correct: true,
          rationale: 'Exactly right! Psychological fear of punishment is an attacker\'s best friend. Security teams are trained to assist without blame; early notification lets defenders revoke active session tokens in minutes.'
        },
        {
          text: 'Stay silent and monitor email for suspicious activity to see if an intruder actually logs in.',
          correct: false,
          rationale: 'Attackers move programmatically in seconds to exfiltrate session cookies and download data. Waiting to see what happens turns a manageable containment event into a catastrophic breach.'
        },
        {
          text: 'Format and factory-reset the laptop without notifying IT support.',
          correct: false,
          rationale: 'The session token exists in the cloud authentication provider (Azure AD / Okta), not just locally on the laptop. Wiping the machine destroys forensic logs without evicting the cloud attacker.'
        }
      ]
    },
    {
      category: '// SCENARIO 03 • CREDENTIAL ARCHITECTURE & HYGIENE',
      title: 'Architecting Defense Against Credential Stuffing',
      context: 'Your team is reviewing corporate password and authentication policies. You want to completely eliminate vulnerability to credential stuffing leaks and push fatigue attacks without burdening employees with impossible memory requirements.',
      options: [
        {
          text: 'Require employees to memorize complex 8-character passwords with symbols and change them every 30 days, using SMS MFA.',
          correct: false,
          rationale: 'Outdated standard. Frequent 30-day rotations lead to predictable substitutions (Password01, Password02), and SMS is vulnerable to SIM swaps and Evilginx reverse-proxy phishing.'
        },
        {
          text: 'Deploy an enterprise Password Manager for unique 20+ char credentials, and enforce Number Matching MFA or FIDO2 Passkeys.',
          correct: true,
          rationale: 'State-of-the-art defense! Password managers prevent reuse across breached sites, while Number Matching (typing the 2-digit number from screen to phone) or FIDO2 passkeys completely neutralize blind push fatigue attacks.'
        },
        {
          text: 'Allow employees to use one master high-complexity password across all accounts so they never forget it.',
          correct: false,
          rationale: 'Reusing a single password—even a complex one—is the exact vulnerability credential stuffing exploits. One breach at any vendor exposes all accounts.'
        }
      ]
    }
  ];

  let currentQuestionIndex = 0;
  let userScore = 0;

  const currentQNum = document.getElementById('current-q-num');
  const userScoreEl = document.getElementById('user-score');
  const progressFill = document.getElementById('quiz-progress-fill');
  const quizCategory = document.getElementById('quiz-category');
  const quizTitle = document.getElementById('quiz-question-title');
  const quizContext = document.getElementById('quiz-context');
  const optionsContainer = document.getElementById('quiz-options-container');

  const feedbackDrawer = document.getElementById('quiz-feedback-drawer');
  const feedbackResultIcon = document.getElementById('feedback-result-icon');
  const feedbackResultTitle = document.getElementById('feedback-result-title');
  const feedbackDrawerText = document.getElementById('feedback-drawer-text');
  const btnNext = document.getElementById('btn-next-question');

  const quizCard = document.getElementById('quiz-card');
  const quizCompleteCard = document.getElementById('quiz-complete-card');
  const completionSummaryText = document.getElementById('completion-summary-text');
  const btnRestartQuiz = document.getElementById('btn-restart-quiz');

  function renderQuestion(index) {
    const q = quizQuestions[index];
    currentQNum.textContent = index + 1;
    progressFill.style.width = `${((index + 1) / quizQuestions.length) * 100}%`;

    quizCategory.textContent = q.category;
    quizTitle.textContent = q.title;
    quizContext.textContent = q.context;

    optionsContainer.innerHTML = '';
    feedbackDrawer.classList.add('hidden');

    const prefixes = ['A', 'B', 'C', 'D'];

    q.options.forEach((opt, optIdx) => {
      const btn = document.createElement('button');
      btn.className = 'quiz-option-btn';
      btn.innerHTML = `
        <span class="opt-prefix">${prefixes[optIdx]}</span>
        <span>${escapeHtml(opt.text)}</span>
      `;

      btn.addEventListener('click', () => {
        handleOptionSelected(opt, btn, q);
      });

      optionsContainer.appendChild(btn);
    });
  }

  function handleOptionSelected(option, btnElement, question) {
    // Disable all options
    const allBtns = optionsContainer.querySelectorAll('.quiz-option-btn');
    allBtns.forEach(b => b.disabled = true);

    if (option.correct) {
      userScore++;
      userScoreEl.textContent = userScore;
      btnElement.classList.add('selected-correct');
      feedbackResultIcon.textContent = '✅';
      feedbackResultTitle.textContent = 'Correct Defense Assessment';
      feedbackResultTitle.style.color = 'var(--emerald-safe)';
    } else {
      btnElement.classList.add('selected-incorrect');
      feedbackResultIcon.textContent = '💡';
      feedbackResultTitle.textContent = 'Educational Perspective';
      feedbackResultTitle.style.color = 'var(--amber-warn)';

      // Highlight the correct one
      question.options.forEach((opt, idx) => {
        if (opt.correct) {
          allBtns[idx].classList.add('selected-correct');
        }
      });
    }

    feedbackDrawerText.textContent = option.rationale;
    feedbackDrawer.classList.remove('hidden');

    if (currentQuestionIndex === quizQuestions.length - 1) {
      btnNext.innerHTML = '<span>View Training Results ➔</span>';
    } else {
      btnNext.innerHTML = '<span>Next Scenario ➔</span>';
    }
  }

  btnNext.addEventListener('click', () => {
    if (currentQuestionIndex < quizQuestions.length - 1) {
      currentQuestionIndex++;
      renderQuestion(currentQuestionIndex);
    } else {
      showCompletionScreen();
    }
  });

  function showCompletionScreen() {
    quizCard.classList.add('hidden');
    quizCompleteCard.classList.remove('hidden');
    completionSummaryText.textContent = `You scored ${userScore} out of ${quizQuestions.length} scenarios correctly. Your vigilance and response awareness are well-calibrated.`;
  }

  btnRestartQuiz.addEventListener('click', () => {
    currentQuestionIndex = 0;
    userScore = 0;
    userScoreEl.textContent = '0';
    quizCompleteCard.classList.add('hidden');
    quizCard.classList.remove('hidden');
    btnNext.innerHTML = '<span>Next Scenario ➔</span>';
    renderQuestion(0);
  });

  // Start with Question 0
  renderQuestion(0);
}

/* ==========================================================================
   4. TAKEAWAY CHECKLIST
   ========================================================================== */
function initTakeawayChecklist() {
  window.toggleTakeaway = function(card) {
    const checkbox = card.querySelector('input[type="checkbox"]');
    if (checkbox) {
      checkbox.checked = !checkbox.checked;
      card.classList.toggle('checked', checkbox.checked);
    }
  };
}

/* ==========================================================================
   5. EMBED / EXPORT MODAL HANDLER
   ========================================================================== */
function initEmbedModal() {
  const modal = document.getElementById('embed-modal');
  const btnOpen = document.getElementById('btn-open-embed');
  const btnClose = document.getElementById('btn-close-modal');
  const tabBtns = document.querySelectorAll('.embed-tab-btn');
  const tabBodies = document.querySelectorAll('.embed-tab-body');
  const copyBtns = document.querySelectorAll('.btn-embed-copy');

  if (btnOpen && modal) {
    btnOpen.addEventListener('click', () => {
      modal.showModal();
    });
  }

  if (btnClose && modal) {
    btnClose.addEventListener('click', () => {
      modal.close();
    });
  }

  // Close modal when clicking outside dialog content
  if (modal) {
    modal.addEventListener('click', (e) => {
      const rect = modal.getBoundingClientRect();
      const isInDialog = (
        rect.top <= e.clientY &&
        e.clientY <= rect.top + rect.height &&
        rect.left <= e.clientX &&
        e.clientX <= rect.left + rect.width
      );
      if (!isInDialog) {
        modal.close();
      }
    });
  }

  // Switch tabs
  tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetTab = btn.getAttribute('data-tab');
      tabBtns.forEach(b => b.classList.remove('active'));
      tabBodies.forEach(b => b.classList.remove('active'));

      btn.classList.add('active');
      const body = document.getElementById(`tab-${targetTab}`);
      if (body) body.classList.add('active');
    });
  });

  // Copy snippets
  copyBtns.forEach(btn => {
    btn.addEventListener('click', () => {
      const targetId = btn.getAttribute('data-target');
      const targetEl = document.getElementById(targetId);
      if (targetEl) {
        navigator.clipboard.writeText(targetEl.textContent.trim()).then(() => {
          const originalText = btn.innerHTML;
          btn.innerHTML = '<span>✅ Copied to Clipboard!</span>';
          setTimeout(() => {
            btn.innerHTML = originalText;
          }, 2200);
        }).catch(() => {
          btn.innerHTML = '<span>❌ Please select and copy manually</span>';
        });
      }
    });
  });
}

// Utility
function escapeHtml(str) {
  return str.replace(/&/g, '&amp;')
            .replace(/</g, '&lt;')
            .replace(/>/g, '&gt;')
            .replace(/"/g, '&quot;')
            .replace(/'/g, '&#039;');
}

/* ==========================================================================
   6. CYVEXIS CERTIFICATE GENERATOR (Client-Side HTML5 2D Canvas)
   ========================================================================== */
function initCertificateGenerator() {
  const studentInput = document.getElementById('studentName');
  if (studentInput) {
    studentInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter') {
        e.preventDefault();
        generateCertificate();
      }
    });
  }
}

function generateCertificate() {
  const nameInput = document.getElementById('studentName');
  const studentName = nameInput ? nameInput.value.trim() : '';

  if (!studentName) {
    alert('Please enter your full name to generate your official Cyvexis awareness record.');
    if (nameInput) nameInput.focus();
    return;
  }

  const canvas = document.getElementById('certCanvas');
  if (!canvas) {
    console.error('Certificate canvas element #certCanvas not found.');
    return;
  }

  const ctx = canvas.getContext('2d');
  if (!ctx) {
    console.error('Canvas 2D context not supported.');
    return;
  }

  // Set explicit canvas dimensions
  canvas.width = 1200;
  canvas.height = 850;

  const btn = document.getElementById('generateBtn');
  const originalBtnText = btn ? btn.innerHTML : 'Download Certificate';
  if (btn) {
    btn.disabled = true;
    btn.innerHTML = '<span>⚡ Rendering Certificate...</span>';
  }

  function renderCertificate(logoImg) {
    try {
      // 1. Background: Deep obsidian/navy matching logo background (#0b2545)
      ctx.fillStyle = '#0b2545';
      ctx.fillRect(0, 0, 1200, 850);

      // Subtle dark gradient overlay for depth
      const grad = ctx.createLinearGradient(0, 0, 1200, 850);
      grad.addColorStop(0, 'rgba(6, 9, 19, 0.45)');
      grad.addColorStop(0.5, 'rgba(11, 37, 69, 0.05)');
      grad.addColorStop(1, 'rgba(6, 9, 19, 0.45)');
      ctx.fillStyle = grad;
      ctx.fillRect(0, 0, 1200, 850);

      // 2. Borders: Outer dark slate border (#1e293b)
      ctx.strokeStyle = '#1e293b';
      ctx.lineWidth = 12;
      ctx.strokeRect(24, 24, 1152, 802);

      // Inner cyan stroke (#00f2fe)
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 2;
      ctx.strokeRect(38, 38, 1124, 774);

      // High-tech corner bracket accents
      ctx.strokeStyle = '#00f2fe';
      ctx.lineWidth = 3;
      const bracketLen = 28;
      // Top-left
      ctx.beginPath();
      ctx.moveTo(38, 38 + bracketLen); ctx.lineTo(38, 38); ctx.lineTo(38 + bracketLen, 38);
      // Top-right
      ctx.moveTo(1200 - 38 - bracketLen, 38); ctx.lineTo(1200 - 38, 38); ctx.lineTo(1200 - 38, 38 + bracketLen);
      // Bottom-left
      ctx.moveTo(38, 850 - 38 - bracketLen); ctx.lineTo(38, 850 - 38); ctx.lineTo(38 + bracketLen, 850 - 38);
      // Bottom-right
      ctx.moveTo(1200 - 38 - bracketLen, 850 - 38); ctx.lineTo(1200 - 38, 850 - 38); ctx.lineTo(1200 - 38, 850 - 38 - bracketLen);
      ctx.stroke();

      // Ambient cybersecurity grid lines
      ctx.save();
      ctx.strokeStyle = 'rgba(0, 242, 254, 0.035)';
      ctx.lineWidth = 1;
      for (let x = 60; x < 1140; x += 40) {
        ctx.beginPath(); ctx.moveTo(x, 40); ctx.lineTo(x, 810); ctx.stroke();
      }
      for (let y = 60; y < 810; y += 40) {
        ctx.beginPath(); ctx.moveTo(40, y); ctx.lineTo(1160, y); ctx.stroke();
      }
      ctx.restore();

      // 3. Logo placement: Centered at top (width ~100px, height ~100px, x: 550, y: 60)
      if (logoImg) {
        ctx.drawImage(logoImg, 550, 60, 100, 100);
      }

      ctx.textAlign = 'center';
      ctx.textBaseline = 'middle';

      // 4. Header: "CYVEXIS // CYBERSECURITY DRILLS" (cyan monospace)
      ctx.font = '600 16px "JetBrains Mono", "Courier New", monospace';
      ctx.fillStyle = '#00f2fe';
      ctx.fillText('CYVEXIS // CYBERSECURITY DRILLS', 600, 195);

      // 5. Title: "Certificate of Completion" (bold sans-serif white)
      ctx.font = 'bold 44px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = '#ffffff';
      ctx.fillText('Certificate of Completion', 600, 255);

      // Small subtitle lead-in
      ctx.font = '500 15px "Inter", sans-serif';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('THIS CERTIFICATE IS PROUDLY CONFERRED TO', 600, 315);

      // 6. Recipient: Entered student name in emerald green (#10b981), 46px bold
      ctx.font = 'bold 46px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = '#10b981';
      ctx.fillText(studentName, 600, 375);

      // Accent underline under recipient
      const nameWidth = Math.max(300, Math.min(840, ctx.measureText(studentName).width + 70));
      const lineGrad = ctx.createLinearGradient(600 - nameWidth / 2, 0, 600 + nameWidth / 2, 0);
      lineGrad.addColorStop(0, 'rgba(16, 185, 129, 0)');
      lineGrad.addColorStop(0.5, '#10b981');
      lineGrad.addColorStop(1, 'rgba(16, 185, 129, 0)');
      ctx.strokeStyle = lineGrad;
      ctx.lineWidth = 2;
      ctx.beginPath();
      ctx.moveTo(600 - nameWidth / 2, 408);
      ctx.lineTo(600 + nameWidth / 2, 408);
      ctx.stroke();

      // 7. Statement: "has successfully completed the practical awareness drill on Password Hygiene & MFA Fatigue: Defending Against Credential Attacks"
      ctx.font = '400 18px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      ctx.fillStyle = '#cbd5e1';
      ctx.fillText('has successfully completed the practical awareness drill on', 600, 448);

      const moduleTitle = 'Password Hygiene & MFA Fatigue: Defending Against Credential Attacks';
      ctx.font = 'bold 23px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif';
      // Dynamically check width and adjust if necessary to guarantee fit inside inner frame
      let titleFontSize = 23;
      while (ctx.measureText(moduleTitle).width > 1040 && titleFontSize > 16) {
        titleFontSize -= 1;
        ctx.font = `bold ${titleFontSize}px "Inter", -apple-system, BlinkMacSystemFont, "Segoe UI", sans-serif`;
      }
      ctx.fillStyle = '#38bdf8';
      ctx.fillText(moduleTitle, 600, 482);

      // Divider line
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.1)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(250, 528);
      ctx.lineTo(950, 528);
      ctx.stroke();

      // 8. Metadata: Dynamic date and record ID (CYV-XXXXXX)
      const dynamicDate = new Date().toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
      });
      const randChars = 'ABCDEFGHJKLMNPQRSTUVWXYZ23456789';
      let randSuffix = '';
      for (let i = 0; i < 6; i++) {
        randSuffix += randChars.charAt(Math.floor(Math.random() * randChars.length));
      }
      const recordId = `CYV-${randSuffix}`;

      // Left Metadata: Issue Date
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('ISSUE DATE', 420, 575);
      ctx.font = '600 16px "Inter", sans-serif';
      ctx.fillStyle = '#f8fafc';
      ctx.fillText(dynamicDate, 420, 605);

      // Right Metadata: Record ID
      ctx.font = '600 13px "JetBrains Mono", monospace';
      ctx.fillStyle = '#64748b';
      ctx.fillText('VERIFIED RECORD ID', 780, 575);
      ctx.font = '700 17px "JetBrains Mono", monospace';
      ctx.fillStyle = '#00f2fe';
      ctx.fillText(recordId, 780, 605);

      // Verification seal badge
      ctx.font = '600 12px "JetBrains Mono", monospace';
      ctx.fillStyle = '#10b981';
      ctx.fillText('🛡️ CYVEXIS VERIFIED CREDENTIAL RECORD', 600, 668);

      // Divider line above footer
      ctx.strokeStyle = 'rgba(255, 255, 255, 0.08)';
      ctx.lineWidth = 1;
      ctx.beginPath();
      ctx.moveTo(100, 715);
      ctx.lineTo(1100, 715);
      ctx.stroke();

      // 9. Footer banner: "Client-Side Verified • Zero Credentials Stored • cyvexis"
      ctx.font = '500 14px "JetBrains Mono", "Courier New", monospace';
      ctx.fillStyle = '#94a3b8';
      ctx.fillText('Client-Side Verified • Zero Credentials Stored • cyvexis', 600, 755);

      // 10. Export canvas as PNG data URL and trigger download named Cyvexis_Module2_Certificate_<Name>.png
      const cleanName = studentName.replace(/[^a-zA-Z0-9_-]/g, '_');
      const filename = `Cyvexis_Module2_Certificate_${cleanName}.png`;
      const dataUrl = canvas.toDataURL('image/png');

      const downloadLink = document.createElement('a');
      downloadLink.href = dataUrl;
      downloadLink.download = filename;
      document.body.appendChild(downloadLink);
      downloadLink.click();
      document.body.removeChild(downloadLink);
    } catch (err) {
      console.error('Certificate generation error:', err);
      alert('An error occurred while generating your certificate. Please try again.');
    } finally {
      if (btn) {
        btn.disabled = false;
        btn.innerHTML = originalBtnText;
      }
    }
  }

  // Load the brand logo image (logo.jpg or 1.jpg). Wait for img.onload before rendering canvas.
  let hasRendered = false;
  const brandLogo = new Image();
  brandLogo.crossOrigin = 'anonymous';

  brandLogo.onload = () => {
    if (!hasRendered) {
      hasRendered = true;
      renderCertificate(brandLogo);
    }
  };

  brandLogo.onerror = () => {
    // Fallback attempt to 1.jpg if logo.jpg failed to load
    const fallbackLogo = new Image();
    fallbackLogo.crossOrigin = 'anonymous';
    fallbackLogo.onload = () => {
      if (!hasRendered) {
        hasRendered = true;
        renderCertificate(fallbackLogo);
      }
    };
    fallbackLogo.onerror = () => {
      if (!hasRendered) {
        hasRendered = true;
        renderCertificate(null);
      }
    };
    fallbackLogo.src = '1.jpg';
  };

  brandLogo.src = 'logo.jpg';

  // Handle cached image scenario
  if (brandLogo.complete && brandLogo.naturalWidth > 0) {
    if (!hasRendered) {
      hasRendered = true;
      renderCertificate(brandLogo);
    }
  }
}

// Attach globally for inline HTML onclick handlers
window.generateCertificate = generateCertificate;


function generateCertificate() {
  const nameInput = document.getElementById('studentName');
  const name = nameInput.value.trim();

  if (!name) {
    alert("Please enter a name for the certificate.");
    return;
  }

  const canvas = document.getElementById('certCanvas');
  const ctx = canvas.getContext('2d');

  // Load official Cyvexis logo from root
  const logo = new Image();
  logo.src = '../1.jpg';

  logo.onload = function() {
    renderCanvas(ctx, canvas, name, logo);
  };

  logo.onerror = function() {
    // If the image cannot be found, render without breaking
    renderCanvas(ctx, canvas, name, null);
  };
}

function renderCanvas(ctx, canvas, name, logo) {
  // Background
  ctx.fillStyle = "#060913";
  ctx.fillRect(0, 0, 1200, 850);

  // Outer & Inner Borders
  ctx.lineWidth = 4;
  ctx.strokeStyle = "#1e293b";
  ctx.strokeRect(30, 30, 1140, 790);

  ctx.lineWidth = 2;
  ctx.strokeStyle = "#00f2fe";
  ctx.strokeRect(42, 42, 1116, 766);

  // Top Logo
  let startY = 160;
  if (logo) {
    const logoSize = 85;
    ctx.drawImage(logo, (1200 - logoSize) / 2, 55, logoSize, logoSize);
    startY = 180;
  }

  // Header & Title
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

  // Recipient Name
  ctx.fillStyle = "#10b981";
  ctx.font = "bold 46px sans-serif";
  ctx.fillText(name.toUpperCase(), 600, startY + 185);

  ctx.strokeStyle = "#1e293b";
  ctx.lineWidth = 1.5;
  ctx.beginPath();
  ctx.moveTo(350, startY + 210);
  ctx.lineTo(850, startY + 210);
  ctx.stroke();

  // Completion Statement & Module Title
  ctx.fillStyle = "#cbd5e1";
  ctx.font = "21px sans-serif";
  ctx.fillText("has successfully completed the practical awareness drill on", 600, startY + 260);

  ctx.fillStyle = "#f8fafc";
  ctx.font = "bold 23px sans-serif";
  ctx.fillText("Password Hygiene & MFA Fatigue: Defending Against Credential Attacks", 600, startY + 310);

  // Date & ID
  const today = new Date().toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'short',
    day: 'numeric'
  });
  const randomSuffix = Math.random().toString(36).substring(2, 8).toUpperCase();
  const certId = `CYV-MOD2-${randomSuffix}`;

  ctx.fillStyle = "#64748b";
  ctx.font = "15px monospace";
  ctx.fillText(`Issued: ${today}   |   Record ID: ${certId}`, 600, startY + 390);

  // Privacy Footer
  ctx.fillStyle = "#0a0f1d";
  ctx.fillRect(180, 725, 840, 48);
  ctx.strokeStyle = "rgba(0, 242, 254, 0.25)";
  ctx.lineWidth = 1;
  ctx.strokeRect(180, 725, 840, 48);

  ctx.fillStyle = "#94a3b8";
  ctx.font = "14px monospace";
  ctx.fillText("Client-Side Verified • Zero Credentials Stored • cyvexis", 600, 755);

  // Trigger Local PNG Download
  const downloadLink = document.createElement('a');
  downloadLink.download = `Cyvexis_Module2_Certificate_${name.replace(/\s+/g, '_')}.png`;
  downloadLink.href = canvas.toDataURL('image/png');
  downloadLink.click();
}