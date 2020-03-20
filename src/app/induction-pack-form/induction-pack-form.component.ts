import { Component, OnInit } from '@angular/core';
import { Route, Router, NavigationExtras } from '@angular/router'
import { TimeSheetService } from '../services/time-sheet.service';
declare var $: any;
import { saveAs } from "file-saver";


@Component({
  selector: 'app-induction-pack-form',
  templateUrl: './induction-pack-form.component.html',
  styleUrls: ['./induction-pack-form.component.scss']
})
export class InductionPackFormComponent implements OnInit {

  constructor(public _timeSheetService: TimeSheetService, private router: Router) { }

  ngOnInit() {
  }


  // Table 1
  url1: any;
  url2: any;
  url3: any;
  url4: any;
  url5: any;
  url6: any;
  url7: any;
  url8: any;
  url9: any;
  url10: any;
  url11: any;
  url12: any;
  url13: any;
  url14: any;
  url15: any;
  url16: any;
  url17: any;
  url18: any;
  url19: any;

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

  rightWorkdate;
  rightWorkIn;
  rightWorksign;

  // Pre-Deployment Safety Critical Checklist

  cardHolderName;
  cardHolderSurName;
  cardHolderContact;
  cardHolderCompany;
  cardsentinelNumber;

  // Sub-Contractors
  optOutIn;
  optOutdate;
  optOutsign;
  optOuttextarea;

  //card holder
  cardsign1;
  carddate1;
  cardIn1;

  cardsign2;
  carddate2;
  cardIn2;



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

  MedicalIN1;
  Medicalsign1;
  medicaldate1;

  MedicalIN2;
  Medicalsign2;
  medicaldate2;

  MedicalIN3;
  Medicalsign3
  medicaldate3

  // Medical Eye Standards

  medicalEye1;
  medicalEye2;
  medicalEye3;
  medicalEye4;

  medicalEyeIn1;
  medicalEyesign1;
  medicalEyesign2;

  medicalEyeIn3;
  medicalEyedate2;
  medicalEyesign3;

  medicalEyeIn4;
  medicalEyesign4;
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
  workIllness12;

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

  tflArea21;
  tflArear21Visit;
  tflArear21Date;

  tflArea22;
  tflArear22Visit;
  tflArear22Date;

  tflArea23;
  tflArear23Visit;
  tflArear23Date;

  tflArea24;
  tflArear24Visit;
  tflArear24Date;

  tflArea25;
  tflArear25Visit;
  tflArear25Date;

  tflArea26;
  tflArear26Visit;
  tflArear26Date;

  tflArea27;
  tflArear27Visit;
  tflArear27Date;

  tflArea28;
  tflArear28Visit;
  tflArear28Date;

  tflArea29;
  tflArear29Visit;
  tflArear29Date;



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

  nightWorkD1;
  nightWorkD2;

  nightWorksign17;
  nightWorksign18

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

  // Tfl Test Questions

  tflQ1;
  tflQ2;
  tflQ3;
  tflQ4;
  tflQ5;
  tflQ6;
  tflQ7;

  // Workspace pressure

  pressure1I;
  pressure1S;
  pressure1L;
  pressure1T;

  pressure2I;
  pressure2S;
  pressure2L;
  pressure2T;

  pressure3I;
  pressure3S;
  pressure3L;
  pressure3T;

  pressure4I;
  pressure4S;
  pressure4L;
  pressure4T;

  pressure5I;
  pressure5S;
  pressure5L;
  pressure5T;

  pressure6I;
  pressure6S;
  pressure6L;
  pressure6T;

  pressure7I;
  pressure7S;
  pressure7L;
  pressure7T;

  pressure8I;
  pressure8S;
  pressure8L;
  pressure8T;

  pressure9I;
  pressure9S;
  pressure9L;
  pressure9T;

  pressure10I;
  pressure10S;
  pressure10L;
  pressure10T;

  pressure11I;
  pressure11S;
  pressure11L;
  pressure11T;

  pressure12I;
  pressure12S;
  pressure12L;
  pressure12T;

  pressure13I;
  pressure13S;
  pressure13L;
  pressure13T;

  pressure14I;
  pressure14S;
  pressure14L;
  pressure14T;

  pressure15I;
  pressure15S;
  pressure15L;
  pressure15T;

  pressure16I;
  pressure16S;
  pressure16L;
  pressure16T;

  pressure17I;
  pressure17S;
  pressure17L;
  pressure17T;

  pressure18I;
  pressure18S;
  pressure18L;
  pressure18T;

  pressure19I;
  pressure19S;
  pressure19L;
  pressure19T;

  pressure20I;
  pressure20S;
  pressure20L;
  pressure20T;

  pressure21I;
  pressure21S;
  pressure21L;
  pressure21T;

  pressure22I;
  pressure22S;
  pressure22L;
  pressure22T;

  pressure23I;
  pressure23S;
  pressure23L;
  pressure23T;

  pressure24I;
  pressure24S;
  pressure24L;
  pressure24T;

  pressure25I;
  pressure25S;
  pressure25L;
  pressure25T;

  pressure26I;
  pressure26S;
  pressure26L;
  pressure26T;

  pressure27I;
  pressure27S;
  pressure27L;
  pressure27T;

  pressure28I;
  pressure28S;
  pressure28L;
  pressure28T;

  pressure29I;
  pressure29S;
  pressure29L;
  pressure29T;

  pressure30I;
  pressure30S;
  pressure30L;
  pressure30T;

  pressure31I;
  pressure31S;
  pressure31L;
  pressure31T;

  pressure32I;
  pressure32S;
  pressure32L;
  pressure32T;

  pressure33I;
  pressure33S;
  pressure33L;
  pressure33T;

  pressure34I;
  pressure34S;
  pressure34L;
  pressure34T;

  pressure35I;
  pressure35S;
  pressure35L;
  pressure35T;

  pressure36I;
  pressure36S;
  pressure36L;
  pressure36T;

  pressure37I;
  pressure37S;
  pressure37L;
  pressure37T;

  pressure38I;
  pressure38S;
  pressure38L;
  pressure38T;








  // Measures By Whoom and Whene

  measure1I;
  measure2I;
  measure3I;
  measure4I;
  measure5I;
  measure6I;
  measure7I;
  measure8I;
  measure9I;
  measure10I;
  measure11I;
  measure12I;
  measure13I;
  measure14I;
  measure15I;
  measure16I;
  measure17I;
  measure18I;
  measure19I;
  measure20I;
  measure21I;
  measure22I;
  measure23I;
  measure24I;
  measure25I;
  measure26I;
  measure27I;
  measure28I;
  measure29I;
  measure30I;
  measure31I;
  measure32I;
  measure33I;
  measure34I;
  measure35I;
  measure36I;
  measure37I;
  measure38I;


  measure1;
  measure2D;
  measure3D;
  measure4D;
  measure5D;
  measure6D;
  measure7D;
  measure8D;
  measure9D;
  measure10D;
  measure11D;
  measure12D;
  measure13D;
  measure14D;
  measure15D;
  measure16D;
  measure17D;
  measure18D;
  measure19D;
  measure20D;
  measure21D;
  measure22D;
  measure23D;
  measure24D;
  measure25D;
  measure26D;
  measure27D;
  measure28D;
  measure29D;
  measure30D;
  measure31D;
  measure32D;
  measure33D;
  measure34D;
  measure35D;
  measure36D;
  measure37D;
  measure38D;

  // --------------------- Confirmation---------------
  confirmationSig1;
  confirmationD1;
  confirmationSig2;
  confirmationD2;
  confirmationSig3;
  confirmationD3;
  // endStaff Safety Responsibility-----------
  SaftyDate1;
  SaftySign1;
  Safty1;
  // Contract of Sponsorship----------------
  Sponsershipsign1;
  Sponsershipdate1;
  Sponsershipsign2;
  Sponsershipdate2;

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
      confirmationDetails: {
        confirmationSig1: this.url4,
        confirmationSig2: this.url19,
        confirmationSig3: this.url6,
        confirmationD1: this.confirmationD1,
        confirmationD2: this.confirmationD2,
        confirmationD3: this.confirmationD3,
      },
      sponsorshipContract: {
        SponsershipSign1: this.url1,
        SponsershipSign2: this.url2,
        Sponsershipdate1: this.Sponsershipdate1,
        Sponsershipdate2: this.Sponsershipdate2,
      },
      cardHolderDeclare: {
        cardIn1: this.cardIn1,
        cardsign1: this.url9,
        carddate1: this.carddate1,
        cardIn2: this.cardIn1,
        cardsign2: this.url10,
        carddate2: this.carddate1,
      },
      safetySatatement: {
        Safty1: this.Safty1,
        SaftySign1: this.url3,
        SaftyDate1: this.SaftyDate1
      },
      optOutDetail: {
        optOutIn: this.optOutIn,
        optOutdate: this.optOutdate,
        optOutsign: this.url8,
        optOuttextarea: this.optOuttextarea
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
      comp: {
        competencesD1: this.competencesD1,
        competencesE1: this.competencesE1,

        competencesD2: this.competencesD2,
        competencesE2: this.competencesE2,

        competencesD3: this.competencesD3,
        competencesE3: this.competencesE3,


        competencesD4: this.competencesD4,
        competencesE4: this.competencesE4,

        competencesD5: this.competencesD5,
        competencesE5: this.competencesE5,


        competencesD6: this.competencesD6,
        competencesE6: this.competencesE6,


        competencesD7: this.competencesD7,
        competencesE7: this.competencesE7,


        competencesD8: this.competencesD8,
        competencesE8: this.competencesE8,


        competencesD9: this.competencesD9,
        competencesE9: this.competencesE9,


        competencesD10: this.competencesD10,
        competencesE10: this.competencesE10,


        competencesD11: this.competencesD11,
        competencesE11: this.competencesE11,


        competencesD12: this.competencesD12,
        competencesE12: this.competencesE12,


        competencesD13: this.competencesD13,
        competencesE13: this.competencesE13,


        competencesD14: this.competencesD14,
        competencesE14: this.competencesE14,

        competencesD15: this.competencesD15,
        competencesE15: this.competencesE15,


        competencesD16: this.competencesD16,
        competencesE16: this.competencesE16,

        competencesD17: this.competencesD17,
        competencesE17: this.competencesE17,


        competencesD18: this.competencesD18,
        competencesE18: this.competencesE18,

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
        workIllness11: this.workIllness11,
        workIllness12: this.workIllness12,
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
      },
      tflTestDetails: {
        tflQ1: this.tflQ1,
        tflQ2: this.tflQ2,
        tflQ3: this.tflQ3,
        tflQ4: this.tflQ4,
        tflQ5: this.tflQ5,
        tflQ6: this.tflQ6,
        tflQ7: this.tflQ7,
      },
      MeasureByWhoom: {
        measure1I: this.measure1I,
        measure2I: this.measure2I,
        measure3I: this.measure3I,
        measure4I: this.measure4I,
        measure5I: this.measure5I,
        measure6I: this.measure6I,
        measure7I: this.measure7I,
        measure8I: this.measure8I,
        measure9I: this.measure9I,
        measure10I: this.measure10I,
        measure11I: this.measure11I,
        measure12I: this.measure12I,
        measure13I: this.measure13I,
        measure14I: this.measure14I,
        measure15I: this.measure15I,
        measure16I: this.measure16I,
        measure17I: this.measure17I,
        measure18I: this.measure18I,
        measure19I: this.measure19I,
        measure20I: this.measure20I,
        measure21I: this.measure21I,
        measure22I: this.measure22I,
        measure23I: this.measure23I,
        measure24I: this.measure24I,
        measure25I: this.measure25I,
        measure26I: this.measure26I,
        measure27I: this.measure27I,
        measure28I: this.measure28I,
        measure29I: this.measure29I,
        measure30I: this.measure30I,
        measure31I: this.measure31I,
        measure32I: this.measure32I,
        measure33I: this.measure33I,
        measure34I: this.measure34I,
        measure35I: this.measure35I,
        measure36I: this.measure36I,
        measure37I: this.measure37I,
        measure38I: this.measure38I,
      },
      MeasureByWhen: {
        measure1I: this.measure1I,
        measure2I: this.measure2I,
        measure3I: this.measure3I,
        measure4I: this.measure4I,
        measure5I: this.measure5I,
        measure6I: this.measure6I,
        measure7I: this.measure7I,
        measure8I: this.measure8I,
        measure9I: this.measure9I,
        measure10I: this.measure10I,
        measure11I: this.measure11I,
        measure12I: this.measure12I,
        measure13I: this.measure13I,
        measure14I: this.measure14I,
        measure15I: this.measure15I,
        measure16I: this.measure16I,
        measure17I: this.measure17I,
        measure18I: this.measure18I,
        measure19I: this.measure19I,
        measure20I: this.measure20I,
        measure21I: this.measure21I,
        measure22I: this.measure22I,
        measure23I: this.measure23I,
        measure24I: this.measure24I,
        measure25I: this.measure25I,
        measure26I: this.measure26I,
        measure27I: this.measure27I,
        measure28I: this.measure28I,
        measure29I: this.measure29I,
        measure30I: this.measure30I,
        measure31I: this.measure31I,
        measure32I: this.measure32I,
        measure33I: this.measure33I,
        measure34I: this.measure34I,
        measure35I: this.measure35I,
        measure36I: this.measure36I,
        measure37I: this.measure37I,
        measure38I: this.measure38I,
      },
      workPressureDetail: {
        pressure1I: this.pressure1I,
        pressure1S: this.pressure1S,
        pressure1L: this.pressure1L,
        pressure1T: this.pressure1T,

        pressure2I: this.pressure2I,
        pressure2S: this.pressure2S,
        pressure2L: this.pressure2L,
        pressure2T: this.pressure2T,

        pressure3I: this.pressure3I,
        pressure3S: this.pressure3S,
        pressure3L: this.pressure3L,
        pressure3T: this.pressure3T,

        pressure4I: this.pressure4I,
        pressure4S: this.pressure4S,
        pressure4L: this.pressure4L,
        pressure4T: this.pressure4T,

        pressure5I: this.pressure5I,
        pressure5S: this.pressure5S,
        pressure5L: this.pressure5L,
        pressure5T: this.pressure5T,

        pressure6I: this.pressure6I,
        pressure6S: this.pressure6S,
        pressure6L: this.pressure6L,
        pressure6T: this.pressure6T,

        pressure7I: this.pressure7I,
        pressure7S: this.pressure7S,
        pressure7L: this.pressure7L,
        pressure7T: this.pressure7T,

        pressure8I: this.pressure8I,
        pressure8S: this.pressure8S,
        pressure8L: this.pressure8L,
        pressure8T: this.pressure8T,

        pressure9I: this.pressure9I,
        pressure9S: this.pressure9S,
        pressure9L: this.pressure9L,
        pressure9T: this.pressure9T,

        pressure10I: this.pressure10I,
        pressure10S: this.pressure10S,
        pressure10L: this.pressure10L,
        pressure10T: this.pressure10T,

        pressure11I: this.pressure11I,
        pressure11S: this.pressure11S,
        pressure11L: this.pressure11L,
        pressure11T: this.pressure11T,

        pressure12I: this.pressure12I,
        pressure12S: this.pressure12S,
        pressure12L: this.pressure12L,
        pressure12T: this.pressure12T,

        pressure13I: this.pressure13I,
        pressure13S: this.pressure13S,
        pressure13L: this.pressure13L,
        pressure13T: this.pressure13T,

        pressure14I: this.pressure14I,
        pressure14S: this.pressure14S,
        pressure14L: this.pressure14L,
        pressure14T: this.pressure14T,

        pressure15I: this.pressure15I,
        pressure15S: this.pressure15S,
        pressure15L: this.pressure15L,
        pressure15T: this.pressure15T,

        pressure16I: this.pressure16I,
        pressure16S: this.pressure16S,
        pressure16L: this.pressure16L,
        pressure16T: this.pressure16T,

        pressure17I: this.pressure17I,
        pressure17S: this.pressure17S,
        pressure17L: this.pressure17L,
        pressure17T: this.pressure17T,

        pressure18I: this.pressure18I,
        pressure18S: this.pressure18S,
        pressure18L: this.pressure18L,
        pressure18T: this.pressure18T,

        pressure19I: this.pressure19I,
        pressure19S: this.pressure19S,
        pressure19L: this.pressure19L,
        pressure19T: this.pressure19T,

        pressure20I: this.pressure20I,
        pressure20S: this.pressure20S,
        pressure20L: this.pressure20L,
        pressure20T: this.pressure20T,

        pressure21I: this.pressure21I,
        pressure21S: this.pressure21S,
        pressure21L: this.pressure21L,
        pressure21T: this.pressure21T,

        pressure22I: this.pressure22I,
        pressure22S: this.pressure22S,
        pressure22L: this.pressure22L,
        pressure22T: this.pressure22T,

        pressure23I: this.pressure23I,
        pressure23S: this.pressure23S,
        pressure23L: this.pressure23L,
        pressure23T: this.pressure23T,

        pressure24I: this.pressure24I,
        pressure24S: this.pressure24S,
        pressure24L: this.pressure24L,
        pressure24T: this.pressure24T,

        pressure25I: this.pressure25I,
        pressure25S: this.pressure25S,
        pressure25L: this.pressure25L,
        pressure25T: this.pressure25T,

        pressure26I: this.pressure26I,
        pressure26S: this.pressure26S,
        pressure26L: this.pressure26L,
        pressure26T: this.pressure26T,

        pressure27I: this.pressure27I,
        pressure27S: this.pressure27S,
        pressure27L: this.pressure27L,
        pressure27T: this.pressure27T,

        pressure28I: this.pressure28I,
        pressure28S: this.pressure28S,
        pressure28L: this.pressure28L,
        pressure28T: this.pressure28T,

        pressure29I: this.pressure29I,
        pressure29S: this.pressure29S,
        pressure29L: this.pressure29L,
        pressure29T: this.pressure29T,

        pressure30I: this.pressure30I,
        pressure30S: this.pressure30S,
        pressure30L: this.pressure30L,
        pressure30T: this.pressure30T,

        pressure31I: this.pressure31I,
        pressure31S: this.pressure31S,
        pressure31L: this.pressure31L,
        pressure31T: this.pressure31T,

        pressure32I: this.pressure32I,
        pressure32S: this.pressure32S,
        pressure32L: this.pressure32L,
        pressure32T: this.pressure32T,

        pressure33I: this.pressure33I,
        pressure33S: this.pressure33S,
        pressure33L: this.pressure33L,
        pressure33T: this.pressure33T,

        pressure34I: this.pressure34I,
        pressure34S: this.pressure34S,
        pressure34L: this.pressure34L,
        pressure34T: this.pressure34T,

        pressure35I: this.pressure35I,
        pressure35S: this.pressure35S,
        pressure35L: this.pressure35L,
        pressure35T: this.pressure35T,

        pressure36I: this.pressure36I,
        pressure36S: this.pressure36S,
        pressure36L: this.pressure36L,
        pressure36T: this.pressure36T,

        pressure37I: this.pressure37I,
        pressure37S: this.pressure37S,
        pressure37L: this.pressure37L,
        pressure37T: this.pressure37T,

        pressure38I: this.pressure38I,
        pressure38S: this.pressure38S,
        pressure38L: this.pressure38L,
        pressure38T: this.pressure38T,

      },
      tflDetail: {
        tflArea1: this.tflArea1,
        tflArear1Visit: this.tflArear1Visit,
        tflArear1Date: this.tflArear1Date,

        tflArea2: this.tflArea2,
        tflArear2Visit: this.tflArear2Visit,
        tflArear2Date: this.tflArear2Date,

        tflArea3: this.tflArea3,
        tflArear3Visit: this.tflArear3Visit,
        tflArear3Date: this.tflArear3Date,

        tflArea4: this.tflArea4,
        tflArear4Visit: this.tflArear4Visit,
        tflArear4Date: this.tflArear4Date,

        tflArea5: this.tflArea5,
        tflArear5Visit: this.tflArear5Visit,
        tflArear5Date: this.tflArear5Date,

        tflArea6: this.tflArea6,
        tflArear6Visit: this.tflArear6Visit,
        tflArear6Date: this.tflArear6Date,

        tflArea7: this.tflArea7,
        tflArear7Visit: this.tflArear7Visit,
        tflArear7Date: this.tflArear7Date,

        tflArea8: this.tflArea8,
        tflArear8Visit: this.tflArear8Visit,
        tflArear8Date: this.tflArear8Date,

        tflArea9: this.tflArea9,
        tflArear9Visit: this.tflArear9Visit,
        tflArear9Date: this.tflArear9Date,

        tflArea10: this.tflArea10,
        tflArear10Visit: this.tflArear10Visit,
        tflArear10Date: this.tflArear10Date,

        tflArea11: this.tflArea11,
        tflArear11Visit: this.tflArear11Visit,
        tflArear11Date: this.tflArear11Date,

        tflArea12: this.tflArea12,
        tflArear12Visit: this.tflArear12Visit,
        tflArear12Date: this.tflArear12Date,

        tflArea13: this.tflArea13,
        tflArear13Visit: this.tflArear13Visit,
        tflArear13Date: this.tflArear13Date,

        tflArea14: this.tflArea14,
        tflArear14Visit: this.tflArear14Visit,
        tflArear14Date: this.tflArear14Date,

        tflArea15: this.tflArea15,
        tflArear15Visit: this.tflArear15Visit,
        tflArear15Date: this.tflArear15Date,

        tflArea16: this.tflArea16,
        tflArear16Visit: this.tflArear16Visit,
        tflArear16Date: this.tflArear16Date,

        tflArea17: this.tflArea17,
        tflArear17Visit: this.tflArear17Visit,
        tflArear17Date: this.tflArear17Date,

        tflArea18: this.tflArea18,
        tflArear18Visit: this.tflArear18Visit,
        tflArear18Date: this.tflArear18Date,

        tflArea19: this.tflArea19,
        tflArear19Visit: this.tflArear19Visit,
        tflArear19Date: this.tflArear19Date,

        tflArea20: this.tflArea20,
        tflArear20Visit: this.tflArear20Visit,
        tflArear20Date: this.tflArear20Date,

        tflArea21: this.tflArea21,
        tflArear21Visit: this.tflArear21Visit,
        tflArear21Date: this.tflArear21Date,

        tflArea22: this.tflArea22,
        tflArear22Visit: this.tflArear22Visit,
        tflArear22Date: this.tflArear22Date,

        tflArea23: this.tflArea23,
        tflArear23Visit: this.tflArear23Visit,
        tflArear23Date: this.tflArear23Date,

        tflArea24: this.tflArea24,
        tflArear24Visit: this.tflArear24Visit,
        tflArear24Date: this.tflArear24Date,

        tflArea25: this.tflArea25,
        tflArear25Visit: this.tflArear25Visit,
        tflArear25Date: this.tflArear25Date,

        tflArea26: this.tflArea26,
        tflArear26Visit: this.tflArear26Visit,
        tflArear26Date: this.tflArear26Date,

        tflArea27: this.tflArea27,
        tflArear27Visit: this.tflArear27Visit,
        tflArear27Date: this.tflArear27Date,

        tflArea28: this.tflArea28,
        tflArear28Visit: this.tflArear28Visit,
        tflArear28Date: this.tflArear28Date,

        tflArea29: this.tflArea29,
        tflArear29Visit: this.tflArear29Visit,
        tflArear29Date: this.tflArear29Date,

      }
    }

    console.log('This.data======>>>>>', this.data);

    this._timeSheetService.generatePdf(this.data).subscribe((res => {
      this.saveToFileSystem(res);
    }));
  }

  private saveToFileSystem(response) {
    var byteArray = new Uint8Array(response.data);
    var blob = new Blob([byteArray], { type: 'application/pdf' });
    saveAs(blob, 'test');
  }

  onSelectFileone(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url1 = event.target.result;
        }
        else {
          this.url1 = '';
        }

      }
    }
  }

  onSelectFile2(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url2 = event.target.result;
        }
        else {
          this.url2 = '';
        }

      }
    }
  }
  onSelectFile3(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url3 = event.target.result;
        }
        else {
          this.url3 = '';
        }

      }
    }
  }
  onSelectFile4(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url4 = event.target.result;
        }
        else {
          this.url4 = '';
        }

      }
    }
  }
  onSelectFile5(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url5 = event.target.result;
        }
        else {
          this.url5 = '';
        }

      }
    }
  }
  onSelectFile6(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url6 = event.target.result;
        }
        else {
          this.url6 = '';
        }

      }
    }
  }
  onSelectFile7(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url7 = event.target.result;
        }
        else {
          this.url7 = '';
        }

      }
    }
  }
  onSelectFile8(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url8 = event.target.result;
        }
        else {
          this.url8 = '';
        }

      }
    }
  }
  onSelectFile9(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url9 = event.target.result;
        }
        else {
          this.url9 = '';
        }

      }
    }
  }
  onSelectFile10(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url10 = event.target.result;
        }
        else {
          this.url10 = '';
        }

      }
    }
  }
  onSelectFile11(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url11 = event.target.result;
        }
        else {
          this.url11 = '';
        }

      }
    }
  }
  onSelectFile12(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url12 = event.target.result;
        }
        else {
          this.url12 = '';
        }

      }
    }
  }
  onSelectFile13(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url13 = event.target.result;
        }
        else {
          this.url13 = '';
        }

      }
    }
  }
  onSelectFile14(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url14 = event.target.result;
        }
        else {
          this.url14 = '';
        }

      }
    }
  }
  onSelectFile15(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url15 = event.target.result;
        }
        else {
          this.url15 = '';
        }

      }
    }
  }
  onSelectFile16(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();
      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url16 = event.target.result;
        }
        else {
          this.url16 = '';
        }
      }
    }
  }
  onSelectFile17(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url17 = event.target.result;
        }
        else {
          this.url17 = '';
        }

      }
    }
  }
  onSelectFile18(event) {
    if (event.target.files && event.target.files[0]) {
      var reader = new FileReader();

      reader.readAsDataURL(event.target.files[0]); // read file as data url

      reader.onload = (event: any) => { // called once readAsDataURL is completed
        if (event && event.target && event.target.result) {
          this.url18 = event.target.result;
        }
        else {
          this.url18 = '';
        }
      }
    }
  }

  // onSelectFile2(event) {
  //   if (event.target.files && event.target.files[0]) {
  //     var reader = new FileReader();

  //     reader.readAsDataURL(event.target.files[0]); // read file as data url

  //     reader.onload = (event: any) => { // called once readAsDataURL is completed
  //       if (event && event.target && event.target.result) {
  //         this.url19 = event.target.result;
  //       }
  //       else {
  //         this.url19 = '';
  //       }
  //     }
  //   }
  // }
  // checkChange(event,variable){
  //   console.log("variable name is",variable, "event", event);

  //   console.log("tempVariable");

  // }
  // check(){
  //   console.log("this.blockage3", this.blockage3)
  // }
}
