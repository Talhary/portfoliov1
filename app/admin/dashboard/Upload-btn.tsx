"use client";
 
import { UploadButton } from "@/lib/utils/uploadthing";
 import Image from 'next/image'
const  Home = ({setImgUrl,imgUrl}:{setImgUrl?:any,imgUrl:string[] | undefined | null})=> {
  
  return (
    <div className="flex  flex-col items-center justify-between ">
      <div  className="flex flex-col items-center gap-y-2 ">
      {imgUrl && imgUrl?.length > 0 && imgUrl.map((el:string)=><div key={el}>
        <Image alt='Image' src={el} height = '400' width='400' className="rounded-md" />
        <button value={el} onClick={(e:any)=>{
          const index = imgUrl.indexOf(e.target.value)
          setImgUrl(imgUrl.filter((el:any)=> el != imgUrl[index]))
        }} className="bg-red-600 focus:outline-none hover:bg-red-700 transition-all active:scale-[1.03] text-white p-2 px-4 text-lg rounded-md "> Remove Image </button>
        </div>)
      } 
       </div>
      {  <UploadButton
        endpoint="imageUploader"
        onClientUploadComplete={(res:any) => {
          
          if(imgUrl)
          setImgUrl([...imgUrl,res[0].url || ''])
        }}
        onUploadError={(error: Error) => {
          // Do something with the error.
          alert(`ERROR! ${error.message}`);
        }}
      />}

    </div>
  );
}
export default Home;