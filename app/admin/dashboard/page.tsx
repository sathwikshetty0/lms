import { SkeletonCardList } from "@/components/SkeletonCard";

const DexesAdminDashboard = () => {
  return (
    <div className="flex flex-col gap-5">
      <h2 className="text-2xl font-bold py-3 decoration-wavy underline decoration-primary underline-offset-8">
        Dexes Admin Dashboard
      </h2>
      <div>
        <SkeletonCardList />
      </div>
    </div>
  );
};

export default DexesAdminDashboard;
