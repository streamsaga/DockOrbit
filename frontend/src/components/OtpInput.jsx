import { useRef } from "react";

// Renders `length` individual digit boxes but behaves as one
// controlled value - value/onChange work exactly like a normal text
// input (a string of digits), so swapping this in for the old single
// <input> doesn't change any parent state/logic, only the visual
// presentation and per-key typing experience.
export default function OtpInput({ value, onChange, length = 6, autoFocus = false }) {
  const inputRefs = useRef([]);

  function setDigit(index, digit) {
    const chars = value.split("");
    chars[index] = digit;
    const next = chars.join("").slice(0, length);
    onChange(next);
  }

  function handleChange(index, e) {
    const raw = e.target.value.replace(/\D/g, "");
    if (!raw) {
      setDigit(index, "");
      return;
    }
    // Handles both single-digit typing and pasting multiple digits
    // into one box (common on mobile autofill/paste).
    const digits = raw.split("");
    let chars = value.split("");
    for (let i = 0; i < digits.length && index + i < length; i++) {
      chars[index + i] = digits[i];
    }
    const next = chars.join("").slice(0, length).padEnd(0, "");
    onChange(next.length > value.length ? next : chars.join(""));

    const nextIndex = Math.min(index + digits.length, length - 1);
    inputRefs.current[nextIndex]?.focus();
  }

  function handleKeyDown(index, e) {
    if (e.key === "Backspace" && !value[index] && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowLeft" && index > 0) {
      inputRefs.current[index - 1]?.focus();
    }
    if (e.key === "ArrowRight" && index < length - 1) {
      inputRefs.current[index + 1]?.focus();
    }
  }

  function handlePaste(e) {
    e.preventDefault();
    const pasted = e.clipboardData.getData("text").replace(/\D/g, "").slice(0, length);
    if (pasted) {
      onChange(pasted);
      inputRefs.current[Math.min(pasted.length, length - 1)]?.focus();
    }
  }

  return (
    <div className="otp-box-row" onPaste={handlePaste}>
      {Array.from({ length }).map((_, i) => (
        <input
          key={i}
          ref={(el) => (inputRefs.current[i] = el)}
          type="text"
          inputMode="numeric"
          maxLength={1}
          className="otp-box"
          value={value[i] || ""}
          onChange={(e) => handleChange(i, e)}
          onKeyDown={(e) => handleKeyDown(i, e)}
          autoFocus={autoFocus && i === 0}
        />
      ))}
    </div>
  );
}