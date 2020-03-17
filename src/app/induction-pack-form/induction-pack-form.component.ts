import { Component, OnInit } from '@angular/core';
import { Route, Router, NavigationExtras } from '@angular/router'
declare var $: any;

@Component({
  selector: 'app-induction-pack-form',
  templateUrl: './induction-pack-form.component.html',
  styleUrls: ['./induction-pack-form.component.scss']
})
export class InductionPackFormComponent implements OnInit {

  constructor(private router: Router) { }

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

  // Pre-Deployment Safety Critical Checklist

  cardHolderName;
  cardHolderSurName;
  cardHolderContact;
  cardHolderCompany;
  cardsentinelNumber;


  // Next To kin

  kinName;
  kinRelationship;
  kinAddress;
  kinContactNumber;
  kinSecondContactNumber;
  kinEmail;

  //competences

  competencesD1;
  competencesE1;

  competencesD2;
  competencesE2;

  competencesD3;
  competencesE3;


  competencesD4;
  competencesE4;

  competencesD5;
  competencesE5;


  competencesD6;
  competencesE6;


  competencesD7;
  competencesE7;


  competencesD8;
  competencesE8;


  competencesD9;
  competencesE9;


  competencesD10;
  competencesE10;


  competencesD11;
  competencesE11;


  competencesD12;
  competencesE12;


  competencesD13;
  competencesE13;


  competencesD14;
  competencesE14;

  competencesD15;
  competencesE15;


  competencesD16;
  competencesE16;

  competencesD17;
  competencesE17;


  competencesD18;
  competencesE18;
  // Medical Self-Certification

  msc1;
  msc2;
  msc3;
  msc4;
  msc5;
  msc6;
  msc7;
  msc8;
  msc9;
  msc10A;
  msc10B;
  msc10C;
  msc11;
  msc12;
  msc13;
  msc14;

  // Medical Eye Standards

  medicalEye1;
  medicalEye2;
  medicalEye3;
  medicalEye4;

  // Occupational Health Questionnaire

  illness1;
  illness2;
  illness3;
  illness4;
  illness5;
  illness6;
  illness7;
  illness8;
  illness9;
  illness10;
  illness11;
  illness12;
  illness13;
  illness14;
  illness15;
  illness16;
  illness17;
  illness18;
  illness19;
  illness20;
  illness21;
  illness22;
  illness23;
  illness24;
  illness25;
  illness26;
  illness27;
  illness28;

  workIllness1;
  workIllness2;
  workIllness3;
  workIllness4;
  workIllness5;
  workIllness6;
  workIllness7;
  workIllness8;
  workIllness9;
  workIllness10;
  workIllness11;

  // -------------- Other Health Information Start Here-------------
  otherSafetyR1;
  otherSafetyR2;
  otherSafetyR3;
  otherSafetyR4;
  otherSafetyR5;
  otherSafetyR6;
  otherSafetyR7;
  otherSafetyR8;
  otherSafetyR9;
  otherSafetyR10;
  otherSafetyR11;
  otherSafetyR12;
  otherSafetyR13;
  otherSafetyR14;
  otherSafetyR15;


  // Other QUESTION

  otherQ1;
  otherQ2;
  otherQ3;
  otherQ4;
  otherQ5;
  otherQ6;
  otherQ7;
  otherQ8;
  otherQ9;








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
      },
      cardHolderDetails: {
        cardHolderName: this.cardHolderName,
        cardHolderSurName: this.cardHolderSurName,
        cardHolderContact: this.cardHolderContact,
        cardHolderCompany: this.cardHolderCompany,
        cardsentinelNumber: this.cardsentinelNumber
      },
      medicalSelfCertification: {
        msc1: this.msc1,
        msc2: this.msc2,
        msc3: this.msc3,
        msc4: this.msc4,
        msc5: this.msc5,
        msc6: this.msc6,
        msc7: this.msc7,
        msc8: this.msc8,
        msc9: this.msc9,
        msc10A: this.msc10A,
        msc10B: this.msc10B,
        msc10C: this.msc10C,
        msc11: this.msc11,
        msc12: this.msc12,
        msc13: this.msc13,
        msc14: this.msc14
      },
      eyeStandard: {
        medicalEye1: this.medicalEye1,
        medicalEye2: this.medicalEye2,
        medicalEye3: this.medicalEye3,
        medicalEye4: this.medicalEye4
      },
      illnessDetail: {
        illness1: this.illness1,
        illness2: this.illness2,
        illness3: this.illness3,
        illness4: this.illness4,
        illness5: this.illness5,
        illness6: this.illness6,
        illness7: this.illness7,
        illness8: this.illness8,
        illness9: this.illness9,
        illness10: this.illness10,
        illness11: this.illness11,
        illness12: this.illness12,
        illness13: this.illness13,
        illness14: this.illness14,
        illness15: this.illness15,
        illness16: this.illness16,
        illness17: this.illness17,
        illness18: this.illness18,
        illness19: this.illness19,
        illness20: this.illness20,
        illness21: this.illness21,
        illness22: this.illness22,
        illness23: this.illness23,
        illness24: this.illness24,
        illness25: this.illness25,
        illness26: this.illness26,
        illness27: this.illness27,
        illness28: this.illness28
      },
      workIllnessDetail: {
        workIllness1: this.workIllness1,
        workIllness2: this.workIllness2,
        workIllness3: this.workIllness3,
        workIllness4: this.workIllness4,
        workIllness5: this.workIllness5,
        workIllness6: this.workIllness6,
        workIllness7: this.workIllness7,
        workIllness8: this.workIllness8,
        workIllness9: this.workIllness9,
        workIllness10: this.workIllness10,
        workIllness11: this.workIllness11
      },
      otherQuestionDetail: {
        otherQ1: this.otherQ1,
        otherQ2: this.otherQ2,
        otherQ3: this.otherQ3,
        otherQ4: this.otherQ4,
        otherQ5: this.otherQ5,
        otherQ6: this.otherQ6,
        otherQ7: this.otherQ7,
        otherQ8: this.otherQ8,
        otherQ9: this.otherQ9,
      }
    }


    let NavigationExtras: NavigationExtras = {
      state: {
        data: this.data
      }
    };
    this.router.navigateByUrl('/form-preview', NavigationExtras)

  }

}
