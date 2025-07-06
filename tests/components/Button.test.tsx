import { describe, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { Button } from "@/components/ui/button";

describe("Button Component", () => {
  it("should render the button with the correct text", () => {
    // 1. コンポーネントを描写
    render(<Button>Click Me</Button>);

    // 2. 画面内にボタンが存在し、テキストが正しいかを確認
    const buttonElement = screen.getByRole("button", { name: /click me/i });
    expect(buttonElement).toBeInTheDocument();
  });

  it("should render with different variants", () => {
    // destructiveバリアント（赤いボタン）をテスト
    render(<Button variant="destructive">Delete</Button>);

    const deleteButton = screen.getByRole("button", { name: /delete/i });
    expect(deleteButton).toBeInTheDocument();
  });
});
