import { Component, inject, ChangeDetectionStrategy } from '@angular/core';
import { MatDialogModule, MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { MatButtonModule } from '@angular/material/button';

export interface ConfirmationDialogData {
  title: string;
  message: string;
  actionLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

export interface ConfirmationDialogResult {
  confirmed: boolean;
}

@Component({
  selector: 'app-confirmation-dialog',
  standalone: true,
  imports: [MatDialogModule, MatButtonModule],
  template: `
    <div class="confirmation-dialog">
      <div class="dialog-header">
        <h2 mat-dialog-title class="dialog-title">{{ data.title }}</h2>
      </div>

      <div mat-dialog-content class="dialog-content">
        <p class="dialog-message">{{ data.message }}</p>
      </div>

      <div mat-dialog-actions class="dialog-actions">
        <button mat-stroked-button (click)="onCancel()">
          {{ data.cancelLabel || 'Cancel' }}
        </button>
        <button
          mat-raised-button
          [color]="data.isDestructive ? 'warn' : 'primary'"
          (click)="onConfirm()">
          {{ data.actionLabel || 'Confirm' }}
        </button>
      </div>
    </div>
  `,
  styles: [`
    .confirmation-dialog {
      display: flex;
      flex-direction: column;
      gap: 0;
    }

    .dialog-header {
      padding: 1.5rem 1.5rem 1rem;
      border-bottom: 1px solid var(--mat-sys-outline-variant);
    }

    .dialog-title {
      margin: 0;
      font-size: 1.25rem;
      font-weight: 600;
      color: var(--mat-sys-on-surface);
    }

    .dialog-content {
      padding: 1.5rem;
      color: var(--mat-sys-on-surface-variant);
      line-height: 1.5;
    }

    .dialog-message {
      margin: 0;
      font-size: 0.95rem;
    }

    .dialog-actions {
      display: flex;
      gap: 0.75rem;
      justify-content: flex-end;
      padding: 1rem 1.5rem;
      border-top: 1px solid var(--mat-sys-outline-variant);
      background: var(--mat-sys-surface-dim);
    }

    button {
      min-width: 100px;
    }
  `],
  changeDetection: ChangeDetectionStrategy.OnPush
})
export class ConfirmationDialogComponent {
  private readonly dialogRef = inject(MatDialogRef<ConfirmationDialogComponent>);
  readonly data = inject(MAT_DIALOG_DATA) as ConfirmationDialogData;

  onConfirm(): void {
    this.dialogRef.close({ confirmed: true } as ConfirmationDialogResult);
  }

  onCancel(): void {
    this.dialogRef.close({ confirmed: false } as ConfirmationDialogResult);
  }
}
