export interface ProductTable {
  id: number;
  userId: string;
  name: string;
  quantity: number;
  availability: "Tersedia" | "Sedikit" | "Tidak Tersedia";
  createdAt: Date;
  updatedAt: Date;
  deletedAt: Date;
}
