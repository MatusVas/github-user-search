import { ComponentFixture, TestBed } from '@angular/core/testing';
import { UserProfileCardComponent } from './user-profile-card.component';
import { GitHubUser } from '../../../core/models/github-user.model';

describe('UserProfileCardComponent', () => {
  let component: UserProfileCardComponent;
  let fixture: ComponentFixture<UserProfileCardComponent>;

  const mockUser: GitHubUser = {
    username: 'octocat',
    avatarUrl: 'https://avatars.githubusercontent.com/u/583231?v=4',
    name: 'The Octocat',
    bio: 'GitHub mascot',
    location: 'San Francisco',
    website: 'https://github.blog',
    twitter: 'github',
    company: '@github',
    repos: 8,
    followers: 3938,
    following: 9,
    joinedDate: 'Joined 25 Jan 2011'
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [UserProfileCardComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(UserProfileCardComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display user data correctly', () => {
    component.user = mockUser;
    fixture.detectChanges();

    const nameElement = fixture.nativeElement.querySelector('.user-name');
    expect(nameElement.textContent).toContain('The Octocat');

    const usernameElement = fixture.nativeElement.querySelector('.username');
    expect(usernameElement.textContent).toContain('@octocat');

    const bioElement = fixture.nativeElement.querySelector('.bio');
    expect(bioElement.textContent).toContain('GitHub mascot');
  });

  it('should show "Not Available" for null location', () => {
    const userWithoutLocation = { ...mockUser, location: null };
    component.user = userWithoutLocation;
    fixture.detectChanges();

    const linkItems = fixture.nativeElement.querySelectorAll('.link-item');
    const locationItem = linkItems[0];
    expect(locationItem.textContent).toContain('Not Available');
    expect(locationItem.classList.contains('unavailable')).toBe(true);
  });

  it('should apply opacity to unavailable links', () => {
    const userWithoutFields = { ...mockUser, location: null, twitter: null };
    component.user = userWithoutFields;
    fixture.detectChanges();

    const unavailableItems = fixture.nativeElement.querySelectorAll('.unavailable');
    expect(unavailableItems.length).toBeGreaterThan(0);
  });

  it('should display loading skeleton when isLoading is true', () => {
    component.isLoading = true;
    fixture.detectChanges();

    const skeleton = fixture.nativeElement.querySelector('.loading-skeleton');
    expect(skeleton).toBeTruthy();
  });

  it('should not display profile card when user is null and not loading', () => {
    component.user = null;
    component.isLoading = false;
    fixture.detectChanges();

    const profileCard = fixture.nativeElement.querySelector('.profile-card');
    expect(profileCard).toBeFalsy();
  });

  it('should show default bio text when bio is null', () => {
    const userWithoutBio = { ...mockUser, bio: null };
    component.user = userWithoutBio;
    fixture.detectChanges();

    const bioElement = fixture.nativeElement.querySelector('.bio');
    expect(bioElement.textContent).toContain('This profile has no bio');
  });
});
