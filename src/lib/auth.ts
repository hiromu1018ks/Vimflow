import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";

// Prismaクライアントのインスタンスを作成
// これによりデータベースとの接続が可能になる
const prisma = new PrismaClient();

// NextAuthの設定を行い、signOut関数とauth関数をエクスポート
// signOut: ユーザーのログアウト処理を行う関数
// auth: 現在の認証状態を取得する関数
export const { handlers, signIn, signOut, auth } = NextAuth({
  // データベースアダプターの設定
  // PrismaAdapterを使用してユーザー情報、セッション、アカウント情報をデータベースに保存
  adapter : PrismaAdapter(prisma),

  // 認証プロバイダーの設定配列
  providers : [
    // Google認証プロバイダーの設定
    Google({
      // Googleクライアント ID（環境変数から取得、必須項目）
      clientId : process.env.GOOGLE_CLIENT_ID!,
      // Googleクライアントシークレット（環境変数から取得、オプション項目）
      clientSecret : process.env.GOOGLE_CLIENT_SECRET,
    }),
    GitHub({
      clientId : process.env.AUTH_GITHUB_ID!,
      clientSecret : process.env.AUTH_GITHUB_SECRET
    })
  ],

  // カスタムページの設定
  pages : {
    // サインインページのパスを指定
    // デフォルトのNextAuthサインインページの代わりにカスタムページを使用
    signIn : "/auth/signin",
    signOut : "/auth/signout"
  },

  // コールバック関数の設定
  // 認証フローの各段階で実行される処理をカスタマイズ
  callbacks : {
    // セッションコールバック関数
    // セッション情報が取得される際に実行され、セッションデータを加工できる
    session : ({ session, user }) => ( {
      // 既存のセッション情報をスプレッド演算子で展開
      ...session,
      // ユーザー情報を拡張
      user : {
        // 既存のセッション内ユーザー情報を展開
        ...session.user,
        // データベースのユーザーIDをセッションに追加
        // これによりクライアント側でユーザーIDが利用可能になる
        id : user.id,
      }
    } )
  }
})