import { prisma } from "./prisma.js";
async function seed() {
    console.log("Seeding database...");
    await prisma.order.createMany({
        data: [
            { id: "ORD-001", status: "PROCESSING" },
            { id: "ORD-002", status: "SHIPPED" },
            { id: "ORD-003", status: "DELIVERED" },
        ],
        skipDuplicates: true,
    });
    await prisma.billing.createMany({
        data: [
            { invoiceNo: "INV-001", paymentState: "PAID" },
            { invoiceNo: "INV-002", paymentState: "PENDING" },
            { invoiceNo: "INV-003", paymentState: "FAILED" },
        ],
        skipDuplicates: true,
    });
    console.log("Seed completed");
}
seed()
    .catch(console.error)
    .finally(() => prisma.$disconnect());
