import { prisma } from "./prisma";

export interface SiteSettings {
  primaryColor: string;
  accentStrong: string;
  accentOn: string;
  secondaryColor: string;
  tertiaryColor: string;
  photosGrayscale: boolean;
  sliderInterval: number;
  siteName: string;
  contactEmail: string;
  contactInstagram: string;
  contactPhone: string;
  contactLocation: string;
}

const DEFAULTS: SiteSettings = {
  primaryColor: "#ffb3ae",
  accentStrong: "#d67570",
  accentOn: "#5d1717",
  secondaryColor: "#ecc165",
  tertiaryColor: "#75d9b2",
  photosGrayscale: true,
  sliderInterval: 5000,
  siteName: "Instinto Enduro",
  contactEmail: "",
  contactInstagram: "",
  contactPhone: "",
  contactLocation: "España",
};

export async function getSettings(): Promise<SiteSettings> {
  const rows = await prisma.siteSetting.findMany();
  const map = new Map(rows.map((r) => [r.key, r.value]));

  return {
    primaryColor: map.get("primaryColor") ?? DEFAULTS.primaryColor,
    accentStrong: map.get("accentStrong") ?? DEFAULTS.accentStrong,
    accentOn: map.get("accentOn") ?? DEFAULTS.accentOn,
    secondaryColor: map.get("secondaryColor") ?? DEFAULTS.secondaryColor,
    tertiaryColor: map.get("tertiaryColor") ?? DEFAULTS.tertiaryColor,
    photosGrayscale: map.get("photosGrayscale") !== "false",
    sliderInterval: parseInt(map.get("sliderInterval") ?? String(DEFAULTS.sliderInterval), 10),
    siteName: map.get("siteName") ?? DEFAULTS.siteName,
    contactEmail: map.get("contactEmail") ?? DEFAULTS.contactEmail,
    contactInstagram: map.get("contactInstagram") ?? DEFAULTS.contactInstagram,
    contactPhone: map.get("contactPhone") ?? DEFAULTS.contactPhone,
    contactLocation: map.get("contactLocation") ?? DEFAULTS.contactLocation,
  };
}

export async function updateSettings(
  data: Partial<SiteSettings>
): Promise<void> {
  const entries = Object.entries(data).filter(
    ([, v]) => v !== undefined
  ) as [string, string | boolean | number][];

  for (const [key, val] of entries) {
    await prisma.siteSetting.upsert({
      where: { key },
      update: { value: String(val) },
      create: { key, value: String(val) },
    });
  }
}
