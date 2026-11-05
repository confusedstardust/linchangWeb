import Image from "next/image";
import subjects from "../../public/site_asset/icons/subjects/manifest.json";

const assetBase = "https://ecs-oss-ist.oss-cn-hangzhou.aliyuncs.com/site_asset/icons/subjects";

export default function PlazaSubjectIcon({ subject }: { subject?: string }) {
  const name = subject
    ? (subjects as Record<string, string>)[subject] || "interdisciplinary"
    : "all";
  return <span className="plaza-subject-icon" aria-hidden="true">
    <Image src={`${assetBase}/${name}.svg?v=warm-yellow-20261105`} alt="" width={32} height={32} unoptimized />
  </span>;
}
