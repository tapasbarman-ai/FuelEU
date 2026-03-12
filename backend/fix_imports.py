import os

replacements = {
    r"src/adapters/inbound/http/middleware/errorHandler.ts": [
        ("from '../../../core/domain/errors/DomainError'", "from '../../../../core/domain/errors/DomainError'")
    ],
    r"src/adapters/inbound/http/middleware/validateSchema.ts": [
        ("from '../../../core/domain/errors/DomainError'", "from '../../../../core/domain/errors/DomainError'")
    ],
    r"src/adapters/inbound/http/routes/routeRouter.ts": [
        ("const { routeId } = req.params;", "const routeId = req.params.routeId;")
    ],
    r"src/adapters/outbound/postgres/repositories/PrismaBankEntryRepo.ts": [
        ("from '../../../core/application/ports/outbound'", "from '../../../../core/application/ports/outbound'"),
        ("from '../../../core/domain/entities'", "from '../../../../core/domain/entities'")
    ],
    r"src/adapters/outbound/postgres/repositories/PrismaComplianceRepo.ts": [
        ("from '../../../core/application/ports/outbound'", "from '../../../../core/application/ports/outbound'"),
        ("from '../../../core/domain/entities'", "from '../../../../core/domain/entities'")
    ],
    r"src/adapters/outbound/postgres/repositories/PrismaPoolRepo.ts": [
        ("from '../../../core/application/ports/outbound'", "from '../../../../core/application/ports/outbound'")
    ],
    r"src/adapters/outbound/postgres/repositories/PrismaRouteRepo.ts": [
        ("from '../../../core/application/ports/outbound'", "from '../../../../core/application/ports/outbound'"),
        ("from '../../../core/domain/entities'", "from '../../../../core/domain/entities'")
    ],
    r"src/core/application/ports/inbound/index.ts": [
        ("from '../../domain/entities'", "from '../../../domain/entities'")
    ],
    r"src/core/application/ports/outbound/index.ts": [
        ("from '../../domain/entities'", "from '../../../domain/entities'")
    ]
}

for file_path, pairs in replacements.items():
    full_path = os.path.join(r"C:\Users\tb619\Videos\Projects\FuelEU\backend", file_path)
    with open(full_path, "r", encoding="utf-8") as f:
        content = f.read()
    
    for old, new in pairs:
        content = content.replace(old, new)
        
    with open(full_path, "w", encoding="utf-8") as f:
        f.write(content)

print("Replacements done.")
