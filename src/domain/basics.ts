export type BasicsLink = {
  label: string;
  href: string;
  description: string;
};

export type BasicsGuideline = {
  title: string;
  description: string;
};

export type KpiPlaceholder = {
  label: string;
  value: string;
  trend: string;
  description: string;
};

export type CalculatorFieldConfig = {
  label: string;
  helper: string;
  defaultValue: number;
  min: number;
  max: number;
  step: number;
};

export type CalculatorConfig = {
  currency: string;
  fields: {
    memberCount: CalculatorFieldConfig;
    monthlyFee: CalculatorFieldConfig;
    attendanceRatePercent: CalculatorFieldConfig;
  };
};

export type BasicsPageContent = {
  path: string;
  title: string;
  summary: string;
  lastUpdated: string;
  guidelines: BasicsGuideline[];
  links: BasicsLink[];
  kpis?: KpiPlaceholder[];
  calculator?: CalculatorConfig;
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string, context: string) {
  const value = record[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid basics content: ${context}.${key} must be a non-empty string.`);
  }

  return value;
}

function readNumber(record: Record<string, unknown>, key: string, context: string) {
  const value = record[key];

  if (typeof value !== 'number' || !Number.isFinite(value)) {
    throw new Error(`Invalid basics content: ${context}.${key} must be a finite number.`);
  }

  return value;
}

function parseGuideline(value: unknown, index: number): BasicsGuideline {
  if (!isRecord(value)) {
    throw new Error(`Invalid basics content: guidelines[${index}] must be an object.`);
  }

  return {
    title: readString(value, 'title', `guidelines[${index}]`),
    description: readString(value, 'description', `guidelines[${index}]`),
  };
}

function parseLink(value: unknown, index: number): BasicsLink {
  if (!isRecord(value)) {
    throw new Error(`Invalid basics content: links[${index}] must be an object.`);
  }

  return {
    label: readString(value, 'label', `links[${index}]`),
    href: readString(value, 'href', `links[${index}]`),
    description: readString(value, 'description', `links[${index}]`),
  };
}

function parseKpi(value: unknown, index: number): KpiPlaceholder {
  if (!isRecord(value)) {
    throw new Error(`Invalid basics content: kpis[${index}] must be an object.`);
  }

  return {
    label: readString(value, 'label', `kpis[${index}]`),
    value: readString(value, 'value', `kpis[${index}]`),
    trend: readString(value, 'trend', `kpis[${index}]`),
    description: readString(value, 'description', `kpis[${index}]`),
  };
}

function parseCalculatorField(value: unknown, key: string): CalculatorFieldConfig {
  if (!isRecord(value)) {
    throw new Error(`Invalid basics content: calculator.fields.${key} must be an object.`);
  }

  return {
    label: readString(value, 'label', `calculator.fields.${key}`),
    helper: readString(value, 'helper', `calculator.fields.${key}`),
    defaultValue: readNumber(value, 'defaultValue', `calculator.fields.${key}`),
    min: readNumber(value, 'min', `calculator.fields.${key}`),
    max: readNumber(value, 'max', `calculator.fields.${key}`),
    step: readNumber(value, 'step', `calculator.fields.${key}`),
  };
}

function parseCalculator(value: unknown): CalculatorConfig | undefined {
  if (value === undefined) {
    return undefined;
  }

  if (!isRecord(value) || !isRecord(value.fields)) {
    throw new Error('Invalid basics content: calculator.fields must be an object.');
  }

  return {
    currency: readString(value, 'currency', 'calculator'),
    fields: {
      memberCount: parseCalculatorField(value.fields.memberCount, 'memberCount'),
      monthlyFee: parseCalculatorField(value.fields.monthlyFee, 'monthlyFee'),
      attendanceRatePercent: parseCalculatorField(
        value.fields.attendanceRatePercent,
        'attendanceRatePercent',
      ),
    },
  };
}

export function parseBasicsPageContent(value: unknown): BasicsPageContent {
  if (!isRecord(value)) {
    throw new Error('Invalid basics content: page must be an object.');
  }

  const guidelines = value.guidelines;
  const links = value.links;
  const kpis = value.kpis;

  if (!Array.isArray(guidelines) || !Array.isArray(links)) {
    throw new Error('Invalid basics content: guidelines and links must be arrays.');
  }

  return {
    path: readString(value, 'path', 'page'),
    title: readString(value, 'title', 'page'),
    summary: readString(value, 'summary', 'page'),
    lastUpdated: readString(value, 'lastUpdated', 'page'),
    guidelines: guidelines.map(parseGuideline),
    links: links.map(parseLink),
    kpis: Array.isArray(kpis) ? kpis.map(parseKpi) : undefined,
    calculator: parseCalculator(value.calculator),
  };
}

export function parseBasicsPageContentList(value: unknown): BasicsPageContent[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid basics content: root must be an array.');
  }

  return value.map(parseBasicsPageContent);
}
