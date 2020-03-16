import { Component, OnInit } from '@angular/core';
declare var $: any;

@Component({
  selector: 'app-induction-pack-form',
  templateUrl: './induction-pack-form.component.html',
  styleUrls: ['./induction-pack-form.component.scss']
})
export class InductionPackFormComponent implements OnInit {

  constructor() { }

  ngOnInit() {
  }


  // Table 1
  refresherInduction: 'Yes';
  newStarter: false;
  workingOnNR: false;
  workingOnTfL: false;
  dateOfInduction: true;
  primary: true;
  subSponsored: false;
  inductionPackComplete;
  dateAddedToSentinelDatabase;

  // Table 2

  candidateName;
  dateOfBirth;
  nationalInsuranceNumber;
  candidateAddress;
  contactNumber;
  sentinelNumber;
  emailAddress;

  // CheckList

  type1;
  type2;
  type3;
  type4;
  type5;
  type6;
  type7;
  type8;
  type9;
  type10;
  type11;
  type12;


  // Bank Details

  accountHolderName;
  bankName;
  bankAddress;
  accountNumber;
  sortCode;

  // Payment Details

  CIS;
  PAYE;
  companyName;
  companyNo;
  companyState;
  certificateNumber;

  // Insurance Details

  insurance1;
  insurance2;
  insurance3;
  insurance4;
  insurance5;

  // Next To kin

  kinName;
  kinRelationship;
  kinAddress;
  kinContactNumber;
  kinSecondContactNumber;
  kinEmail;



  data = {};


  submitValue() {
    this.data = {
      refresherInduction: this.refresherInduction,
      newStarter: this.newStarter,
      workingOnNR: this.workingOnNR,
      workingOnTfL: this.workingOnTfL,
      dateOfInduction: this.dateOfInduction,
      sponsorship: {
        primary: this.primary,
        subSponsored: this.subSponsored
      },
      inductionPackComplete: this.inductionPackComplete,
      dateAddedToSentinelDatabase: this.dateAddedToSentinelDatabase,
      candidateName: this.candidateName,
      dateOfBirth: this.dateOfBirth,
      nationalInsuranceNumber: this.nationalInsuranceNumber,
      candidateAddress: this.candidateAddress,
      contactNumber: this.contactNumber,
      sentinelNumber: this.sentinelNumber,
      emailAddress: this.emailAddress,
      bankDetails: {
        accountHolderName: this.accountHolderName,
        bankName: this.bankName,
        bankAddress: this.bankAddress,
        accountNumber: this.accountNumber,
        sortCode: this.sortCode
      },
      paymentDetails: {
        CIS: this.CIS,
        PAYE: this.PAYE,
        companyName: this.companyName,
        companyNo: this.companyNo,
        companyState: this.companyState,
        certificateNumber: this.certificateNumber
      },
      insurance: {
        insurance1: this.insurance1,
        insurance2: this.insurance2,
        insurance3: this.insurance3,
        insurance4: this.insurance4,
        insurance5: this.insurance5,
      },
      nextOfKin: {
        kinName: this.kinName,
        kinRelationship: this.kinRelationship,
        kinAddress: this.kinAddress,
        kinContactNumber: this.kinContactNumber,
        kinSecondContactNumber: this.kinSecondContactNumber,
        kinEmail: this.kinEmail
      },
      checklist: {
        type1: this.type1,
        type2: this.type2,
        type3: this.type3,
        type4: this.type4,
        type5: this.type5,
        type6: this.type6,
        type7: this.type7,
        type8: this.type8,
        type9: this.type9,
        type10: this.type10,
        type11: this.type11,
        type12: this.type12,
      }
    }
    console.log('Submit Value Here', this.data);
  }

}
