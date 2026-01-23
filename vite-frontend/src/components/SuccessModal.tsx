import type { FC } from "react";
import { CheckCircle } from "lucide-react";

interface SuccessModalProps {
  show: boolean;
  message?: string;
  onClose?: () => void;
}

const SuccessModal: FC<SuccessModalProps> = ({ show, message, onClose }) => {
  if (!show) return null;

  return (
    <div className="fixed inset-0 bg-black/70 flex items-center justify-center p-4 z-50">
      <div className="bg-white rounded-2xl shadow-2xl p-8 max-w-sm w-full animate-slideUp">
        <div className="text-center">
          <div className="inline-flex items-center justify-center w-16 h-16 bg-green-100 rounded-full mb-4">
            <CheckCircle className="w-10 h-10 text-green-600" />
          </div>

          <h2 className="text-2xl font-bold text-gray-900 mb-2">Success!</h2>

          <p className="text-gray-600 mb-4">
            {message || "Your account has been created successfully."}
            <br />
            Redirecting to home page...
          </p>

          <div className="w-full bg-gray-200 rounded-full h-2 overflow-hidden">
            <div className="bg-linear-to-r from-blue-500 to-purple-600 h-2 animate-progress" />
          </div>

          {onClose && (
            <button
              onClick={onClose}
              className="mt-4 w-full py-3 rounded-lg bg-green-600 text-white font-semibold hover:bg-green-700 transition"
            >
              Close
            </button>
          )}
        </div>
      </div>
    </div>
  );
};

export default SuccessModal;
