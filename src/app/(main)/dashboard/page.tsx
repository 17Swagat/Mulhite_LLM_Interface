import LineChart from "./line-chart";
// default export is required for a page or layout
export default function LineChartPage() {
    return (
        <div className="h-screen w-screen flex flex-col items-center justify-center bg-purple-900 ">
            <LineChart />
        </div>
    );
}