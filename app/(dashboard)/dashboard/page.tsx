import { ChartAreaInteractive } from "@/components/chart-area-interactive";
import { DataTable } from "@/components/data-table";
import { SectionCards } from "@/components/section-cards";
import data from "./data.json";

export default function DashboardPage() {
  return (
    <div className="flex flex-col gap-4 md:gap-6">
      
      {/* Cards */}
      <SectionCards />

      {/* Chart */}
      <div>
        <ChartAreaInteractive />
      </div>

      {/* Table */}
      <DataTable data={data} />

    </div>
  );
}