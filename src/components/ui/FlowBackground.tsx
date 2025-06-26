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
              animation: floatParticle1 15s ease-in-out infinite; /* floatParticle1というアニメーションを適用 */
          }

          .particle-2 {
              top: 60%;
              left: 70%;
              animation: floatParticle2 18s ease-in-out infinite;
          }

          /* 他のパーティクルのスタイル... */

          /* @keyframesでアニメーションの動きを定義します。 */
          /* floatParticle1は、パーティクルが透明から現れて移動し、また透明になる動きを定義しています。 */
          @keyframes floatParticle1 {
              0%, 80% {
                  opacity: 0;
                  transform: translateY(0) scale(0.8);
              }
              /* 最初と80%の時点では透明で少し小さい */
              85% {
                  opacity: 0.8;
                  transform: translateY(-20px) scale(1);
              }
              /* 85%で少し現れて上に移動し、元のサイズに */
              92% {
                  opacity: 1;
                  transform: translateY(-40px) scale(1.1);
              }
              /* 92%で完全に現れてさらに上に移動し、少し大きくなる */
              100% {
                  opacity: 0;
                  transform: translateY(-80px) scale(0.7);
              }
              /* 100%で透明になり、さらに上に移動し、小さくなる */
          }

          /* 他のキーフレーム... */

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

          /* 他の星の位置... */

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
              left: 20%;
              transform: rotate(-20deg); /* 少し回転させる */
              animation: shootingStar1 15s linear infinite; /* shootingStar1アニメーションを適用 */
          }

          /* 他の流れ星の位置... */

          @keyframes shootingStar1 {
              0%, 95% {
                  opacity: 0;
                  transform: translateX(0) translateY(0) rotate(-20deg);
              }
              /* 最初と95%の時点では透明で初期位置 */
              96% {
                  opacity: 1;
                  transform: translateX(0) translateY(0) rotate(-20deg);
              }
              /* 96%で突然現れる */
              98% {
                  opacity: 1;
                  transform: translateX(80px) translateY(30px) rotate(-20deg);
              }
              /* 98%で移動して光る */
              100% {
                  opacity: 0;
                  transform: translateX(0) translateY(0) rotate(-20deg);
              }
              /* 100%で透明になり、初期位置に戻る（次のアニメーションのために） */
          }

          /* 他の流れ星のアニメーション... */
      ` }</style>
    </>
  );
}