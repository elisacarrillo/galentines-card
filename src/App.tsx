import { useState, useEffect, useRef } from "react";

const poem = [
  "roses are red",
  "violets are blue",
  "i love watching our friendship bloom",
  "",
  "from friends at snap, to friends from camp,",
  "i am grateful to see",
  "the light from your heart lamp",
  "",
  "you make me smile, you make me dance,",
  "lets do brunch or go to france",
];

// const ENV_W = 320;
// const ENV_H = 200;
// const CARD_W = 272;
// const CARD_H = 500;

// export default function ValentineCard() {
//   const [stage, setStage] = useState("idle");
//   const [cardAbove, setCardAbove] = useState(false);
//   const [scale, setScale] = useState(1);

//   useEffect(() => {
//     const update = () => {
//       const vw = window.innerWidth;
//       setScale(Math.min(1, (vw - 32) / 320));
//     };
//     update();
//     window.addEventListener("resize", update);
//     return () => window.removeEventListener("resize", update);
//   }, []);
//   const [poemLines, setPoemLines] = useState([]);

//   const handleClick = () => {
//     if (stage !== "idle") return;
//     setStage("shaking");
//     setTimeout(() => setStage("opening"), 400);   // flap starts
//     setTimeout(() => setStage("open"), 1800);      // flap done (1.2s) + 200ms pause → card rises
//     setTimeout(() => setCardAbove(true), 1800 + 1400); // card animation done
//     setTimeout(() => setStage("poem"), 1800+200);   // poem starts just after card settles
//   };

//   const handleReplay = () => {
//     setPoemLines([]);
//     setCardAbove(false);
//     setStage("idle");
//   };

//   useEffect(() => {
//     if (stage === "poem") {
//       poem.forEach((line, i) => {
//         setTimeout(() => setPoemLines((p) => [...p, line]), i * 130);
//       });
//     }
//   }, [stage]);

//   const isOpen = stage === "open" || stage === "poem";
//   const isOpening = stage === "opening";

//   // Card moves upward (negative = up).
//   // At rest: card bottom aligns with envelope bottom → translateY = 0
//   // When open: card rises so most of it is above the envelope
//   const cardY = isOpen ? -(CARD_H + ENV_H - 20) : 0; // card only moves on "open", stays hidden during flap animation

//   return (
//     <div style={S.root}>
//       {/* Grain overlay */}
//       <div style={{
//         position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
//         backgroundImage: "radial-gradient(circle, rgba(255,220,180,0.04) 1px, transparent 1px)",
//         backgroundSize: "3px 3px",
//       }} />
//       {/* BG hearts */}
//       <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
//         {[...Array(18)].map((_, i) => (
//           <div key={i} style={{
//             position: "absolute",
//             left: `${(i * 41 + 9) % 100}%`,
//             top: `${(i * 67 + 13) % 100}%`,
//             fontSize: `${24 + (i * 9) % 32}px`,
//             color: "#8b1515",
//             opacity: 0.08 + (i % 4) * 0.04,
//             animationName: "hFloat",
//             animationDuration: `${3 + (i % 3)}s`,
//             animationTimingFunction: "ease-in-out",
//             animationIterationCount: "infinite",
//             animationDelay: `${(i * 0.5) % 3}s`,
//           }}>♥</div>
//         ))}
//       </div>

//       {/* Candlelight glow */}
//       <div style={{
//         position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
//         background: "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(160,20,20,0.3) 0%, transparent 70%)",
//       }} />

//       <div style={{
//         display: "flex",
//         flexDirection: "column",
//         alignItems: "center",
//         gap: 20,
//         animation: stage === "shaking" ? "shake 0.9s ease-in-out" : "none",
//         transform: `scale(${scale})`,
//         transformOrigin: "center center",
//       }}>

//         {/*
//           The envelope is the root element.
//           Everything is positioned relative to it.
//           Card sits inside, clipped by overflow:hidden on the envelope,
//           then rises out the top (overflow becomes visible above envelope via
//           a wrapper that's taller).

//           Structure:
//           [wrapper - tall enough for risen card + envelope]
//             [card - absolutely positioned, rises upward]          z:2
//             [envelope back - decorative, behind card]             z:1
//             [pocket mask - top strip of envelope, hides card]     z:3
//             [flap - attached to top of envelope]                  z:4 or 0
//             [seal]                                                z:10
//         */}

//         {/* Wrapper: exactly envelope width, tall enough to show risen card */}
//         <div style={{
//           position: "relative",
//           width: ENV_W,
//           // When open: card rises CARD_H-60 above envelope top, so total height = CARD_H-60 + ENV_H
//           // But we always reserve that space so layout doesn't jump
//           height: CARD_H + ENV_H,
//           overflow: "hidden",
//           cursor: stage === "idle" ? "pointer" : "default",
//         }} onClick={handleClick}>

//           {/* CARD — bottom of card aligns with bottom of envelope at rest */}
//           {/* Card top in wrapper = (CARD_H-60 + ENV_H) - CARD_H = ENV_H - 60 */}
//           <div style={{
//             position: "absolute",
//             top: CARD_H + ENV_H, // card starts fully below wrapper = fully hidden
//             left: "50%",
//             transform: `translateX(-50%) translateY(${cardY}px)`,
//             transition: isOpen
//               ? "transform 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
//               : "none",
//             width: CARD_W,
//             height: CARD_H,
//             background: "#f5edd8",
//             borderRadius: "2px",
//             border: "1px solid rgba(100,30,10,0.15)",
//             boxShadow: "0 24px 80px rgba(0,0,0,0.9), 0 4px 20px rgba(80,0,0,0.4)",
//             zIndex: cardAbove ? 7 : isOpen ? 3 : 2,
//             display: "flex",
//             flexDirection: "column",
//             // Clip card content so it doesn't show below envelope when hidden
//             overflow: "hidden",
//           }}>
//             <div style={S.cardInner}>
//               <div style={{ width: "100%" }}>
//                 {poemLines.map((line, i) => (
//                   <p key={i} style={{
//                     ...S.poemLine,
//                     ...(line === "" ? { marginBottom: 10 } : {}),
//                     animation: "fadeUp 0.45s ease forwards",
//                     opacity: 0,
//                   }}>{line || " "}</p>
//                 ))}
//               </div>
//             </div>
//           </div>

//           {/* ENVELOPE BACK — sits at bottom of wrapper, behind card (z:1) */}
//           <div style={{
//             position: "absolute",
//             bottom: 0,
//             left: 0,
//             width: ENV_W,
//             height: ENV_H,
//             zIndex: 1,
//             background: "#6b1010",
//             borderRadius: "2px 2px 6px 6px",
//             boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 4px 16px rgba(80,0,0,0.4)",
//             overflow: "hidden",
//           }}>

//           </div>

//           {/* POCKET MASK — top edge of envelope, always in front of card (z:3)
//               This is what makes the card look tucked inside.
//               It's a strip the same color as the envelope sitting at the envelope mouth. */}
//           <div style={{
//             position: "absolute",
//             top: CARD_H,
//             left: 0,
//             width: ENV_W,
//             height: ENV_H,
//             zIndex: 5,
//             background: "#6b1010",
//             borderRadius: "0 0 6px 6px",
//             overflow: "hidden",
//           }}>

//           </div>

//           {/* FLAP — rectangle that rotates back on open, triangle illusion from envelope body */}
//           <div style={{
//             position: "absolute",
//             top: CARD_H,
//             left: 0,
//             width: ENV_W,
//             height: ENV_H / 2,
//             perspective: "600px",
//             zIndex: isOpen && !isOpening ? 0 : 6,
//           }}>
//             {/* The actual rotating flap — a rectangle with diagonal cut via skew */}
//             <div style={{
//               position: "absolute", top: 0, left: 0,
//               width: "100%", height: "100%",
//               transformOrigin: "center top",
//               transform: (isOpen || isOpening) ? "rotateX(180deg)" : "rotateX(0deg)",
//               transition: "transform 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
//               transformStyle: "preserve-3d",
//             }}>
//               {/* Front face */}
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: "linear-gradient(to bottom, #a01515 0%, #6b1010 100%)",
//                 clipPath: "polygon(0 0, 100% 0, 50% 100%)",
//                 backfaceVisibility: "hidden",
//                 WebkitBackfaceVisibility: "hidden",
//               }} />
//               {/* Back face — points upward when flipped */}
//               <div style={{
//                 position: "absolute", inset: 0,
//                 background: "linear-gradient(to top, #7a0f0f 0%, #3d0808 100%)",
//                 clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
//                 backfaceVisibility: "hidden",
//                 WebkitBackfaceVisibility: "hidden",
//                 transform: "rotateX(180deg)",
//               }} />
//             </div>
//           </div>

//           {/* SEAL — decorative wax seal, fades out when opening */}
//           <div style={{
//             position: "absolute",
//             top: CARD_H + ENV_H / 2 - 30,
//             left: "50%",
//             transform: "translateX(-50%)",
//             animation: (isOpen || isOpening) ? "sealCrack 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
//             width: 60, height: 60,
//             zIndex: 11,
//             pointerEvents: "none",
//           }}>
//             <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
//               <defs>
//                 <radialGradient id="waxGrad" cx="40%" cy="35%" r="60%">
//                   <stop offset="0%" stopColor="#d44000"/>
//                   <stop offset="50%" stopColor="#9b1a00"/>
//                   <stop offset="100%" stopColor="#5a0d00"/>
//                 </radialGradient>
//                 <radialGradient id="waxSheen" cx="35%" cy="30%" r="50%">
//                   <stop offset="0%" stopColor="rgba(255,160,80,0.35)"/>
//                   <stop offset="100%" stopColor="rgba(255,80,0,0)"/>
//                 </radialGradient>
//               </defs>
//               {/* Outer ridged ring — 12 petals */}
//               {[...Array(12)].map((_, i) => {
//                 const angle = (i * 30 * Math.PI) / 180;
//                 const x = 30 + Math.cos(angle) * 26;
//                 const y = 30 + Math.sin(angle) * 26;
//                 return <ellipse key={i} cx={x} cy={y} rx="5" ry="3.5"
//                   transform={`rotate(${i * 30}, ${x}, ${y})`}
//                   fill="url(#waxGrad)" />;
//               })}
//               {/* Main circle body */}
//               <circle cx="30" cy="30" r="20" fill="url(#waxGrad)" />
//               {/* Inner ring detail */}
//               <circle cx="30" cy="30" r="17" fill="none" stroke="rgba(255,120,40,0.25)" strokeWidth="1" />
//               {/* Sheen overlay */}
//               <circle cx="30" cy="30" r="20" fill="url(#waxSheen)" />
//               {/* Heart */}
//               <text x="30" y="35" textAnchor="middle" fontSize="14" fill="rgba(255,220,180,0.95)"
//                 style={{filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))"}}>♥</text>
//             </svg>
//           </div>

//         </div>

//         {stage === "idle" && <p style={S.prompt}>click to open</p>}
//         {stage === "poem" && (
//           <div>
//            <button onClick={(e) => { e.stopPropagation(); handleReplay(); }} style={S.replayBtn}>
//             ↺ replay
//           </button>
//           <a
//             href="https://partiful.com/e/QnNEfH60ReLSrWDyDGtS"
//             target="_blank"
//             rel="noopener noreferrer"
//             onClick={(e) => e.stopPropagation()}
//             style={S.partifulBtn}
//           >
//             🥂 join the party
//           </a>
//           </div>
//         )}
//       </div>

//       <style>{`
//         @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital@1&display=swap');
//         * { box-sizing: border-box; margin: 0; padding: 0; }

//         @keyframes sealCrack {
//           0%   { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
//           20%  { transform: translateX(-50%) scale(1.15) rotate(-8deg); opacity: 1; }
//           50%  { transform: translateX(-50%) scale(0.9) rotate(12deg); opacity: 0.7; }
//           100% { transform: translateX(-50%) scale(0) rotate(25deg); opacity: 0; }
//         }
//         @keyframes hFloat {
//           0%,100% { transform: translateY(0); }
//           50% { transform: translateY(-12px); }
//         }
//         @keyframes shake {
//           0%,100% { transform: rotate(0); }
//           20% { transform: rotate(-1deg) translateY(-2px); }
//           40% { transform: rotate(1deg) translateY(-3px); }
//           60% { transform: rotate(-0.75deg) translateY(-2px); }
//           80% { transform: rotate(0.75deg) translateY(-1px); }
//         }
//         @keyframes fadeUp {
//           from { opacity: 0; transform: translateY(5px); }
//           to { opacity: 1; transform: translateY(0); }
//         }
//         button:hover { background: rgba(192,57,43,0.07) !important; }
//       `}</style>
//     </div>
//   );
// }

// const S = {
//   root: {
//     minHeight: "100dvh",
//     width: "100vw",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//     background: "radial-gradient(ellipse at 40% 50%, #3a0808 0%, #1a0404 40%, #080102 100%)",
//     fontFamily: "'Playfair Display', serif",
//     position: "relative",
//     overflow: "hidden",
//   },

//   cardInner: {
//     flex: 1,
//     padding: "32px 28px",
//     display: "flex",
//     flexDirection: "column",
//     alignItems: "center",
//     justifyContent: "center",
//   },
//   poemLine: {
//     fontFamily: "'Playfair Display', serif",
//     fontStyle: "italic",
//     fontWeight: 300,
//     fontSize: 15.5,
//     lineHeight: 1.9,
//     color: "#2a1206",
//     letterSpacing: "0.03em",
//   },
//   prompt: {
//     fontFamily: "'Quattrocento Sans', sans-serif",
//     fontSize: 11,
//     color: "#8b2000",
//     letterSpacing: "0.18em",
//     opacity: 0.7,
//     textTransform: "uppercase",
//   },
//   partifulBtn: {
//     fontFamily: "'Quattrocento Sans', sans-serif",
//     fontSize: 12,
//     letterSpacing: "0.1em",
//     color: "#f5edd8",
//     background: "rgba(180,30,0,0.35)",
//     border: "1px solid rgba(220,80,30,0.4)",
//     borderRadius: 20,
//     padding: "8px 24px",
//     cursor: "pointer",
//     outline: "none",
//     textDecoration: "none",
//     transition: "background 0.2s",
//     display: "inline-block",
//   },
//   replayBtn: {
//     fontFamily: "'Quattrocento Sans', sans-serif",
//     fontSize: 12,
//     letterSpacing: "0.1em",
//     color: "#c43c00",
//     background: "transparent",
//     border: "1px solid rgba(180,60,0,0.4)",
//     borderRadius: 20,
//     padding: "6px 20px",
//     cursor: "pointer",
//     outline: "none",
//     transition: "background 0.2s",
//   },
// };
// import { useState, useEffect, useRef } from "react";

// const poem = [
//   "In the quiet hush of winter's end,",
//   "where frost still clings to morning glass,",
//   "I find your name on every wind,",
//   "and in the shadows as they pass.",
//   "",
//   "You are the warmth I reach toward,",
//   "the light that bends around the door —",
//   "a gentle, unexpected word",
//   "that makes the world feel less unsure.",
//   "",
//   "So here, between these folded lines,",
//   "I tuck a small and tender thing:",
//   "the way my heart still quietly shines",
//   "whenever I hear your name sing.",
//   "",
//   "Happy Valentine's Day 💌",
// ];

const ENV_W = 320;
const ENV_H = 200;
const CARD_W = 272;
const CARD_H = 500;

export default function ValentineCard() {
  const [stage, setStage] = useState("idle");
  const [cardAbove, setCardAbove] = useState(false);
  const [scale, setScale] = useState(1);
  const audioRef = useRef(null);

  useEffect(() => {
    const update = () => {
      const vw = window.innerWidth;
      setScale(Math.min(1, (vw - 32) / 320));
    };
    update();
    window.addEventListener("resize", update);
    return () => window.removeEventListener("resize", update);
  }, []);
  const [poemLines, setPoemLines] = useState([]);

  const handleClick = () => {
    if (stage !== "idle") return;
    if (audioRef.current) {
      audioRef.current.volume = 0.4;
      audioRef.current.play().catch(() => {});
    }
    setStage("shaking");
    setTimeout(() => setStage("opening"), 400);   // flap starts
    setTimeout(() => setStage("open"), 1800);      // flap done (1.2s) + 200ms pause → card rises
    setTimeout(() => setCardAbove(true), 1800 + 1400); // card animation done
    setTimeout(() => setStage("poem"), 1800 + 1600);   // poem starts just after card settles
  };

  const handleReplay = () => {
    setPoemLines([]);
    setCardAbove(false);
    setStage("idle");
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  };

  useEffect(() => {
    if (stage === "poem") {
      poem.forEach((line, i) => {
        setTimeout(() => setPoemLines((p) => [...p, line]), i * 130);
      });
    }
  }, [stage]);

  const isOpen = stage === "open" || stage === "poem";
  const isOpening = stage === "opening";

  // Card moves upward (negative = up).
  // At rest: card bottom aligns with envelope bottom → translateY = 0
  // When open: card rises so most of it is above the envelope
  const cardY = isOpen ? -(CARD_H + ENV_H - 20) : 0; // card only moves on "open", stays hidden during flap animation

  return (
    <div style={S.root}>
      {/* Grain overlay */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 1,
        backgroundImage: "radial-gradient(circle, rgba(255,220,180,0.04) 1px, transparent 1px)",
        backgroundSize: "3px 3px",
      }} />
      {/* BG hearts */}
      <div style={{ position: "absolute", inset: 0, pointerEvents: "none" }}>
        {[...Array(18)].map((_, i) => (
          <div key={i} style={{
            position: "absolute",
            left: `${(i * 41 + 9) % 100}%`,
            top: `${(i * 67 + 13) % 100}%`,
            fontSize: `${24 + (i * 9) % 32}px`,
            color: "#8b1515",
            opacity: 0.08 + (i % 4) * 0.04,
            animationName: "hFloat",
            animationDuration: `${3 + (i % 3)}s`,
            animationTimingFunction: "ease-in-out",
            animationIterationCount: "infinite",
            animationDelay: `${(i * 0.5) % 3}s`,
          }}>♥</div>
        ))}
      </div>

      {/* Candlelight glow */}
      <div style={{
        position: "absolute", inset: 0, pointerEvents: "none", zIndex: 0,
        background: "radial-gradient(ellipse 70% 60% at 50% 80%, rgba(160,20,20,0.3) 0%, transparent 70%)",
      }} />

      <div style={{
        display: "flex",
        flexDirection: "column",
        alignItems: "center",
        gap: 20,
        animation: stage === "shaking" ? "shake 0.9s ease-in-out" : "none",
        transform: `scale(${scale})`,
        transformOrigin: "center center",
      }}>

        {/*
          The envelope is the root element.
          Everything is positioned relative to it.
          Card sits inside, clipped by overflow:hidden on the envelope,
          then rises out the top (overflow becomes visible above envelope via
          a wrapper that's taller).

          Structure:
          [wrapper - tall enough for risen card + envelope]
            [card - absolutely positioned, rises upward]          z:2
            [envelope back - decorative, behind card]             z:1
            [pocket mask - top strip of envelope, hides card]     z:3
            [flap - attached to top of envelope]                  z:4 or 0
            [seal]                                                z:10
        */}

        {/* Wrapper: exactly envelope width, tall enough to show risen card */}
        <div style={{
          position: "relative",
          width: ENV_W,
          // When open: card rises CARD_H-60 above envelope top, so total height = CARD_H-60 + ENV_H
          // But we always reserve that space so layout doesn't jump
          height: CARD_H + ENV_H,
          overflow: "hidden",
          cursor: stage === "idle" ? "pointer" : "default",
        }} onClick={handleClick}>

          {/* CARD — bottom of card aligns with bottom of envelope at rest */}
          {/* Card top in wrapper = (CARD_H-60 + ENV_H) - CARD_H = ENV_H - 60 */}
          <div style={{
            position: "absolute",
            top: CARD_H + ENV_H, // card starts fully below wrapper = fully hidden
            left: "50%",
            transform: `translateX(-50%) translateY(${cardY}px)`,
            transition: isOpen
              ? "transform 1.4s cubic-bezier(0.25, 0.46, 0.45, 0.94)"
              : "none",
            width: CARD_W,
            height: CARD_H,
            background: "#f5edd8",
            borderRadius: "2px",
            border: "1px solid rgba(100,30,10,0.15)",
            boxShadow: "0 24px 80px rgba(0,0,0,0.9), 0 4px 20px rgba(80,0,0,0.4)",
            zIndex: cardAbove ? 7 : isOpen ? 3 : 2,
            display: "flex",
            flexDirection: "column",
            // Clip card content so it doesn't show below envelope when hidden
            overflow: "hidden",
          }}>
            <div style={S.cardInner}>
              <div style={{ width: "100%" }}>
                {poemLines.map((line, i) => (
                  <p key={i} style={{
                    ...S.poemLine,
                    ...(line === "" ? { marginBottom: 10 } : {}),
                    animation: "fadeUp 0.45s ease forwards",
                    opacity: 0,
                  }}>{line || " "}</p>
                ))}
              </div>
            </div>
          </div>

          {/* ENVELOPE BACK — sits at bottom of wrapper, behind card (z:1) */}
          <div style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            width: ENV_W,
            height: ENV_H,
            zIndex: 1,
            background: "#6b1010",
            borderRadius: "2px 2px 6px 6px",
            boxShadow: "0 20px 60px rgba(0,0,0,0.85), 0 4px 16px rgba(80,0,0,0.4)",
            overflow: "hidden",
          }}>

          </div>

          {/* POCKET MASK — top edge of envelope, always in front of card (z:3)
              This is what makes the card look tucked inside.
              It's a strip the same color as the envelope sitting at the envelope mouth. */}
          <div style={{
            position: "absolute",
            top: CARD_H,
            left: 0,
            width: ENV_W,
            height: ENV_H,
            zIndex: 5,
            background: "#6b1010",
            borderRadius: "0 0 6px 6px",
            overflow: "hidden",
          }}>

          </div>

          {/* FLAP — rectangle that rotates back on open, triangle illusion from envelope body */}
          <div style={{
            position: "absolute",
            top: CARD_H,
            left: 0,
            width: ENV_W,
            height: ENV_H / 2,
            perspective: "600px",
            zIndex: isOpen && !isOpening ? 0 : 6,
          }}>
            {/* The actual rotating flap — a rectangle with diagonal cut via skew */}
            <div style={{
              position: "absolute", top: 0, left: 0,
              width: "100%", height: "100%",
              transformOrigin: "center top",
              transform: (isOpen || isOpening) ? "rotateX(180deg)" : "rotateX(0deg)",
              transition: "transform 1.2s cubic-bezier(0.45, 0.05, 0.55, 0.95)",
              transformStyle: "preserve-3d",
            }}>
              {/* Front face */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to bottom, #a01515 0%, #6b1010 100%)",
                clipPath: "polygon(0 0, 100% 0, 50% 100%)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
              }} />
              {/* Back face — points upward when flipped */}
              <div style={{
                position: "absolute", inset: 0,
                background: "linear-gradient(to top, #7a0f0f 0%, #3d0808 100%)",
                clipPath: "polygon(50% 0%, 0% 100%, 100% 100%)",
                backfaceVisibility: "hidden",
                WebkitBackfaceVisibility: "hidden",
                transform: "rotateX(180deg)",
              }} />
            </div>
          </div>

          {/* SEAL — decorative wax seal, fades out when opening */}
          <div style={{
            position: "absolute",
            top: CARD_H + ENV_H / 2 - 30,
            left: "50%",
            transform: "translateX(-50%)",
            animation: (isOpen || isOpening) ? "sealCrack 0.7s cubic-bezier(0.4, 0, 0.2, 1) forwards" : "none",
            width: 60, height: 60,
            zIndex: 11,
            pointerEvents: "none",
          }}>
            <svg width="60" height="60" viewBox="0 0 60 60" xmlns="http://www.w3.org/2000/svg">
              <defs>
                <radialGradient id="waxGrad" cx="40%" cy="35%" r="60%">
                  <stop offset="0%" stopColor="#d44000"/>
                  <stop offset="50%" stopColor="#9b1a00"/>
                  <stop offset="100%" stopColor="#5a0d00"/>
                </radialGradient>
                <radialGradient id="waxSheen" cx="35%" cy="30%" r="50%">
                  <stop offset="0%" stopColor="rgba(255,160,80,0.35)"/>
                  <stop offset="100%" stopColor="rgba(255,80,0,0)"/>
                </radialGradient>
              </defs>
              {/* Outer ridged ring — 12 petals */}
              {[...Array(12)].map((_, i) => {
                const angle = (i * 30 * Math.PI) / 180;
                const x = 30 + Math.cos(angle) * 26;
                const y = 30 + Math.sin(angle) * 26;
                return <ellipse key={i} cx={x} cy={y} rx="5" ry="3.5"
                  transform={`rotate(${i * 30}, ${x}, ${y})`}
                  fill="url(#waxGrad)" />;
              })}
              {/* Main circle body */}
              <circle cx="30" cy="30" r="20" fill="url(#waxGrad)" />
              {/* Inner ring detail */}
              <circle cx="30" cy="30" r="17" fill="none" stroke="rgba(255,120,40,0.25)" strokeWidth="1" />
              {/* Sheen overlay */}
              <circle cx="30" cy="30" r="20" fill="url(#waxSheen)" />
              {/* Heart */}
              <text x="30" y="35" textAnchor="middle" fontSize="14" fill="rgba(255,220,180,0.95)"
                style={{filter: "drop-shadow(0 1px 2px rgba(0,0,0,0.4))"}}>♥</text>
            </svg>
          </div>

        </div>

        {stage === "idle" && <p style={S.prompt}>click to open</p>}
        {stage === "poem" && (
          <div>
          <button onClick={(e) => { e.stopPropagation(); handleReplay(); }} style={S.replayBtn}>
            ↺ replay
          </button>
          <a
            href="https://partiful.com/e/QnNEfH60ReLSrWDyDGtS"
            target="_blank"
            rel="noopener noreferrer"
            onClick={(e) => e.stopPropagation()}
            style={S.partifulBtn}
          >
            🥂 join the party
          </a>
          </div>
        )}
      </div>

      {/*
        🎵 To add music: place an MP3 in your /public folder and update the src below.
        e.g. src="/your-song.mp3"  or any public URL to an audio file.
      */}
      <audio ref={audioRef} src="/music_trimmed.mp3" loop preload="auto" />

      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:ital,wght@0,400;0,700;1,400;1,700&family=Cormorant+Garamond:ital,wght@0,300;0,400;1,300;1,400&family=EB+Garamond:ital@1&display=swap');
        * { box-sizing: border-box; margin: 0; padding: 0; }

        @keyframes sealCrack {
          0%   { transform: translateX(-50%) scale(1) rotate(0deg); opacity: 1; }
          20%  { transform: translateX(-50%) scale(1.15) rotate(-8deg); opacity: 1; }
          50%  { transform: translateX(-50%) scale(0.9) rotate(12deg); opacity: 0.7; }
          100% { transform: translateX(-50%) scale(0) rotate(25deg); opacity: 0; }
        }
        @keyframes hFloat {
          0%,100% { transform: translateY(0); }
          50% { transform: translateY(-12px); }
        }
        @keyframes shake {
          0%,100% { transform: rotate(0); }
          20% { transform: rotate(-1deg) translateY(-2px); }
          40% { transform: rotate(1deg) translateY(-3px); }
          60% { transform: rotate(-0.75deg) translateY(-2px); }
          80% { transform: rotate(0.75deg) translateY(-1px); }
        }
        @keyframes fadeUp {
          from { opacity: 0; transform: translateY(5px); }
          to { opacity: 1; transform: translateY(0); }
        }
        button:hover { background: rgba(192,57,43,0.07) !important; }
      `}</style>
    </div>
  );
}

const S = {
  root: {
    minHeight: "100dvh",
    width: "100vw",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
    background: "radial-gradient(ellipse at 40% 50%, #3a0808 0%, #1a0404 40%, #080102 100%)",
    fontFamily: "'Playfair Display', serif",
    position: "relative",
    overflow: "hidden",
  },

  cardInner: {
    flex: 1,
    padding: "32px 28px",
    display: "flex",
    flexDirection: "column",
    alignItems: "center",
    justifyContent: "center",
  },
  poemLine: {
    fontFamily: "'Playfair Display', serif",
    fontStyle: "italic",
    fontWeight: 300,
    fontSize: 15.5,
    lineHeight: 1.9,
    color: "#2a1206",
    letterSpacing: "0.03em",
  },
  prompt: {
    fontFamily: "'Quattrocento Sans', sans-serif",
    fontSize: 11,
    color: "#8b2000",
    letterSpacing: "0.18em",
    opacity: 0.7,
    textTransform: "uppercase",
  },
  partifulBtn: {
    fontFamily: "'Quattrocento Sans', sans-serif",
    fontSize: 12,
    letterSpacing: "0.1em",
    color: "#f5edd8",
    background: "rgba(180,30,0,0.35)",
    border: "1px solid rgba(220,80,30,0.4)",
    borderRadius: 20,
    padding: "8px 24px",
    cursor: "pointer",
    outline: "none",
    textDecoration: "none",
    transition: "background 0.2s",
    display: "inline-block",
  },
  replayBtn: {
    fontFamily: "'Quattrocento Sans', sans-serif",
    fontSize: 12,
    letterSpacing: "0.1em",
    color: "#c43c00",
    background: "transparent",
    border: "1px solid rgba(180,60,0,0.4)",
    borderRadius: 20,
    padding: "6px 20px",
    marginRight: 10,
    cursor: "pointer",
    outline: "none",
    transition: "background 0.2s",
  },
};
