import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge } from 'rxjs';

// TODO: Replace this with your own data model type
export interface SalesItem {
  more: string;
  date: string;
  hour: string;
  item: string;
  subtotal: number;
}


// TODO: replace this with real data from your application
const EXAMPLE_DATA: SalesItem[] = [
  {more: 'Detalhes do Hydrogen', date: '2025-01-01', hour: '08:00', item: 'Item A', subtotal: 50.0 },
  {more: 'Detalhes do Helium', date: '2025-01-02', hour: '09:00', item: 'Item B', subtotal: 75.0 },
  {more: 'Detalhes do Lithium', date: '2025-01-03', hour: '10:00', item: 'Item C', subtotal: 120.5 },
  {more: 'Detalhes do Beryllium', date: '2025-01-04', hour: '11:30', item: 'Item D', subtotal: 30.0 },
  {more: 'Detalhes do Boron', date: '2025-01-05', hour: '14:00', item: 'Item E', subtotal: 200.0 },
  {more: 'Detalhes do Carbon', date: '2025-01-06', hour: '15:45', item: 'Item F', subtotal: 95.0 },
  {more: 'Detalhes do Nitrogen', date: '2025-01-07', hour: '17:00', item: 'Item G', subtotal: 40.0 },
  {more: 'Detalhes do Oxygen', date: '2025-01-08', hour: '18:20', item: 'Item H', subtotal: 85.0 },
  {more: 'Detalhes do Fluorine', date: '2025-01-09', hour: '19:15', item: 'Item I', subtotal: 150.0 },
  {more: 'Detalhes do Neon', date: '2025-01-10', hour: '20:45', item: 'Item J', subtotal: 65.0 },
];


/**
 * Data source for the Sales view. This class should
 * encapsulate all logic for fetching and manipulating the displayed data
 * (including sorting, pagination, and filtering).
 */
export class SalesDataSource extends DataSource<SalesItem> {
  data: SalesItem[] = EXAMPLE_DATA;
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  /**
   * Connect this data source to the table. The table will only update when
   * the returned stream emits new items.
   * @returns A stream of the items to be rendered.
   */
  connect(): Observable<SalesItem[]> {
    if (this.paginator && this.sort) {
      // Combine everything that affects the rendered data into one update
      // stream for the data-table to consume.
      return merge(observableOf(this.data), this.paginator.page, this.sort.sortChange)
        .pipe(map(() => {
          return this.getPagedData(this.getSortedData([...this.data ]));
        }));
    } else {
      throw Error('Please set the paginator and sort on the data source before connecting.');
    }
  }

  /**
   *  Called when the table is being destroyed. Use this function, to clean up
   * any open connections or free any held resources that were set up during connect.
   */
  disconnect(): void {}

  /**
   * Paginate the data (client-side). If you're using server-side pagination,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getPagedData(data: SalesItem[]): SalesItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      return data.splice(startIndex, this.paginator.pageSize);
    } else {
      return data;
    }
  }

  /**
   * Sort the data (client-side). If you're using server-side sorting,
   * this would be replaced by requesting the appropriate data from the server.
   */
  private getSortedData(data: SalesItem[]): SalesItem[] {
    if (!this.sort || !this.sort.active || this.sort.direction === '') {
      return data;
    }
  
    return data.sort((a, b) => {
      const isAsc = this.sort?.direction === 'asc';
      switch (this.sort?.active) {
        case 'date': 
          return compare(new Date(a.date).getTime(), new Date(b.date).getTime(), isAsc);
        case 'subtotal': 
          return compare(a.subtotal, b.subtotal, isAsc);
        default: 
          return 0;
      }
    });
  }
  
}

/** Simple sort comparator for example ID/Name columns (for client-side sorting). */
function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}
