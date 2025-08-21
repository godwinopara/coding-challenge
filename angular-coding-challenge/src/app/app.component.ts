import { ChangeDetectionStrategy, Component } from '@angular/core';
import { RecordTableComponent } from './components/record-table/record-table.component';
import { FormComponent } from './components/form/form.component';
import { FormControl, ReactiveFormsModule, Validators } from '@angular/forms';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';

@Component({
  selector: 'app-root',
  imports: [
    FormComponent,
    RecordTableComponent,
    MatInputModule,
    ReactiveFormsModule,
    MatCardModule,
    MatFormFieldModule,
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AppComponent {
  // FormControl to dynamically set the number of forms displayed
  formLength = new FormControl<number>(0);

  // Computed property to generate an array representing the forms
  // For example, if formLength = 3, formsArray = [0, 1, 2]
  get formsArray(): number[] {
    const length = this.formLength.value || 0;
    return Array.from({ length }, (_, i) => i);
  }
}
