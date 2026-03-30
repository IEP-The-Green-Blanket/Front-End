import { AnalysisChart } from "@/components/AnalysisChart";

const AnalysisPage = async () => {
  return (
    <>
      <div className="flex flex-col h-screen bg-gray-50 p-4">
        {/* Chart Container */}
        <div className="bg-white rounded-lg shadow-md p-4 mb-4">
          {/* Add your chart component here */}
          <AnalysisChart level={1} />
        </div>

        {/* Scrollable Table */}
        <div className="flex-1 overflow-y-auto bg-white rounded-lg shadow-md">
          <div className="divide-y">
            {[1, 2, 3, 4, 5].map((item) => (
              <button
                key={item}
                className="w-full p-4 text-left hover:bg-gray-100 transition"
              >
                <p className="font-medium">Graph {item}</p>
                <p className="text-sm text-gray-500">Description</p>
              </button>
            ))}
          </div>
        </div>
      </div>
    </>
  );
};
export default AnalysisPage;
