import * as React from "react";
import { motion } from "framer-motion";

/**
 * AnimatedText — Applies a shiny moving gradient effect to text.
 * Enhanced to allow both a 'text' prop or standard React 'children'.
 */
const AnimatedText = React.forwardRef(
  (
    {
      text,
      children,
      gradientColors = "linear-gradient(90deg, #7C3AED, #00D4FF, #ffffff, #00D4FF, #7C3AED)",
      gradientAnimationDuration = 3,
      hoverEffect = true,
      className = "",
      textClassName = "",
      style = {},
      ...props
    },
    ref
  ) => {
    const [isHovered, setIsHovered] = React.useState(false);

    const textVariants = {
      initial: {
        backgroundPosition: "-200% 0",
      },
      animate: {
        backgroundPosition: "200% 0",
        transition: {
          duration: gradientAnimationDuration,
          repeat: Infinity,
          ease: "linear",
        },
      },
    };

    return (
      <div
        ref={ref}
        className={`flex ${className}`}
        style={{ minHeight: '1em', ...style }}
        {...props}
      >
        <motion.div
          className={textClassName}
          style={{
            background: gradientColors,
            backgroundSize: "200% auto",
            WebkitBackgroundClip: "text",
            WebkitTextFillColor: "transparent",
            // Boost brightness and clarity
            filter: isHovered ? "brightness(1.5) contrast(1.1)" : "brightness(1) contrast(1.05)",
            transition: "filter 0.4s cubic-bezier(0.23, 1, 0.32, 1)",
            display: "inline-block",
            position: "relative",
            zIndex: 1,
            // Ensure visibility during complex animations
            visibility: "visible",
            opacity: 1,
          }}
          variants={textVariants}
          initial="initial"
          animate="animate"
          onHoverStart={() => hoverEffect && setIsHovered(true)}
          onHoverEnd={() => hoverEffect && setIsHovered(false)}
        >
          {children || text}
        </motion.div>
      </div>
    );
  }
);

AnimatedText.displayName = "AnimatedText";

export { AnimatedText };
