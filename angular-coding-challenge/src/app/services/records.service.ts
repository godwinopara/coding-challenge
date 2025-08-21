import { Injectable, signal} from '@angular/core';
import { IRecords } from '../models/record.model';

@Injectable({
  providedIn: 'root'
})
export class RecordsService {
  private records = signal<IRecords[]>([]);

  // Get All Records
  getRecords () {
    return this.records
  }

  // Add New Records
  addRecords (record: IRecords) {
    this.records.update((records) => [...records, record])
  }
}
