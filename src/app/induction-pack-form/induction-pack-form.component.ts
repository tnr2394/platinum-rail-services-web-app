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

  // Right to work in Uk

  rightWName;

  rightWorkl1;
  rightWorkl2;
  rightWorkl3;
  rightWorkl4;
  rightWorkl5;
  rightWorkl6;
  rightWorkl7;
  rightWorkl8;

  rightWorkl2A;
  rightWorkl2B;
  rightWorkl2C;
  rightWorkl2D;
  rightWorkl2E;
  rightWorkl2F;
  rightWorkl2G;

  rightWorkl2AA;
  rightWorkl2AB;
  rightWorkl2AC;







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
      },
      rightToWorkInUK: {
        name: this.rightWName,
        list1: {
          rightWorkl1: this.rightWorkl1,
          rightWorkl2: this.rightWorkl2,
          rightWorkl3: this.rightWorkl3,
          rightWorkl4: this.rightWorkl4,
          rightWorkl5: this.rightWorkl5,
          rightWorkl6: this.rightWorkl6,
          rightWorkl7: this.rightWorkl7,
          rightWorkl8: this.rightWorkl8,
        },
        list2: {
          rightWorkl2A: this.rightWorkl2A,
          rightWorkl2B: this.rightWorkl2B,
          rightWorkl2C: this.rightWorkl2C,
          rightWorkl2D: this.rightWorkl2D,
          rightWorkl2E: this.rightWorkl2E,
          rightWorkl2F: this.rightWorkl2F,
          rightWorkl2G: this.rightWorkl2G,
        },
        list2A: {
          rightWorkl2AA: this.rightWorkl2AA,
          rightWorkl2AB: this.rightWorkl2AB,
          rightWorkl2AC: this.rightWorkl2AC,
        }
      }
    }
    console.log('Submit Value Here', this.data);
  }

}
