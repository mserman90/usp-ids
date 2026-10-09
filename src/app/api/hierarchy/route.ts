import { NextResponse } from "next/server";
import { MASTER_TARGETS } from "@/data/targets";
import { DETSIS_INSTITUTIONS } from "@/data/detsisInstitutions";

export async function GET() {
  return NextResponse.json({
    basarili: true,
    toplam_hedef: MASTER_TARGETS.length,
    hedefler: MASTER_TARGETS,
    kurumlar: DETSIS_INSTITUTIONS
  });
}
