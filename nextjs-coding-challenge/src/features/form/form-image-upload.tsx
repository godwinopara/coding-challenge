import Image from "next/image";
import { FaRegImage } from "react-icons/fa";

export default function FormImageUpload({ file }: { file: File | null }) {
  return (
    <div className="flex flex-col items-center justify-center py-4 px-6 border-2 border-dashed border-black rounded-xl bg-gradient-to-br from-card to-input transition-all duration-300">
      {file ? (
        <>
          <div className="relative mb-4">
            <Image
              src={URL.createObjectURL(file)}
              alt="Profile Preview"
              className="h-12 w-12 object-cover rounded-full border-4 border-accent/20 shadow-lg"
              width={50}
              height={50}
            />
            <div className="absolute inset-0 bg-black/20 rounded-full opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center">
              <svg
                className="w-6 h-6 text-white"
                fill="none"
                stroke="currentColor"
                viewBox="0 0 24 24"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth={2}
                  d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z"
                />
              </svg>
            </div>
          </div>
          <p className="text-black font-medium text-sm">Click to change photo</p>
        </>
      ) : (
        <>
          <div className="w-10 h-10 rounded-full flex items-center justify-center mb-3">
            <FaRegImage size={24} />
          </div>
          <p className="text-foreground text-sm font-medium mb-1">Upload Profile Picture</p>
          <p className="text-muted-foreground text-xs">PNG, JPG or JPEG (Max 5MB)</p>
        </>
      )}
    </div>
  );
}
