import { useEffect, useState, FC } from "react";
import { CheckCircle, X, AlertCircle, Info } from "lucide-react";

export interface ToastMessage {
  id: string;
  type: "success" | "error" | "info";
  message: string;
  duration?: number;
}

interface ToastProps {
  message: ToastMessage;
  onRemove: (id: string) => void;
}

const Toast: FC<ToastProps> = ({ message, onRemove }) => {
  const [isVisible, setIsVisible] = useState(false);

  useEffect(() => {
    setIsVisible(true);

    const timer = setTimeout(() => {
      setIsVisible(false);
      setTimeout(() => onRemove(message.id), 300);
    }, message.duration || 4000);

    return () => clearTimeout(timer);
  }, [message.id, message.duration, onRemove]);

  const icons = {
    success: CheckCircle,
    error: AlertCircle,
    info: Info,
  };

  const colors = {
    success: "bg-green-500",
    error: "bg-red-500",
    info: "bg-blue-500",
  };

  const Icon = icons[message.type];

  return (
    <div
      className={`
        flex items-center gap-3 p-4 rounded-lg shadow-lg text-white transform transition-all duration-300 ease-in-out
        ${colors[message.type]}
        ${isVisible ? "translate-x-0 opacity-100" : "translate-x-full opacity-0"}
      `}
      role="alert"
      aria-live="polite"
    >
      <Icon size={20} className="flex-shrink-0" />
      <span className="flex-1 text-sm font-medium">{message.message}</span>
      <button
        onClick={() => {
          setIsVisible(false);
          setTimeout(() => onRemove(message.id), 300);
        }}
        className="flex-shrink-0 p-1 hover:bg-white/20 rounded transition-colors"
        aria-label="Close notification"
      >
        <X size={16} />
      </button>
    </div>
  );
};

export default Toast;
