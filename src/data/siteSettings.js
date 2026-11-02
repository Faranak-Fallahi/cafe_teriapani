export const defaultSiteSettings = {
  heroTitle: 'سلام! خیلی خوش اومدی به تریاپانی رفیق',
  heroSubtitle: 'چی میل داری؟',
  announcementText: 'یه لحظه صبر کن تا جادو رو ببینی ✨',
}

export function siteSettingsFromRow(row) {
  return {
    heroTitle: row?.hero_title ?? defaultSiteSettings.heroTitle,
    heroSubtitle: row?.hero_subtitle ?? defaultSiteSettings.heroSubtitle,
    announcementText: row?.announcement_text ?? defaultSiteSettings.announcementText,
  }
}
