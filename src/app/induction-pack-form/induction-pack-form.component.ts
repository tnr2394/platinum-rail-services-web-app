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

  // -----------------------------------end Health---------------------


  // -----------------tflArea-------------------
  tflArea1;
  tflArear1Visit;
  tflArear1Date;

  tflArea2;
  tflArear2Visit;
  tflArear2Date;

  tflArea3;
  tflArear3Visit;
  tflArear3Date;

  tflArea4;
  tflArear4Visit;
  tflArear4Date;

  tflArea5;
  tflArear5Visit;
  tflArear5Date;

  tflArea6;
  tflArear6Visit;
  tflArear6Date;

  tflArea7;
  tflArear7Visit;
  tflArear7Date;

  tflArea8;
  tflArear8Visit;
  tflArear8Date;

  tflArea9;
  tflArear9Visit;
  tflArear9Date;

  tflArea10;
  tflArear10Visit;
  tflArear10Date;

  tflArea11;
  tflArear11Visit;
  tflArear11Date;

  tflArea12;
  tflArear12Visit;
  tflArear12Date;

  tflArea13;
  tflArear13Visit;
  tflArear13Date;

  tflArea14;
  tflArear14Visit;
  tflArear14Date;

  tflArea15;
  tflArear15Visit;
  tflArear15Date;

  tflArea16;
  tflArear16Visit;
  tflArear16Date;

  tflArea17;
  tflArear17Visit;
  tflArear17Date;

  tflArea18;
  tflArear18Visit;
  tflArear18Date;

  tflArea19;
  tflArear19Visit;
  tflArear19Date;

  tflArea20;
  tflArear20Visit;
  tflArear20Date;

  // ---------------------------------------endtlf----

  // -----------------Spacific work===============
  blockage1;
  blockage2;
  blockage3;
  blockage4;
  blockage5;
  blockage6;
  blockage7;
  blockage8;
  blockage9;

  greenZone1;
  greenZone2;

  redZone1;
  redZone2;
  redZone3;
  redZone4;
  redZone5;

  Possession1;
  Possession2;
  Possession3;
  Possession4;
  Possession5;
  Possession6;
  Possession7;
  Possession8;
  Possession9;
  Possession10;

  PossessionE1;
  PossessionE2;
  PossessionE3;
  PossessionE4;
  PossessionE5;
  PossessionE6;
  PossessionE7;
  // ------------------end-------------------------

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

  // Gp Registration

  gpSurName;
  gpInitials;
  gpAddress;
  gpPostCode;
  gpTelephone;

  // Night Work Questions

  nightWorkQ1;
  nightWorkQ2;
  nightWorkQ3;
  nightWorkQ4;
  nightWorkQ5;
  nightWorkQ6;
  nightWorkQ7;
  nightWorkQ8;
  nightWorkQ9;
  nightWorkQ10;
  nightWorkQ11;
  nightWorkQ12;
  nightWorkQ13;


  // Rail PPE Issue

  clothing1Q;
  clothing1D;
  clothing1R;

  clothing2Q;
  clothing2D;
  clothing2R;

  clothing3Q;
  clothing3D;
  clothing3R;

  clothing4Q;
  clothing4D;
  clothing4R;

  clothing5Q;
  clothing5D;
  clothing5R;

  // Safety Equipment

  sE1Q;
  sE1D;
  sE1R;

  sE2Q;
  sE2D;
  sE2R;

  sE3Q;
  sE3D;
  sE3R;

  sE4Q;
  sE4D;
  sE4R;

  sE5Q;
  sE5D;
  sE5R;

  sE6Q;
  sE6D;
  sE6R;

  sE7Q;
  sE7D;
  sE7R;

  sE8Q;
  sE8D;
  sE8R;

  ///Strass ...............
  Stress1;
  Stress2;
  Stress3;
  Stress4;
  Stress5;








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
      otherSafetyRequirements: {
        otherSafetyR1: this.otherSafetyR1,
        otherSafetyR2: this.otherSafetyR2,
        otherSafetyR3: this.otherSafetyR3,
        otherSafetyR4: this.otherSafetyR4,
        otherSafetyR5: this.otherSafetyR5,
        otherSafetyR6: this.otherSafetyR6,
        otherSafetyR7: this.otherSafetyR7,
        otherSafetyR8: this.otherSafetyR8,
        otherSafetyR9: this.otherSafetyR9,
        otherSafetyR10: this.otherSafetyR10,
        otherSafetyR11: this.otherSafetyR11,
        otherSafetyR12: this.otherSafetyR12,
        otherSafetyR13: this.otherSafetyR13,
        otherSafetyR14: this.otherSafetyR14,
        otherSafetyR15: this.otherSafetyR15
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
      },
      gpDetail: {
        gpSurName: this.gpSurName,
        gpInitials: this.gpInitials,
        gpAddress: this.gpAddress,
        gpPostCode: this.gpPostCode,
        gpTelephone: this.gpTelephone
      },
      nightWorkDetail: {
        nightWorkQ1: this.nightWorkQ1,
        nightWorkQ2: this.nightWorkQ2,
        nightWorkQ3: this.nightWorkQ3,
        nightWorkQ4: this.nightWorkQ4,
        nightWorkQ5: this.nightWorkQ5,
        nightWorkQ6: this.nightWorkQ6,
        nightWorkQ7: this.nightWorkQ7,
        nightWorkQ8: this.nightWorkQ8,
        nightWorkQ9: this.nightWorkQ9,
        nightWorkQ10: this.nightWorkQ10,
        nightWorkQ11: this.nightWorkQ11,
        nightWorkQ12: this.nightWorkQ12,
        nightWorkQ13: this.nightWorkQ13,
      },
      lineBlockage: {
        blockage1: this.blockage1,
        blockage2: this.blockage2,
        blockage3: this.blockage3,
        blockage4: this.blockage4,
        blockage5: this.blockage5,
        blockage6: this.blockage6,
        blockage7: this.blockage7,
        blockage8: this.blockage8,
        blockage9: this.blockage9,
      },
      greenZone: {
        greenZone1: this.greenZone1,
        greenZone2: this.greenZone2,
      },
      redZone: {
        redZone1: this.redZone1,
        redZone2: this.redZone2,
        redZone3: this.redZone3,
        redZone4: this.redZone4,
        redZone5: this.redZone5,
      },
      possessionDetail: {
        Possession1: this.Possession1,
        Possession2: this.Possession2,
        Possession3: this.Possession3,
        Possession4: this.Possession4,
        Possession5: this.Possession5,
        Possession6: this.Possession6,
        Possession7: this.Possession7,
        Possession8: this.Possession8,
        Possession9: this.Possession9,
        Possession10: this.Possession10
      },
      possessionEngDetail: {
        PossessionE1: this.PossessionE1,
        PossessionE2: this.PossessionE2,
        PossessionE3: this.PossessionE3,
        PossessionE4: this.PossessionE4,
        PossessionE5: this.PossessionE5,
        PossessionE6: this.PossessionE6,
        PossessionE7: this.PossessionE7,
      },
      safetyClothesDetail: {
        clothing1Q: this.clothing1Q,
        clothing1D: this.clothing1D,
        clothing1R: this.clothing1R,
        clothing2Q: this.clothing2Q,
        clothing2D: this.clothing2D,
        clothing2R: this.clothing2R,
        clothing3Q: this.clothing3Q,
        clothing3D: this.clothing3D,
        clothing3R: this.clothing3R,
        clothing4Q: this.clothing4Q,
        clothing4D: this.clothing4D,
        clothing4R: this.clothing4R,
        clothing5Q: this.clothing5Q,
        clothing5D: this.clothing5D,
        clothing5R: this.clothing5R,
      },
      safetyEquipmentDetails: {
        sE1Q: this.sE1Q,
        sE1D: this.sE1D,
        sE1R: this.sE1R,
        sE2Q: this.sE2Q,
        sE2D: this.sE2D,
        sE2R: this.sE2R,
        sE3Q: this.sE3Q,
        sE3D: this.sE3D,
        sE3R: this.sE3R,
        sE4Q: this.sE4Q,
        sE4D: this.sE4D,
        sE4R: this.sE4R,
        sE5Q: this.sE5Q,
        sE5D: this.sE5D,
        sE5R: this.sE5R,
        sE6Q: this.sE6Q,
        sE6D: this.sE6D,
        sE6R: this.sE6R,
        sE7Q: this.sE7Q,
        sE7D: this.sE7D,
        sE7R: this.sE7R,
        sE8Q: this.sE8Q,
        sE8D: this.sE8D,
        sE8R: this.sE8R,
      },
      riskAssessment: {
        Stress1: this.Stress1,
        Stress2: this.Stress2,
        Stress3: this.Stress3,
        Stress4: this.Stress4,
        Stress5: this.Stress5,
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
