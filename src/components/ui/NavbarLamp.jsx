import React from "react";
import { motion } from "framer-motion";

export const NavbarLamp = ({ className }) => {
  return (
    <div className={`absolute top-[100%] left-0 right-0 w-full flex justify-center z-[-1] overflow-visible pointer-events-none ${className || ''}`}>
      <div className="relative flex w-full flex-1 scale-y-100 items-start justify-center isolate z-0 h-[200px]">
        {/* Right Cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: "conic-gradient(from 70deg at center top, #06b6d4, transparent, transparent)",
          }}
          className="absolute inset-auto right-1/2 top-0 h-[200px] overflow-visible w-[30rem]"
        >
        </motion.div>
        
        {/* Left Cone */}
        <motion.div
          initial={{ opacity: 0.5, width: "15rem" }}
          whileInView={{ opacity: 1, width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          style={{
            backgroundImage: "conic-gradient(from 290deg at center top, transparent, transparent, #06b6d4)",
          }}
          className="absolute inset-auto left-1/2 top-0 h-[200px] w-[30rem]"
        >
        </motion.div>
        
        {/* Central glows */}
        <div className="absolute top-0 h-48 w-full scale-x-150 bg-[#070B14] blur-2xl"></div>
        
        {/* Main Cyan Glows */}
        <div className="absolute top-[-10px] z-50 h-36 w-[28rem] rounded-full bg-cyan-500 opacity-50 blur-3xl"></div>
        
        <motion.div
          initial={{ width: "8rem" }}
          whileInView={{ width: "16rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 z-30 h-10 w-64 rounded-full bg-cyan-400 blur-2xl"
        ></motion.div>
        
        {/* The horizontal glowing line */}
        <motion.div
          initial={{ width: "15rem" }}
          whileInView={{ width: "30rem" }}
          transition={{ delay: 0.3, duration: 0.8, ease: "easeInOut" }}
          className="absolute top-0 z-50 h-[1px] w-[30rem] bg-cyan-400"
        ></motion.div>
      </div>
    </div>
  );
};
