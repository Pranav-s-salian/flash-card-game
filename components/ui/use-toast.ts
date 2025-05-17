// filepath: c:\Users\prana\Desktop\flash cards\components\ui\use-toast.ts
import * as React from "react";

export function useToast() {
  // Dummy implementation, replace with your actual logic
  const [toasts, setToasts] = React.useState<any[]>([]);
  return { toasts, setToasts };
}