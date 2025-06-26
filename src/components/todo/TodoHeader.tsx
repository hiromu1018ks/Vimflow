import Image from "next/image";

export default function TodoHeader() {
  return (
    <div className="text-center mb-8">
      <div className="mb-6">
        <Image
          src="/Vimflow-logo.svg"
          alt="Vimflow - Elegant Task Management"
          width={120}
          height={120}
          className="mx-auto w-24 h-24 sm:w-32 sm:h-32 filter drop-shadow-lg"
          priority
        />
      </div>
      <div className="space-y-2">
        <h1 className="text-3xl sm:text-4xl font-bold text-gray-800 dark:text-gray-100">
          Vimflow
        </h1>
        <p className="text-gray-600 dark:text-gray-400 text-lg">
          Elegant task management with vim-style navigation
        </p>
      </div>
    </div>
  );
}
