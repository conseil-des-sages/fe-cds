import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { CouncilStore } from './council.store';

describe('CouncilStore', () => {
  let store: CouncilStore;
  let http: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [provideHttpClient(), provideHttpClientTesting()] });
    store = TestBed.inject(CouncilStore);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('applies the council at once and saves every change in order', () => {
    store.saveCouncil([1, 2]);
    store.saveCouncil([1, 2, 3]);

    expect(store.councilIds()).toEqual([1, 2, 3]);
    const first = http.expectOne('/api/me/council');
    expect(first.request.body).toEqual({ sageIds: [1, 2] });
    first.flush({ sageIds: [1, 2], min: 2, max: 8 });

    const second = http.expectOne('/api/me/council');
    expect(second.request.body).toEqual({ sageIds: [1, 2, 3] });
    second.flush({ sageIds: [1, 2, 3], min: 2, max: 8 });
    expect(store.saveFailed()).toBe(false);
  });

  it('reports a failed save and keeps saving the next changes', () => {
    store.saveCouncil([1, 2]);
    http.expectOne('/api/me/council').flush({}, { status: 500, statusText: 'Erreur' });
    expect(store.saveFailed()).toBe(true);

    store.saveCouncil([2, 3]);
    http.expectOne('/api/me/council').flush({ sageIds: [2, 3], min: 2, max: 8 });
    expect(store.saveFailed()).toBe(false);
  });
});
