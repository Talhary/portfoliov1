'use client'

import { ClipLoader } from "react-spinners"
import { motion } from "framer-motion"
export const Spinner = ()=>{
 
 return  <motion.div
 initial={
    {
        opacity:0,
        scale:0,
        y:-100
    }
 }
 animate={{
    opacity:1,
    scale:1,
    y:0,
 }}
>
    <ClipLoader

className="border transition-all "
color="orange"
size={60}
 aria-label="Loading Spinner"
 data-testid="loader"
/>
 </motion.div>
}
