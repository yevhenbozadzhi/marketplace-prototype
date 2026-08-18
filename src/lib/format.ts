export function formatMoney(min: number, max: number) {
  return `EUR ${min}M-${max}M`;
}

export function normalize(value: string) {
  return value.trim().toLowerCase();
}

export function roleLabel(role: "buyer" | "seller" | "manager") {
  return role === "buyer" ? "Buyer" : role === "seller" ? "Seller" : "Platform Manager";
}
