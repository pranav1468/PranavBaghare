import { useState } from "react";
import { Activity, Layers, ScanEye } from "lucide-react";

type ViewMode = "detect" | "segment" | "track";

const modeLabels: Record<ViewMode, string> = {
  detect: "Object detection",
  segment: "Semantic segmentation",
  track: "Object tracking",
};

export default function ComputerVisionConsole() {
  const [mode, setMode] = useState<ViewMode>("detect");

  return (
    <div className="vision-console">
      <div className="vision-console__chrome">
        <div className="vision-console__identity">
          <span className="vision-console__eyebrow">Perception lab</span>
          <span className="vision-console__title">Computer vision / 01</span>
        </div>
        <span className="vision-console__demo"><span /> Sample visualization</span>
      </div>

      <div className="vision-console__tabs" role="tablist" aria-label="Computer vision visualization mode">
        <button type="button" role="tab" aria-selected={mode === "detect"} className={mode === "detect" ? "is-active" : ""} onClick={() => setMode("detect")}>
          <ScanEye size={15} /> Detect
        </button>
        <button type="button" role="tab" aria-selected={mode === "segment"} className={mode === "segment" ? "is-active" : ""} onClick={() => setMode("segment")}>
          <Layers size={15} /> Segment
        </button>
        <button type="button" role="tab" aria-selected={mode === "track"} className={mode === "track" ? "is-active" : ""} onClick={() => setMode("track")}>
          <Activity size={15} /> Track
        </button>
      </div>

      <div className={"vision-console__viewport vision-console__viewport--" + mode}>
        <div className="vision-console__frame-meta">
          <span>CAM_03 / INPUT FRAME</span>
          <span>00:00:24:08</span>
        </div>
        <svg viewBox="0 0 640 390" role="img" aria-labelledby="cv-scene-title cv-scene-desc">
          <title id="cv-scene-title">Illustrative computer vision scene</title>
          <desc id="cv-scene-desc">A stylized city street with cars and pedestrians. The selected mode overlays detection boxes, segmentation masks, or object tracking paths.</desc>
          <defs>
            <linearGradient id="cv-sky" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#263944" />
              <stop offset="100%" stopColor="#17252d" />
            </linearGradient>
            <linearGradient id="cv-road" x1="0" y1="0" x2="0" y2="1">
              <stop offset="0%" stopColor="#37434a" />
              <stop offset="100%" stopColor="#20282d" />
            </linearGradient>
            <linearGradient id="cv-glass" x1="0" y1="0" x2="1" y2="1">
              <stop offset="0%" stopColor="#7895a0" stopOpacity=".65" />
              <stop offset="100%" stopColor="#435b67" stopOpacity=".25" />
            </linearGradient>
            <pattern id="cv-grain" width="4" height="4" patternUnits="userSpaceOnUse">
              <circle cx="1" cy="1" r=".55" fill="#fff" opacity=".13" />
            </pattern>
          </defs>

          <rect width="640" height="390" fill="url(#cv-sky)" />
          <circle cx="510" cy="65" r="34" fill="#f2ad77" opacity=".13" />
          <path d="M0 180 L640 150 L640 242 L0 250Z" fill="#293940" />
          <g fill="#17252d" stroke="#50636c" strokeWidth="1">
            <path d="M0 65 L86 52 L86 250 L0 250Z" />
            <path d="M91 88 L158 74 L158 244 L91 244Z" />
            <path d="M178 45 L246 57 L246 238 L178 238Z" />
            <path d="M390 68 L467 48 L467 229 L390 229Z" />
            <path d="M480 91 L565 68 L565 236 L480 236Z" />
            <path d="M573 55 L640 67 L640 240 L573 240Z" />
          </g>
          <g fill="url(#cv-glass)" opacity=".9">
            <path d="M14 83h13v20H14zm25-5h13v20H39zm25-4h13v20H64zM105 105h12v16h-12zm24-5h12v16h-12zM190 69h12v18h-12zm24 4h12v18h-12zM405 89h13v18h-13zm24-7h13v18h-13zM498 113h13v17h-13zm25-7h13v17h-13zm25-7h13v17h-13zM592 81h12v17h-12z" />
          </g>
          <path d="M0 237 L640 218 L640 390 L0 390Z" fill="url(#cv-road)" />
          <path d="M0 237 L640 218" stroke="#839096" strokeOpacity=".4" strokeWidth="2" />
          <path d="M0 252 L640 238" stroke="#f3d6a8" strokeOpacity=".5" strokeWidth="2" strokeDasharray="10 10" />
          <path d="M0 326 L640 315" stroke="#f3d6a8" strokeOpacity=".55" strokeWidth="3" strokeDasharray="32 25" />
          <path d="M0 358 L640 350" stroke="#9aa4a5" strokeOpacity=".2" strokeWidth="1" />
          <g opacity=".35" stroke="#a9b8bb" strokeWidth="1">
            <path d="M70 390 L260 238M210 390 L330 235M430 390 L390 230M590 390 L460 225" />
          </g>

          <g>
            <path d="M160 290l20-30q8-9 22-9h62q15 0 24 13l14 20 10 5v28H151v-20z" fill="#d96d48" stroke="#f4a17c" strokeWidth="2" />
            <path d="M193 260l13-17h56l16 19z" fill="#24343d" stroke="#f8b18b" strokeWidth="1.5" />
            <path d="M218 244v18m26-18v18" stroke="#8499a0" strokeWidth="1.5" />
            <circle cx="190" cy="317" r="11" fill="#11191e" stroke="#9ba7a9" strokeWidth="3" />
            <circle cx="284" cy="317" r="11" fill="#11191e" stroke="#9ba7a9" strokeWidth="3" />
            <path d="M418 267l13-20q6-8 17-8h43q12 0 18 10l12 20 8 4v25H408v-20z" fill="#718b80" stroke="#a9c5ad" strokeWidth="2" />
            <path d="M443 244l10-13h35l13 14z" fill="#22353b" stroke="#b2c2b6" strokeWidth="1.3" />
            <circle cx="436" cy="296" r="9" fill="#11191e" stroke="#9ba7a9" strokeWidth="2.5" />
            <circle cx="504" cy="296" r="9" fill="#11191e" stroke="#9ba7a9" strokeWidth="2.5" />
          </g>
          <g fill="#d2c2a6">
            <circle cx="350" cy="217" r="6" />
            <path d="M345 225l-4 23 17 1 3-24z" />
            <path d="M344 244l-8 20m19-18 7 20" stroke="#d2c2a6" strokeWidth="4" strokeLinecap="round" />
            <circle cx="556" cy="212" r="5" />
            <path d="M552 219l-3 18 14 1 2-19z" />
            <path d="M551 237l-6 16m18-15 5 16" stroke="#d2c2a6" strokeWidth="3" strokeLinecap="round" />
          </g>
          <rect width="640" height="390" fill="url(#cv-grain)" opacity=".45" />

          {mode === "detect" && (
            <g className="vision-overlay vision-overlay--detect">
              <rect x="148" y="232" width="158" height="100" rx="4" fill="none" stroke="#ff8a61" strokeWidth="2" />
              <path d="M148 249v-17h24m110 0h24v17" fill="none" stroke="#ff8a61" strokeWidth="3" />
              <rect x="148" y="214" width="94" height="17" rx="3" fill="#ff8a61" />
              <text x="156" y="226" fill="#171a1b" fontSize="10" fontWeight="700" letterSpacing="1">VEHICLE / 01</text>
              <rect x="399" y="223" width="145" height="87" rx="4" fill="none" stroke="#8dd6c6" strokeWidth="2" />
              <rect x="399" y="205" width="95" height="17" rx="3" fill="#8dd6c6" />
              <text x="407" y="217" fill="#10201f" fontSize="10" fontWeight="700" letterSpacing="1">VEHICLE / 02</text>
              <rect x="329" y="202" width="39" height="66" rx="3" fill="none" stroke="#e8c18d" strokeWidth="1.7" strokeDasharray="4 3" />
              <text x="328" y="194" fill="#e8c18d" fontSize="9" fontWeight="700">PERSON</text>
            </g>
          )}

          {mode === "segment" && (
            <g className="vision-overlay vision-overlay--segment">
              <path d="M0 260 L640 245 L640 390 L0 390Z" fill="#67c8b0" opacity=".16" />
              <path d="M153 290l27-31 84-2 27 30 8 34-147 2z" fill="#ff8a61" opacity=".42" stroke="#ff9a73" strokeWidth="2" />
              <path d="M409 269l24-28 59-3 31 30 13 23-129 7z" fill="#a6d7a5" opacity=".45" stroke="#bde5b7" strokeWidth="2" />
              <path d="M337 222l8-8 12 1 4 11-5 25-16 1-6-14z" fill="#e9c58e" opacity=".55" stroke="#ffe0a9" strokeWidth="1.5" />
              <g fill="#d9eee7" fontSize="10" fontWeight="700" letterSpacing="1">
                <text x="22" y="283">ROAD REGION</text>
                <text x="166" y="354">CLASS 02 / VEHICLE</text>
              </g>
            </g>
          )}

          {mode === "track" && (
            <g className="vision-overlay vision-overlay--track">
              <path d="M87 353 C148 340 176 303 217 298 S289 287 320 311" fill="none" stroke="#ff8a61" strokeWidth="2.5" strokeDasharray="7 6" />
              <path d="M574 332 C536 312 516 291 486 283 S438 270 420 274" fill="none" stroke="#8dd6c6" strokeWidth="2.5" strokeDasharray="7 6" />
              <g fill="#ff8a61" stroke="#142028" strokeWidth="3">
                <circle cx="87" cy="353" r="5" /><circle cx="217" cy="298" r="5" /><circle cx="320" cy="311" r="5" />
              </g>
              <g fill="#8dd6c6" stroke="#142028" strokeWidth="3">
                <circle cx="574" cy="332" r="5" /><circle cx="486" cy="283" r="5" /><circle cx="420" cy="274" r="5" />
              </g>
              <rect x="185" y="266" width="80" height="18" rx="3" fill="#ff8a61" />
              <text x="195" y="279" fill="#171a1b" fontSize="10" fontWeight="700" letterSpacing="1">TRACK 01</text>
              <rect x="450" y="250" width="80" height="18" rx="3" fill="#8dd6c6" />
              <text x="460" y="263" fill="#10201f" fontSize="10" fontWeight="700" letterSpacing="1">TRACK 02</text>
            </g>
          )}
        </svg>
        <span className="vision-console__crosshair vision-console__crosshair--one" />
        <span className="vision-console__crosshair vision-console__crosshair--two" />
        <div className="vision-console__corner vision-console__corner--tl" />
        <div className="vision-console__corner vision-console__corner--br" />
        <div className="vision-console__mode-label">{modeLabels[mode]}</div>
      </div>

      <div className="vision-console__pipeline">
        <div className="vision-console__pipeline-head">
          <span>Processing flow</span>
          <span>Illustrative system</span>
        </div>
        <div className="vision-console__steps">
          <span>Input</span><i />
          <span>Model</span><i />
          <span>Output</span>
        </div>
      </div>
    </div>
  );
}
