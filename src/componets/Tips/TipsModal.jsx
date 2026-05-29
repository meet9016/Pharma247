import React from "react";
import tips from "./Tips.json";
import { BsLightbulbFill } from "react-icons/bs";

const TipsModal = ({ id, onClose }) => {
  const tip = React.useMemo(() => tips.find((t) => t.id === id), [id]);

  const sections = React.useMemo(() => {
    if (!tip) return [];
    const byIndex = new Map();

    Object.keys(tip).forEach((k) => {
      let m = k.match(/^title(\d*)$/i);
      if (m) {
        const idx = m[1] || "";
        byIndex.set(idx, { ...(byIndex.get(idx) || {}), title: tip[k] });
        return;
      }
      m = k.match(/^description(\d*)$/i);
      if (m) {
        const idx = m[1] || "";
        byIndex.set(idx, { ...(byIndex.get(idx) || {}), description: tip[k] });
      }
    });

    const ordered = Array.from(byIndex.entries()).sort((a, b) => {
      const ai = a[0] === "" ? 1 : Number(a[0]);
      const bi = b[0] === "" ? 1 : Number(b[0]);
      return ai - bi;
    });

    return ordered.map(([, v]) => v).filter((s) => s.title || s.description);
  }, [tip]);

  return (
    <div
      id="modal"
      className="fixed inset-0 z-[1000] overflow-y-auto px-4 sm:px-6 lg:px-8"
      role="dialog"
      aria-modal="true"
      aria-labelledby="tips-modal-title"
    >
      {/* Backdrop */}
      <div
        className="fixed inset-0 bg-black/60 backdrop-blur-sm transition-all duration-300"
        onClick={onClose}
      />

      {/* Centered Modal */}
      <div className="relative min-h-full flex items-center justify-center py-8">
        <div className="relative w-full max-w-6xl mx-auto bg-white shadow-2xl rounded-3xl overflow-hidden transform transition-all duration-300 scale-100 animate-in fade-in-0 zoom-in-95">
          {/* Close Button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 z-20 w-11 h-11 flex items-center justify-center rounded-full bg-white shadow-lg hover:shadow-xl border border-gray-200/50 text-gray-600 hover:text-gray-800 transition-all duration-200 hover:scale-105 backdrop-blur-sm"
            aria-label="Close modal"
          >
            <svg
              className="w-5 h-5"
              fill="none"
              stroke="currentColor"
              viewBox="0 0 24 24"
              strokeWidth={2.5}
            >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                d="M6 18L18 6M6 6l12 12"
              />
            </svg>
          </button>

          {/* Content with White Space */}
          <div className="p-6 sm:p-8 lg:p-10 max-h-[90vh] overflow-y-auto scrollbar-thin scrollbar-thumb-gray-300 scrollbar-track-transparent">
            {!tip ? (
              <div className="flex items-center justify-center min-h-[400px] p-8">
                <div className="text-center">
                  <div className="w-24 h-24 rounded-full mx-auto mb-8 flex items-center justify-center text-4xl bg-gradient-to-br from-gray-100 to-gray-200 shadow-inner border border-gray-200">
                    📝
                  </div>
                  <h3 className="text-gray-800 text-2xl font-semibold mb-3">
                    No tips found
                  </h3>
                  <p className="text-gray-500 text-base max-w-md mx-auto leading-relaxed">
                    The requested tip could not be found. Please check the tip ID
                    and try again.
                  </p>
                </div>
              </div>
            ) : (
              <div className="space-y-6">
                {/* YouTube Section */}
                {tip.youtube_url && (
                  <div className="relative group">
                    <div className="relative w-full bg-gray-900 overflow-hidden rounded-xl shadow-lg">
                      <div className="flex flex-col lg:flex-row min-h-[400px] lg:min-h-[500px]">
                        {/* Video */}
                        <div className="relative w-1/2 lg:w-3/5">
                          <iframe
                            src={tip.youtube_url}
                            title="YouTube video player"
                            frameBorder="0"
                            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                            referrerPolicy="strict-origin-when-cross-origin"
                            allowFullScreen
                            className="absolute inset-0 w-full h-full object-cover rounded-t-xl lg:rounded-tr-none lg:rounded-l-xl"
                          />
                        </div>

                        {/* Side Panel */}
                        <div className="relative w-full lg:w-2/5 secondary-bg flex items-center justify-center">
                          <div className="absolute inset-0 bg-gradient-to-br from-black/30 via-transparent to-black/40" />
                          <div className="relative p-8 lg:p-12 text-white">
                            <div className="flex items-center justify-center gap-3 mb-2">
                              <span className="text-lg font-medium uppercase tracking-wider">
                                Pro Tip
                              </span>
                            </div>
                            {tip?.header && (
                              <div className="flex items-center gap-3">
                                <div className="w-12 h-12 rounded-full bg-[var(--color2)]/20 flex items-center justify-center border border-[var(--color2)]/30">
                                  <BsLightbulbFill className="w-6 h-6 text-white" />
                                </div>
                                <h1
                                  id="tips-modal-title"
                                  className="text-2xl sm:text-3xl lg:text-4xl font-bold leading-snug text-white drop-shadow-lg"
                                >
                                  {tip.header}
                                </h1>
                              </div>
                            )}



                            <div className="flex items-center gap-2 opacity-70 mt-6">
                              <div className="w-8 h-0.5 bg-[var(--color2)]" />
                              <div className="w-2 h-2 rounded-full bg-[var(--color2)]" />
                              <div className="w-4 h-0.5 bg-[var(--color2)]" />
                            </div>
                          </div>
                        </div>
                      </div>
                    </div>
                  </div>
                )}

                {/* Sections */}
                {sections.length > 0 && (
                  <div className="px-8 pb-10">
                    <div className="bg-gradient-to-br from-gray-50/80 via-white to-gray-50/60 rounded-2xl p-8 xl:p-10 space-y-6 shadow-sm">

                      {/* Enhanced Step Items */}
                      {sections.map((s, i) => (
                        <div
                          key={i}
                          className="group relative flex items-start gap-6 p-8 bg-white rounded-xl border border-gray-200/80 hover:border-[var(--color2)]/30 shadow-sm hover:shadow-lg transition-all duration-300 animate-in slide-in-from-bottom-4 hover:translate-y-[-2px]"
                          style={{ animationDelay: `${i * 150}ms` }}
                        >
                          {/* Enhanced Step Number */}
                          <div className="relative flex-shrink-0">
                            <div className="w-14 h-14 flex items-center justify-center rounded-xl secondary-bg text-white font-bold text-xl shadow-lg group-hover:shadow-xl transition-all duration-300 group-hover:scale-110 ring-2 ring-white">
                              {i + 1}
                            </div>
                            {/* Connection Line for non-last items */}
                            {i < sections.length - 1 && (
                              <div className="absolute top-16 left-1/2 transform -translate-x-1/2 w-0.5 h-8 bg-gradient-to-b from-gray-300 to-transparent opacity-30" />
                            )}
                          </div>

                          {/* Enhanced Content */}
                          <div className="flex-1 min-w-0">
                            {s.title && (
                              <h3 className="text-xl xl:text-2xl font-bold text-gray-800 leading-tight mb-3 group-hover:text-gray-900 transition-colors duration-200">
                                {s.title}
                              </h3>
                            )}
                            {s.description && (
                              <p className="text-gray-600 leading-relaxed text-base xl:text-lg font-medium group-hover:text-gray-700 transition-colors duration-200">
                                {s.description}
                              </p>
                            )}
                          </div>

                          {/* Subtle Hover Indicator */}
                          <div className="absolute top-4 right-4 w-2 h-2 rounded-full bg-[var(--color2)] opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                        </div>
                      ))}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default TipsModal;
