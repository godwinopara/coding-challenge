import { CommonModule } from '@angular/common';
import { Component, effect, inject, signal, ViewChild } from '@angular/core';
import { FormControl, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { MatTableModule } from '@angular/material/table';
import { MatPaginator, MatPaginatorModule } from '@angular/material/paginator';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatIconModule } from '@angular/material/icon';
import { MatChipsModule } from '@angular/material/chips';
import { MatTableDataSource } from '@angular/material/table';
import { IRecords } from '../../models/record.model';
import { RecordsService } from '../../services/records.service';
import { exportToExcel } from '../../utils/exportToExcel';

@Component({
  selector: 'app-record-table',
  imports: [
    FormsModule,
    CommonModule,
    FormsModule,
    MatTableModule,
    MatPaginatorModule,
    MatFormFieldModule,
    MatInputModule,
    ReactiveFormsModule,
    MatIconModule,
    MatChipsModule,
  ],
  templateUrl: './record-table.component.html',
  styleUrl: './record-table.component.css',
})
export class RecordTableComponent {


  constructor() {
    //  Watches for changes in the records signal from the service
    //  Updates the MatTableDataSource with new data
    //  Reapplies current filters to maintain user's filter state
    effect(() => {
      const newData = this.records();
      this.dataSource.data = newData;
      this.applyFilters();
    });
  }

  // Service injection for accessing and managing records data
  private recordService = inject(RecordsService);

  // Records signal from service - provides reactive access to all records
  records = this.recordService.getRecords();

  //Maintains a separate copy of filtered data to avoid re-filtering on export
  filteredRecords = signal<IRecords[]>([]);


  // Filters records by fullName and phoneNumber fields
  filterControl = new FormControl('');

  //Filters records by startDate and endDate
  startDateControl = new FormControl('');
  endDateControl = new FormControl('');

  //Angular Material table data source
  // Handles data display, sorting, and pagination
  dataSource = new MatTableDataSource<IRecords>([]);
  @ViewChild(MatPaginator) paginator!: MatPaginator;

  ngOnInit() {
    // Load initial data into table and filtered records
    this.dataSource.data = this.records();
    this.filteredRecords.set(this.records());

    // Subscribe to filter control changes for real-time filtering
    // Each subscription triggers applyFilters() when user types or selects dates
    this.filterControl.valueChanges.subscribe(() => this.applyFilters());
    this.startDateControl.valueChanges.subscribe(() => this.applyFilters());
    this.endDateControl.valueChanges.subscribe(() => this.applyFilters());
  }

  ngAfterViewInit() {
    this.dataSource.paginator = this.paginator;
  }

  // Defines which columns to display in the table and their order
  displayedColumns: string[] = [
    'fullName',
    'amount',
    'phoneNumber',
    'profilePicture',
    'dateSubmitted',
  ];

  //Normalizes dates to midnight (00:00:00) for accurate date-only comparison
  private normalize = (date: Date) => {
    const copy = new Date(date);
    copy.setHours(0, 0, 0, 0);
    return copy.getTime();
  };

  //Exports currently filtered records to Excel format
  downloadExcel() {
    exportToExcel(this.filteredRecords(), 'filtered-records');
  }

  // Applies all active filters to the records and updates both table display and export data
  applyFilters() {

    // Extract current filter values with fallbacks for empty states
    const filterText = this.filterControl.value || '';
    const startDate = this.startDateControl.value || '';
    const endDate = this.endDateControl.value || '';

    // Apply combined filtering logic to original records
    const filtered = this.records().filter((record) => {

      // TEXT FILTERING: Search in fullName and phoneNumber fields
      const matchesText =
        filterText === '' ||
        record.fullName.toLowerCase().includes(filterText.toLowerCase()) ||
        record.phoneNumber.includes(filterText);

      // DATE RANGE FILTERING: Normalize dates for accurate comparison
      const recordDate = this.normalize(new Date(record.dateSubmitted));

      // START DATE FILTERING: Include records on or after start date
      const matchesStart =
        startDate === '' || recordDate >= this.normalize(new Date(startDate));

        // END DATE FILTERING: Include records on or before end date
      const matchesEnd =
        endDate === '' || recordDate <= this.normalize(new Date(endDate));

      //Return all matched active filters (AND operation)
      return matchesText && matchesStart && matchesEnd;
    });

    // Update table display with filtered results
    this.dataSource.data = filtered;

    // Update export data signal with filtered results
    this.filteredRecords.set(filtered);
  }
}
