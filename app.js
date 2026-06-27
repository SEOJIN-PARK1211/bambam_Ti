const USERS = [
  { id: "admin", password: "2026", role: "admin", name: "관리자" },
  { id: "10101", password: "1234", role: "student", studentId: "10101" },
  { id: "10102", password: "1234", role: "student", studentId: "10102" },
  { id: "10103", password: "1234", role: "student", studentId: "10103" },
];

const STUDENTS = [
  {
    id: "10101",
    name: "김코딩",
    photo: "assets/10101_김코딩.jpg",
    grades: {
      "정보 수행평가": "A",
      "웹앱 프로젝트": "92점",
      "디지털 윤리 퀴즈": "88점",
      "수업 참여도": "상",
    },
    traits: [
      "문제 해결 과정을 차분히 설명합니다.",
      "새 도구를 시도할 때 기록을 꼼꼼히 남깁니다.",
      "제출 전 확인 습관을 더 연습하면 좋습니다.",
    ],
    teacherMemo: "프론트엔드 구조 이해가 빠르며, 팀원 질문에 답하는 태도가 좋습니다.",
  },
  {
    id: "10102",
    name: "박개발",
    photo: "assets/10102_박개발.jpg",
    grades: {
      "정보 수행평가": "B+",
      "웹앱 프로젝트": "86점",
      "디지털 윤리 퀴즈": "91점",
      "수업 참여도": "중상",
    },
    traits: [
      "협업 중 역할 분담을 잘 지킵니다.",
      "UI 수정 아이디어를 자주 제안합니다.",
      "프로젝트 범위를 작게 나누는 연습이 필요합니다.",
    ],
    teacherMemo: "기능 구현 의욕이 높고, 오류가 날 때 원인을 함께 추적하려는 태도가 좋습니다.",
  },
  {
    id: "10103",
    name: "이교사",
    photo: "assets/10103_이교사.jpg",
    grades: {
      "정보 수행평가": "A-",
      "웹앱 프로젝트": "89점",
      "디지털 윤리 퀴즈": "95점",
      "수업 참여도": "상",
    },
    traits: [
      "학습 내용을 자기 언어로 정리합니다.",
      "개선할 지점을 발견하면 근거를 함께 제시합니다.",
      "코드 주석을 더 구체적으로 쓰면 좋습니다.",
    ],
    teacherMemo: "질문의 초점이 좋고, 개선 방향을 토의하는 데 적극적입니다.",
  },
];

const loginForm = document.querySelector("#loginForm");
const userIdInput = document.querySelector("#userId");
const passwordInput = document.querySelector("#password");
const loginMessage = document.querySelector("#loginMessage");
const logoutButton = document.querySelector("#logoutButton");
const loginView = document.querySelector("#loginView");
const studentView = document.querySelector("#studentView");
const adminView = document.querySelector("#adminView");

let currentUser = null;

loginForm.addEventListener("submit", (event) => {
  event.preventDefault();

  const id = userIdInput.value.trim();
  const password = passwordInput.value;
  const user = USERS.find((item) => item.id === id && item.password === password);

  if (!user) {
    loginMessage.textContent = "아이디 또는 비밀번호가 올바르지 않습니다.";
    passwordInput.value = "";
    passwordInput.focus();
    return;
  }

  currentUser = user;
  loginMessage.textContent = "";
  loginForm.reset();

  if (user.role === "admin") {
    renderAdminDashboard();
  } else {
    const student = STUDENTS.find((item) => item.id === user.studentId);
    renderStudentPage(student);
  }
});

logoutButton.addEventListener("click", () => {
  currentUser = null;
  showOnly(loginView);
  logoutButton.classList.add("hidden");
  userIdInput.focus();
});

function showOnly(targetView) {
  [loginView, studentView, adminView].forEach((view) => view.classList.add("hidden"));
  targetView.classList.remove("hidden");
}

function renderStudentPage(student) {
  if (!student) {
    loginMessage.textContent = "학생 정보를 찾을 수 없습니다.";
    showOnly(loginView);
    return;
  }

  studentView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Student</p>
        <h2>${student.name} 학생 페이지</h2>
        <p>로그인한 학생의 학습 현황을 확인합니다.</p>
      </div>
    </div>

    <div class="student-layout">
      <article class="student-profile">
        <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
        <div class="profile-body">
          <h3>${student.name}</h3>
          <p class="student-number">학번 ${student.id}</p>
          <div class="tag-row" aria-label="학습 키워드">
            <span class="tag">정보</span>
            <span class="tag">프로젝트</span>
          </div>
        </div>
      </article>

      <div class="content-stack">
        ${renderGrades(student.grades, false, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
      </div>
    </div>
  `;

  showOnly(studentView);
  logoutButton.classList.remove("hidden");
}

function renderAdminDashboard() {
  adminView.innerHTML = `
    <div class="view-header">
      <div class="view-title">
        <p class="eyebrow">Admin</p>
        <h2>관리자 대시보드</h2>
        <p>학생 3명의 학습 현황을 한 화면에서 비교합니다.</p>
      </div>
    </div>

    <section class="admin-grid" aria-label="전체 학생 정보">
      ${STUDENTS.map(renderStudentCard).join("")}
    </section>

    <section class="ai-counseling-panel hidden" id="aiCounselingPanel" style="margin-top: 2rem; padding: 1.5rem; background: var(--surface); border-radius: 12px; border: 1px solid var(--line);">
      <div class="section-title">
        <h3>AI 학생 상담 전략 도우미</h3>
      </div>
      <div id="aiCounselingContent">
        <p style="color: var(--muted);">학생 카드에서 '상담 전략 요청' 버튼을 클릭해주세요.</p>
      </div>
      <p style="margin-top: 1rem; font-size: 0.85rem; color: var(--muted);">
        AI 상담 전략은 참고용입니다. 최종 판단과 실제 상담은 교사가 학생의 상황을 종합적으로 고려하여 진행해야 합니다.
      </p>
    </section>
  `;

  showOnly(adminView);
  logoutButton.classList.remove("hidden");
}

function renderStudentCard(student) {
  return `
    <article class="student-card">
      <img class="student-photo" src="${student.photo}" alt="${student.name} 학생 사진" />
      <div class="student-card-body">
        <h3>${student.name}</h3>
        <p class="student-number">학번 ${student.id}</p>
        ${renderGrades(student.grades, true, `gradesTitle-${student.id}`)}
        ${renderTraits(student)}
        <button type="button" class="primary-button ai-request-btn" data-student-id="${student.id}" style="margin-top: 1rem; width: 100%;">상담 전략 요청</button>
      </div>
    </article>
  `;
}

function renderGrades(grades, compact = false, headingId = "gradesTitle") {
  const rows = Object.entries(grades)
    .map(([label, value]) => `<tr><th scope="row">${label}</th><td>${value}</td></tr>`)
    .join("");

  return `
    <section aria-labelledby="${headingId}">
      <div class="section-title">
        <h3 id="${headingId}">성적 정보</h3>
      </div>
      <table class="grade-table ${compact ? "compact-table" : ""}">
        <tbody>${rows}</tbody>
      </table>
    </section>
  `;
}

function renderTraits(student) {
  return `
    <section aria-labelledby="traitsTitle-${student.id}">
      <div class="section-title">
        <h3 id="traitsTitle-${student.id}">학습 특성 및 교사 메모</h3>
      </div>
      <ul class="memo-list">
        ${student.traits.map((trait) => `<li>${trait}</li>`).join("")}
        <li>${student.teacherMemo}</li>
      </ul>
    </section>
  `;
}

function openAICounseling(studentId) {
  const student = STUDENTS.find(s => s.id === studentId);
  if (!student) return;

  const panel = document.getElementById("aiCounselingPanel");
  const content = document.getElementById("aiCounselingContent");
  
  panel.classList.remove("hidden");
  
  // 익명화 데이터 생성
  const aliasName = student.name.charAt(0) + "학생"; // 예: 김학생
  const gradeSummaryStr = Object.entries(student.grades).map(([k,v]) => `${k}: ${v}`).join(", ");
  const traitsStr = student.traits.join(" / ") + " | 교사 메모: " + student.teacherMemo;
  
  content.innerHTML = `
    <div style="margin-bottom: 1rem;">
      <h4 style="margin: 0; color: var(--ink);">대상 학생: ${student.name} (${student.id})</h4>
    </div>
    
    <div style="margin-bottom: 1rem;">
      <label for="teacherConcern" style="display: block; margin-bottom: 0.5rem; font-weight: 600;">교사 고민 입력</label>
      <textarea id="teacherConcern" rows="3" style="width: 100%; padding: 0.75rem; border: 1px solid var(--line); border-radius: 8px; font-family: inherit;" placeholder="수업 참여는 좋은데 평가 결과가 낮습니다. 어떻게 상담하면 좋을까요?"></textarea>
    </div>
    
    <div style="margin-bottom: 1rem; padding: 1rem; background: var(--surface-strong); border-radius: 8px;">
      <p style="margin-top: 0; margin-bottom: 0.5rem;"><strong>전송 데이터 미리보기 (익명화)</strong></p>
      <pre id="previewData" style="margin: 0; white-space: pre-wrap; font-size: 0.85rem; color: var(--muted);"></pre>
    </div>
    
    <button type="button" class="primary-button" id="getAiStrategyBtn">AI 상담 전략 받기</button>
    <div id="aiLoading" class="hidden" style="margin-top: 1rem; color: var(--primary); font-weight: 600;">AI가 상담 전략을 생성하는 중입니다...</div>
    <div id="aiError" class="hidden form-message" style="margin-top: 1rem; color: var(--danger);"></div>
    <div id="aiResult" class="hidden" style="margin-top: 1rem; padding: 1rem; background: #f0f7ff; border: 1px solid #bfdbfe; border-radius: 8px; line-height: 1.6;"></div>
  `;
  
  const textarea = document.getElementById("teacherConcern");
  const preview = document.getElementById("previewData");
  
  const updatePreview = () => {
    const dataToSend = {
      studentAlias: aliasName,
      gradeSummary: gradeSummaryStr,
      learningTraits: traitsStr,
      teacherConcern: textarea.value.trim()
    };
    preview.textContent = JSON.stringify(dataToSend, null, 2);
  };
  
  textarea.addEventListener("input", updatePreview);
  updatePreview();
  
  document.getElementById("getAiStrategyBtn").addEventListener("click", async () => {
    const concern = textarea.value.trim();
    if (!concern) {
      alert("상담 고민을 먼저 입력해주세요.");
      return;
    }
    
    const dataToSend = {
      studentAlias: aliasName,
      gradeSummary: gradeSummaryStr,
      learningTraits: traitsStr,
      teacherConcern: concern
    };
    
    document.getElementById("aiLoading").classList.remove("hidden");
    document.getElementById("aiError").classList.add("hidden");
    document.getElementById("aiResult").classList.add("hidden");
    
    try {
      /*
       * [보안 점검용 주석]
       * 1. 프론트엔드에 API 키를 넣으면 개발자 도구에서 노출될 수 있습니다.
       * 2. Gemini API 호출은 Vercel Serverless Function(/api/gemini-counseling)에서 처리합니다.
       * 3. .env 파일은 GitHub에 올리지 않습니다.
       * 4. Vercel 배포 시에는 Project Settings의 Environment Variables에 GEMINI_API_KEY를 등록해야 합니다.
       * 5. Gemini로 전송하는 데이터는 이름, 학번, 사진 경로를 제외한 최소 정보로 제한합니다.
       */
      const response = await fetch('/api/gemini-counseling', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(dataToSend)
      });
      
      const result = await response.json();
      
      if (result.success) {
        document.getElementById("aiResult").classList.remove("hidden");
        // 마크다운 형식으로 올 수 있으므로 줄바꿈 처리 등을 간단히 합니다.
        document.getElementById("aiResult").innerHTML = result.result.replace(/\n/g, '<br>').replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>');
      } else {
        throw new Error(result.error || 'Failed to fetch AI strategy');
      }
    } catch (err) {
      document.getElementById("aiError").classList.remove("hidden");
      document.getElementById("aiError").textContent = "AI 상담 전략을 불러오지 못했습니다. API 키 또는 Vercel 환경 변수를 확인해주세요.";
    } finally {
      document.getElementById("aiLoading").classList.add("hidden");
    }
  });
}

adminView.addEventListener("click", (e) => {
  if (e.target.classList.contains("ai-request-btn")) {
    const studentId = e.target.getAttribute("data-student-id");
    openAICounseling(studentId);
    
    setTimeout(() => {
      document.getElementById("aiCounselingPanel").scrollIntoView({ behavior: 'smooth' });
    }, 100);
  }
});

showOnly(loginView);
