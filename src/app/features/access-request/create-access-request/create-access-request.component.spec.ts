import { ComponentFixture, TestBed } from '@angular/core/testing';
import { CreateAccessRequestComponent } from './create-access-request.component';

describe('CreateAccessRequestComponent', () => {
  let component: CreateAccessRequestComponent;
  let fixture: ComponentFixture<CreateAccessRequestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CreateAccessRequestComponent]
    }).compileComponents();

    fixture = TestBed.createComponent(CreateAccessRequestComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should have invalid form when empty', () => {
    expect(component.form.invalid).toBeTruthy();
  });

  it('should validate comment requirement', () => {
    const comment = component.form.get('requesterComment');
    comment?.setValue('');
    expect(comment?.hasError('required')).toBeTruthy();
  });

  it('should validate minimum comment length', () => {
    const comment = component.form.get('requesterComment');
    comment?.setValue('short');
    expect(comment?.hasError('minlength')).toBeTruthy();
  });

  it('should enable submit button when form is valid', () => {
    component.form.patchValue({
      requesterComment: 'I need access to aviation chat',
      permissions: ['chat:aviation:use']
    });
    expect(component.form.valid).toBeTruthy();
  });
});
