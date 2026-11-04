// Données de démonstration des tableaux de bord de lot (prévisionnel vs réel par plan).
// À remplacer par des appels API quand le back exposera ces données.
// Les dates sont exprimées en jours relatifs à aujourd'hui pour que la démo reste cohérente.

export type PlanStatus = 'RECEPTIONNE' | 'RELIQUAT' | 'TRANSMIS';

export interface LotPlan {
  name: string;
  level: string;
  number: string;
  index: string;
  planned: number;
  actual: number | null;
  sentDate: Date;
  deliveryFrom: Date;
  deliveryTo: Date | null;
  status: PlanStatus;
}

export interface LotShipment {
  name: string;
  date: Date;
}

export interface LotDashboard {
  id: string;
  label: string;
  description: string;
  title: string;
  subcontractor: string;
  marketLabel: string;
  marketAmount: number;
  marketQuantity: number;
  unit: string;
  quantityLabel: string;
  deliveredLabel: string;
  unitPrice: number;
  plans: LotPlan[];
  nextShipments: LotShipment[];
  remainingShipmentsNote?: string;
}

const day = (offset: number) => {
  const date = new Date();
  date.setHours(0, 0, 0, 0);
  date.setDate(date.getDate() + offset);
  return date;
};

// [nom, niveau, n° plan, indice, prévu, réel, envoi, livraison début, livraison fin, statut]
type PlanRow = [string, string, string, string, number, number | null, number, number, number | null, PlanStatus];

const toPlans = (rows: PlanRow[]): LotPlan[] =>
  rows.map(([name, level, number, index, planned, actual, sent, from, to, status]) => ({
    name,
    level,
    number,
    index,
    planned,
    actual,
    sentDate: day(sent),
    deliveryFrom: day(from),
    deliveryTo: to === null ? null : day(to),
    status,
  }));

const toShipments = (rows: [string, number][]): LotShipment[] =>
  rows.map(([name, offset]) => ({ name, date: day(offset) }));

export const LOT_DASHBOARDS: LotDashboard[] = [
  {
    id: 'armature',
    label: 'Armature',
    description: 'Voiles, planchers, poutres',
    title: 'Armatures HA',
    subcontractor: 'Steel Pose',
    marketLabel: 'Marché HA',
    marketAmount: 638788.2,
    marketQuantity: 462.89,
    unit: 'T',
    quantityLabel: 'Poids',
    deliveredLabel: 'Poids livré',
    unitPrice: 1380,
    plans: toPlans([
      ['Fondations Bât A', 'FOND', '120', 'C', 9.97, 10.65, -54, -45, null, 'RELIQUAT'],
      ['Longrines Bât B', 'FOND', '123', '0 - B', 1.47, 1.57, -60, -45, -12, 'RECEPTIONNE'],
      ['Fondations Bât B (grue)', 'FOND', '121', 'A - C', 1.58, 1.71, -60, -34, -12, 'RECEPTIONNE'],
      ['Fondations Bât B', 'PB RDJ', '124', '0', 1.02, 1.18, -56, -41, null, 'RECEPTIONNE'],
      ['Arm. verticaux PHSS1-A', 'PH SS1', '130', '0', 2.36, 2.55, -32, -4, null, 'RECEPTIONNE'],
      ['Arm. verticaux PHSS1-B', 'PH SS1', '134', '0', 0.84, 0.9, -14, -4, null, 'RECEPTIONNE'],
      ['Poutres Bât A', 'PH SS1', '132', 'A', 12.21, null, -37, 21, 28, 'TRANSMIS'],
      ['Dalle portée Bât B', 'PB RDJ', '125', '0', 1.27, null, -4, 11, null, 'TRANSMIS'],
      ['Poutres Bât B', 'PH SS1', '136', 'A', 8.59, null, -37, 9, 14, 'TRANSMIS'],
    ]),
    nextShipments: toShipments([
      ['PHRDC Bât B', 59],
      ['PHR+1 Bât B', 100],
      ['PHR+2 Bât B', 113],
      ['PHR+3 Bât B', 121],
      ['Toiture Bât B', 159],
    ]),
    remainingShipmentsNote: '+ 13 plans Bât A (PHR+1 → Toiture)',
  },
  {
    id: 'beton',
    label: 'Béton',
    description: 'Coulage, dosage, résistance',
    title: 'Béton prêt à l’emploi',
    subcontractor: 'Béton Provence',
    marketLabel: 'Marché BPE',
    marketAmount: 412500,
    marketQuantity: 2750,
    unit: 'm³',
    quantityLabel: 'Volume',
    deliveredLabel: 'Volume livré',
    unitPrice: 150,
    plans: toPlans([
      ['Semelles filantes Bât A', 'FOND', '210', 'B', 142, 148.5, -70, -58, -52, 'RECEPTIONNE'],
      ['Radier fosse ascenseur', 'FOND', '214', '0', 38, 37.2, -62, -49, null, 'RECEPTIONNE'],
      ['Voiles périphériques SS1', 'PH SS1', '220', 'A', 96, 101.8, -40, -27, -20, 'RECEPTIONNE'],
      ['Dalle basse SS1', 'PH SS1', '222', '0', 184, 179, -30, -15, null, 'RECEPTIONNE'],
      ['Poteaux RDC Bât A', 'PB RDJ', '230', 'A', 22, 23.6, -18, -6, null, 'RELIQUAT'],
      ['Dalle haute RDC Bât A', 'PH RDC', '232', '0', 168, null, -9, 12, null, 'TRANSMIS'],
      ['Voiles R+1 Bât A', 'PH R+1', '240', '0', 74, null, -3, 26, 30, 'TRANSMIS'],
    ]),
    nextShipments: toShipments([
      ['Dalle haute R+1 Bât A', 45],
      ['Voiles R+2 Bât A', 67],
      ['Dalle haute R+2 Bât A', 88],
      ['Voiles SS1 Bât B', 102],
    ]),
    remainingShipmentsNote: '+ 9 plans Bât B (RDC → Toiture)',
  },
  {
    id: 'charpente',
    label: 'Charpente',
    description: 'Structure bois et métal',
    title: 'Charpente métallique',
    subcontractor: 'Ateliers Méditerranée',
    marketLabel: 'Marché CM',
    marketAmount: 286400,
    marketQuantity: 68.2,
    unit: 'T',
    quantityLabel: 'Poids',
    deliveredLabel: 'Poids livré',
    unitPrice: 4200,
    plans: toPlans([
      ['Portiques file A-C', 'PH R+3', '310', 'B', 12.4, 12.9, -48, -30, -26, 'RECEPTIONNE'],
      ['Pannes et liernes A-C', 'PH R+3', '312', '0', 4.6, 4.5, -44, -24, null, 'RECEPTIONNE'],
      ['Contreventements', 'PH R+3', '314', 'A', 2.1, 2.4, -35, -12, null, 'RELIQUAT'],
      ['Portiques file D-F', 'PH R+3', '320', '0', 11.8, null, -15, 18, 22, 'TRANSMIS'],
      ['Auvent entrée Bât A', 'PB RDJ', '330', '0', 1.9, null, -6, 35, null, 'TRANSMIS'],
    ]),
    nextShipments: toShipments([
      ['Pannes file D-F', 30],
      ['Escalier de secours', 52],
      ['Passerelle technique', 75],
    ]),
  },
  {
    id: 'electricite',
    label: 'Électricité',
    description: 'Câblage, tableaux, prises',
    title: 'Courants forts — câblage',
    subcontractor: 'Elec Sud Réseaux',
    marketLabel: 'Marché CFO',
    marketAmount: 198600,
    marketQuantity: 14200,
    unit: 'ml',
    quantityLabel: 'Longueur',
    deliveredLabel: 'Longueur posée',
    unitPrice: 11.5,
    plans: toPlans([
      ['Chemins de câbles SS1', 'PH SS1', '410', 'A', 820, 865, -40, -28, -21, 'RECEPTIONNE'],
      ['Distribution TGBT', 'PB RDJ', '412', '0', 460, 452, -33, -19, null, 'RECEPTIONNE'],
      ['Colonnes montantes', 'PH RDC', '420', 'B', 1240, 1318, -20, -7, null, 'RELIQUAT'],
      ['Éclairage parkings', 'PH SS1', '424', '0', 980, null, -10, 14, 21, 'TRANSMIS'],
      ['Prises logements R+1', 'PH R+1', '430', '0', 1560, null, -2, 33, null, 'TRANSMIS'],
    ]),
    nextShipments: toShipments([
      ['Prises logements R+2', 41],
      ['Éclairage parties communes', 63],
      ['Prises logements R+3', 84],
    ]),
  },
  {
    id: 'plomberie',
    label: 'Plomberie',
    description: 'Réseaux eau, évacuations',
    title: 'Plomberie — réseaux',
    subcontractor: 'Hydro Bâtiment',
    marketLabel: 'Marché PLB',
    marketAmount: 154300,
    marketQuantity: 4060,
    unit: 'ml',
    quantityLabel: 'Longueur',
    deliveredLabel: 'Longueur posée',
    unitPrice: 38,
    plans: toPlans([
      ['Réseau EU/EV sous dallage', 'FOND', '510', 'A', 360, 372, -52, -40, -35, 'RECEPTIONNE'],
      ['Nourrices eau froide', 'PH SS1', '514', '0', 120, 118, -38, -22, null, 'RECEPTIONNE'],
      ['Colonnes EF/ECS Bât A', 'PH RDC', '520', 'B', 410, 446, -24, -9, null, 'RECEPTIONNE'],
      ['Évacuations logements R+1', 'PH R+1', '524', '0', 290, null, -8, 16, null, 'TRANSMIS'],
      ['Colonnes EF/ECS Bât B', 'PH RDC', '530', '0', 395, null, -3, 28, 34, 'TRANSMIS'],
    ]),
    nextShipments: toShipments([
      ['Évacuations logements R+2', 44],
      ['Raccordements sanitaires R+1', 70],
      ['Évacuations logements R+3', 91],
    ]),
  },
  {
    id: 'finitions',
    label: 'Finitions',
    description: 'Peinture, revêtements',
    title: 'Peinture et revêtements',
    subcontractor: 'Peinture & Revêtements Azur',
    marketLabel: 'Marché PNT',
    marketAmount: 236800,
    marketQuantity: 8450,
    unit: 'm²',
    quantityLabel: 'Surface',
    deliveredLabel: 'Surface réalisée',
    unitPrice: 28,
    plans: toPlans([
      ['Peinture parkings SS1', 'PH SS1', '610', '0', 620, 641, -21, -8, -3, 'RECEPTIONNE'],
      ['Faïence logements RDC', 'PH RDC', '620', 'A', 280, null, -12, 19, 26, 'TRANSMIS'],
      ['Sols souples RDC', 'PH RDC', '624', '0', 540, null, -6, 33, null, 'TRANSMIS'],
    ]),
    nextShipments: toShipments([
      ['Peinture logements R+1', 48],
      ['Faïence logements R+1', 62],
      ['Sols souples R+1', 77],
      ['Peinture parties communes', 105],
    ]),
    remainingShipmentsNote: '+ 11 plans R+2 → R+4',
  },
];

export const getLotDashboard = (id?: string) => LOT_DASHBOARDS.find((lot) => lot.id === id);

/* ─── Indicateurs calculés à partir des plans ─── */

export interface PlanMetrics {
  plan: LotPlan;
  plannedAmount: number;
  actualAmount: number | null;
  gap: number | null;
  gapPct: number | null;
}

export interface CurvePoint {
  date: number;
  planned: number;
  actual?: number;
  projection?: number;
}

export interface LotMetrics {
  plans: PlanMetrics[];
  plannedTotal: number;
  plannedAmountTotal: number;
  actualTotal: number;
  actualAmountTotal: number;
  plannedOfDelivered: number;
  plannedAmountOfDelivered: number;
  driftPct: number;
  deliveredCount: number;
  overrunCount: number;
  toOrderQuantity: number;
  projectedQuantity: number;
  projectedAmount: number;
  plannedToDate: number;
  progressPct: number;
  statusCounts: Record<PlanStatus, number>;
  curve: CurvePoint[];
}

const sum = (values: number[]) => values.reduce((total, value) => total + value, 0);

export const computeLotMetrics = (lot: LotDashboard): LotMetrics => {
  const plans: PlanMetrics[] = lot.plans.map((plan) => {
    const plannedAmount = plan.planned * lot.unitPrice;
    const actualAmount = plan.actual === null ? null : plan.actual * lot.unitPrice;
    const gap = plan.actual === null ? null : plan.actual - plan.planned;
    return {
      plan,
      plannedAmount,
      actualAmount,
      gap,
      gapPct: gap === null ? null : (gap / plan.planned) * 100,
    };
  });

  const delivered = plans.filter((p) => p.plan.actual !== null);
  const remaining = plans.filter((p) => p.plan.actual === null);

  const plannedTotal = sum(plans.map((p) => p.plan.planned));
  const plannedAmountTotal = sum(plans.map((p) => p.plannedAmount));
  const actualTotal = sum(delivered.map((p) => p.plan.actual ?? 0));
  const actualAmountTotal = sum(delivered.map((p) => p.actualAmount ?? 0));
  const plannedOfDelivered = sum(delivered.map((p) => p.plan.planned));
  const plannedAmountOfDelivered = sum(delivered.map((p) => p.plannedAmount));
  const driftRatio = plannedOfDelivered > 0 ? (actualTotal - plannedOfDelivered) / plannedOfDelivered : 0;
  const toOrderQuantity = sum(remaining.map((p) => p.plan.planned));

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  // Courbe cumulée : on suit les livraisons dans l'ordre chronologique
  const sorted = [...plans].sort(
    (a, b) => a.plan.deliveryFrom.getTime() - b.plan.deliveryFrom.getTime(),
  );
  const curve: CurvePoint[] = [];
  let plannedCumul = 0;
  let actualCumul = 0;
  let projectionCumul: number | null = null;
  sorted.forEach(({ plan }) => {
    plannedCumul += plan.planned;
    if (plan.actual !== null) {
      actualCumul += plan.actual;
      curve.push({ date: plan.deliveryFrom.getTime(), planned: plannedCumul, actual: actualCumul });
    } else {
      if (projectionCumul === null) {
        projectionCumul = actualCumul;
        // Point de départ de la projection, aligné sur le dernier réel
        const last = curve[curve.length - 1];
        if (last) last.projection = actualCumul;
      }
      projectionCumul += plan.planned * (1 + driftRatio);
      curve.push({ date: plan.deliveryFrom.getTime(), planned: plannedCumul, projection: projectionCumul });
    }
  });

  return {
    plans,
    plannedTotal,
    plannedAmountTotal,
    actualTotal,
    actualAmountTotal,
    plannedOfDelivered,
    plannedAmountOfDelivered,
    driftPct: driftRatio * 100,
    deliveredCount: delivered.length,
    overrunCount: delivered.filter((p) => (p.gap ?? 0) > 0).length,
    toOrderQuantity,
    projectedQuantity: actualTotal + toOrderQuantity * (1 + driftRatio),
    projectedAmount: actualAmountTotal + sum(remaining.map((p) => p.plannedAmount)) * (1 + driftRatio),
    plannedToDate: sum(
      plans.filter((p) => p.plan.deliveryFrom.getTime() <= today.getTime()).map((p) => p.plan.planned),
    ),
    progressPct: plannedTotal > 0 ? Math.round((actualTotal / plannedTotal) * 100) : 0,
    statusCounts: {
      RECEPTIONNE: plans.filter((p) => p.plan.status === 'RECEPTIONNE').length,
      RELIQUAT: plans.filter((p) => p.plan.status === 'RELIQUAT').length,
      TRANSMIS: plans.filter((p) => p.plan.status === 'TRANSMIS').length,
    },
    curve,
  };
};
