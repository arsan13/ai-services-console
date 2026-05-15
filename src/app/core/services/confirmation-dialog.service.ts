import { Injectable, inject } from '@angular/core';
import { MatDialog, MatDialogConfig } from '@angular/material/dialog';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';
import { ConfirmationDialogComponent, ConfirmationDialogData, ConfirmationDialogResult } from '../../shared/components/confirmation-dialog/confirmation-dialog.component';

export interface DialogOptions {
  title: string;
  message: string;
  actionLabel?: string;
  cancelLabel?: string;
  isDestructive?: boolean;
}

@Injectable({
  providedIn: 'root'
})
export class ConfirmationDialogService {
  private readonly dialog = inject(MatDialog);

  /**
   * Opens a confirmation dialog and returns an observable that emits true if confirmed, false otherwise
   */
  confirm(options: DialogOptions): Observable<boolean> {
    const dialogConfig: MatDialogConfig<ConfirmationDialogData> = {
      maxWidth: '400px',
      width: '90%',
      disableClose: false,
      data: {
        title: options.title,
        message: options.message,
        actionLabel: options.actionLabel,
        cancelLabel: options.cancelLabel,
        isDestructive: options.isDestructive ?? false
      }
    };

    return this.dialog
      .open(ConfirmationDialogComponent, dialogConfig)
      .afterClosed()
      .pipe(
        map((result: ConfirmationDialogResult | undefined) => result?.confirmed ?? false)
      );
  }
}
