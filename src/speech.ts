import { getSettings } from "./storage";

const synth = typeof window !== "undefined" ? window.speechSynthesis : undefined;

export const speechSupported = !!synth;

function pickVoice(lang: string): SpeechSynthesisVoice | undefined {
  const voices = synth?.getVoices() ?? [];
  const exact = voices.filter((v) => v.lang.replace("_", "-") === lang);
  // Giọng chất lượng cao thường có "Enhanced"/"Premium"/"Google" trong tên.
  return (
    exact.find((v) => /enhanced|premium|google|natural/i.test(v.name)) ??
    exact[0] ??
    voices.find((v) => v.lang.startsWith("en"))
  );
}

export function speak(text: string) {
  if (!synth) return;
  const { rate, accent } = getSettings();
  synth.cancel();
  const u = new SpeechSynthesisUtterance(text);
  u.lang = accent;
  u.rate = rate;
  const voice = pickVoice(accent);
  if (voice) u.voice = voice;
  synth.speak(u);
}

// Một số trình duyệt nạp danh sách giọng sau khi trang mở.
synth?.addEventListener?.("voiceschanged", () => synth.getVoices());

// Safari trên iPhone/iPad chỉ cho đọc sau khi người dùng chạm vào trang; câu đọc
// tự động sau khi chuyển màn hình sẽ bị chặn. Đọc một câu rỗng ở lần chạm đầu để mở khóa.
if (synth && typeof document !== "undefined") {
  const unlock = () => {
    const u = new SpeechSynthesisUtterance(" ");
    u.volume = 0;
    synth.speak(u);
  };
  document.addEventListener("pointerdown", unlock, { once: true, capture: true });
}
