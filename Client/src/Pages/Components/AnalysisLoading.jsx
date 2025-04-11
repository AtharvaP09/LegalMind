import { FaSpinner } from "react-icons/fa";

const AnalysisLoading = () => {
  return (
    <div className="flex flex-col items-center justify-center p-8 rounded-lg bg-gray-50 border border-gray-200 shadow-sm">
      <div className="mb-4">
        <FaSpinner className="animate-spin text-blue-500 h-12 w-12" />
      </div>
      <h2 className="text-xl font-bold mb-2">Analyzing Document</h2>
      <p className="text-gray-600 text-center max-w-md">
        Our AI is processing your document to extract key information and identify potential issues. This may take a minute...
      </p>
      <div className="mt-6 w-full max-w-md bg-gray-200 rounded-full h-2.5">
        <div className="bg-blue-500 h-2.5 rounded-full w-3/4 animate-pulse"></div>
      </div>
    </div>
  );
};

export default AnalysisLoading;