import { PrismaClient } from '@prisma/client';

const routes = [
    { routeId: 'R001', vesselType: 'Container', fuelType: 'HFO', year: 2024, ghgIntensity: 91, fuelConsumption: 5000, distance: 12000, totalEmissions: 4500, isBaseline: true },
    { routeId: 'R002', vesselType: 'BulkCarrier', fuelType: 'LNG', year: 2024, ghgIntensity: 88, fuelConsumption: 4800, distance: 11500, totalEmissions: 4200, isBaseline: false },
    { routeId: 'R003', vesselType: 'Tanker', fuelType: 'MGO', year: 2024, ghgIntensity: 93.5, fuelConsumption: 5100, distance: 12500, totalEmissions: 4700, isBaseline: false },
    { routeId: 'R004', vesselType: 'RoRo', fuelType: 'HFO', year: 2025, ghgIntensity: 89.2, fuelConsumption: 4900, distance: 11800, totalEmissions: 4300, isBaseline: false },
    { routeId: 'R005', vesselType: 'Container', fuelType: 'LNG', year: 2025, ghgIntensity: 90.5, fuelConsumption: 4950, distance: 11900, totalEmissions: 4400, isBaseline: false },
    { routeId: 'R006', vesselType: 'RoRo', fuelType: 'LNG', year: 2024, ghgIntensity: 85, fuelConsumption: 8000, distance: 15000, totalEmissions: 4500, isBaseline: false },
];

const prisma = new PrismaClient();

async function main() {
    console.log('Clearing old data...');
    await prisma.poolMember.deleteMany({});
    await prisma.pool.deleteMany({});
    await prisma.bankEntry.deleteMany({});
    await prisma.shipCompliance.deleteMany({});
    await prisma.route.deleteMany({});

    console.log('Seeding routes...');
    for (const r of routes) {
        await prisma.route.create({
            data: r,
        });
    }
    console.log('Seed complete.');
}

// eslint-disable-next-line unicorn/prefer-top-level-await
main()
    .catch((e) => { // NOSONAR
        console.error(e);
        process.exit(1);
    })
    .finally(async () => { // NOSONAR
        await prisma.$disconnect();
    });
