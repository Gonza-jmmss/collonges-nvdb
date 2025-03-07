import LevelsTable from "./levelsTable";
import getAllLevelsQuery from "@/repositories/levels/queries/getAllLevelsQuery";
import frFR from "@/lang/fr-FR";

export default async function LevelsPage() {
  const t = frFR;

  const levels = await getAllLevelsQuery();

  return (
    <main>
      <div className="mt-3 w-[80vw]">
        <div className="flex justify-between space-x-3">
          <span className="text-xl font-semibold">{t.levels.title}</span>
        </div>
        <LevelsTable levels={levels} />
        {/* <pre>{JSON.stringify(levels, null, 2)}</pre> */}
      </div>
    </main>
  );
}
