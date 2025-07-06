'use client';

import { useState, useEffect, useRef } from 'react';

/**
 * マウスカーソルの現在位置を追跡するカスタムフック。
 * windowオブジェクトからマウスイベントを購読し、カーソルのX座標とY座標を状態として管理します。
 * コンポーネントがアンマウントされる際には、イベントリスナーを自動的にクリーンアップします。
 *
 * @returns {{ x: number | null, y: number | null }} マウスカーソルのX座標とY座標を格納したオブジェクト。
 * 初期値は { x: null, y: null } で、マウスが動くと実際の座標で更新されます。
 */
export const useMousePosition = () => {
  // マウスの位置を格納するためのstate。初期値はnull。
  const [position, setPosition] = useState<{ x: number | null; y: number | null }>({ x: null, y: null });

  useEffect(() => {
    // マウスが動いた時のイベントハンドラ
    const handleMouseMove = (event: MouseEvent) => {
      // mousemoveイベントから座標を取得し、stateを更新
      setPosition({ x: event.clientX, y: event.clientY });
    };

    // windowにmousemoveイベントリスナーを追加
    window.addEventListener('mousemove', handleMouseMove);

    // コンポーネントのクリーンアップ時にイベントリスナーを削除
    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
    };
  }, []); // 空の依存配列を渡すことで、このeffectはマウント時に一度だけ実行される

  // 現在のマウス位置を返す
  return position;
};

/**
 * 滑らかなマウス位置追跡を行うカスタムフック。
 * Linear Interpolation (lerp) を使用して、マウスの動きを自然で心地よい動きに変換します。
 * 
 * @param smoothness - 滑らかさの調整値 (0.01 - 0.3, デフォルト: 0.1)
 * @returns {{ x: number, y: number }} 滑らかに補間されたマウス位置
 */
export const useSmoothMousePosition = (smoothness: number = 0.1) => {
  const [smoothPosition, setSmoothPosition] = useState<{ x: number; y: number }>({ x: 0, y: 0 });
  const targetPositionRef = useRef<{ x: number; y: number }>({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetPositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const updateSmoothPosition = () => {
      setSmoothPosition(prev => {
        const target = targetPositionRef.current;
        const newX = prev.x + (target.x - prev.x) * smoothness;
        const newY = prev.y + (target.y - prev.y) * smoothness;
        
        return { x: newX, y: newY };
      });
      
      animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [smoothness]);

  return smoothPosition;
};

/**
 * 滑らかなマウス位置追跡を行い、その値をRefオブジェクトとして返すカスタムフック。
 * これにより、マウス位置の更新がコンポーネントの再レンダリングを引き起こさなくなります。
 * アニメーションループなど、高頻度で更新されるがUIの再描画を必要としない値の管理に適しています。
 *
 * @param smoothness - 滑らかさの調整値 (0.01 - 0.3, デフォルト: 0.1)
 * @returns React.RefObject<{ x: number; y: number }> - 滑らかに補間されたマウス位置を保持するRefオブジェクト
 */
export const useSmoothMousePositionAsRef = (smoothness: number = 0.1) => {
  const positionRef = useRef({ x: 0, y: 0 });
  const targetPositionRef = useRef({ x: 0, y: 0 });
  const animationFrameRef = useRef<number>();

  useEffect(() => {
    const handleMouseMove = (event: MouseEvent) => {
      targetPositionRef.current = { x: event.clientX, y: event.clientY };
    };

    const updateSmoothPosition = () => {
      const current = positionRef.current;
      const target = targetPositionRef.current;
      
      const newX = current.x + (target.x - current.x) * smoothness;
      const newY = current.y + (target.y - current.y) * smoothness;
      
      positionRef.current = { x: newX, y: newY };
      
      animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);
    };

    window.addEventListener('mousemove', handleMouseMove);
    // 初期位置を画面中央に設定
    const initialX = typeof window !== 'undefined' ? window.innerWidth / 2 : 0;
    const initialY = typeof window !== 'undefined' ? window.innerHeight / 2 : 0;
    targetPositionRef.current = { x: initialX, y: initialY };
    positionRef.current = { x: initialX, y: initialY };

    animationFrameRef.current = requestAnimationFrame(updateSmoothPosition);

    return () => {
      window.removeEventListener('mousemove', handleMouseMove);
      if (animationFrameRef.current) {
        cancelAnimationFrame(animationFrameRef.current);
      }
    };
  }, [smoothness]);

  return positionRef;
};
