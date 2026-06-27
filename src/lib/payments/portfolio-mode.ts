/** When true, show demo-mode banners on mock payment (portfolio showcase). */
export function isPortfolioDemoMode(): boolean {
  const value = process.env.NEXT_PUBLIC_PORTFOLIO_DEMO_MODE?.toLowerCase();
  if (value === "false" || value === "0" || value === "off") return false;
  return true;
}
