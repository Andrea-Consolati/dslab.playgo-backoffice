import { Component, OnInit } from "@angular/core";
import { FormBuilder, FormControl, FormGroup, Validators } from "@angular/forms";
import { MatDialogRef } from "@angular/material/dialog";
import { MatSnackBar } from "@angular/material/snack-bar";
import { MatTableDataSource } from "@angular/material/table";
import { TranslateService } from "@ngx-translate/core";
import { DateTime } from "luxon";
import { CampaignControllerService } from "src/app/core/api/generated/controllers/campaignController.service";
import { CampaignReward } from "src/app/core/api/generated/model/campaignReward";
import { CampaignWeekConf } from "src/app/core/api/generated/model/campaignWeekConf";
import { CampaignClass } from "src/app/shared/classes/campaing-class";
import { SnackbarSavedComponent } from "src/app/shared/components/snackbar-saved/snackbar-saved.component";

@Component({
  selector: "app-rewards",
  templateUrl: "./rewards.component.html",
  styleUrls: ["./rewards.component.scss"],
})

export class RewardsComponent implements OnInit {
  selectedLang: string = "it";
  campaign: CampaignClass;
  dataSource: MatTableDataSource<any>;
  displayedColumns: string[] = ["index-dates"];
  newItem: any;
  msgError: string;
  validatingForm: FormGroup;
  weekCsv: any;
  rewardCsv: any;
  territorySelected: any;
  i: any;
  l = 1;
  viewEditPeriod: boolean = false;
  viewEditRewards: boolean = false;
  viewNewPeriod: boolean = true;
  viewNewReward: boolean = false;
  viewFinalRewards: boolean = false;
  viewLoadCSV: boolean = false;
  dateFrom: string;
  dateTo: string;
  rewardDesc: string;
  nickname: string;
  sponsorName: string;
  sponsorDesc: string;
  sponsorWebsite: string;
  rewardNote: string;
  finalRewardsNote: string;
  periodNote: string;
  weekNumberTmp: number;
  indiceTmp: number;

  constructor(
    public dialogRef: MatDialogRef<RewardsComponent>,
    private formBuilder: FormBuilder,
    private translate: TranslateService,
    private campaignService: CampaignControllerService,
    private _snackBar: MatSnackBar
  ) {}

  ngOnInit(): void {
    this.validatingForm = this.formBuilder.group({
      weeks: new FormControl("", [Validators.required]),
      rewards: new FormControl("", [Validators.required]),
    });
    this.validatingForm.patchValue({
      defaultSurvey: "-",
    });
    this.campaignService
      .getCampaignUsingGET(this.campaign.campaignId)
      .subscribe((result) => {
        this.campaign = result;
        this.setTableData();
      });
  }

  onNoClick(event: any): void {
    this.dialogRef.close();
  }

  addRewards() {
    this.msgError = undefined;
    if (this.validatingForm.valid) {
      const bodyWeek = new FormData();
      bodyWeek.append("data", this.weekCsv);
      const bodyRew = new FormData();
      bodyRew.append("data", this.rewardCsv);
      this.campaignService
        .uploadWeekConfsUsingPOST({
          campaignId: this.campaign.campaignId,
          body: bodyWeek,
        })
        .subscribe(
          (resWeek) => {
            const resErrorCheck = this.noErrorIn(resWeek); 
            if (!!resErrorCheck) {
              this.msgError =
              this.translate.instant("errorWhileLoadingWeeks") +
              ": " +
              resErrorCheck;
            }else{
              this.campaignService
              .uploadRewardsUsingPOST({
                campaignId: this.campaign.campaignId,
                body: bodyRew,
              })
              .subscribe(
                (resReward) => {
                  const resErrorCheck = this.noErrorIn(resReward); 
                  if (!!resErrorCheck) {
                    this.msgError =
                    this.translate.instant("errorWhileLoadingRewards") +
                    ": " +
                    resErrorCheck;
                  }else{
                    this.campaignService
                    .getCampaignUsingGET(this.campaign.campaignId)
                    .subscribe((resCamp) => {
                      if (resCamp) {
                        this.campaign = resCamp;
                        this.setTableData();
                        const text = this.translate.instant("savedData");
                        this._snackBar.openFromComponent(
                          SnackbarSavedComponent,
                          {
                            data: { displayText: text },
                            duration: 4999,
                          }
                        );
                      }
                    });
                  }
                },
                (error) => {
                  this.msgError =
                    this.translate.instant("errorWhileLoadingRewards") +
                    ": " +
                    error.error.ex
                      ? error.error.ex
                      : "Undefined error";
                }
              );
            }
          },
          (error) => {
            this.msgError =
              this.translate.instant("errorWhileLoadingWeeks") +
              ": " +
              error.error.ex
                ? error.error.ex
                : "Undefined error";
          }
        );
    } else {
      this.msgError = this.translate.instant("fillAllfields");
      this.validatingForm.markAllAsTouched();
    }
  }

  setTableData() {
    this.dataSource = new MatTableDataSource<any>(this.campaign.weekConfs);
  }

  validDates(start: number, end: number) {
    if (start < end) {
      return true;
    }
    return false;
  }

  uploadWeeks(event: any) {
    this.weekCsv = event.target.files[0];
  }

  uploadRewards(event: any) {
    this.rewardCsv = event.target.files[0];
  }

  fromTimestampToDate(timestamp: any): string {
    if (timestamp === 0) {
      return "-";
    }
    const a = new Date(timestamp);
    var months = [
      "Jan",
      "Feb",
      "Mar",
      "Apr",
      "May",
      "Jun",
      "Jul",
      "Aug",
      "Sep",
      "Oct",
      "Nov",
      "Dec",
    ];
    var year = a.getFullYear();
    var month = a.getMonth() + 1;
    var date = a.getDate();
    var hour = a.getHours();
    var min = a.getMinutes();
    var sec = a.getSeconds();
    var time = date + "/" + month + "/" + year;
    return time;
  }

  download(type: string) {
    const link = document.createElement("a");
    link.setAttribute("target", "_blank");
    const fileName = "../../../../assets/files/" + type + ".csv";
    link.setAttribute("href", fileName);
    if (type === "rewDownload") {
      link.setAttribute(
        "download",
        this.translate.instant("rewards_example.csv")
      );
    } else {
      link.setAttribute(
        "download",
        this.translate.instant("weeks_example.csv")
      );
    }
    document.body.appendChild(link);
    link.click();
    link.remove();
  }

  noErrorIn(list: string[]):boolean{
    var res = undefined;
    for(let item of list){
      if (this.parseError(item)) {
        res = item;
        break;
      }
    };
    return res;
  }

  parseError(item: string): boolean {
    return item.includes('error');
  }

  checkWeek0() {
    return this.campaign?.weekConfs?.some(week => week.weekNumber===0);
  }

  checkSponsor(sponsorName: string, sponsorDesc: string, sponsorWebsite: string) {
    if (!(sponsorName === undefined) && (sponsorName.length > 0)) {
      return true;
    }
    if (!(sponsorDesc === undefined) && (sponsorDesc.length > 0)) {
      return true;
    }
    if (!(sponsorWebsite === undefined) && (sponsorWebsite.length > 0)) {
      return true;
    }
    return false;
  }

  goFinalRewards() {
    this.clearValue();
    this.viewFinalRewards = true;
    this.viewEditPeriod=false;
    this.viewEditRewards=false;
    this.viewNewPeriod=false;
    this.viewNewReward=false;
  }

  goEditPeriod(oggetto, weekNumber) {
    this.viewEditPeriod=true;
    this.viewEditRewards=false;
    this.viewNewPeriod=false;
    this.viewNewReward=false;
    this.viewFinalRewards = false;
    this.dateFrom = this.createDate(oggetto.dateFrom);
    this.dateTo = this.createDate(oggetto.dateTo);
    this.periodNote = oggetto.desc[this.selectedLang];
    this.weekNumberTmp = weekNumber;
  }

  saveEditPeriod() {
    if (this.checkWeek0()) {
      this.campaign.weekConfs[this.weekNumberTmp].dateFrom = this.fromDateTimeToLong(this.dateFrom);
      this.campaign.weekConfs[this.weekNumberTmp].dateTo = this.fromDateTimeToLong(this.dateTo);
      this.campaign.weekConfs[this.weekNumberTmp].desc[this.selectedLang] = this.periodNote;
    } else {
      this.campaign.weekConfs[this.weekNumberTmp - 1].dateFrom = this.fromDateTimeToLong(this.dateFrom);
      this.campaign.weekConfs[this.weekNumberTmp - 1].dateTo = this.fromDateTimeToLong(this.dateTo);
      this.campaign.weekConfs[this.weekNumberTmp - 1].desc[this.selectedLang] = this.periodNote;
    }
  }

  goEditReward(oggetto, weekNumber, indice) {
    this.viewEditPeriod=false;
    this.viewEditRewards=true;
    this.viewNewPeriod=false;
    this.viewNewReward=false;
    this.viewFinalRewards = false;
    this.rewardDesc = oggetto.desc[this.selectedLang];
    this.nickname = oggetto.winner;
    this.sponsorName = oggetto.sponsor;
    this.sponsorDesc = oggetto.sponsorDesc[this.selectedLang];
    this.sponsorWebsite = oggetto.sponsorWebsite;
    this.rewardNote = oggetto.rewardNote[this.selectedLang];
    this.indiceTmp = indice;
    this.weekNumberTmp = weekNumber;
  }

  saveEditReward() {
    if (this.checkWeek0()) {
      this.campaign.weekConfs[this.weekNumberTmp].rewards[this.indiceTmp].desc[this.selectedLang] = this.rewardDesc;
      this.campaign.weekConfs[this.weekNumberTmp].rewards[this.indiceTmp].winner = this.nickname;
      this.campaign.weekConfs[this.weekNumberTmp].rewards[this.indiceTmp].sponsor = this.sponsorName;
      this.campaign.weekConfs[this.weekNumberTmp].rewards[this.indiceTmp].sponsorDesc[this.selectedLang] = this.sponsorDesc;
      this.campaign.weekConfs[this.weekNumberTmp].rewards[this.indiceTmp].sponsorWebsite = this.sponsorWebsite;
      this.campaign.weekConfs[this.weekNumberTmp].rewards[this.indiceTmp].rewardNote[this.selectedLang] = this.rewardNote;
    } else {
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards[this.indiceTmp].desc[this.selectedLang] = this.rewardDesc;
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards[this.indiceTmp].winner = this.nickname;
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards[this.indiceTmp].sponsor = this.sponsorName;
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards[this.indiceTmp].sponsorDesc[this.selectedLang] = this.sponsorDesc;
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards[this.indiceTmp].sponsorWebsite = this.sponsorWebsite;
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards[this.indiceTmp].rewardNote[this.selectedLang] = this.rewardNote;
    }
  }

  deleteReward() {
    if (this.checkWeek0()) {
      this.campaign.weekConfs[this.weekNumberTmp].rewards.splice(this.indiceTmp, 1);
    } else {
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards.splice(this.indiceTmp, 1);
    }
  }

  deletePeriod() {
    if (this.checkWeek0()) {
      this.campaign.weekConfs.splice(this.weekNumberTmp, 1);
    } else {
      this.campaign.weekConfs.splice(this.weekNumberTmp - 1, 1);
    }
    this.reloadAllWeeks();
    this.ripristinaOrdinamentoPeriodi();
  }

  deleteFinalRewards() {
    this.campaign.weekConfs.splice(0, 1);
    this.reloadAllWeeks();
  }

  ripristinaOrdinamentoPeriodi() {
    for (var i = 0; i <= this.campaign.weekConfs.length; i++) {
      if (this.checkWeek0()) {
        this.campaign.weekConfs[i].weekNumber = i;
      } else {
        this.campaign.weekConfs[i].weekNumber = i + 1;
      }
    }
  }









  goNewPeriod() {
    this.clearValue();
    this.viewEditPeriod=false;
    this.viewEditRewards=false;
    this.viewNewPeriod=true;
    this.viewNewReward=false;
    this.viewFinalRewards = false;
  }

  goNewReward(weekNumber) {
    this.clearValue();
    this.viewEditPeriod=false;
    this.viewEditRewards=false;
    this.viewNewPeriod=false;
    this.viewNewReward=true;
    this.viewFinalRewards = false;
    this.weekNumberTmp = weekNumber;
  }

  addReward() {
    var newReward: CampaignReward = { desc: {[this.selectedLang]: this.rewardDesc}, position: this.campaign.weekConfs[this.weekNumberTmp].rewards.length, rewardNote: {[this.selectedLang]: this.rewardNote}, sponsorDesc: {[this.selectedLang]: this.sponsorDesc}, sponsor: this.sponsorName, sponsorWebsite: this.sponsorWebsite, winner: this.nickname };
    if (this.checkWeek0()) {
      this.campaign.weekConfs[this.weekNumberTmp].rewards.push(newReward);
    } else {
      this.campaign.weekConfs[this.weekNumberTmp - 1].rewards.push(newReward);
    }
  }

  addPeriod() {
    var newVoidRewardsArray: Array<CampaignReward> = [];
    var newPeriod: CampaignWeekConf = { campaignId: this.campaign.campaignId, dateFrom: this.fromDateTimeToLong(this.dateFrom), dateTo: this.fromDateTimeToLong(this.dateTo), rewards: newVoidRewardsArray, weekNumber: this.campaign.weekConfs.length };
    this.campaign.weekConfs.push(newPeriod);
    this.reloadAllWeeks();
  }

  addFinalRewards() {
    var newVoidRewardsArray: Array<CampaignReward> = [];
    var newFinalRewards: CampaignWeekConf = { campaignId: this.campaign.campaignId, dateFrom: this.campaign.dateFrom, dateTo: this.campaign.dateTo, rewards: newVoidRewardsArray, weekNumber: 0 };
    this.campaign.weekConfs.unshift(newFinalRewards);
    this.reloadAllWeeks();
  }











  switchLoadCSV() {
    this.viewLoadCSV = !this.viewLoadCSV;
  }

  fromDateTimeToLong(dateString: string): number {
    if (dateString.length === "yyyy-mm-ddThh:mm:ss".length) {
      const newDate = DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm:ss", {
      });
      return newDate.toMillis();
    } else {
      const newDate = DateTime.fromFormat(dateString, "yyyy-MM-dd'T'HH:mm", {
      });
      return newDate.toMillis();
    }
  }

  createDate(timestamp: number): string {
    const date = DateTime.fromMillis(timestamp);
    return date.toFormat("yyyy-MM-dd'T'HH:mm:ss");
  }

  selezionaLinguaItaliana() {
    this.selectedLang = "it";
  }

  selezionaLinguaInglese() {
    this.selectedLang = "en";
  }

  reloadAllWeeks() {
    this.dataSource = new MatTableDataSource<any>(this.campaign.weekConfs);
  }

  clearValue() {
    this.rewardDesc = undefined;
    this.nickname = undefined;
    this.sponsorName = undefined;
    this.sponsorDesc = undefined;
    this.sponsorWebsite = undefined;
    this.rewardNote = undefined;
    this.periodNote = undefined;
    this.finalRewardsNote = undefined;
    this.dateFrom = undefined;
    this.dateTo = undefined;
  }

  clearNickname() {
    this.nickname = undefined;
  }
}