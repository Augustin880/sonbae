export type ContentBlock = {
  heading: string;
  body: string;
  bullets?: string[];
};

export type ContentResource = {
  title: string;
  description: string;
  owner: string;
  type: 'document' | 'contact' | 'process' | 'metric' | 'system' | 'policy';
};

const contentResourceTypes = [
  'document',
  'contact',
  'process',
  'metric',
  'system',
  'policy',
] as const;
const timelineStatuses = ['active', 'planned', 'completed'] as const;
const calendarEventKinds = ['deadline', 'event', 'meeting'] as const;

function isContentResourceType(value: string): value is ContentResource['type'] {
  return contentResourceTypes.some((type) => type === value);
}

function isTimelineStatus(value: string): value is TimelineStep['status'] {
  return timelineStatuses.some((status) => status === value);
}

function isCalendarEventKind(value: string): value is CalendarEvent['kind'] {
  return calendarEventKinds.some((kind) => kind === value);
}

export type TimelineStep = {
  label: string;
  status: 'active' | 'planned' | 'completed';
  description: string;
};

export type CalendarEvent = {
  title: string;
  date: string;
  endDate?: string;
  time?: string;
  kind: 'deadline' | 'event' | 'meeting';
  owner: string;
  location?: string;
  description: string;
};

export type ContactPoint = {
  name: string;
  responsibility: string;
  email: string;
};

export type SectionContent = {
  path: string;
  title: string;
  summary: string;
  lastUpdated: string;
  blocks: ContentBlock[];
  resources: ContentResource[];
  timeline?: TimelineStep[];
  calendarEvents?: CalendarEvent[];
  contacts?: ContactPoint[];
  kpis?: ContentResource[];
};

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === 'object' && value !== null && !Array.isArray(value);
}

function readString(record: Record<string, unknown>, key: string, context: string) {
  const value = record[key];

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid content: ${context}.${key} must be a non-empty string.`);
  }

  return value;
}

function readOptionalString(record: Record<string, unknown>, key: string, context: string) {
  const value = record[key];

  if (value === undefined) {
    return undefined;
  }

  if (typeof value !== 'string' || value.trim() === '') {
    throw new Error(`Invalid content: ${context}.${key} must be a non-empty string.`);
  }

  return value;
}

function readStringArray(
  record: Record<string, unknown>,
  key: string,
  context: string,
): string[] | undefined {
  const value = record[key];

  if (value === undefined) {
    return undefined;
  }

  if (!Array.isArray(value)) {
    throw new Error(`Invalid content: ${context}.${key} must be a string array.`);
  }

  const items: unknown[] = value;

  if (items.some((item) => typeof item !== 'string')) {
    throw new Error(`Invalid content: ${context}.${key} must be a string array.`);
  }

  return items.map((item) => String(item));
}

function parseBlock(value: unknown, index: number): ContentBlock {
  if (!isRecord(value)) {
    throw new Error(`Invalid content: blocks[${index}] must be an object.`);
  }

  return {
    heading: readString(value, 'heading', `blocks[${index}]`),
    body: readString(value, 'body', `blocks[${index}]`),
    bullets: readStringArray(value, 'bullets', `blocks[${index}]`),
  };
}

function parseResource(value: unknown, index: number, key = 'resources'): ContentResource {
  if (!isRecord(value)) {
    throw new Error(`Invalid content: ${key}[${index}] must be an object.`);
  }

  const type = readString(value, 'type', `${key}[${index}]`);

  if (!isContentResourceType(type)) {
    throw new Error(`Invalid content: ${key}[${index}].type has unsupported value.`);
  }

  return {
    title: readString(value, 'title', `${key}[${index}]`),
    description: readString(value, 'description', `${key}[${index}]`),
    owner: readString(value, 'owner', `${key}[${index}]`),
    type,
  };
}

function parseTimelineStep(value: unknown, index: number): TimelineStep {
  if (!isRecord(value)) {
    throw new Error(`Invalid content: timeline[${index}] must be an object.`);
  }

  const status = readString(value, 'status', `timeline[${index}]`);

  if (!isTimelineStatus(status)) {
    throw new Error(`Invalid content: timeline[${index}].status has unsupported value.`);
  }

  return {
    label: readString(value, 'label', `timeline[${index}]`),
    status,
    description: readString(value, 'description', `timeline[${index}]`),
  };
}

function parseCalendarEvent(value: unknown, index: number): CalendarEvent {
  if (!isRecord(value)) {
    throw new Error(`Invalid content: calendarEvents[${index}] must be an object.`);
  }

  const kind = readString(value, 'kind', `calendarEvents[${index}]`);

  if (!isCalendarEventKind(kind)) {
    throw new Error(`Invalid content: calendarEvents[${index}].kind has unsupported value.`);
  }

  return {
    title: readString(value, 'title', `calendarEvents[${index}]`),
    date: readString(value, 'date', `calendarEvents[${index}]`),
    endDate: readOptionalString(value, 'endDate', `calendarEvents[${index}]`),
    time: readOptionalString(value, 'time', `calendarEvents[${index}]`),
    kind,
    owner: readString(value, 'owner', `calendarEvents[${index}]`),
    location: readOptionalString(value, 'location', `calendarEvents[${index}]`),
    description: readString(value, 'description', `calendarEvents[${index}]`),
  };
}

function parseContact(value: unknown, index: number): ContactPoint {
  if (!isRecord(value)) {
    throw new Error(`Invalid content: contacts[${index}] must be an object.`);
  }

  return {
    name: readString(value, 'name', `contacts[${index}]`),
    responsibility: readString(value, 'responsibility', `contacts[${index}]`),
    email: readString(value, 'email', `contacts[${index}]`),
  };
}

export function parseSectionContent(value: unknown): SectionContent {
  if (!isRecord(value)) {
    throw new Error('Invalid content: section must be an object.');
  }

  const blocks = value.blocks;
  const resources = value.resources;
  const timeline = value.timeline;
  const calendarEvents = value.calendarEvents;
  const contacts = value.contacts;
  const kpis = value.kpis;

  if (!Array.isArray(blocks)) {
    throw new Error('Invalid content: blocks must be an array.');
  }

  if (!Array.isArray(resources)) {
    throw new Error('Invalid content: resources must be an array.');
  }

  return {
    path: readString(value, 'path', 'section'),
    title: readString(value, 'title', 'section'),
    summary: readString(value, 'summary', 'section'),
    lastUpdated: readString(value, 'lastUpdated', 'section'),
    blocks: blocks.map(parseBlock),
    resources: resources.map((resource, index) => parseResource(resource, index)),
    timeline: Array.isArray(timeline) ? timeline.map(parseTimelineStep) : undefined,
    calendarEvents: Array.isArray(calendarEvents)
      ? calendarEvents.map(parseCalendarEvent)
      : undefined,
    contacts: Array.isArray(contacts) ? contacts.map(parseContact) : undefined,
    kpis: Array.isArray(kpis)
      ? kpis.map((kpi, index) => parseResource(kpi, index, 'kpis'))
      : undefined,
  };
}

export function parseSectionContentList(value: unknown): SectionContent[] {
  if (!Array.isArray(value)) {
    throw new Error('Invalid content: section content root must be an array.');
  }

  const sections = value.map(parseSectionContent);
  const paths = new Set<string>();

  for (const section of sections) {
    if (paths.has(section.path)) {
      throw new Error(`Invalid content: duplicate section path ${section.path}.`);
    }

    paths.add(section.path);
  }

  return sections;
}
