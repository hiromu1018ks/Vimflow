"use client";

interface FlowBackgroundProps {
  enabled?: boolean;
  intensity?: "light" | "normal" | "strong";
  className?: string;
}

export default function FlowBackground({ 
  enabled = true, 
  intensity = "normal",
  className = ""
}: FlowBackgroundProps) {
  // パーティクル設定
  const getParticles = () => {
    const baseParticles = Array.from({ length: 10 }, (_, i) => i + 1);

    switch (intensity) {
      case "light":
        return baseParticles.slice(0, 6);
      case "strong":
        return [...baseParticles, ...Array.from({ length: 5 }, (_, i) => i + 11)];
      default:
        return baseParticles;
    }
  };

  const getParticleSize = (index: number) => {
    const sizes = ["small", "medium", "large"];
    return sizes[index % 3];
  };

  if (!enabled) return null;

  const particles = getParticles();

  return (
    <>
      <div 
        className={`fixed inset-0 pointer-events-none z-0 overflow-hidden ${className}`}
        style={{
          background: 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #f1f3f4 70%, #ffffff 100%)'
        }}
        aria-hidden="true"
      >
        <div className="light-rays" />
        
        <div className="particles-background">
          {particles.map((particleNum) => (
            <div
              key={particleNum}
              className={`particle particle-${getParticleSize(particleNum)} particle-${particleNum}`}
            />
          ))}
        </div>
      </div>

      <style jsx>{`
        .particles-background {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 0;
        }

        .particle {
          position: absolute;
          border-radius: 50%;
          opacity: 0;
          filter: blur(0.5px);
        }

        .particle::before {
          content: '';
          position: absolute;
          width: 100%;
          height: 100%;
          background: radial-gradient(circle, rgba(120, 140, 160, 1), rgba(100, 120, 140, 0.8), rgba(140, 160, 180, 0.5), transparent);
          border-radius: 50%;
          box-shadow: 0 0 20px rgba(120, 140, 160, 0.8), 0 0 30px rgba(100, 120, 140, 0.6);
        }

        .particle::after {
          content: '';
          position: absolute;
          top: 15%;
          left: 15%;
          width: 70%;
          height: 70%;
          background: rgba(160, 180, 200, 1);
          border-radius: 50%;
          box-shadow: 0 0 12px rgba(160, 180, 200, 0.8);
        }

        .particle-small {
          width: 6px;
          height: 6px;
        }

        .particle-medium {
          width: 10px;
          height: 10px;
        }

        .particle-large {
          width: 14px;
          height: 14px;
        }

        .particle-1 {
          top: 20%;
          left: 15%;
          animation: floatParticle1 15s ease-in-out infinite;
        }

        .particle-2 {
          top: 60%;
          left: 70%;
          animation: floatParticle2 18s ease-in-out infinite;
        }

        .particle-3 {
          top: 35%;
          left: 25%;
          animation: floatParticle3 12s ease-in-out infinite;
        }

        .particle-4 {
          top: 75%;
          left: 45%;
          animation: floatParticle4 20s ease-in-out infinite;
        }

        .particle-5 {
          top: 45%;
          left: 80%;
          animation: floatParticle5 14s ease-in-out infinite;
        }

        .particle-6 {
          top: 65%;
          left: 30%;
          animation: floatParticle6 16s ease-in-out infinite;
        }

        .particle-7 {
          top: 25%;
          left: 60%;
          animation: floatParticle7 22s ease-in-out infinite;
        }

        .particle-8 {
          top: 85%;
          left: 20%;
          animation: floatParticle8 13s ease-in-out infinite;
        }

        .particle-9 {
          top: 50%;
          left: 50%;
          animation: floatParticle9 17s ease-in-out infinite;
        }

        .particle-10 {
          top: 15%;
          left: 85%;
          animation: floatParticle10 19s ease-in-out infinite;
        }

        .particle-11 {
          top: 40%;
          left: 10%;
          animation: floatParticle1 16s ease-in-out infinite 2s;
        }

        .particle-12 {
          top: 70%;
          left: 60%;
          animation: floatParticle2 14s ease-in-out infinite 1s;
        }

        .particle-13 {
          top: 30%;
          left: 75%;
          animation: floatParticle3 20s ease-in-out infinite 3s;
        }

        .particle-14 {
          top: 80%;
          left: 35%;
          animation: floatParticle4 18s ease-in-out infinite 1.5s;
        }

        .particle-15 {
          top: 55%;
          left: 90%;
          animation: floatParticle5 22s ease-in-out infinite 2.5s;
        }

        @keyframes floatParticle1 {
          0%, 80% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.8);
          }
          85% { 
            opacity: 0.8;
            transform: translateY(-20px) translateX(10px) scale(1);
          }
          92% { 
            opacity: 1;
            transform: translateY(-40px) translateX(20px) scale(1.1);
          }
          98% { 
            opacity: 0.6;
            transform: translateY(-60px) translateX(30px) scale(0.9);
          }
          100% { 
            opacity: 0;
            transform: translateY(-80px) translateX(40px) scale(0.7);
          }
        }

        @keyframes floatParticle2 {
          0%, 75% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.9);
          }
          80% { 
            opacity: 0.7;
            transform: translateY(-15px) translateX(-10px) scale(1);
          }
          88% { 
            opacity: 0.9;
            transform: translateY(-35px) translateX(-25px) scale(1.2);
          }
          95% { 
            opacity: 0.5;
            transform: translateY(-55px) translateX(-40px) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-75px) translateX(-55px) scale(0.8);
          }
        }

        @keyframes floatParticle3 {
          0%, 70% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(1);
          }
          75% { 
            opacity: 0.6;
            transform: translateY(-10px) translateX(5px) scale(1.1);
          }
          85% { 
            opacity: 0.8;
            transform: translateY(-25px) translateX(15px) scale(1.3);
          }
          93% { 
            opacity: 0.4;
            transform: translateY(-45px) translateX(25px) scale(1.1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-65px) translateX(35px) scale(0.9);
          }
        }

        @keyframes floatParticle4 {
          0%, 65% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.7);
          }
          70% { 
            opacity: 0.9;
            transform: translateY(-18px) translateX(-8px) scale(1);
          }
          80% { 
            opacity: 1;
            transform: translateY(-38px) translateX(-18px) scale(1.2);
          }
          90% { 
            opacity: 0.7;
            transform: translateY(-58px) translateX(-28px) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-78px) translateX(-38px) scale(0.8);
          }
        }

        @keyframes floatParticle5 {
          0%, 85% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.8);
          }
          88% { 
            opacity: 0.5;
            transform: translateY(-12px) translateX(-15px) scale(1);
          }
          94% { 
            opacity: 0.7;
            transform: translateY(-28px) translateX(-30px) scale(1.1);
          }
          98% { 
            opacity: 0.3;
            transform: translateY(-48px) translateX(-45px) scale(0.9);
          }
          100% { 
            opacity: 0;
            transform: translateY(-68px) translateX(-60px) scale(0.7);
          }
        }

        @keyframes floatParticle6 {
          0%, 60% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(1);
          }
          65% { 
            opacity: 0.8;
            transform: translateY(-22px) translateX(12px) scale(1.1);
          }
          75% { 
            opacity: 1;
            transform: translateY(-42px) translateX(24px) scale(1.3);
          }
          87% { 
            opacity: 0.6;
            transform: translateY(-62px) translateX(36px) scale(1.1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-82px) translateX(48px) scale(0.9);
          }
        }

        @keyframes floatParticle7 {
          0%, 55% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.9);
          }
          60% { 
            opacity: 0.6;
            transform: translateY(-16px) translateX(-6px) scale(1);
          }
          72% { 
            opacity: 0.8;
            transform: translateY(-36px) translateX(-16px) scale(1.2);
          }
          84% { 
            opacity: 0.4;
            transform: translateY(-56px) translateX(-26px) scale(1);
          }
          100% { 
            opacity: 0;
            transform: translateY(-76px) translateX(-36px) scale(0.8);
          }
        }

        @keyframes floatParticle8 {
          0%, 90% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.6);
          }
          93% { 
            opacity: 0.7;
            transform: translateY(-14px) translateX(18px) scale(1);
          }
          97% { 
            opacity: 0.9;
            transform: translateY(-30px) translateX(36px) scale(1.1);
          }
          99% { 
            opacity: 0.3;
            transform: translateY(-46px) translateX(54px) scale(0.9);
          }
          100% { 
            opacity: 0;
            transform: translateY(-62px) translateX(72px) scale(0.7);
          }
        }

        @keyframes floatParticle9 {
          0%, 50% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(1.1);
          }
          55% { 
            opacity: 0.9;
            transform: translateY(-25px) translateX(0px) scale(1.2);
          }
          67% { 
            opacity: 1;
            transform: translateY(-50px) translateX(0px) scale(1.4);
          }
          82% { 
            opacity: 0.7;
            transform: translateY(-75px) translateX(0px) scale(1.2);
          }
          100% { 
            opacity: 0;
            transform: translateY(-100px) translateX(0px) scale(1);
          }
        }

        @keyframes floatParticle10 {
          0%, 45% { 
            opacity: 0;
            transform: translateY(0) translateX(0) scale(0.8);
          }
          50% { 
            opacity: 0.5;
            transform: translateY(-20px) translateX(-20px) scale(1);
          }
          62% { 
            opacity: 0.7;
            transform: translateY(-45px) translateX(-40px) scale(1.1);
          }
          78% { 
            opacity: 0.3;
            transform: translateY(-70px) translateX(-60px) scale(0.9);
          }
          100% { 
            opacity: 0;
            transform: translateY(-95px) translateX(-80px) scale(0.7);
          }
        }

        .light-rays {
          position: fixed;
          top: 0;
          left: 0;
          width: 100%;
          height: 100%;
          pointer-events: none;
          z-index: 1;
          background: radial-gradient(ellipse at 70% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%);
          animation: lightRays 45s ease-in-out infinite;
        }

        @keyframes lightRays {
          0%, 100% { 
            opacity: 0.3;
            transform: rotate(0deg);
          }
          50% { 
            opacity: 0.1;
            transform: rotate(1deg);
          }
        }
      `}</style>
    </>
  );
}