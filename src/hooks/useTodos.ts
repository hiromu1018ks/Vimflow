"use client"
// 型定義をインポート（別ファイルで定義されたタスクの型）
import { createTask, getAllTask } from "@/types/type";
// Reactのフック（状態管理・副作用処理）をインポート
import { useEffect, useState } from "react";

/**
 * useTodosフックの戻り値の型定義
 *
 * このインターフェースは、フックが返すオブジェクトの構造を定義します。
 * TypeScriptにより型安全性が保証され、開発時に自動補完も効きます。
 */
export interface UseTodosReturn {
  todos : getAllTask[]; // タスクの配列
  newTodo : createTask; // 新規作成中のタスク
  setNewTodo : (todo : createTask) => void; // 新規タスクの更新関数
  addTodo : () => Promise<void>; // タスク追加関数（非同期）
  deleteTodo : (id : string) => Promise<void>; // タスク削除関数（非同期）
  getAllTodos : () => Promise<void>; // タスク一覧取得関数（非同期）
  isLoading : boolean; // ローディング状態
  error : string | null; // エラーメッセージ（エラーがない場合はnull）
  clearError : () => void; // エラーをクリアする関数
  updateTask : (id : string, task : string) => Promise<void>; // タスク更新関数（非同期）
}

/**
 * タスクの基本操作（CRUD）を管理するカスタムフック
 *
 * このフックは以下の機能を提供します：
 * - タスクの一覧取得（Read）
 * - タスクの追加（Create）
 * - タスクの削除（Delete）
 * - ローディング状態の管理
 * - エラーハンドリング
 *
 * 使用例:
 * const { todos, addTodo, deleteTodo, isLoading, error } = useTodos();
 */
export const useTodos = () : UseTodosReturn => {
  // === 状態の定義 ===

  // タスクの配列を管理する状態（初期値は空配列）
  const [ todos, setTodos ] = useState<getAllTask[]>([]);

  // 新規作成中のタスクを管理する状態
  const [ newTodo, setNewTodo ] = useState<createTask>({
    task : "", // 初期値は空文字列
  });

  // ローディング状態を管理（APIリクエスト中はtrue）
  const [ isLoading, setIsLoading ] = useState<boolean>(false);

  // エラー状態を管理（エラーがない場合はnull）
  const [ error, setError ] = useState<string | null>(null);

  // === 副作用の定義（コンポーネントマウント時の処理） ===

  /**
   * useEffect: コンポーネントがマウントされた時（初回レンダリング時）に実行
   * 空の依存配列[]により、一度だけ実行される
   */
  useEffect(() => {
    getAllTodos(); // 初回マウント時にタスク一覧を取得
  }, []); // 依存配列が空なので、初回のみ実行

  // API のベースURL（環境によって変更可能）
  const URL = "/api";

  // === API関数の定義 ===

  /**
   * サーバーからタスク一覧を取得する関数
   *
   * 処理の流れ：
   * 1. ローディング状態をONにする
   * 2. エラー状態をクリアする
   * 3. サーバーにGETリクエストを送信
   * 4. レスポンスを受け取り、タスク配列に変換
   * 5. 状態を更新
   * 6. エラーが発生した場合はエラー状態を更新
   * 7. 最後にローディング状態をOFFにする
   */
  const getAllTodos = async () => {
    setIsLoading(true); // ローディング開始
    setError(null); // 既存のエラーをクリア

    try {
      // サーバーへのHTTPリクエスト（GET /api/tasks）
      const response = await fetch(`${ URL }/tasks`, {
        method : "GET", // 取得操作なのでGETメソッド
      });

      // レスポンスのステータスコードをチェック
      if ( !response.ok ) {
        throw new Error(`HTTP error! status: ${ response.status }`);
      }

      // JSONデータに変換
      const result = await response.json();

      // サーバーから返された配列を、フロントエンド用のデータ形式に変換
      const tasks = result.data.map((task : getAllTask) => ( {
        ...task, // 既存のプロパティをそのままコピー
        // 文字列で返される日時をDateオブジェクトに変換
        createdAt : task.createdAt ? new Date(task.createdAt) : undefined,
      } ));

      // 状態を更新（これによりUIが再レンダリングされる）
      setTodos(tasks);
    } catch ( error ) {
      // エラーハンドリング：エラーオブジェクトから適切なメッセージを抽出
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to fetch tasks:", error);
    } finally {
      // try/catch の結果に関わらず、最後に必ず実行される
      setIsLoading(false); // ローディング終了
    }
  };

  /**
   * 新しいタスクを追加する関数
   *
   * 処理の流れ：
   * 1. 入力値のバリデーション（空文字チェック）
   * 2. ローディング状態をONにする
   * 3. サーバーにPOSTリクエストを送信
   * 4. 成功したら入力フィールドをクリア
   * 5. タスク一覧を再取得して最新状態に更新
   *
   * @returns Promise<void> 非同期処理のため、Promiseを返す
   */
  const addTodo = async () => {
    // バリデーション：空文字や空白のみの場合は処理しない
    if ( !newTodo.task.trim() ) return;

    setIsLoading(true); // ローディング開始
    setError(null); // 既存のエラーをクリア

    try {
      // サーバーへのHTTPリクエスト（POST /api/tasks）
      const response = await fetch(`${ URL }/tasks`, {
        method : "POST", // 新規作成操作なのでPOSTメソッド
        headers : {
          "Content-Type" : "application/json", // JSONデータを送信することを明示
        },
        body : JSON.stringify({
          task : newTodo.task.trim(), // 前後の空白を削除してからサーバーに送信
        }),
      });

      // レスポンスのステータスコードをチェック
      if ( !response.ok ) {
        throw new Error(`HTTP error! status: ${ response.status }`);
      }

      // 追加が成功したら、入力フィールドをクリア
      setNewTodo({
        task : "", // 空文字列で初期化
      });

      // タスクを追加後、最新のタスク一覧を再取得
      // これにより、サーバーで生成されたIDや作成日時も含めて表示される
      await getAllTodos();
    } catch ( error ) {
      // エラーハンドリング
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to add task:", error);
    } finally {
      // try/catch の結果に関わらず、最後に必ず実行される
      setIsLoading(false); // ローディング終了
    }
  };

  /**
   * 指定されたIDのタスクを削除する関数
   *
   * 処理の流れ：
   * 1. ローディング状態をONにする
   * 2. サーバーにDELETEリクエストを送信
   * 3. 成功したらタスク一覧を再取得
   *
   * @param id 削除するタスクのID
   * @returns Promise<void> 非同期処理のため、Promiseを返す
   */
  const deleteTodo = async (id : string) => {
    setIsLoading(true); // ローディング開始
    setError(null); // 既存のエラーをクリア

    try {
      // サーバーへのHTTPリクエスト（DELETE /api/tasks/{id}）
      const response = await fetch(`${ URL }/tasks/${ id }`, {
        method : "DELETE", // 削除操作なのでDELETEメソッド
      });

      // レスポンスのステータスコードをチェック
      if ( !response.ok ) {
        throw new Error(`HTTP error! status: ${ response.status }`);
      }

      // 削除が成功したら、最新のタスク一覧を再取得
      // これにより、削除されたタスクがUIからも消える
      await getAllTodos();
    } catch ( err ) {
      // エラーハンドリング
      const errorMessage = err instanceof Error ? err.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to delete task:", err);
    } finally {
      // try/catch の結果に関わらず、最後に必ず実行される
      setIsLoading(false); // ローディング終了
    }
  };

  /**
   * エラー状態をクリアする関数
   *
   * ユーザーがエラーメッセージを確認した後、
   * 手動でエラー状態をリセットするために使用します。
   */
  const clearError = () => {
    setError(null); // エラー状態をnullにリセット
  };

  const updateTask = async (id : string, task : string) => {
    if ( !task.trim() ) return;

    setIsLoading(true);
    setError(null);

    try {
      const response = await fetch(`${ URL }/tasks/${ id }`, {
        method : "PUT",
        headers : {
          "Content-Type" : "application/json",
        },
        body : JSON.stringify({ task : task.trim() }),
      });

      if ( !response.ok ) {
        throw new Error(`HTTP error! status: ${ response.status }`);
      }

      await getAllTodos();
    } catch ( error ) {
      const errorMessage =
        error instanceof Error ? error.message : "Unknown error";
      setError(errorMessage);
      console.error("Failed to update task:", error);
    } finally {
      setIsLoading(false);
    }
  };

  /*
   * 注意: saveTask（タスク更新）関数は現在コメントアウトされています
   *
   * 理由: この関数は編集機能（editingTask、setEditingId等）に依存するため、
   * useTaskEditフックに移動するか、別途useTaskUpdateフックとして
   * 実装する予定です。
   *
   * 現在はpage.tsx内で一時的に実装されています。
   */

  // === フックの戻り値（外部に公開する状態と関数） ===

  /**
   * このフックが提供する全ての状態と関数を含むオブジェクトを返します。
   *
   * 分割代入で使用例:
   * const { todos, addTodo, isLoading } = useTodos();
   */
  return {
    todos, // タスクの配列
    newTodo, // 新規作成中のタスク
    setNewTodo, // 新規タスクの更新関数
    addTodo, // タスク追加関数
    deleteTodo, // タスク削除関数
    getAllTodos, // タスク一覧取得関数
    isLoading, // ローディング状態
    error, // エラーメッセージ
    clearError, // エラークリア関数
    updateTask, // タスク更新関数
  };
};
