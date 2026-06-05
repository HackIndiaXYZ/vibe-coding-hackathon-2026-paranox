import React, { useState, useEffect } from "react";

interface CountUpProps {
  value: number | string;
  prefix?: string;
  suffix?: string;
  duration?: number;
}

export default function CountUp({ value, prefix = "", suffix = "", duration = 1000 }: CountUpProps) {
  const numericValue = typeof value === "string" ? parseFloat(value.replace(/[^0-9.-]/g, "")) : value;
  const [displayValue, setDisplayValue] = useState(0);

  useEffect(() => {
    let startTimestamp: number | null = null;
    const startValue = displayValue;
    
    const step = (timestamp: number) => {
      if (!startTimestamp) startTimestamp = timestamp;
      const progress = Math.min((timestamp - startTimestamp) / duration, 1);
      const current = progress * (numericValue - startValue) + startValue;
      
      setDisplayValue(current);
      
      if (progress < 1) {
        window.requestAnimationFrame(step);
      }
    };
    
    window.requestAnimationFrame(step);
  }, [numericValue, duration]);

  const formattedValue = numericValue % 1 === 0 
    ? Math.floor(displayValue).toLocaleString() 
    : displayValue.toFixed(1);

  return <span>{prefix}{formattedValue}{suffix}</span>;
}
