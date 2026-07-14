"use client";

import { UploadDropzone } from "@/lib/utils/uploadthing";
import Image from 'next/image';
import { Trash2, UploadCloud } from 'lucide-react';

interface UploadProps {
  setImgUrl: (urls: string[]) => void;
  imgUrl: string[] | undefined | null;
}

const Home = ({ setImgUrl, imgUrl }: UploadProps) => {
  const currentImages = imgUrl || [];

  const handleRemove = (urlToRemove: string) => {
    setImgUrl(currentImages.filter((url) => url !== urlToRemove));
  };

  return (
    <div className="w-full flex flex-col gap-6">
      {/* Uploaded Screenshots Grid Grid */}
      {currentImages.length > 0 && (
        <div className="grid grid-cols-2 sm:grid-cols-3 gap-4 w-full">
          {currentImages.map((url, index) => (
            <div 
              key={url} 
              className="group relative aspect-video rounded-xl overflow-hidden border border-stone-250/30 dark:border-white/5 bg-black/40 shadow-lg transition-all duration-300 hover:scale-[1.02] hover:shadow-primary/5"
            >
              <Image 
                alt={`Screenshot ${index + 1}`} 
                src={url} 
                fill 
                sizes="(max-width: 768px) 50vw, 33vw"
                className="object-cover transition-transform duration-500 group-hover:scale-105" 
              />
              
              {/* Modern Hover Remove Overlay */}
              <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity duration-200 flex items-center justify-center backdrop-blur-[2px]">
                <button 
                  type="button"
                  onClick={() => handleRemove(url)} 
                  className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full shadow-xl transition-all transform hover:scale-110 active:scale-95 flex items-center justify-center"
                  title="Remove Image"
                >
                  <Trash2 className="h-5 w-5" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Drag & Drop Zone */}
      <div className="w-full">
        <UploadDropzone
          endpoint="imageUploader"
          onClientUploadComplete={(res: any) => {
            if (res && res.length > 0) {
              const uploadedUrls = res.map((file: any) => file.url).filter(Boolean);
              setImgUrl([...currentImages, ...uploadedUrls]);
            }
          }}
          onUploadError={(error: Error) => {
            alert(`Upload Error! ${error.message}`);
          }}
          className="border border-dashed border-stone-250 dark:border-zinc-800 bg-white/[0.02] dark:bg-black/15 ut-allowed-content:text-stone-500 dark:ut-allowed-content:text-zinc-500 ut-label:text-stone-700 dark:ut-label:text-zinc-300 ut-button:bg-primary ut-button:hover:bg-primary-hover ut-button:text-white ut-button:rounded-xl ut-button:font-semibold rounded-xl p-8 hover:bg-white/[0.04] dark:hover:bg-black/25 transition-all cursor-pointer"
        />
      </div>
    </div>
  );
};

export default Home;