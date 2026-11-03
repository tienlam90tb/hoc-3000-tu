import { speak, speechSupported } from "../speech";
import { exportData, getSettings, importData, resetProgress, updateSettings } from "../storage";
import { app, header } from "../ui";

export function renderSettings() {
  const s = getSettings();
  app.innerHTML = `
    ${header("Cài đặt", "#/")}
    <main>
      <section class="card form">
        <h2>Giọng đọc</h2>
        ${speechSupported ? "" : `<p class="bad-text">Trình duyệt này không hỗ trợ đọc. Hãy dùng Chrome hoặc Safari.</p>`}
        <label>Giọng
          <select name="accent">
            <option value="en-US" ${s.accent === "en-US" ? "selected" : ""}>Anh - Mỹ</option>
            <option value="en-GB" ${s.accent === "en-GB" ? "selected" : ""}>Anh - Anh</option>
          </select>
        </label>
        <label>Tốc độ: <output>${s.rate.toFixed(1)}</output>
          <input type="range" name="rate" min="0.5" max="1.3" step="0.1" value="${s.rate}" />
        </label>
        <button class="btn" data-action="test">Nghe thử</button>
      </section>
      <section class="card form">
        <h2>Tiến độ</h2>
        <p class="muted small">Tiến độ chỉ lưu trên trình duyệt này. Nên sao lưu thỉnh thoảng, nhất là trước khi xóa dữ liệu trình duyệt.</p>
        <button class="btn" data-action="export">Sao lưu ra file</button>
        <label class="btn">Khôi phục từ file<input type="file" accept="application/json,.json" hidden /></label>
        <button class="btn danger" data-action="reset">Xóa toàn bộ tiến độ</button>
      </section>
    </main>`;

  const accent = app.querySelector<HTMLSelectElement>("select[name=accent]")!;
  const rate = app.querySelector<HTMLInputElement>("input[name=rate]")!;
  accent.onchange = () => updateSettings({ accent: accent.value as "en-US" | "en-GB" });
  rate.oninput = () => {
    updateSettings({ rate: Number(rate.value) });
    app.querySelector("output")!.textContent = Number(rate.value).toFixed(1);
  };

  app.querySelector<HTMLInputElement>("input[type=file]")!.onchange = async (e) => {
    const file = (e.target as HTMLInputElement).files?.[0];
    if (!file) return;
    try {
      importData(await file.text());
      alert("Đã khôi phục tiến độ.");
      location.hash = "#/";
    } catch (err) {
      alert(`Không khôi phục được: ${(err as Error).message}`);
    }
  };

  app.onclick = (e) => {
    const action = (e.target as HTMLElement).closest<HTMLElement>("[data-action]")?.dataset.action;
    if (action === "test") speak("Practice makes perfect.");
    else if (action === "export") {
      const blob = new Blob([exportData()], { type: "application/json" });
      const a = document.createElement("a");
      a.href = URL.createObjectURL(blob);
      a.download = `hoc3000-${new Date().toISOString().slice(0, 10)}.json`;
      a.click();
      setTimeout(() => URL.revokeObjectURL(a.href), 1000);
    } else if (action === "reset" && confirm("Xóa toàn bộ tiến độ học? Không hoàn tác được.")) {
      resetProgress();
      location.hash = "#/";
    }
  };
}
