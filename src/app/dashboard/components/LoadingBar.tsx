"use client";

import * as React from "react";
import { Progress } from "@/components/ui/progress";

interface LoadingBarProps {
  progress: number;
}

const LoadingBar: React.FC<LoadingBarProps> = ({ progress }) => {
  return <Progress value={progress} />;
};

export default LoadingBar;
