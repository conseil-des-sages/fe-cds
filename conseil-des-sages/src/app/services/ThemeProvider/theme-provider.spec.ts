import { TestBed } from '@angular/core/testing';
import { ThemeProvider } from './theme-provider';

describe('ThemeProvider', () => {
  let service: ThemeProvider;

  beforeEach(() => {
    TestBed.configureTestingModule({});
    service = TestBed.inject(ThemeProvider);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });
});
