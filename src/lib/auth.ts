import NextAuth from "next-auth";
import { PrismaAdapter } from "@auth/prisma-adapter";
import { PrismaClient } from "@prisma/client";
import Google from "next-auth/providers/google";
import GitHub from "next-auth/providers/github";
import Credentials from "next-auth/providers/credentials";
import bcrypt from "bcryptjs"

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
      clientId : process.env.AUTH_GOOGLE_ID!,
      // Googleクライアントシークレット（環境変数から取得、オプション項目）
      clientSecret : process.env.AUTH_GOOGLE_SECRET,
    }),
    GitHub({
      clientId : process.env.AUTH_GITHUB_ID!,
      clientSecret : process.env.AUTH_GITHUB_SECRET
    }),
    Credentials({
      name : "credentials",
      credentials : {
        email : {
          label : "メールアドレス",
          type : "email",
          placeholder : "your@email.com"
        },
        password : {
          label : "パスワード",
          type : "password",
          placeholder : "パスワードを入力"
        }
      },
      async authorize(credentials) {
        if ( !credentials?.email || !credentials?.password ) {
          console.log("認証失敗：メールアドレスまたはパスワードが未入力")
          return null;
        }

        const email = credentials.email as string
        const password = credentials.password as string

        try {
          const user = await prisma.user.findUnique({
            where : {
              email : email
            }
          });

          if ( !user || !user.password ) {
            console.log("認証失敗: ユーザーが見つからないか、パスワードが設定されていません");
            return null;
          }

          const isPasswordValid = await bcrypt.compare(
            password,
            user.password!
          );

          if ( !isPasswordValid ) {
            console.log("認証失敗: パスワードが正しくありません");
            return null;
          }

          console.log("認証成功:", user.email)

          return user;
        } catch ( error ) {
          console.error("認証処理中にエラー:", error);
          return null;
        }
      }
    })
  ],

  // カスタムページの設定
  pages : {
    // サインインページのパスを指定
    // デフォルトのNextAuthサインインページの代わりにカスタムページを使用
    signIn : "/auth/signin",
    signOut : "/auth/signout"
  },

  session : {
    strategy : "database",
    maxAge : 30 * 24 * 60 * 60
  },

  // コールバック関数の設定
  // 認証フローの各段階で実行される処理をカスタマイズ
  callbacks : {
    authorized({ auth, request : { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnProtectedRoute = nextUrl.pathname.startsWith('/'); // 保護対象のパス
      const isOnAuthPage = nextUrl.pathname.startsWith('/auth/');

      // 保護されたルートへのアクセス
      if ( isOnProtectedRoute && !isOnAuthPage ) {
        if ( !isLoggedIn ) return false;
      }

      // ログイン済みユーザーが認証ページにアクセスした場合
      if ( isLoggedIn && isOnAuthPage ) {
        return Response.redirect(new URL('/', nextUrl));
      }

      return true;
    },
    // 🆕 database戦略でのセッション情報設定
    async session({ session, user }) {
      // database戦略では userオブジェクトにはデータベースから取得されたユーザー情報が含まれる
      if ( user && session.user ) {
        session.user.id = user.id;
        // 必要に応じて追加のユーザー情報を設定
      }
      return session;
    },

    async signIn({}) {
      return true;
    }
  },
  debug : process.env.NODE_ENV === 'development'
})