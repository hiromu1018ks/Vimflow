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
        console.log("=== AUTHORIZE START ===");
        if ( !credentials?.email || !credentials?.password ) {
          console.log("認証失敗：メールアドレスまたはパスワードが未入力")
          return null;
        }

        const email = credentials.email as string
        const password = credentials.password as string
        console.log("認証試行:", email);

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

          console.log("認証成功:", user.email);
          console.log("返却するユーザーオブジェクト:", user);
          console.log("=== AUTHORIZE END ===");

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
    strategy : "jwt",
    maxAge : 30 * 24 * 60 * 60
  },

  // コールバック関数の設定
  // 認証フローの各段階で実行される処理をカスタマイズ
  callbacks : {
    authorized({ auth, request : { nextUrl } }) {
      const isLoggedIn = !!auth?.user;
      const isOnAuthPage = nextUrl.pathname.startsWith('/auth/');

      // ログイン済みユーザーが認証ページにアクセスした場合はホームページにリダイレクト
      if ( isLoggedIn && isOnAuthPage ) {
        return Response.redirect(new URL('/', nextUrl));
      }

      // 未ログインユーザーがルートパス以外にアクセスした場合はログインページにリダイレクト
      if ( !isLoggedIn && !isOnAuthPage && nextUrl.pathname !== '/' ) {
        return Response.redirect(new URL('/auth/signin', nextUrl));
      }

      return true;
    },
    // JWT戦略でのセッション情報設定
    async session({ session, token }) {
      console.log("=== SESSION CALLBACK ===");
      console.log("Session:", session);
      console.log("Token:", token);
      
      // JWTトークンからセッションにユーザー情報を設定
      if (token && session.user) {
        session.user.id = token.sub!; // JWTのsubjectがユーザーID
        session.user.email = token.email!;
        session.user.name = token.name;
      }
      console.log("Updated session:", session);
      console.log("=======================");
      return session;
    },

    // JWTトークン生成時の処理
    async jwt({ token, user }) {
      console.log("=== JWT CALLBACK ===");
      console.log("Token:", token);
      console.log("User:", user);
      
      // 初回ログイン時（userが存在する場合）にトークンにユーザー情報を追加
      if (user) {
        token.sub = user.id;
        token.email = user.email;
        token.name = user.name;
      }
      console.log("Updated token:", token);
      console.log("===================");
      return token;
    },

    async signIn({ user, account }) {
      console.log("=== SIGNIN CALLBACK ===");
      console.log("User:", user);
      console.log("Account:", account);
      console.log("======================");
      return true;
    }
  },
  debug : process.env.NODE_ENV === 'development'
})