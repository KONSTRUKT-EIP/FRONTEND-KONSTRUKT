# Suivi de la réception des plans

## Objectif

La page **Réception des plans** suit, pour chaque chantier, les réceptions et les échéances des plans. Elle permet de consulter les indicateurs, rechercher et filtrer le tableau, ajouter une réception et modifier une réception en cliquant sur sa cellule.

La navigation du chantier est assurée par `SiteSectionNav`. La route de la page est `/dashboard/:id/reception-plans`, où `id` correspond à l’UUID du chantier.

## Organisation du frontend

| Fichier | Responsabilité |
| --- | --- |
| `src/Pages/Worksites/PlanReception.tsx` | Orchestration de la page : chargement, regroupement, filtres, calcul des KPI, gestion des erreurs et des modales. |
| `src/Pages/Worksites/planReception.types.ts` | Types métier, valeurs d’enum, valeurs du formulaire et filtres. Les identifiants sont en anglais. |
| `src/Components/Worksites/PlanReception/PlanReceptionTable.tsx` | Tableau des plans, légende des statuts, compteurs et interaction de modification des cellules. |
| `src/Components/Worksites/PlanReception/ReceptionFormModal.tsx` | Formulaire partagé pour créer ou modifier une réception, validation HTML et affichage des erreurs API. |
| `src/Components/Worksites/PlanReception/PlanReceptionToolbar.tsx` | Recherche et filtres par statut. |
| `src/Components/Planning/PlanReception/KpiCard.tsx` | Carte KPI réutilisée par la page. |
| `src/Components/Dashboard/SiteSectionNav.tsx` | Navigation entre la vue d’ensemble du chantier, la réception des plans et l’équipe. |
| `src/services/planReceptionService.ts` | Appels HTTP, sérialisation des données, lecture des réponses et persistance via les tableaux génériques. |

`PlanRow` est un modèle d’affichage qui regroupe les réceptions ayant le même `elementName`. Chaque plan reste une ligne indépendante en base et conserve son propre identifiant.

## Contrat métier en anglais

Les propriétés et valeurs envoyées dans le JSON utilisent des noms anglais. Les textes français apparaissent uniquement dans l’interface.

| Propriété | Type | Obligatoire | Signification |
| --- | --- | --- | --- |
| `elementName` | string | Oui | Nom de l’élément ou de la zone du chantier, par exemple `Foundations Building A`. Sert au regroupement visuel. |
| `planType` | enum string | Oui | `FORMWORK`, `REBAR`, `FLOOR` ou `PRINT`. |
| `plannedDate` | date ISO (`YYYY-MM-DD`) | Oui | Date de réception du plan ou date prévue. |
| `status` | enum string | Oui | `RECEIVED`, `REVISION_REQUIRED`, `DUE_WITHIN_14_DAYS` ou `UPCOMING`. |
| `forDate` | date ISO (`YYYY-MM-DD`) | Non | Date de coulage associée. Chaîne vide si elle n’est pas renseignée. |
| `revision` | string | Non | Indice de révision du plan, par défaut `A`. |

Les valeurs comme `RECEIVED` et `FORMWORK` sont converties en libellés français dans l’interface, par exemple « Reçu » et « Plan de coffrage ». Les dates sont enregistrées au format `YYYY-MM-DD`, puis formatées pour l’affichage.

Exemple d’objet transmis et enregistré :

```json
{
  "elementName": "Foundations Building A",
  "forDate": "2026-11-12",
  "planType": "FORMWORK",
  "plannedDate": "2026-10-28",
  "status": "RECEIVED",
  "revision": "B"
}
```

## API backend et DTOs utilisés

Le backend ne possède pas encore de module ni de DTO dédiés à la réception des plans. La page utilise actuellement l’API **Generic Tables** existante, sans migration Prisma supplémentaire.

### 1. Trouver ou créer le tableau de suivi du chantier

La page commence par demander les tableaux associés au site :

```http
GET /dashboard/tables?siteId={siteId}
Authorization: Bearer {access_token}
```

Elle réutilise le tableau nommé `Plan reception`. Si aucun tableau correspondant n’existe pour ce chantier, elle le crée :

```http
POST /dashboard/tables
Authorization: Bearer {access_token}
Content-Type: application/json
```

```json
{
  "name": "Plan reception",
  "siteId": "SITE_UUID",
  "columns": {
    "elementName": "string",
    "forDate": "date",
    "planType": "string",
    "plannedDate": "date",
    "status": "string",
    "revision": "string"
  }
}
```

Cette requête correspond à `CreateGenericTableDto` : `name` est une chaîne, `siteId` un UUID et `columns` un objet décrivant les colonnes. Les données de chaque ligne sont conservées dans le JSON `GenericTableRow.data`.

### 2. Lire les réceptions

```http
GET /dashboard/tables/{tableId}/rows
Authorization: Bearer {access_token}
```

L’API renvoie des lignes génériques contenant `id` et `data`. Le frontend interprète les lignes conformes au contrat anglais. Il prend aussi en charge les anciennes propriétés et valeurs françaises pour conserver la compatibilité avec les données déjà créées.

### 3. Ajouter une réception

```http
POST /dashboard/tables/{tableId}/rows
Authorization: Bearer {access_token}
Content-Type: application/json
```

```json
{
  "data": {
    "elementName": "Foundations Building A",
    "forDate": "2026-11-12",
    "planType": "FORMWORK",
    "plannedDate": "2026-10-28",
    "status": "RECEIVED",
    "revision": "B"
  }
}
```

La requête correspond à `AddGenericTableRowDto`, dont le contrat est `{ data: object }`.

### 4. Modifier une réception

```http
PUT /dashboard/tables/rows/{rowId}
Authorization: Bearer {access_token}
Content-Type: application/json
```

```json
{
  "data": {
    "elementName": "Foundations Building A",
    "forDate": "2026-11-12",
    "planType": "FORMWORK",
    "plannedDate": "2026-10-28",
    "status": "REVISION_REQUIRED",
    "revision": "C"
  }
}
```

La requête correspond à `UpdateGenericTableRowDto`, dont la propriété `data` est facultative. Le frontend envoie l’objet complet afin de conserver la cohérence de la réception.

## Fichiers backend concernés

- `BACKEND-KONSTRUKT/src/modules/dashboard/dto/create-generic-table.dto.ts` — DTO de création du tableau `{ name, columns, siteId }`.
- `BACKEND-KONSTRUKT/src/modules/dashboard/dto/add-generic-table-row.dto.ts` — DTO d’ajout de ligne `{ data }`.
- `BACKEND-KONSTRUKT/src/modules/dashboard/dto/update-generic-table-row.dto.ts` — DTO de modification de ligne `{ data? }`.
- `BACKEND-KONSTRUKT/src/modules/dashboard/generic-table.controller.ts` — routes HTTP.
- `BACKEND-KONSTRUKT/src/modules/dashboard/generic-table.service.ts` — opérations Prisma.
- `BACKEND-KONSTRUKT/prisma/schema.prisma` — modèles `GenericTable` et `GenericTableRow`.

Les routes nécessitent un JWT et l’un des rôles `ADMIN`, `CHEF_PROJET` ou `CONDUCTEUR_TRAVAUX`. La lecture et la création du tableau vérifient également l’accès au chantier. Les opérations sur les lignes vérifient l’accès à l’organisation du tableau.

## Persistance actuelle en base

L’implémentation actuelle ne nécessite pas de migration Prisma supplémentaire :

- `GenericTable` associe un nom et une description de colonnes à `siteId`.
- `GenericTableRow` associe chaque réception à un tableau via `tableId` et stocke les champs dans `data` au format JSON.
- Prisma génère les identifiants et gère les relations.
- Le frontend regroupe les réceptions par `elementName` uniquement pour l’affichage.

Relation simplifiée :

```text
Site 1 ── N GenericTable 1 ── N GenericTableRow
                                 └── data JSON
```

## Limites actuelles

1. **Aucun fichier de plan n’est téléversé.** Le modèle Prisma `Document` connaît `DocumentType.PLAN`, mais aucun endpoint de documents ou de téléversement n’est utilisé par cette page. Seules les métadonnées de réception sont stockées ; aucun PDF ou fichier CAD n’est envoyé.
2. **Le JSON générique n’est pas validé propriété par propriété.** Le DTO backend vérifie seulement que `data` est un objet. Un DTO métier dédié devrait valider les dates, enums, identifiants et longueurs des champs.
3. **Les statuts sont saisis manuellement.** `DUE_WITHIN_14_DAYS` est actuellement choisi dans le formulaire et n’est pas calculé automatiquement depuis `plannedDate`.
4. **Les KPI sont calculés depuis les réceptions enregistrées.** Ils ne représentent pas le nombre total de plans attendus tant qu’un catalogue des plans prévus n’existe pas.
5. **Le nom du tableau sert de clé fonctionnelle.** Il faut conserver `Plan reception` afin que le frontend retrouve le tableau et le réutilise.

## Évolution backend recommandée

Les tableaux génériques conviennent à une première version. Si cette fonction doit durer, un modèle et une API métier dédiés seront plus fiables. Un modèle `PlanReception` pourrait contenir :

- `id` UUID et `siteId` UUID, avec index et règle de suppression définie ;
- `elementName`, ou une relation vers un élément/une zone du chantier ;
- une enum `PlanType` : `FORMWORK`, `REBAR`, `FLOOR`, `PRINT` ;
- une enum `PlanStatus` : `UPCOMING`, `DUE_WITHIN_14_DAYS`, `RECEIVED`, `REVISION_REQUIRED` ;
- deux dates distinctes et facultatives, `dueDate` et `receivedAt`, plutôt qu’une date ambiguë ;
- une propriété `revision` ;
- une relation facultative `documentId` lorsque le stockage des fichiers sera disponible ;
- les champs d’audit `createdById`, `createdAt` et `updatedAt`.

Routes suggérées :

```text
GET    /sites/:siteId/plan-receptions
POST   /sites/:siteId/plan-receptions
PATCH  /sites/:siteId/plan-receptions/:id
DELETE /sites/:siteId/plan-receptions/:id
```

Le module dédié devra ajouter des DTOs de création et de modification validés avec `class-validator`, contrôler l’accès au chantier avec `SiteAccessGuard`, mapper les enums du frontend vers les enums du backend, puis migrer les anciennes lignes JSON si elles doivent être conservées.
