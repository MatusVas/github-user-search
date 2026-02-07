import { ComponentFixture, TestBed } from '@angular/core/testing';
import { SearchBarComponent } from './search-bar.component';

describe('SearchBarComponent', () => {
  let component: SearchBarComponent;
  let fixture: ComponentFixture<SearchBarComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [SearchBarComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(SearchBarComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should emit search event with trimmed value', () => {
    const searchSpy = vi.spyOn(component.search, 'emit');
    component.searchInput.set('  octocat  ');

    component.onSearch();

    expect(searchSpy).toHaveBeenCalledWith('octocat');
  });

  it('should not emit search for empty input', () => {
    const searchSpy = vi.spyOn(component.search, 'emit');
    component.searchInput.set('   ');

    component.onSearch();

    expect(searchSpy).not.toHaveBeenCalled();
  });

  it('should display error message when error input is set', async () => {
    fixture.componentRef.setInput('error', 'No results');
    fixture.detectChanges();
    await fixture.whenStable();

    const errorElement = fixture.nativeElement.querySelector('.error-text');
    expect(errorElement).toBeTruthy();
    expect(errorElement.textContent).toBe('No results');
  });

  it('should not display error message when error is null', () => {
    component.error = null;
    fixture.detectChanges();

    const errorElement = fixture.nativeElement.querySelector('.error-text');
    expect(errorElement).toBeFalsy();
  });

  it('should update signal when input changes', () => {
    component.onInputChange('newvalue');
    expect(component.searchInput()).toBe('newvalue');
  });
});
