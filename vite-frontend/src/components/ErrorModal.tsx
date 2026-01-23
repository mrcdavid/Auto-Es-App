import type { FC } from "react";
import { AlertCircle } from "lucide-react";

interface ErrorModalProps {
  show: boolean;
  message?: string;
  onClose?: () => void;
}

const ErrorModal: FC<ErrorModalProps> = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-slideUp">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-10 h-10 text-red-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Oops!</h2>

          <p className="text-gray-600 mb-6">
            {message || "Something went wrong. Please try again."}
          </p>

          {onClose && (
            <button
              onClick={onClose}
              className="w-full py-3 rounded-lg bg-red-600 text-white font-semibold hover:bg-red-700 transition"
            >
              Okay
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default ErrorModal;
