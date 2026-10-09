import { NextResponse } from "next/server";
import { INITIAL_RESPONSES } from "@/data/sampleResponses";
import { GostergeGerceklesme } from "@/types";

// In-memory runtime storage fallback
let currentSubmissions: GostergeGerceklesme[] = [...INITIAL_RESPONSES];

export async function GET() {
  return NextResponse.json({
    basarili: true,
    toplam_kayit: currentSubmissions.length,
    yanitlar: currentSubmissions
  });
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    
    // Check if this is an action update (approval / reject)
    if (body.action === "UPDATE_STATUS") {
      const { id, yeni_durum, gerekce } = body;
      const target = currentSubmissions.find(s => s.id === id);
      if (target) {
        target.onay_durumu = yeni_durum;
        if (gerekce) target.iade_gerekcesi = gerekce;
        return NextResponse.json({ basarili: true, guncellenen: target });
      }
      return NextResponse.json({ basarili: false, mesaj: "Kayıt bulunamadı" }, { status: 404 });
    }

    // New submission creation
    const newEntry: GostergeGerceklesme = {
      id: `RESP-${Date.now().toString().slice(-4)}`,
      gosterge_id: body.gosterge_id,
      eylem_kodu: body.eylem_kodu,
      gosterge_tanimi: body.gosterge_tanimi,
      kurum_kodu: body.kurum_kodu,
      alt_birim: body.alt_birim || "",
      donem: body.donem || "2026-2027",
      girilen_deger: Number(body.girilen_deger),
      birim: body.birim || "",
      aciklama: body.aciklama || "",
      kanit_belge_adi: body.kanit_belge_adi || "Kanit_Belgesi.pdf",
      kanit_belge_turu: body.kanit_belge_turu || "RESMI_YAZI",
      kanit_sha256: body.kanit_sha256 || "e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855",
      onay_durumu: "SORUMLU_ONAYINDA",
      tarih: new Date().toISOString().split("T")[0]
    };

    currentSubmissions.unshift(newEntry);

    return NextResponse.json({
      basarili: true,
      kayit: newEntry,
      mesaj: "Gerçekleşme verisi ve kanıt belgesi onay masasına sunuldu."
    });
  } catch (error) {
    return NextResponse.json({ basarili: false, hata: String(error) }, { status: 500 });
  }
}
