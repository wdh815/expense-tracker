const API_BASE = "https://expense-api-mp1j.onrender.com";

const apiBaseLabel = document.getElementById("api-base-label");
const form = document.getElementById("transaction-form");
const formStatus = document.getElementById("form-status");
const listEl = document.getElementById("transaction-list");
const listStatus = document.getElementById("list-status");
const refreshBtn = document.getElementById("refresh-btn");

apiBaseLabel.textContent = API_BASE;

function setStatus(el, message, type) {
  el.textContent = message;
  el.className = `status ${type || ""}`.trim();
}

async function loadTransactions() {
  setStatus(listStatus, "불러오는 중...", "");
  try {
    const res = await fetch(`${API_BASE}/transactions?limit=50`);
    if (!res.ok) throw new Error(`목록 조회 실패 (HTTP ${res.status})`);
    const data = await res.json();
    renderList(data);
    setStatus(listStatus, "", "");
  } catch (err) {
    renderList([]);
    setStatus(listStatus, `백엔드 연결 실패: ${err.message}`, "error");
  }
}

function renderList(items) {
  listEl.innerHTML = "";
  if (items.length === 0) {
    listEl.innerHTML = `<li class="empty">등록된 거래가 없습니다.</li>`;
    return;
  }
  for (const item of items) {
    const li = document.createElement("li");
    li.className = `item ${item.type}`;
    const sign = item.type === "income" ? "+" : "-";
    li.innerHTML = `
      <span class="category">${escapeHtml(item.category)}${
        item.description
          ? `<small class="description">${escapeHtml(item.description)}</small>`
          : ""
      }</span>
      <span class="amount">${sign}${Number(item.amount).toLocaleString()}원</span>
      <span class="date">${item.occurred_on}</span>
      <button type="button" class="delete-btn" data-id="${item.id}">삭제</button>
    `;
    listEl.appendChild(li);
  }
}

function escapeHtml(text) {
  const div = document.createElement("div");
  div.textContent = text;
  return div.innerHTML;
}

form.addEventListener("submit", async (e) => {
  e.preventDefault();
  setStatus(formStatus, "등록 중...", "");

  const payload = {
    amount: Number(form.amount.value),
    type: form.type.value,
    category: form.category.value,
    description: form.description.value || null,
    occurred_on: form.occurred_on.value,
  };

  try {
    const res = await fetch(`${API_BASE}/transactions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(payload),
    });
    if (!res.ok) {
      const err = await res.json().catch(() => ({}));
      const detail = Array.isArray(err.detail)
        ? err.detail.map((d) => d.msg).join(", ")
        : err.detail || `HTTP ${res.status}`;
      throw new Error(detail);
    }
    form.reset();
    setStatus(formStatus, "등록되었습니다.", "ok");
    loadTransactions();
  } catch (err) {
    setStatus(formStatus, `등록 실패: ${err.message}`, "error");
  }
});

listEl.addEventListener("click", async (e) => {
  const target = e.target.closest(".delete-btn");
  if (!target) return;
  const id = target.dataset.id;
  try {
    const res = await fetch(`${API_BASE}/transactions/${id}`, { method: "DELETE" });
    if (!res.ok && res.status !== 204) throw new Error(`HTTP ${res.status}`);
    loadTransactions();
  } catch (err) {
    setStatus(listStatus, `삭제 실패: ${err.message}`, "error");
  }
});

refreshBtn.addEventListener("click", loadTransactions);

loadTransactions();
