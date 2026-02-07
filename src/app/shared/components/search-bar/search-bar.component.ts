import { Component, EventEmitter, Input, Output, signal, OnDestroy } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { IconComponent } from '../icon/icon.component';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, distinctUntilChanged } from 'rxjs/operators';

/**
 * Search bar component for entering GitHub usernames
 * Includes input validation, error display, and auto-search on typing
 */
@Component({
  selector: 'app-search-bar',
  standalone: true,
  imports: [FormsModule, IconComponent],
  templateUrl: './search-bar.component.html',
  styleUrl: './search-bar.component.css'
})
export class SearchBarComponent implements OnDestroy {
  @Input() error: string | null = null;
  @Output() search = new EventEmitter<string>();

  searchInput = signal('');
  private searchSubject = new Subject<string>();
  private searchSubscription: Subscription;

  constructor() {
    // Set up debounced search on typing
    this.searchSubscription = this.searchSubject
      .pipe(
        debounceTime(500), // Wait 500ms after user stops typing
        distinctUntilChanged() // Only emit if value has changed
      )
      .subscribe(value => {
        const trimmed = value.trim();
        if (trimmed) {
          this.search.emit(trimmed);
        } else if (value === '') {
          // Clear results when search is empty
          this.search.emit('');
        }
      });
  }

  ngOnDestroy(): void {
    this.searchSubscription.unsubscribe();
    this.searchSubject.complete();
  }

  onSearch(): void {
    const trimmed = this.searchInput().trim();
    if (trimmed) {
      this.search.emit(trimmed);
    }
  }

  onInputChange(value: string): void {
    this.searchInput.set(value);
    this.searchSubject.next(value);
  }
}
