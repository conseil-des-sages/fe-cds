import { TURN_DWELL_MS, TurnPlayer } from './turn-player';

describe('TurnPlayer', () => {
  it('reveals text at a readable pace', () => {
    const player = new TurnPlayer(10);
    player.begin(1, 1);
    player.append('Bonjour le conseil');

    player.tick(500);

    expect(player.revealed()).toBe('Bonjo');
    expect(player.current()?.sageId).toBe(1);
  });

  it('keeps a finished turn on screen, then shows the next one', () => {
    const player = new TurnPlayer(1000);
    player.begin(1, 1);
    player.complete('Court.', null);
    player.begin(2, 1);

    player.tick(100);
    expect(player.revealed()).toBe('Court.');

    player.tick(TURN_DWELL_MS - 100);
    expect(player.current()?.sageId).toBe(1);
    expect(player.heard()).toEqual([]);

    player.tick(100);
    expect(player.current()?.sageId).toBe(2);
    expect(player.revealed()).toBe('');
    expect(player.heard().map((turn) => turn.text)).toEqual(['Court.']);
  });

  it('keeps the last turn displayed once the queue is empty', () => {
    const player = new TurnPlayer(1000);
    player.begin(1, 1);
    player.complete('Fin.', null);
    player.skip();

    player.skip();

    expect(player.drained()).toBe(true);
    expect(player.current()?.sageId).toBe(1);
    expect(player.revealed()).toBe('Fin.');
  });

  it('skip reveals everything before moving on', () => {
    const player = new TurnPlayer(1);
    player.begin(1, 1);
    player.complete('Un long texte.', null);
    player.begin(2, 1);

    player.skip();
    expect(player.revealed()).toBe('Un long texte.');

    player.skip();
    expect(player.current()?.sageId).toBe(2);
  });

  it('forgets partial text when the provider restarts', () => {
    const player = new TurnPlayer(1000);
    player.begin(1, 1);
    player.append('Début');
    player.tick(100);

    player.restart();

    expect(player.revealed()).toBe('');
  });

  it('drops an unfinished turn when the debate fails, and keeps finished ones', () => {
    const player = new TurnPlayer(1000);
    player.begin(1, 1);
    player.complete('Dit.', null);
    player.begin(2, 1);

    player.dropOpenTurn();
    player.tick(100);

    expect(player.current()?.sageId).toBe(1);
    expect(player.revealed()).toBe('Dit.');
  });

  it('restarts the open turn instead of duplicating it after a reconnection', () => {
    const player = new TurnPlayer(1000);
    player.begin(1, 1);
    player.append('Déb');
    player.begin(1, 1);
    player.append('Début complet');
    player.complete('Début complet', null);
    player.skip();
    player.skip();

    expect(player.heard().map((turn) => turn.text)).toEqual(['Début complet']);
    expect(player.drained()).toBe(true);
  });

  it('does not advance while paused', () => {
    const player = new TurnPlayer(1000);
    player.begin(1, 1);
    player.append('Texte');
    player.togglePause();

    player.tick(1000);

    expect(player.revealed()).toBe('');
  });
});
