export { getInitials, getAvatarColor } from "@/utils/avatarHelpers";
export { formatDate } from "@/utils/dateHelpers";

export function formatRupiah(amount: number): string {
  return new Intl.NumberFormat("id-ID", {
    style: "currency",
    currency: "IDR",
    minimumFractionDigits: 0,
  }).format(amount);
}
