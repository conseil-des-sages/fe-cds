import { SseParser } from './sse-parser';

describe('SseParser', () => {
  it('reads complete events', () => {
    const events = new SseParser().push('event:delta\ndata:{"text":"Bon"}\n\nevent:reset\ndata:{}\n\n');

    expect(events).toEqual([
      { type: 'delta', data: { text: 'Bon' } },
      { type: 'reset', data: {} },
    ]);
  });

  it('waits for the rest of an event cut in two', () => {
    const parser = new SseParser();

    expect(parser.push('event:delta\ndata:{"te')).toEqual([]);
    expect(parser.push('xt":"jour"}\n\n')).toEqual([{ type: 'delta', data: { text: 'jour' } }]);
  });

  it('ignores comments and unreadable data', () => {
    expect(new SseParser().push(': ping\n\nevent:delta\ndata:{cassé\n\n')).toEqual([]);
  });
});
