import { DebateEvent } from '@/models/debate.model';

/** Découpe un flux SSE en événements, même si un morceau réseau s'arrête au milieu d'une ligne. */
export class SseParser {
  private buffer = '';

  push(chunk: string): DebateEvent[] {
    this.buffer += chunk.replace(/\r\n/g, '\n');
    const blocks = this.buffer.split('\n\n');
    this.buffer = blocks.pop() ?? '';
    return blocks.map((block) => this.parseBlock(block)).filter((event): event is DebateEvent => event !== null);
  }

  private parseBlock(block: string): DebateEvent | null {
    let type = '';
    const data: string[] = [];
    for (const line of block.split('\n')) {
      if (line.startsWith('event:')) type = line.slice('event:'.length).trim();
      else if (line.startsWith('data:')) data.push(line.slice('data:'.length).replace(/^ /, ''));
    }
    if (!type || data.length === 0) return null;
    try {
      return { type, data: JSON.parse(data.join('\n')) } as DebateEvent;
    } catch {
      return null;
    }
  }
}
