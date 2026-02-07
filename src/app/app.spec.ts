import { TestBed } from '@angular/core/testing';
import { App } from './app';
import { setupLocalStorageMock, setupMatchMediaMock } from '../test-setup';

describe('App', () => {
  beforeEach(async () => {
    setupLocalStorageMock();
    setupMatchMediaMock();

    await TestBed.configureTestingModule({
      imports: [App],
    }).compileComponents();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create the app', () => {
    const fixture = TestBed.createComponent(App);
    const app = fixture.componentInstance;
    expect(app).toBeTruthy();
  });

  it('should render router outlet', async () => {
    const fixture = TestBed.createComponent(App);
    fixture.detectChanges();
    await fixture.whenStable();
    const compiled = fixture.nativeElement as HTMLElement;
    expect(compiled.querySelector('router-outlet')).toBeTruthy();
  });
});
