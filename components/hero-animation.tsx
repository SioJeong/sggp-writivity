"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Sparkles, PencilLine, Loader2, Send, Check } from "lucide-react";

/**
 * HeroAnimation – Writivity → Blog UI 프로토타입 (v10)
 * --------------------------------------------------
 * 변경 사항
 * 1. Writivity 레이어 슬라이드‑아웃 시 **완전히 화면 밖으로** 사라지도록 수정 (y → 110%)
 * 2. 부모 컨테이너에 `overflow-hidden` 적용해 하단 삐져나옴 방지
 * 3. Blog UI 더미 본문을 풍부하게 + 선택된 AI 텍스트 삽입
 * 4. "클립보드로 복사됨" Toast 제거
 */

/* -------------------------------------------------------------------------- */
const rawPrompt = "오늘아침 산책할때 공기와 날씨가 좋아서 기분이 좋았다.";
const aiFinalText =
  "오늘 아침 산책을 할 때 맑은 공기와 포근한 날씨 덕분에 기분이 한층 더 상쾌해졌습니다. " +
  "푸른 하늘과 따뜻한 햇살이 어우러져 하루를 시작하는 에너지가 충전되는 느낌이었습니다.";

/* ------------------------------ 타임라인 ------------------------------ */
const LOOP_MS = 15000;
const PHASES = {
  typing: { start: 0, end: 3000 },
  press: { start: 3000, end: 5000 },
  analyzing: { start: 5000, end: 6000 },
  generating: { start: 6000, end: 8500 },
  done: { start: 8500, end: 9500 },
  copy: { start: 9500, end: 10500 },
  insert: { start: 10500, end: 15000 },
} as const;

type Phase = keyof typeof PHASES;

function getPhase(t: number): Phase {
  for (const [key, { start, end }] of Object.entries(PHASES)) {
    if (t >= start && t < end) return key as Phase;
  }
  return "typing";
}

/* -------------------------------------------------------------------------- */
const SLIDE_DURATION = 1700; // 1.7s per card
const SLIDE_RESET_DELAY = 1500; // 1.5s delay before animation restarts

// Blog card components
function ThreadsCard({ aiFinalText }: { aiFinalText: string }) {
  return (
    <div className="w-full h-full bg-black rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col">
      <header className="flex items-center gap-3 px-4 pt-4 pb-1">
        <img src="https://randomuser.me/api/portraits/men/34.jpg" alt="profile" className="w-9 h-9 rounded-full" />
        <div className="flex flex-col flex-1 min-w-0">
          <span className="font-semibold text-zinc-100 text-[15px] leading-tight truncate">Writivity</span>
          <span className="text-zinc-500 text-xs">3시간 전</span>
        </div>
        <button className="text-zinc-500 hover:text-zinc-300">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="18" r="1.5"/>
          </svg>
        </button>
      </header>
      <div className="flex-1 flex flex-col bg-black">
        <div className="flex-1 px-4 pt-1 overflow-y-auto text-zinc-100 text-[15px] whitespace-pre-line">
          <div className="mb-2 space-y-2">
            <p>문득 내일 아침에는 조금 더 일찍 일어나 동네 공원을 걸어봐야겠다는 생각이 들었습니다. 새벽 공기가 전해 줄 상쾌함과 고요함을 기대하며 일정을 정리했답니다.</p>
            <p className="whitespace-pre-line text-zinc-100">{aiFinalText}</p>
          </div>
        </div>
        <div className="border-t border-zinc-800 bg-black">
          <div className="flex items-center gap-8 px-4 py-2 text-zinc-500 text-[14px]">
            <button className="flex items-center gap-1 hover:text-zinc-300 group">
              <svg className="w-5 h-5" fill="rgb(255, 46, 64)" stroke="rgb(255, 46, 64)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21C12 21 4 13.686 4 8.857A4.286 4.286 0 018.286 4.57c1.457 0 2.857.857 3.714 2.057C13.857 5.427 15.257 4.57 16.714 4.57A4.286 4.286 0 0121 8.857C21 13.686 12 21 12 21z" /></svg>
              <span className="text-[rgb(255,46,64)]">327</span>
            </button>
            <button className="flex items-center gap-1 hover:text-zinc-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" /></svg>
              <span>16</span>
            </button>
            <button className="flex items-center gap-1 hover:text-zinc-300">
              <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>
              <span>31</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

function LinkedInCard({ aiFinalText }: { aiFinalText: string }) {
  // LinkedIn 스타일: 실제 회사명/직함/부제목 등
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 shadow flex flex-col text-[15px]">
      <div className="flex items-center px-3 pt-2 pb-1">
        <img src="https://randomuser.me/api/portraits/men/32.jpg" alt="profile" className="w-8 h-8 rounded-full mr-2" />
        <div className="flex-1 min-w-0">
          <div className="font-semibold text-zinc-900 text-[15px] leading-tight truncate">Keeyong H.</div>
          <div className="text-xs text-zinc-500">Advisor, Educator, and Mentor at Productivity Inc.</div>
          <div className="text-xs text-zinc-400">3h · Edited</div>
        </div>
        <button className="text-zinc-400 hover:text-zinc-600">
          <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
            <circle cx="12" cy="6" r="1.5"/>
            <circle cx="12" cy="12" r="1.5"/>
            <circle cx="12" cy="18" r="1.5"/>
          </svg>
        </button>
        <button className="ml-2 text-blue-600 font-semibold text-sm">+ Follow</button>
      </div>
      <div className="px-3 py-2 text-zinc-900 flex-1">
        <div>문득 내일 아침에는 조금 더 일찍 일어나 동네 공원을 걸어봐야겠다는 생각이 들었습니다. 새벽 공기가 전해 줄 상쾌함과 고요함을 기대하며 일정을 정리했답니다.</div>
        <div className="mt-1">{aiFinalText}</div>
      </div>
      <div className="flex items-center justify-between px-3 pb-2 text-xs text-zinc-500">
        <span className="flex items-center gap-1">
          <svg className="w-4 h-4" viewBox="0 0 24 24" fill="#0A66C2" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" />
          </svg>
          327
        </span>
        <span>16 comments · 31 shares</span>
      </div>
      <div className="border-t border-zinc-200" />
      <div className="flex items-center justify-around py-1 px-2 text-zinc-500">
        <button><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 21h8a2 2 0 002-2V7a2 2 0 00-2-2H8a2 2 0 00-2 2v12a2 2 0 002 2z" /></svg></button>
        <button><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 15a2 2 0 01-2 2H7l-4 4V5a2 2 0 012-2h12a2 2 0 012 2z" /></svg></button>
        <button><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 8h2a2 2 0 012 2v8a2 2 0 01-2 2H5a2 2 0 01-2-2v-8a2 2 0 012-2h2m10-4v4m0 0l-4-4m4 4l4-4" /></svg></button>
        <button><svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 21l-7-5-7 5V5a2 2 0 012-2h10a2 2 0 012 2z" /></svg></button>
      </div>
    </div>
  );
}

function NaverCard({ aiFinalText }: { aiFinalText: string }) {
  return (
    <div className="w-full h-full bg-white rounded-xl border border-zinc-200 shadow flex flex-col text-[15px]">
      <div className="px-4 pt-4 pb-3">
        <div className="text-xs text-zinc-500 mb-1">일상</div>
        <div className="font-bold text-xl leading-snug text-zinc-900 mb-2">이사간 새로운 집에서</div>
        <div className="flex justify-between items-center gap-2">
          <div className="flex items-center gap-2">
            <img src="https://randomuser.me/api/portraits/men/38.jpg" alt="profile" className="w-7 h-7 rounded-full mr-1" />
            <div className="flex flex-col justify-center">
              <div className="text-sm text-zinc-800">일상다반사</div>
              <div className="text-xs text-zinc-500">2025. 4. 2. 1:29</div>
            </div>
          </div>
          <button className="ml-2 px-2 py-0.5 border border-[#03C75A] text-[#03C75A] rounded text-xs font-medium">+ 이웃추가</button>
        </div>
      </div>
      <div className="border-t border-zinc-100 mb-3" />
      <div className="px-4 pb-4 text-zinc-700 text-[15px] flex-1">
        <div className="mb-1">문득 내일 아침에는 조금 더 일찍 일어나 동네 공원을 걸어봐야겠다는 생각이 들었습니다. 새벽 공기가 전해 줄 상쾌함과 고요함을 기대하며 일정을 정리했답니다.</div>
        <div>{aiFinalText}</div>
      </div>
      <div className="border-t border-zinc-100 px-4 py-3 flex items-center text-zinc-500 text-[15px]">
        <button className="flex items-center mr-5 group">
          <svg className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M12 21.35L10.55 20.03C5.4 15.36 2 12.28 2 8.5C2 5.42 4.42 3 7.5 3C9.24 3 10.91 3.81 12 5.09C13.09 3.81 14.76 3 16.5 3C19.58 3 22 5.42 22 8.5C22 12.28 18.6 15.36 13.45 20.04L12 21.35Z" fill="#FF5656"/>
          </svg>
          <span>28</span>
        </button>
        <button className="flex items-center mr-5 group">
          <svg className="w-5 h-5 mr-1.5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M20 2H4C2.9 2 2 2.9 2 4V22L6 18H20C21.1 18 22 17.1 22 16V4C22 2.9 21.1 2 20 2ZM20 16H5.17L4 17.17V4H20V16Z" fill="#888888"/>
          </svg>
          <span>16</span>
        </button>
        <div className="flex-1" />
        <button className="text-zinc-500">
          <svg className="w-5 h-5" viewBox="0 0 24 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16 13H13V16C13 16.55 12.55 17 12 17C11.45 17 11 16.55 11 16V13H8C7.45 13 7 12.55 7 12C7 11.45 7.45 11 8 11H11V8C11 7.45 11.45 7 12 7C12.55 7 13 7.45 13 8V11H16C16.55 11 17 11.45 17 12C17 12.55 16.55 13 16 13Z" fill="#888888"/>
            <path d="M12 2C6.48 2 2 6.48 2 12C2 17.52 6.48 22 12 22C17.52 22 22 17.52 22 12C22 6.48 17.52 2 12 2ZM12 20C7.59 20 4 16.41 4 12C4 7.59 7.59 4 12 4C16.41 4 20 7.59 20 12C20 16.41 16.41 20 12 20Z" fill="#888888"/>
          </svg>
        </button>
      </div>
    </div>
  );
}

const SLIDE_CARDS = [
  (aiFinalText: string) => <ThreadsCard key="threads" aiFinalText={aiFinalText} />, 
  (aiFinalText: string) => <LinkedInCard key="linkedin" aiFinalText={aiFinalText} />, 
  (aiFinalText: string) => <NaverCard key="naver" aiFinalText={aiFinalText} />
];

export default function HeroAnimation() {
  const [elapsed, setElapsed] = useState(0);
  const [manualPhase, setManualPhase] = useState<Phase | null>(null);
  const phase = manualPhase ?? getPhase(elapsed);
  const [showSlides, setShowSlides] = useState(false);
  const [slideIdx, setSlideIdx] = useState(0);

  /* ---------------------------- 오토 타이머 ---------------------------- */
  useEffect(() => {
    if (manualPhase || showSlides) return;
    const id = setInterval(() => {
      setElapsed((prev) => (prev + 30) % LOOP_MS);
    }, 30);
    return () => clearInterval(id);
  }, [manualPhase, showSlides]);

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
  useEffect(() => {
    if (phase === 'insert' && !showSlides) {
      setShowSlides(true);
      setSlideIdx(0);
    }
  }, [phase, showSlides]);

  useEffect(() => {
    if (!showSlides) return;
    if (slideIdx < SLIDE_CARDS.length - 1) {
      const id = setTimeout(() => setSlideIdx(idx => idx + 1), SLIDE_DURATION);
      return () => clearTimeout(id);
    } else {
      const id = setTimeout(() => {
        setShowSlides(false);
        setSlideIdx(0);
        setManualPhase(null);
        setElapsed(0);
      }, SLIDE_DURATION + SLIDE_RESET_DELAY);
      return () => clearTimeout(id);
    }
  }, [showSlides, slideIdx]);

  return (
    <div className="w-full flex justify-center pt-4 lg:pt-12 overflow-hidden">
      <div className="relative w-full max-w-[380px] md:max-w-[460px] aspect-[9/12] overflow-hidden">
        {/* Blog UI – 뒤 레이어 */}
        {phase === 'insert' && showSlides ? (
          <AnimatePresence initial={false} mode="wait">
            <motion.div
              key={slideIdx}
              initial={{ x: 100, opacity: 0 }}
              animate={{ x: 0, opacity: 1 }}
              exit={{ x: -100, opacity: 0 }}
              transition={{ duration: 0.6, ease: "easeInOut" }}
              className="absolute inset-0"
            >
              {SLIDE_CARDS[slideIdx](aiFinalText)}
            </motion.div>
          </AnimatePresence>
        ) : (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: isSlideOut ? 1 : 0 }}
            transition={{ duration: 0.4, delay: 0.1 }}
            className="absolute inset-0 bg-black rounded-2xl shadow-xl border border-zinc-800 overflow-hidden flex flex-col"
          >
            {/* Threads 스타일 블로그 헤더 */}
            <header className="flex items-center gap-3 px-4 pt-4 pb-1">
              <div className="w-9 h-9 rounded-full bg-zinc-700 flex items-center justify-center">
                <span className="text-zinc-200 text-base font-bold">W</span>
              </div>
              <div className="flex flex-col flex-1 min-w-0">
                <span className="font-semibold text-zinc-100 text-[15px] leading-tight truncate">Writivity</span>
                <span className="text-zinc-500 text-xs">3시간 전</span>
              </div>
              <button className="text-zinc-500 hover:text-zinc-300">
                <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <circle cx="12" cy="6" r="1.5"/>
                  <circle cx="12" cy="12" r="1.5"/>
                  <circle cx="12" cy="18" r="1.5"/>
                </svg>
              </button>
            </header>
            <div className="flex-1 flex flex-col bg-black">
              <div className="flex-1 px-4 pt-1 overflow-y-auto text-zinc-100 text-[15px] whitespace-pre-line">
                <div className="mb-2 space-y-2">
                  <p>문득 내일 아침에는 조금 더 일찍 일어나 동네 공원을 걸어봐야겠다는 생각이 들었습니다. 새벽 공기가 전해 줄 상쾌함과 고요함을 기대하며 일정을 정리했답니다.</p>
                  <p className="whitespace-pre-line text-zinc-100">{aiFinalText}</p>
                </div>
              </div>
              <div className="border-t border-zinc-800 bg-black">
                <div className="flex items-center gap-8 px-4 py-2 text-zinc-500 text-[14px]">
                  <button className="flex items-center gap-1 hover:text-zinc-300 group">
                    <svg className="w-5 h-5" fill="rgb(255, 46, 64)" stroke="rgb(255, 46, 64)" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1.5} d="M12 21C12 21 4 13.686 4 8.857A4.286 4.286 0 018.286 4.57c1.457 0 2.857.857 3.714 2.057C13.857 5.427 15.257 4.57 16.714 4.57A4.286 4.286 0 0121 8.857C21 13.686 12 21 12 21z" /></svg>
                    <span className="text-[rgb(255,46,64)]">327</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-zinc-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 11.5a8.38 8.38 0 01-.9 3.8 8.5 8.5 0 01-7.6 4.7 8.38 8.38 0 01-3.8-.9L3 21l1.9-5.7a8.38 8.38 0 01-.9-3.8 8.5 8.5 0 014.7-7.6 8.38 8.38 0 013.8-.9h.5a8.5 8.5 0 018 8v.5z" /></svg>
                    <span>16</span>
                  </button>
                  <button className="flex items-center gap-1 hover:text-zinc-300">
                    <svg className="w-5 h-5" fill="none" stroke="currentColor" viewBox="0 0 24 24"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L11 13" /><path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M22 2L15 22l-4-9-9-4 20-7z" /></svg>
                    <span>31</span>
                  </button>
                </div>
              </div>
            </div>
          </motion.div>
        )}

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
                  <span>톤 & 매너 분석 중…</span>
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
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="h-full flex flex-col"
                >
                  <p className="flex-1 whitespace-pre-wrap text-zinc-800">
                    {aiFinalText}
                  </p>
                  <div className="mt-3 self-end flex gap-2">
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className={`bg-zinc-200 text-zinc-700 rounded-full flex items-center justify-center p-2.5 md:p-3 lg:p-3.5 shadow-md`}
                      onClick={() => {
                        setManualPhase("generating");
                        setTimeout(() => setManualPhase(null), 2500);
                      }}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <Loader2 className="h-4 w-4 md:h-5 md:w-5" />
                    </motion.button>
                    <motion.button
                      whileTap={{ scale: 0.85 }}
                      className={`bg-indigo-500 text-white rounded-full flex items-center justify-center p-2.5 md:p-3 lg:p-3.5 shadow-md`}
                      onClick={handleSelect}
                      initial={{ scale: 0, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      transition={{ type: "spring", stiffness: 400, damping: 12 }}
                    >
                      <Check className="h-4 w-4 md:h-5 md:w-5" />
                    </motion.button>
                  </div>
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
