"use client";

import { useTheme } from "@/contexts/ThemeContext";

/**
 * FlowBackgroundコンポーネントのプロパティを定義するインターフェース
 */
interface FlowBackgroundProps {
  /**
   * 背景アニメーションを有効にするかどうか。
   * @default true
   */
  enabled? : boolean;
  /**
   * アニメーションの強度（パーティクルの数など）を指定する。
   * 'light': 弱い
   * 'normal': 通常
   * 'strong': 強い
   * @default "normal"
   */
  intensity? : "light" | "normal" | "strong";
  /**
   * コンポーネントのルート要素に適用する追加のCSSクラス名。
   * @default ""
   */
  className? : string;
}

/**
 * アプリケーションの背景に動的なフローアニメーションを描画するコンポーネント。
 * 現在のテーマ（ライト/ダーク）に応じて異なるスタイルとアニメーションを適用します。
 * @param {FlowBackgroundProps} props - コンポーネントのプロパティ。
 */
export default function FlowBackground({
                                         // 背景アニメーションが有効かどうかのフラグ。デフォルトはtrue。
                                         enabled = true,
                                         // アニメーションの強度。デフォルトは"normal"。
                                         intensity = "normal",
                                         // 追加のCSSクラス。デフォルトは空文字列。
                                         className = ""
                                       } : FlowBackgroundProps) {
  // useThemeフックから現在のテーマがダークモードかどうかを取得する。
  const { isDark } = useTheme();

  // enabledがfalseの場合、何もレンダリングせずに処理を終了する。
  if ( !enabled ) return null;

  // 現在のテーマに応じて背景のグラデーションスタイルを決定する。
  const backgroundStyle = isDark
    // ダークモードの場合のグラデーション
    ? 'linear-gradient(135deg, #0c0c0c 0%, #1a1a2e 50%, #16213e 100%)'
    // ライトモードの場合のグラデーション
    : 'linear-gradient(135deg, #f8f9fa 0%, #e9ecef 30%, #f1f3f4 70%, #ffffff 100%)';

  // 背景要素と、テーマに応じたアニメーションコンポーネントをレンダリングする。
  return (
    <>
      <div
        // 画面全体に固定表示し、クリックイベントを透過させ、最背面に配置するクラス。
        className={ `fixed inset-0 pointer-events-none z-0 overflow-hidden ${ className }` }
        // 動的に決定した背景スタイルを適用する。
        style={ { background : backgroundStyle } }
        // スクリーンリーダーなどの支援技術からこの要素を隠す。
        aria-hidden="true"
      >
        {/* テーマがダークモードかどうかに応じて、表示するアニメーションコンポーネントを切り替える */ }
        { isDark ? (
          // ダークモード用のアニメーションコンポーネント
          <DarkModeAnimation intensity={ intensity }/>
        ) : (
          // ライトモード用のアニメーションコンポーネント
          <LightModeAnimation intensity={ intensity }/>
        ) }
      </div>
    </>
  );
}

/**
 * ライトモード時の背景アニメーションを描画するコンポーネント。
 * @param {{ intensity: string }} props - intensityプロパティを含むオブジェクト。
 */
function LightModeAnimation({ intensity } : { intensity : string }) {
  /**
   * アニメーションの強度に基づいて、表示するパーティクル（アニメーションの要素）の配列を生成する関数。
   * @returns {number[]} パーティクルを表す数値の配列。
   */
  const getParticles = () => {
    // 基本となるパーティクルの配列（1から10までの10個）
    const baseParticle = Array.from({ length : 10 }, (_, i) => i + 1);

    // intensityの値に応じてパーティクルの数を調整する。
    switch ( intensity ) {
      // 強度が 'light' の場合、パーティクルの数を少なくする（6個）。
      case "light":
        return baseParticle.slice(0, 6);
      // 強度が 'strong' の場合、パーティクルの数を多くする（15個）。
      case "strong":
        return [ ...baseParticle, ...Array.from({ length : 5 }, (_, i) => i + 11) ];
      // デフォルト（強度が 'normal' の場合）は、基本のパーティクル数（10個）を返す。
      default:
        return baseParticle;
    }
  };

  // getParticles関数を呼び出して、現在の強度に応じたパーティクルの配列を取得する。
  const particles = getParticles();
  return (
    <>
      <div className="light-rays"/>
      {/* 光線のアニメーション */ }
      <div className="particles-background">
        {/* パーティクルをマップして表示 */ }
        { particles.map((particleNum) => (
          <div
            key={ particleNum }
            className={ `particle particle-${ particleNum % 3 === 0 ? 'small' : particleNum % 3 === 1 ? 'medium' : 'large' } particle-${ particleNum }` }
          />
        )) }
      </div>
      {/* <style jsx>タグ内に、このコンポーネント専用のCSSスタイルを記述します。 */ }
      {/* ここに書かれたCSSは、他のコンポーネントに影響を与えません。 */ }
      <style jsx>{ `
          /* ライトモード用のスタイル */
          .particles-background {
              position: fixed; /* 画面に固定 */
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none; /* マウスイベントを透過させる */
              z-index: 0; /* 他の要素の下に表示 */
          }

          .particle {
              position: absolute;
              border-radius: 50%; /* 円形にする */
              opacity: 0; /* 最初は透明 */
              filter: blur(0.5px); /* 少しぼかす */
          }

          .particle::before {
              content: '';
              position: absolute;
              width: 100%;
              height: 100%;
              background: radial-gradient(circle, rgba(120, 140, 160, 1), rgba(100, 120, 140, 0.8), rgba(140, 160, 180, 0.5), transparent); /* グラデーションで光るような見た目 */
              border-radius: 50%;
              box-shadow: 0 0 20px rgba(120, 140, 160, 0.8), 0 0 30px rgba(100, 120, 140, 0.6); /* 影で光を表現 */
          }

          /* パーティクルのサイズ */
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

          /* 各パーティクルの初期位置とアニメーションの指定 */
          .particle-1 {
              top: 20%;
              left: 15%;
              animation: floatParticle1 8s linear infinite;
              animation-delay: 0s;
          }

          .particle-2 {
              top: 60%;
              left: 70%;
              animation: floatParticle2 10s linear infinite;
              animation-delay: 1s;
          }

          .particle-3 {
              top: 30%;
              left: 40%;
              animation: floatParticle3 6s linear infinite;
              animation-delay: 2s;
          }

          .particle-4 {
              top: 80%;
              left: 25%;
              animation: floatParticle4 9s linear infinite;
              animation-delay: 0.5s;
          }

          .particle-5 {
              top: 10%;
              left: 60%;
              animation: floatParticle5 7s linear infinite;
              animation-delay: 3s;
          }

          .particle-6 {
              top: 70%;
              left: 85%;
              animation: floatParticle6 11s linear infinite;
              animation-delay: 1.5s;
          }

          .particle-7 {
              top: 45%;
              left: 10%;
              animation: floatParticle7 8.5s linear infinite;
              animation-delay: 2.5s;
          }

          .particle-8 {
              top: 25%;
              left: 80%;
              animation: floatParticle8 6.5s linear infinite;
              animation-delay: 4s;
          }

          .particle-9 {
              top: 55%;
              left: 50%;
              animation: floatParticle9 9.5s linear infinite;
              animation-delay: 0.8s;
          }

          .particle-10 {
              top: 15%;
              left: 30%;
              animation: floatParticle10 7.5s linear infinite;
              animation-delay: 3.5s;
          }

          .particle-11 {
              top: 35%;
              left: 75%;
              animation: floatParticle11 10.5s linear infinite;
              animation-delay: 1.2s;
          }

          .particle-12 {
              top: 65%;
              left: 20%;
              animation: floatParticle12 5.5s linear infinite;
              animation-delay: 4.5s;
          }

          .particle-13 {
              top: 5%;
              left: 90%;
              animation: floatParticle13 8s linear infinite;
              animation-delay: 2.8s;
          }

          .particle-14 {
              top: 85%;
              left: 65%;
              animation: floatParticle14 9s linear infinite;
              animation-delay: 1.8s;
          }

          .particle-15 {
              top: 40%;
              left: 5%;
              animation: floatParticle15 7s linear infinite;
              animation-delay: 3.8s;
          }

          /* @keyframesでアニメーションの動きを定義します。 */
          @keyframes floatParticle1 {
              0% { opacity: 0; transform: translateY(0) scale(0.5); }
              25% { opacity: 0.3; transform: translateY(-15px) scale(0.8); }
              50% { opacity: 0.8; transform: translateY(-30px) scale(1); }
              75% { opacity: 1; transform: translateY(-45px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-60px) scale(0.7); }
          }

          @keyframes floatParticle2 {
              0% { opacity: 0; transform: translateX(0) translateY(0) scale(0.5); }
              25% { opacity: 0.4; transform: translateX(-8px) translateY(-12px) scale(0.8); }
              50% { opacity: 0.7; transform: translateX(-15px) translateY(-25px) scale(1); }
              75% { opacity: 1; transform: translateX(-23px) translateY(-38px) scale(1.2); }
              100% { opacity: 0; transform: translateX(-30px) translateY(-50px) scale(0.6); }
          }

          @keyframes floatParticle3 {
              0% { opacity: 0; transform: translateX(0) translateY(0) scale(0.5); }
              25% { opacity: 0.3; transform: translateX(10px) translateY(-8px) scale(0.7); }
              50% { opacity: 0.6; transform: translateX(20px) translateY(-15px) scale(1); }
              75% { opacity: 1; transform: translateX(30px) translateY(-23px) scale(1.1); }
              100% { opacity: 0; transform: translateX(40px) translateY(-30px) scale(0.8); }
          }

          @keyframes floatParticle4 {
              0%, 70% { opacity: 0; transform: translateY(0) scale(0.8); }
              78% { opacity: 0.9; transform: translateY(-30px) scale(1); }
              88% { opacity: 1; transform: translateY(-60px) scale(1.3); }
              100% { opacity: 0; transform: translateY(-120px) scale(0.5); }
          }

          @keyframes floatParticle5 {
              0%, 82% { opacity: 0; transform: translateX(0) translateY(0) scale(0.9); }
              86% { opacity: 0.8; transform: translateX(-10px) translateY(-20px) scale(1); }
              94% { opacity: 1; transform: translateX(-20px) translateY(-40px) scale(1.1); }
              100% { opacity: 0; transform: translateX(-40px) translateY(-90px) scale(0.7); }
          }

          @keyframes floatParticle6 {
              0%, 77% { opacity: 0; transform: translateX(0) translateY(0) scale(0.8); }
              82% { opacity: 0.7; transform: translateX(15px) translateY(-25px) scale(1); }
              91% { opacity: 1; transform: translateX(30px) translateY(-50px) scale(1.2); }
              100% { opacity: 0; transform: translateX(60px) translateY(-110px) scale(0.6); }
          }

          @keyframes floatParticle7 {
              0%, 83% { opacity: 0; transform: translateY(0) scale(0.9); }
              87% { opacity: 0.8; transform: translateY(-18px) scale(1); }
              95% { opacity: 1; transform: translateY(-35px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-75px) scale(0.8); }
          }

          @keyframes floatParticle8 {
              0%, 79% { opacity: 0; transform: translateX(0) translateY(0) scale(0.7); }
              84% { opacity: 0.9; transform: translateX(-25px) translateY(-20px) scale(1); }
              92% { opacity: 1; transform: translateX(-50px) translateY(-40px) scale(1.3); }
              100% { opacity: 0; transform: translateX(-100px) translateY(-85px) scale(0.5); }
          }

          @keyframes floatParticle9 {
              0%, 81% { opacity: 0; transform: translateY(0) scale(0.8); }
              85% { opacity: 0.8; transform: translateY(-22px) scale(1); }
              93% { opacity: 1; transform: translateY(-45px) scale(1.2); }
              100% { opacity: 0; transform: translateY(-95px) scale(0.7); }
          }

          @keyframes floatParticle10 {
              0%, 84% { opacity: 0; transform: translateX(0) translateY(0) scale(0.9); }
              88% { opacity: 0.7; transform: translateX(18px) translateY(-16px) scale(1); }
              96% { opacity: 1; transform: translateX(35px) translateY(-32px) scale(1.1); }
              100% { opacity: 0; transform: translateX(70px) translateY(-80px) scale(0.8); }
          }

          @keyframes floatParticle11 {
              0%, 76% { opacity: 0; transform: translateX(0) translateY(0) scale(0.8); }
              81% { opacity: 0.9; transform: translateX(-12px) translateY(-28px) scale(1); }
              89% { opacity: 1; transform: translateX(-24px) translateY(-55px) scale(1.3); }
              100% { opacity: 0; transform: translateX(-50px) translateY(-115px) scale(0.6); }
          }

          @keyframes floatParticle12 {
              0%, 86% { opacity: 0; transform: translateY(0) scale(0.7); }
              90% { opacity: 0.8; transform: translateY(-24px) scale(1); }
              97% { opacity: 1; transform: translateY(-48px) scale(1.2); }
              100% { opacity: 0; transform: translateY(-100px) scale(0.8); }
          }

          @keyframes floatParticle13 {
              0%, 78% { opacity: 0; transform: translateX(0) translateY(0) scale(0.9); }
              83% { opacity: 0.7; transform: translateX(22px) translateY(-18px) scale(1); }
              91% { opacity: 1; transform: translateX(45px) translateY(-35px) scale(1.1); }
              100% { opacity: 0; transform: translateX(90px) translateY(-75px) scale(0.7); }
          }

          @keyframes floatParticle14 {
              0%, 87% { opacity: 0; transform: translateX(0) translateY(0) scale(0.8); }
              91% { opacity: 0.9; transform: translateX(-20px) translateY(-26px) scale(1); }
              98% { opacity: 1; transform: translateX(-40px) translateY(-52px) scale(1.2); }
              100% { opacity: 0; transform: translateX(-80px) translateY(-105px) scale(0.6); }
          }

          @keyframes floatParticle15 {
              0%, 80% { opacity: 0; transform: translateY(0) scale(0.8); }
              85% { opacity: 0.8; transform: translateY(-21px) scale(1); }
              93% { opacity: 1; transform: translateY(-42px) scale(1.1); }
              100% { opacity: 0; transform: translateY(-88px) scale(0.7); }
          }

          .light-rays {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 1;
              background: radial-gradient(ellipse at 70% 20%, rgba(255, 255, 255, 0.1) 0%, transparent 50%); /* 光線のグラデーション */
              animation: lightRays 45s ease-in-out infinite; /* lightRaysアニメーションを適用 */
          }

          @keyframes lightRays {
              0%, 100% {
                  opacity: 0.3;
              }
              /* 最初と最後は少し透明 */
              50% {
                  opacity: 0.1;
              }
              /* 中間ではさらに透明になる */
          }
      ` }</style>
    </>
  );
}

/**
 * ダークモード時に表示される背景アニメーション（流れ星と星）を生成するコンポーネントです。
 * @param {object} props - コンポーネントのプロパティ
 * @param {string} props.intensity - アニメーションの強度（"light", "strong", またはデフォルト）を指定します。これにより、表示される星や流れ星の数が変わります。
 */
function DarkModeAnimation({ intensity } : { intensity : string }) {
  /**
   * アニメーションの強度(`intensity`)に応じて、表示する星の数を決定し、その数に対応する配列を返します。
   * この配列は、後続の描画処理で各星をレンダリングするために使用されます。
   * @returns {number[]} 星のレンダリングに使用される数値の配列。配列の各要素はユニークなキーとして利用されます。
   */
  const getStars = () => {
    // 基本となる星の数（10個）を配列として生成します。内容は [1, 2, ..., 10] となります。
    // Array.from({ length: 10 }) で長さ10の配列を作成し、第二引数のマップ関数で各要素にインデックス+1の値を設定しています。
    const baseStars = Array.from({ length : 10 }, (_, i) => i + 1);

    // intensityプロパティの値に基づいて、返す星の配列を調整します。
    switch ( intensity ) {
      // 強度が "light" の場合、星の数を減らします（最初の6個のみ）。
      case "light":
        return baseStars.slice(0, 6);
      // 強度が "strong" の場合、基本の星に加えてさらに5個の星を追加します。
      case "strong":
        return [ ...baseStars, ...Array.from({ length : 5 }, (_, i) => i + 11) ];
      // "light", "strong" 以外が指定された場合（デフォルト）は、基本の数の星を返します。
      default:
        return baseStars;
    }
  };

  /**
   * アニメーションの強度(`intensity`)に応じて、表示する流れ星の数を決定し、その数に対応する配列を返します。
   * この配列は、後続の描画処理で各流れ星をレンダリングするために使用されます。
   * @returns {number[]} 流れ星のレンダリングに使用される数値の配列。配列の各要素はユニークなキーとして利用されます。
   */
  const getShootingStars = () => {
    // 基本となる流れ星の数（5個）を配列として生成します。内容は [1, 2, ..., 5] となります。
    const baseStars = Array.from({ length : 5 }, (_, i) => i + 1);

    // intensityプロパティの値に基づいて、返す流れ星の配列を調整します。
    switch ( intensity ) {
      // 強度が "light" の場合、流れ星の数を減らします（最初の3個のみ）。
      case "light":
        return baseStars.slice(0, 3);
      // 強度が "strong" の場合、基本の流れ星に加えてさらに2個の流れ星を追加します。
      case "strong":
        return [ ...baseStars, ...Array.from({ length : 2 }, (_, i) => i + 6) ];
      // "light", "strong" 以外が指定された場合（デフォルト）は、基本の数の流れ星を返します。
      default:
        return baseStars;
    }
  };

  // getStars関数を呼び出し、現在の強度に応じた星の配列を取得します。
  const stars = getStars();
  // getShootingStars関数を呼び出し、現在の強度に応じた流れ星の配列を取得します。
  const shootingStars = getShootingStars();
  return (
    <>
      {/* 背景の星 */ }
      <div className="stars-background">
        { stars.map((starNum) => (
          <div key={ starNum } className={ `star star-${ starNum }` }/>
        )) }
      </div>

      {/* 流れ星 */ }
      <div className="shooting-stars-background">
        { shootingStars.map((starNum) => (
          <div key={ starNum } className={ `shooting-star shooting-star-${ starNum }` }/>
        )) }
      </div>

      <style jsx>{ `
          /* ダークモード用のスタイル */
          .stars-background {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 0;
          }

          .star {
              position: absolute;
              width: 2px;
              height: 2px;
              background: #ffffff; /* 白い星 */
              border-radius: 50%;
              animation: twinkle 3s ease-in-out infinite; /* twinkleアニメーションを適用 */
          }

          /* 各星の初期位置とアニメーションの遅延 */
          .star-1 {
              top: 10%;
              left: 15%;
              animation-delay: 0s;
          }

          .star-2 {
              top: 20%;
              left: 80%;
              animation-delay: 0.5s;
          }

          .star-3 {
              top: 30%;
              left: 25%;
              animation-delay: 1s;
          }

          .star-4 {
              top: 45%;
              left: 70%;
              animation-delay: 1.5s;
          }

          .star-5 {
              top: 60%;
              left: 10%;
              animation-delay: 2s;
          }

          .star-6 {
              top: 75%;
              left: 85%;
              animation-delay: 2.5s;
          }

          .star-7 {
              top: 5%;
              left: 50%;
              animation-delay: 3s;
          }

          .star-8 {
              top: 85%;
              left: 40%;
              animation-delay: 0.8s;
          }

          .star-9 {
              top: 35%;
              left: 90%;
              animation-delay: 1.3s;
          }

          .star-10 {
              top: 65%;
              left: 60%;
              animation-delay: 2.8s;
          }

          .star-11 {
              top: 15%;
              left: 35%;
              animation-delay: 0.3s;
          }

          .star-12 {
              top: 80%;
              left: 75%;
              animation-delay: 1.8s;
          }

          .star-13 {
              top: 25%;
              left: 5%;
              animation-delay: 2.3s;
          }

          .star-14 {
              top: 55%;
              left: 95%;
              animation-delay: 1.1s;
          }

          .star-15 {
              top: 40%;
              left: 20%;
              animation-delay: 2.6s;
          }

          @keyframes twinkle {
              0%, 100% {
                  opacity: 0.3;
                  transform: scale(1);
              }
              /* 最初と最後は少し透明で元のサイズ */
              50% {
                  opacity: 1;
                  transform: scale(1.5);
              }
              /* 中間では完全に現れて少し大きくなる（キラキラ表現） */
          }

          .shooting-stars-background {
              position: fixed;
              top: 0;
              left: 0;
              width: 100%;
              height: 100%;
              pointer-events: none;
              z-index: 1;
          }

          .shooting-star {
              position: absolute;
              width: 3px;
              height: 3px;
              background: radial-gradient(circle, rgba(255, 255, 255, 1), rgba(200, 220, 255, 0.8), transparent); /* 流れ星のグラデーション */
              border-radius: 50%;
              box-shadow: 0 0 6px rgba(255, 255, 255, 0.9); /* 流れ星の光 */
              opacity: 0; /* 最初は透明 */
          }

          /* 各流れ星の初期位置と回転 */
          .shooting-star-1 {
              top: 15%;
              left: 10%;
              animation: shootingStar1 8s linear infinite;
              animation-delay: 0s;
          }

          .shooting-star-2 {
              top: 30%;
              left: 90%;
              animation: shootingStar2 12s linear infinite;
              animation-delay: 3s;
          }

          .shooting-star-3 {
              top: 60%;
              left: 5%;
              animation: shootingStar3 10s linear infinite;
              animation-delay: 6s;
          }

          .shooting-star-4 {
              top: 80%;
              left: 85%;
              animation: shootingStar4 9s linear infinite;
              animation-delay: 2s;
          }

          .shooting-star-5 {
              top: 5%;
              left: 60%;
              animation: shootingStar5 11s linear infinite;
              animation-delay: 7s;
          }

          .shooting-star-6 {
              top: 45%;
              left: 95%;
              animation: shootingStar6 13s linear infinite;
              animation-delay: 4s;
          }

          .shooting-star-7 {
              top: 70%;
              left: 15%;
              animation: shootingStar7 8.5s linear infinite;
              animation-delay: 5s;
          }

          @keyframes shootingStar1 {
              0%, 90% { opacity: 0; transform: translateX(0) translateY(0) rotate(-45deg); }
              92% { opacity: 0.8; transform: translateX(20px) translateY(20px) rotate(-45deg); }
              95% { opacity: 1; transform: translateX(60px) translateY(60px) rotate(-45deg); }
              100% { opacity: 0; transform: translateX(120px) translateY(120px) rotate(-45deg); }
          }

          @keyframes shootingStar2 {
              0%, 85% { opacity: 0; transform: translateX(0) translateY(0) rotate(135deg); }
              88% { opacity: 0.9; transform: translateX(-25px) translateY(25px) rotate(135deg); }
              93% { opacity: 1; transform: translateX(-70px) translateY(70px) rotate(135deg); }
              100% { opacity: 0; transform: translateX(-130px) translateY(130px) rotate(135deg); }
          }

          @keyframes shootingStar3 {
              0%, 88% { opacity: 0; transform: translateX(0) translateY(0) rotate(-30deg); }
              91% { opacity: 0.7; transform: translateX(30px) translateY(15px) rotate(-30deg); }
              96% { opacity: 1; transform: translateX(80px) translateY(40px) rotate(-30deg); }
              100% { opacity: 0; transform: translateX(140px) translateY(70px) rotate(-30deg); }
          }

          @keyframes shootingStar4 {
              0%, 87% { opacity: 0; transform: translateX(0) translateY(0) rotate(120deg); }
              90% { opacity: 0.8; transform: translateX(-20px) translateY(-15px) rotate(120deg); }
              95% { opacity: 1; transform: translateX(-60px) translateY(-45px) rotate(120deg); }
              100% { opacity: 0; transform: translateX(-110px) translateY(-80px) rotate(120deg); }
          }

          @keyframes shootingStar5 {
              0%, 89% { opacity: 0; transform: translateX(0) translateY(0) rotate(-60deg); }
              92% { opacity: 0.9; transform: translateX(25px) translateY(35px) rotate(-60deg); }
              97% { opacity: 1; transform: translateX(65px) translateY(90px) rotate(-60deg); }
              100% { opacity: 0; transform: translateX(100px) translateY(140px) rotate(-60deg); }
          }

          @keyframes shootingStar6 {
              0%, 86% { opacity: 0; transform: translateX(0) translateY(0) rotate(150deg); }
              89% { opacity: 0.8; transform: translateX(-30px) translateY(20px) rotate(150deg); }
              94% { opacity: 1; transform: translateX(-75px) translateY(50px) rotate(150deg); }
              100% { opacity: 0; transform: translateX(-125px) translateY(85px) rotate(150deg); }
          }

          @keyframes shootingStar7 {
              0%, 91% { opacity: 0; transform: translateX(0) translateY(0) rotate(-15deg); }
              94% { opacity: 0.7; transform: translateX(35px) translateY(10px) rotate(-15deg); }
              98% { opacity: 1; transform: translateX(85px) translateY(25px) rotate(-15deg); }
              100% { opacity: 0; transform: translateX(135px) translateY(40px) rotate(-15deg); }
          }
      ` }</style>
    </>
  );
}