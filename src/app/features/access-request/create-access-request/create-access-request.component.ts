import { Component, inject, signal, ChangeDetectionStrategy, DestroyRef, OnInit } from '@angular/core';
import { MatChipsModule } from '@angular/material/chips';
import { Router } from '@angular/router';
import { AbstractControl, FormBuilder, ReactiveFormsModule, ValidationErrors, ValidatorFn, Validators } from '@angular/forms';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatSelectModule } from '@angular/material/select';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import { finalize } from 'rxjs';
import { UserAccessRequestService } from '../../../core/services/user-access-request.service';
import { PERMISSIONS, Permission } from '../../../core/models/permission.model';
import { RoleType } from '../../../core/enums/role-type.enum';
import { UserService } from '../../../core/services/user.service';
import { RolePermissionService, RolePermissionsMap } from '../../../core/services/role-permission.service';

@Component({
  selector: 'app-create-access-request',
  imports: [
    ReactiveFormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatSelectModule,
    MatProgressSpinnerModule,
    MatSnackBarModule,
    MatChipsModule
  ],
  templateUrl: './create-access-request.component.html',
  styleUrl: './create-access-request.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class CreateAccessRequestComponent implements OnInit {
  private static readonly SUCCESS_NAVIGATION_DELAY_MS = 450;

  private readonly accessRequestService = inject(UserAccessRequestService);
  private readonly router = inject(Router);
  private readonly snackBar = inject(MatSnackBar);
  private readonly fb = inject(FormBuilder);
  private readonly userService = inject(UserService);
  private readonly rolePermissionService = inject(RolePermissionService);
  private readonly destroyRef = inject(DestroyRef);

  readonly isLoading = signal(false);
  readonly isNavigatingToRequests = signal(false);
  readonly successMessage = signal('');

  readonly availablePermissions: Permission[] = Object.values(PERMISSIONS);
  readonly availablePermissionSet = new Set<string>(this.availablePermissions);
  readonly availableRoles = Object.values(RoleType).filter((role) => role !== RoleType.ROLE_ADMIN);
  readonly currentUser = this.userService.currentUser();
  readonly assignedPermissions = new Set<string>(this.currentUser?.permissions ?? []);
  readonly assignedRoles = new Set(this.currentUser?.roles ?? []);
  readonly rolePermissionsMap = signal<RolePermissionsMap>({});

  private previousSelectedRoles = new Set<RoleType>();

  readonly form = this.fb.nonNullable.group({
    requesterComment: ['', [Validators.required, Validators.minLength(10)]],
    permissions: [[] as string[]],
    roles: [[] as RoleType[]]
  }, {
    validators: [this.atLeastOneAccessTargetValidator()]
  });

  readonly controls = this.form.controls;

  ngOnInit(): void {
    this.loadRolePermissionsMap();
    this.bindRoleSelectionToPermissions();
  }

  isPermissionAssigned(permission: Permission): boolean {
    return this.assignedPermissions.has(permission);
  }

  isRoleAssigned(role: RoleType): boolean {
    return this.assignedRoles.has(role);
  }

  private loadRolePermissionsMap(): void {
    this.rolePermissionService.getAvailableRolePermissions()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (map) => {
          this.rolePermissionsMap.set(map ?? {});
        },
        error: (err) => {
          console.error('Error loading role permission mapping:', err);
        }
      });
  }

  private bindRoleSelectionToPermissions(): void {
    this.controls.roles.valueChanges
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((selectedRoles) => {
        const currentRoles = new Set(selectedRoles ?? []);
        const newlyAddedRoles = [...currentRoles].filter((role) => !this.previousSelectedRoles.has(role));
        const removedRoles = [...this.previousSelectedRoles].filter((role) => !currentRoles.has(role));
        const mapping = this.rolePermissionsMap();

        if (newlyAddedRoles.length > 0 || removedRoles.length > 0) {
          const permissionSet = new Set(this.controls.permissions.value ?? []);

          for (const role of newlyAddedRoles) {
            const mappedPermissions = mapping[role] ?? [];
            for (const permission of mappedPermissions) {
              if (this.availablePermissionSet.has(permission) && !this.assignedPermissions.has(permission)) {
                permissionSet.add(permission);
              }
            }
          }

          for (const role of removedRoles) {
            const mappedPermissions = mapping[role] ?? [];
            for (const permission of mappedPermissions) {
              const stillMappedBySelectedRole = [...currentRoles].some((selectedRole) =>
                (mapping[selectedRole] ?? []).includes(permission)
              );

              if (!stillMappedBySelectedRole) {
                permissionSet.delete(permission);
              }
            }
          }

          this.controls.permissions.setValue([...permissionSet], { emitEvent: false });
        }

        this.previousSelectedRoles = currentRoles;
      });
  }

  private atLeastOneAccessTargetValidator(): ValidatorFn {
    return (control: AbstractControl): ValidationErrors | null => {
      const permissions = (control.get('permissions')?.value ?? []) as string[];
      const roles = (control.get('roles')?.value ?? []) as RoleType[];

      return permissions.length > 0 || roles.length > 0
        ? null
        : { accessTargetRequired: true };
    };
  }

  onSubmit(): void {
    if (this.isLoading() || this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    const { requesterComment, permissions, roles } = this.form.getRawValue();

    this.isLoading.set(true);
    this.form.disable({ emitEvent: false });

    this.accessRequestService.createAccessRequest({
      requesterComment,
      permissions,
      roles
    })
      .pipe(
        finalize(() => {
          this.isLoading.set(false);
          if (!this.isNavigatingToRequests()) {
            this.form.enable({ emitEvent: false });
          }
        })
      )
      .subscribe({
        next: (request) => {
          this.snackBar.open('Access request submitted successfully', 'Close', { duration: 3000 });
          this.successMessage.set(`Request #${request.id} submitted for approval.`);
          this.isNavigatingToRequests.set(true);
          setTimeout(() => {
            this.router.navigate(['/access-requests/my-requests'], {
              queryParams: { created: request.id }
            });
          }, CreateAccessRequestComponent.SUCCESS_NAVIGATION_DELAY_MS);
        },
        error: (err) => {
          this.snackBar.open('Failed to submit access request', 'Close', { duration: 5000 });
          console.error('Error creating access request:', err);
        }
      });
  }

  onCancel(): void {
    this.router.navigate(['/access-requests']);
  }
}
