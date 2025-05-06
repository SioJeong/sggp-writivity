"use client";
import { Button } from "@/components/ui/button";
import { ArrowRight, Check, Smartphone, Type, Eye, X } from "lucide-react";
import StatCard from "@/components/stat-card";
import AnalyticsWrapper from "@/components/analytics-wrapper";
import { trackEvent } from "@/lib/analytics";
import { useState } from "react";
import HeroAnimation from "@/components/hero-animation";

const SUB_PRICE_LABEL = (
  <>
    <span className="text-gray-500 text-lg line-through">₩4,900 /월</span>
    <span className="font-bold text-lg text-indigo-500">무료 체험 시작하기</span>
  </>
);

export default function Home() {
  const [showEmailModal, setShowEmailModal] = useState(false);
  const [email, setEmail] = useState("");
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [isSubmitted, setIsSubmitted] = useState(false);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);

    await fetch("https://formspree.io/f/xkgroagy", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ email }),
    });

    trackEvent("이메일_등록_완료", { 위치: "히어로_모달" });
    setIsSubmitting(false);
    setIsSubmitted(true);

    // Reset after showing success message
    setTimeout(() => {
      setShowEmailModal(false);
      setIsSubmitted(false);
      setEmail("");
    }, 3000);
  };

  return (
    <AnalyticsWrapper pageEvent="home_page_view">
      <main className="flex min-h-screen flex-col bg-black text-white">
        {/* Hero Section */}
        <section className="relative flex flex-col items-center justify-center px-4 py-24 md:py-32">
          <div className="max-w-xl md:max-w-4xl mx-auto">
            <h1 className="text-4xl md:text-6xl font-bold tracking-tight mb-6">
              모바일에서도 키보드 하나로
              <br />
              완성도 높은 긴 글 작성
              <br />
              <br />
              <span className="block mx-auto text-6xl md:text-8xl font-extrabold bg-gradient-to-r from-zinc-200 via-zinc-400 to-zinc-200 bg-clip-text text-transparent">
                Writivity
              </span>
              <br />
            </h1>
            <p className="text-lg md:text-xl text-gray-300 mb-8 max-w-4xl mx-auto">
              순간의 영감을 놓치지 마세요. 앱 전환 없이 생각을 바로 글로
              발전시키세요.
              <br />
              Writivity의 <strong>AI Writing Engine</strong>이 초안을 작성하고,
              문장 구조를 다듬고, 당신의 고유한 톤까지 반영합니다.
            </p>
            <Button
              size="lg"
              className="rounded-full px-8 py-6 bg-white text-black hover:bg-gray-200 transition-all"
              onClick={() => {
                trackEvent("히어로_시작하기_클릭");
                setShowEmailModal(true);
              }}
            >
              {SUB_PRICE_LABEL} <ArrowRight className="ml-2 h-5 w-5" />
            </Button>
          </div>
          <div className="mt-12 w-full max-w-2xl">
            <HeroAnimation />
          </div>
        </section>

        {/* Problem Section */}
        <section className="py-20 px-4 bg-zinc-900">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-12 text-center">
              모바일에서 긴 글 작성의 번거로움,
              <br />
              이제 끝냅니다
            </h2>
            {/* <ComparisonView /> */}
            <div className="mt-12 grid md:grid-cols-2 gap-8">
              <div className="bg-zinc-800 p-8 rounded-2xl">
                <h3 className="text-2xl font-semibold mb-4">
                  기존 키보드의 한계
                </h3>
                <p className="text-gray-300 mb-6">
                  블로그나 SNS 글 작성 시 여러 앱을 번갈아 사용하느라 창작
                  흐름이 끊기시나요? 메모장, AI 도구, 복사-붙여넣기 과정은 창작
                  몰입도를 떨어뜨립니다.
                </p>
                <ul className="space-y-3">
                  {[
                    "끊어지는 사고 흐름",
                    "반복되는 앱 전환",
                    "번거로운 복사·붙여넣기",
                    "3배 이상 길어지는 작성 시간",
                  ].map((item, i) => (
                    <li key={i} className="flex items-center">
                      <span className="bg-zinc-700 p-1 rounded-full mr-3">
                        <Check className="h-4 w-4" />
                      </span>
                      {item}
                    </li>
                  ))}
                </ul>
              </div>
              <div className="bg-zinc-800 p-8 rounded-2xl flex flex-col">
                <h3 className="text-2xl font-semibold mb-4">
                  Writivity의 해결책
                </h3>
                <p className="text-gray-300 mb-6">
                  Writivity의 AI 키보드는 타이핑과 동시에:
                </p>
                <ul className="space-y-3 mb-6">
                  <li className="flex items-center">
                    <span className="bg-zinc-700 p-1 rounded-full mr-3">
                      <Type className="h-4 w-4" />
                    </span>
                    <span>문장을 자동으로 확장하고</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-zinc-700 p-1 rounded-full mr-3">
                      <Eye className="h-4 w-4" />
                    </span>
                    <span>어색한 표현을 실시간 교정하며</span>
                  </li>
                  <li className="flex items-center">
                    <span className="bg-zinc-700 p-1 rounded-full mr-3">
                      <Smartphone className="h-4 w-4" />
                    </span>
                    <span>문단 구조를 자동으로 정리합니다</span>
                  </li>
                </ul>
                <Button
                  className="mt-auto w-full rounded-xl py-6 bg-white text-black hover:bg-gray-200"
                  onClick={() => {
                    trackEvent("문제점_시작하기_클릭");
                    setShowEmailModal(true);
                  }}
                >
                  {SUB_PRICE_LABEL}
                </Button>
              </div>
            </div>
          </div>
        </section>

        {/* AI Writing Feature */}
        <section className="py-20 px-4">
          <div className="max-w-6xl mx-auto">
            <div className="text-center mb-16">
              <h2 className="text-3xl md:text-5xl font-bold mb-6">
                하나의 키보드로 완성하는 글쓰기의 모든 것
                <br />
                생성부터 교정까지
              </h2>
              <p className="text-xl text-gray-300 max-w-3xl mx-auto">
                Writivity의 AI는 타이핑과 동시에 초안을 확장하고, 문맥을 고려해
                오타와 어색한 표현을 고쳐주며, 사용자의 고유한 스타일을 학습해
                점점 더 정교한 추천을 제공합니다.
              </p>
            </div>

            <div className="grid md:grid-cols-3 gap-8">
              {[
                {
                  title: "AI 초안 생성",
                  description:
                    "키워드만 입력하면 완성도 높은 문단을 제안합니다",
                  icon: <Type className="h-8 w-8" />,
                },
                {
                  title: "맥락 기반 교정",
                  description:
                    "문맥을 이해해 어색한 표현과 오타를 즉시 수정합니다",
                  icon: <Eye className="h-8 w-8" />,
                },
                {
                  title: "학습형 개인화",
                  description:
                    "사용자의 글쓰기 톤을 학습해 갈수록 더 나은 추천을 제공합니다",
                  icon: <Smartphone className="h-8 w-8" />,
                },
              ].map((feature, i) => (
                <div
                  key={i}
                  className="bg-zinc-900 p-8 rounded-2xl text-center"
                >
                  <div className="bg-zinc-800 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-6">
                    {feature.icon}
                  </div>
                  <h3 className="text-xl font-semibold mb-3">
                    {feature.title}
                  </h3>
                  <p className="text-gray-400">{feature.description}</p>
                </div>
              ))}
            </div>
          </div>
        </section>

        {/* Stats Section */}
        <section className="py-20 px-4 bg-zinc-900" id="stats">
          <div className="max-w-6xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-16 text-center">
              데이터로 확인한 생산성 향상
            </h2>

            <div className="grid md:grid-cols-2 gap-8 mb-12">
              <StatCard
                title="70%"
                description="Writivity 사용 시 평균 작성 시간이 70% 단축되었습니다"
                icon={<Smartphone className="h-8 w-8" />}
              />
              <StatCard
                title="5배"
                description="AI 초안 생성으로 초기 글 작성 속도가 5배 빨라집니다"
                icon={<Type className="h-8 w-8" />}
              />
            </div>

            <div className="bg-zinc-800 p-8 md:p-12 rounded-2xl text-center">
              <h3 className="text-2xl md:text-3xl font-bold mb-6">
                Writivity로 콘텐츠 제작 효율 극대화
              </h3>
              <p className="text-xl text-gray-300 mb-8 max-w-3xl mx-auto">
                단순 타이핑을 넘어, AI가 초안·교정을 모두 처리하여 창작자는 핵심
                아이디어에만 집중할 수 있습니다.
              </p>
            </div>
          </div>
        </section>

        {/* Final CTA */}
        <section className="py-24 px-4 text-center" id="early-access">
          <div className="max-w-4xl mx-auto">
            <h2 className="text-3xl md:text-5xl font-bold mb-6">
              지금 신청하고 혜택을 받아보세요
            </h2>
            <p className="text-xl text-gray-300 mb-8">
              Writivity 출시 알림 및 무료 체험 기회를 가장 먼저 받아보세요.
            </p>
            <Button
              className="p-8 px-16 mb-4 w-xl rounded-full bg-white text-black text-lg text-indigo-500 font-bold hover:bg-gray-200"
              onClick={() => setShowEmailModal(true)}
            >
              얼리 액세스 신청
            </Button>
            <p className="text-sm text-gray-400">
              개인정보는 안전하게 보호되며, 서비스 안내 목적으로만 사용됩니다.
            </p>
          </div>
        </section>

        {/* Email Registration Modal */}
        {showEmailModal && (
          <div className="fixed inset-0 bg-black bg-opacity-70 flex items-center justify-center z-50 p-4 animate-fadeIn">
            <div
              className="bg-zinc-800 rounded-2xl max-w-md w-full p-6 relative animate-scaleIn"
              onClick={(e) => e.stopPropagation()}
            >
              <button
                className="absolute top-4 right-4 text-gray-400 hover:text-white"
                onClick={() => setShowEmailModal(false)}
              >
                <X className="h-6 w-6" />
              </button>

              <div className="text-center mb-6">
                <h3 className="text-2xl font-bold mb-2">
                  Writivity 얼리 액세스
                </h3>
                <p className="text-gray-300">
                  이메일을 등록하고 출시 소식과 무료 체험 기회를 받아보세요.
                </p>
              </div>

              {!isSubmitted ? (
                <form onSubmit={handleSubmit} className="space-y-4">
                  <div>
                    <label
                      htmlFor="email"
                      className="block text-sm font-medium text-gray-300 mb-1"
                    >
                      이메일 주소
                    </label>
                    <input
                      type="email"
                      name="email"
                      id="email"
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      className="w-full px-4 py-3 rounded-lg bg-zinc-700 border border-zinc-600 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-white"
                      placeholder="your@email.com"
                      required
                    />
                  </div>

                  <div className="pt-2">
                    <Button
                      type="submit"
                      className="w-full py-3 rounded-lg bg-white text-black hover:bg-gray-200 transition-all"
                      disabled={isSubmitting}
                    >
                      {isSubmitting ? (
                        <span className="flex items-center justify-center">
                          <svg
                            className="animate-spin -ml-1 mr-2 h-4 w-4 text-black"
                            xmlns="http://www.w3.org/2000/svg"
                            fill="none"
                            viewBox="0 0 24 24"
                          >
                            <circle
                              className="opacity-25"
                              cx="12"
                              cy="12"
                              r="10"
                              stroke="currentColor"
                              strokeWidth="4"
                            ></circle>
                            <path
                              className="opacity-75"
                              fill="currentColor"
                              d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                            ></path>
                          </svg>
                          처리 중...
                        </span>
                      ) : (
                        "등록하기"
                      )}
                    </Button>
                  </div>

                  <p className="text-xs text-gray-400 text-center">
                    개인정보는 안전하게 보호되며, 서비스 안내 목적으로만
                    사용됩니다.
                  </p>
                </form>
              ) : (
                <div className="text-center py-8 animate-fadeIn">
                  <div className="bg-green-500 bg-opacity-20 w-16 h-16 rounded-full flex items-center justify-center mx-auto mb-4">
                    <Check className="h-8 w-8 text-green-400" />
                  </div>
                  <h4 className="text-xl font-semibold mb-2">
                    등록이 완료되었습니다!
                  </h4>
                  <p className="text-gray-300">
                    Writivity 출시 소식을 가장 먼저 알려드리겠습니다.
                  </p>
                </div>
              )}
            </div>
          </div>
        )}
      </main>
    </AnalyticsWrapper>
  );
}
