"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, PencilLine, Loader2, Send, Check } from "lucide-react";

/**
 * HeroAnimation – Writivity → Blog UI 프로토타입 (v10)
 * --------------------------------------------------
 * 변경 사항
 * 1. Writivity 레이어 슬라이드‑아웃 시 **완전히 화면 밖으로** 사라지도록 수정 (y → 110%)
 * 2. 부모 컨테이너에 `overflow-hidden` 적용해 하단 삐져나옴 방지
 * 3. Blog UI 더미 본문을 풍부하게 + 선택된 AI 텍스트 삽입
 * 4. "클립보드로 복사됨" Toast 제거
 */

/* -------------------------------------------------------------------------- */
const rawPrompt = "오늘아침 산책할때 공기와 날씨가 좋아서 기분이 좋았다.";
const aiFinalText =
  "오늘 아침 산책을 할 때 맑은 공기와 포근한 날씨 덕분에 기분이 한층 더 상쾌해졌습니다. " +
  "푸른 하늘과 따뜻한 햇살이 어우러져 하루를 시작하는 에너지가 충전되는 느낌이었습니다.";

/* ------------------------------ 타임라인 ------------------------------ */
const LOOP_MS = 12000;
const PHASES = {
  typing: { start: 0, end: 3000 },
  press: { start: 3000, end: 5000 },
  analyzing: { start: 5000, end: 6000 },
  generating: { start: 6000, end: 8500 },
  done: { start: 8500, end: 9500 },
  copy: { start: 9500, end: 10500 },
  insert: { start: 10500, end: 12000 },
} as const;

type Phase = keyof typeof PHASES;

function getPhase(t: number): Phase {
  for (const [key, { start, end }] of Object.entries(PHASES)) {
    if (t >= start && t < end) return key as Phase;
  }
  return "typing";
}

/* -------------------------------------------------------------------------- */
export default function HeroAnimation() {
  const [elapsed, setElapsed] = useState(0);
  const [manualPhase, setManualPhase] = useState<Phase | null>(null);
  const phase = manualPhase ?? getPhase(elapsed);

  /* ---------------------------- 오토 타이머 ---------------------------- */
  useEffect(() => {
    if (manualPhase) return;
    const id = setInterval(() => {
      setElapsed((prev) => (prev + 30) % LOOP_MS);
    }, 30);
    return () => clearInterval(id);
  }, [manualPhase]);

  /* --------------------------- 버튼 클릭 핸들 -------------------------- */
  const handleSelect = () => {
    setManualPhase("copy");
    setTimeout(() => setManualPhase("insert"), 1500);
    setTimeout(() => {
      setManualPhase(null);
      setElapsed(0);
    }, 4000);
  };

  /* --------------------------- 진행 중 텍스트 --------------------------- */
  const typingVisible = rawPrompt.slice(
    0,
    Math.floor((elapsed / PHASES.typing.end) * rawPrompt.length)
  );

  const genRatio = Math.min(
    1,
    (elapsed - PHASES.generating.start) /
      (PHASES.generating.end - PHASES.generating.start)
  );
  const generatedVisible = aiFinalText.slice(
    0,
    Math.floor(genRatio * aiFinalText.length)
  );

  /* --------------------------- 유틸 & 플래그 --------------------------- */
  const isSlideOut = phase === "insert";
  const txtBase =
    "text-[14px] md:text-[15px] lg:text-[16px] whitespace-pre-wrap font-medium text-zinc-800";
  const btnSize = "p-2 md:p-2.5 lg:p-3";

  /* ---------------------------- 렌더링 ---------------------------- */
  return (
    <div className="w-full flex justify-center pt-4 lg:pt-12 overflow-hidden">
      <div className="relative w-full max-w-[380px] md:max-w-[460px] aspect-[9/12] overflow-hidden">
        {/* Blog UI – 뒤 레이어 */}
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: isSlideOut ? 1 : 0 }}
          transition={{ duration: 0.4, delay: 0.1 }}
          className="absolute inset-0 bg-zinc-50 rounded-3xl shadow-inner overflow-hidden flex flex-col"
        >
          {/* 블로그 헤더 */}
          <header className="flex items-center justify-between h-[11%] px-4 border-b border-zinc-200 bg-white/90 backdrop-blur-sm">
            <div className="font-semibold lg:text-base md:text-sm text-xs text-zinc-800">
              My Blog&nbsp;
              <span className="text-zinc-400 font-normal">/ Diary</span>
            </div>
            <time className="text-zinc-400 text-xs md:text-sm">
              2025‑05‑05 22:00
            </time>
          </header>

          {/* 블로그 본문 */}
          <div className={`flex-1 overflow-y-auto p-6 space-y-4 ${txtBase}`}>
            <p>
              어제 저녁에는 노을이 유난히 붉게 물들어 마치 봄꽃이 하늘에
              흩뿌려진 듯한 풍경이었습니다. 바람은 포근했고, 거리에는 벚꽃 잎이
              내려앉아 조용히 하루를 마무리하는 분위기를 더해 주었죠.
            </p>
            <p>
              따뜻한 차 한 잔을 마시며 창밖을 바라보는데, 낮 동안의 분주함이
              모두 씻겨 내려가는 기분이 들었습니다. 이런 소소한 순간들이 결국
              하루를 특별하게 만들어 주는 것 같아요.
            </p>
            <p>
              문득 내일 아침에는 조금 더 일찍 일어나 동네 공원을 걸어봐야겠다는
              생각이 들었습니다. 새벽 공기가 전해 줄 상쾌함과 고요함을 기대하며
              일정을 정리했답니다.
            </p>
            {isSlideOut && (
              <>
                <hr className="border-zinc-200" />
                <p className="whitespace-pre-wrap font-medium text-zinc-800">
                  {aiFinalText}
                </p>
              </>
            )}
          </div>
        </motion.div>

        {/* Writivity 레이어 – 앞 */}
        <motion.div
          animate={{ y: isSlideOut ? "110%" : 0 }}
          transition={{ type: "spring", stiffness: 180, damping: 15 }}
          className="absolute inset-0 bg-white rounded-3xl shadow-xl overflow-hidden flex flex-col"
        >
          {/* 헤더 */}
          <div className="h-[10%] flex items-center justify-between px-4 border-b border-zinc-200 text-zinc-800 text-sm md:text-base lg:text-lg font-medium select-none">
            <span className="text-xl md:text-2xl rotate-180">➜</span>
            <span>Writivity</span>
            <Sparkles className="h-4 w-4 md:h-5 md:w-5 text-indigo-500" />
          </div>

          {/* 본문 */}
          <div className={`h-[70%] p-4 relative overflow-hidden ${txtBase}`}>
            {phase === "copy" && (
              <motion.div
                layoutId="copyHighlight"
                initial={{ opacity: 0 }}
                animate={{ opacity: 0.25 }}
                exit={{ opacity: 0 }}
                className="absolute inset-0 bg-indigo-300"
              />
            )}

            <AnimatePresence mode="wait">
              {phase === "analyzing" && (
                <motion.div
                  key="analyzing"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col items-center h-full justify-center text-zinc-400 space-y-1 text-xs md:text-sm"
                >
                  <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin" />
                  <span>톤 & 매너 분석 중…</span>
                </motion.div>
              )}

              {phase === "generating" && (
                <motion.div
                  key="generating"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="flex flex-col h-full"
                >
                  <div className="flex-1 whitespace-pre-wrap text-zinc-800">
                    {generatedVisible}
                  </div>
                  <div className="flex items-center text-zinc-400 text-xs md:text-sm mt-2">
                    <Loader2 className="h-4 w-4 md:h-5 md:w-5 animate-spin mr-1" />{" "}
                    문장 생성 중…
                  </div>
                </motion.div>
              )}

              {(phase === "done" || phase === "copy") && (
                <motion.div
                  key="done"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  exit={{ opacity: 0 }}
                  className="h-full flex flex-col"
                >
                  <p className="flex-1 whitespace-pre-wrap text-zinc-800">
                    {aiFinalText}
                  </p>
                  {phase === "done" && (
                    <motion.button
                      whileTap={{ scale: 0.92 }}
                      className={`mt-3 self-end bg-indigo-500 text-white rounded-full flex items-center gap-1 px-3 md:px-4 lg:px-5 ${btnSize} shadow-md`}
                      onClick={handleSelect}
                    >
                      <Check className="h-4 w-4 md:h-5 md:w-5" /> 사용하기
                    </motion.button>
                  )}
                </motion.div>
              )}
            </AnimatePresence>
          </div>

          {/* 프롬프트 입력 바 */}
          <div className="h-[20%] flex items-center px-3 border-t border-zinc-200 bg-zinc-50 text-xs md:text-sm lg:text-base text-zinc-700 relative">
            <PencilLine className="h-4 w-4 md:h-5 md:w-5 text-zinc-500 mr-2" />
            <span className="flex-1">
              {phase === "typing"
                ? typingVisible
                : phase === "insert"
                ? aiFinalText
                : rawPrompt}
            </span>
            <motion.button
              className={`ml-2 bg-indigo-500 text-white rounded-full ${btnSize}`}
              initial={false}
              animate={phase === "press" ? { scale: 0.85 } : { scale: 1 }}
              transition={{ type: "spring", stiffness: 400, damping: 12 }}
            >
              <Send className="h-4 w-4 md:h-5 md:w-5" />
            </motion.button>
          </div>
        </motion.div>
      </div>
    </div>
  );
}
