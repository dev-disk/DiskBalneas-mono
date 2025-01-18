import { DataSource } from '@angular/cdk/collections';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { map } from 'rxjs/operators';
import { Observable, of as observableOf, merge, BehaviorSubject } from 'rxjs';
import { ISale } from '../../interfaces/ISale';

export interface SalesItem {
  more: ISale;
  date: string;
  hour: string;
  item: string;
  subtotal: number;
}

export class SalesDataSource extends DataSource<SalesItem> {
  private dataSubject = new BehaviorSubject<SalesItem[]>([]);
  private loadingSubject = new BehaviorSubject<boolean>(false);

  public loading$ = this.loadingSubject.asObservable();
  
  paginator: MatPaginator | undefined;
  sort: MatSort | undefined;

  constructor() {
    super();
  }

  get data(): SalesItem[] {
    return this.dataSubject.value;
  }

  set data(data: SalesItem[]) {
    this.dataSubject.next(data);
  }

  connect(): Observable<SalesItem[]> {
    if (this.paginator && this.sort) {
      return merge(
        this.dataSubject,
        this.paginator.page,
        this.sort.sortChange
      ).pipe(
        map(() => {
          return this.getPagedData(
            this.getSortedData([...this.dataSubject.value])
          );
        })
      );
    } else {
      return this.dataSubject.asObservable();
    }
  }

  disconnect(): void {
    this.dataSubject.complete();
    this.loadingSubject.complete();
  }

  private getPagedData(data: SalesItem[]): SalesItem[] {
    if (this.paginator) {
      const startIndex = this.paginator.pageIndex * this.paginator.pageSize;
      // Usar slice em vez de splice para não modificar o array original
      return data.slice(startIndex, startIndex + this.paginator.pageSize);
    }
    return data;
  }

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

function compare(a: string | number, b: string | number, isAsc: boolean): number {
  return (a < b ? -1 : 1) * (isAsc ? 1 : -1);
}