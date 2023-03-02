import { Component, ViewChild, ViewChildren, QueryList, ChangeDetectorRef, OnInit, Input } from '@angular/core';
import { FinanceService } from '../../../services/finance.service';
import { MatTableDataSource, MatTable } from '@angular/material/table';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { animate, state, style, transition, trigger } from '@angular/animations';
import { MatSort } from '@angular/material/sort';
import { Bill, BillDetail } from '../../../models/Finance';
import { PayBillComponent } from '../../../pages/finance/pay-bill/pay-bill.component'

@Component({
  selector: 'app-billing',
  templateUrl: './billing.component.html',
  styleUrls: ['./billing.component.scss']
})
export class BillingComponent implements OnInit {

  constructor(
    public dialog: MatDialog,
    private cd: ChangeDetectorRef,
    private FinanceService: FinanceService
  ) { }

  billData: Bill[];
  billDataSource: MatTableDataSource<Bill>;
  billDetailData: BillDetail[];
  billDetialDataSource: MatTableDataSource<BillDetail>;

  expandedElement: Bill | null;
  billTotal: number = 0;

  async ngOnInit() {
    this.billData = await this.FinanceService.getBills()  
    this.billDataSource = new MatTableDataSource(this.billData);
    // this.billDataSource.sort = this.sort;
  }

  async toggleRow(element: Bill) {

    this.billDetailData = await this.FinanceService.getBillDetails(Number(element.billNo)); 
    this.ss = new MatTableDataSource(this.billDetailData);
    this.expandedElement = element;
    console.log('');
    // element.addresses && (element.addresses as MatTableDataSource<Address>).data.length ? (this.expandedElement = this.expandedElement === element ? null : element) : null;
    // this.cd.detectChanges();
    // this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).sort = this.innerSort.toArray()[index]);
  }

  // applyFilter(filterValue: string) {
  //   this.innerTables.forEach((table, index) => (table.dataSource as MatTableDataSource<Address>).filter = filterValue.trim().toLowerCase());
  // }

  
  openDialog(enterAnimationDuration: string, exitAnimationDuration: string, billData: BillDetail[]): void {
    billData.forEach(billEntry => {
      this.billTotal += billEntry.cost;
    });
    const dial = this.dialog.open(PayBillComponent, {
      data: { billTotal: this.billTotal, billNo: billData[0].billNo },
      width: "50%",
      height: "",
    });

    dial.afterClosed()
    .subscribe(res => {
      console.log("pay bill result: "+res);
      if(res){
        //find the index of the updated element
        const index = this.billData.findIndex(bill => bill.billNo === billData[0].billNo);
        // replace the element at that index with the updated appointment data
        if (index !== -1) {
          this.billData[index] = res;
        }
      }
    })
  }

}